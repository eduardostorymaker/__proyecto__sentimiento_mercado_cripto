"use client";

import { useRef } from "react";
import { Icon } from "@/components/common/icon";
import { useDrawBars } from "@/hooks/use-draw-bars";
import type { PasoProceso } from "@/data/dap";

/**
 * Pasos del proceso (SPEC 7.9): cinco pasos con icono sobre un conector que se dibuja al entrar en
 * pantalla (horizontal en escritorio, vertical en móvil). Es una lista ordenada: el número va en el
 * texto, no solo en el icono.
 */
export function ProcesoStepper({ pasos }: { pasos: readonly PasoProceso[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useDrawBars(ref);

  return (
    <div ref={ref} className="relative">
      {/* Conector horizontal (escritorio): del centro del primer icono al del último. */}
      <span
        data-barra
        aria-hidden="true"
        className="absolute top-7 right-[10%] left-[10%] hidden h-0.5 origin-left rounded-full bg-teal/50 md:block"
      />
      {/* Conector vertical (móvil). */}
      <span
        data-barra
        data-eje="y"
        aria-hidden="true"
        className="absolute top-7 bottom-7 left-7 w-0.5 origin-top -translate-x-1/2 rounded-full bg-teal/50 md:hidden"
      />
      <ol className="relative grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-4">
        {pasos.map((p, i) => (
          <li key={p.nombre} className="relative flex items-center gap-4 md:flex-col md:gap-3 md:text-center">
            <span className="relative z-[1] grid size-14 shrink-0 place-items-center rounded-full bg-navy text-white ring-4 ring-white">
              <Icon name={p.icono} className="size-6" />
            </span>
            <span>
              <span className="block font-mono text-xs font-semibold text-teal-text">Paso {i + 1}</span>
              <span className="block text-lg font-semibold text-navy">{p.nombre}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
