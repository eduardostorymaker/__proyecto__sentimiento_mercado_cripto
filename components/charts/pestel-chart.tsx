"use client";

import { useRef } from "react";
import { ChartShell } from "@/components/charts/chart-shell";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDrawBars } from "@/hooks/use-draw-bars";
import { categorico } from "@/lib/chart-colors";
import { MINUS } from "@/lib/format";

interface Fila {
  factor: string;
  oportunidad: number;
  amenaza: number;
}

const ESCALA = 5;

/**
 * Balance PESTEL (SPEC 7.3): barras divergentes alrededor de un eje central, la amenaza hacia la
 * izquierda en coral (etiqueta `−n`) y la oportunidad hacia la derecha en teal (`+n`), escala de 0 a 5
 * en ambos lados. El color refuerza la posición (izquierda/derecha) y la etiqueta lleva el signo.
 */
export function PestelChart({ filas }: { filas: readonly Fila[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useDrawBars(ref);

  return (
    <ChartShell
      label={`Balance PESTEL, de 0 a ${ESCALA}: ${filas.map((f) => `${f.factor}, oportunidad ${f.oportunidad} y amenaza ${f.amenaza}`).join("; ")}.`}
      table={
        <table>
          <caption>Balance PESTEL: puntuación de oportunidades y amenazas por factor (0 a 5)</caption>
          <thead>
            <tr>
              <th scope="col">Factor</th>
              <th scope="col">Oportunidad</th>
              <th scope="col">Amenaza</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.factor}>
                <th scope="row">{f.factor}</th>
                <td>{f.oportunidad}</td>
                <td>{f.amenaza}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      <div ref={ref}>
        <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink/80">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-[3px]" style={{ backgroundColor: categorico.coral }} />
            Amenaza
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-[3px]" style={{ backgroundColor: categorico.teal }} />
            Oportunidad
          </li>
        </ul>
        <ul className="grid grid-cols-1 gap-2.5">
          {filas.map((f) => (
            <li key={f.factor} className="grid grid-cols-[5.75rem_1fr_1fr] items-center sm:grid-cols-[7rem_1fr_1fr]">
              <span className="pr-3 text-right text-sm text-ink/80">{f.factor}</span>
              {/* Mitad izquierda: amenaza. El número va pegado a la punta de la barra. */}
              <div className="flex h-5 items-center justify-end gap-1.5 border-r-2 border-ink/30 pr-0">
                <span className="font-mono text-xs font-semibold text-coral-text tabular-nums">
                  {MINUS}
                  {f.amenaza}
                </span>
                <div className="h-full w-[calc((100%-2rem)*var(--p))]" style={{ ["--p" as string]: f.amenaza / ESCALA }}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        data-barra
                        tabIndex={0}
                        role="img"
                        aria-label={`${f.factor}: amenaza ${f.amenaza} de ${ESCALA}`}
                        style={{ backgroundColor: categorico.coral }}
                        className="h-full w-full origin-right rounded-l-[4px] transition-[filter] duration-150 hover:brightness-110 focus-visible:brightness-110"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="font-semibold">Amenaza {f.amenaza} de {ESCALA}</span>
                      <span className="opacity-80"> · {f.factor}</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              {/* Mitad derecha: oportunidad. */}
              <div className="flex h-5 items-center gap-1.5 pl-0">
                <div className="h-full w-[calc((100%-2rem)*var(--p))]" style={{ ["--p" as string]: f.oportunidad / ESCALA }}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        data-barra
                        tabIndex={0}
                        role="img"
                        aria-label={`${f.factor}: oportunidad ${f.oportunidad} de ${ESCALA}`}
                        style={{ backgroundColor: categorico.teal }}
                        className="h-full w-full origin-left rounded-r-[4px] transition-[filter] duration-150 hover:brightness-110 focus-visible:brightness-110"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="font-semibold">Oportunidad {f.oportunidad} de {ESCALA}</span>
                      <span className="opacity-80"> · {f.factor}</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="font-mono text-xs font-semibold text-teal-text tabular-nums">+{f.oportunidad}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">Puntuación de 0 a {ESCALA} en cada lado.</p>
      </div>
    </ChartShell>
  );
}
