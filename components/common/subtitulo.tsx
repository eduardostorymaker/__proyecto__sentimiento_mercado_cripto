import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Subtítulo de un bloque dentro de una sección (`h3`): el `h2` lo pone `SectionHeader`, y las
 * tarjetas de gráficos que van debajo usan `h4`, así que la jerarquía no salta niveles.
 */
export function Subtitulo({ children, extra, className }: { children: ReactNode; extra?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-center gap-3", className)}>
      <h3 className="text-xl font-semibold tracking-tight text-navy md:text-2xl">{children}</h3>
      {extra}
    </div>
  );
}
