import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { ChipTooltip } from "@/components/common/chip-tooltip";
import { cn } from "@/lib/utils";

type Tone = "navy" | "teal" | "coral" | "ink";

const valueTone: Record<Tone, { light: string; dark: string }> = {
  navy: { light: "text-navy", dark: "text-white" },
  teal: { light: "text-teal-text", dark: "text-teal-soft" },
  coral: { light: "text-coral-text", dark: "text-coral-soft" },
  ink: { light: "text-ink", dark: "text-white" },
};

const valueSize = {
  sm: "text-xl md:text-2xl",
  md: "text-2xl md:text-3xl",
  lg: "text-3xl md:text-5xl",
} as const;

interface KpiProps {
  /** Texto ya formateado, o un `<CountUp />` donde el spec permite conteo. */
  value: ReactNode;
  label: ReactNode;
  /** Aclaración que se muestra en un tooltip (accesible con teclado). */
  hint?: string;
  tone?: Tone;
  size?: keyof typeof valueSize;
  /** Sobre fondo navy. */
  onDark?: boolean;
  /** Tarjeta blanca con borde (franja de KPIs del hero). */
  card?: boolean;
  className?: string;
}

/** Cifra destacada: valor en monoespaciada, etiqueta y, opcionalmente, aclaración en tooltip. */
export function Kpi({ value, label, hint, tone = "navy", size = "md", onDark = false, card = false, className }: KpiProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        card && "rounded-2xl border border-border bg-white p-5 shadow-sm",
        className,
      )}
    >
      <p
        className={cn(
          "font-mono font-semibold tabular-nums leading-none",
          valueSize[size],
          valueTone[tone][onDark ? "dark" : "light"],
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "flex items-start gap-1.5 text-sm leading-snug",
          card || !onDark ? "text-muted-foreground" : "text-mist/80",
        )}
      >
        <span>{label}</span>
        {hint && (
          <ChipTooltip
          ariaLabel="Más información"
          tip={hint}
          className="-m-1 mt-[-0.125rem] grid size-6 shrink-0 place-items-center rounded-full text-current opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100"
        >
          <Info className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </ChipTooltip>
        )}
      </p>
    </div>
  );
}
