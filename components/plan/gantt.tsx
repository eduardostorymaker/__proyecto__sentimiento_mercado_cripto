"use client";

import { useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { fases, hitos, SEMANAS } from "@/data/plan";
import { useDrawBars } from "@/hooks/use-draw-bars";
import { categorico } from "@/lib/chart-colors";

const COLUMNAS = { gridTemplateColumns: `repeat(${SEMANAS}, minmax(0, 1fr))` };
const SEMANAS_LISTA = Array.from({ length: SEMANAS }, (_, i) => i + 1);
/** Líneas verticales finas, una por semana (fondo de cada fila). */
const REJILLA = {
  backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent calc(100% / ${SEMANAS} - 1px), #e3e8ef calc(100% / ${SEMANAS} - 1px), #e3e8ef calc(100% / ${SEMANAS}))`,
} as const;

const semanas = (ini: number, fin: number) => (ini === fin ? `semana ${ini}` : `semanas ${ini} a ${fin}`);

/**
 * Diagrama de Gantt de 16 semanas (SPEC 7.14), hecho con una rejilla CSS de 16 columnas: una barra por
 * fase, que crece de izquierda a derecha con 80 ms de desfase al entrar en pantalla, y los hitos
 * como rombos coral en la última fila. Cada barra y cada hito dan su detalle por hover y foco; la
 * tabla gemela lo da a lectores de pantalla. En móvil se usa la imagen del informe (ver `plan.tsx`).
 */
export function Gantt() {
  const ref = useRef<HTMLDivElement>(null);
  useDrawBars(ref);

  return (
    <figure className="w-full">
      <div
        ref={ref}
        role="group"
        aria-label={`Cronograma del proyecto de ${SEMANAS} semanas: ${fases.map((f) => `${f.fase}, ${semanas(f.ini, f.fin)}`).join("; ")}.`}
        className="rounded-2xl border border-border bg-white p-4 md:p-6"
      >
        <div className="grid grid-cols-[11.5rem_1fr] items-end gap-x-3 pb-2">
          <span className="text-xs font-semibold text-muted-foreground">Fase</span>
          <div style={COLUMNAS} className="grid text-center font-mono text-[0.7rem] text-muted-foreground">
            {SEMANAS_LISTA.map((s) => (
              <span key={s} aria-hidden="true">
                {s}
              </span>
            ))}
          </div>
        </div>
        <p className="mb-1 grid grid-cols-[11.5rem_1fr] gap-x-3 text-[0.7rem] text-muted-foreground">
          <span />
          <span className="text-center">Semana del proyecto</span>
        </p>

        {fases.map((f) => (
          <div key={f.fase} className="grid grid-cols-[11.5rem_1fr] items-center gap-x-3 border-t border-border">
            <span className="py-2 text-sm leading-snug text-ink">{f.fase}</span>
            <div style={{ ...COLUMNAS, ...REJILLA }} className="grid h-11 items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    data-barra
                    tabIndex={0}
                    role="img"
                    aria-label={`${f.fase}: ${semanas(f.ini, f.fin)}. Entregable: ${f.entregable}`}
                    style={{ gridColumn: `${f.ini} / ${f.fin + 1}`, backgroundColor: categorico.azul }}
                    className="flex h-6 origin-left items-center justify-center overflow-hidden rounded-[4px] font-mono text-[0.7rem] font-semibold text-white transition-[filter] duration-150 hover:brightness-110 focus-visible:brightness-110"
                  >
                    <span className="truncate px-1">{f.ini === f.fin ? `S${f.ini}` : `S${f.ini}–${f.fin}`}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="grid gap-0.5">
                    <span className="font-semibold">{f.fase}</span>
                    <span className="opacity-90">{semanas(f.ini, f.fin)[0].toUpperCase() + semanas(f.ini, f.fin).slice(1)}</span>
                    <span className="mt-0.5 opacity-90">Entregable: {f.entregable}</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-[11.5rem_1fr] items-center gap-x-3 border-t border-border">
          <span className="py-2 text-sm font-medium text-coral-text">Hitos</span>
          <div style={{ ...COLUMNAS, ...REJILLA }} className="grid h-11 items-center">
            {hitos.map((h) => (
              <div key={h.id} style={{ gridColumn: h.semana }} className="grid place-items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label={`${h.id}, semana ${h.semana}: ${h.nombre}. ${h.criterio}`}
                      style={{ backgroundColor: categorico.coral }}
                      className="size-4 rotate-45 rounded-[3px] transition-transform duration-150 hover:scale-125 focus-visible:scale-125 motion-reduce:transition-none"
                    />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="grid gap-0.5">
                      <span className="font-semibold">
                        {h.id} · semana {h.semana}
                      </span>
                      <span>{h.nombre}</span>
                      <span className="mt-0.5 opacity-90">{h.criterio}</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink/80">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-5 rounded-[3px]" style={{ backgroundColor: categorico.azul }} />
            Fase
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rotate-45 rounded-[2px]" style={{ backgroundColor: categorico.coral }} />
            Hito
          </li>
        </ul>
      </div>
      <div className="sr-only">
        <table>
          <caption>Cronograma del proyecto: fases, semanas y entregables, e hitos</caption>
          <thead>
            <tr>
              <th scope="col">Fase</th>
              <th scope="col">Semanas</th>
              <th scope="col">Entregable</th>
            </tr>
          </thead>
          <tbody>
            {fases.map((f) => (
              <tr key={f.fase}>
                <th scope="row">{f.fase}</th>
                <td>
                  {f.ini} a {f.fin}
                </td>
                <td>{f.entregable}</td>
              </tr>
            ))}
            {hitos.map((h) => (
              <tr key={h.id}>
                <th scope="row">
                  {h.id}: {h.nombre}
                </th>
                <td>{h.semana}</td>
                <td>{h.criterio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
