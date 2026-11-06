import raw from "@/data/caso-binance/eda_summary.json";

/**
 * Datos del caso Binance (SPEC 8.1): snapshot del notebook `docs/notebook/04_comprension_datos.ipynb`,
 * versionado en `data/caso-binance/eda_summary.json`. La web NO recalcula el análisis ni recolecta
 * nada al visitar: solo lee este archivo. Las cifras de `#caso-binance` salen siempre de aquí.
 */

export type Fuente = "google_news" | "youtube";
export type EstadoCalidad = "OK" | "REVISAR" | "CRÍTICO";

export interface CasoData {
  generado: string;
  caso: {
    nombre: string;
    evento_utc: string;
    segunda_ola_utc: string;
    inicio_ventana_utc: string;
    fin_durante_utc: string;
  };
  kpis: {
    documentos_iniciales: number;
    documentos_curados: number;
    comentarios_youtube: number;
    titulares_google_news: number;
    videos: number;
    medios: number;
    pct_espanol: number;
    dia_pico: string;
    desfase_noticias_comentarios_h: number;
    /** Puede no traer `CRÍTICO` si no hubo ninguno. */
    chequeos_calidad: Partial<Record<EstadoCalidad, number>>;
    chequeos_total: number;
    pico_documentos: number;
    documentos_antes: number;
    reaccion_h: Record<Fuente, number>;
    /** Instante exacto (UTC) del primer documento tras el ataque, por fuente. */
    primer_documento_utc: Record<Fuente, string>;
    mediana_palabras_corpus: number;
    correlacion_max: number;
    cobertura_max_length_128_pct: number;
    spam_youtube_pct: number;
  };
  volumen_diario: { t: string; google_news: number; youtube: number }[];
  volumen_6h: { t: string; google_news: number; youtube: number }[];
  /** Base de cada serie de volumen, para la nota al pie del gráfico. */
  volumen_base: {
    documentos_ventana: number;
    documentos_6h: number;
    sin_hora_exacta: number;
    anteriores_a_zoom: number;
  };
  idioma: Record<Fuente, { es: number; en: number }>;
  longitud_mediana_palabras: Record<Fuente, number>;
  top_terminos: Record<Fuente, Record<string, number>>;
  terminos_distintivos: { durante: Record<string, number>; despues: Record<string, number> };
  entidades_pct: Record<string, Record<string, number>>; // fuente → entidad → %
  aspectos_pct: Record<string, Record<string, number>>; // "Google · durante" → aspecto → %
  top_medios: Record<string, number>;
  sentimiento_lexico_pct: Record<Fuente, { negativo: number; neutral: number; positivo: number }>;
  pulse_score_diario_preliminar: { fecha: string; fuente: Fuente; score: number; n: number }[];
  titulares_ejemplo: {
    periodo: "durante" | "despues";
    fecha: string;
    medio: string;
    idioma: "es" | "en";
    titular: string;
    url: string;
    sentimiento_lexico: "positivo" | "negativo" | "neutral";
  }[];
  calidad: {
    "Dimensión": string;
    Chequeo: string;
    Fuente: string;
    Valor: string;
    Umbral: string;
    Estado: EstadoCalidad;
  }[];
  embudo_curado: { Paso: string; "Documentos restantes": number }[];
  nota: string;
}

// ── Validación al compilar ────────────────────────────────────────────────────────────────────

type Tipo = "string" | "number" | "object" | "array";

/** Claves obligatorias y su tipo. Si el notebook deja de producir una, el build falla con un mensaje claro. */
const REQUERIDAS: readonly (readonly [string, Tipo])[] = [
  ["generado", "string"],
  ...(["nombre", "evento_utc", "segunda_ola_utc", "inicio_ventana_utc", "fin_durante_utc"] as const).map(
    (k) => [`caso.${k}`, "string"] as const,
  ),
  ...(
    [
      "documentos_iniciales", "documentos_curados", "comentarios_youtube", "titulares_google_news", "videos",
      "medios", "pct_espanol", "desfase_noticias_comentarios_h", "chequeos_total", "pico_documentos",
      "documentos_antes", "mediana_palabras_corpus", "correlacion_max", "cobertura_max_length_128_pct",
      "spam_youtube_pct",
    ] as const
  ).map((k) => [`kpis.${k}`, "number"] as const),
  ["kpis.dia_pico", "string"],
  ["kpis.chequeos_calidad", "object"],
  ["kpis.reaccion_h.google_news", "number"],
  ["kpis.reaccion_h.youtube", "number"],
  ["kpis.primer_documento_utc.google_news", "string"],
  ["kpis.primer_documento_utc.youtube", "string"],
  ["volumen_diario", "array"],
  ["volumen_6h", "array"],
  ...(["documentos_ventana", "documentos_6h", "sin_hora_exacta", "anteriores_a_zoom"] as const).map(
    (k) => [`volumen_base.${k}`, "number"] as const,
  ),
  ...(["google_news", "youtube"] as const).flatMap((f) => [
    [`idioma.${f}.es`, "number"] as const,
    [`idioma.${f}.en`, "number"] as const,
    [`longitud_mediana_palabras.${f}`, "number"] as const,
    [`top_terminos.${f}`, "object"] as const,
    [`sentimiento_lexico_pct.${f}.negativo`, "number"] as const,
    [`sentimiento_lexico_pct.${f}.neutral`, "number"] as const,
    [`sentimiento_lexico_pct.${f}.positivo`, "number"] as const,
  ]),
  ["terminos_distintivos.durante", "object"],
  ["terminos_distintivos.despues", "object"],
  ["entidades_pct", "object"],
  ["aspectos_pct", "object"],
  ["top_medios", "object"],
  ["pulse_score_diario_preliminar", "array"],
  ["titulares_ejemplo", "array"],
  ["calidad", "array"],
  ["embudo_curado", "array"],
  ["nota", "string"],
];

const CAMPOS_CALIDAD = ["Dimensión", "Chequeo", "Fuente", "Valor", "Umbral", "Estado"] as const;
const ESTADOS: readonly string[] = ["OK", "REVISAR", "CRÍTICO"];

function tipoDe(valor: unknown): Tipo | "undefined" | "null" {
  if (valor === undefined) return "undefined";
  if (valor === null) return "null";
  if (Array.isArray(valor)) return "array";
  return typeof valor as Tipo;
}

function leer(objeto: unknown, ruta: string): unknown {
  return ruta.split(".").reduce<unknown>((actual, clave) => {
    return actual !== null && typeof actual === "object" ? (actual as Record<string, unknown>)[clave] : undefined;
  }, objeto);
}

/** Lanza un error legible si al JSON le falta una clave obligatoria o trae un tipo distinto. */
export function validarCaso(datos: unknown): asserts datos is CasoData {
  const problemas: string[] = [];

  for (const [ruta, esperado] of REQUERIDAS) {
    const real = tipoDe(leer(datos, ruta));
    if (real !== esperado) {
      problemas.push(real === "undefined" ? `falta «${ruta}»` : `«${ruta}» es ${real} y debería ser ${esperado}`);
    }
  }

  const calidad = leer(datos, "calidad");
  if (Array.isArray(calidad)) {
    calidad.forEach((fila, i) => {
      const faltan = CAMPOS_CALIDAD.filter((campo) => leer(fila, campo) === undefined);
      if (faltan.length) problemas.push(`calidad[${i}] sin ${faltan.join(", ")}`);
      else if (!ESTADOS.includes(String(leer(fila, "Estado")))) problemas.push(`calidad[${i}].Estado inválido`);
    });
  }

  if (problemas.length) {
    const lista = problemas.slice(0, 8).map((p) => `  · ${p}`).join("\n");
    const resto = problemas.length > 8 ? `\n  … y ${problemas.length - 8} más` : "";
    throw new Error(
      `Datos del caso Binance inválidos (data/caso-binance/eda_summary.json):\n${lista}${resto}\n` +
        "Vuelve a ejecutar docs/notebook/04_comprension_datos.ipynb y copia outputs/web/eda_summary.json a data/caso-binance/.",
    );
  }
}

// Se valida al importar el módulo: cualquier página o ruta que lo use detiene `pnpm build` si el JSON está roto.
validarCaso(raw);

export const caso: CasoData = raw as unknown as CasoData;

/**
 * Punto único de acceso: en el futuro puede leer de KV/DB sin cambiar los componentes. La sección
 * `#caso-binance` (componente de servidor) lo llama directamente; no hace `fetch` a su propia API.
 */
export async function getCasoData(): Promise<CasoData> {
  return caso;
}
