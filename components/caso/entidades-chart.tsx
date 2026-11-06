import { ChartShell } from "@/components/charts/chart-shell";
import { Reveal } from "@/components/common/reveal";
import { RichText } from "@/components/common/rich-text";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { entidadesTexto } from "@/data/caso";
import type { CasoData, Fuente } from "@/lib/caso";
import { fillCaso } from "@/lib/caso-util";
import { fuente, nombreFuente } from "@/lib/chart-colors";
import { formatPct } from "@/lib/format";

// Claves de `entidades_pct` (el notebook las nombra con el tipo de documento).
const CLAVE: Record<Fuente, string> = { google_news: "Google News RSS (titulares)", youtube: "YouTube (comentarios)" };
const FUENTES: readonly Fuente[] = ["google_news", "youtube"];

/**
 * Entidades mencionadas por fuente (SPEC 7.15-E): barras agrupadas, una por fuente, sobre una escala
 * común de 0 a 100 %. Solo Binance lleva el valor escrito (es la comparación que cuenta la historia:
 * 97 % de los titulares frente a 11 % de los comentarios); el resto, en tooltip y en la tabla gemela.
 */
export function EntidadesChart({ caso }: { caso: CasoData }) {
  for (const f of FUENTES) {
    if (!caso.entidades_pct[CLAVE[f]]) throw new Error(`EntidadesChart: falta «${CLAVE[f]}» en entidades_pct`);
  }
  const entidades = Object.keys(caso.entidades_pct[CLAVE.google_news]).sort(
    (a, b) => caso.entidades_pct[CLAVE.google_news][b] - caso.entidades_pct[CLAVE.google_news][a],
  );

  return (
    <Reveal>
      <ChartShell
        label={`Entidades mencionadas por fuente. ${fillCaso(entidadesTexto.nota, caso)}`}
        table={
          <table>
            <caption>Porcentaje de documentos que mencionan cada entidad, por fuente</caption>
            <thead>
              <tr>
                <th scope="col">Entidad</th>
                {FUENTES.map((f) => (
                  <th key={f} scope="col">
                    {nombreFuente[f]} (%)
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entidades.map((e) => (
                <tr key={e}>
                  <th scope="row">{e}</th>
                  {FUENTES.map((f) => (
                    <td key={f}>{formatPct(caso.entidades_pct[CLAVE[f]][e], { decimals: 1 })}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        }
      >
        <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink/80">
          {FUENTES.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span aria-hidden="true" className="size-3 rounded-[3px]" style={{ backgroundColor: fuente[f] }} />
              {nombreFuente[f]}
            </li>
          ))}
        </ul>
        <ul className="grid grid-cols-1 gap-3">
          {entidades.map((e, i) => (
            <li key={e} className="grid grid-cols-1 gap-1 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-3">
              <span className="text-sm text-ink/80">{e}</span>
              <div className="grid grid-cols-1 gap-0.5">
                {FUENTES.map((f) => {
                  const v = caso.entidades_pct[CLAVE[f]][e];
                  return (
                    <div key={f} className="flex h-2.5 items-center gap-2">
                      {/* La pista mide lo mismo en todas las filas (la columna del valor se reserva siempre), así el % es proporcional. */}
                      <div className="h-full min-w-0 flex-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              tabIndex={0}
                              role="img"
                              aria-label={`${e}, ${nombreFuente[f]}: ${formatPct(v, { decimals: 1 })}`}
                              style={{ width: `${v}%`, backgroundColor: fuente[f] }}
                              className="h-full min-w-0.5 rounded-r-[4px] transition-[filter] duration-150 hover:brightness-110 focus-visible:brightness-110"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <span className="font-semibold">{formatPct(v, { decimals: 1 })}</span>
                            <span className="opacity-80">
                              {" · "}
                              {nombreFuente[f]}
                              {" · "}
                              {e}
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="w-10 shrink-0 font-mono text-xs font-semibold text-ink tabular-nums">{i === 0 ? formatPct(v, { decimals: 0 }) : null}</span>
                    </div>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">Escala de 0 a 100 % de los documentos de cada fuente.</p>
      </ChartShell>
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink/80">
        <RichText>{fillCaso(entidadesTexto.nota, caso)}</RichText>
      </p>
    </Reveal>
  );
}
