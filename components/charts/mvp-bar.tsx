import { Reveal } from "@/components/common/reveal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { GrupoPresupuesto } from "@/data/costos";
import { categorico, neutro, textoSobre } from "@/lib/chart-colors";
import { formatPct, formatUSD } from "@/lib/format";

const FILL = { ...categorico, neutro } as const;

/** Un bloque imprime su porcentaje solo si cabe con holgura; si no, lo da el tooltip y la tabla. */
const MIN_SHARE_FOR_LABEL = 15;

/**
 * Presupuesto del MVP como barra segmentada alta (SPEC 7.12 pedía una dona; la habilidad de
 * gráficos reserva la dona y recomienda esta forma para un todo de ≤ 6 partes). 28 px de alto,
 * 2 px de separación, esquinas de 4 px, anchos proporcionales al monto. La leyenda lista solo los
 * nombres, en el orden de los bloques; los importes están en la tabla que la acompaña.
 * Cada bloque es enfocable y da nombre, monto y porcentaje por hover, foco y lector de pantalla.
 */
export function MvpBar({ grupos, total }: { grupos: readonly GrupoPresupuesto[]; total: number }) {
  const resumen = grupos
    .map((g) => `${g.nombre} ${formatUSD(g.costo)} (${formatPct((100 * g.costo) / total, { decimals: 0 })})`)
    .join("; ");

  return (
    <Reveal>
      <p className="text-sm text-muted-foreground">
        Total del MVP <span className="ml-1 font-semibold text-navy">{formatUSD(total)}</span>
      </p>

      <div role="group" aria-label={`Distribución del presupuesto del MVP: ${resumen}`} className="mt-3 flex h-7 gap-0.5">
        {grupos.map((g) => {
          const share = (100 * g.costo) / total;
          const fill = FILL[g.color];
          return (
            <Tooltip key={g.nombre}>
              <TooltipTrigger asChild>
                <div
                  tabIndex={0}
                  role="img"
                  aria-label={`${g.nombre}: ${formatUSD(g.costo)}, ${formatPct(share, { decimals: 0 })}`}
                  style={{ flexGrow: g.costo, flexBasis: 0, backgroundColor: fill, color: textoSobre(fill) }}
                  className="flex min-w-0 items-center overflow-hidden rounded-[4px] text-xs font-semibold transition-[filter] duration-150 hover:brightness-110 focus-visible:brightness-110"
                >
                  {/* Sin relleno en el bloque: un `padding` fija un ancho mínimo y desproporciona la barra. */}
                  {share >= MIN_SHARE_FOR_LABEL && <span className="truncate px-2.5">{formatPct(share, { decimals: 0 })}</span>}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <span className="font-semibold">{formatUSD(g.costo)}</span>
                <span className="opacity-80">
                  {" · "}
                  {formatPct(share, { decimals: 0 })}
                  {" · "}
                  {g.nombre}
                </span>
                {g.detalle && <span className="block text-[0.7rem] opacity-70">{g.detalle}</span>}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/80">
        {grupos.map((g) => (
          <li key={g.nombre} className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-[3px]" style={{ backgroundColor: FILL[g.color] }} />
            {g.nombre}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
