import { CasoBinance } from "@/components/sections/caso-binance";
import { Costos } from "@/components/sections/costos";
import { Hero } from "@/components/sections/hero";
import { PulseScore } from "@/components/sections/pulse-score";
import { sections } from "@/data/nav";
import { cn } from "@/lib/utils";

/**
 * Página principal. `#inicio`, `#pulse-score`, `#costos` y `#caso-binance` ya son las secciones reales (fases 5 a 7); el resto son
 * MARCADORES TEMPORALES con los `id` reales (se reemplazan en la fase 8). No declara `<main>`: lo
 * aporta `app/template.tsx`.
 */
export default function Home() {
  return (
    <>
      {sections.map((s, i) => {
        if (s.id === "inicio") return <Hero key={s.id} />;
        if (s.id === "pulse-score") return <PulseScore key={s.id} />;
        if (s.id === "costos") return <Costos key={s.id} />;
        if (s.id === "caso-binance") return <CasoBinance key={s.id} />;
        return (
          <section
            key={s.id}
            id={s.id}
            aria-labelledby={`${s.id}-titulo`}
            // El primero deja sitio a la franja de KPI que se superpone al hero (64 px).
            className={cn("flex min-h-[80vh] scroll-mt-20 items-center py-24", i === 1 && "pt-40", i % 2 ? "bg-mist" : "bg-white")}
          >
            <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
              <p className="text-xs font-semibold tracking-[0.16em] text-teal-text uppercase">
                Sección {i + 1} de {sections.length}
              </p>
              <h2 id={`${s.id}-titulo`} className="mt-2 text-3xl font-semibold tracking-tight text-navy md:text-4xl">
                {s.label}
              </h2>
              <p className="mt-4 max-w-prose text-ink/80">Marcador temporal: se reemplaza en la fase 8.</p>
            </div>
          </section>
        );
      })}
    </>
  );
}
