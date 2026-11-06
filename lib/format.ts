/**
 * Formato numérico latino para español (Perú) — SPEC 0.3, regla 1.
 *
 * `Intl.NumberFormat("es-PE")` NO sirve tal cual: devuelve `18,084.5` (coma de miles, punto decimal).
 * Aquí el redondeo lo hace `en-US` (presente en todos los motores, sin variación entre versiones de
 * ICU) y los separadores se colocan a mano, para que servidor y cliente impriman exactamente lo mismo.
 *
 *   miles    → espacio fino sin salto (U+202F)      18 084
 *   decimal  → coma                                 0,78
 *   negativo → signo menos tipográfico (U+2212)     −68 861
 *   moneda   → `US$` + espacio duro (U+00A0)        US$ 18 084  ·  −US$ 68 861
 *
 * U+202F lo trae Inter pero no JetBrains Mono: `--font-mono` (globals.css) cae a Inter para ese glifo.
 */

export const THIN_SPACE = " ";
export const NBSP = " ";
export const MINUS = "−";

export interface NumOpts {
  /** Decimales fijos. Sin él se muestran hasta 2, sin ceros sobrantes (0,78 · 18 084). */
  decimals?: number;
  /** Antepone `+` a los positivos (útil en desfases: +4 h). */
  signed?: boolean;
}

const formatters = new Map<string, Intl.NumberFormat>();
function decimalFormatter(min: number, max: number): Intl.NumberFormat {
  const key = `${min}-${max}`;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat("en-US", {
      useGrouping: false,
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    });
    formatters.set(key, f);
  }
  return f;
}

interface Parts {
  sign: string;
  body: string;
}

function toParts(n: number, { decimals, signed = false }: NumOpts): Parts {
  const min = decimals ?? 0;
  const max = decimals ?? 2;
  const raw = decimalFormatter(min, max).format(Math.abs(n)); // "18084.5"
  const [int, frac] = raw.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, THIN_SPACE);
  const body = frac ? `${grouped},${frac}` : grouped;
  const isZero = Number(raw) === 0; // −0,001 con 2 decimales se muestra "0", sin signo
  const sign = isZero ? "" : n < 0 ? MINUS : signed ? "+" : "";
  return { sign, body };
}

const EMPTY = "—";

/** `18084.5` → `18 084,5` · `0.78` → `0,78` · `−68861` → `−68 861`. */
export function formatNum(n: number, opts: NumOpts = {}): string {
  if (!Number.isFinite(n)) return EMPTY;
  const { sign, body } = toParts(n, opts);
  return sign + body;
}

/** `18084` → `US$ 18 084` · `−68861` → `−US$ 68 861`. El signo va antes de `US$`. */
export function formatUSD(n: number, opts: NumOpts = {}): string {
  if (!Number.isFinite(n)) return EMPTY;
  const { sign, body } = toParts(n, opts);
  return `${sign}US$${NBSP}${body}`;
}

/** `65.1` → `65,1 %` (espacio duro antes del %, como en el informe). */
export function formatPct(n: number, opts: NumOpts = {}): string {
  if (!Number.isFinite(n)) return EMPTY;
  const { sign, body } = toParts(n, opts);
  return `${sign}${body}${NBSP}%`;
}

/**
 * Tipografía de texto corrido (SPEC 0.3, regla 1). Los datos de `/data` se escriben con espacios
 * normales (`US$ 7 600 M`, `65,1 %`) y esta función, aplicada al mostrarlos (`<RichText>` lo hace),
 * pone espacio fino sin salto entre grupos de miles, y espacio duro tras `US$` y antes de `%`, para
 * que una cifra nunca se parta entre dos líneas.
 *
 * Solo agrupa si el bloque previo tiene 1-3 dígitos: `2027 128 clientes` no se toca, `10 000` sí.
 */
export function typo(text: string): string {
  return text
    .replace(/(?<!\d)(\d{1,3}) (?=\d{3}(?!\d))/g, `$1${THIN_SPACE}`)
    .replace(/US\$ (?=[\d−-])/g, `US$${NBSP}`)
    .replace(/ (?=%)/g, NBSP);
}

export interface FechaOpts {
  /** Zona horaria de presentación. */
  zona?: "Lima" | "UTC";
  /** Incluir hora (24 h). */
  hora?: boolean;
}

const dateFormatters = new Map<string, Intl.DateTimeFormat>();
/**
 * Fecha corta en español con zona explícita (nunca la del navegador: evita desajustes de
 * hidratación). `"2026-10-29T20:05:00+00:00"` → `29 oct` · con `hora`: `29 oct, 15:05` (Lima).
 */
export function formatFecha(iso: string, { zona = "UTC", hora = false }: FechaOpts = {}): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return EMPTY;
  const key = `${zona}-${hora}`;
  let f = dateFormatters.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat("es-PE", {
      timeZone: zona === "Lima" ? "America/Lima" : "UTC",
      day: "numeric",
      month: "short",
      ...(hora ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}),
    });
    dateFormatters.set(key, f);
  }
  return f.format(d).replace(/\./g, "");
}
