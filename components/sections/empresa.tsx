import { ChipTooltip } from "@/components/common/chip-tooltip";
import { FiguraInforme } from "@/components/common/figura-informe";
import { Icon, IconChip } from "@/components/common/icon";
import { PulseDivider } from "@/components/common/pulse-divider";
import { Reveal } from "@/components/common/reveal";
import { RichText } from "@/components/common/rich-text";
import { Section } from "@/components/common/section";
import { SectionHeader } from "@/components/common/section-header";
import { Stagger } from "@/components/common/stagger";
import { Subtitulo } from "@/components/common/subtitulo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  estrategia,
  estrategiasCruzadas,
  fichaEmpresa,
  foda,
  identidad,
  propuestaDeValor,
  puestos,
  type CuadranteFoda,
} from "@/data/empresa";
import { typo } from "@/lib/format";
import { cn } from "@/lib/utils";

const FODA_TONO = {
  teal: { borde: "border-t-teal", letra: "bg-teal/15 text-teal-text" },
  navy: { borde: "border-t-navy", letra: "bg-navy/10 text-navy" },
  gold: { borde: "border-t-gold", letra: "bg-gold/30 text-ink" },
  coral: { borde: "border-t-coral", letra: "bg-coral/15 text-coral-text" },
} as const satisfies Record<CuadranteFoda["tono"], { borde: string; letra: string }>;

function Cuadrante({ c }: { c: CuadranteFoda }) {
  const tono = FODA_TONO[c.tono];
  return (
    <div className={cn("rounded-2xl border border-t-4 border-border bg-white p-5 shadow-sm md:p-6", tono.borde)}>
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className={cn("grid size-9 place-items-center rounded-lg font-mono text-base font-semibold", tono.letra)}>
          {c.clave}
        </span>
        <h4 className="text-lg font-semibold text-navy">{c.titulo}</h4>
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-2.5">
        {c.items.map((i) => (
          <li key={i.codigo} className="flex gap-3 text-sm leading-relaxed text-ink/90 md:text-base">
            <span className="mt-0.5 w-7 shrink-0 font-mono text-xs font-semibold text-muted-foreground">{i.codigo}</span>
            <span>
              <RichText>{i.texto}</RichText>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** `#empresa` (SPEC 7.5): identidad, estrategia, FODA con estrategias cruzadas y organización. */
export function Empresa() {
  return (
    <Section id="empresa" tone="mist">
      <PulseDivider />
      <SectionHeader id="empresa" eyebrow="La empresa" title="Pulse Analytics S.A.C." />

      <Reveal>
        <ul className="flex flex-wrap gap-2" aria-label="Ficha de la empresa">
          {fichaEmpresa.map((f) => (
            <li key={f}>
              <Badge variant="outline" className="h-8 rounded-full bg-white px-3.5 text-sm text-navy">
                {f}
              </Badge>
            </li>
          ))}
        </ul>
      </Reveal>

      <Stagger className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {identidad.map((t) => (
          <div key={t.titulo} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <IconChip name={t.icono} />
            <h3 className="mt-4 text-lg font-semibold text-navy">{t.titulo}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/80 md:text-base">
              <RichText>{t.texto}</RichText>
            </p>
          </div>
        ))}
      </Stagger>

      <div className="mt-16 md:mt-20">
        <Subtitulo>Estrategia: diferenciación enfocada</Subtitulo>
        <Reveal>
          <p className="-mt-3 mb-6 max-w-prose text-base leading-relaxed text-ink/80">
            Nuestra propuesta de valor: <span className="font-medium text-navy">{propuestaDeValor}</span>.
          </p>
        </Reveal>
        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {estrategia.map((t) => (
            <div key={t.titulo} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <span className="grid size-10 place-items-center rounded-lg bg-teal/10 text-teal-text">
                <Icon name={t.icono} />
              </span>
              <h4 className="mt-3 text-base font-semibold text-navy">{typo(t.titulo)}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
                <RichText>{t.texto}</RichText>
              </p>
            </div>
          ))}
        </Stagger>
      </div>

      <div className="mt-16 md:mt-20">
        <Subtitulo>FODA</Subtitulo>
        <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {foda.map((c) => (
            <Cuadrante key={c.clave} c={c} />
          ))}
        </Stagger>
        <Reveal>
          <h4 className="mt-8 mb-3 text-sm font-semibold tracking-[0.12em] text-teal-text uppercase">Estrategias cruzadas</h4>
          <ul className="flex flex-wrap gap-2.5">
            {estrategiasCruzadas.map((e) => (
              <li key={e.sigla}>
                <ChipTooltip
                  className="flex min-h-10 items-center gap-2.5 rounded-xl border border-border bg-white px-3.5 py-2 text-left text-sm text-ink transition duration-150 hover:border-navy/30 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
                  contentClassName="max-w-xs"
                  tip={e.detalle}
                >
                  <span className="rounded-md bg-navy px-2 py-0.5 font-mono text-xs font-semibold text-white">{e.sigla}</span>
                  {e.corto}
                </ChipTooltip>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="mt-16 md:mt-20">
        <Subtitulo>Organización</Subtitulo>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
          <FiguraInforme id="organigrama" sizes="(min-width: 1024px) 640px, 100vw" />
          <Reveal>
            <h4 className="mb-2 text-base font-semibold text-navy">Funciones por puesto</h4>
            <Accordion type="single" collapsible className="rounded-2xl border border-border bg-white px-5">
              {puestos.map((p) => (
                <AccordionItem key={p.puesto} value={p.puesto}>
                  <AccordionTrigger className="items-center text-base text-navy">{p.puesto}</AccordionTrigger>
                  <AccordionContent>
                    <p className="pb-2 text-sm leading-relaxed text-ink/90 md:text-base">{p.funciones}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
