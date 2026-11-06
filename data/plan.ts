import type { Rich } from "@/data/types";

// ── #plan (SPEC 7.14 y 8; informe, 3.4 y Tablas 31-33) ────────────────────────────────────────

export const SEMANAS = 16;

export const metodologia: Rich =
  "Las fases son iterativas: la evaluación puede devolver a la preparación de datos o al modelado.";

export interface Fase {
  fase: string;
  /** Semana de inicio y de fin, de 1 a 16. */
  ini: number;
  fin: number;
  entregable: string;
}

export const fases: readonly Fase[] = [
  { fase: "Comprensión del negocio", ini: 1, fin: 2, entregable: "Informe, secciones 1 a 3" },
  { fase: "Comprensión de los datos", ini: 3, fin: 4, entregable: "Informe de datos y diccionario" },
  { fase: "Preparación y etiquetado", ini: 5, fin: 7, entregable: "Corpus etiquetado (≥ 3 000 textos)" },
  { fase: "Modelado", ini: 8, fin: 11, entregable: "Modelos y registro de experimentos" },
  { fase: "Evaluación", ini: 12, fin: 13, entregable: "Informe de evaluación" },
  { fase: "Despliegue", ini: 14, fin: 16, entregable: "Prototipo y documentación" },
];

export interface Hito {
  id: string;
  semana: number;
  nombre: string;
  criterio: string;
}

export const hitos: readonly Hito[] = [
  { id: "H1", semana: 2, nombre: "Alcance aprobado", criterio: "Objetivos, criterios de éxito y riesgos validados" },
  { id: "H2", semana: 4, nombre: "Datos iniciales", criterio: "≥ 10 000 registros e informe de calidad" },
  { id: "H3", semana: 7, nombre: "Corpus etiquetado", criterio: "≥ 3 000 textos con kappa ≥ 0,70" },
  { id: "H4", semana: 11, nombre: "Modelos entrenados", criterio: "Modelo base y Transformer con resultados en validación" },
  { id: "H5", semana: 13, nombre: "Modelo seleccionado", criterio: "Cumple los criterios NLP o tiene plan de mejora" },
  { id: "H6", semana: 16, nombre: "Prototipo entregado", criterio: "Pipeline programado, dashboard y manual" },
];

/** R responsable · A aprueba · C consultado · I informado (`A/R`: aprueba y ejecuta). */
export type Raci = "R" | "A" | "C" | "I" | "A/R";

export const raciRoles = ["CEO", "Ing. datos", "Cient. datos", "Full stack", "Comercial", "Calidad"] as const;

export interface FilaRaci {
  fase: string;
  /** Un valor por rol, en el orden de `raciRoles`. */
  v: readonly Raci[];
}

export const raci: readonly FilaRaci[] = [
  { fase: "Comprensión del negocio", v: ["A", "C", "R", "I", "R", "C"] },
  { fase: "Comprensión de los datos", v: ["I", "R", "A", "I", "I", "C"] },
  { fase: "Preparación de los datos", v: ["I", "R", "A", "I", "C", "R"] },
  { fase: "Modelado", v: ["I", "C", "A/R", "I", "I", "C"] },
  { fase: "Evaluación", v: ["A", "C", "R", "I", "C", "R"] },
  { fase: "Despliegue", v: ["A", "R", "C", "R", "C", "R"] },
];

export const raciLeyenda: Record<Raci, string> = {
  R: "Responsable",
  A: "Aprueba",
  C: "Consultado",
  I: "Informado",
  "A/R": "Aprueba y ejecuta",
};
