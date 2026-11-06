import type { Rich } from "@/data/types";

/**
 * Narrativa de `#caso-binance` (SPEC 7.15). Las CIFRAS no se escriben aquí: van como marcadores
 * `{ruta}` que `fillCaso()` rellena desde `data/caso-binance/eda_summary.json` (ver `lib/caso-util.ts`).
 * Lo único que no sale del JSON está anotado con su origen.
 */

export const casoTexto = {
  eyebrow: "Comprensión de los datos · CRISP-DM fase 2",
  titulo: "Caso Binance: lo que dijeron los medios y la comunidad",
  intro:
    "El {caso.evento_utc|fechaLarga}, desde las {caso.evento_utc|hora} UTC, atacantes vaciaron hot wallets de Binance por cerca de US$ 6 300 millones, el mayor robo de criptoactivos registrado [ref:stingrai], [ref:techinsider]. Usamos el caso para probar si YouTube y Google News sirven para medir el sentimiento por entidad.",
} as const;

// ── Cronología ────────────────────────────────────────────────────────────────────────────────

export type ColorHito = "coral" | "fuente-google" | "fuente-youtube" | "teal" | "gold";

export interface Hito {
  id: "ataque" | "primer-titular" | "primer-comentario" | "reanudacion" | "pico";
  titulo: string;
  color: ColorHito;
}

/**
 * Las fechas y horas de los hitos 1, 2, 3 y 5 se leen del JSON (`caso.evento_utc`,
 * `kpis.primer_documento_utc`, `kpis.dia_pico`); los «+h» salen de `kpis.reaccion_h`.
 */
export const hitos: readonly Hito[] = [
  { id: "ataque", titulo: "Inicio del ataque", color: "coral" },
  { id: "primer-titular", titulo: "Primer titular en el corpus (+{kpis.reaccion_h.google_news|1} h)", color: "fuente-google" },
  { id: "primer-comentario", titulo: "Primer comentario en el corpus (+{kpis.reaccion_h.youtube|1} h)", color: "fuente-youtube" },
  { id: "reanudacion", titulo: "Titulares sobre la reanudación de retiros", color: "teal" },
  { id: "pico", titulo: "Pico de conversación ({kpis.pico_documentos} documentos)", color: "gold" },
];

/**
 * Único dato de la cronología que NO está en el JSON: el día en que Binance reanudó los retiros.
 * Respaldo: informe 4.3.7 («el 60 % de los titulares del 1-nov informa la reanudación de los
 * retiros») y el corpus curado: 41 de 68 titulares del 1-nov (60 %) la anuncian.
 */
export const FECHA_REANUDACION = "2026-11-01T00:00:00+00:00";

// ── KPI ───────────────────────────────────────────────────────────────────────────────────────

export const kpiEtiquetas = {
  documentos: "documentos recolectados → curados",
  titulares: "titulares de {kpis.medios} medios",
  comentarios: "comentarios de {kpis.videos} videos",
  desfase: "la comunidad reacciona después de los medios (r = {kpis.correlacion_max|2})",
  espanol: "del corpus curado en español",
  calidad: "chequeos de calidad aprobados, {kpis.chequeos_calidad.CRÍTICO} críticos",
} as const;

// ── Volumen ───────────────────────────────────────────────────────────────────────────────────

export const volumenTexto = {
  conclusion:
    "Las noticias aparecen {kpis.reaccion_h.google_news|1} h después del ataque y los comentarios {kpis.reaccion_h.youtube|1} h después; el mayor volumen fue el {kpis.dia_pico|diaMes}.",
  baseDiaria: "Vista por día: {volumen_base.documentos_ventana} documentos de la ventana del caso, antes del curado.",
  base6h:
    "Vista de 6 horas: {volumen_base.documentos_6h} documentos con hora exacta; quedan fuera {volumen_base.sin_hora_exacta} titulares fechados solo por día y {volumen_base.anteriores_a_zoom} documentos anteriores al inicio del gráfico.",
  /** Tooltip del bloque 29-oct 06:00 UTC: un artículo general, no una noticia del ataque (informe 4.3.1). */
  bloquePrevio: "Un artículo general sobre la seguridad de Binance, publicado antes del ataque.",
} as const;

// ── Idioma ────────────────────────────────────────────────────────────────────────────────────

export const idiomaTexto = {
  nota: "Google News está equilibrado; en YouTube domina el español, por lo que necesitamos más comentarios en inglés.",
  longitud: "de mediana por documento",
  longitudHint: "Mediana de palabras de todo el corpus; coincide con la Tabla 37 del informe.",
  subtokens: "cabe en 128 subtokens",
  subtokensHint: "Longitud máxima elegida para el modelo.",
} as const;

// ── Vocabulario y entidades ───────────────────────────────────────────────────────────────────

export const terminosTexto = {
  spamTooltip: "Spam detectado (se excluye en el curado)",
  durante: "Durante: magnitud del robo y promesa de cobertura.",
  despues: "Después: cómo ocurrió (entrevista de trabajo falsa) y salida de fondos.",
  eje: "← Más propio de la etapa posterior · Más propio de la crisis aguda →",
} as const;

export const entidadesTexto = {
  nota: "Binance aparece en el {entidades_pct.Google News RSS (titulares).Binance|0} % de los titulares, pero solo en el {entidades_pct.YouTube (comentarios).Binance|0} % de los comentarios.",
} as const;

// ── Sentimiento preliminar ────────────────────────────────────────────────────────────────────

export const sentimientoTexto = {
  insignia: "Preliminar · léxico",
  alerta:
    "Lectura exploratoria con un léxico bilingüe; no es el modelo final. Los titulares que informan un hecho negativo salen negativos aunque sean descriptivos.",
} as const;

// ── Calidad ───────────────────────────────────────────────────────────────────────────────────

export const calidadTexto = {
  spam: "Spam: {kpis.spam_youtube_pct|1} % de los comentarios",
  lineaBase: "Solo {kpis.documentos_antes} documentos antes del ataque: falta línea base",
} as const;

// ── Conclusiones ──────────────────────────────────────────────────────────────────────────────

/** Muestra de anotación: 604 textos. Verificado contra `muestra_anotacion.csv` (604 filas) y el informe 4.4.1. */
export const MUESTRA_ANOTACION = 604;
/** Meta del plan de proyecto (sección 3 del informe): corpus de al menos 10 000 textos. */
export const META_CORPUS = 10000;

export const conclusiones: readonly Rich[] = [
  "Los datos sirven para el caso: gratuitos, rápidos y de alta calidad estructural.",
  "Es una primera iteración: {kpis.documentos_curados} documentos curados frente a la meta de " + String(META_CORPUS).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ".",
  "Falta una línea base previa al evento.",
  "El ruido (spam, duplicados, textos cortos) está identificado y se filtra con reglas.",
  "La etiqueta de sentimiento se construirá con " + MUESTRA_ANOTACION + " textos anotados por dos personas (kappa ≥ 0,70).",
];

// ── Pie ───────────────────────────────────────────────────────────────────────────────────────

export const casoPie = "Datos generados el {generado|fechaLarga} · Notebook 04 de comprensión de datos";

// ── Figuras del notebook (galería) ────────────────────────────────────────────────────────────

export interface FiguraNotebook {
  archivo: string;
  /** Número de la figura en el informe. */
  n: number;
  titulo: string;
  width: number;
  height: number;
}

/** Figuras 15 a 25 del informe; títulos tomados de su índice de figuras. Dimensiones: PNG reales. */
export const figurasNotebook: readonly FiguraNotebook[] = [
  { archivo: "fig_4_3_1_volumen.png", n: 15, titulo: "Volumen diario y por bloques de 6 horas de titulares y comentarios", width: 1899, height: 1104 },
  { archivo: "fig_4_3_2_sincronia.png", n: 16, titulo: "Correlación cruzada entre el volumen horario de noticias y de comentarios", width: 1584, height: 496 },
  { archivo: "fig_4_3_3_idioma.png", n: 17, titulo: "Distribución de idiomas por fuente y periodo", width: 1904, height: 582 },
  { archivo: "fig_4_3_4_longitud.png", n: 18, titulo: "Distribución del número de palabras por documento", width: 1904, height: 560 },
  { archivo: "fig_4_3_5_vocabulario.png", n: 19, titulo: "Términos y bigramas más frecuentes por fuente", width: 2063, height: 1264 },
  { archivo: "fig_4_3_5b_log_odds.png", n: 20, titulo: "Términos distintivos de la crisis aguda frente a la etapa posterior", width: 1423, height: 944 },
  { archivo: "fig_4_3_6_entidades_aspectos.png", n: 21, titulo: "Entidades mencionadas y aspectos por fuente y periodo", width: 2223, height: 751 },
  { archivo: "fig_4_3_6b_medios_videos.png", n: 22, titulo: "Medios con más titulares y comentarios por video", width: 2063, height: 656 },
  { archivo: "fig_4_3_7_sentimiento_preliminar.png", n: 23, titulo: "Sentimiento léxico por fuente y periodo, y Pulse Score diario preliminar", width: 2062, height: 564 },
  { archivo: "fig_4_4_calidad.png", n: 24, titulo: "Resultado de la verificación de calidad por dimensión", width: 1583, height: 613 },
  { archivo: "fig_4_4b_embudo.png", n: 25, titulo: "Del corpus inicial al corpus curado", width: 1584, height: 560 },
];
