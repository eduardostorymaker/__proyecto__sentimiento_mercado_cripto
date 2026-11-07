import { AnimatedTabs, type TabDef } from "@/components/common/animated-tabs";
import { VerFigura } from "@/components/common/figura-alterna";
import { IconChip } from "@/components/common/icon";
import { RichText } from "@/components/common/rich-text";
import { Section } from "@/components/common/section";
import { SectionHeader } from "@/components/common/section-header";
import { SpeechBubble } from "@/components/common/speech-bubble";
import { Stagger } from "@/components/common/stagger";
import { GlosarioChips } from "@/components/situacion/glosario-chips";
import { RiesgosPanel } from "@/components/situacion/riesgos-panel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { mascotas } from "@/data/mascotas";
import {
  recursos,
  requisitosFuncionales,
  requisitosNoFuncionales,
  restricciones,
  supuestos,
  type Requisito,
} from "@/data/situacion";

function Recursos() {
  return (
    <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {recursos.map((r) => (
        <div key={r.titulo} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <IconChip name={r.icono} />
          <h3 className="mt-4 text-lg font-semibold text-navy">{r.titulo}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink/80 md:text-base">
            <RichText>{r.texto}</RichText>
          </p>
        </div>
      ))}
    </Stagger>
  );
}

function ListaRequisitos({ titulo, valor, items }: { titulo: string; valor: string; items: readonly Requisito[] }) {
  return (
    <AccordionItem value={valor}>
      <AccordionTrigger className="items-center text-base text-navy">{titulo}</AccordionTrigger>
      <AccordionContent>
        <ul className="grid grid-cols-1 gap-2.5 pb-2">
          {items.map((r) => (
            <li key={r.id} className="grid grid-cols-[3.75rem_1fr] gap-2 text-sm leading-relaxed text-ink/90 md:text-base">
              <span className="font-mono text-xs font-semibold text-teal-text md:pt-1">{r.id}</span>
              <span>
                <RichText>{r.texto}</RichText>
              </span>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}

function Requisitos() {
  return (
    <div className="grid grid-cols-1 gap-8">
      <Accordion type="single" collapsible defaultValue="rf" className="rounded-2xl border border-border bg-white px-5">
        <ListaRequisitos titulo="Funcionales (RF01–RF09)" valor="rf" items={requisitosFuncionales} />
        <ListaRequisitos titulo="No funcionales (RNF01–RNF07)" valor="rnf" items={requisitosNoFuncionales} />
      </Accordion>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {(
          [
            ["Supuestos", supuestos],
            ["Restricciones", restricciones],
          ] as const
        ).map(([titulo, items]) => (
          <div key={titulo} className="rounded-2xl border border-border bg-white p-6">
            <h3 className="text-lg font-semibold text-navy">{titulo}</h3>
            <ul className="mt-3 grid grid-cols-1 gap-2">
              {items.map((i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/90 md:text-base">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-navy/60" />
                  <span>
                    <RichText>{i}</RichText>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function Riesgos() {
  return (
    <div className="grid grid-cols-1 gap-8">
      <SpeechBubble mascot="bruno" className="max-w-2xl">
        <RichText>{mascotas.situacion.texto}</RichText>
      </SpeechBubble>
      <RiesgosPanel />
      <div className="flex justify-end">
        <VerFigura id="matrizRiesgos" />
      </div>
    </div>
  );
}

const pestanas: TabDef[] = [
  { id: "recursos", label: "Recursos", content: <Recursos /> },
  { id: "requisitos", label: "Requisitos", content: <Requisitos /> },
  { id: "riesgos", label: "Riesgos", content: <Riesgos /> },
  { id: "glosario", label: "Glosario", content: <GlosarioChips /> },
];

/** `#situacion` (SPEC 7.11): recursos, requisitos, registro de riesgos con matriz y glosario del dominio. */
export function Situacion() {
  return (
    <Section id="situacion" tone="white">
      <SectionHeader id="situacion" eyebrow="Evaluación de la situación" title="Lo que tenemos, lo que necesitamos y lo que puede fallar" />
      <AnimatedTabs tabs={pestanas} label="Evaluación de la situación del proyecto" />
    </Section>
  );
}
