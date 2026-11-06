import type { IconName } from "@/components/common/icon";
import type { Rich } from "@/data/types";

// ── #nlp (SPEC 7.13; informe, 3.3 y Tablas 28-29) ─────────────────────────────────────────────

export const objetivoGeneral: Rich =
  "Construir y evaluar un clasificador positivo/negativo/neutral para titulares de Google News RSS y títulos, descripciones y comentarios de YouTube, con macro-F1 ≥ 0,78 en un conjunto de prueba reservado.";

export interface TareaNlp {
  nombre: "Sentimiento" | "Idioma" | "Duplicados" | "Activo" | "Agregación";
  icono: IconName;
  descripcion: Rich;
  principal?: boolean;
}

export const tareasNlp: readonly TareaNlp[] = [
  { nombre: "Sentimiento", icono: "Brain", descripcion: "Clasificación multiclase a nivel de documento.", principal: true },
  { nombre: "Idioma", icono: "Languages", descripcion: "fastText [ref:joulin]." },
  { nombre: "Duplicados", icono: "Layers", descripcion: "MinHash [ref:broder]." },
  { nombre: "Activo", icono: "Target", descripcion: "Reglas y alias BTC/ETH/SOL." },
  { nombre: "Agregación", icono: "Gauge", descripcion: "Pulse Score y detección de cambios." },
];

export interface Escalon {
  nombre: string;
  descripcion: Rich;
  /** El último escalón (teal, con insignia «Objetivo»). */
  objetivo?: boolean;
}

/** Escalera de modelos: cada escalón sube de izquierda a derecha. */
export const escalera: readonly Escalon[] = [
  { nombre: "VADER", descripcion: "Léxico [ref:hutto]." },
  { nombre: "TF-IDF + LR/SVM", descripcion: "Modelo base [ref:pedregosa]." },
  { nombre: "XLM-T", descripcion: "Preentrenado [ref:barbieri]." },
  { nombre: "XLM-RoBERTa ajustado", descripcion: "Objetivo [ref:conneau].", objetivo: true },
];

export interface MetricaNlp {
  etiqueta: string;
  meta: string;
  /** Referencia asociada (kappa de Cohen). */
  cita?: Rich;
}

export const metricasNlp: readonly MetricaNlp[] = [
  { etiqueta: "Macro-F1", meta: "≥ 0,78" },
  { etiqueta: "Accuracy", meta: "≥ 0,80" },
  { etiqueta: "F1 por clase", meta: "≥ 0,70" },
  { etiqueta: "Brecha es/en", meta: "≤ 0,05" },
  { etiqueta: "Mejora vs. base", meta: "≥ +5 p. p." },
  { etiqueta: "Kappa", meta: "≥ 0,70", cita: "[ref:cohen]" },
  { etiqueta: "Latencia", meta: "≤ 50 ms/texto" },
  { etiqueta: "Precisión de activo", meta: "≥ 0,90" },
];

export const particion = {
  etiqueta: "Partición temporal",
  tramos: [
    { nombre: "Entrenamiento", porcentaje: 70, color: "navy" },
    { nombre: "Validación", porcentaje: 15, color: "teal" },
    { nombre: "Prueba", porcentaje: 15, color: "coral" },
  ],
  notas: [
    "Casi duplicados agrupados antes de dividir.",
    "El conjunto de prueba se usa una sola vez.",
    "Intervalos por bootstrap y prueba de McNemar.",
  ],
} as const;
