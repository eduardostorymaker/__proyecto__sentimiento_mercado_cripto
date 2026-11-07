import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ListaReferencias } from "@/components/referencias/lista-referencias";
import { Button } from "@/components/ui/button";
import { referencias } from "@/data/referencias";
import { metaPagina } from "@/lib/site";

export const metadata = metaPagina({
  title: "Referencias",
  description: `Las ${referencias.length} referencias bibliográficas del proyecto Pulse Analytics, en formato IEEE y en orden de primera cita del informe.`,
  path: "/referencias",
});

function Volver({ className }: { className?: string }) {
  return (
    <Button
      asChild
      variant="outline"
      className={`h-11 rounded-xl border-navy/30 bg-white px-5 text-base text-navy transition-all duration-150 hover:bg-mist active:scale-[0.97] ${className ?? ""}`}
    >
      <Link href="/#inicio">
        <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
        Volver al sitio
      </Link>
    </Button>
  );
}

/**
 * `/referencias` (SPEC 7.18). El header fijo es sólido aquí (no hay hero navy debajo): de ahí `pt-28`.
 * `app/template.tsx` aporta el único `<main>`.
 */
export default function ReferenciasPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-28 pb-24 md:px-8">
      <Volver />
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-navy md:text-6xl">Referencias</h1>
      <p className="mt-4 max-w-prose text-base text-ink/80 md:text-lg">Formato IEEE, en orden de primera cita del informe.</p>
      <div className="mt-10">
        <ListaReferencias referencias={referencias} />
      </div>
      <Volver className="mt-12" />
    </div>
  );
}
