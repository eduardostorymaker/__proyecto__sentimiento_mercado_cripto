"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion/react";
import { dur, ease, prefersReducedMotion } from "@/lib/motion";
import { formatNum, formatPct, formatUSD } from "@/lib/format";

export interface CountUpProps {
  value: number;
  /** `usd` → `US$ 18 084` · `pct` → `65,1 %` · `num` → `1 445`. */
  kind?: "num" | "usd" | "pct";
  /** Decimales fijos; si se omite se usan los del propio `value`. */
  decimals?: number;
  signed?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const decimalsOf = (n: number) => (Number.isInteger(n) ? 0 : (String(n).split(".")[1]?.length ?? 0));

/**
 * Cifra que cuenta de 0 al valor en 1,2 s (SPEC 5.2), una sola vez al entrar en pantalla. Solo para
 * los KPI del hero, `#mercado` y `#caso-binance`; NO en `#costos`.
 *
 * Recibe datos serializables (`kind`, `decimals`…) y no una función de formato: un componente de
 * servidor no puede pasar funciones a uno de cliente. El HTML del servidor ya trae el valor final,
 * con el mismo formato que el conteo, así que sin JavaScript o con movimiento reducido se ve igual.
 */
export function CountUp({
  value,
  kind = "num",
  decimals,
  signed = false,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const places = decimals ?? decimalsOf(value);

  const format = (n: number) => {
    const opts = { decimals: places, signed };
    const body = kind === "usd" ? formatUSD(n, opts) : kind === "pct" ? formatPct(n, opts) : formatNum(n, opts);
    return prefix + body + suffix;
  };

  useEffect(() => {
    const el = ref.current;
    const text = el?.firstChild;
    if (!el || !text || prefersReducedMotion()) return;

    const setText = (n: number) => {
      text.textContent = format(n);
    };
    setText(0);

    let controls: { stop: () => void } | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        controls = animate(0, value, {
          duration: dur.reveal * 2, // 1,2 s
          ease: ease.out,
          onUpdate: setText,
          onComplete: () => setText(value),
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      controls?.stop();
      setText(value);
    };
    // `format` solo depende de las props listadas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, kind, places, signed, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
