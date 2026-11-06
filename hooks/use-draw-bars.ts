"use client";

import { useEffect, type RefObject } from "react";
import { dur, EASE_OUT_CSS, prefersReducedMotion, STAGGER_STEP } from "@/lib/motion";

/**
 * Dibuja barras de izquierda a derecha al entrar en pantalla, con 80 ms de desfase entre barras
 * (SPEC 5.2 y 7.15-H). Mismo contrato que `useReveal`: el HTML del servidor trae las barras a su
 * ancho FINAL y visibles; solo tras montar, y solo si el bloque está bajo el primer pantallazo, se
 * colapsan a `scaleX(0)` y se animan con la Web Animations API (`fill: backwards`, sin estilo en línea
 * al terminar). Con movimiento reducido no se toca nada.
 *
 * Las barras se marcan con `data-barra` y deben tener `transform-origin: left` (`origin-left`). Con
 * `data-eje="y"` se dibujan hacia abajo (`scaleY`, `origin-top`): la línea vertical de la cronología.
 */
export function useDrawBars(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const raiz = ref.current;
    if (!raiz || prefersReducedMotion()) return;
    if (raiz.getBoundingClientRect().top < window.innerHeight) return;

    const barras = Array.from(raiz.querySelectorAll<HTMLElement>("[data-barra]"));
    if (barras.length === 0) return;
    const escala = (b: HTMLElement) => (b.dataset.eje === "y" ? "scaleY" : "scaleX");
    for (const b of barras) b.style.transform = `${escala(b)}(0)`;
    const animaciones: Animation[] = [];

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return;
        observador.disconnect();
        barras.forEach((b, i) => {
          b.style.removeProperty("transform");
          animaciones.push(
            b.animate([{ transform: `${escala(b)}(0)` }, { transform: `${escala(b)}(1)` }], {
              duration: (dur.slow + 0.25) * 1000,
              delay: i * STAGGER_STEP * 1000,
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
      for (const b of barras) b.style.removeProperty("transform");
    };
  }, [ref]);
}
