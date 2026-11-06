import type { CountSpec, Rich } from "@/data/types";

/** Hero (SPEC 7.1). */
export const hero = {
  eyebrow: "FinTech · NLP · Lima, Perú",
  title: "Entiende en minutos lo que el mercado dice de tu criptomoneda, en tu idioma.",
  subtitle:
    "Pulse Analytics convierte noticias y comentarios en español e inglés en un índice de sentimiento por activo, trazable hasta el texto que lo origina.",
  primaryCta: { label: "Ver el Pulse Score", href: "#pulse-score" },
  secondaryCta: { label: "Costos y viabilidad", href: "#costos" },
} as const;

export interface HeroKpi {
  /** Cifra con conteo (el hero sí lo permite). */
  count: CountSpec;
  label: Rich;
}

/** Franja de KPIs que se superpone al borde inferior del hero (SPEC 7.1). */
export const heroKpis: readonly HeroKpi[] = [
  {
    count: { value: 28000, kind: "usd", suffix: " M" },
    label: "criptoactivos recibidos por Perú (jul-2024 a jun-2025) [ref:forbes_pe]",
  },
  {
    count: { value: 1.28, decimals: 2, suffix: " M" },
    label: "peruanos con criptoactivos (3,7 % de la población) [ref:forbes_pe]",
  },
  {
    count: { value: 2, suffix: "×" },
    label: "crecimiento de usuarios cripto en Perú en 2025 [ref:lemon]",
  },
  {
    count: { value: 18084, kind: "usd" },
    label: "costo total del MVP (16 semanas)",
  },
];
