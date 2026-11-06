/**
 * Texto con marcas del spec: `**negrita**` y `[ref:id]` (cita IEEE). `<RichText>` las interpreta;
 * un id que no exista en `data/referencias.ts` rompe el build. `[Por completar]` pinta el marcador
 * visible de contenido pendiente.
 */
export type Rich = string;

/** Cifra que cuenta de 0 al valor (ver `<CountUp />`). Serializable: se esparce como props. */
export interface CountSpec {
  value: number;
  kind?: "num" | "usd" | "pct";
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

/** Valor mostrado sin conteo: una cifra en US$ o un texto. */
export type Valor = { usd: number } | { texto: string };

/** Tono de color de una tarjeta o cifra. */
export type Tono = "navy" | "teal" | "coral" | "gold";
