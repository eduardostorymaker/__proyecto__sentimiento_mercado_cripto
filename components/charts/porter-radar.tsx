import { ChartShell } from "@/components/charts/chart-shell";
import { Reveal } from "@/components/common/reveal";
import type { FuerzaPorter } from "@/data/porter";

const W = 520;
const H = 360;
const CX = W / 2;
const CY = 178;
const R = 118; // radio de la escala 5
const ESCALA = 5;
const NAVY = "#1F3A5F";

/** Punto del eje `i` (de 0 a n-1, empezando arriba y en sentido horario) a la distancia `r`. */
function punto(i: number, n: number, r: number) {
  const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a), cos: Math.cos(a), sin: Math.sin(a) };
}

const trazo = (puntos: { x: number; y: number }[]) => puntos.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

/**
 * Intensidad de las cinco fuerzas de Porter (SPEC 7.3): radar con escala 0-5, anillos de 1 a 5,
 * relleno navy al 25 %. Es SVG propio (sin Recharts): la forma es
 * fija, no necesita animar ejes y así el texto de las etiquetas no se escala distinto del resto.
 * Cada etiqueta lleva el nivel escrito, así que no depende de un tooltip; la tabla gemela y el acordeón
 * de al lado dan el detalle a lectores de pantalla y al teclado.
 */
export function PorterRadar({ fuerzas }: { fuerzas: readonly FuerzaPorter[] }) {
  const n = fuerzas.length;
  const anillos = Array.from({ length: ESCALA }, (_, k) => k + 1);

  return (
    <Reveal>
      <ChartShell
        label={`Intensidad de las cinco fuerzas de Porter, de 0 a ${ESCALA}: ${fuerzas.map((f) => `${f.corto} ${f.nivel}`).join(", ")}.`}
        table={
          <table>
            <caption>Intensidad de las cinco fuerzas de Porter (0 a 5)</caption>
            <thead>
              <tr>
                <th scope="col">Fuerza</th>
                <th scope="col">Nivel</th>
                <th scope="col">Intensidad</th>
              </tr>
            </thead>
            <tbody>
              {fuerzas.map((f) => (
                <tr key={f.fuerza}>
                  <th scope="row">{f.fuerza}</th>
                  <td>{f.nivelTexto}</td>
                  <td>{f.nivel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-lg" aria-hidden="true">
          {/* Anillos de la escala */}
          {anillos.map((k) => (
            <polygon
              key={k}
              points={trazo(fuerzas.map((_, i) => punto(i, n, (R * k) / ESCALA)))}
              fill="none"
              stroke="#cfd6e0"
              strokeWidth={k === ESCALA ? 1.25 : 1}
            />
          ))}
          {/* Ejes */}
          {fuerzas.map((f, i) => {
            const p = punto(i, n, R);
            return <line key={f.fuerza} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#cfd6e0" strokeWidth={1} />;
          })}
          {/* Números de la escala sobre el eje vertical */}
          {anillos.map((k) => (
            <text key={k} x={CX + 5} y={CY - (R * k) / ESCALA + 4} fontSize={10} fill="#5B6472">
              {k}
            </text>
          ))}
          {/* Área */}
          <polygon
            points={trazo(fuerzas.map((f, i) => punto(i, n, (R * f.nivel) / ESCALA)))}
            fill={NAVY}
            fillOpacity={0.25}
            stroke={NAVY}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {/* Etiquetas */}
          {fuerzas.map((f, i) => {
            const p = punto(i, n, R + 20);
            const ancla = p.cos > 0.3 ? "start" : p.cos < -0.3 ? "end" : "middle";
            // La etiqueta de arriba lleva dos líneas: se sube una línea para que no pise la escala.
            const y = p.sin < -0.5 ? p.y - 18 : p.y;
            return (
              <text key={f.fuerza} x={p.x} y={y} textAnchor={ancla} fontSize={15} fill="#0f1b2d">
                <tspan x={p.x} fontWeight={600}>
                  {f.corto}
                </tspan>
                <tspan x={p.x} dy={17} fontSize={14} fill="#5B6472">
                  {f.nivelTexto} ({f.nivel})
                </tspan>
              </text>
            );
          })}
        </svg>
      </ChartShell>
    </Reveal>
  );
}
