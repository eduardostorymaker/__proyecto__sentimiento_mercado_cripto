"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export interface FigureLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  alt: string;
  title: string;
  source: ReactNode;
  width: number;
  height: number;
  /** Devuelve el foco al botón que abrió la figura (Radix solo lo hace con un `DialogTrigger`). */
  onReturnFocus: () => void;
}

/**
 * Figura a pantalla ampliada (SPEC 5.4): imagen a tamaño completo, pie y fuente. Se cierra con Esc,
 * clic fuera o el botón; el foco vuelve al botón que la abrió. Se carga con `next/dynamic` solo al
 * primer clic, para que ni el diálogo ni las imágenes grandes pesen en la carga inicial.
 */
export default function FigureLightbox({
  open,
  onOpenChange,
  src,
  alt,
  title,
  source,
  width,
  height,
  onReturnFocus,
}: FigureLightboxProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          onReturnFocus();
        }}
        className="max-w-[min(96vw,1280px)] gap-3 bg-white p-3 sm:max-w-[min(96vw,1280px)] md:p-5"
      >
        <DialogTitle className="pr-10 text-sm font-semibold text-navy md:text-base">{title}</DialogTitle>
        <div className="max-h-[72vh] overflow-auto rounded-lg">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(min-width: 1280px) 1240px, 96vw"
            className="mx-auto h-auto max-h-[70vh] w-auto max-w-full object-contain"
          />
        </div>
        <DialogDescription className="text-xs text-muted-foreground">Fuente: {source}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
