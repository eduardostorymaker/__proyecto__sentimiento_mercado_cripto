"use client";

import { useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { cn } from "@/lib/utils";

// El lightbox no se descarga hasta el primer clic.
const FigureLightbox = dynamic(() => import("@/components/common/figure-lightbox"), { ssr: false });

export interface FigureProps {
  src: string;
  alt: string;
  caption: string;
  /** Número de la figura en el informe (ver PLAN_ejecucion.md, sección 4). */
  n?: number;
  /** Fuente; por defecto «Elaboración propia.». Admite `<Cite />`. */
  source?: ReactNode;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Figura del informe (SPEC 4.5 y 6.4): tarjeta blanca (las PNG tienen fondo blanco, también sobre
 * `mist`), pie «Figura n. …» con fuente, y lightbox al hacer clic o con Enter/Espacio.
 */
export function Figure({
  src,
  alt,
  caption,
  n,
  source = "Elaboración propia.",
  width,
  height,
  priority = false,
  sizes = "(min-width: 1024px) 900px, 100vw",
  className,
}: FigureProps) {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const title = n ? `Figura ${n}. ${caption}` : caption;

  return (
    <Reveal as="figure" className={cn("group", className)}>
      <div className="rounded-xl border border-border bg-white p-3 md:p-4">
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="dialog"
          aria-label={`Ampliar: ${title}`}
          onClick={() => {
            setEverOpened(true);
            setOpen(true);
          }}
          className="relative block w-full cursor-zoom-in overflow-hidden rounded-lg motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:scale-[1.01]"
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            priority={priority}
            className="h-auto w-full"
          />
          <span
            aria-hidden="true"
            className="absolute top-2 right-2 grid size-8 place-items-center rounded-md bg-navy/85 text-white opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
          >
            <Maximize2 className="size-4" strokeWidth={1.75} />
          </span>
        </button>
      </div>
      <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-ink/80">{title}</span> Fuente: {source}
      </figcaption>

      {everOpened && (
        <FigureLightbox
          open={open}
          onOpenChange={setOpen}
          src={src}
          alt={alt}
          title={title}
          source={source}
          width={width}
          height={height}
          onReturnFocus={() => buttonRef.current?.focus()}
        />
      )}
    </Reveal>
  );
}
