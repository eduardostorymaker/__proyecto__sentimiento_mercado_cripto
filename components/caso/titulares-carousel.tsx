import { ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { CasoData } from "@/lib/caso";
import { formatFecha } from "@/lib/format";

type Titular = CasoData["titulares_ejemplo"][number];

const GRUPOS = [
  { periodo: "durante", titulo: "Crisis aguda" },
  { periodo: "despues", titulo: "Después" },
] as const;

/**
 * `2026-10-29 07:00` es una fecha SIN hora (Google News la publica solo con el día y el notebook la
 * deja en las 07:00 UTC): se muestra solo la fecha. Con hora real, se muestra en UTC.
 */
function fechaTitular(fecha: string): string {
  const iso = `${fecha.replace(" ", "T")}:00Z`;
  return fecha.endsWith(" 07:00") ? formatFecha(iso) : `${formatFecha(iso, { hora: true })} UTC`;
}

function Tarjeta({ t }: { t: Titular }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <p className="text-sm font-bold text-navy">{t.medio}</p>
        <Badge variant="outline" className="h-5 rounded-full px-2 font-mono text-[0.7rem] uppercase" title={t.idioma === "es" ? "Español" : "Inglés"}>
          {t.idioma}
        </Badge>
        <span title="Sentimiento léxico preliminar, no el del modelo final" className="ml-auto">
          <StatusBadge kind={t.sentimiento_lexico} />
        </span>
      </header>
      <p className="mt-1 text-xs text-muted-foreground">{fechaTitular(t.fecha)}</p>
      <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-ink">{t.titular}</p>
      <a
        href={t.url}
        target="_blank"
        rel="noopener noreferrer"
        className="link-underline mt-4 inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-medium text-teal-text"
      >
        Leer en Google News
        <ExternalLink className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
        <span className="sr-only">(se abre en una pestaña nueva)</span>
      </a>
    </article>
  );
}

/**
 * Titulares del caso (SPEC 7.15-G): un carrusel por periodo, con el medio, la fecha, el idioma, el
 * sentimiento léxico preliminar y el enlace a la nota. NO se muestran comentarios de usuarios: la
 * página solo publica agregados y titulares con enlace (consideración ética, informe 4.2.4).
 */
export function TitularesCarousel({ titulares }: { titulares: CasoData["titulares_ejemplo"] }) {
  return (
    <div className="grid grid-cols-1 gap-10">
      {GRUPOS.map((g) => {
        const lista = titulares.filter((t) => t.periodo === g.periodo);
        if (lista.length === 0) return null;
        return (
          <section key={g.periodo} aria-label={`Titulares: ${g.titulo}`} className="min-w-0">
            <h4 className="mb-4 text-sm font-semibold tracking-[0.12em] text-teal-text uppercase">{g.titulo}</h4>
            <Carousel opts={{ align: "start" }} aria-label={`Titulares del periodo ${g.titulo.toLowerCase()}`} className="mb-14 xl:mb-0">
              <CarouselContent className="-ml-4">
                {lista.map((t) => (
                  <CarouselItem key={t.url} className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3">
                    <Tarjeta t={t} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Bajo las tarjetas hasta 1280 px: a media altura taparían el texto, y fuera del borde (`-left-12`) a 1024 px ensanchaban la página. */}
              <CarouselPrevious className="top-auto -bottom-12 left-[calc(50%-2.75rem)] xl:inset-y-0 xl:-left-12" />
              <CarouselNext className="top-auto right-[calc(50%-2.75rem)] -bottom-12 xl:inset-y-0 xl:-right-12" />
            </Carousel>
          </section>
        );
      })}
    </div>
  );
}
