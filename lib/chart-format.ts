import { MINUS } from "@/lib/format";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"] as const;

/** El mes 1 de la proyección es enero de 2027. `mesCorto(22)` → `oct-28`. */
export function mesCorto(mes: number): string {
  const indice = mes - 1;
  return `${MESES[((indice % 12) + 12) % 12]}-${String(27 + Math.floor(indice / 12))}`;
}

/** `mesLargo(22)` → `oct-2028`. */
export function mesLargo(mes: number): string {
  const indice = mes - 1;
  return `${MESES[((indice % 12) + 12) % 12]}-${2027 + Math.floor(indice / 12)}`;
}

/** Marcas de eje compactas en miles: 0 · 10 mil · −40 mil. */
export function ejeMiles(n: number): string {
  if (n === 0) return "0";
  return `${n < 0 ? MINUS : ""}${Math.abs(n) / 1000} mil`;
}
