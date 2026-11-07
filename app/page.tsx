import type { ReactElement } from "react";
import { CasoBinance } from "@/components/sections/caso-binance";
import { Competencia } from "@/components/sections/competencia";
import { Contexto } from "@/components/sections/contexto";
import { Costos } from "@/components/sections/costos";
import { Empresa } from "@/components/sections/empresa";
import { Equipo } from "@/components/sections/equipo";
import { Hero } from "@/components/sections/hero";
import { Mercado } from "@/components/sections/mercado";
import { Negocio } from "@/components/sections/negocio";
import { Nlp } from "@/components/sections/nlp";
import { Plan } from "@/components/sections/plan";
import { Procesos } from "@/components/sections/procesos";
import { Productos } from "@/components/sections/productos";
import { PulseScore } from "@/components/sections/pulse-score";
import { Sector } from "@/components/sections/sector";
import { Situacion } from "@/components/sections/situacion";
import { sections, type SectionId } from "@/data/nav";

/**
 * Cada sección de la página, por su `id` de `data/nav.ts`. Al tipar el registro con `SectionId`, agregar
 * o quitar una sección de `nav.ts` sin tocar esta tabla no compila: el menú, el pie y el scroll-spy
 * nunca quedan desfasados de la página.
 */
const REGISTRO: Record<SectionId, () => ReactElement> = {
  inicio: () => <Hero />,
  contexto: () => <Contexto />,
  sector: () => <Sector />,
  mercado: () => <Mercado />,
  empresa: () => <Empresa />,
  productos: () => <Productos />,
  competencia: () => <Competencia />,
  "pulse-score": () => <PulseScore />,
  procesos: () => <Procesos />,
  negocio: () => <Negocio />,
  situacion: () => <Situacion />,
  costos: () => <Costos />,
  nlp: () => <Nlp />,
  "caso-binance": () => <CasoBinance />,
  plan: () => <Plan />,
  equipo: () => <Equipo />,
};

/** Página principal: las 16 secciones en el orden de `data/nav.ts`. No declara `<main>`: lo aporta `app/template.tsx`. */
export default function Home() {
  return (
    <>
      {sections.map((s) => {
        const Seccion = REGISTRO[s.id];
        return <Seccion key={s.id} />;
      })}
    </>
  );
}
