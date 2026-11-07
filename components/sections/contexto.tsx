import { ChartCard } from "@/components/charts/chart-shell";
import { LatamBar } from "@/components/charts/latam-bar";
import { VerFigura } from "@/components/common/figura-alterna";
import { FiguraInforme } from "@/components/common/figura-informe";
import { IconChip } from "@/components/common/icon";
import { RichText } from "@/components/common/rich-text";
import { Section } from "@/components/common/section";
import { SectionHeader } from "@/components/common/section-header";
import { Stagger } from "@/components/common/stagger";
import { contextoPuntos, contextoTarjetas, latam, latamCaption } from "@/data/mercado";

/**
 * `#contexto` (SPEC 7.2). Va justo después del hero: la franja de KPI se superpone 64 px al borde
 * inferior del hero, de ahí el relleno superior mayor (`pt-44`).
 */
export function Contexto() {
  return (
    <Section id="contexto" tone="white" className="pt-44 md:pt-44">
      <SectionHeader id="contexto" eyebrow="Contexto" title="Latinoamérica es un polo cripto, y Perú crece rápido" />

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <Stagger as="ul" className="grid grid-cols-1 gap-5">
          {contextoPuntos.map((punto) => (
            <li key={punto} className="flex gap-3 text-base leading-relaxed text-ink/90 md:text-[17px]">
              <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-teal" />
              <span>
                <RichText>{punto}</RichText>
              </span>
            </li>
          ))}
        </Stagger>

        <div>
          <ChartCard title="Volumen de criptoactivos recibido por país">
            <LatamBar datos={latam} />
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              <RichText>{latamCaption}</RichText>
            </p>
          </ChartCard>
          <div className="mt-3 flex justify-end">
            <VerFigura id="latam" />
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-20">
        <FiguraInforme id="embudoPeru" className="mx-auto max-w-4xl" />
      </div>

      <Stagger className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
        {contextoTarjetas.map((t) => (
          <div key={t.titulo} className="rounded-2xl border border-border bg-mist p-6">
            <IconChip name={t.icono} className="bg-white" />
            <h3 className="mt-4 text-lg font-semibold text-navy">{t.titulo}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/80 md:text-base">
              <RichText>{t.texto}</RichText>
            </p>
          </div>
        ))}
      </Stagger>
    </Section>
  );
}
