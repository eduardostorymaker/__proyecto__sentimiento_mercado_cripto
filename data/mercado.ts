import type { IconName } from "@/components/common/icon";
import type { CountSpec, Rich, Tono } from "@/data/types";

// ── #contexto (SPEC 7.2) ──────────────────────────────────────────────────────────────────────

export interface Latam {
  pais: string;
  /** Miles de millones de US$, jul-2024 a jun-2025. */
  valor: number;
  destacado?: boolean;
}

export const latam: readonly Latam[] = [
  { pais: "Brasil", valor: 318.8 },
  { pais: "Argentina", valor: 93.9 },
  { pais: "México", valor: 71.2 },
  { pais: "Colombia", valor: 44.2 },
  { pais: "Perú", valor: 28.0, destacado: true },
]; // miles de millones de US$, jul-2024 a jun-2025

export const latamCaption: Rich =
  "Volumen de criptoactivos recibido, jul-2024 a jun-2025. Fuente: Chainalysis vía [ref:monitor] y [ref:forbes_pe].";

export const contextoPuntos: readonly Rich[] = [
  "Latinoamérica movió cerca de **US$ 1,5 billones** en cripto entre jul-2022 y jun-2025 [ref:chain_latam].",
  "Perú recibió **más de US$ 28 000 M** en un año y superó a Chile en volumen [ref:forbes_pe].",
  "En 2025 hubo **≈ 2,9 M de descargas** de apps cripto en Perú [ref:lemon].",
  "El BCP lanzó un piloto de compra de bitcoin y stablecoins [ref:forbes_pe].",
];

export interface TarjetaContexto {
  titulo: string;
  icono: IconName;
  texto: Rich;
}

export const contextoTarjetas: readonly TarjetaContexto[] = [
  {
    titulo: "El problema",
    icono: "MessageSquareWarning",
    texto: "La información que mueve al mercado es texto disperso, en inglés y con jerga.",
  },
  {
    titulo: "La evidencia",
    icono: "ChartLine",
    texto: "El sentimiento público tiene poder predictivo sobre criptoactivos [ref:kraaijeveld], [ref:gurgul].",
  },
  {
    titulo: "La brecha",
    icono: "Languages",
    texto: "Las plataformas de sentimiento existentes están en inglés y tienen precio institucional.",
  },
];

// ── #mercado (SPEC 7.4) ───────────────────────────────────────────────────────────────────────

export interface NivelMercado {
  nivel: "TAM" | "SAM" | "SOM";
  /** Cifra con conteo (`#mercado` sí lo permite). */
  count: CountSpec;
  /** Aclaración que acompaña a la cifra, p. ej. el año. */
  nota?: string;
  explicacion: Rich;
  tono: Tono;
}

export const tamSamSom: readonly NivelMercado[] = [
  {
    nivel: "TAM",
    count: { value: 7600, kind: "usd", suffix: " M" },
    nota: "2027",
    explicacion: "Analítica de sentimiento global: US$ 5 100 M en 2024 con TCAC de 14,3 % [ref:rnm].",
    tono: "navy",
  },
  {
    nivel: "SAM",
    count: { value: 5.8, kind: "usd", decimals: 1, suffix: " M / año" },
    explicacion:
      "17 500 inversionistas que pagarían (5 % de 350 000) × US$ 25/mes + 120 organizaciones B2B × US$ 4 800/año [ref:gestion_350k].",
    tono: "teal",
  },
  {
    nivel: "SOM",
    count: { value: 82464, kind: "usd", suffix: " ARR" },
    explicacion: "128 clientes de pago al cierre de 2027 = **1,4 % del SAM**.",
    tono: "coral",
  },
];

export interface FichaItem {
  termino: string;
  detalle: Rich;
}

/** Ficha sectorial compacta: lista de definiciones en 2 columnas. */
export const fichaSectorial: readonly FichaItem[] = [
  { termino: "Sector", detalle: "TIC – FinTech" },
  { termino: "CIIU", detalle: "6312 / 6201" },
  { termino: "Mercado inicial", detalle: "Perú (Lima)" },
  { termino: "Expansión", detalle: "Colombia, México, Chile, Argentina" },
  { termino: "Ecosistema", detalle: "346 fintech en Perú, 21 del vertical cripto [ref:finnovista], [ref:forbes_fintech]." },
];
