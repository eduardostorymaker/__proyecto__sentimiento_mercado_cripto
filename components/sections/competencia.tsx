import { DataTable } from "@/components/common/data-table";
import { FiguraInforme } from "@/components/common/figura-informe";
import { RichText } from "@/components/common/rich-text";
import { Section } from "@/components/common/section";
import { SectionHeader } from "@/components/common/section-header";
import { competidores, FILA_PULSE } from "@/data/competidores";

/** `#competencia` (SPEC 7.7): tabla comparativa con la fila de Pulse Analytics resaltada y mapa de posicionamiento. */
export function Competencia() {
  return (
    <Section id="competencia" tone="mist">
      <SectionHeader id="competencia" eyebrow="Competencia" title="Donde los demás hablan inglés, nosotros hablamos tu idioma" />

      <DataTable
        caption="Pulse Analytics frente a sus competidores"
        columns={[
          { key: "competidor", label: "Competidor" },
          { key: "especializacion", label: "Especialización" },
          { key: "idiomaFoco", label: "Idioma y foco" },
          { key: "precioEntrada", label: "Precio de entrada" },
          { key: "diferencia", label: "Diferencia de Pulse" },
        ]}
        rows={competidores.map((c) => ({
          competidor: <RichText>{c.competidor}</RichText>,
          especializacion: c.especializacion,
          idiomaFoco: c.idiomaFoco,
          precioEntrada: c.precioEntrada,
          diferencia: c.diferencia,
        }))}
        highlightRows={[FILA_PULSE]}
      />

      <div className="mx-auto mt-12 max-w-3xl">
        <FiguraInforme id="posicionamiento" sizes="(min-width: 1024px) 768px, 100vw" />
      </div>
    </Section>
  );
}
