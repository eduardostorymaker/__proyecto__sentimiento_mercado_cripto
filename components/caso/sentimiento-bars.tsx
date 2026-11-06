import { BarraSegmentada } from "@/components/caso/barra-segmentada";
import { ChartShell } from "@/components/charts/chart-shell";
import { Reveal } from "@/components/common/reveal";
import type { CasoData, Fuente } from "@/lib/caso";
import { fuente, nombreFuente, sentimiento } from "@/lib/chart-colors";
import { formatPct } from "@/lib/format";

const FUENTES: readonly Fuente[] = ["google_news", "youtube"];
const CLASES = ["negativo", "neutral", "positivo"] as const;
const NOMBRE = { negativo: "Negativo", neutral: "Neutral", positivo: "Positivo" } as const;

/**
 * Sentimiento léxico por fuente (SPEC 7.15-F), barras al 100 % con la escala divergente de la marca:
 * negativo coral, neutral gris, positivo teal. Los valores ya son porcentajes (`sentimiento_lexico_pct`).
 * Es una lectura PRELIMINAR con léxico, no el desempeño del modelo.
 */
export function SentimientoBars({ caso }: { caso: CasoData }) {
  return (
    <Reveal>
      <ChartShell
        label={`Sentimiento léxico preliminar por fuente. ${FUENTES.map(
          (f) => `${nombreFuente[f]}: ${CLASES.map((c) => `${formatPct(caso.sentimiento_lexico_pct[f][c], { decimals: 0 })} ${NOMBRE[c].toLowerCase()}`).join(", ")}`,
        ).join("; ")}.`}
        table={
          <table>
            <caption>Sentimiento léxico preliminar por fuente (%)</caption>
            <thead>
              <tr>
                <th scope="col">Fuente</th>
                {CLASES.map((c) => (
                  <th key={c} scope="col">
                    {NOMBRE[c]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FUENTES.map((f) => (
                <tr key={f}>
                  <th scope="row">{nombreFuente[f]}</th>
                  {CLASES.map((c) => (
                    <td key={c}>{formatPct(caso.sentimiento_lexico_pct[f][c], { decimals: 1 })}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          {FUENTES.map((f) => (
            <div key={f} className="grid grid-cols-1 items-center gap-1.5 sm:grid-cols-[6.5rem_1fr] sm:gap-3">
              <p className="flex items-center gap-2 text-sm font-medium text-ink/80">
                <span aria-hidden="true" className="size-3 rounded-[3px]" style={{ backgroundColor: fuente[f] }} />
                {nombreFuente[f]}
              </p>
              <BarraSegmentada
                fila={nombreFuente[f]}
                unidad={null}
                partes={CLASES.map((c) => ({ clave: c, nombre: NOMBRE[c], valor: caso.sentimiento_lexico_pct[f][c], color: sentimiento[c] }))}
              />
            </div>
          ))}
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink/80">
          {CLASES.map((c) => (
            <li key={c} className="flex items-center gap-2">
              <span aria-hidden="true" className="size-3 rounded-[3px]" style={{ backgroundColor: sentimiento[c] }} />
              {NOMBRE[c]}
            </li>
          ))}
        </ul>
      </ChartShell>
    </Reveal>
  );
}
