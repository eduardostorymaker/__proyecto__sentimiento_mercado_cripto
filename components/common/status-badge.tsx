import type { ReactNode } from "react";
import {
  CircleAlert,
  Minus,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusKind =
  | "oportunidad"
  | "amenaza"
  | "alto"
  | "medio"
  | "bajo"
  | "pendiente"
  // Sentimiento (titulares del caso Binance, SPEC 7.15-G)
  | "positivo"
  | "negativo"
  | "neutral";

/**
 * Color + icono + texto: el color nunca es el único portador del estado (SPEC 4.1).
 * Texto sobre el tinte: `teal-text` y `coral-text` cumplen AA hasta con tinte del 15 % sobre mist.
 * El nivel «bajo» usa teal (el verde de la marca) y «medio» usa gold, como en la matriz de riesgos.
 */
const KINDS: Record<StatusKind, { label: string; icon?: LucideIcon; className: string }> = {
  oportunidad: { label: "Oportunidad", icon: TrendingUp, className: "border-teal/40 bg-teal/10 text-teal-text" },
  amenaza: { label: "Amenaza", icon: TriangleAlert, className: "border-coral/40 bg-coral/10 text-coral-text" },
  alto: { label: "Alto", icon: ShieldAlert, className: "border-coral/40 bg-coral/10 text-coral-text" },
  medio: { label: "Medio", icon: CircleAlert, className: "border-gold bg-gold/25 text-ink" },
  bajo: { label: "Bajo", icon: ShieldCheck, className: "border-teal/40 bg-teal/10 text-teal-text" },
  positivo: { label: "Positivo", icon: TrendingUp, className: "border-teal/40 bg-teal/10 text-teal-text" },
  negativo: { label: "Negativo", icon: TrendingDown, className: "border-coral/40 bg-coral/10 text-coral-text" },
  neutral: { label: "Neutral", icon: Minus, className: "border-border bg-mist text-muted-foreground" },
  pendiente: { label: "[Por completar]", className: "border-dashed border-muted-foreground/50 bg-transparent text-muted-foreground" },
};

/** Insignia de estado. `pendiente` es el marcador visible `[Por completar]` del spec 0.3. */
export function StatusBadge({
  kind,
  children,
  className,
}: {
  kind: StatusKind;
  /** Reemplaza el texto por defecto. */
  children?: ReactNode;
  className?: string;
}) {
  const { label, icon: Icon, className: tone } = KINDS[kind];
  return (
    <Badge variant="outline" className={cn("h-6 gap-1 px-2.5", tone, className)}>
      {Icon && <Icon className="size-3.5" strokeWidth={1.75} aria-hidden="true" />}
      {children ?? label}
    </Badge>
  );
}
