"use client";

import { useSyncExternalStore } from "react";

/**
 * Coincidencia de una media query, sin parpadeo de hidratación: en el servidor devuelve
 * `serverValue` y, ya en el navegador, el valor real. Útil para decisiones de presentación de un
 * componente de cliente (p. ej. cuántas marcas muestra un eje en pantallas angostas).
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
