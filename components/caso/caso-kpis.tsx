import type { ReactNode } from "react";
import { CountUp } from "@/components/common/count-up";
import { Kpi } from "@/components/common/kpi";
import { RichText } from "@/components/common/rich-text";
import { Stagger } from "@/components/common/stagger";
import { kpiEtiquetas } from "@/data/caso";
import type { CasoData } from "@/lib/caso";
import { fillCaso } from "@/lib/caso-util";
import { cn } from "@/lib/utils";

/**
 * Seis KPI del caso (SPEC 7.15-B), con conteo permitido. TODAS las cifras salen del JSON.
 * En móvil son 2 columnas; el primero y el último ocupan las dos porque «1 445 → 1 228» no cabe en
 * media tarjeta sin desbordar.
 */
export function CasoKpis({ caso }: { caso: CasoData }) {
  const k = caso.kpis;
  const ok = k.chequeos_calidad.OK ?? 0;

  const items: { id: string; valor: ReactNode; etiqueta: string; ancho?: boolean }[] = [
    {
      id: "documentos",
      valor: (
        <>
          <CountUp value={k.documentos_iniciales} /> <span aria-label="a">→</span> <CountUp value={k.documentos_curados} />
        </>
      ),
      etiqueta: kpiEtiquetas.documentos,
      ancho: true,
    },
    { id: "titulares", valor: <CountUp value={k.titulares_google_news} />, etiqueta: fillCaso(kpiEtiquetas.titulares, caso) },
    { id: "comentarios", valor: <CountUp value={k.comentarios_youtube} />, etiqueta: fillCaso(kpiEtiquetas.comentarios, caso) },
    { id: "desfase", valor: <CountUp value={k.desfase_noticias_comentarios_h} signed suffix=" h" />, etiqueta: fillCaso(kpiEtiquetas.desfase, caso) },
    { id: "espanol", valor: <CountUp value={k.pct_espanol} kind="pct" decimals={1} />, etiqueta: kpiEtiquetas.espanol },
    {
      id: "calidad",
      valor: (
        <>
          <CountUp value={ok} />
          {`/${k.chequeos_total}`}
        </>
      ),
      etiqueta: fillCaso(kpiEtiquetas.calidad, caso),
      ancho: true,
    },
  ];

  return (
    <Stagger className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <Kpi
          key={item.id}
          card
          size="md"
          value={item.valor}
          label={<RichText>{item.etiqueta}</RichText>}
          className={cn("h-full", item.ancho && "col-span-2 lg:col-span-1")}
        />
      ))}
    </Stagger>
  );
}
