import type { Rich } from "@/data/types";

/**
 * Figuras del informe que la página muestra como imagen (SPEC 4.5; PLAN, sección 4). `n` y `titulo`
 * son los del índice de figuras del informe; `alt` describe lo que se ve. Las del caso Binance
 * (15 a 25) viven en `data/caso.ts`. La fuente admite `[ref:id]`; por defecto es «Elaboración propia.».
 */
export interface FiguraInforme {
  archivo: string;
  n: number;
  titulo: string;
  alt: string;
  width: number;
  height: number;
  fuente?: Rich;
}

const ELAB = "Elaboración propia.";

export const figuras = {
  latam: {
    archivo: "01-latam-volumen.png",
    n: 1,
    titulo: "Volumen de criptoactivos recibido por país, julio de 2024 a junio de 2025",
    alt: "Barras horizontales del volumen de criptoactivos recibido por país en Latinoamérica, con Perú resaltado",
    width: 1348,
    height: 690,
    fuente: "Elaboración propia con datos de Chainalysis reportados en [ref:monitor] y [ref:forbes_pe].",
  },
  embudoPeru: {
    archivo: "02-embudo-peru.png",
    n: 2,
    titulo: "Embudo de mercado en Perú: del usuario digital al inversionista cripto",
    alt: "Embudo de Perú: del usuario digital al inversionista cripto",
    width: 1248,
    height: 573,
    fuente: "Elaboración propia con datos de [ref:datareportal], [ref:forbes_pe] y [ref:gestion_350k].",
  },
  pestel: {
    archivo: "03-pestel-balance.png",
    n: 3,
    titulo: "Balance PESTEL: intensidad de oportunidades y amenazas por factor",
    alt: "Balance PESTEL de oportunidades y amenazas por factor",
    width: 1337,
    height: 772,
  },
  porter: {
    archivo: "04-porter-radar.png",
    n: 4,
    titulo: "Intensidad de las cinco fuerzas competitivas",
    alt: "Radar con la intensidad de las cinco fuerzas de Porter",
    width: 992,
    height: 976,
  },
  tamSamSom: {
    archivo: "06-tam-sam-som.png",
    n: 5,
    titulo: "Dimensionamiento del mercado (TAM, SAM y SOM)",
    alt: "Dimensionamiento del mercado: TAM, SAM y SOM",
    width: 1271,
    height: 757,
    fuente: "Elaboración propia con datos de [ref:rnm] y [ref:gestion_350k].",
  },
  posicionamiento: {
    archivo: "05-posicionamiento.png",
    n: 6,
    titulo: "Mapa de posicionamiento competitivo",
    alt: "Mapa de posicionamiento de Pulse Analytics frente a Glassnode, Santiment, LunarCrush y The Tie",
    width: 1134,
    height: 858,
  },
  mrr: {
    archivo: "10-mrr-clientes.png",
    n: 7,
    titulo: "Proyección de MRR y clientes de pago, 2027-2029",
    alt: "Proyección de MRR y de clientes de pago entre 2027 y 2029",
    width: 1462,
    height: 707,
    fuente: "Elaboración propia (modelo financiero, Anexo E).",
  },
  organigrama: {
    archivo: "07-organigrama.png",
    n: 8,
    titulo: "Organigrama de Pulse Analytics S.A.C.",
    alt: "Organigrama de Pulse Analytics S.A.C.",
    width: 1187,
    height: 634,
  },
  flujograma: {
    archivo: "08-flujograma-proceso.png",
    n: 9,
    titulo: "Flujograma del proceso de generación del índice Pulse Score",
    alt: "Flujograma del proceso de generación del Pulse Score",
    width: 1218,
    height: 942,
  },
  suscripcion: {
    archivo: "15-proceso-suscripcion.png",
    n: 10,
    titulo: "Proceso de adquisición y conversión de clientes",
    alt: "Proceso de adquisición y conversión de clientes",
    width: 1218,
    height: 450,
  },
  matrizRiesgos: {
    archivo: "12-matriz-riesgos.png",
    n: 11,
    titulo: "Matriz de probabilidad e impacto de los riesgos del proyecto",
    alt: "Matriz de probabilidad e impacto de los riesgos del proyecto",
    width: 931,
    height: 868,
  },
  flujoAcumulado: {
    archivo: "11-flujo-acumulado.png",
    n: 12,
    titulo: "Flujo de caja acumulado del plan de negocio",
    alt: "Flujo de caja acumulado con el mes de equilibrio",
    width: 1374,
    height: 675,
  },
  crispDm: {
    archivo: "13-crisp-dm.png",
    n: 13,
    titulo: "Ciclo CRISP-DM aplicado al proyecto de Pulse Analytics",
    alt: "Ciclo CRISP-DM aplicado al proyecto",
    width: 840,
    height: 880,
    fuente: "Elaboración propia a partir de [ref:chapman].",
  },
  gantt: {
    archivo: "14-gantt.png",
    n: 14,
    titulo: "Diagrama de Gantt del proyecto (16 semanas)",
    alt: "Cronograma del proyecto de 16 semanas con hitos",
    width: 1725,
    height: 582,
  },
  arquitectura: {
    archivo: "09-arquitectura-mvp.png",
    n: 26,
    titulo: "Arquitectura técnica del prototipo (MVP)",
    alt: "Arquitectura técnica del MVP",
    width: 1249,
    height: 681,
  },
} as const satisfies Record<string, FiguraInforme>;

export type FiguraId = keyof typeof figuras;

/** Fuente por defecto, también usada por el pie de las figuras del caso. */
export const FUENTE_PROPIA = ELAB;
