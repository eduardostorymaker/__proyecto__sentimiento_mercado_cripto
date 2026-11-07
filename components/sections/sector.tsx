import { Lightbulb } from "lucide-react";
import { ChartCard } from "@/components/charts/chart-shell";
import { PestelChart } from "@/components/charts/pestel-chart";
import { PorterRadar } from "@/components/charts/porter-radar";
import { AnimatedTabs, type TabDef } from "@/components/common/animated-tabs";
import { VerFigura } from "@/components/common/figura-alterna";
import { Reveal } from "@/components/common/reveal";
import { RichText } from "@/components/common/rich-text";
import { Section } from "@/components/common/section";
import { SectionHeader } from "@/components/common/section-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Subtitulo } from "@/components/common/subtitulo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert } from "@/components/ui/alert";
import { pestel, pestelDetalle, type FactorPestel } from "@/data/pestel";
import { porterCierre, porterDetalle } from "@/data/porter";

function FactorTab({ f }: { f: FactorPestel }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
      <div className="flex flex-wrap gap-2">
        <StatusBadge kind="oportunidad">Oportunidad {f.oportunidad} de 5</StatusBadge>
        <StatusBadge kind="amenaza">Amenaza {f.amenaza} de 5</StatusBadge>
      </div>
      <ul className="mt-5 grid grid-cols-1 gap-2.5">
        {f.evidencia.map((e) => (
          <li key={e} className="flex gap-3 text-sm leading-relaxed text-ink/90 md:text-base">
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-navy/60" />
            <span>
              <RichText>{e}</RichText>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-ink md:text-base">
        <strong className="font-semibold text-navy">Implicancia:</strong> <RichText>{f.implicancia}</RichText>
      </p>
    </div>
  );
}

const pestanas: TabDef[] = pestelDetalle.map((f) => ({ id: f.factor, label: f.factor, content: <FactorTab f={f} /> }));

/** `#sector` (SPEC 7.3): balance PESTEL con una pestaña por factor y fuerzas de Porter con acordeón. */
export function Sector() {
  return (
    <Section id="sector" tone="mist">
      <SectionHeader id="sector" eyebrow="Análisis del sector" title="Un sector atractivo, pero competitivo" />

      <Subtitulo>Entorno: balance PESTEL</Subtitulo>
      <ChartCard title="Oportunidades y amenazas por factor" heading="h4">
        <PestelChart filas={pestel} />
      </ChartCard>
      <div className="mt-3 flex justify-end">
        <VerFigura id="pestel" />
      </div>
      <AnimatedTabs tabs={pestanas} label="Detalle de cada factor del PESTEL" className="mt-8" />

      <div className="mt-16 md:mt-20">
        <Subtitulo>Competencia en el sector: cinco fuerzas de Porter</Subtitulo>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <ChartCard title="Intensidad de cada fuerza (0 a 5)" heading="h4">
              <PorterRadar fuerzas={porterDetalle} />
            </ChartCard>
            <div className="mt-3 flex justify-end">
              <VerFigura id="porter" />
            </div>
          </div>
          <Reveal>
            <Accordion type="single" collapsible defaultValue={porterDetalle[0].fuerza} className="rounded-2xl border border-border bg-white px-5">
              {porterDetalle.map((f) => (
                <AccordionItem key={f.fuerza} value={f.fuerza}>
                  <AccordionTrigger className="items-center gap-3 text-base text-navy">
                    <span className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1.5">
                      {f.fuerza}
                      <StatusBadge kind={f.nivelTexto === "Alta" ? "alto" : f.nivelTexto === "Media" ? "medio" : "bajo"}>
                        {f.nivelTexto} ({f.nivel})
                      </StatusBadge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <dl className="grid grid-cols-1 gap-3 pb-2 text-sm leading-relaxed text-ink/90 md:text-base">
                      <div>
                        <dt className="font-semibold text-navy">Argumento</dt>
                        <dd>
                          <RichText>{f.argumento}</RichText>
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-navy">Respuesta de Pulse</dt>
                        <dd>
                          <RichText>{f.respuesta}</RichText>
                        </dd>
                      </div>
                    </dl>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
        <Reveal>
          <Alert role="note" className="mt-10 border-teal/40 bg-teal/10 text-ink">
            <Lightbulb className="size-4 text-teal-text" strokeWidth={1.75} aria-hidden="true" />
            <p className="text-base">
              <RichText>{porterCierre}</RichText>
            </p>
          </Alert>
        </Reveal>
      </div>
    </Section>
  );
}
