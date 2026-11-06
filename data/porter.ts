import type { Rich } from "@/data/types";

/** Cinco fuerzas de Porter (SPEC 7.3). `nivel` va de 0 a 5. */
export interface FuerzaPorter {
  /** Nombre completo, para el acordeón. */
  fuerza: string;
  /** Nombre corto, para las etiquetas del radar. */
  corto: string;
  nivel: number;
  nivelTexto: "Alta" | "Media" | "Baja";
  argumento: Rich;
  respuesta: Rich;
}

export const porterDetalle: readonly FuerzaPorter[] = [
  {
    fuerza: "Rivalidad entre competidores",
    corto: "Rivalidad",
    nivel: 4,
    nivelTexto: "Alta",
    argumento: "Glassnode, Santiment, LunarCrush y The Tie consolidados, todos en inglés.",
    respuesta: "Diferenciación en español y precio de entrada bajo.",
  },
  {
    fuerza: "Amenaza de nuevos entrantes",
    corto: "Nuevos entrantes",
    nivel: 4,
    nivelTexto: "Alta",
    argumento: "Modelos abiertos y nube reducen barreras técnicas.",
    respuesta: "Corpus etiquetado propio y marca local.",
  },
  {
    fuerza: "Poder de los proveedores",
    corto: "Proveedores",
    nivel: 3,
    nivelTexto: "Media",
    argumento: "Dependencia de Google (YouTube API, Google News) y de la nube.",
    respuesta: "Conectores modulares y fuentes alternativas.",
  },
  {
    fuerza: "Poder de los clientes",
    corto: "Clientes",
    nivel: 4,
    nivelTexto: "Alta",
    argumento: "Costo de cambio bajo y oferta gratuita abundante.",
    respuesta: "Plan Free como embudo y valor medible.",
  },
  {
    fuerza: "Amenaza de sustitutos",
    corto: "Sustitutos",
    nivel: 3,
    nivelTexto: "Media",
    argumento: "Lectura manual, índices de miedo y codicia, análisis técnico.",
    respuesta: "Complemento trazable del texto a la señal.",
  },
];

/** Datos del radar (escala 0-5), derivados del detalle. */
export const porter = porterDetalle.map(({ corto, nivel }) => ({ fuerza: corto, nivel }));

export const porterCierre: Rich =
  "**La defensa es la especialización:** un corpus en español cripto que toma tiempo construir y es difícil de imitar. [ref:porter]";
