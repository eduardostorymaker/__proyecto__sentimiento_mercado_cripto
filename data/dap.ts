import type { IconName } from "@/components/common/icon";
import type { Rich } from "@/data/types";

// ── #procesos (SPEC 7.9) ──────────────────────────────────────────────────────────────────────

export interface PasoProceso {
  nombre: "Recolectar" | "Limpiar" | "Clasificar" | "Agregar" | "Publicar";
  icono: IconName;
}

/** De la fuente al indicador, cada 30 minutos. */
export const pasosProceso: readonly PasoProceso[] = [
  { nombre: "Recolectar", icono: "Download" },
  { nombre: "Limpiar", icono: "Sparkles" },
  { nombre: "Clasificar", icono: "Brain" },
  { nombre: "Agregar", icono: "Gauge" },
  { nombre: "Publicar", icono: "Send" },
];

/**
 * Tipos del diagrama de análisis del proceso. En pantalla se dibujan como SVG, no como texto:
 * ○ ⇨ □ D ▽ no vienen en las fuentes de la página y cambiarían de ancho según el sistema.
 */
export type TipoDap = "operacion" | "transporte" | "inspeccion" | "demora" | "almacenamiento";

export const tiposDap: Record<TipoDap, { simbolo: string; nombre: string }> = {
  operacion: { simbolo: "○", nombre: "Operación" },
  transporte: { simbolo: "⇨", nombre: "Transporte" },
  inspeccion: { simbolo: "□", nombre: "Inspección" },
  demora: { simbolo: "D", nombre: "Demora" },
  almacenamiento: { simbolo: "▽", nombre: "Almacenamiento" },
};

export interface ActividadDap {
  n: number;
  actividad: string;
  tipo: TipoDap;
  /** Segundos por lote de 500 textos. */
  s: number;
}

export const dap: readonly ActividadDap[] = [
  { n: 1, actividad: "Disparo del ciclo por el programador", tipo: "operacion", s: 1 },
  { n: 2, actividad: "Solicitud al feed de Google News RSS", tipo: "transporte", s: 4 },
  { n: 3, actividad: "Solicitudes a YouTube Data API v3", tipo: "transporte", s: 12 },
  { n: 4, actividad: "Espera por límites de cuota", tipo: "demora", s: 10 },
  { n: 5, actividad: "Almacenamiento en capa cruda", tipo: "almacenamiento", s: 2 },
  { n: 6, actividad: "Validación de esquema", tipo: "inspeccion", s: 3 },
  { n: 7, actividad: "Limpieza y normalización", tipo: "operacion", s: 6 },
  { n: 8, actividad: "Detección de idioma", tipo: "operacion", s: 4 },
  { n: 9, actividad: "Control de duplicados", tipo: "inspeccion", s: 3 },
  { n: 10, actividad: "Identificación del activo", tipo: "operacion", s: 2 },
  { n: 11, actividad: "Clasificación de sentimiento", tipo: "operacion", s: 25 },
  { n: 12, actividad: "Control de confianza (< 0,60 a revisión)", tipo: "inspeccion", s: 1 },
  { n: 13, actividad: "Almacenamiento en base curada", tipo: "almacenamiento", s: 3 },
  { n: 14, actividad: "Cálculo del Pulse Score", tipo: "operacion", s: 2 },
  { n: 15, actividad: "Publicación en dashboard, API y alertas", tipo: "transporte", s: 2 },
];

/** Total en segundos de un lote de 500 textos (80 s → 0,16 s por texto). */
export const dapTotalSegundos = dap.reduce((suma, fila) => suma + fila.s, 0);

export const dapLote = { textos: 500, segundosPorTexto: 0.16 } as const;

/** Conteo por tipo de actividad (○ 6 · ⇨ 3 · □ 3 · D 1 · ▽ 2), derivado de la tabla. */
export const dapConteo = (Object.keys(tiposDap) as TipoDap[]).map((tipo) => ({
  tipo,
  cantidad: dap.filter((fila) => fila.tipo === tipo).length,
}));

/** Parte del tiempo que se lleva la clasificación (actividad 11): 25 de 80 s ≈ 31 %. */
export const dapPorcentajeClasificacion = Math.round(
  (100 * (dap.find((fila) => fila.n === 11)?.s ?? 0)) / dapTotalSegundos,
);

export interface KpiProceso {
  indicador: string;
  meta: string;
}

/** KPI de los procesos clave (tabla compacta). */
export const kpisProceso: readonly KpiProceso[] = [
  { indicador: "Macro-F1", meta: "≥ 0,78" },
  { indicador: "Ciclo", meta: "≤ 120 s" },
  { indicador: "Duplicados residuales", meta: "≤ 2 %" },
  { indicador: "Completitud", meta: "≥ 98 %" },
  { indicador: "Frescura", meta: "≤ 30 min" },
  { indicador: "Disponibilidad", meta: "≥ 99,5 %" },
  { indicador: "Conversión Free → pago", meta: "≥ 10 %" },
  { indicador: "Churn", meta: "≤ 4 %" },
];

export const dapResumen: Rich = "**80 s por lote de 500 textos (0,16 s/texto)**";
