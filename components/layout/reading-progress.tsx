"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";

/**
 * Barra de progreso de lectura: 2 px, degradado teal → coral (SPEC 5.5).
 * Va colgada del borde inferior del header (`top-full` + `mt-px`, que salta el borde de 1 px): con
 * el header visible queda justo debajo de él y, cuando el header se oculta al bajar, queda pegada
 * al borde superior de la ventana (y = 0…2 px), así que sigue visible mientras se lee.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  const motionOk = useMotionOk();

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: motionOk ? smooth : scrollYProgress }}
      className="pointer-events-none absolute top-full left-0 mt-px h-0.5 w-full origin-left bg-linear-to-r from-teal to-coral"
    />
  );
}
