"use client";

import { useRef } from "react";
import { ChartShell } from "@/components/charts/chart-shell";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Latam } from "@/data/mercado";
import { useDrawBars } from "@/hooks/use-draw-bars";
import { categorico, neutro } from "@/lib/chart-colors";
import { formatNum } from "@/lib/format";

const milesDeMillones = (v: number) => `US$ ${formatNum(v, { decimals: 1 })} mil M`;

/**
 * Volumen de criptoactivos recibido por país (SPEC 7.2): barras horizontales, Perú en coral y el resto
 * en gris pizarra (una sola serie con un énfasis, no cinco colores). Cada barra lleva su valor escrito
 * (son cinco) y un tooltip en hover y foco; la tabla gemela lo da a lectores de pantalla. Las barras
 * se dibujan de izquierda a derecha al entrar en pantalla.
 */
export function LatamBar({ datos }: { datos: readonly Latam[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useDrawBars(ref);
  const orden = [...datos].sort((a, b) => b.valor - a.valor);
  const max = orden[0].valor;
  const peru = orden.find((d) => d.destacado);

  return (
    <ChartShell
      label={`Volumen de criptoactivos recibido, jul-2024 a jun-2025, en miles de millones de US$: ${orden.map((d) => `${d.pais} ${formatNum(d.valor, { decimals: 1 })}`).join(", ")}.${peru ? ` Perú recibió ${milesDeMillones(peru.valor)}.` : ""}`}
      table={
        <table>
          <caption>Volumen de criptoactivos recibido por país, jul-2024 a jun-2025 (miles de millones de US$)</caption>
          <thead>
            <tr>
              <th scope="col">País</th>
              <th scope="col">Miles de millones de US$</th>
            </tr>
          </thead>
          <tbody>
            {orden.map((d) => (
              <tr key={d.pais}>
                <th scope="row">{d.pais}</th>
                <td>{formatNum(d.valor, { decimals: 1 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      <div ref={ref}>
        <ul className="grid grid-cols-1 gap-3">
          {orden.map((d) => (
            <li key={d.pais} className="grid grid-cols-[4.75rem_1fr] items-center gap-3 sm:grid-cols-[6rem_1fr]">
              <span className={d.destacado ? "text-right text-sm font-semibold text-navy" : "text-right text-sm text-ink/80"}>{d.pais}</span>
              <div className="flex items-center gap-2">
                <div className="h-5 min-w-0 flex-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        data-barra
                        tabIndex={0}
                        role="img"
                        aria-label={`${d.pais}: ${milesDeMillones(d.valor)}`}
                        style={{ width: `${(100 * d.valor) / max}%`, backgroundColor: d.destacado ? categorico.coral : neutro }}
                        className="h-full min-w-1 origin-left rounded-r-[4px] transition-[filter] duration-150 hover:brightness-110 focus-visible:brightness-110"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="font-semibold">{milesDeMillones(d.valor)}</span>
                      <span className="opacity-80"> · {d.pais}</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="w-12 shrink-0 font-mono text-xs font-semibold text-ink tabular-nums">{formatNum(d.valor, { decimals: 1 })}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">Miles de millones de US$ (jul-2024 a jun-2025).</p>
      </div>
    </ChartShell>
  );
}
