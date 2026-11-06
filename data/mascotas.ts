import type { Quien } from "@/data/pulse-score";

/**
 * Apariciones de las mascotas (SPEC 6.3): máximo una por sección. Max es el toro (positivo, teal);
 * Bruno es el oso (negativo y prudencia ante el riesgo, coral). Son colegas, no rivales.
 * La de `#pulse-score` depende del valor y está en `data/pulse-score.ts`.
 */
export interface Aparicion {
  quien: Quien;
  texto: string;
}

export const mascotas = {
  situacion: { quien: "bruno", texto: "Mi trabajo es anticipar riesgos: aquí están los 10 que vigilamos y qué haremos si ocurren." },
  costos: { quien: "max", texto: "Un MVP de US$ 18 084 nos dice si el índice convence antes de pedir la ronda semilla." },
  nlp: { quien: "bruno", texto: "Si el modelo no llega a macro-F1 de 0,78, no sale a producción. Así de simple." },
  casoSentimiento: {
    quien: "bruno",
    texto: "Ojo: los titulares fueron muy negativos, pero esta lectura es preliminar. El modelo final se valida con anotación manual.",
  },
  casoCierre: {
    quien: "max",
    texto: "Con estos datos ya sabemos qué ajustar para el modelo: más comentarios en inglés, filtro antispam y una línea base.",
  },
  noEncontrada: { quien: "bruno", texto: "Esta página no existe… pero el mercado sigue. Vuelve al inicio." },
} as const satisfies Record<string, Aparicion>;
