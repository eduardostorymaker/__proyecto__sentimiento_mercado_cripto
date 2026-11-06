/**
 * Navegación y orden de las secciones (SPEC 7.0). Única fuente de verdad para el menú, el pie de
 * página y el scroll-spy.
 */

/** Todas las secciones de la página, en el orden en que aparecen en `app/page.tsx`. */
export const sections = [
  { id: "inicio", label: "Inicio" },
  { id: "contexto", label: "Contexto" },
  { id: "sector", label: "Sector" },
  { id: "mercado", label: "Mercado" },
  { id: "empresa", label: "Empresa" },
  { id: "productos", label: "Productos" },
  { id: "competencia", label: "Competencia" },
  { id: "pulse-score", label: "Pulse Score" },
  { id: "procesos", label: "Procesos" },
  { id: "negocio", label: "Negocio" },
  { id: "situacion", label: "Situación" },
  { id: "costos", label: "Costos" },
  { id: "nlp", label: "NLP" },
  { id: "caso-binance", label: "Caso Binance" },
  { id: "plan", label: "Plan" },
  { id: "equipo", label: "Equipo" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/** Enlaces del menú. Mercado va antes que Empresa para respetar el orden real de la página. */
const NAV_IDS = [
  "contexto",
  "mercado",
  "empresa",
  "pulse-score",
  "costos",
  "nlp",
  "caso-binance",
  "plan",
] as const satisfies readonly SectionId[];

export type NavId = (typeof NAV_IDS)[number];

const labelOf = (id: SectionId) => sections.find((s) => s.id === id)!.label;

export const navLinks: readonly { id: NavId; label: string }[] = NAV_IDS.map((id) => ({
  id,
  label: labelOf(id),
}));

export const REFERENCIAS_HREF = "/referencias";

const order = new Map<SectionId, number>(sections.map((s, i) => [s.id, i]));

/**
 * Enlace del menú que debe verse activo cuando `current` es la sección visible.
 * Las secciones sin enlace (sector, productos, equipo…) mantienen activo el último enlace anterior;
 * `inicio` no activa ninguno.
 */
export function activeNavId(current: SectionId): NavId | null {
  const at = order.get(current)!;
  let active: NavId | null = null;
  for (const link of navLinks) {
    if (order.get(link.id)! <= at) active = link.id;
  }
  return active;
}
