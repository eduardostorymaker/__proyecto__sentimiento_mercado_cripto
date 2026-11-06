import { BarraSegmentada } from "@/components/caso/barra-segmentada";
import { ChartShell } from "@/components/charts/chart-shell";
import { Reveal } from "@/components/common/reveal";
import { idiomaTexto } from "@/data/caso";
import type { CasoData, Fuente } from "@/lib/caso";
import { fuente, nombreFuente, tinte } from "@/lib/chart-colors";
import { formatNum, formatPct } from "@/lib/format";

const FUENTES: readonly Fuente[] = ["google_news", "youtube"];

/**
 * Idioma por fuente (SPEC 7.15-D), barras al 100 %. La fila es la fuente y su color es el de la
 * fuente en toda la sección; el idioma se distingue por TONO (español pleno, inglés más claro) y por
 * la etiqueta «ES / EN» dentro del bloque. Los datos salen de `idioma` (conteos del curado).
 */
export function IdiomaChart({ caso }: { caso: CasoData }) {
  return (
    <Reveal>
      <ChartShell
        label={`Idioma por fuente. ${FUENTES.map((f) => {
          const { es, en } = caso.idioma[f];
          return `${nombreFuente[f]}: ${formatPct((100 * es) / (es + en), { decimals: 0 })} en español y ${formatPct((100 * en) / (es + en), { decimals: 0 })} en inglés`;
        }).join("; ")}.`}
        table={
          <table>
            <caption>Documentos por idioma y fuente (corpus curado)</caption>
            <thead>
              <tr>
                <th scope="col">Fuente</th>
                <th scope="col">Español</th>
                <th scope="col">Inglés</th>
              </tr>
            </thead>
            <tbody>
              {FUENTES.map((f) => (
                <tr key={f}>
                  <th scope="row">{nombreFuente[f]}</th>
                  <td>{formatNum(caso.idioma[f].es)}</td>
                  <td>{formatNum(caso.idioma[f].en)}</td>
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
                partes={[
                  { clave: "es", nombre: "Español", valor: caso.idioma[f].es, color: fuente[f], corto: "ES" },
                  { clave: "en", nombre: "Inglés", valor: caso.idioma[f].en, color: tinte(fuente[f], 0.5), corto: "EN" },
                ]}
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Español: tono pleno de la fuente · Inglés: tono claro.</p>
      </ChartShell>
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink/80">{idiomaTexto.nota}</p>
    </Reveal>
  );
}
