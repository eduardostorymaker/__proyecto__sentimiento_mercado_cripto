import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { textoSobre } from "@/lib/chart-colors";
import { formatNum, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface Parte {
  clave: string;
  nombre: string;
  valor: number;
  color: string;
  /** Etiqueta corta dentro del bloque cuando cabe (p. ej. «ES»). */
  corto?: string;
}

/** Un bloque imprime su etiqueta solo si ocupa al menos este porcentaje del total. */
const MIN_PARA_ETIQUETA = 15;

/**
 * Barra segmentada alta de UNA fila: partes proporcionales a su valor, 28 px de alto, 2 px de
 * separación y esquinas de 4 px (misma forma que `MvpBar`). Cada bloque es enfocable y da nombre,
 * cantidad y porcentaje por hover, foco y lector de pantalla. Sin `padding` en el bloque: fijaría un
 * ancho mínimo y desproporcionaría la barra (el texto va en un `span` interior).
 */
export function BarraSegmentada({
  fila,
  partes,
  unidad = "documentos",
  className,
}: {
  fila: string;
  partes: readonly Parte[];
  /** Cómo se llama lo que se cuenta, para el tooltip («documentos»); `null` si los valores ya son %. */
  unidad?: string | null;
  className?: string;
}) {
  const total = partes.reduce((suma, p) => suma + p.valor, 0);
  const resumen = partes.map((p) => `${p.nombre} ${formatPct((100 * p.valor) / total, { decimals: 0 })}`).join(", ");

  return (
    <div role="group" aria-label={`${fila}: ${resumen}`} className={cn("flex h-7 gap-0.5", className)}>
      {partes.map((p) => {
        const share = (100 * p.valor) / total;
        const pct = formatPct(share, { decimals: 0 });
        const ancho = share >= MIN_PARA_ETIQUETA;
        return (
          <Tooltip key={p.clave}>
            <TooltipTrigger asChild>
              <div
                tabIndex={0}
                role="img"
                aria-label={`${fila}, ${p.nombre}: ${unidad ? `${formatNum(p.valor)} ${unidad}, ` : ""}${pct}`}
                style={{ flexGrow: p.valor, flexBasis: 0, backgroundColor: p.color, color: textoSobre(p.color) }}
                className="flex min-w-0 items-center overflow-hidden rounded-[4px] text-xs font-semibold transition-[filter] duration-150 hover:brightness-110 focus-visible:brightness-110"
              >
                {ancho && <span className="truncate px-2.5">{p.corto ? `${p.corto} ${pct}` : pct}</span>}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <span className="font-semibold">{unidad ? `${formatNum(p.valor)} ${unidad}` : pct}</span>
              <span className="opacity-80">
                {" · "}
                {unidad ? `${pct} · ` : ""}
                {p.nombre}
              </span>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
