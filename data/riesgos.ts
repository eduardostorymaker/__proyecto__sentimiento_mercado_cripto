/** Registro de riesgos (SPEC 8; informe, Tabla 23). `p` = probabilidad e `i` = impacto, de 1 a 5. */
export interface Riesgo {
  id: string;
  riesgo: string;
  p: number;
  i: number;
  prevencion: string;
  contingencia: string;
}

export const riesgos: readonly Riesgo[] = [
  { id: "R1", riesgo: "Cambio de cuota, formato o términos en YouTube API o Google News RSS", p: 4, i: 4,
    prevencion: "Caché local, consultas optimizadas y monitoreo de errores", contingencia: "Activar fuentes alternativas autorizadas" },
  { id: "R2", riesgo: "Desbalance de clases (predominio de neutrales)", p: 3, i: 4,
    prevencion: "Muestreo estratificado para etiquetado", contingencia: "Ponderación de clases y evaluación con macro-F1" },
  { id: "R3", riesgo: "Spam, bots y comentarios promocionales en YouTube", p: 4, i: 3,
    prevencion: "Filtros por patrones, enlaces y repetición", contingencia: "Clase de descarte y revisión manual" },
  { id: "R4", riesgo: "Sarcasmo, ironía y jerga cripto", p: 4, i: 3,
    prevencion: "Glosario de dominio en la guía de etiquetado", contingencia: "Análisis de errores y ampliación dirigida del corpus" },
  { id: "R5", riesgo: "Desempeño desigual entre español e inglés", p: 3, i: 3,
    prevencion: "Corpus balanceado por idioma", contingencia: "Modelo multilingüe o modelos separados" },
  { id: "R6", riesgo: "Retrasos en el cronograma", p: 2, i: 4,
    prevencion: "Hitos semanales y priorización del MVP", contingencia: "Reducir alcance a dos activos" },
  { id: "R7", riesgo: "Noticias sindicadas que inflan el volumen", p: 3, i: 3,
    prevencion: "Deduplicación por similitud de títulos", contingencia: "Ponderar por medio único" },
  { id: "R8", riesgo: "Tratamiento indebido de datos personales", p: 2, i: 5,
    prevencion: "Seudonimización y minimización de datos", contingencia: "Protocolo de borrado y revisión legal" },
  { id: "R9", riesgo: "Sobrecosto de cómputo en la nube", p: 3, i: 2,
    prevencion: "Alertas de presupuesto y apagado automático", contingencia: "Modelos más ligeros o destilados" },
  { id: "R10", riesgo: "Uso del índice como recomendación de inversión", p: 2, i: 4,
    prevencion: "Avisos de no asesoría y documentación de límites", contingencia: "Revisión de comunicación y términos de uso" },
];

export type NivelRiesgo = "alto" | "medio" | "bajo";

/** P×I ≥ 16 → alto (coral) · 9-15 → medio (ámbar) · ≤ 8 → bajo (verde). */
export function nivelRiesgo(p: number, i: number): NivelRiesgo {
  const severidad = p * i;
  return severidad >= 16 ? "alto" : severidad >= 9 ? "medio" : "bajo";
}
