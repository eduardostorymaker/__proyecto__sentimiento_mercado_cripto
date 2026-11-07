"use client";

import { useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// El lightbox (y la imagen grande) no se descarga hasta el primer clic.
const FigureLightbox = dynamic(() => import("@/components/common/figure-lightbox"), { ssr: false });

/**
 * Botón «Ver como imagen» junto a un gráfico nativo (PLAN, sección 3): abre la PNG del informe en el
 * mismo lightbox de las figuras. Es el respaldo si el gráfico no se ve bien, y permite comparar con la
 * figura numerada del informe.
 */
export function VerComoImagen({
  src,
  alt,
  title,
  source,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  /** «Figura n. …», tal como aparece en el informe. */
  title: string;
  source: ReactNode;
  width: number;
  height: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-label={`Ver como imagen: ${title}`}
        onClick={() => {
          setEverOpened(true);
          setOpen(true);
        }}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-navy transition-all duration-150 hover:border-navy/30 hover:bg-mist active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className,
        )}
      >
        <ImageIcon className="size-4" strokeWidth={1.75} aria-hidden="true" />
        Ver como imagen
      </button>
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
    </>
  );
}
