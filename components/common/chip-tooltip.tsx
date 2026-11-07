"use client";

import { useRef, useState, type ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Chip con tooltip que también funciona al TOCAR. Radix abre el tooltip con el puntero y con el foco,
 * pero un toque en pantalla táctil no lo abre; aquí el toque (o Enter/Espacio) lo alterna, así que las
 * definiciones del glosario, los segmentos y las estrategias cruzadas se leen también en el móvil.
 * Con el mouse el clic deja el tooltip abierto (ya lo abrió el hover) y Esc o salir del chip lo cierra.
 * El contenido llega al lector de pantalla por `aria-describedby` (lo pone Radix al abrir).
 */
export function ChipTooltip({
  children,
  tip,
  className,
  contentClassName,
  ariaLabel,
}: {
  /** Contenido del chip (el botón). */
  children: ReactNode;
  /** Contenido del tooltip. */
  tip: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Nombre accesible del botón, cuando su contenido es solo un icono. */
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  // Radix cierra el tooltip en `pointerdown` y otra vez en `click`: se recuerda cómo estaba antes del toque.
  const toque = useRef<{ estabaAbierto: boolean; mouse: boolean } | null>(null);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className={className}
          onPointerDown={(e) => {
            toque.current = { estabaAbierto: open, mouse: e.pointerType === "mouse" };
          }}
          onClick={(e) => {
            // `preventDefault` evita el cierre que Radix hace en cada clic y deja que mande este alternar.
            e.preventDefault();
            const previo = toque.current;
            toque.current = null;
            if (previo?.mouse) setOpen(true);
            else setOpen(!(previo ? previo.estabaAbierto : open));
          }}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent className={contentClassName}>{tip}</TooltipContent>
    </Tooltip>
  );
}
