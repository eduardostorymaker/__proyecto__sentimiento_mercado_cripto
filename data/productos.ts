import type { IconName } from "@/components/common/icon";
import type { Rich } from "@/data/types";

// ── #productos (SPEC 7.6) ─────────────────────────────────────────────────────────────────────

export interface Producto {
  nombre: string;
  icono: IconName;
  descripcion: Rich;
}

export const productos: readonly Producto[] = [
  {
    nombre: "Pulse Intelligence",
    icono: "LayoutDashboard",
    descripcion: "Dashboard con el Pulse Score por activo, fuente y periodo.",
  },
  {
    nombre: "Pulse Alerts",
    icono: "BellRing",
    descripcion: "Avisos cuando el índice cambia más de un umbral.",
  },
  {
    nombre: "Pulse Reports",
    icono: "FileText",
    descripcion: "Informe semanal y mensual con titulares más influyentes.",
  },
  {
    nombre: "Pulse API",
    icono: "Code",
    descripcion: "Índices históricos y casi en tiempo real.",
  },
];

export interface Plan {
  nombre: "Free" | "Individual" | "Professional" | "Business" | "Enterprise";
  segmento: "B2C" | "B2B";
  /** Precio mensual en US$. */
  precio: number;
  /** «Desde US$ …» (planes a medida). */
  desde?: boolean;
  activos: string;
  actualizacion: string;
  historico: string;
  incluye: readonly string[];
  /** Plan «Más popular»: borde gold permanente y escala 1,03 en escritorio. */
  destacado?: boolean;
}

export const planes: readonly Plan[] = [
  {
    nombre: "Free",
    segmento: "B2C",
    precio: 0,
    activos: "3",
    actualizacion: "Diaria",
    historico: "7 días",
    incluye: ["Dashboard básico"],
  },
  {
    nombre: "Individual",
    segmento: "B2C",
    precio: 19,
    activos: "10",
    actualizacion: "Cada hora",
    historico: "90 días",
    incluye: ["5 alertas"],
  },
  {
    nombre: "Professional",
    segmento: "B2C",
    precio: 49,
    activos: "30",
    actualizacion: "Cada 30 min",
    historico: "1 año",
    incluye: ["Alertas ilimitadas", "Exportación CSV"],
    destacado: true,
  },
  {
    nombre: "Business",
    segmento: "B2B",
    precio: 349,
    activos: "30",
    actualizacion: "Cada 30 min",
    historico: "2 años",
    incluye: ["API 50 000 llamadas/mes", "5 usuarios", "Reporte semanal"],
  },
  {
    nombre: "Enterprise",
    segmento: "B2B",
    precio: 799,
    desde: true,
    activos: "A medida",
    actualizacion: "Casi en tiempo real",
    historico: "Completo",
    incluye: ["API dedicada", "SLA 99,5 %", "Modelo personalizado"],
  },
];

export const planesNota: Rich =
  "Los planes de entrada de Santiment y Glassnode cuestan US$ 49/mes [ref:comparedge_s], [ref:comparedge_g]; el plan Individual está 61 % por debajo.";

export const planesBotonAviso = "Disponible desde enero 2027";

/** Segmentos de clientes: chip con tooltip. Perfil, necesidad y producto son los de la Tabla 6 del informe. */
export interface Segmento {
  chip: string;
  perfil: string;
  necesidad: string;
  productoEntrada: string;
}

export const segmentos: readonly Segmento[] = [
  {
    chip: "Inversionista minorista",
    perfil: "25-40 años, opera desde apps móviles, sigue noticias y YouTube.",
    necesidad: "Saber si el ánimo del mercado sobre su activo mejora o empeora.",
    productoEntrada: "Pulse Intelligence (Free / Individual)",
  },
  {
    chip: "Analista o creador de contenido",
    perfil: "Trader frecuente, creador de contenido o analista independiente.",
    necesidad: "Datos históricos, alertas y exportación.",
    productoEntrada: "Pulse Intelligence (Professional) y Pulse Alerts",
  },
  {
    chip: "Fintech y exchanges",
    perfil: "Plataformas de compraventa, billeteras y neobancos con oferta cripto.",
    necesidad: "Enriquecer su app con señales de mercado en español.",
    productoEntrada: "Pulse API (Business / Enterprise)",
  },
  {
    chip: "Consultoras, medios y fondos",
    perfil: "Equipos de investigación, riesgo y comunicación.",
    necesidad: "Reportes periódicos y monitoreo de reputación de activos.",
    productoEntrada: "Pulse Reports y Pulse API",
  },
];
