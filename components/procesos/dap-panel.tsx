"use client";

import { useRef } from "react";
import { ListTree } from "lucide-react";
import { DapSimbolo } from "@/components/procesos/dap-simbolo";
import { RichText } from "@/components/common/rich-text";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  dap,
  dapConteo,
  dapLote,
  dapPorcentajeClasificacion,
  dapResumen,
  dapTotalSegundos,
  tiposDap,
} from "@/data/dap";
import { useDrawBars } from "@/hooks/use-draw-bars";
import { categorico } from "@/lib/chart-colors";
import { formatNum } from "@/lib/format";
import { cn } from "@/lib/utils";

const CLASIFICACION = dap.find((a) => a.n === 11);

/**
 * Pestaña DAP (SPEC 7.9): conteo de actividades por tipo, el tiempo total por lote, la parte que se
 * lleva la clasificación y, en un diálogo, la tabla completa de las 15 actividades.
 */
export function DapPanel() {
  const ref = useRef<HTMLDivElement>(null);
  useDrawBars(ref);
  const resto = 100 - dapPorcentajeClasificacion;

  return (
    <div ref={ref} className="grid grid-cols-1 gap-8">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5" aria-label="Actividades por tipo">
        {dapConteo.map(({ tipo, cantidad }) => (
          <li key={tipo} className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-mist text-navy">
              <DapSimbolo tipo={tipo} className="size-6" />
            </span>
            <span>
              <span className="block font-mono text-2xl leading-none font-semibold text-navy tabular-nums">{cantidad}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{tiposDap[tipo].nombre}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
        <p className="font-mono text-3xl leading-tight font-semibold text-navy tabular-nums md:text-5xl">
          {dapTotalSegundos} s{" "}
          <span className="ml-2 font-sans text-base font-normal text-ink/80 md:text-lg">
            por lote de {formatNum(dapLote.textos)} textos ({dapLote.segundosPorTexto.toString().replace(".", ",")} s/texto)
          </span>
        </p>
        <p className="sr-only">
          <RichText>{dapResumen}</RichText>
        </p>

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-navy">Clasificación = {dapPorcentajeClasificacion} % del tiempo</p>
          <div
            role="group"
            aria-label={`La clasificación de sentimiento toma ${CLASIFICACION?.s} de ${dapTotalSegundos} segundos, el ${dapPorcentajeClasificacion} % del tiempo del lote.`}
            className="flex h-6 gap-0.5"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  data-barra
                  tabIndex={0}
                  role="img"
                  aria-label={`Clasificación: ${CLASIFICACION?.s} s, ${dapPorcentajeClasificacion} %`}
                  style={{ flexGrow: dapPorcentajeClasificacion, flexBasis: 0, backgroundColor: categorico.azul }}
                  className="min-w-0 origin-left rounded-[4px] transition-[filter] duration-150 hover:brightness-110 focus-visible:brightness-110"
                />
              </TooltipTrigger>
              <TooltipContent>
                <span className="font-semibold">{CLASIFICACION?.s} s</span>
                <span className="opacity-80"> · {dapPorcentajeClasificacion} % · Clasificación de sentimiento</span>
              </TooltipContent>
            </Tooltip>
            <div style={{ flexGrow: resto, flexBasis: 0 }} className="min-w-0 rounded-[4px] bg-mist" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {CLASIFICACION?.s} s de {dapTotalSegundos} s; el resto del lote lo reparten las otras 14 actividades.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              className="mt-6 h-11 rounded-xl bg-navy px-5 text-base text-white transition-all duration-150 hover:bg-navy-deep hover:shadow-md active:scale-[0.97]"
            >
              <ListTree className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Ver detalle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[min(96vw,56rem)] gap-4 bg-white p-4 sm:max-w-3xl md:p-6">
            <DialogTitle className="pr-10 text-base font-semibold text-navy">Diagrama de análisis del proceso (DAP)</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              15 actividades de un lote de {formatNum(dapLote.textos)} textos, con su tipo y los segundos que toma cada una.
            </DialogDescription>
            <div role="region" tabIndex={0} aria-label="Actividades del DAP" className="max-h-[60vh] overflow-auto rounded-xl border border-border">
              <table className="w-full min-w-[30rem] text-sm">
                <TableHeader>
                  <TableRow className="bg-mist hover:bg-mist">
                    <TableHead className="w-12 px-3 py-2.5 text-xs font-semibold text-navy">N.°</TableHead>
                    <TableHead className="px-3 py-2.5 text-xs font-semibold text-navy">Actividad</TableHead>
                    <TableHead className="px-3 py-2.5 text-xs font-semibold text-navy">Tipo</TableHead>
                    <TableHead className="px-3 py-2.5 text-right text-xs font-semibold text-navy">s</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dap.map((a, i) => (
                    <TableRow key={a.n} className={cn("border-b border-border/70", i % 2 === 1 && "bg-[#f6f8fb]")}>
                      <TableCell className="px-3 py-2 font-mono text-xs tabular-nums">{a.n}</TableCell>
                      <TableCell className="px-3 py-2 whitespace-normal text-ink">{a.actividad}</TableCell>
                      <TableCell className="px-3 py-2">
                        <span className="flex items-center gap-2 text-navy">
                          <DapSimbolo tipo={a.tipo} />
                          <span className="text-xs text-ink/80">{tiposDap[a.tipo].nombre}</span>
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-right font-mono tabular-nums">{a.s}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="border-t-2 border-border bg-mist font-bold">
                  <TableRow className="bg-mist hover:bg-mist">
                    <TableCell className="px-3 py-2.5" />
                    <TableCell className="px-3 py-2.5">Total</TableCell>
                    <TableCell className="px-3 py-2.5" />
                    <TableCell className="px-3 py-2.5 text-right font-mono tabular-nums">{dapTotalSegundos}</TableCell>
                  </TableRow>
                </TableFooter>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
