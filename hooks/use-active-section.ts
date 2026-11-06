"use client";

import { useEffect, useState } from "react";
import { sections, type SectionId } from "@/data/nav";

const index = new Map<SectionId, number>(sections.map((s, i) => [s.id, i]));

/**
 * Scroll-spy (SPEC 5.5): sección que cruza una franja delgada situada hacia el centro del viewport
 * (`rootMargin: "-45% 0px -50% 0px"`). Observa TODAS las secciones, también las que no tienen
 * enlace en el menú, para que el menú pueda conservar el último enlace anterior.
 * Si ninguna cruza la franja (entre secciones) se mantiene la última activa.
 *
 * `enabled` debe ser `false` fuera de la página principal, donde las secciones no existen.
 */
export function useActiveSection(enabled: boolean): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const visible = new Set<SectionId>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        if (visible.size === 0) return;
        let next: SectionId | null = null;
        for (const id of visible) {
          if (next === null || index.get(id)! > index.get(next)!) next = id;
        }
        setActive(next);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}
