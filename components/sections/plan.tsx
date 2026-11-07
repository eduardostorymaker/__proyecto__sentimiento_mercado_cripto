import { AnimatedTabs, type TabDef } from "@/components/common/animated-tabs";
import { Cite } from "@/components/common/cite";
import { DataTable } from "@/components/common/data-table";
import { VerFigura } from "@/components/common/figura-alterna";
import { FiguraInforme } from "@/components/common/figura-informe";
import { PulseDivider } from "@/components/common/pulse-divider";
import { RichText } from "@/components/common/rich-text";
import { Section } from "@/components/common/section";
import { SectionHeader } from "@/components/common/section-header";
import { Gantt } from "@/components/plan/gantt";
import { HitosTimeline } from "@/components/plan/hitos-timeline";
import { fases, metodologia, raci, raciLeyenda, raciRoles, SEMANAS, type Raci } from "@/data/plan";
import { cn } from "@/lib/utils";

const semanasDe = (ini: number, fin: number) => (ini === fin ? `Semana ${ini}` : `Semanas ${ini} a ${fin}`);

function Metodologia() {
  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <FiguraInforme id="crispDm" className="mx-auto w-full max-w-md" sizes="(min-width: 1024px) 448px, 100vw" />
      <div>
        <p className="max-w-prose text-base leading-relaxed text-ink/90 md:text-lg">
          <RichText>{metodologia}</RichText>
        </p>
        <ol className="mt-6 grid grid-cols-1 gap-2.5">
          {fases.map((f, i) => (
            <li key={f.fase} className="flex items-baseline gap-3 text-sm md:text-base">
              <span className="w-5 shrink-0 font-mono text-xs font-semibold text-teal-text">{i + 1}</span>
              <span className="font-medium text-navy">{f.fase}</span>
              <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground">{semanasDe(f.ini, f.fin)}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Cronograma() {
  return (
    <>
      {/* Escritorio: Gantt nativo. Móvil: la imagen del informe, que se puede ampliar. */}
      <div className="hidden md:block">
        <Gantt />
        <div className="mt-3 flex justify-end">
          <VerFigura id="gantt" />
        </div>
      </div>
      <div className="md:hidden">
        <FiguraInforme id="gantt" />
      </div>
    </>
  );
}

/** Colores de las celdas del RACI: R teal, A navy, C dorado, I gris pizarra claro. La letra va siempre escrita. */
const CELDA_RACI: Record<Raci, string> = {
  R: "bg-teal-text text-white",
  A: "bg-navy text-white",
  C: "bg-gold text-ink",
  I: "bg-[#dfe5ee] text-ink",
  "A/R": "bg-navy text-white ring-2 ring-teal-text ring-offset-1",
};

function Celda({ v }: { v: Raci }) {
  return (
    <span
      title={raciLeyenda[v]}
      className={cn("inline-grid h-8 min-w-8 place-items-center rounded-md px-1.5 font-mono text-sm font-semibold", CELDA_RACI[v])}
    >
      {v}
      <span className="sr-only"> ({raciLeyenda[v]})</span>
    </span>
  );
}

function MatrizRaci() {
  return (
    <div className="grid grid-cols-1 gap-5">
      <DataTable
        caption="Matriz RACI por fase y rol"
        columns={[
          { key: "fase", label: "Fase" },
          ...raciRoles.map((r) => ({ key: r, label: r, align: "center" as const })),
        ]}
        rows={raci.map((f) => ({
          fase: f.fase,
          ...Object.fromEntries(raciRoles.map((rol, i) => [rol, <Celda key={rol} v={f.v[i]} />])),
        }))}
      />
      <ul className="flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-ink/80" aria-label="Leyenda del RACI">
        {(Object.keys(raciLeyenda) as Raci[]).map((k) => (
          <li key={k} className="flex items-center gap-2">
            <span aria-hidden="true" className={cn("inline-grid h-6 min-w-6 place-items-center rounded-md px-1 font-mono text-xs font-semibold", CELDA_RACI[k])}>
              {k}
            </span>
            {raciLeyenda[k]}
          </li>
        ))}
      </ul>
    </div>
  );
}

const pestanas: TabDef[] = [
  { id: "metodologia", label: "Metodología", content: <Metodologia /> },
  { id: "cronograma", label: "Cronograma", content: <Cronograma /> },
  { id: "hitos", label: "Hitos", content: <HitosTimeline /> },
  { id: "raci", label: "RACI", content: <MatrizRaci /> },
];

/** `#plan` (SPEC 7.14): CRISP-DM en 16 semanas con metodología, Gantt, hitos y matriz RACI. */
export function Plan() {
  return (
    <Section id="plan" tone="mist">
      <PulseDivider />
      <SectionHeader
        id="plan"
        eyebrow="Plan del proyecto"
        title={
          <>
            CRISP-DM en {SEMANAS} semanas <Cite id="chapman" />, <Cite id="wirth" />
          </>
        }
      />
      <AnimatedTabs tabs={pestanas} label="Plan del proyecto" />
    </Section>
  );
}
