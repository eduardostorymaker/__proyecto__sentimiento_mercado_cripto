"use client";

import { useEffect, useRef } from "react";
import { hitos } from "@/data/plan";
import { useDrawBars } from "@/hooks/use-draw-bars";
import { dur, EASE_OUT_CSS, prefersReducedMotion } from "@/lib/motion";

/**
 * Hitos H1 a H6 (SPEC 7.14): línea de tiempo vertical cuya línea se dibuja y cuyos puntos se rellenan
 * uno tras otro al entrar en pantalla. Mismo contrato que `useReveal`: el HTML del servidor trae los
 * puntos rellenos; solo si el bloque está bajo el primer pantallazo y se permite el movimiento se
 * vacían tras montar y se rellenan al verlos. El dato (semana y criterio) está siempre en el texto.
 */
export function HitosTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  useDrawBars(ref);

  useEffect(() => {
    const raiz = ref.current;
    if (!raiz || prefersReducedMotion()) return;
    if (raiz.getBoundingClientRect().top < window.innerHeight) return;

    const puntos = Array.from(raiz.querySelectorAll<HTMLElement>("[data-punto]"));
    for (const p of puntos) p.style.backgroundColor = "#ffffff";
    const animaciones: Animation[] = [];
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return;
        observador.disconnect();
        puntos.forEach((p, i) => {
          p.style.removeProperty("background-color");
          // Un solo fotograma: el final es el color propio del punto (la clase).
          animaciones.push(
            p.animate([{ backgroundColor: "#ffffff" }], {
              duration: dur.slow * 1000,
              delay: 150 + i * 160,
              easing: EASE_OUT_CSS,
              fill: "backwards",
            }),
          );
        });
      },
      { threshold: 0.2 },
    );
    observador.observe(raiz);
    return () => {
      observador.disconnect();
      for (const a of animaciones) a.cancel();
      for (const p of puntos) p.style.removeProperty("background-color");
    };
  }, []);

  return (
    <ol ref={ref} className="relative grid grid-cols-1 gap-8">
      <span
        data-barra
        data-eje="y"
        aria-hidden="true"
        className="absolute top-3 bottom-3 left-3 w-0.5 origin-top -translate-x-1/2 rounded-full bg-border"
      />
      {hitos.map((h) => (
        <li key={h.id} className="relative pl-12">
          <span
            data-punto
            aria-hidden="true"
            className="absolute top-0.5 left-0 size-6 -translate-x-0 rounded-full border-2 border-teal-text bg-teal-text ring-4 ring-white"
          />
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-sm font-semibold text-teal-text">{h.id}</span>
            <span className="text-base font-semibold text-navy">{h.nombre}</span>
            <span className="font-mono text-xs text-muted-foreground">Semana {h.semana}</span>
          </p>
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink/80 md:text-base">{h.criterio}.</p>
        </li>
      ))}
    </ol>
  );
}
