import { Check } from "lucide-react";
import { ChipTooltip } from "@/components/common/chip-tooltip";
import { IconChip } from "@/components/common/icon";
import { Reveal } from "@/components/common/reveal";
import { RichText } from "@/components/common/rich-text";
import { Section } from "@/components/common/section";
import { SectionHeader } from "@/components/common/section-header";
import { Stagger } from "@/components/common/stagger";
import { Subtitulo } from "@/components/common/subtitulo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { planes, planesBotonAviso, planesNota, productos, segmentos, type Plan } from "@/data/productos";
import { formatUSD } from "@/lib/format";
import { cn } from "@/lib/utils";

function TarjetaPlan({ plan }: { plan: Plan }) {
  const destacado = !!plan.destacado;
  return (
    <article
      aria-label={`Plan ${plan.nombre}`}
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal/40 hover:shadow-lg hover:shadow-navy/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        destacado ? "border-2 border-gold shadow-md lg:scale-[1.03]" : "border-border",
      )}
    >
      {destacado && (
        <span className="badge-brillo absolute -top-3 left-5 rounded-full bg-gold px-3 py-0.5 text-xs font-semibold text-ink">Más popular</span>
      )}
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-lg font-semibold text-navy">{plan.nombre}</h4>
        <Badge variant="outline" className="h-5 rounded-full px-2 font-mono text-[0.7rem]">
          {plan.segmento}
        </Badge>
      </div>
      <p className="mt-4 min-h-[4.25rem]">
        {plan.desde && <span className="block text-xs text-muted-foreground">Desde</span>}
        <span className="font-mono text-3xl font-semibold tabular-nums text-navy">{formatUSD(plan.precio)}</span>
        <span className="ml-1 text-sm text-muted-foreground">/mes</span>
      </p>
      <dl className="mt-3 grid grid-cols-1 gap-1.5 border-t border-border pt-3 text-sm">
        {(
          [
            ["Activos", plan.activos],
            ["Actualización", plan.actualizacion],
            ["Histórico", plan.historico],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <ul className="mt-3 grid flex-1 grid-cols-1 content-start gap-1.5 border-t border-border pt-3 text-sm text-ink/90">
        {plan.incluye.map((i) => (
          <li key={i} className="flex gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-teal-text" strokeWidth={2} aria-hidden="true" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Decorativo y sin acción (type="button"): los planes abren en enero 2027. `aria-disabled` y no `disabled`, para que el tooltip aparezca. */}
          <Button
            type="button"
            variant="outline"
            aria-disabled="true"
            className="mt-5 h-10 w-full cursor-not-allowed text-navy hover:bg-white"
          >
            Elegir plan
            <span className="sr-only">. {planesBotonAviso}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{planesBotonAviso}</TooltipContent>
      </Tooltip>
    </article>
  );
}

/** `#productos` (SPEC 7.6): cuatro productos, cinco planes y los segmentos de clientes. */
export function Productos() {
  return (
    <Section id="productos" tone="white">
      <SectionHeader id="productos" eyebrow="Productos" title="Cuatro productos, un mismo motor de NLP" />

      <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {productos.map((p) => (
          <div
            key={p.nombre}
            className="rounded-2xl border border-border bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal/40 hover:shadow-lg hover:shadow-navy/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <IconChip name={p.icono} />
            <h3 className="mt-4 text-lg font-semibold text-navy">{p.nombre}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
              <RichText>{p.descripcion}</RichText>
            </p>
          </div>
        ))}
      </Stagger>

      <div className="mt-16 md:mt-20">
        <Subtitulo>Planes</Subtitulo>
        {/* Escritorio: cinco columnas. Móvil: carrusel. Solo uno de los dos se muestra a la vez. */}
        <Stagger className="hidden grid-cols-5 gap-4 pt-3 lg:grid">
          {planes.map((p) => (
            <TarjetaPlan key={p.nombre} plan={p} />
          ))}
        </Stagger>
        <Carousel opts={{ align: "start" }} aria-label="Planes de Pulse Analytics" className="mb-14 lg:hidden">
          <CarouselContent className="-ml-4 pt-4">
            {planes.map((p) => (
              <CarouselItem key={p.nombre} className="basis-[85%] pl-4 sm:basis-1/2">
                <TarjetaPlan plan={p} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Debajo de las tarjetas: a media altura taparían el texto de la tarjeta. */}
          <CarouselPrevious className="top-auto -bottom-12 left-[calc(50%-2.75rem)] translate-y-0" />
          <CarouselNext className="top-auto right-[calc(50%-2.75rem)] -bottom-12 translate-y-0" />
        </Carousel>
        <Reveal>
          <p className="mt-6 max-w-prose text-sm leading-relaxed text-ink/80 italic">
            <RichText>{planesNota}</RichText>
          </p>
        </Reveal>
      </div>

      <div className="mt-16 md:mt-20">
        <Subtitulo>Segmentos de clientes</Subtitulo>
        <Reveal>
          <ul className="flex flex-wrap gap-3">
            {segmentos.map((s) => (
              <li key={s.chip}>
                <ChipTooltip
                  className="min-h-11 rounded-full border border-border bg-mist px-4 py-2 text-sm font-medium text-navy transition duration-150 hover:border-navy/30 hover:bg-white hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
                  contentClassName="max-w-xs"
                  tip={
                    <div className="grid gap-1">
                      <span>
                        <strong className="font-semibold">Perfil:</strong> {s.perfil}
                      </span>
                      <span>
                        <strong className="font-semibold">Necesidad:</strong> {s.necesidad}
                      </span>
                      <span>
                        <strong className="font-semibold">Producto de entrada:</strong> {s.productoEntrada}
                      </span>
                    </div>
                  }
                >
                  {s.chip}
                </ChipTooltip>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
