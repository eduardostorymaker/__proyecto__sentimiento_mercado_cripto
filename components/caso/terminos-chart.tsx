import { ChartShell } from "@/components/charts/chart-shell";
import { Reveal } from "@/components/common/reveal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { terminosTexto } from "@/data/caso";
import type { CasoData, Fuente } from "@/lib/caso";
import { fuente, neutro, nombreFuente } from "@/lib/chart-colors";
import { formatNum } from "@/lib/format";

/** Mensaje promocional que aparece entre los términos frecuentes de YouTube (informe 4.3.5). */
export const TERMINO_SPAM = "spcx90k";

/**
 * Términos más frecuentes de una fuente (SPEC 7.15-E): barras horizontales con el conteo de documentos
 * en la punta (una serie, un color: el de su fuente). `spcx90k` va en gris con la aclaración de spam.
 */
export function TerminosChart({ caso, clave }: { caso: CasoData; clave: Fuente }) {
  const datos = Object.entries(caso.top_terminos[clave]).sort((a, b) => b[1] - a[1]);
  const max = datos[0][1];
  const nombre = nombreFuente[clave];

  return (
    <Reveal>
      <ChartShell
        label={`Términos más frecuentes en ${nombre}: ${datos.slice(0, 3).map(([t, n]) => `${t} (${n})`).join(", ")}, entre otros.`}
        table={
          <table>
            <caption>Términos más frecuentes en {nombre}, por número de documentos</caption>
            <thead>
              <tr>
                <th scope="col">Término</th>
                <th scope="col">Documentos</th>
              </tr>
            </thead>
            <tbody>
              {datos.map(([termino, n]) => (
                <tr key={termino}>
                  <th scope="row">{termino}</th>
                  <td>{formatNum(n)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      >
        <ul className="grid grid-cols-1 gap-1.5">
          {datos.map(([termino, n]) => {
            const spam = termino.toLowerCase() === TERMINO_SPAM;
            const color = spam ? neutro : fuente[clave];
            return (
              <li key={termino} className="grid grid-cols-[6.5rem_1fr_2.75rem] items-center gap-3 sm:grid-cols-[8rem_1fr_3rem]">
                <span className="truncate text-right text-sm text-ink/80" title={termino}>
                  {termino}
                </span>
                <div className="h-3.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        tabIndex={0}
                        role="img"
                        aria-label={`${termino}: ${formatNum(n)} documentos${spam ? `. ${terminosTexto.spamTooltip}` : ""}`}
                        style={{ width: `${(100 * n) / max}%`, backgroundColor: color }}
                        className="h-full min-w-1 rounded-r-[4px] transition-[filter] duration-150 hover:brightness-110 focus-visible:brightness-110"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="font-semibold">{formatNum(n)} documentos</span>
                      <span className="opacity-80"> · {termino}</span>
                      {spam && <span className="block text-[0.7rem] opacity-80">{terminosTexto.spamTooltip}</span>}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="font-mono text-xs text-ink/80 tabular-nums">{formatNum(n)}</span>
              </li>
            );
          })}
        </ul>
      </ChartShell>
    </Reveal>
  );
}
