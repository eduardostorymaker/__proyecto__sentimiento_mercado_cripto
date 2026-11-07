import Link from "next/link";
import { PulseLogo, Wordmark } from "@/components/layout/pulse-logo";
import { REFERENCIAS_HREF, sections } from "@/data/nav";

const AVISO =
  "Los indicadores de Pulse Analytics son información complementaria y no constituyen asesoría de inversión.";

const linkClass =
  "link-underline rounded-sm text-sm text-mist/80 transition-colors duration-150 hover:text-white";

/** Pie de página (SPEC 7.17): fondo navy-deep con línea de pulso teal → coral en el borde superior. */
export function SiteFooter() {
  // `inicio` no se lista: es el logo.
  const links = sections.filter((s) => s.id !== "inicio");

  return (
    <footer className="relative bg-navy-deep text-mist">
      {/* Línea de pulso decorativa en el borde superior. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-6 -translate-y-1/2">
        {/* Teal a la izquierda, coral a la derecha y cambio seco en el centro, como en el logo:
            un degradado continuo teal → coral pasa por un marrón grisáceo. */}
        <div className="absolute top-1/2 left-0 h-px w-1/2 bg-linear-to-r from-transparent to-teal" />
        <div className="absolute top-1/2 right-0 h-px w-1/2 bg-linear-to-l from-transparent to-coral" />
        <svg
          viewBox="0 0 120 24"
          fill="none"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute top-0 left-1/2 h-6 w-30 -translate-x-1/2"
        >
          <path d="M0 12H44L52 2 60 12" stroke="#2A9D8F" />
          <path d="M60 12 68 22 76 12H120" stroke="#E76F51" />
        </svg>
      </div>

      {/* pb-24: deja libre el fondo para que el botón flotante «Volver arriba» no tape el aviso legal. */}
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-24 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Link
              prefetch={false}
              href="/#inicio"
              aria-label="Pulse Analytics, ir al inicio"
              className="inline-flex items-center gap-2 rounded-lg text-white"
            >
              <PulseLogo tone="onDark" className="size-9" />
              <Wordmark className="text-xl" />
            </Link>
            <p className="mt-4 text-base text-mist/90">Escuchamos lo que el mercado dice.</p>
          </div>

          <nav aria-label="Secciones del sitio">
            <h2 className="text-xs font-semibold tracking-[0.16em] text-teal-soft uppercase">Secciones</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3">
              {links.map((s) => (
                <li key={s.id}>
                  <Link prefetch={false} href={`/#${s.id}`} className={linkClass}>
                    {s.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={REFERENCIAS_HREF} className={linkClass}>
                  Referencias
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-mist/75 md:flex-row md:items-start md:justify-between md:gap-10">
          <p>© 2026 Pulse Analytics S.A.C.</p>
          <p className="max-w-xl md:text-right">{AVISO}</p>
        </div>
      </div>
    </footer>
  );
}
