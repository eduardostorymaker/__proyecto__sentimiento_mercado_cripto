"use client";

import { useEffect, type RefObject } from "react";
import { enLote, observar } from "@/lib/dom-lote";
import {
  dur,
  EASE_OUT_CSS,
  prefersReducedMotion,
  REVEAL_DISTANCE_PX,
  STAGGER_MAX,
  STAGGER_START,
  STAGGER_STEP,
} from "@/lib/motion";

/**
 * Entrada al hacer scroll (SPEC 5.2): `opacity 0 → 1` y `y 24 → 0` en 600 ms, una sola vez.
 *
 * Contrato de la fase 1: el HTML del servidor lleva el contenido VISIBLE. Solo después de montar,
 * y solo lo que está por debajo del primer pantallazo, se oculta y se anima al entrar en pantalla:
 * lo que ya se ve al cargar no parpadea, y sin JavaScript o con movimiento reducido nunca queda
 * nada oculto.
 *
 * Se usa la Web Animations API con `fill: "backwards"`: durante el retardo se ve el primer
 * fotograma y al terminar manda el estilo normal del elemento, así que no queda ningún estilo en
 * línea que pise `hover:-translate-y-1` u otros efectos de las tarjetas.
 *
 * Con `stagger`, los hijos directos entran con 80 ms de desfase (máximo 8 con retardo propio; del
 * noveno en adelante entran junto al octavo).
 */
export function useReveal(ref: RefObject<HTMLElement | null>, stagger = false) {
  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    let cancelado = false;
    let dejarDeObservar: (() => void) | undefined;
    let targets: HTMLElement[] = [];
    const animations: Animation[] = [];

    // Lectura y escritura agrupadas con las de todos los demás componentes (ver `lib/dom-lote.ts`).
    const cancelarLote = enLote(
      () => root.getBoundingClientRect().top < window.innerHeight, // ya visible al cargar
      (yaVisible) => {
        if (cancelado || yaVisible) return;
        targets = stagger ? (Array.from(root.children) as HTMLElement[]) : [root];
        if (targets.length === 0) return;
        for (const el of targets) el.style.opacity = "0";

        let hecho = false;
        dejarDeObservar = observar(root, [0, 0.2], (entry) => {
          if (hecho) return;
          // 20 % del elemento, o 20 % del alto de la ventana si es más alto que 5 pantallas.
          const enough =
            entry.isIntersecting &&
            (entry.intersectionRatio >= 0.2 || entry.intersectionRect.height >= window.innerHeight * 0.2);
          if (!enough) return;
          hecho = true;
          dejarDeObservar?.();

          targets.forEach((el, i) => {
            el.style.removeProperty("opacity");
            const delay = stagger ? STAGGER_START + Math.min(i, STAGGER_MAX - 1) * STAGGER_STEP : 0;
            animations.push(
              el.animate(
                [
                  { opacity: 0, transform: `translateY(${REVEAL_DISTANCE_PX}px)` },
                  { opacity: 1, transform: "translateY(0)" },
                ],
                { duration: dur.reveal * 1000, delay: delay * 1000, easing: EASE_OUT_CSS, fill: "backwards" },
              ),
            );
          });
        });
      },
    );

    return () => {
      cancelado = true;
      cancelarLote();
      dejarDeObservar?.();
      for (const a of animations) a.cancel();
      for (const el of targets) el.style.removeProperty("opacity");
    };
  }, [ref, stagger]);
}
