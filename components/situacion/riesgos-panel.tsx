"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/common/status-badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { nivelRiesgo, riesgos, type NivelRiesgo, type Riesgo } from "@/data/riesgos";
import { cn } from "@/lib/utils";

const ESCALA = [1, 2, 3, 4, 5] as const;

/** Fondo de cada celda por su severidad P×I (opaco): coral = alto, dorado = medio, teal = bajo. */
const CELDA: Record<NivelRiesgo, string> = {
  alto: "bg-[#f9ddd5]",
  medio: "bg-[#f8ecc6]",
  bajo: "bg-[#d4ebe8]",
};
const TEXTO_NIVEL: Record<NivelRiesgo, string> = { alto: "Alto", medio: "Medio", bajo: "Bajo" };

const nombreNivel = (r: Riesgo) => TEXTO_NIVEL[nivelRiesgo(r.p, r.i)].toLowerCase();

/**
 * Matriz de riesgos 5×5 junto al registro R1-R10 (SPEC 7.11). Cada riesgo es un círculo navy con su ID
 * en la celda de su probabilidad (eje vertical) e impacto (horizontal); varios riesgos pueden compartir
 * celda (R3/R4, R5/R7, R6/R10). Pasar el mouse o enfocar un círculo resalta su fila del acordeón, y
 * pasar el mouse o enfocar una fila resalta su círculo; un clic en el círculo abre su fila. El color
 * de la celda refuerza la severidad, que también va escrita en cada fila (Alto · 16) y en la leyenda.
 */
export function RiesgosPanel() {
  const [resaltado, setResaltado] = useState<string | null>(null);
  const [abierto, setAbierto] = useState("");
  const enfoque = (id: string) => ({
    onMouseEnter: () => setResaltado(id),
    onMouseLeave: () => setResaltado(null),
    onFocus: () => setResaltado(id),
    onBlur: () => setResaltado(null),
  });

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,27rem)_1fr] lg:gap-10">
      <div className="min-w-0 rounded-2xl border border-border bg-white p-4 md:p-6">
        <h3 className="mb-4 text-base font-semibold text-navy">Matriz de probabilidad e impacto</h3>
        <div role="group" aria-label="Matriz de probabilidad e impacto: cada círculo es un riesgo en la celda de su probabilidad e impacto">
          <div className="grid grid-cols-[auto_auto_1fr] gap-x-2">
            <span className="row-span-2 flex items-center justify-center text-xs font-medium text-muted-foreground [writing-mode:vertical-rl] rotate-180">
              Probabilidad →
            </span>
            <div className="grid grid-rows-5 py-0.5 text-right font-mono text-xs text-muted-foreground">
              {[...ESCALA].reverse().map((p) => (
                <span key={p} aria-hidden="true" className="flex items-center justify-end">
                  {p}
                </span>
              ))}
            </div>
            <div className="grid aspect-square grid-cols-5 grid-rows-5 gap-0.5">
              {[...ESCALA].reverse().flatMap((p) =>
                ESCALA.map((i) => {
                  const enCelda = riesgos.filter((r) => r.p === p && r.i === i);
                  return (
                    <div
                      key={`${p}-${i}`}
                      className={cn("relative flex flex-wrap content-center items-center justify-center gap-0.5 rounded-md p-0.5", CELDA[nivelRiesgo(p, i)])}
                    >
                      <span aria-hidden="true" className="absolute top-0.5 right-1 font-mono text-[0.6rem] text-ink/70">
                        {p * i}
                      </span>
                      {enCelda.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          {...enfoque(r.id)}
                          onClick={() => setAbierto(r.id)}
                          aria-label={`${r.id}: ${r.riesgo}. Probabilidad ${r.p}, impacto ${r.i}, nivel ${nombreNivel(r)}. Abrir su fila`}
                          className={cn(
                            "relative z-[1] grid size-6 place-items-center rounded-full bg-navy font-mono text-[0.6rem] font-semibold text-white sm:size-7 sm:text-[0.65rem] transition duration-150 hover:scale-110 focus-visible:scale-110 motion-reduce:transition-none",
                            resaltado === r.id && "scale-110 ring-2 ring-ink ring-offset-1",
                          )}
                        >
                          {r.id}
                        </button>
                      ))}
                    </div>
                  );
                }),
              )}
            </div>
            <span />
            <div className="mt-1 grid grid-cols-5 text-center font-mono text-xs text-muted-foreground">
              {ESCALA.map((i) => (
                <span key={i} aria-hidden="true">
                  {i}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-1 text-center text-xs font-medium text-muted-foreground">Impacto →</p>
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink/80" aria-label="Leyenda de severidad (probabilidad × impacto)">
          {(
            [
              ["alto", "Alto: 16 o más"],
              ["medio", "Medio: de 9 a 15"],
              ["bajo", "Bajo: 8 o menos"],
            ] as const
          ).map(([n, texto]) => (
            <li key={n} className="flex items-center gap-2">
              <span aria-hidden="true" className={cn("size-3.5 rounded-[3px] border border-ink/20", CELDA[n])} />
              {texto}
            </li>
          ))}
        </ul>
      </div>

      <Accordion type="single" collapsible value={abierto} onValueChange={setAbierto} className="min-w-0 rounded-2xl border border-border bg-white px-3 md:px-4">
        {riesgos.map((r) => {
          const nivel = nivelRiesgo(r.p, r.i);
          return (
            <AccordionItem
              key={r.id}
              value={r.id}
              {...enfoque(r.id)}
              className={cn("rounded-lg px-2 transition-colors duration-150", resaltado === r.id && "bg-gold/25")}
            >
              <AccordionTrigger className="items-center gap-3 text-sm md:text-base">
                <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="w-8 shrink-0 font-mono text-sm font-semibold text-navy">{r.id}</span>
                  <span className="min-w-0 flex-1 basis-48 text-ink">{r.riesgo}</span>
                  <StatusBadge kind={nivel}>
                    {TEXTO_NIVEL[nivel]} · {r.p * r.i}
                  </StatusBadge>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <dl className="grid grid-cols-1 gap-3 pb-2 text-sm leading-relaxed text-ink/90 md:text-base">
                  <div>
                    <dt className="font-semibold text-navy">Probabilidad e impacto</dt>
                    <dd>
                      Probabilidad {r.p} × impacto {r.i} = {r.p * r.i}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-navy">Respuesta preventiva</dt>
                    <dd>{r.prevencion}.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-navy">Contingencia</dt>
                    <dd>{r.contingencia}.</dd>
                  </div>
                </dl>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
