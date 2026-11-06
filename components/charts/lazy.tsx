"use client";

import { useRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useInView } from "motion/react";

/**
 * Reserva el alto del gráfico para que su carga no desplace el contenido (CLS) y solo monta el
 * gráfico —y, con él, descarga Recharts— cuando está por entrar en pantalla (SPEC 5.2 y 9).
 */
export function InViewMount({ height, children }: { height: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true, margin: "300px 0px" });
  return (
    <div ref={ref} style={{ minHeight: height }}>
      {visto ? children : <Reserva height={height} />}
    </div>
  );
}

export function Reserva({ height }: { height: number }) {
  return <div aria-hidden="true" className="rounded-2xl bg-mist" style={{ height }} />;
}

const MrrChartDinamico = dynamic(() => import("@/components/charts/mrr-chart"), {
  ssr: false,
  loading: () => <Reserva height={560} />,
});
const CashflowChartDinamico = dynamic(() => import("@/components/charts/cashflow-chart"), {
  ssr: false,
  loading: () => <Reserva height={400} />,
});

export function MrrChartLazy() {
  return (
    <InViewMount height={560}>
      <MrrChartDinamico />
    </InViewMount>
  );
}

export function CashflowChartLazy() {
  return (
    <InViewMount height={400}>
      <CashflowChartDinamico />
    </InViewMount>
  );
}
