"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ExternalLink } from "lucide-react";
import { AnimatedTabs, type TabDef } from "@/components/common/animated-tabs";
import type { Referencia } from "@/data/referencias";
import { cn } from "@/lib/utils";

const FILTROS = ["Todas", "Mercado", "Regulación", "Competencia", "NLP y metodología", "Caso Binance"] as const;
/** Cuánto dura el resaltado de la referencia a la que se llegó con `#ref-n`. */
const RESALTADO_MS = 1500;

const suscribirHash = (aviso: () => void) => {
  window.addEventListener("hashchange", aviso);
  return () => window.removeEventListener("hashchange", aviso);
};

/** El texto de la referencia con su URL como enlace externo (nueva pestaña, con el icono de 14 px). */
function Texto({ r }: { r: Referencia }) {
  if (!r.url || !r.texto.includes(r.url)) return <>{r.texto}</>;
  const [antes, despues] = r.texto.split(r.url);
  return (
    <>
      {antes}
      <a
        href={r.url}
        target="_blank"
        rel="noopener noreferrer"
        className="link-underline rounded-sm break-all text-teal-text"
      >
        {r.url}
        <ExternalLink className="ml-1 inline size-3.5 align-[-2px]" strokeWidth={1.75} aria-hidden="true" />
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
      {despues}
    </>
  );
}

function Lista({ items, resaltado }: { items: readonly Referencia[]; resaltado: string | null }) {
  return (
    <ol className="grid grid-cols-1">
      {items.map((r) => (
        <li
          key={r.n}
          id={`ref-${r.n}`}
          value={r.n}
          className={cn(
            // scroll-mt-28: el header fijo mide 60-72 px.
            "grid scroll-mt-28 grid-cols-[3.25rem_1fr] gap-3 border-b border-border px-3 py-4 transition-colors duration-700 motion-reduce:duration-150 md:px-4",
            resaltado === String(r.n) ? "bg-gold/30" : "bg-transparent",
          )}
        >
          <span className="font-mono text-sm font-semibold text-teal-text tabular-nums">[{r.n}]</span>
          <div className="min-w-0">
            <p className="text-sm leading-relaxed [overflow-wrap:anywhere] text-ink md:text-base">
              <Texto r={r} />
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">{r.grupo}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * Lista de referencias de `/referencias` (SPEC 7.18): filtro por grupo y resaltado de la referencia
 * destino. Con `#ref-n` el filtro se fuerza a «Todas» (la referencia tiene que existir en la lista) y
 * el destino se resalta 1,5 s con fondo `gold/30` que se desvanece. Todas las referencias vienen en el
 * HTML del servidor, así que el ancla funciona aunque el JavaScript tarde.
 */
export function ListaReferencias({ referencias }: { referencias: readonly Referencia[] }) {
  const [filtro, setFiltro] = useState<string>("Todas");
  const hash = useSyncExternalStore(
    suscribirHash,
    () => window.location.hash,
    () => "",
  );
  const [vencido, setVencido] = useState("");
  const destino = hash.match(/^#ref-(\d+)$/)?.[1] ?? null;
  const resaltado = destino && vencido !== destino ? destino : null;

  useEffect(() => {
    if (!destino) return;
    const t = setTimeout(() => setVencido(destino), RESALTADO_MS);
    return () => clearTimeout(t);
  }, [destino]);

  // Un `#ref-n` que llega con la página ya abierta (atrás/adelante) también muestra todas.
  useEffect(() => {
    const alCambiarHash = () => {
      if (/^#ref-\d+$/.test(window.location.hash)) setFiltro("Todas");
    };
    window.addEventListener("hashchange", alCambiarHash);
    return () => window.removeEventListener("hashchange", alCambiarHash);
  }, []);

  const pestanas: TabDef[] = FILTROS.map((f) => ({
    id: f,
    label: f,
    content: <Lista items={f === "Todas" ? referencias : referencias.filter((r) => r.grupo === f)} resaltado={resaltado} />,
  }));
  const visibles = filtro === "Todas" ? referencias.length : referencias.filter((r) => r.grupo === filtro).length;

  return (
    <div>
      <AnimatedTabs tabs={pestanas} label="Filtrar las referencias por grupo" value={filtro} onValueChange={setFiltro} />
      <p role="status" className="mt-4 text-sm text-muted-foreground">
        Mostrando {visibles} de {referencias.length} referencias{filtro === "Todas" ? "" : ` del grupo «${filtro}»`}.
      </p>
    </div>
  );
}
