/**
 * Color y ángulo del medidor del Pulse Score (SPEC 6.2). Sin dependencias, para poder verificarlo
 * en aislamiento.
 *
 * Escala DIVERGENTE: dos polos (coral = negativo, teal = positivo) y un gris neutro en el cero.
 * Los umbrales (±20) son los mismos que usan los mensajes de las mascotas.
 */

export const PULSE_MIN = -100;
export const PULSE_MAX = 100;
/** A partir de ±20 el sentimiento deja de ser «dividido». */
export const UMBRAL = 20;

/** Marcas del arco (elementos gráficos, ≥ 3:1 sobre navy). */
export const arco = {
  negativo: "#E76F51",
  neutro: "#94A3B8",
  positivo: "#2A9D8F",
} as const;

/**
 * Colores del NÚMERO, que es texto sobre navy: usa las variantes claras de coral y teal (5,7:1 y 6,1:1
 * sobre navy). El spec dice coral y teal, que sobre navy dan 3,7:1 y 3,5:1. El gris del cero es
 * #96A5BA, no el #94A3B8 del spec (4,47:1 sobre navy): 2 unidades más claro para llegar a 4,5:1.
 * El arco conserva el gris exacto del spec (es un elemento gráfico: basta 3:1).
 */
export const texto = {
  negativo: [0xff, 0x9e, 0x85],
  neutro: [0x96, 0xa5, 0xba],
  positivo: [0x5c, 0xcf, 0xc0],
} as const;

const clamp = (v: number) => Math.max(PULSE_MIN, Math.min(PULSE_MAX, v));

const hex = (n: number) => Math.round(n).toString(16).padStart(2, "0");

/** Interpola coral → gris (−100 → 0) y gris → teal (0 → +100), canal a canal en sRGB. */
export function colorPulse(valor: number): string {
  const v = clamp(valor);
  const t = Math.abs(v) / PULSE_MAX;
  const polo = v < 0 ? texto.negativo : texto.positivo;
  const mezcla = texto.neutro.map((c, i) => c + (polo[i] - c) * t);
  return `#${hex(mezcla[0])}${hex(mezcla[1])}${hex(mezcla[2])}`;
}

/** Ángulo de la aguja en grados: −100 → −90° (izquierda), 0 → 0° (arriba), +100 → +90° (derecha). */
export const anguloPulse = (valor: number) => clamp(valor) * 0.9;

export type Zona = "negativo" | "dividido" | "positivo";

export function zonaPulse(valor: number): Zona {
  if (valor >= UMBRAL) return "positivo";
  if (valor <= -UMBRAL) return "negativo";
  return "dividido";
}
