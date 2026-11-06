"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { dur, ease } from "@/lib/motion";

const SHOW_AFTER_PX = 1200;

/** Botón flotante «Volver arriba»: aparece tras 1 200 px con fundido + escala 0,8 → 1 (SPEC 5.5). */
export function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const motionOk = useMotionOk();

  useMotionValueEvent(scrollY, "change", (y) => setShow(y > SHOW_AFTER_PX));

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="back-to-top"
          type="button"
          aria-label="Volver arriba"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: motionOk ? dur.base : dur.fast, ease: ease.out }}
          // Sin `behavior`, el scroll respeta el CSS: suave, o instantáneo con movimiento reducido.
          onClick={() => window.scrollTo({ top: 0 })}
          className="fixed right-5 bottom-5 z-40 grid size-11 place-items-center rounded-full bg-navy text-white shadow-lg shadow-navy/30 transition-colors duration-150 hover:bg-navy-deep active:scale-[0.97] md:right-8 md:bottom-8"
        >
          <ArrowUp className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
