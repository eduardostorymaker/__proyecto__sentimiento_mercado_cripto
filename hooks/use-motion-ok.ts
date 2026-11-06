"use client";

import { useReducedMotion } from "motion/react";

/**
 * Único punto de decisión sobre animar o no (SPEC 5.6).
 * `MotionConfig reducedMotion="user"` solo apaga los movimientos de transformación; la opacidad,
 * el conteo de cifras, el dibujo de líneas y la animación de Recharts los decide este hook.
 *
 * Antes de hidratar (servidor) devuelve `true`: los componentes deben renderizar el contenido
 * visible por defecto y aplicar el estado inicial animado solo cuando `motionOk` sea `true`
 * ya montados, para que quien pide movimiento reducido nunca vea contenido oculto.
 */
export function useMotionOk(): boolean {
  return !useReducedMotion();
}
