"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { ease } from "@/lib/motion";

/**
 * Transición de entrada entre páginas (SPEC 5.5): `opacity 0 → 1` y `y 12 → 0` en 350 ms.
 *
 * `template.tsx` se vuelve a montar en cada navegación. En la PRIMERA carga NO se anima: el HTML
 * del servidor ya lleva el contenido y animarlo desde `opacity: 0` lo dejaría invisible hasta
 * hidratar (peor LCP). La marca `navigated` solo se enciende en el navegador, tras montar, nunca
 * en el servidor, así que servidor e hidratación coinciden.
 *
 * Aquí vive el único `<main>` del sitio: las páginas no deben declarar el suyo.
 *
 * View Transitions (React 19.3) no se activan: con dos rutas, este fundido cumple la misma función
 * y apilar ambos animaría dos veces el mismo cambio.
 */
let navigated = false;

/**
 * Next calcula el scroll al `#ancla` de la URL mientras el contenido aún está desplazado 12 px por
 * la animación de entrada; al terminar, el título queda 12 px más arriba de lo que marca
 * `scroll-mt`. Al acabar la animación se corrige esa diferencia, solo si Next acaba de aterrizar
 * ahí (≤ 24 px), para no tirar de quien ya se movió.
 */
function realignToHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const el = id ? document.getElementById(id) : null;
  if (!el) return;
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const delta = el.getBoundingClientRect().top - margin;
  if (Math.abs(delta) <= 24) window.scrollBy({ top: delta, behavior: "instant" });
}

export default function Template({ children }: { children: React.ReactNode }) {
  const motionOk = useMotionOk();
  const animateIn = navigated && motionOk;

  useEffect(() => {
    navigated = true;
  }, []);

  return (
    <motion.main
      id="contenido"
      tabIndex={-1}
      initial={animateIn ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: ease.out }}
      onAnimationComplete={realignToHash}
      className="flex-1 outline-none"
    >
      {children}
    </motion.main>
  );
}
