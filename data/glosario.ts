/**
 * Glosario del dominio (SPEC 7.11; informe, Tabla 24). Definiciones y efecto en el sentimiento son
 * los del informe. `tono` decide el color del chip: positivo teal, negativo coral, el resto slate.
 */
export type TonoTermino = "positivo" | "negativo" | "neutral";

export interface Termino {
  termino: string;
  definicion: string;
  /** Texto del informe sobre el efecto en el sentimiento; `null` si el término no lo modifica. */
  efecto: string | null;
  tono: TonoTermino;
}

export const glosario: readonly Termino[] = [
  { termino: "Bullish / alcista", definicion: "Expectativa de subida del precio.", efecto: "Positivo", tono: "positivo" },
  { termino: "Bearish / bajista", definicion: "Expectativa de caída del precio.", efecto: "Negativo", tono: "negativo" },
  { termino: "FUD", definicion: "Miedo, incertidumbre y duda (fear, uncertainty and doubt).", efecto: "Negativo", tono: "negativo" },
  { termino: "FOMO", definicion: "Miedo a quedarse fuera de una subida.", efecto: "Positivo o especulativo", tono: "positivo" },
  { termino: "HODL", definicion: "Mantener un activo a largo plazo pese a la volatilidad.", efecto: "Positivo", tono: "positivo" },
  { termino: "To the moon", definicion: "Expectativa de subida muy fuerte.", efecto: "Positivo (a menudo irónico)", tono: "positivo" },
  { termino: "Rug pull / scam", definicion: "Fraude en el que los creadores abandonan el proyecto.", efecto: "Negativo", tono: "negativo" },
  { termino: "Ballena (whale)", definicion: "Inversionista con grandes tenencias.", efecto: "Neutral; depende del contexto", tono: "neutral" },
  { termino: "Halving", definicion: "Reducción programada de la emisión de bitcoin.", efecto: "Neutral o positivo", tono: "neutral" },
  { termino: "Stablecoin", definicion: "Criptoactivo vinculado a una moneda fiduciaria.", efecto: "Neutral", tono: "neutral" },
  { termino: "ETF spot", definicion: "Fondo cotizado que replica el precio del activo.", efecto: "Positivo cuando se aprueba", tono: "positivo" },
  { termino: "Liquidación", definicion: "Cierre forzado de posiciones apalancadas.", efecto: "Negativo", tono: "negativo" },
  { termino: "Macro-F1", definicion: "Promedio no ponderado del F1 de cada clase.", efecto: null, tono: "neutral" },
  { termino: "Kappa de Cohen", definicion: "Acuerdo entre anotadores corregido por azar.", efecto: null, tono: "neutral" },
  { termino: "Pulse Score", definicion: "Índice de −100 a +100 que agrega el sentimiento ponderado por confianza.", efecto: null, tono: "neutral" },
  { termino: "PSAV", definicion: "Proveedor de Servicios de Activos Virtuales.", efecto: null, tono: "neutral" },
];
