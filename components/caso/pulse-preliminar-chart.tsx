"use client";

import { CartesianGrid, Line, LineChart, ReferenceArea, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ChartShell, TooltipBox } from "@/components/charts/chart-shell";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { categorico, fuente, nombreFuente } from "@/lib/chart-colors";
import { formatFecha, formatNum, MINUS } from "@/lib/format";

type FuenteKey = "google_news" | "youtube";

export interface PuntoPulse {
  fecha: string;
  fuente: FuenteKey;
  score: number;
  n: number;
}

interface Fila {
  fecha: string;
  google_news?: number;
  google_news_n?: number;
  youtube?: number;
  youtube_n?: number;
}

const config = {
  google_news: { label: nombreFuente.google_news, color: fuente.google_news },
  youtube: { label: nombreFuente.youtube, color: fuente.youtube },
} satisfies ChartConfig;

const signado = (n: number) => (n === 0 ? "0" : `${n > 0 ? "+" : MINUS}${Math.abs(n)}`);
const dia = (fecha: string) => `${fecha}T00:00:00+00:00`;

/** Punto de la serie: radio proporcional al número de documentos del día (entre 4 y 9 px), con anillo blanco de 2 px. */
function PuntoN({ cx, cy, payload, serie, nMin, nMax }: { cx?: number; cy?: number; payload?: Fila; serie: FuenteKey; nMin: number; nMax: number }) {
  const n = payload?.[`${serie}_n`];
  if (cx === undefined || cy === undefined || n === undefined) return null;
  const r = 4 + (5 * (n - nMin)) / Math.max(1, nMax - nMin);
  return <circle cx={cx} cy={cy} r={r} fill={fuente[serie]} stroke="#ffffff" strokeWidth={2} />;
}

/** Tooltip a nivel de módulo: definido dentro del gráfico se recrearía en cada render. */
function Tip({ active, payload }: { active?: boolean; payload?: ReadonlyArray<{ payload: Fila }> }) {
  const d = active ? payload?.[0]?.payload : undefined;
  if (!d) return null;
  return (
    <TooltipBox>
      <p className="mb-1.5 text-muted-foreground">{formatFecha(dia(d.fecha))} · Pulse Score preliminar</p>
      {(["google_news", "youtube"] as const).map((f) =>
        d[f] === undefined ? null : (
          <p key={f} className="flex items-center gap-2">
            <span aria-hidden="true" className="h-0.5 w-3 rounded-full" style={{ backgroundColor: fuente[f] }} />
            <span className="font-mono font-semibold tabular-nums">{signado(d[f] as number)}</span>
            <span className="text-muted-foreground">
              {nombreFuente[f]} · {formatNum(d[`${f}_n`] as number)} documentos
            </span>
          </p>
        ),
      )}
    </TooltipBox>
  );
}

/**
 * Pulse Score diario preliminar por fuente (SPEC 7.15-F): dos líneas de 2 px sobre un eje de −100 a
 * +100, con el cero marcado y el fondo dividido en zona negativa (coral) y positiva (teal) al 6 %.
 * Es una lectura PRELIMINAR con léxico. Los colores de línea son los de las fuentes, que NO son
 * coral ni teal precisamente para no confundirse con las bandas de sentimiento.
 */
export default function PulsePreliminarChart({ puntos }: { puntos: readonly PuntoPulse[] }) {
  const animar = useMotionOk();
  const angosto = useMediaQuery("(max-width: 640px)");
  const fechas = [...new Set(puntos.map((p) => p.fecha))].sort();
  const filas: Fila[] = fechas.map((fecha) => {
    const fila: Fila = { fecha };
    for (const p of puntos.filter((q) => q.fecha === fecha)) {
      fila[p.fuente] = p.score;
      fila[`${p.fuente}_n`] = p.n;
    }
    return fila;
  });
  const ns = puntos.map((p) => p.n);
  const nMin = Math.min(...ns);
  const nMax = Math.max(...ns);
  const animacion = { isAnimationActive: animar, animationDuration: 900, animationEasing: "ease-out" as const };

  const serieMax = (f: FuenteKey) => puntos.filter((p) => p.fuente === f);
  const rango = (f: FuenteKey) => {
    const s = serieMax(f).map((p) => p.score);
    return `${signado(Math.min(...s))} a ${signado(Math.max(...s))}`;
  };

  return (
    <ChartShell
      label={`Pulse Score diario preliminar por fuente, de −100 a +100. Google News se mueve entre ${rango("google_news")} y YouTube entre ${rango("youtube")}: los titulares son mucho más negativos que los comentarios.`}
      table={
        <table>
          <caption>Pulse Score diario preliminar por fuente y número de documentos</caption>
          <thead>
            <tr>
              <th scope="col">Fecha (UTC)</th>
              <th scope="col">Fuente</th>
              <th scope="col">Pulse Score</th>
              <th scope="col">Documentos</th>
            </tr>
          </thead>
          <tbody>
            {puntos.map((p) => (
              <tr key={`${p.fecha}-${p.fuente}`}>
                <th scope="row">{formatFecha(dia(p.fecha))}</th>
                <td>{nombreFuente[p.fuente]}</td>
                <td>{signado(p.score)}</td>
                <td>{formatNum(p.n)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      <ul className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-ink/80">
        {(["google_news", "youtube"] as const).map((f) => (
          <li key={f} className="flex items-center gap-2">
            <span aria-hidden="true" className="h-0.5 w-4 rounded-full" style={{ backgroundColor: fuente[f] }} />
            {nombreFuente[f]}
          </li>
        ))}
        <li className="text-muted-foreground">El tamaño del punto es proporcional al número de documentos del día.</li>
      </ul>
      <ChartContainer config={config} className="aspect-auto h-72 w-full">
        <LineChart data={filas} margin={{ top: 12, right: 18, bottom: 4, left: 0 }}>
          <ReferenceArea y1={-100} y2={0} fill={categorico.coral} fillOpacity={0.06} strokeOpacity={0} label={{ value: "Negativo", position: "insideBottomLeft", fill: "var(--muted-foreground)", fontSize: 11 }} />
          <ReferenceArea y1={0} y2={100} fill={categorico.teal} fillOpacity={0.06} strokeOpacity={0} label={{ value: "Positivo", position: "insideTopLeft", fill: "var(--muted-foreground)", fontSize: 11 }} />
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="fecha" tickFormatter={(f: string) => formatFecha(dia(f))} tickLine={false} axisLine={{ stroke: "var(--border)" }} tickMargin={8} interval={angosto ? 1 : 0} />
          <YAxis width={44} domain={[-100, 100]} ticks={[-100, -50, 0, 50, 100]} tickFormatter={signado} tickLine={false} axisLine={false} />
          <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeOpacity={0.6} />
          <Tooltip content={<Tip />} cursor={{ stroke: "var(--border)" }} />
          {(["google_news", "youtube"] as const).map((f) => (
            <Line
              key={f}
              dataKey={f}
              type="monotone"
              stroke={fuente[f]}
              strokeWidth={2}
              strokeLinecap="round"
              connectNulls
              dot={<PuntoN serie={f} nMin={nMin} nMax={nMax} />}
              activeDot={false}
              {...animacion}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </ChartShell>
  );
}
