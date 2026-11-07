import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MascotAvatar } from "@/components/common/mascot-avatar";
import { Button } from "@/components/ui/button";
import { mascotas } from "@/data/mascotas";

// Next añade `noindex` a las páginas 404; el título las distingue en la pestaña.
export const metadata: Metadata = { title: "Página no encontrada" };

/**
 * 404 (SPEC 7.19): fondo navy, Bruno en grande y un botón de regreso. Va dentro del layout (header y
 * pie normales; el header ya es sólido fuera de `/`) y del `<main>` de `app/template.tsx`.
 */
export default function NotFound() {
  return (
    <section className="grid flex-1 place-items-center bg-navy px-5 pt-32 pb-24 text-white">
      <div className="flex max-w-xl flex-col items-center text-center">
        <MascotAvatar mascot="bruno" size="xl" />
        <p className="mt-8 font-mono text-sm font-semibold tracking-[0.16em] text-coral-soft">ERROR 404</p>
        <h1 className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">{mascotas.noEncontrada.texto}</h1>
        <Button
          asChild
          size="lg"
          className="group mt-10 h-12 rounded-xl bg-white px-6 text-base text-navy transition-all duration-150 hover:bg-white hover:shadow-md active:scale-[0.97]"
        >
          <Link href="/#inicio">
            Volver al inicio
            <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
