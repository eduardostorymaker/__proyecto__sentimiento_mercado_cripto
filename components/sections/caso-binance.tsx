import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { AspectosHeatmap } from "@/components/caso/aspectos-heatmap";
import { CalidadGrid } from "@/components/caso/calidad-grid";
import { CasoKpis } from "@/components/caso/caso-kpis";
import { CasoTimeline, type HitoVista } from "@/components/caso/caso-timeline";
import { DistintivosChart } from "@/components/caso/distintivos-chart";
import { EmbudoChart } from "@/components/caso/embudo-chart";
import { EntidadesChart } from "@/components/caso/entidades-chart";
import { GaleriaNotebook } from "@/components/caso/galeria-notebook";
import { IdiomaChart } from "@/components/caso/idioma-chart";
import { PulsePreliminarChartLazy, VolumenChartLazy } from "@/components/caso/lazy";
import { SentimientoBars } from "@/components/caso/sentimiento-bars";
import { TerminosChart } from "@/components/caso/terminos-chart";
import { TitularesCarousel } from "@/components/caso/titulares-carousel";
import { ChartCard } from "@/components/charts/chart-shell";
import { AnimatedTabs, type TabDef } from "@/components/common/animated-tabs";
import { CountUp } from "@/components/common/count-up";
import { Kpi } from "@/components/common/kpi";
import { Reveal } from "@/components/common/reveal";
import { RichText } from "@/components/common/rich-text";
import { SectionHeader } from "@/components/common/section-header";
import { SpeechBubble } from "@/components/common/speech-bubble";
import { Stagger } from "@/components/common/stagger";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  calidadTexto,
  casoPie,
  casoTexto,
  conclusiones,
  FECHA_REANUDACION,
  figurasNotebook,
  hitos,
  idiomaTexto,
  sentimientoTexto,
  volumenTexto,
  type ColorHito,
} from "@/data/caso";
import { mascotas } from "@/data/mascotas";
import { getCasoData, type CasoData } from "@/lib/caso";
import { fillCaso } from "@/lib/caso-util";
import { categorico, fuente } from "@/lib/chart-colors";
import { fechaHito } from "@/lib/format";

const COLOR_HITO: Record<ColorHito, string> = {
  coral: categorico.coral,
  "fuente-google": fuente.google_news,
  "fuente-youtube": fuente.youtube,
  teal: categorico.teal,
  gold: "#E9C46A",
};

/** Fecha de cada hito: todas salen del JSON, salvo la reanudación de retiros (ver `data/caso.ts`). */
function fechaDe(id: (typeof hitos)[number]["id"], caso: CasoData): string {
  const k = caso.kpis;
  switch (id) {
    case "ataque":
      return fechaHito(caso.caso.evento_utc);
    case "primer-titular":
      return fechaHito(k.primer_documento_utc.google_news);
    case "primer-comentario":
      return fechaHito(k.primer_documento_utc.youtube);
    case "reanudacion":
      return fechaHito(FECHA_REANUDACION, { hora: false });
    case "pico":
      return fechaHito(`${k.dia_pico}T00:00:00+00:00`, { hora: false });
  }
}

const Subtitulo = ({ children, extra }: { children: ReactNode; extra?: ReactNode }) => (
  <div className="mb-6 flex flex-wrap items-center gap-3">
    <h3 className="text-xl font-semibold tracking-tight text-navy md:text-2xl">{children}</h3>
    {extra}
  </div>
);

function Hallazgo({ children }: { children: ReactNode }) {
  return (
    <Alert role="note" className="border-gold bg-gold/15 text-ink">
      <TriangleAlert className="size-4 text-ink" strokeWidth={1.75} aria-hidden="true" />
      <p className="font-medium">{children}</p>
    </Alert>
  );
}

/**
 * `#caso-binance` (SPEC 7.15). Componente de SERVIDOR: llama a `getCasoData()` directamente (no hace
 * `fetch` a su propia API) y pasa a cada gráfico de cliente solo el fragmento que necesita. TODAS las
 * cifras salen de `data/caso-binance/eda_summary.json`. Va de blanco a navy en las conclusiones.
 */
export async function CasoBinance() {
  const caso = await getCasoData();
  const k = caso.kpis;

  const hitosVista: HitoVista[] = hitos.map((h) => ({
    id: h.id,
    fecha: fechaDe(h.id, caso),
    titulo: fillCaso(h.titulo, caso),
    color: COLOR_HITO[h.color],
  }));

  const volumenConclusion = fillCaso(volumenTexto.conclusion, caso);
  const truncados = caso.calidad.find((f) => /truncados/i.test(f.Chequeo));
  const nTruncados = truncados ? (String(truncados.Valor).match(/^\d+/)?.[0] ?? "") : "";

  const terminosTabs: TabDef[] = [
    {
      id: "medios",
      label: "Medios",
      content: (
        <ChartCard heading="h4" title="Términos más frecuentes en los titulares (documentos que los contienen)">
          <TerminosChart caso={caso} clave="google_news" />
        </ChartCard>
      ),
    },
    {
      id: "comunidad",
      label: "Comunidad",
      content: (
        <ChartCard heading="h4" title="Términos más frecuentes en los comentarios (documentos que los contienen)">
          <TerminosChart caso={caso} clave="youtube" />
        </ChartCard>
      ),
    },
    {
      id: "distintivos",
      label: "Durante vs. después",
      content: (
        <ChartCard heading="h4" title="Términos distintivos: crisis aguda frente a etapa posterior">
          <DistintivosChart caso={caso} />
        </ChartCard>
      ),
    },
    {
      id: "entidades",
      label: "Entidades y temas",
      content: (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard heading="h4" title="Entidades mencionadas">
            <EntidadesChart caso={caso} />
          </ChartCard>
          <ChartCard heading="h4" title="Aspectos por fuente y periodo">
            <AspectosHeatmap caso={caso} />
          </ChartCard>
        </div>
      ),
    },
  ];

  return (
    <section id="caso-binance" aria-labelledby="caso-binance-titulo" className="scroll-mt-20">
      {/* ── A–H: fondo blanco ─────────────────────────────────────────────────────────── */}
      <div className="bg-white py-20 text-ink md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <SectionHeader
            id="caso-binance"
            eyebrow={casoTexto.eyebrow}
            title={casoTexto.titulo}
            subtitle={<RichText>{fillCaso(casoTexto.intro, caso)}</RichText>}
          />
          <CasoTimeline hitos={hitosVista} />
          <CasoKpis caso={caso} />

          <div className="mt-16 md:mt-20">
            <Subtitulo>¿Cuándo se habló?</Subtitulo>
            <ChartCard>
              <VolumenChartLazy
                seis={caso.volumen_6h}
                dia={caso.volumen_diario}
                eventoUtc={caso.caso.evento_utc}
                finDuranteUtc={caso.caso.fin_durante_utc}
                conclusion={volumenConclusion}
                notaSeis={fillCaso(volumenTexto.base6h, caso)}
                notaDia={fillCaso(volumenTexto.baseDiaria, caso)}
                bloquePrevio={volumenTexto.bloquePrevio}
                resumen={`Documentos por fuente a lo largo del caso. ${volumenConclusion}`}
              />
            </ChartCard>
          </div>

          <div className="mt-16 md:mt-20">
            <Subtitulo>¿En qué idioma y con qué longitud?</Subtitulo>
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[2fr_1fr]">
              <ChartCard>
                <IdiomaChart caso={caso} />
              </ChartCard>
              <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <Kpi card size="md" value={<CountUp value={k.mediana_palabras_corpus} suffix=" palabras" />} label={idiomaTexto.longitud} hint={idiomaTexto.longitudHint} />
                <Kpi card size="md" value={<CountUp value={k.cobertura_max_length_128_pct} kind="pct" decimals={1} />} label={idiomaTexto.subtokens} hint={idiomaTexto.subtokensHint} />
              </Stagger>
            </div>
          </div>

          <div className="mt-16 md:mt-20">
            <Subtitulo>¿De qué se habló?</Subtitulo>
            <AnimatedTabs tabs={terminosTabs} label="Vocabulario, entidades y temas del caso" />
          </div>

          <div className="mt-16 md:mt-20">
            <Subtitulo extra={<Badge className="h-6 rounded-full border-gold bg-gold/25 px-3 text-ink">{sentimientoTexto.insignia}</Badge>}>¿Con qué tono?</Subtitulo>
            <Alert role="note" className="mb-6 border-gold bg-gold/15 text-ink">
              <TriangleAlert className="size-4 text-ink" strokeWidth={1.75} aria-hidden="true" />
              <p>{sentimientoTexto.alerta}</p>
            </Alert>
            <div className="grid grid-cols-1 gap-6">
              <ChartCard heading="h4" title="Pulse Score diario preliminar, por fuente">
                <PulsePreliminarChartLazy puntos={caso.pulse_score_diario_preliminar} />
              </ChartCard>
              <ChartCard heading="h4" title="Sentimiento léxico preliminar, por fuente">
                <SentimientoBars caso={caso} />
              </ChartCard>
            </div>
            <Reveal>
              <SpeechBubble mascot="bruno" className="mt-8 max-w-2xl">
                <RichText>{mascotas.casoSentimiento.texto}</RichText>
              </SpeechBubble>
            </Reveal>
          </div>

          <div className="mt-16 md:mt-20">
            <Subtitulo>Titulares del caso</Subtitulo>
            <TitularesCarousel titulares={caso.titulares_ejemplo} />
          </div>

          <div className="mt-16 md:mt-20">
            <Subtitulo>¿Los datos son confiables?</Subtitulo>
            <CalidadGrid calidad={caso.calidad} />
            <ChartCard heading="h4" title="Del corpus inicial al corpus curado" className="mt-6">
              <EmbudoChart pasos={caso.embudo_curado.map((e) => ({ nombre: e.Paso, restantes: e["Documentos restantes"] }))} />
            </ChartCard>
            <Stagger className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Hallazgo>
                <RichText>{fillCaso(calidadTexto.spam, caso)}</RichText>
              </Hallazgo>
              <Hallazgo>{nTruncados ? `${nTruncados} videos truncados en 100 comentarios` : "Videos truncados en 100 comentarios"}</Hallazgo>
              <Hallazgo>
                <RichText>{fillCaso(calidadTexto.lineaBase, caso)}</RichText>
              </Hallazgo>
            </Stagger>
          </div>
        </div>
      </div>

      {/* ── I–J: fondo navy ───────────────────────────────────────────────────────────── */}
      <div className="bg-navy py-20 text-white md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">Conclusiones</h3>
          </Reveal>
          <Stagger as="ol" className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {conclusiones.map((c, i) => (
              <li key={i} className="flex gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <span aria-hidden="true" className="font-mono text-3xl font-semibold text-teal-soft tabular-nums">
                  {i + 1}
                </span>
                <p className="text-base leading-relaxed text-mist/95">
                  <RichText tone="dark">{fillCaso(c, caso)}</RichText>
                </p>
              </li>
            ))}
          </Stagger>
          <Reveal>
            <SpeechBubble mascot="max" className="mt-10 max-w-2xl">
              <RichText>{mascotas.casoCierre.texto}</RichText>
            </SpeechBubble>
            <div className="mt-10">
              <GaleriaNotebook figuras={figurasNotebook} />
            </div>
            <p className="mt-8 text-xs text-mist/75">{fillCaso(casoPie, caso)}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
