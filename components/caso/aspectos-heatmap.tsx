import { Reveal } from "@/components/common/reveal";
import { textoSobre } from "@/lib/chart-colors";
import type { CasoData } from "@/lib/caso";
import { formatPct } from "@/lib/format";

const NAVY = [0x1f, 0x3a, 0x5f] as const;

/** Mezcla el navy con blanco según el valor, para elegir el texto que contraste con ESA celda. */
function fondoHex(valor: number): string {
  const a = Math.max(0, Math.min(1, valor / 100));
  return `#${NAVY.map((c) => Math.round(c * a + 255 * (1 - a)).toString(16).padStart(2, "0")).join("")}`;
}

/** «Google · despues» → «Google News · después»: el notebook nombra las columnas sin tilde. */
const rotulo = (columna: string) => columna.replace("Google", "Google News").replace("despues", "después");

/**
 * Aspectos por fuente y periodo (SPEC 7.15-E): mapa de calor en tabla. Una sola matiz (navy) cuya
 * intensidad es el porcentaje, con el valor escrito en cada celda (el color nunca es la única vía).
 * Al pasar el mouse o enfocar una celda se resalta con un anillo teal.
 */
export function AspectosHeatmap({ caso }: { caso: CasoData }) {
  const columnas = Object.keys(caso.aspectos_pct);
  const filas = Object.keys(caso.aspectos_pct[columnas[0]]);

  return (
    <Reveal>
      <div role="region" tabIndex={0} aria-label="Aspectos por fuente y periodo, porcentaje de documentos" className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full min-w-[30rem] border-separate border-spacing-1 text-sm">
          <caption className="sr-only">Porcentaje de documentos que tratan cada aspecto, por fuente y periodo</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-[1] bg-white px-3 py-2 text-left text-xs font-semibold text-navy">
                Aspecto
              </th>
              {columnas.map((c) => (
                <th key={c} scope="col" className="px-2 py-2 text-center text-xs font-semibold text-navy">
                  {rotulo(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila}>
                <th scope="row" className="sticky left-0 z-[1] bg-white px-3 py-2 text-left text-sm font-medium text-ink/80">
                  {fila}
                </th>
                {columnas.map((c) => {
                  const v = caso.aspectos_pct[c][fila];
                  const fondo = fondoHex(v);
                  return (
                    <td
                      key={c}
                      tabIndex={0}
                      style={{ backgroundColor: fondo, color: textoSobre(fondo) }}
                      className="rounded-md px-2 py-2.5 text-center font-mono text-xs tabular-nums transition-shadow duration-150 outline-none hover:ring-2 hover:ring-teal focus-visible:ring-2 focus-visible:ring-teal"
                    >
                      {formatPct(v, { decimals: 1 })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Cuanto más oscuro, mayor el porcentaje de documentos que tratan el aspecto.</p>
    </Reveal>
  );
}
