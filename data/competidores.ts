import type { Rich } from "@/data/types";

/** Comparación con la competencia (SPEC 7.7). La fila de Pulse Analytics va resaltada. */
export interface Competidor {
  competidor: Rich;
  especializacion: string;
  idiomaFoco: string;
  precioEntrada: string;
  diferencia: string;
}

export const competidores: readonly Competidor[] = [
  {
    competidor: "Glassnode [ref:glassnode]",
    especializacion: "Métricas on-chain",
    idiomaFoco: "Inglés, institucional",
    precioEntrada: "US$ 49/mes (anual)",
    diferencia: "Sentimiento textual",
  },
  {
    competidor: "Santiment [ref:santiment]",
    especializacion: "Social y on-chain",
    idiomaFoco: "Inglés, global",
    precioEntrada: "US$ 49/mes",
    diferencia: "Español y fuentes LatAm",
  },
  {
    competidor: "LunarCrush [ref:lunarcrush]",
    especializacion: "Actividad social",
    idiomaFoco: "Inglés, global",
    precioEntrada: "Free + planes de pago",
    diferencia: "NLP, no solo volumen",
  },
  {
    competidor: "The Tie [ref:thetie]",
    especializacion: "Datos institucionales",
    idiomaFoco: "Inglés",
    precioEntrada: "A cotización",
    diferencia: "Oferta B2C y B2B accesible",
  },
  {
    competidor: "Pulse Analytics",
    especializacion: "Sentimiento NLP",
    idiomaFoco: "Español/inglés, Hispanoamérica",
    precioEntrada: "US$ 0 / US$ 19",
    diferencia: "—",
  },
];

/** Índice de la fila de Pulse Analytics, para `highlightRows`. */
export const FILA_PULSE = competidores.length - 1;
