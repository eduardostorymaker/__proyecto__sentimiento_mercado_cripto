import type { Rich } from "@/data/types";

// ── #pulse-score: demo interactiva (SPEC 6.2) ─────────────────────────────────────────────────

export const pulseScore = {
  eyebrow: "Pulse Score",
  titulo: "Un número para el ánimo del mercado",
  formula: "Pulse Score = 100 × (Σ cᵢ·positivo − Σ cᵢ·negativo) / Σ cᵢ",
  puntos: [
    "Rango −100 a +100.",
    "cᵢ = confianza del modelo.",
    "Siempre se muestra con el número de textos que lo respaldan.",
  ],
  sliderLabel: "Valor de ejemplo del Pulse Score",
  rotuloEjemplo: "Ejemplo ilustrativo",
  pie: "Ejemplo ilustrativo. Los indicadores de Pulse Analytics no constituyen asesoría de inversión.",
} as const;

/** Valores de los tres botones rápidos bajo el control deslizante. */
export const valoresRapidos = [
  { etiqueta: "Positivo (+65)", valor: 65 },
  { etiqueta: "Neutral (0)", valor: 0 },
  { etiqueta: "Negativo (−58)", valor: -58 },
] as const;

export type Quien = "max" | "bruno" | "both";

export interface MensajePulse {
  quien: Quien;
  mensaje: string;
}

/** Mensaje de las mascotas según el valor: ≥ 20 Max · −19 a 19 ambos · ≤ −20 Bruno. */
export function mensajePulse(valor: number): MensajePulse {
  if (valor >= 20) {
    return {
      quien: "max",
      mensaje: "¡La conversación sobre este activo está en positivo! Revisa qué titulares impulsan el índice antes de decidir.",
    };
  }
  if (valor <= -20) {
    return {
      quien: "bruno",
      mensaje: "Ojo: el sentimiento se volvió negativo. Mira qué noticias lo explican y cuida tu riesgo.",
    };
  }
  return {
    quien: "both",
    mensaje: "Mercado dividido: las opiniones están equilibradas. Buen momento para mirar los datos con calma.",
  };
}

/** Número de textos que respaldan el valor, solo ilustrativo: n = 480 + |valor| × 3. */
export const textosDeEjemplo = (valor: number) => 480 + Math.abs(valor) * 3;

export const notaPulse: Rich = "Basado en **{n}** textos";
