"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { FiguraNotebook } from "@/data/caso";

/**
 * Galería de las figuras del notebook (SPEC 7.15-J): un diálogo grande con un carrusel de las 11
 * figuras 15 a 25 del informe, con su pie. Sirve de evidencia para el jurado. Las flechas del teclado
 * pasan de una a otra (lo resuelve el carrusel) y Esc cierra. El contenido solo se monta al abrir.
 */
export function GaleriaNotebook({ figuras }: { figuras: readonly FiguraNotebook[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [actual, setActual] = useState(0);

  useEffect(() => {
    if (!api) return;
    const alCambiar = () => setActual(api.selectedScrollSnap());
    api.on("select", alCambiar);
    api.on("reInit", alCambiar);
    return () => {
      api.off("select", alCambiar);
      api.off("reInit", alCambiar);
    };
  }, [api]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="lg"
          className="h-11 rounded-xl bg-white/10 px-5 text-base text-white transition-all duration-150 hover:bg-white/20 hover:text-white active:scale-[0.97] focus-visible:ring-white"
        >
          <Images className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Ver las {figuras.length} figuras del análisis
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[min(96vw,1280px)] grid-cols-1 gap-3 bg-white p-3 sm:max-w-[min(96vw,1280px)] md:p-5 [&>*]:min-w-0"
        onKeyDown={(e) => {
          // El foco arranca en el diálogo, no dentro del carrusel: las flechas se resuelven aquí.
          if (e.key === "ArrowRight") { e.preventDefault(); api?.scrollNext(); }
          else if (e.key === "ArrowLeft") { e.preventDefault(); api?.scrollPrev(); }
        }}
      >
        <DialogTitle className="pr-10 text-sm font-semibold text-navy md:text-base">Figuras del análisis de comprensión de los datos</DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground">
          Figura {figuras[actual].n} del informe · {actual + 1} de {figuras.length}. Usa las flechas del teclado para pasar de una a otra.
        </DialogDescription>
        <Carousel setApi={setApi} opts={{ align: "center" }} aria-label="Figuras del notebook" className="px-0 md:px-12">
          <CarouselContent>
            {figuras.map((f) => (
              <CarouselItem key={f.archivo}>
                <figure>
                  <div className="max-h-[62vh] overflow-auto rounded-lg border border-border bg-white p-2">
                    <Image
                      src={`/images/caso/${f.archivo}`}
                      alt={`Figura ${f.n}. ${f.titulo}`}
                      width={f.width}
                      height={f.height}
                      sizes="(min-width: 1280px) 1100px, 92vw"
                      className="mx-auto h-auto w-auto max-w-none min-w-[720px] object-contain md:max-h-[58vh] md:max-w-full md:min-w-0"
                    />
                  </div>
                  <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    <span className="font-medium text-ink/80">
                      Figura {f.n}. {f.titulo}
                    </span>{" "}
                    Fuente: elaboración propia.
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 md:left-0" />
          <CarouselNext className="right-1 md:right-0" />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
