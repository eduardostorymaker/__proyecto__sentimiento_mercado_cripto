import { CircleAlert, ShieldAlert, ShieldCheck, type LucideIcon } from "lucide-react";
import { StatusBadge } from "@/components/common/status-badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CasoData, EstadoCalidad } from "@/lib/caso";
import { decimalComa } from "@/lib/caso-util";
import { estadoCalidad } from "@/lib/chart-colors";
import { typo } from "@/lib/format";
import { cn } from "@/lib/utils";

type Fila = CasoData["calidad"][number];

const ORDEN: readonly EstadoCalidad[] = ["OK", "REVISAR", "CRÍTICO"];
const ESTADO = {
  OK: { texto: "OK", icono: ShieldCheck, tono: "bajo" as const },
  REVISAR: { texto: "A revisar", icono: CircleAlert, tono: "medio" as const },
  CRÍTICO: { texto: "Crítico", icono: ShieldAlert, tono: "alto" as const },
} satisfies Record<EstadoCalidad, { texto: string; icono: LucideIcon; tono: "bajo" | "medio" | "alto" }>;

/** El peor estado de un grupo de chequeos: crítico > a revisar > OK. */
const peor = (filas: Fila[]): EstadoCalidad => [...ORDEN].reverse().find((e) => filas.some((f) => f.Estado === e)) ?? "OK";

const cuenta = (filas: Fila[], e: EstadoCalidad) => filas.filter((f) => f.Estado === e).length;

/**
 * Calidad de los datos (SPEC 7.15-H): una tarjeta por dimensión con «n OK / m a revisar» y el color y
 * el icono de su PEOR estado (OK teal, a revisar dorado, crítico coral; el estado va siempre en texto
 * además de color). Al abrirla, un diálogo lista los chequeos de esa dimensión. Cada tarjeta es su
 * propio `DialogTrigger`, así que Radix devuelve el foco a la tarjeta al cerrar.
 */
export function CalidadGrid({ calidad }: { calidad: CasoData["calidad"] }) {
  const dimensiones = [...new Set(calidad.map((f) => f["Dimensión"]))];

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {dimensiones.map((dim) => {
        const filas = calidad.filter((f) => f["Dimensión"] === dim);
        const estado = peor(filas);
        const { icono: Icono, texto } = ESTADO[estado];
        const criticos = cuenta(filas, "CRÍTICO");
        return (
          <li key={dim}>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  data-estado={estado}
                  aria-label={`${dim}: ${cuenta(filas, "OK")} OK, ${cuenta(filas, "REVISAR")} a revisar${criticos ? `, ${criticos} críticos` : ""}. Ver los chequeos`}
                  style={{ borderLeftColor: estadoCalidad[estado] }}
                  className="flex h-full w-full flex-col items-start gap-2 rounded-2xl border border-l-4 border-border bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-ink/80">
                    <Icono className="size-4" strokeWidth={1.75} aria-hidden="true" />
                    {texto}
                  </span>
                  <span className="text-sm font-semibold text-navy">{dim}</span>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {cuenta(filas, "OK")} OK / {cuenta(filas, "REVISAR")} a revisar
                    {criticos > 0 && ` / ${criticos} críticos`}
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[min(96vw,64rem)] gap-4 bg-white p-4 sm:max-w-5xl md:p-6">
                <DialogTitle className="pr-10 text-base font-semibold text-navy">Calidad de los datos: {dim}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {filas.length} chequeos automáticos con su umbral y estado.
                </DialogDescription>
                <div role="region" tabIndex={0} aria-label={`Chequeos de ${dim}`} className="max-h-[60vh] overflow-auto rounded-xl border border-border">
                  <table className="w-full min-w-[40rem] text-sm">
                    <TableHeader>
                      <TableRow className="bg-mist hover:bg-mist">
                        {["Chequeo", "Fuente", "Valor", "Umbral", "Estado"].map((c) => (
                          <TableHead key={c} className="px-3 py-2.5 text-xs font-semibold text-navy">
                            {c}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filas.map((f, i) => (
                        <TableRow key={i} className={cn("border-b border-border/70", i % 2 === 1 && "bg-[#f6f8fb]")}>
                          <TableCell className="px-3 py-2.5 align-top whitespace-normal text-ink">{typo(f.Chequeo)}</TableCell>
                          <TableCell className="px-3 py-2.5 align-top whitespace-normal text-ink/80">{f.Fuente}</TableCell>
                          <TableCell className="px-3 py-2.5 align-top font-mono text-xs whitespace-normal tabular-nums">{typo(decimalComa(String(f.Valor)))}</TableCell>
                          <TableCell className="px-3 py-2.5 align-top whitespace-normal text-ink/80">{typo(decimalComa(String(f.Umbral)))}</TableCell>
                          <TableCell className="px-3 py-2.5 align-top">
                            <StatusBadge kind={ESTADO[f.Estado].tono}>{ESTADO[f.Estado].texto}</StatusBadge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </table>
                </div>
              </DialogContent>
            </Dialog>
          </li>
        );
      })}
    </ul>
  );
}
