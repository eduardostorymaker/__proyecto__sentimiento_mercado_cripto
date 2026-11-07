import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeader } from "@/components/common/section-header";
import { Stagger } from "@/components/common/stagger";
import { Subtitulo } from "@/components/common/subtitulo";
import { RichText } from "@/components/common/rich-text";
import { objetivosNegocio, puente } from "@/data/negocio";
import { typo } from "@/lib/format";

const CELDA =
  "rounded-xl border border-border bg-white px-4 py-3 text-sm leading-snug text-ink transition-colors duration-150 group-hover/fila:border-teal/50 group-hover/fila:bg-teal/10 group-focus-within/fila:border-teal/50 group-focus-within/fila:bg-teal/10";

/** Flecha que avanza entre dos celdas (gira a vertical en móvil). El span interior es el que se anima. */
function Flecha() {
  return (
    <span aria-hidden="true" className="grid place-items-center text-teal-text max-md:rotate-90">
      <span className="flecha-puente block">
        <ArrowRight className="size-5" strokeWidth={1.75} />
      </span>
    </span>
  );
}

/** `#negocio` (SPEC 7.10): cinco objetivos de negocio y el puente hacia los objetivos de NLP. */
export function Negocio() {
  return (
    <Section id="negocio" tone="mist">
      <SectionHeader id="negocio" eyebrow="Comprensión del negocio" title="Cada métrica técnica responde a un objetivo de negocio" />

      <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {objetivosNegocio.map((o) => (
          <div
            key={o.id}
            className="flex flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal/40 hover:shadow-lg hover:shadow-navy/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <p aria-hidden="true" className="font-mono text-4xl leading-none font-semibold text-teal-text">
              {o.id}
            </p>
            <h3 className="mt-3 text-base leading-snug font-semibold text-navy">
              <span className="sr-only">{o.id}. </span>
              {o.objetivo}
            </h3>
            <p className="mt-4 rounded-lg bg-teal/10 px-3 py-2 text-sm leading-snug font-medium text-teal-text">
              <span className="sr-only">Meta: </span>
              <RichText>{o.meta}</RichText>
            </p>
          </div>
        ))}
      </Stagger>

      <div className="mt-16 md:mt-20">
        <Subtitulo>Puente entre negocio y NLP</Subtitulo>
        {/* Encabezados visibles solo en escritorio; cada celda lleva su propio rótulo para lectores de pantalla. */}
        <Reveal>
          <div aria-hidden="true" className="mb-3 hidden grid-cols-[1fr_2rem_1fr_2rem_1fr] gap-x-2 px-1 text-xs font-semibold tracking-[0.1em] text-teal-text uppercase md:grid">
            <span>Objetivo de negocio</span>
            <span />
            <span>Objetivo NLP</span>
            <span />
            <span>Métrica de control</span>
          </div>
          <ul className="grid grid-cols-1 gap-4 md:gap-3">
            {puente.map((f) => (
              <li
                key={f.negocio}
                className="group/fila grid grid-cols-1 gap-1 md:grid-cols-[1fr_2rem_1fr_2rem_1fr] md:items-stretch md:gap-x-2"
              >
                <div className={CELDA}>
                  <span className="sr-only">Objetivo de negocio: </span>
                  <span className="font-semibold text-navy">{f.negocio}</span>
                </div>
                <Flecha />
                <div className={CELDA}>
                  <span className="sr-only">Objetivo NLP: </span>
                  {f.nlp}
                </div>
                <Flecha />
                <div className={CELDA}>
                  <span className="sr-only">Métrica de control: </span>
                  <span className="font-mono text-[0.8125rem] tabular-nums">{typo(f.metrica)}</span>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
