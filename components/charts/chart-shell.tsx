import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Envoltorio accesible de un gráfico (SPEC 9): `role="img"` con una frase que dice la conclusión, y
 * una tabla con los mismos datos solo para lectores de pantalla. El tooltip nunca es la única vía
 * para leer un valor.
 */
export function ChartShell({
  label,
  table,
  children,
  className,
}: {
  label: string;
  /** `<table>` con los datos del gráfico (se oculta visualmente). */
  table: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("w-full", className)}>
      <div role="img" aria-label={label}>
        {children}
      </div>
      <div className="sr-only">{table}</div>
    </figure>
  );
}

/** Tarjeta blanca que aloja un gráfico sobre secciones `mist`. */
export function ChartCard({ title, children, className }: { title?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0 rounded-2xl border border-border bg-white p-4 md:p-6", className)}>
      {title && <h3 className="mb-4 text-base font-semibold text-navy">{title}</h3>}
      {children}
    </div>
  );
}

/** Tooltip común de los gráficos: el valor manda y la etiqueta acompaña (SPEC de interacción). */
export function TooltipBox({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-36 rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
      {children}
    </div>
  );
}
