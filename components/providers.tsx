"use client";

import { MotionConfig } from "motion/react";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * Proveedores globales.
 * - `MotionConfig reducedMotion="user"`: motion desactiva los movimientos de transformación con
 *   `prefers-reduced-motion`. No cubre la opacidad ni los gráficos: eso lo resuelve `useMotionOk`.
 * - `TooltipProvider`: los tooltips del glosario usan 200 ms de retardo (SPEC 5.3).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
    </MotionConfig>
  );
}
