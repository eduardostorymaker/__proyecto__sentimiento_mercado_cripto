import { CashflowChartLazy, MrrChartLazy } from "@/components/charts/lazy";
import { ChartCard } from "@/components/charts/chart-shell";
import { MvpBar } from "@/components/charts/mvp-bar";
import { AnimatedTabs, type TabDef } from "@/components/common/animated-tabs";
import { DataTable } from "@/components/common/data-table";
import { Kpi } from "@/components/common/kpi";
import { Reveal } from "@/components/common/reveal";
import { RichText } from "@/components/common/rich-text";
import { Section } from "@/components/common/section";
import { SectionHeader } from "@/components/common/section-header";
import { SpeechBubble } from "@/components/common/speech-bubble";
import { Stagger } from "@/components/common/stagger";
import { Badge } from "@/components/ui/badge";
import {
  beneficios,
  costosPie,
  evaluacionEconomica,
  flujoAnual,
  indicadores,
  kpisCostos,
  mvpBarra,
  mvpContingencia,
  mvpSubtotal,
  mvpTotal,
  notaFlujoAcumulado,
  partidas,
  sensibilidad,
  sensibilidadNota,
} from "@/data/costos";
import { mascotas } from "@/data/mascotas";
import type { Valor } from "@/data/types";
import { formatNum, formatUSD } from "@/lib/format";
import { cn } from "@/lib/utils";

const valor = (v: Valor) => ("usd" in v ? formatUSD(v.usd) : v.texto);

/** Cifra con signo: los negativos en coral, como pide el spec. */
const Cifra = ({ n, usd = false }: { n: number; usd?: boolean }) => (
  <span className={cn(n < 0 && "text-coral-text")}>{usd ? formatUSD(n) : formatNum(n)}</span>
);

const TONO_BORDE = { coral: "border-t-coral", navy: "border-t-navy", teal: "border-t-teal" } as const;

function Presupuesto() {
  return (
    <div className="grid grid-cols-1 gap-8">
      <ChartCard title="Distribución del presupuesto">
        <MvpBar grupos={mvpBarra} total={mvpTotal} />
      </ChartCard>
      <DataTable
        caption="Presupuesto del MVP (16 semanas)"
        source="elaboración propia con tarifas referenciales del mercado laboral peruano de tecnología."
        columns={[
          { key: "concepto", label: "Concepto" },
          { key: "costo", label: "Costo", align: "right", mono: true },
        ]}
        rows={[
          ...partidas.map((p) => ({ concepto: p.concepto, costo: formatUSD(p.costo) })),
          { concepto: "Subtotal", costo: formatUSD(mvpSubtotal) },
          { concepto: "Contingencia (10 %)", costo: formatUSD(mvpContingencia) },
        ]}
        emphasisRows={[partidas.length]}
        totalRow={{ concepto: "Total", costo: formatUSD(mvpTotal) }}
      />
    </div>
  );
}

function Beneficios() {
  return (
    <Stagger className="grid gap-6 md:grid-cols-3">
      {beneficios.map((b) => (
        <div key={b.destacado} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <p className="text-xl leading-snug font-semibold text-navy">
            <RichText>{b.destacado}</RichText>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink/80">
            <RichText>{b.detalle}</RichText>
          </p>
        </div>
      ))}
    </Stagger>
  );
}

function Proyeccion() {
  const { anios, ingresos, costos, flujoNeto, clientesCierre, arrCierre } = flujoAnual;
  const porAnio = (f: (i: number) => React.ReactNode) => ({ a: f(0), b: f(1), c: f(2) });
  const nombres = ["a", "b", "c"] as const;

  const filas = [
    { concepto: "Ingresos por suscripciones", ...porAnio((i) => <Cifra n={ingresos[i]} />) },
    ...Object.entries(costos).map(([concepto, valores]) => ({
      concepto,
      ...porAnio((i) => <Cifra n={-valores[i]} />),
    })),
    {
      concepto: "Flujo neto",
      ...porAnio((i) => <span className={flujoNeto[i] < 0 ? "text-coral-text" : "text-teal-text"}>{formatNum(flujoNeto[i])}</span>),
    },
    { concepto: "Clientes de pago al cierre", ...porAnio((i) => formatNum(clientesCierre[i])) },
    { concepto: "ARR al cierre", ...porAnio((i) => formatNum(arrCierre[i])) },
  ];

  return (
    <div className="grid grid-cols-1 gap-8">
      <MrrChartLazy />
      <DataTable
        caption="Flujo de caja proyectado, 2027-2029"
        source="elaboración propia. Inversión inicial (año 0): −US$ 23 084. Cifras antes de impuestos."
        columns={[
          { key: "concepto", label: "Concepto (US$)" },
          ...nombres.map((k, i) => ({ key: k, label: String(anios[i]), align: "right" as const, mono: true })),
        ]}
        rows={filas}
        emphasisRows={[1 + Object.keys(costos).length]}
      />
    </div>
  );
}

function Evaluacion() {
  return (
    <div className="grid grid-cols-1 gap-8">
      <CashflowChartLazy />
      <p className="max-w-prose text-sm leading-relaxed text-ink/80">
        <RichText>{notaFlujoAcumulado}</RichText>
      </p>
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {evaluacionEconomica.map((t) => {
          const negativo = "usd" in t.valor && t.valor.usd < 0;
          return (
            <div key={t.etiqueta} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">{t.etiqueta}</p>
              <p className={cn("mt-1.5 font-mono text-2xl font-semibold tabular-nums", negativo ? "text-coral-text" : "text-navy")}>
                {valor(t.valor)}
              </p>
              {t.detalle && (
                <p className="mt-1.5 text-xs leading-relaxed text-ink/70">
                  <RichText>{t.detalle}</RichText>
                </p>
              )}
            </div>
          );
        })}
      </Stagger>
    </div>
  );
}

function Sensibilidad() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Stagger className="grid gap-6 md:grid-cols-3">
        {sensibilidad.map((e) => (
          <div
            key={e.escenario}
            className={cn("rounded-2xl border border-t-4 border-border bg-white p-6 shadow-sm", TONO_BORDE[e.tono])}
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-base font-semibold text-navy">{e.escenario}</h4>
              {e.base && <Badge className="h-5 shrink-0 rounded-full bg-navy px-2.5 text-white">Escenario base</Badge>}
            </div>
            <dl className="mt-4 grid gap-3 text-sm">
              {(
                [
                  ["Ingresos 2029", e.ingresos2029],
                  ["Flujo 2029", e.flujo2029],
                  ["VAN 3 años", e.van3],
                  ["VAN con valor terminal", e.vanTV],
                ] as const
              ).map(([etiqueta, n]) => (
                <div key={etiqueta} className="flex items-baseline justify-between gap-3">
                  <dt className="text-muted-foreground">{etiqueta}</dt>
                  <dd className="font-mono font-semibold tabular-nums">
                    <Cifra n={n} usd />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </Stagger>
      <p className="max-w-prose text-xs leading-relaxed text-muted-foreground">
        <RichText>{sensibilidadNota}</RichText>
      </p>
    </div>
  );
}

const pestanas: TabDef[] = [
  { id: "presupuesto", label: "Presupuesto del MVP", content: <Presupuesto /> },
  { id: "beneficios", label: "Beneficios", content: <Beneficios /> },
  { id: "proyeccion", label: "Proyección 2027-2029", content: <Proyeccion /> },
  { id: "evaluacion", label: "Evaluación económica", content: <Evaluacion /> },
  { id: "sensibilidad", label: "Sensibilidad", content: <Sensibilidad /> },
];

/**
 * `#costos` (SPEC 7.12), la sección clave: cuatro KPI fijos (SIN conteo: las cifras financieras no
 * deben leerse a medio camino), cinco pestanas, pie con supuestos y cierre de Max.
 */
export function Costos() {
  return (
    <Section id="costos" tone="mist">
      <SectionHeader
        id="costos"
        eyebrow="Costos y viabilidad"
        title={`Un MVP de ${formatUSD(mvpTotal)} para validar un negocio que necesita ${formatUSD(indicadores.rondaSemilla)}`}
      />

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpisCostos.map((k) => (
          <Kpi
            key={k.etiqueta}
            card
            size="md"
            tone={k.tono}
            value={valor(k.valor)}
            label={<RichText>{k.etiqueta}</RichText>}
            className="h-full"
          />
        ))}
      </Stagger>

      <AnimatedTabs tabs={pestanas} label="Análisis de costos y viabilidad" className="mt-12" />

      <Reveal>
        <p className="mt-10 max-w-prose text-xs leading-relaxed text-muted-foreground italic">
          <RichText>{costosPie}</RichText>
        </p>
        <SpeechBubble mascot="max" className="mt-10 max-w-2xl">
          <RichText>{mascotas.costos.texto}</RichText>
        </SpeechBubble>
      </Reveal>
    </Section>
  );
}
