import type { IconName } from "@/components/common/icon";
import type { Rich } from "@/data/types";

// ── #empresa (SPEC 7.5) ───────────────────────────────────────────────────────────────────────

export const fichaEmpresa: readonly string[] = [
  "Lima, Perú",
  "Sociedad Anónima Cerrada",
  "FinTech / TIC",
  "SaaS B2C + B2B",
  "6 colaboradores",
  "Lanzamiento comercial: enero 2027",
];

export interface TarjetaTexto {
  titulo: string;
  icono: IconName;
  texto: Rich;
}

export const identidad: readonly TarjetaTexto[] = [
  {
    titulo: "Misión",
    icono: "Target",
    texto:
      "Convertir la conversación digital sobre criptoactivos en indicadores claros, trazables y en español, para que inversionistas y organizaciones de Latinoamérica tomen decisiones mejor informadas.",
  },
  {
    titulo: "Visión",
    icono: "Eye",
    texto:
      "Ser al 2030 la plataforma de referencia en Hispanoamérica para medir el sentimiento del mercado cripto, reconocida por la calidad de sus datos y la transparencia de sus modelos.",
  },
  {
    titulo: "Valores",
    icono: "Scale",
    texto:
      "Rigor, transparencia, responsabilidad (no emitimos recomendaciones de inversión), privacidad por diseño, innovación continua.",
  },
];

/** Estrategia genérica: diferenciación enfocada. Las descripciones son las del informe (2.1.1). */
export const propuestaDeValor =
  "entender en minutos lo que el mercado está diciendo de tu criptomoneda, en tu idioma";

export const estrategia: readonly TarjetaTexto[] = [
  {
    titulo: "Especialización lingüística",
    icono: "Languages",
    texto: "Clasificación de textos en español e inglés con un modelo ajustado a la jerga cripto.",
  },
  {
    titulo: "Trazabilidad",
    icono: "Search",
    texto:
      "Cada indicador puede desglosarse hasta los titulares y comentarios que lo originan, lo que evita el efecto de caja negra.",
  },
  {
    titulo: "Accesibilidad, desde US$ 19",
    icono: "Wallet",
    texto: "Plan gratuito y plan de pago desde US$ 19 al mes, por debajo de los planes de entrada de la competencia.",
  },
  {
    titulo: "Integración B2B",
    icono: "Plug",
    texto: "API y reportes que permiten a fintech y consultoras incorporar el sentimiento en sus propios productos.",
  },
];

// ── FODA ──────────────────────────────────────────────────────────────────────────────────────

export interface ItemFoda {
  /** Código del informe (F1, O2…), al que remiten las estrategias cruzadas. */
  codigo: string;
  texto: Rich;
}

export interface CuadranteFoda {
  clave: "F" | "O" | "D" | "A";
  titulo: "Fortalezas" | "Oportunidades" | "Debilidades" | "Amenazas";
  /** Color del borde superior de 4 px: F teal, O navy, D gold, A coral. */
  tono: "teal" | "navy" | "gold" | "coral";
  items: readonly ItemFoda[];
}

export const foda: readonly CuadranteFoda[] = [
  {
    clave: "F",
    titulo: "Fortalezas",
    tono: "teal",
    items: [
      { codigo: "F1", texto: "Especialización en español y jerga cripto" },
      { codigo: "F2", texto: "Costo de datos casi nulo" },
      { codigo: "F3", texto: "Equipo multidisciplinario" },
      { codigo: "F4", texto: "Trazabilidad del indicador" },
    ],
  },
  {
    clave: "O",
    titulo: "Oportunidades",
    tono: "navy",
    items: [
      { codigo: "O1", texto: "Usuarios cripto ×2 en 2025" },
      { codigo: "O2", texto: "Banca y fintech entrando al segmento" },
      { codigo: "O3", texto: "Mercado con TCAC de 14,3 %" },
      { codigo: "O4", texto: "Escasa oferta en español" },
    ],
  },
  {
    clave: "D",
    titulo: "Debilidades",
    tono: "gold",
    items: [
      { codigo: "D1", texto: "Marca nueva sin clientes" },
      { codigo: "D2", texto: "Dependencia de dos fuentes en el MVP" },
      { codigo: "D3", texto: "Corpus etiquetado inicial pequeño" },
      { codigo: "D4", texto: "Capital limitado para marketing" },
    ],
  },
  {
    clave: "A",
    titulo: "Amenazas",
    tono: "coral",
    items: [
      { codigo: "A1", texto: "Competidores globales que agreguen español" },
      { codigo: "A2", texto: "Cambios en cuotas o términos de APIs" },
      { codigo: "A3", texto: "Fase bajista prolongada" },
      { codigo: "A4", texto: "Regulación más exigente" },
    ],
  },
];

export interface EstrategiaCruzada {
  sigla: "FO" | "DO" | "FA" | "DA";
  /** Texto del chip. */
  corto: string;
  /** Texto del tooltip: la línea estratégica completa del informe (2.1.2). */
  detalle: string;
}

export const estrategiasCruzadas: readonly EstrategiaCruzada[] = [
  {
    sigla: "FO",
    corto: "plan gratuito en español",
    detalle: "Lanzar un plan gratuito en español para capturar el crecimiento de usuarios (F1, F2, O1, O4).",
  },
  {
    sigla: "DO",
    corto: "alianzas con fintech y exchanges",
    detalle: "Cerrar alianzas con fintech y exchanges locales que aporten distribución y datos (D1, D4, O2).",
  },
  {
    sigla: "FA",
    corto: "trazabilidad y corpus como barrera",
    detalle: "Usar la trazabilidad y el corpus propio como barrera frente a competidores globales (F1, F4, A1).",
  },
  {
    sigla: "DA",
    corto: "conectores intercambiables y cumplimiento documentado",
    detalle: "Diseñar conectores intercambiables y documentar el cumplimiento normativo (D2, A2, A4).",
  },
];

// ── Organización ──────────────────────────────────────────────────────────────────────────────

export interface Puesto {
  puesto: string;
  funciones: string;
}

export const puestos: readonly Puesto[] = [
  { puesto: "CEO", funciones: "Estrategia, finanzas, alianzas." },
  { puesto: "Ingeniero(a) de datos", funciones: "Conectores, almacenamiento, calidad." },
  { puesto: "Científico(a) de datos / NLP", funciones: "Etiquetado, modelado, evaluación." },
  { puesto: "Desarrollador(a) full stack", funciones: "Dashboard, API, pagos." },
  { puesto: "Responsable comercial y marketing", funciones: "Adquisición, ventas B2B." },
  { puesto: "Analista de operaciones y calidad", funciones: "Pruebas, documentación, cumplimiento." },
];
