"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ReferenceArea, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ChartShell, TooltipBox } from "@/components/charts/chart-shell";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { categorico, fuente, nombreFuente } from "@/lib/chart-colors";
import { formatFecha, formatNum } from "@/lib/format";

export interface FilaVolumen {
  t: string;
  google_news: number;
  youtube: number;
}

interface Props {
  seis: readonly FilaVolumen[];
  dia: readonly FilaVolumen[];
  eventoUtc: string;
  finDuranteUtc: string;
  /** Conclusión bajo el gráfico, ya con las cifras del JSON. */
  conclusion: string;
  notaSeis: string;
  notaDia: string;
  /** Aclaración del tooltip del bloque previo al ataque. */
  bloquePrevio: string;
  /** Frase que resume el gráfico para lectores de pantalla. */
  resumen: string;
}

type Modo = "6h" | "dia";

interface Punto {
  x: number;
  t: string;
  google_news: number;
  youtube: number;
}

const HORAS6 = 6 * 3_600_000;
const DIA = 24 * 3_600_000;
const config = {
  google_news: { label: nombreFuente.google_news, color: fuente.google_news },
  youtube: { label: nombreFuente.youtube, color: fuente.youtube },
} satisfies ChartConfig;

const iso = (ms: number) => new Date(ms).toISOString();

interface TipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: Punto }>;
  modo: Modo;
  bloquePrevio: string;
}

/** Tooltip a nivel de módulo: definido dentro del gráfico se recrearía en cada render. */
function Tip({ active, payload, modo, bloquePrevio }: TipProps) {
  const d = active ? payload?.[0]?.payload : undefined;
  if (!d) return null;
  const previo = modo === "6h" && d.t.startsWith("2026-10-29T06:00") && d.google_news > 0;
  return (
    <TooltipBox>
      <p className="mb-1.5 text-muted-foreground">
        {modo === "6h" ? `${formatFecha(d.t, { zona: "Lima", hora: true })} · bloque de 6 h (hora de Lima)` : `${formatFecha(d.t)} · día completo (UTC)`}
      </p>
      {(["google_news", "youtube"] as const).map((f) => (
        <p key={f} className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-1 rounded-sm" style={{ backgroundColor: fuente[f] }} />
          <span className="font-mono font-semibold tabular-nums">{formatNum(d[f])}</span>
          <span className="text-muted-foreground">{nombreFuente[f]}</span>
        </p>
      ))}
      <p className="mt-1 border-t border-border pt-1 text-muted-foreground">
        Total <span className="font-mono font-semibold text-foreground tabular-nums">{formatNum(d.google_news + d.youtube)}</span>
      </p>
      {previo && <p className="mt-1.5 max-w-52 text-[0.7rem] leading-snug text-muted-foreground">{bloquePrevio}</p>}
    </TooltipBox>
  );
}

/**
 * Volumen de documentos en el tiempo (SPEC 7.15-C). Eje de tiempo NUMÉRICO: así el hackeo (20:05)
 * cae dentro de su bloque de 6 h y la crisis aguda (72 h) empieza y termina donde debe, cosa que un
 * eje de categorías no permite. Cada columna se centra en su bloque. Dos fuentes apiladas, cada una
 * con el color que conserva en toda la sección.
 */
export default function VolumenChart({ seis, dia, eventoUtc, finDuranteUtc, conclusion, notaSeis, notaDia, bloquePrevio, resumen }: Props) {
  const [modo, setModo] = useState<Modo>("6h");
  const animar = useMotionOk();

  const base = modo === "6h" ? seis : dia;
  const ancho = modo === "6h" ? HORAS6 : DIA;
  const puntos: Punto[] = base.map((r) => ({ x: Date.parse(r.t) + ancho / 2, ...r }));
  const desde = Date.parse(base[0].t);
  const hasta = Date.parse(base[base.length - 1].t) + ancho;
  // Marcas en medianoches UTC: cada día en la vista de 6 h, cada 3 días en la diaria.
  const paso = modo === "6h" ? DIA : 3 * DIA;
  const ticks: number[] = [];
  for (let t = Math.ceil(desde / DIA) * DIA; t <= hasta; t += paso) ticks.push(t);

  const evento = Date.parse(eventoUtc);
  const fin = Date.parse(finDuranteUtc);

  const angosto = useMediaQuery("(max-width: 640px)");
  const etiqueta = { fill: "var(--foreground)", fontSize: 11, fontWeight: 600 } as const;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-ink/80">
          {(["google_news", "youtube"] as const).map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span aria-hidden="true" className="size-3 rounded-[3px]" style={{ backgroundColor: fuente[f] }} />
              {nombreFuente[f]}
            </li>
          ))}
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3.5 w-0 border-l-2 border-dashed" style={{ borderColor: categorico.coral }} />
            Hackeo
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-[3px]" style={{ backgroundColor: categorico.coral, opacity: 0.18 }} />
            Crisis aguda (72 h)
          </li>
        </ul>
        <Tabs value={modo} onValueChange={(v) => setModo(v as Modo)}>
          <TabsList variant="line" aria-label="Escala de tiempo del gráfico" className="h-8 gap-1 p-0">
            <TabsTrigger value="6h" className="h-8 flex-none rounded-md px-3 text-xs after:hidden focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-active:bg-mist data-active:text-navy">
              Cada 6 horas
            </TabsTrigger>
            <TabsTrigger value="dia" className="h-8 flex-none rounded-md px-3 text-xs after:hidden focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-active:bg-mist data-active:text-navy">
              Por día
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ChartShell
        label={resumen}
        table={
          <table>
            <caption>Documentos por {modo === "6h" ? "bloque de 6 horas" : "día"} y fuente (UTC)</caption>
            <thead>
              <tr>
                <th scope="col">Inicio del bloque (UTC)</th>
                <th scope="col">Google News</th>
                <th scope="col">YouTube</th>
              </tr>
            </thead>
            <tbody>
              {base.map((r) => (
                <tr key={r.t}>
                  <th scope="row">{formatFecha(r.t, { hora: modo === "6h" })}</th>
                  <td>{formatNum(r.google_news)}</td>
                  <td>{formatNum(r.youtube)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      >
        <ChartContainer config={config} className="aspect-auto h-72 w-full">
          <BarChart key={modo} data={puntos} margin={{ top: 22, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[desde, hasta]}
              ticks={ticks}
              tickFormatter={(ms: number) => formatFecha(iso(ms))}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              tickMargin={8}
            />
            <YAxis width={44} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<Tip modo={modo} bloquePrevio={bloquePrevio} />} cursor={{ fill: "var(--muted)", opacity: 0.7 }} />

            <ReferenceArea x1={evento} x2={fin} fill={categorico.coral} fillOpacity={0.08} strokeOpacity={0} label={angosto ? undefined : { value: "Crisis aguda (72 h)", position: "insideTopRight", ...etiqueta }} />
            <ReferenceLine x={evento} stroke={categorico.coral} strokeDasharray="4 3" label={angosto ? undefined : { value: "Hackeo", position: "insideTopLeft", dx: -52, ...etiqueta }} />

            <Bar dataKey="google_news" stackId="v" fill={fuente.google_news} barSize={modo === "6h" ? 14 : 22} stroke="#ffffff" strokeWidth={2} isAnimationActive={animar} animationDuration={900} animationEasing="ease-out" />
            <Bar dataKey="youtube" stackId="v" fill={fuente.youtube} barSize={modo === "6h" ? 14 : 22} radius={[4, 4, 0, 0]} stroke="#ffffff" strokeWidth={2} isAnimationActive={animar} animationDuration={900} animationEasing="ease-out" />
          </BarChart>
        </ChartContainer>
      </ChartShell>

      <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink/80">{conclusion}</p>
      <p className="mt-1.5 max-w-prose text-xs leading-relaxed text-muted-foreground">{modo === "6h" ? notaSeis : notaDia}</p>
    </div>
  );
}
