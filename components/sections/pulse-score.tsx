import { Fragment } from "react";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { PulseDemo } from "@/components/sections/pulse-demo";
import { pulseScore } from "@/data/pulse-score";

/** «cᵢ» se dibuja con un subíndice HTML: la `ᵢ` Unicode no viene en las fuentes de la página. */
function ConSubindice({ children }: { children: string }) {
  return (
    <>
      {children.split("ᵢ").map((trozo, i, partes) => (
        <Fragment key={i}>
          {trozo}
          {i < partes.length - 1 && <sub>i</sub>}
        </Fragment>
      ))}
    </>
  );
}

/**
 * `#pulse-score` (SPEC 6.2 y 7.8), fondo navy: a la izquierda la fórmula y sus tres claves; a la
 * derecha la demo interactiva con Max y Bruno. Esta sección es la única aparición de las mascotas
 * en `#pulse-score` (máximo una por sección).
 */
export function PulseScore() {
  return (
    <Section id="pulse-score" tone="navy">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.16em] text-teal-soft uppercase">{pulseScore.eyebrow}</p>
          <h2 id="pulse-score-titulo" className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {pulseScore.titulo}
          </h2>

          <p className="mt-8 rounded-2xl bg-white/5 px-5 py-4 font-mono text-sm leading-relaxed text-mist ring-1 ring-white/10 md:text-base">
            <ConSubindice>{pulseScore.formula}</ConSubindice>
          </p>

          <ul className="mt-8 space-y-3 text-base leading-relaxed text-mist/90 md:text-[17px]">
            {pulseScore.puntos.map((punto) => (
              <li key={punto} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal-soft" />
                <span>
                  <ConSubindice>{punto}</ConSubindice>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <PulseDemo />
      </div>

      <p className="mt-12 max-w-prose text-xs leading-relaxed text-mist/75 italic">{pulseScore.pie}</p>
    </Section>
  );
}
