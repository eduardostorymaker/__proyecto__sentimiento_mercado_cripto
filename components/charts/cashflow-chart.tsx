"use client";

import { Area, AreaChart, CartesianGrid, ReferenceDot, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard, ChartShell, TooltipBox } from "@/components/charts/chart-shell";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { flujoAcumulado, indicadores } from "@/data/costos";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { serie } from "@/lib/chart-colors";
import { ejeMiles, mesLargo } from "@/lib/chart-format";
import { formatUSD } from "@/lib/format";

interface Punto {
  mes: number;
  acumulado: number;
}

const datos: Punto[] = flujoAcumulado.map((acumulado, mes) => ({ mes, acumulado }));

/** El mínimo del acumulado es la necesidad máxima de capital. */
const MINIMO = datos.reduce((a, b) => (b.acumulado < a.acumulado ? b : a));
const FINAL = datos[datos.length - 1];

const config = { acumulado: { label: "Flujo acumulado", color: serie.acumulado } } satisfies ChartConfig;

interface TipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: Punto }>;
}

function Tip({ active, payload }: TipProps) {
  const d = active ? payload?.[0]?.payload : undefined;
  if (!d) return null;
  return (
    <TooltipBox>
      <p className="mb-1.5 text-muted-foreground">{d.mes === 0 ? "Inversión inicial (MVP)" : `Mes ${d.mes} · ${mesLargo(d.mes)}`}</p>
      <p className="flex items-center gap-2">
        <span aria-hidden="true" className="h-0.5 w-3 rounded-full" style={{ backgroundColor: serie.acumulado }} />
        <span className="font-mono font-semibold tabular-nums">{formatUSD(d.acumulado)}</span>
        <span className="text-muted-foreground">acumulado</span>
      </p>
    </TooltipBox>
  );
}

/**
 * Flujo de caja acumulado (SPEC 7.12). El acumulado NUNCA supera cero en los 36 meses, así que el
 * eje llega solo hasta 0 y no hay relleno teal. Marcas: el mínimo, el primer mes de equilibrio
 * mensual (22), el mes desde el que el flujo es positivo de forma sostenida (27) y el cierre.
 */
export default function CashflowChart() {
  const animar = useMotionOk();
  const etiqueta = { fill: "var(--foreground)", fontSize: 11, fontWeight: 600 } as const;

  return (
    <ChartCard>
      <ChartShell
        label={`Flujo de caja acumulado por mes. Parte de ${formatUSD(datos[0].acumulado)} de inversión inicial, llega a un mínimo de ${formatUSD(MINIMO.acumulado)} en el mes ${MINIMO.mes}, el flujo mensual se vuelve positivo en el mes ${indicadores.equilibrioMes} y el mes ${FINAL.mes} cierra en ${formatUSD(FINAL.acumulado)}, sin llegar nunca a cero.`}
        table={
          <table>
            <caption>Flujo de caja acumulado, mes 0 (inversión inicial) a mes 36</caption>
            <thead>
              <tr>
                <th scope="col">Mes</th>
                <th scope="col">Flujo acumulado (US$)</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((d) => (
                <tr key={d.mes}>
                  <th scope="row">{d.mes === 0 ? "Inversión inicial" : mesLargo(d.mes)}</th>
                  <td>{formatUSD(d.acumulado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      >
        <ul className="mb-3 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-ink/80">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3.5 w-px bg-muted-foreground/60" />
            Mes {indicadores.equilibrioMes} ({mesLargo(indicadores.equilibrioMes)}): primer mes de equilibrio operativo
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3.5 w-px bg-muted-foreground/60" />
            Mes {indicadores.flujoSostenidoMes} ({mesLargo(indicadores.flujoSostenidoMes)}): flujo positivo sostenido
          </li>
        </ul>
        <ChartContainer config={config} className="aspect-auto h-72 w-full">
          <AreaChart data={datos} margin={{ top: 12, right: 16, bottom: 20, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              type="number"
              dataKey="mes"
              domain={[0, 36]}
              ticks={[0, 6, 12, 18, 24, 30, 36]}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              tickMargin={8}
              label={{ value: "Mes (0 = inversión en el MVP)", position: "insideBottom", offset: -16, fill: "var(--muted-foreground)", fontSize: 11 }}
              height={52}
            />
            <YAxis
              width={64}
              domain={[-160000, 0]}
              ticks={[0, -40000, -80000, -120000, -160000]}
              tickFormatter={ejeMiles}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<Tip />} cursor={{ stroke: "var(--border)" }} />

            {/* Líneas de referencia sólidas y finas. Etiqueta corta, una a cada lado de su línea y arriba,
                donde la curva no llega: así no se cruzan ni se salen del gráfico en pantallas angostas.
                La leyenda de arriba explica qué marca cada una. */}
            <ReferenceLine
              x={indicadores.equilibrioMes}
              stroke="var(--muted-foreground)"
              strokeOpacity={0.5}
              label={{ value: `Mes ${indicadores.equilibrioMes}`, position: "insideTopRight", ...etiqueta }}
            />
            <ReferenceLine
              x={indicadores.flujoSostenidoMes}
              stroke="var(--muted-foreground)"
              strokeOpacity={0.5}
              label={{ value: `Mes ${indicadores.flujoSostenidoMes}`, position: "insideTopLeft", ...etiqueta }}
            />

            <Area
              dataKey="acumulado"
              type="monotone"
              baseValue={0}
              stroke={serie.acumulado}
              strokeWidth={2}
              strokeLinecap="round"
              fill={serie.acumulado}
              fillOpacity={0.1}
              dot={false}
              activeDot={{ r: 4, stroke: "#ffffff", strokeWidth: 2, fill: serie.acumulado }}
              isAnimationActive={animar}
              animationDuration={900}
              animationEasing="ease-out"
            />

            <ReferenceDot
              x={MINIMO.mes}
              y={MINIMO.acumulado}
              r={4}
              fill={serie.acumulado}
              stroke="#ffffff"
              strokeWidth={2}
              label={{ value: `Mínimo ${formatUSD(MINIMO.acumulado)} (mes ${MINIMO.mes})`, position: "bottom", ...etiqueta }}
            />
            <ReferenceDot
              x={FINAL.mes}
              y={FINAL.acumulado}
              r={4}
              fill={serie.acumulado}
              stroke="#ffffff"
              strokeWidth={2}
              label={{ value: formatUSD(FINAL.acumulado), position: "left", ...etiqueta }}
            />
          </AreaChart>
        </ChartContainer>
      </ChartShell>
    </ChartCard>
  );
}
