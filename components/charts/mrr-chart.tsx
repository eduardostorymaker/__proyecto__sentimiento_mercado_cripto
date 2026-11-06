"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, ReferenceDot, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard, ChartShell, TooltipBox } from "@/components/charts/chart-shell";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { clientes, mrr } from "@/data/costos";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { anios, serie, type Anio } from "@/lib/chart-colors";
import { ejeMiles, mesCorto, mesLargo } from "@/lib/chart-format";
import { formatNum, formatUSD } from "@/lib/format";

interface Punto {
  mes: number;
  anio: Anio;
  mrr: number;
  clientes: number;
}

const datos: Punto[] = mrr.map((valor, i) => ({
  mes: i + 1,
  anio: (2027 + Math.floor(i / 12)) as Anio,
  mrr: valor,
  clientes: clientes[i],
}));

/** Cierres de año: los únicos puntos con etiqueta directa (los demás, en el tooltip y la tabla). */
const CIERRES = [12, 24, 36];
// Marcas del eje X: semestrales en escritorio; en pantallas angostas solo enero de cada año y el cierre.
const TICKS_X = [1, 7, 13, 19, 25, 31, 36];
const TICKS_X_ANGOSTO = [1, 13, 25, 36];

// Los dos paneles comparten márgenes y ancho del eje Y: así las 36 columnas quedan alineadas.
// right: 22 deja sitio a media etiqueta («dic-29») centrada bajo el último punto.
const MARGEN = { top: 22, right: 22, bottom: 0, left: 0 };
const ANCHO_Y = 56;
const config = {
  mrr: { label: "MRR", color: anios[2029] },
  clientes: { label: "Clientes de pago", color: serie.clientes },
} satisfies ChartConfig;

interface TipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: Punto }>;
}

/** Una sola lectura para ambas series en el mes apuntado: el valor manda y la etiqueta acompaña. */
function Tip({ active, payload }: TipProps) {
  const d = active ? payload?.[0]?.payload : undefined;
  if (!d) return null;
  return (
    <TooltipBox>
      <p className="mb-1.5 text-muted-foreground">
        Mes {d.mes} · {mesLargo(d.mes)}
      </p>
      <p className="flex items-center gap-2">
        <span aria-hidden="true" className="h-2.5 w-1 rounded-sm" style={{ backgroundColor: anios[d.anio] }} />
        <span className="font-mono font-semibold tabular-nums">{formatUSD(d.mrr)}</span>
        <span className="text-muted-foreground">MRR</span>
      </p>
      <p className="mt-0.5 flex items-center gap-2">
        <span aria-hidden="true" className="h-0.5 w-3 rounded-full" style={{ backgroundColor: serie.clientes }} />
        <span className="font-mono font-semibold tabular-nums">{formatNum(d.clientes)}</span>
        <span className="text-muted-foreground">clientes de pago</span>
      </p>
    </TooltipBox>
  );
}

interface EtiquetaProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  value?: number | string;
  index?: number;
}

/**
 * Valor del MRR sobre las barras de los meses 12, 24 y 36. La serie solo crece: anclando la etiqueta
 * a la derecha de su barra, el texto cae siempre sobre barras más BAJAS y espacio libre; centrada o
 * a la izquierda la taparían las barras siguientes, que son más altas.
 */
function EtiquetaCierre({ x = 0, y = 0, width = 0, value = 0, index = 0 }: EtiquetaProps) {
  const mes = index + 1;
  if (!CIERRES.includes(mes)) return null;
  return (
    <text x={Number(x) + Number(width)} y={Number(y) - 7} textAnchor="end" className="fill-foreground text-[11px] font-semibold">
      {formatUSD(Number(value))}
    </text>
  );
}

export default function MrrChart() {
  const animar = useMotionOk();
  const angosto = useMediaQuery("(max-width: 640px)");
  const animacion = { isAnimationActive: animar, animationDuration: 900, animationEasing: "ease-out" as const };
  const ultimo = datos[datos.length - 1];

  return (
    <ChartCard>
      <ChartShell
        label={`MRR mensual y clientes de pago de 2027 a 2029. El MRR crece de ${formatUSD(datos[0].mrr)} en enero de 2027 a ${formatUSD(ultimo.mrr)} en diciembre de 2029, y los clientes de pago pasan de ${datos[0].clientes} a ${ultimo.clientes}.`}
        table={
          <table>
            <caption>MRR mensual y clientes de pago, enero de 2027 a diciembre de 2029</caption>
            <thead>
              <tr>
                <th scope="col">Mes</th>
                <th scope="col">MRR (US$)</th>
                <th scope="col">Clientes de pago</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((d) => (
                <tr key={d.mes}>
                  <th scope="row">{mesLargo(d.mes)}</th>
                  <td>{formatNum(d.mrr)}</td>
                  <td>{formatNum(d.clientes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      >
        {/* Panel 1: MRR mensual, una columna por mes, coloreada por año (rampa de un solo tono). */}
        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <p className="text-sm font-semibold text-navy">MRR mensual (US$)</p>
          <ul className="flex gap-4 text-xs text-ink/80">
            {(Object.keys(anios) as unknown as Anio[]).map((anio) => (
              <li key={anio} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ backgroundColor: anios[anio] }} />
                {anio}
              </li>
            ))}
          </ul>
        </div>
        <ChartContainer config={config} className="aspect-auto h-56 w-full">
          <BarChart data={datos} margin={MARGEN} syncId="mrr" barCategoryGap={2}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="mes" hide />
            <YAxis
              width={ANCHO_Y}
              domain={[0, 40000]}
              ticks={[0, 10000, 20000, 30000, 40000]}
              tickFormatter={ejeMiles}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<Tip />} cursor={{ fill: "var(--muted)", opacity: 0.7 }} />
            <Bar dataKey="mrr" barSize={14} radius={[4, 4, 0, 0]} {...animacion}>
              {datos.map((d) => (
                <Cell key={d.mes} fill={anios[d.anio]} />
              ))}
              <LabelList dataKey="mrr" content={<EtiquetaCierre />} />
            </Bar>
          </BarChart>
        </ChartContainer>

        {/* Panel 2: clientes de pago. Otra magnitud, otro panel: nunca un segundo eje Y en el mismo plot. */}
        <div className="mt-6 mb-2 flex items-center gap-2">
          <span aria-hidden="true" className="h-0.5 w-4 rounded-full" style={{ backgroundColor: serie.clientes }} />
          <p className="text-sm font-semibold text-navy">Clientes de pago</p>
        </div>
        <ChartContainer config={config} className="aspect-auto h-40 w-full">
          <LineChart data={datos} margin={{ ...MARGEN, bottom: 4 }} syncId="mrr">
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="mes"
              ticks={angosto ? TICKS_X_ANGOSTO : TICKS_X}
              interval={0}
              tickFormatter={mesCorto}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              tickMargin={8}
              // Escala de bandas, como la de las barras del panel de arriba: así cada punto cae justo
              // bajo la columna de su mes (con la escala de puntos por defecto se descuadra hasta 14 px).
              scale="band"
            />
            <YAxis width={ANCHO_Y} domain={[0, 800]} ticks={[0, 200, 400, 600, 800]} tickLine={false} axisLine={false} />
            <Tooltip content={() => null} cursor={{ stroke: "var(--border)" }} />
            <Line
              dataKey="clientes"
              type="monotone"
              stroke={serie.clientes}
              strokeWidth={2}
              strokeLinecap="round"
              dot={false}
              activeDot={{ r: 4, stroke: "#ffffff", strokeWidth: 2, fill: serie.clientes }}
              {...animacion}
            />
            {CIERRES.map((mes) => (
              <ReferenceDot
                key={mes}
                x={mes}
                y={datos[mes - 1].clientes}
                r={4}
                fill={serie.clientes}
                stroke="#ffffff"
                strokeWidth={2}
                label={{ value: formatNum(datos[mes - 1].clientes), position: mes === 36 ? "left" : "top", fill: "var(--foreground)", fontSize: 11, fontWeight: 600 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </ChartShell>
    </ChartCard>
  );
}
