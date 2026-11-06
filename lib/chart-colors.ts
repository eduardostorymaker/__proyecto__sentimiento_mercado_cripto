/**
 * Colores de los gráficos. Se validaron con `validate_palette.js` de la habilidad dataviz, contra
 * el fondo blanco de las tarjetas (ver PLAN_ejecucion.md, fase 5):
 *
 * - `categorico`: azul, teal y coral pasan los cinco chequeos (banda de luminosidad, croma, separación
 *   para daltonismo ΔE 8,8, piso de visión normal ΔE 18,9 y contraste ≥ 3:1).
 * - `neutro`: gris del cubo «Otros». No pasa el piso de croma A PROPÓSITO: es la cola plegada, no una
 *   identidad, y debe leerse como gris.
 * - `anios`: rampa ordinal navy (un solo tono, claro → oscuro); pasa `--ordinal`.
 *
 * La paleta de marca pura NO pasa como categórica (el navy es demasiado oscuro y poco cromático, el
 * gris pizarra no tiene croma y el dorado sale de la banda), por eso los gráficos no la usan tal cual.
 */
export const categorico = {
  azul: "#2B63A8",
  teal: "#2A9D8F",
  coral: "#E76F51",
} as const;

export const neutro = "#8A93A1";

export const anios = {
  2027: "#8FA9C8",
  2028: "#4B6E9E",
  2029: "#1F3A5F",
} as const;

export type Anio = keyof typeof anios;

/** Series únicas: clientes (crecimiento, teal) y flujo acumulado (negativo, coral). */
export const serie = {
  clientes: categorico.teal,
  acumulado: categorico.coral,
} as const;

const luminancia = (hex: string) => {
  const canales = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = canales.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contraste = (a: string, b: string) => {
  const [claro, oscuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (oscuro + 0.05);
};

/**
 * Color del texto que va DENTRO de un relleno: blanco o tinta, el que dé más contraste. La
 * habilidad prescribe blanco, pero sobre teal y coral de la marca el blanco da ~3:1 y la tinta ~6:1.
 */
export function textoSobre(relleno: string): string {
  const tinta = "#0f1b2d";
  return contraste("#ffffff", relleno) >= contraste(tinta, relleno) ? "#ffffff" : tinta;
}
