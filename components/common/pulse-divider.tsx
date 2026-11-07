"use client";

import { useEffect, useId, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Línea de pulso decorativa entre grupos de secciones (SPEC 5.2): un SVG cuyo trazo se dibuja con
 * `pathLength` de 0 a 1 en 1,2 s al entrar en pantalla. Mismo contrato que `useReveal`: el HTML del
 * servidor trae la línea completa; solo si está bajo el primer pantallazo se oculta tras montar y se
 * anima con la Web Animations API. Con movimiento reducido no se toca. Es decorativa (`aria-hidden`).
 */
export function PulseDivider({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const gradiente = `pulso-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const svg = ref.current;
    const path = svg?.querySelector<SVGPathElement>("path");
    if (!svg || !path || prefersReducedMotion()) return;
    if (svg.getBoundingClientRect().top < window.innerHeight) return;

    path.style.strokeDasharray = "1";
    path.style.strokeDashoffset = "1";
    let animacion: Animation | undefined;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return;
        observador.disconnect();
        path.style.removeProperty("stroke-dashoffset");
        animacion = path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
          duration: 1200,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "backwards",
        });
        animacion.finished.then(() => path.style.removeProperty("stroke-dasharray")).catch(() => {});
      },
      { threshold: 0.4 },
    );
    observador.observe(svg);
    return () => {
      observador.disconnect();
      animacion?.cancel();
      path.style.removeProperty("stroke-dasharray");
      path.style.removeProperty("stroke-dashoffset");
    };
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 240 24"
      className={cn("mx-auto mb-12 h-6 w-60 max-w-full md:mb-14", className)}
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={gradiente} x1="0" x2="240" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2A9D8F" />
          <stop offset="1" stopColor="#E76F51" />
        </linearGradient>
      </defs>
      <path
        pathLength={1}
        stroke={`url(#${gradiente})`}
        d="M0 12h78l8-9 10 18 9-14 6 5h16l7-10 9 18 8-8h85"
      />
    </svg>
  );
}
