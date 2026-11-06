"use client";

import { useRef, type ComponentType, type ReactNode, type Ref } from "react";
import { useReveal } from "@/hooks/use-reveal";

type Tag = "div" | "section" | "article" | "figure" | "header" | "ul" | "ol" | "li" | "p";

/** Entrada al hacer scroll para un bloque (cabecera de sección, figura, tabla). Ver `useReveal`. */
export function Reveal({
  as = "div",
  className,
  children,
}: {
  as?: Tag;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  // `as` es una etiqueta HTML (cadena); JSX la acepta igual que un componente.
  const Component = as as unknown as ComponentType<{ ref?: Ref<HTMLElement>; className?: string; children?: ReactNode }>;
  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
