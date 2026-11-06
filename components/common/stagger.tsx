"use client";

import { useRef, type ComponentType, type ReactNode, type Ref } from "react";
import { useReveal } from "@/hooks/use-reveal";

type Tag = "div" | "ul" | "ol" | "section" | "dl";

/**
 * Contenedor cuyos hijos directos entran escalonados (80 ms) al hacer scroll: grids de KPIs,
 * productos, planes, FODA, objetivos y tareas (SPEC 5.2). No hace falta envolver cada hijo.
 */
export function Stagger({
  as = "div",
  className,
  children,
}: {
  as?: Tag;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, true);
  // `as` es una etiqueta HTML (cadena); JSX la acepta igual que un componente.
  const Component = as as unknown as ComponentType<{ ref?: Ref<HTMLElement>; className?: string; children?: ReactNode }>;
  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
