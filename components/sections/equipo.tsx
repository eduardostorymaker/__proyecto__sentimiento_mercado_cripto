import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeader } from "@/components/common/section-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Stagger } from "@/components/common/stagger";
import { datosCurso, integrantes } from "@/data/equipo";

/** Texto del dato, o el marcador visible `[Por completar]` si todavía no se tiene. */
const Dato = ({ v }: { v: string | null }) => (v ? <>{v}</> : <StatusBadge kind="pendiente" />);

const iniciales = (nombre: string | null) =>
  nombre
    ? nombre
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : "?";

/**
 * `#equipo` (SPEC 7.16): integrantes y datos del curso. Es la única sección que puede mostrar
 * `[Por completar]` (SPEC 10): los datos viven en `data/equipo.ts` y, al llenarlos, no hay que tocar
 * este componente.
 */
export function Equipo() {
  return (
    <Section id="equipo" tone="white">
      <SectionHeader id="equipo" eyebrow="Equipo" title="Equipo del proyecto" />

      <Stagger as="ul" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {integrantes.map((p, i) => (
          <li key={i} className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
            <span
              aria-hidden="true"
              className="mx-auto grid size-16 place-items-center rounded-full bg-navy text-xl font-semibold text-white"
            >
              {iniciales(p.nombre)}
            </span>
            <p className="mt-4 text-lg font-semibold text-navy">
              <Dato v={p.nombre} />
            </p>
            <dl className="mt-2 grid grid-cols-1 gap-1.5 text-sm text-ink/80">
              <div>
                <dt className="sr-only">Código</dt>
                <dd>
                  <Dato v={p.codigo} />
                </dd>
              </div>
              <div>
                <dt className="sr-only">Rol</dt>
                <dd>
                  <Dato v={p.rol} />
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </Stagger>

      <Reveal>
        <dl className="mt-12 grid grid-cols-1 gap-x-10 gap-y-3 rounded-2xl border border-border bg-mist p-6 sm:grid-cols-2 md:p-8">
          {(
            [
              ["Universidad", datosCurso.universidad],
              ["Curso", datosCurso.curso],
              ["Docente", datosCurso.docente],
              ["Lugar y fecha", datosCurso.lugarFecha],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[8rem_1fr] items-center gap-3 text-sm md:text-base">
              <dt className="font-semibold text-navy">{k}</dt>
              <dd className="text-ink/90">
                <Dato v={v} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
