import type { TipoDap } from "@/data/dap";
import { tiposDap } from "@/data/dap";
import { cn } from "@/lib/utils";

/**
 * Símbolos del diagrama de análisis del proceso (DAP), dibujados como SVG: ○ operación, ⇨ transporte,
 * □ inspección, D demora, ▽ almacenamiento. Como texto cambiarían de ancho según la fuente del
 * sistema (no vienen en las fuentes de la página). Llevan nombre accesible: el símbolo nunca es el
 * único portador del tipo.
 */
const FORMAS: Record<TipoDap, React.ReactNode> = {
  operacion: <circle cx="12" cy="12" r="8" />,
  transporte: <path d="M3 12h14M12.5 6.5 18 12l-5.5 5.5" />,
  inspeccion: <rect x="4.5" y="4.5" width="15" height="15" rx="1" />,
  demora: <path d="M6.5 5h5a7 7 0 0 1 0 14h-5z" />,
  almacenamiento: <path d="M4.5 6h15L12 19.5z" />,
};

export function DapSimbolo({ tipo, className }: { tipo: TipoDap; className?: string }) {
  return (
    <svg
      role="img"
      aria-label={tiposDap[tipo].nombre}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-5 shrink-0", className)}
    >
      {FORMAS[tipo]}
    </svg>
  );
}
