import { ArrowDown, ArrowRight } from "lucide-react";
import { Icon } from "@/components/common/icon";
import { Kpi } from "@/components/common/kpi";
import { PulseDivider } from "@/components/common/pulse-divider";
import { Reveal } from "@/components/common/reveal";
import { RichText } from "@/components/common/rich-text";
import { Section } from "@/components/common/section";
import { SectionHeader } from "@/components/common/section-header";
import { SpeechBubble } from "@/components/common/speech-bubble";
import { Stagger } from "@/components/common/stagger";
import { Subtitulo } from "@/components/common/subtitulo";
import { ParticionBar } from "@/components/nlp/particion-bar";
import { Badge } from "@/components/ui/badge";
import { mascotas } from "@/data/mascotas";
import { escalera, metricasNlp, objetivoGeneral, particion, tareasNlp } from "@/data/nlp";
import { cn } from "@/lib/utils";

/** Alto mínimo de cada escalón en escritorio: cada uno es más alto que el anterior. */
const ALTOS = ["md:min-h-36", "md:min-h-44", "md:min-h-52", "md:min-h-60"] as const;

/** `#nlp` (SPEC 7.13): tareas, escalera de modelos, métricas de éxito y estrategia de evaluación. */
export function Nlp() {
  return (
    <Section id="nlp" tone="white">
      <PulseDivider />
      <SectionHeader
        id="nlp"
        eyebrow="Objetivos de NLP"
        title="Un clasificador de sentimiento de 3 clases, en español e inglés"
        subtitle={<RichText>{objetivoGeneral}</RichText>}
      />

      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {tareasNlp.map((t) => (
          <div
            key={t.nombre}
            className={cn(
              "rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal/40 hover:shadow-lg hover:shadow-navy/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              t.principal ? "border-2 border-teal bg-teal/5" : "border-border",
            )}
          >
            <span className="grid size-10 place-items-center rounded-lg bg-mist text-navy">
              <Icon name={t.icono} />
            </span>
            <h3 className="mt-3 flex flex-wrap items-center gap-2 text-base font-semibold text-navy">
              {t.nombre}
              {t.principal && <Badge className="h-5 rounded-full bg-teal-text px-2 text-white">Principal</Badge>}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
              <RichText>{t.descripcion}</RichText>
            </p>
          </div>
        ))}
      </Stagger>

      <div className="mt-16 md:mt-20">
        <Subtitulo>Escalera de modelos</Subtitulo>
        <Reveal>
          <ol className="grid grid-cols-1 items-stretch gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-end md:gap-3">
            {escalera.flatMap((e, i) => {
              const ultimo = i === escalera.length - 1;
              const escalon = (
                <li
                  key={e.nombre}
                  className={cn(
                    "flex flex-col justify-end rounded-2xl border p-5",
                    ALTOS[i],
                    e.objetivo ? "border-teal-text bg-teal-text text-white" : "border-border bg-mist text-ink",
                  )}
                >
                  <span className={cn("font-mono text-xs font-semibold", e.objetivo ? "text-white/85" : "text-teal-text")}>Escalón {i + 1}</span>
                  <span className="mt-1 text-lg leading-snug font-semibold">{e.nombre}</span>
                  <span className={cn("mt-1 text-sm", e.objetivo ? "text-white/90" : "text-ink/80")}>
                    <RichText tone={e.objetivo ? "dark" : "light"}>{e.descripcion}</RichText>
                  </span>
                  {e.objetivo && <Badge className="mt-3 h-6 w-fit rounded-full bg-gold px-3 text-ink">Objetivo</Badge>}
                </li>
              );
              if (ultimo) return [escalon];
              return [
                escalon,
                <li key={`${e.nombre}-flecha`} aria-hidden="true" className="grid place-items-center py-0.5 text-teal-text md:pb-6">
                  <ArrowDown className="size-5 md:hidden" strokeWidth={1.75} />
                  <ArrowRight className="hidden size-5 md:block" strokeWidth={1.75} />
                </li>,
              ];
            })}
          </ol>
        </Reveal>
      </div>

      <div className="mt-16 md:mt-20">
        <Subtitulo>Métricas de éxito</Subtitulo>
        <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metricasNlp.map((m) => (
            <Kpi
              key={m.etiqueta}
              card
              size="sm"
              tone="navy"
              value={m.meta}
              label={
                <>
                  {m.etiqueta}
                  {m.cita && (
                    <>
                      {" "}
                      <RichText>{m.cita}</RichText>
                    </>
                  )}
                </>
              }
              className="h-full"
            />
          ))}
        </Stagger>
      </div>

      <div className="mt-16 md:mt-20">
        <Subtitulo>Estrategia de evaluación</Subtitulo>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0 rounded-2xl border border-border bg-white p-5 md:p-6">
            <p className="mb-3 text-sm font-semibold text-navy">{particion.etiqueta}</p>
            <ParticionBar />
          </div>
          <Stagger as="ul" className="grid grid-cols-1 gap-4">
            {particion.notas.map((n) => (
              <li key={n} className="flex gap-3 text-base leading-relaxed text-ink/90">
                <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-teal" />
                {n}
              </li>
            ))}
          </Stagger>
        </div>
      </div>

      <Reveal>
        <SpeechBubble mascot="bruno" className="mt-14 max-w-2xl">
          <RichText>{mascotas.nlp.texto}</RichText>
        </SpeechBubble>
      </Reveal>
    </Section>
  );
}
