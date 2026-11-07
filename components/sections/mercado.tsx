import { CountUp } from "@/components/common/count-up";
import { FiguraInforme } from "@/components/common/figura-informe";
import { Reveal } from "@/components/common/reveal";
import { RichText } from "@/components/common/rich-text";
import { Section } from "@/components/common/section";
import { SectionHeader } from "@/components/common/section-header";
import { Stagger } from "@/components/common/stagger";
import { fichaSectorial, tamSamSom, type NivelMercado } from "@/data/mercado";
import { typo } from "@/lib/format";
import { cn } from "@/lib/utils";

const TONO = {
  navy: { borde: "border-l-navy", valor: "text-navy" },
  teal: { borde: "border-l-teal", valor: "text-teal-text" },
  coral: { borde: "border-l-coral", valor: "text-coral-text" },
  gold: { borde: "border-l-gold", valor: "text-ink" },
} as const;

function Nivel({ n }: { n: NivelMercado }) {
  const tono = TONO[n.tono];
  return (
    <div className={cn("rounded-2xl border border-l-4 border-border bg-white p-5 shadow-sm md:p-6", tono.borde)}>
      <div className="flex items-baseline gap-2">
        <h3 className="text-sm font-semibold tracking-[0.12em] text-ink/70 uppercase">{n.nivel}</h3>
        {n.nota && <span className="text-xs text-muted-foreground">{n.nota}</span>}
      </div>
      {/* Con conteo: `#mercado` es una de las tres secciones donde el spec lo permite. */}
      <p className={cn("mt-1.5 font-mono text-2xl leading-tight font-semibold tabular-nums md:text-3xl", tono.valor)}>
        <CountUp {...n.count} />
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        <RichText>{n.explicacion}</RichText>
      </p>
    </div>
  );
}

/** `#mercado` (SPEC 7.4): TAM, SAM y SOM con conteo y ficha sectorial. */
export function Mercado() {
  return (
    <Section id="mercado" tone="white">
      <SectionHeader id="mercado" eyebrow="Mercado" title={typo("Un nicho concreto dentro de un mercado de US$ 7 600 millones")} />

      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <FiguraInforme id="tamSamSom" sizes="(min-width: 1024px) 560px, 100vw" />
        <Stagger className="grid grid-cols-1 gap-4">
          {tamSamSom.map((n) => (
            <Nivel key={n.nivel} n={n} />
          ))}
        </Stagger>
      </div>

      <Reveal>
        <dl className="mt-14 grid grid-cols-1 gap-x-10 gap-y-4 rounded-2xl border border-border bg-mist p-6 sm:grid-cols-2 md:p-8">
          {fichaSectorial.map((f) => (
            <div key={f.termino} className="grid grid-cols-[8.5rem_1fr] gap-3 text-sm md:text-base">
              <dt className="font-semibold text-navy">{f.termino}</dt>
              <dd className="text-ink/90">
                <RichText>{f.detalle}</RichText>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
