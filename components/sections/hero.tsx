import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/common/count-up";
import { Kpi } from "@/components/common/kpi";
import { RichText } from "@/components/common/rich-text";
import { Stagger } from "@/components/common/stagger";
import { HeroVideo } from "@/components/sections/hero-video";
import { hero, heroKpis } from "@/data/kpis";

/**
 * `#inicio` (SPEC 7.1): fondo navy → navy-deep, texto a la izquierda (5 columnas) y video a la
 * derecha (7), con la franja de KPI superpuesta al borde inferior (`-mb-16`, con conteo).
 *
 * La sección que sigue debe dejar espacio arriba para esos 64 px que se le superponen.
 * La entrada al cargar es CSS puro (`hero-rise`, `hero-media`): eyebrow → H1 → subtítulo →
 * botones → video, con 100 ms de desfase.
 */
export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="inicio-titulo"
      className="relative scroll-mt-20 bg-linear-to-b from-navy to-navy-deep text-white"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pt-32 pb-28 md:px-8 lg:min-h-[92vh] lg:grid-cols-12 lg:gap-12 lg:pt-28 lg:pb-32">
        <div className="lg:col-span-5">
          <p
            style={{ "--i": 0 } as React.CSSProperties}
            className="hero-rise text-xs font-semibold tracking-[0.16em] text-teal-soft uppercase"
          >
            {hero.eyebrow}
          </p>
          <h1
            id="inicio-titulo"
            style={{ "--i": 1 } as React.CSSProperties}
            className="hero-rise mt-4 text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl"
          >
            {hero.title}
          </h1>
          <p
            style={{ "--i": 2 } as React.CSSProperties}
            className="hero-rise mt-6 max-w-prose text-base leading-relaxed text-mist/90 md:text-[17px]"
          >
            {hero.subtitle}
          </p>
          <div style={{ "--i": 3 } as React.CSSProperties} className="hero-rise mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="group h-11 rounded-xl bg-white px-5 text-base text-navy transition-all duration-150 hover:bg-mist hover:shadow-md active:scale-[0.97] focus-visible:ring-white"
            >
              <Link href={hero.primaryCta.href}>
                {hero.primaryCta.label}
                <ArrowRight
                  className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-11 rounded-xl bg-white/10 px-5 text-base text-white transition-all duration-150 hover:bg-white/20 active:scale-[0.97] focus-visible:ring-white"
            >
              <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
            </Button>
          </div>
        </div>

        <HeroVideo className="lg:col-span-7" />
      </div>

      <div className="relative z-10 mx-auto -mb-16 max-w-6xl px-5 md:px-8">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {heroKpis.map((kpi, i) => (
            <Kpi
              key={i}
              card
              size="md"
              value={<CountUp {...kpi.count} />}
              label={<RichText>{kpi.label}</RichText>}
              className="h-full"
            />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
