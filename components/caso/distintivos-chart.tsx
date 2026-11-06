import { ChartShell } from "@/components/charts/chart-shell";
import { TERMINO_SPAM } from "@/components/caso/terminos-chart";
import { Reveal } from "@/components/common/reveal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { terminosTexto } from "@/data/caso";
import type { CasoData } from "@/lib/caso";
import { periodo } from "@/lib/chart-colors";
import { formatNum } from "@/lib/format";

type Periodo = "durante" | "despues";

/**
 * Términos distintivos: log-odds de la crisis aguda frente a la etapa posterior (SPEC 7.15-E).
 * Barras divergentes desde un eje central: lo propio de la crisis aguda a la derecha (violeta, el
 * punto del gráfico) y lo propio de la etapa posterior a la izquierda (gris). Los grupos van
 * separados y rotulados, así que el lado y el rótulo dicen el periodo y el color es refuerzo.
 */
export function DistintivosChart({ caso }: { caso: CasoData }) {
  const durante = Object.entries(caso.terminos_distintivos.durante).sort((a, b) => b[1] - a[1]);
  const despues = Object.entries(caso.terminos_distintivos.despues).sort((a, b) => a[1] - b[1]);
  const max = Math.max(...durante.map(([, v]) => Math.abs(v)), ...despues.map(([, v]) => Math.abs(v)));

  const grupos: { id: Periodo; titulo: string; filas: [string, number][] }[] = [
    { id: "durante", titulo: "Durante la crisis aguda", filas: durante },
    { id: "despues", titulo: "Después", filas: despues },
  ];

  return (
    <Reveal>
      <ChartShell
        label={`Términos distintivos. Durante la crisis aguda destacan ${durante.slice(0, 4).map(([t]) => t).join(", ")}; después, ${despues.slice(0, 4).map(([t]) => t).join(", ")}.`}
        table={
          <table>
            <caption>Términos distintivos por periodo (log-odds; positivo = crisis aguda, negativo = etapa posterior)</caption>
            <thead>
              <tr>
                <th scope="col">Periodo</th>
                <th scope="col">Término</th>
                <th scope="col">Log-odds</th>
              </tr>
            </thead>
            <tbody>
              {grupos.flatMap((g) =>
                g.filas.map(([termino, v]) => (
                  <tr key={`${g.id}-${termino}`}>
                    <th scope="row">{g.titulo}</th>
                    <td>{termino}</td>
                    <td>{formatNum(v, { decimals: 2 })}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        }
      >
        <div className="grid grid-cols-1 gap-6">
          {grupos.map((g) => (
            <section key={g.id} aria-label={g.titulo}>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-navy">
                <span aria-hidden="true" className="size-3 rounded-[3px]" style={{ backgroundColor: periodo[g.id] }} />
                {g.titulo}
              </h4>
              <ul className="grid grid-cols-1 gap-1">
                {g.filas.map(([termino, v]) => {
                  const spam = termino.toLowerCase() === TERMINO_SPAM;
                  const ancho = `${(100 * Math.abs(v)) / max}%`;
                  const aLaDerecha = v > 0;
                  return (
                    <li key={termino} className="grid grid-cols-[8rem_1fr_1fr] items-center gap-0">
                      <span className="truncate pr-3 text-right text-sm text-ink/80" title={spam ? `${termino} (spam)` : termino}>
                        {termino}
                        {spam && (
                          <>
                            {" "}
                            <span className="text-xs text-muted-foreground italic">(spam)</span>
                          </>
                        )}
                      </span>
                      {/* Mitad izquierda (valores negativos) y mitad derecha (positivos) alrededor del eje central. */}
                      <div className="flex h-3.5 justify-end border-r border-border">
                        {!aLaDerecha && <Barra termino={termino} v={v} ancho={ancho} color={periodo.despues} lado="izquierda" spam={spam} />}
                      </div>
                      <div className="flex h-3.5">
                        {aLaDerecha && <Barra termino={termino} v={v} ancho={ancho} color={periodo.durante} lado="derecha" spam={spam} />}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">{terminosTexto.eje}</p>
      </ChartShell>
      <ul className="mt-4 grid max-w-prose gap-1.5 text-sm leading-relaxed text-ink/80">
        <li>{terminosTexto.durante}</li>
        <li>{terminosTexto.despues}</li>
      </ul>
    </Reveal>
  );
}

function Barra({ termino, v, ancho, color, lado, spam }: { termino: string; v: number; ancho: string; color: string; lado: "izquierda" | "derecha"; spam: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          tabIndex={0}
          role="img"
          aria-label={`${termino}: log-odds ${formatNum(v, { decimals: 2 })}${spam ? `. ${terminosTexto.spamTooltip}` : ""}`}
          style={{ width: ancho, backgroundColor: color }}
          className={`h-full min-w-1 transition-[filter] duration-150 hover:brightness-110 focus-visible:brightness-110 ${lado === "izquierda" ? "rounded-l-[4px]" : "rounded-r-[4px]"}`}
        />
      </TooltipTrigger>
      <TooltipContent>
        <span className="font-semibold">{formatNum(v, { decimals: 2 })}</span>
        <span className="opacity-80"> · {termino}</span>
        {spam && <span className="block text-[0.7rem] opacity-80">{terminosTexto.spamTooltip}</span>}
      </TooltipContent>
    </Tooltip>
  );
}
