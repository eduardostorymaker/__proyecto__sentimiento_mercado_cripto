import type { Rich } from "@/data/types";

/** Análisis PESTEL (SPEC 7.3). Las puntuaciones (1-5) alimentan el gráfico y las insignias. */
export interface FactorPestel {
  factor: "Político" | "Económico" | "Social" | "Tecnológico" | "Ecológico" | "Legal";
  evidencia: readonly Rich[];
  oportunidad: number;
  amenaza: number;
  implicancia: Rich;
}

export const pestelDetalle: readonly FactorPestel[] = [
  {
    factor: "Político",
    evidencia: [
      "Nuevo gobierno 2026-2031 proclamado con 50,135 % en segunda vuelta [ref:jne].",
      "Regulación cripto gradual.",
    ],
    oportunidad: 2,
    amenaza: 4,
    implicancia: "Diversificar clientes entre fintech, consultoras y medios.",
  },
  {
    factor: "Económico",
    evidencia: [
      "PBI 2026 +3,4 % e inflación 3,8 % [ref:peruretail].",
      "Bitcoin en fase bajista tras superar US$ 124 000 en ago-2025 [ref:expreso], [ref:statista_btc].",
    ],
    oportunidad: 4,
    amenaza: 3,
    implicancia: "Plan gratuito y precios bajos para captar usuarios.",
  },
  {
    factor: "Social",
    evidencia: [
      "Usuarios cripto ×2 en 2025 [ref:lemon].",
      "≈ 350 000 operadores activos de bitcoin [ref:gestion_350k].",
      "Jerga y desinformación.",
    ],
    oportunidad: 4,
    amenaza: 3,
    implicancia: "Contenido en español y filtros antispam.",
  },
  {
    factor: "Tecnológico",
    evidencia: [
      "Transformers multilingües [ref:conneau].",
      "YouTube Data API con 10 000 unidades diarias gratis [ref:yt_quota].",
    ],
    oportunidad: 5,
    amenaza: 2,
    implicancia: "Ventaja de costo; diferenciarse por calidad de datos en español.",
  },
  {
    factor: "Ecológico",
    evidencia: ["Centros de datos: 415 TWh en 2024 → ≈ 945 TWh en 2030 [ref:iea]."],
    oportunidad: 1,
    amenaza: 1,
    implicancia: "Modelos eficientes y procesamiento por lotes.",
  },
  {
    factor: "Legal",
    evidencia: [
      "PSAV bajo la UIF [ref:ds006], [ref:sbs].",
      "Ley 29733 y DS 016-2024-JUS [ref:ds016].",
      "Reglamento de IA vigente desde ene-2026 [ref:ds115], [ref:cuatrecasas].",
      "Términos de YouTube [ref:yt_terms].",
    ],
    oportunidad: 3,
    amenaza: 3,
    implicancia: "Cumplimiento por diseño: seudonimización y avisos de no asesoría.",
  },
];

/** Puntuaciones para el gráfico de barras divergentes: derivadas del detalle, sin duplicar cifras. */
export const pestel = pestelDetalle.map(({ factor, oportunidad, amenaza }) => ({ factor, oportunidad, amenaza }));
