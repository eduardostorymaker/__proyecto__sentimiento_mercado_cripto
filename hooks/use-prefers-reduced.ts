"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * `true` si el usuario pidió movimiento reducido. En el servidor devuelve `true` a propósito: lo
 * que depende de esto (el video del hero) NO se renderiza en el HTML inicial, así que quien pide
 * movimiento reducido nunca llega a descargarlo, y quien no lo pide lo recibe tras hidratar.
 */
export function usePrefersReduced(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
}
