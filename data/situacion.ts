import type { IconName } from "@/components/common/icon";
import type { Rich } from "@/data/types";

// ── #situacion (SPEC 7.11) ────────────────────────────────────────────────────────────────────

export interface Recurso {
  titulo: "Humanos" | "Datos" | "Software" | "Nube";
  icono: IconName;
  texto: Rich;
}

export const recursos: readonly Recurso[] = [
  { titulo: "Humanos", icono: "Users", texto: "6 integrantes, 50 % técnicos / 25 % gestión, 16 semanas." },
  { titulo: "Datos", icono: "Database", texto: "Google News RSS, YouTube Data API v3, precios de referencia." },
  {
    titulo: "Software",
    icono: "Wrench",
    texto: "Python, scikit-learn, Transformers, Label Studio, PostgreSQL, Streamlit, FastAPI — código abierto.",
  },
  { titulo: "Nube", icono: "Cloud", texto: "GPU para ajuste fino, VM y base de datos; pago por uso." },
];

export interface Requisito {
  id: string;
  texto: Rich;
}

/** Requisitos funcionales (informe, Tabla 21). */
export const requisitosFuncionales: readonly Requisito[] = [
  { id: "RF01", texto: "Recolectar periódicamente noticias y videos/comentarios para consultas por activo." },
  { id: "RF02", texto: "Almacenar cada registro crudo con fuente, fechas e ID." },
  { id: "RF03", texto: "Normalizar texto conservando el original." },
  { id: "RF04", texto: "Detectar idioma y descartar otros." },
  { id: "RF05", texto: "Eliminar duplicados y casi duplicados." },
  { id: "RF06", texto: "Asignar el activo con diccionario de alias." },
  { id: "RF07", texto: "Clasificar sentimiento con confianza." },
  { id: "RF08", texto: "Calcular el Pulse Score por activo, fuente y ventana." },
  { id: "RF09", texto: "Mostrar índice, volumen y textos de origen en el dashboard." },
];

/** Requisitos no funcionales (informe, Tabla 22). */
export const requisitosNoFuncionales: readonly Requisito[] = [
  { id: "RNF01", texto: "Rendimiento: 500 textos en ≤ 2 min en CPU." },
  { id: "RNF02", texto: "Escalabilidad: nuevas fuentes por conector." },
  { id: "RNF03", texto: "Trazabilidad: todo indicador reconstruible." },
  { id: "RNF04", texto: "Privacidad: seudonimizar autores." },
  { id: "RNF05", texto: "Cumplimiento: respetar cuotas y políticas [ref:yt_policies]." },
  { id: "RNF06", texto: "Reproducibilidad: semillas y versionado." },
  { id: "RNF07", texto: "Seguridad: secretos en gestor y acceso autenticado." },
];

export const supuestos: readonly Rich[] = [
  "Fuentes estables.",
  "≥ 10 000 textos.",
  "Titulares con señal suficiente.",
  "Kappa ≥ 0,70.",
];

export const restricciones: readonly Rich[] = [
  "Solo 2 fuentes.",
  "Sin cuerpo de la noticia.",
  "Cuota de YouTube.",
  "16 semanas y US$ 18 084.",
  "Sin predicción de precios ni recomendaciones.",
];
