import type { Rich, Tono, Valor } from "@/data/types";

// Cifras de #costos (SPEC 7.12 y 8; informe, Tablas 25-27, 47-48 y Anexo E).
// Se muestran fijas, sin conteo: las cifras financieras no deben leerse a medio camino.

// ── Presupuesto del MVP ───────────────────────────────────────────────────────────────────────

export interface Partida {
  /** Concepto completo, para la tabla. */
  concepto: string;
  /** Nombre corto, para el tooltip y la leyenda. */
  corto: string;
  costo: number;
}

export const partidas: readonly Partida[] = [
  { concepto: "Equipo técnico (3 roles, 50 %, 4 meses)", corto: "Equipo técnico", costo: 9600 },
  { concepto: "Equipo de gestión y negocio (3 roles, 25 %, 4 meses)", corto: "Gestión y negocio", costo: 5400 },
  { concepto: "Cómputo en la nube", corto: "Cómputo en la nube", costo: 520 },
  { concepto: "Datos (Google News RSS y YouTube Data API v3)", corto: "Datos", costo: 0 },
  { concepto: "Etiquetado manual (doble anotación de 3 000 textos)", corto: "Etiquetado manual", costo: 800 },
  { concepto: "Herramientas, dominio y despliegue", corto: "Herramientas y despliegue", costo: 120 },
];

export const mvpSubtotal = partidas.reduce((suma, p) => suma + p.costo, 0); // 16 440
export const mvpContingencia = Math.round(mvpSubtotal * 0.1); // 10 % → 1 644
export const mvpTotal = mvpSubtotal + mvpContingencia; // 18 084

/**
 * Barra segmentada del presupuesto (SPEC 7.12; la habilidad dataviz recomienda la barra segmentada
 * alta, no la dona, para un todo de ≤ 6 partes). Se pliega la cola en «Otros» y «Datos» (US$ 0) no
 * dibuja nada; el detalle completo está en la tabla. Orden: de mayor a menor.
 */
export type ColorGrupo = "azul" | "teal" | "coral" | "neutro";

export interface GrupoPresupuesto {
  nombre: string;
  detalle?: string;
  costo: number;
  color: ColorGrupo;
}

const COLA = ["Cómputo en la nube", "Etiquetado manual", "Herramientas y despliegue"];

export const mvpBarra: readonly GrupoPresupuesto[] = [
  { nombre: "Equipo técnico", costo: partidas[0].costo, color: "azul" },
  { nombre: "Gestión y negocio", costo: partidas[1].costo, color: "teal" },
  { nombre: "Contingencia (10 %)", costo: mvpContingencia, color: "coral" },
  {
    nombre: "Otros",
    detalle: "Nube, etiquetado manual y herramientas",
    costo: partidas.filter((p) => COLA.includes(p.corto)).reduce((suma, p) => suma + p.costo, 0),
    color: "neutro",
  },
];

// ── Beneficios ────────────────────────────────────────────────────────────────────────────────

export interface Beneficio {
  destacado: Rich;
  detalle: Rich;
}

export const beneficios: readonly Beneficio[] = [
  { destacado: "> 99 % de ahorro de tiempo", detalle: "500 textos en 80 s vs ≈ 8,3 h." },
  { destacado: "≈ 80 h/mes liberadas", detalle: "por cliente B2B con el plan Business (US$ 349)." },
  { destacado: "US$ 23 084 de inversión inicial", detalle: "MVP + constitución US$ 1 500 + equipos US$ 3 500." },
];

// ── Proyección 2027-2029 ──────────────────────────────────────────────────────────────────────

/** MRR mensual en US$. El mes 1 es enero de 2027. */
export const mrr = [250,879,1508,2557,2807,3436,4065,4315,5364,5993,6622,6872,
  7732,8543,9853,10683,11543,13202,14013,14873,15703,16214,17824,18684,
  19900,22264,23480,25495,27060,29026,30242,31807,33822,35038,37402,38618]; // mes 1 = ene-2027

export const clientes = [10,21,32,43,53,64,75,85,96,107,118,128,
  148,167,187,207,227,248,267,287,307,326,346,366,
  400,436,470,505,540,574,608,643,678,712,748,782];

/** Flujo de caja acumulado. El índice 0 es la inversión inicial; el índice m, el cierre del mes m. */
export const flujoAcumulado = [-23084,-33145,-42606,-51466,-59324,-66943,-73962,-80380,
  -86559,-91736,-96313,-100289,-104026,-111842,-118883,-124674,-129672,-133848,-136440,
  -138258,-139254,-139458,-139173,-137351,-134708,-137604,-138241,-137718,-135270,
  -131328,-125508,-118527,-110051,-99651,-88090,-74271,-59291];

export const flujoAnual = {
  anios: [2027, 2028, 2029],
  ingresos: [44668, 158867, 354154],
  costos: {
    "Planilla": [96000, 132000, 186000],
    "Infraestructura cloud": [7200, 12000, 20400],
    "Marketing y ventas": [12000, 24000, 36000],
    "Datos y licencias": [2400, 7200, 12000],
    "Gastos administrativos y legales": [6000, 7200, 8400],
    "Comisiones de pasarela (4,5 %)": [2010, 7149, 15937],
  },
  flujoNeto: [-80942, -30682, 75417],
  clientesCierre: [128, 366, 782],
  arrCierre: [82464, 224208, 463416],
};

export const indicadores = {
  /** Primer mes en que el MRR cubre los costos mensuales (oct-2028). */
  equilibrioMes: 22,
  /** Desde este mes (mar-2029) el flujo mensual es positivo de forma sostenida. */
  flujoSostenidoMes: 27,
  acumuladoMes36: -59291,
  flujoMes36: 14980,
  capitalMax: 139458,
  van3: -68861,
  vanTV: 133860,
  tirTV: 0.83,
  inversionInicial: 23084,
  rondaSemilla: 150000,
};

// ── KPI y tarjetas ────────────────────────────────────────────────────────────────────────────

export interface KpiCosto {
  valor: Valor;
  etiqueta: Rich;
  tono: Extract<Tono, "navy" | "teal" | "coral">;
}

export const kpisCostos: readonly KpiCosto[] = [
  { valor: { usd: mvpTotal }, etiqueta: "Costo del MVP (16 semanas)", tono: "navy" },
  { valor: { usd: 0 }, etiqueta: "Costo de datos", tono: "teal" },
  {
    valor: { texto: `Mes ${indicadores.equilibrioMes}` },
    etiqueta: "Primer mes de equilibrio operativo (oct-2028); flujo positivo sostenido desde el mes 27",
    tono: "teal",
  },
  { valor: { usd: indicadores.capitalMax }, etiqueta: "Necesidad máxima de capital → ronda semilla de US$ 150 000", tono: "coral" },
];

export interface TarjetaEvaluacion {
  etiqueta: string;
  valor: Valor;
  detalle?: Rich;
}

export const evaluacionEconomica: readonly TarjetaEvaluacion[] = [
  {
    etiqueta: "Primer mes de equilibrio operativo",
    valor: { texto: `mes ${indicadores.equilibrioMes}` },
    detalle: "Sostenido desde el mes 27: enero y febrero de 2029 retroceden por el salto anual de costos.",
  },
  { etiqueta: "Necesidad máx. de capital", valor: { usd: indicadores.capitalMax } },
  {
    etiqueta: "VAN 3 años (25 %)",
    valor: { usd: indicadores.van3 },
    detalle: "Solo captura la etapa de inversión.",
  },
  { etiqueta: "VAN con valor terminal (g = 5 %)", valor: { usd: indicadores.vanTV } },
  {
    etiqueta: "TIR con valor terminal",
    valor: { texto: `${Math.round(indicadores.tirTV * 100)} %` },
    detalle: "Supera la tasa de descuento de 25 %.",
  },
  {
    etiqueta: "ARR 2029",
    valor: { usd: flujoAnual.arrCierre[2] },
    detalle: `${flujoAnual.clientesCierre[2]} clientes de pago.`,
  },
];

export const notaFlujoAcumulado: Rich =
  "La inversión no se recupera dentro del horizonte de tres años: el acumulado cierra en −US$ 59 291 al mes 36. Con el flujo de ese mes (US$ 14 980) se recuperaría en unos cuatro meses, hacia abril de 2030, si los costos se mantuvieran en el nivel de 2029.";

// ── Sensibilidad ──────────────────────────────────────────────────────────────────────────────

export interface Escenario {
  escenario: string;
  ingresos2029: number;
  flujo2029: number;
  van3: number;
  vanTV: number;
  base?: boolean;
  tono: Extract<Tono, "navy" | "teal" | "coral">;
}

export const sensibilidad: readonly Escenario[] = [
  { escenario: "Pesimista (−30 % clientes)", ingresos2029: 248112, flujo2029: -25853, van3: -160693, vanTV: -160693, tono: "coral" },
  { escenario: "Base", ingresos2029: 354154, flujo2029: 75417, van3: -68861, vanTV: 133860, base: true, tono: "navy" },
  { escenario: "Optimista (+30 % clientes)", ingresos2029: 459795, flujo2029: 176304, van3: 22861, vanTV: 496766, tono: "teal" },
];

export const sensibilidadNota: Rich =
  "Costos fijos constantes entre escenarios; en el pesimista no se calcula valor terminal por flujo negativo.";

export const costosPie: Rich =
  "Cifras antes de impuestos. Supuestos: precios de los planes, rampa lineal mensual de clientes, tasa de descuento de 25 %, crecimiento perpetuo de 5 % para el valor terminal.";
