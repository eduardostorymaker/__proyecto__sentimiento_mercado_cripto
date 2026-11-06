/**
 * Tokens de animación — SPEC 5.1. Nada debe moverse más de 24 px (SPEC 5.2).
 * Con `prefers-reduced-motion` se usan las variantes `reducedVariants` y `useMotionOk()` = false.
 */

export const dur = { fast: 0.15, base: 0.25, slow: 0.45, reveal: 0.6 } as const;

export const ease = {
  out: [0.16, 1, 0.3, 1] as const, // entradas
  inOut: [0.65, 0, 0.35, 1] as const, // cambios de estado
};

export const spring = {
  snappy: { type: "spring", stiffness: 420, damping: 32 } as const, // tabs, botones
  soft: { type: "spring", stiffness: 140, damping: 20 } as const, // aguja del medidor
};

export const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: dur.reveal, ease: ease.out } },
};

export const staggerParent = {
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/** Misma forma que `revealVariants`, sin desplazamiento ni fundido: el contenido aparece directo. */
export const reducedVariants = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0, transition: { duration: 0 } },
};

/** Máximo de hijos con retardo escalonado; el resto aparece sin retardo (SPEC 5.2). */
export const STAGGER_MAX = 8;
export const STAGGER_STEP = 0.08;
export const STAGGER_START = 0.05;
/** Desplazamiento vertical de las entradas: nada debe moverse más de 24 px (SPEC 5.2). */
export const REVEAL_DISTANCE_PX = 24;
/** `ease.out` en sintaxis CSS, para la Web Animations API. */
export const EASE_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Lectura directa de `prefers-reduced-motion`, para efectos que no pasan por React (Web Animations
 * API, conteos). Misma fuente que `useMotionOk()`. En servidor devuelve `false`.
 */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
