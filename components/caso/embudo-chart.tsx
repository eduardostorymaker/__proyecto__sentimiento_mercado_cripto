"use client";

import { useRef } from "react";
import { ChartShell } from "@/components/charts/chart-shell";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDrawBars } from "@/hooks/use-draw-bars";
import { categorico } from "@/lib/chart-colors";
import { formatNum, MINUS } from "@/lib/format";

export interface PasoEmbudo {
  nombre: string;
  restantes: number;
}

const COLOR = categorico.azul;
const COLOR_FINAL = "#1F3A5F"; // el corpus curado, el resultado, en el navy de la marca

/**
 * Del corpus inicial al curado (SPEC 7.15-H): barras horizontales decrecientes, una por regla de
 * curado, con lo que excluye cada una. Se dibujan con 80 ms de desfase. Una sola serie ordenada:
 * un solo tono, con el resultado final en navy (énfasis), no un color por paso.
 */
export function EmbudoChart({ pasos }: { pasos: readonly PasoEmbudo[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useDrawBars(ref);
  const max = pasos[0].restantes;
  const inicial = pasos[0].restantes;
  const final = pasos[pasos.length - 1].restantes;

  return (
    <ChartShell
      label={`Del corpus inicial al corpus curado: de ${formatNum(inicial)} a ${formatNum(final)} documentos tras ${pasos.length - 1} reglas de curado.`}
      table={
        <table>
          <caption>Documentos restantes tras cada regla de curado</caption>
          <thead>
            <tr>
              <th scope="col">Paso</th>
              <th scope="col">Documentos restantes</th>
              <th scope="col">Excluidos</th>
            </tr>
          </thead>
          <tbody>
            {pasos.map((p, i) => (
              <tr key={p.nombre}>
                <th scope="row">{p.nombre}</th>
                <td>{formatNum(p.restantes)}</td>
                <td>{i === 0 ? "—" : formatNum(pasos[i - 1].restantes - p.restantes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      <div ref={ref}>
        <ol className="grid grid-cols-1 gap-2">
          {pasos.map((p, i) => {
            const excluidos = i === 0 ? 0 : pasos[i - 1].restantes - p.restantes;
            const ultimo = i === pasos.length - 1;
            return (
              <li key={p.nombre} className="grid grid-cols-1 items-center gap-1 sm:grid-cols-[13rem_1fr_6.5rem] sm:gap-3">
                <span className="text-sm text-ink/80">{p.nombre}</span>
                <div className="h-5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        data-barra
                        tabIndex={0}
                        role="img"
                        aria-label={`${p.nombre}: ${formatNum(p.restantes)} documentos${excluidos ? `, ${formatNum(excluidos)} excluidos` : ""}`}
                        style={{ width: `${(100 * p.restantes) / max}%`, backgroundColor: ultimo ? COLOR_FINAL : COLOR }}
                        className="h-full origin-left rounded-r-[4px] transition-[filter] duration-150 hover:brightness-110 focus-visible:brightness-110"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="font-semibold">{formatNum(p.restantes)} documentos</span>
                      <span className="opacity-80">
                        {" · "}
                        {p.nombre}
                      </span>
                      {excluidos > 0 && <span className="block text-[0.7rem] opacity-80">Excluye {formatNum(excluidos)}</span>}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="flex items-baseline gap-2 font-mono text-sm tabular-nums sm:justify-end">
                  <span className="font-semibold text-ink">{formatNum(p.restantes)}</span>
                  {excluidos > 0 && <span className="text-xs text-muted-foreground">{MINUS}{formatNum(excluidos)}</span>}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </ChartShell>
  );
}
