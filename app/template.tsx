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
 * Al llegar a una ruta con `#ancla`, Next calcula el scroll con el diseño de ese instante: la
 * animación de entrada aún desplaza el contenido 12 px y secciones largas (gráficos que se montan
 * al acercarse, tipografías, carruseles) pueden cambiar de alto después, con lo que el título
 * queda fuera de su sitio (`scroll-mt`) o, en pantallas angostas, muy lejos. Al terminar la
 * animación se vuelve a alinear y, durante 2,5 s, se mantiene alineado si el diseño cambia, hasta
 * que la persona hace cualquier gesto propio (rueda, toque, teclado o clic): entonces se suelta.
 */
function keepHashAligned() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const el = id ? document.getElementById(id) : null;
  if (!el) return;
  const align = () => {
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const delta = el.getBoundingClientRect().top - margin;
    if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: "instant" });
  };
  align();

  const ro = new ResizeObserver(align);
  ro.observe(document.body);
  const gestos = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  const soltar = () => {
    ro.disconnect();
    clearTimeout(timer);
    for (const g of gestos) window.removeEventListener(g, soltar);
  };
  const timer = setTimeout(soltar, 2500);
  for (const g of gestos) window.addEventListener(g, soltar, { passive: true, once: true });
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
      onAnimationComplete={keepHashAligned}
      className="flex-1 outline-none"
    >
      {children}
    </motion.main>
  );
}
