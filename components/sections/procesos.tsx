import { AnimatedTabs, type TabDef } from "@/components/common/animated-tabs";
import { DataTable } from "@/components/common/data-table";
import { FiguraInforme } from "@/components/common/figura-informe";
import { PulseDivider } from "@/components/common/pulse-divider";
import { Section } from "@/components/common/section";
import { SectionHeader } from "@/components/common/section-header";
import { Subtitulo } from "@/components/common/subtitulo";
import { DapPanel } from "@/components/procesos/dap-panel";
import { ProcesoStepper } from "@/components/procesos/proceso-stepper";
import { kpisProceso, pasosProceso } from "@/data/dap";

const pestanas: TabDef[] = [
  { id: "flujograma", label: "Flujograma", content: <FiguraInforme id="flujograma" className="mx-auto max-w-3xl" sizes="(min-width: 1024px) 768px, 100vw" /> },
  { id: "arquitectura", label: "Arquitectura", content: <FiguraInforme id="arquitectura" className="mx-auto max-w-4xl" /> },
  { id: "dap", label: "DAP", content: <DapPanel /> },
  { id: "adquisicion", label: "Adquisición de clientes", content: <FiguraInforme id="suscripcion" className="mx-auto max-w-4xl" /> },
];

/** `#procesos` (SPEC 7.9): pasos del pipeline, cuatro vistas del proceso y los indicadores de control. */
export function Procesos() {
  return (
    <Section id="procesos" tone="white">
      <PulseDivider />
      <SectionHeader id="procesos" eyebrow="Cómo funciona" title="De la fuente al indicador, cada 30 minutos" />

      <ProcesoStepper pasos={pasosProceso} />

      <AnimatedTabs tabs={pestanas} label="Vistas del proceso de generación del Pulse Score" className="mt-14" />

      <div className="mt-16 md:mt-20">
        <Subtitulo>Indicadores de los procesos clave</Subtitulo>
        <DataTable
          caption="Metas de los indicadores de los procesos"
          columns={[
            { key: "indicador", label: "Indicador" },
            { key: "meta", label: "Meta", align: "right", mono: true },
          ]}
          rows={kpisProceso.map((k) => ({ indicador: k.indicador, meta: k.meta }))}
          className="max-w-2xl"
        />
      </div>
    </Section>
  );
}
