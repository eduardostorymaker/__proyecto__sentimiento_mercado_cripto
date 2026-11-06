"use client";

import { useRef } from "react";
import { RichText } from "@/components/common/rich-text";
import { useDrawBars } from "@/hooks/use-draw-bars";

export interface HitoVista {
  id: string;
  /** `29-oct 20:05`, ya formateada desde el JSON. */
  fecha: string;
  titulo: string;
  /** Color del marcador (hex). */
  color: string;
}

/**
 * Cronología del caso (SPEC 7.15-A): cinco hitos sobre una línea que se dibuja al entrar en pantalla
 * (horizontal en escritorio, vertical en móvil). El texto de cada hito lleva su fecha, así que el
 * color del marcador solo refuerza: coral = el ataque, azul y ámbar = el primer titular y el primer
 * comentario (los colores de sus fuentes), teal = la reanudación de retiros, dorado = el pico.
 */
export function CasoTimeline({ hitos }: { hitos: readonly HitoVista[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useDrawBars(ref);

  return (
    <div ref={ref} className="relative mt-12">
      {/* Línea horizontal (escritorio), entre el centro del primer y del último marcador. */}
      <span
        data-barra
        aria-hidden="true"
        className="absolute top-3 right-[10%] left-[10%] hidden h-0.5 origin-left rounded-full bg-border md:block"
      />
      {/* Línea vertical (móvil). */}
      <span
        data-barra
        data-eje="y"
        aria-hidden="true"
        className="absolute top-3 bottom-3 left-3 w-0.5 origin-top rounded-full bg-border md:hidden"
      />
      <ol className="relative grid grid-cols-1 gap-7 md:grid-cols-5 md:gap-4">
        {hitos.map((h) => (
          <li key={h.id} className="relative pl-10 md:pl-0 md:text-center">
            <span
              aria-hidden="true"
              style={{ backgroundColor: h.color }}
              className="absolute top-0 left-0 size-6 rounded-full border-2 border-white ring-2 ring-ink/20 md:static md:mx-auto md:mb-3 md:block"
            />
            <p className="font-mono text-sm font-semibold text-navy tabular-nums">{h.fecha}</p>
            <p className="mt-1 text-sm leading-snug text-ink/80">
              <RichText>{h.titulo}</RichText>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
