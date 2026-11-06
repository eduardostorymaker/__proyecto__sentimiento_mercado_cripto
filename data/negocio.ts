import type { Rich } from "@/data/types";

// ── #negocio (SPEC 7.10) ──────────────────────────────────────────────────────────────────────

export interface ObjetivoNegocio {
  id: "OB1" | "OB2" | "OB3" | "OB4" | "OB5";
  objetivo: string;
  /** Meta medible, que se muestra en una insignia. */
  meta: Rich;
}

export const objetivosNegocio: readonly ObjetivoNegocio[] = [
  { id: "OB1", objetivo: "Reducir ≥ 90 % el tiempo de monitoreo", meta: "lote de 500 textos en < 2 min (vs ≈ 8,3 h manual)" },
  { id: "OB2", objetivo: "Indicador confiable para BTC, ETH y SOL", meta: "macro-F1 ≥ 0,78" },
  { id: "OB3", objetivo: "Atender en español e inglés", meta: "brecha ≤ 5 p. p." },
  { id: "OB4", objetivo: "Costo de datos nulo", meta: "US$ 0 con Google News RSS y YouTube Data API v3" },
  { id: "OB5", objetivo: "Validar la propuesta de valor", meta: "≥ 70 % de 20 usuarios piloto" },
];

/** Puente negocio → NLP: al pasar el mouse sobre una fila se resaltan sus tres celdas. */
export interface PuenteFila {
  negocio: string;
  nlp: string;
  metrica: string;
}

export const puente: readonly PuenteFila[] = [
  { negocio: "OB1 Tiempo", nlp: "ON3 Modelo eficiente", metrica: "≤ 50 ms/texto; ciclo ≤ 2 min" },
  { negocio: "OB2 Confiabilidad", nlp: "ON1, ON3, ON4 Corpus y clasificador validados", metrica: "Macro-F1 ≥ 0,78; precisión de activo ≥ 0,90" },
  { negocio: "OB3 Bilingüe", nlp: "ON4 Evaluación por idioma", metrica: "Brecha ≤ 0,05" },
  { negocio: "OB4 Costo", nlp: "ON1 Corpus de fuentes gratuitas", metrica: "US$ 0" },
  { negocio: "OB5 Valor", nlp: "ON5 Utilidad del Pulse Score", metrica: "Evidencia exploratoria y encuesta" },
];
