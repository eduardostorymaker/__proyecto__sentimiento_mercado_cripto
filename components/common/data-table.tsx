import type { ReactNode } from "react";
import { TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Reveal } from "@/components/common/reveal";
import { cn } from "@/lib/utils";

export interface Column {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  /** Cifras: fuente monoespaciada con dígitos tabulares. */
  mono?: boolean;
}

export type Row = Record<string, ReactNode>;

interface DataTableProps {
  columns: readonly Column[];
  rows: readonly Row[];
  /** Título de la tabla (elemento `<caption>`, también su nombre accesible). */
  caption?: string;
  source?: ReactNode;
  /** Fila final en negrita con fondo mist. */
  totalRow?: Row;
  /** Índices de filas destacadas (p. ej. la de Pulse Analytics frente a la competencia). */
  highlightRows?: readonly number[];
  /** Índices de filas en negrita sobre fondo mist (subtotales, «Flujo neto»). */
  emphasisRows?: readonly number[];
  className?: string;
}

const alignClass = { left: "text-left", right: "text-right", center: "text-center" } as const;

// Fondos OPACOS: la primera columna es `sticky` y, con un fondo translúcido, dejaría ver el
// contenido que pasa por debajo al desplazar la tabla en móvil.
const ROW_WHITE = "bg-white";
const ROW_ZEBRA = "bg-[#f6f8fb]"; // mist al 50 % sobre blanco
const ROW_HIGHLIGHT = "bg-[#e8f5f3] font-bold"; // teal al 10 % sobre blanco
const ROW_EMPHASIS = "bg-mist font-bold";

/**
 * Tabla de datos (SPEC 6.4): cebra, fila total, primera columna fija y scroll horizontal en móvil.
 * La región con scroll es enfocable, para poder desplazarla con el teclado (WCAG 2.1.1).
 */
export function DataTable({
  columns,
  rows,
  caption,
  source,
  totalRow,
  highlightRows = [],
  emphasisRows = [],
  className,
}: DataTableProps) {
  const cellClass = (col: Column, i: number) =>
    cn(
      "px-4 py-2.5 align-top whitespace-normal",
      alignClass[col.align ?? "left"],
      i === 0 && "sticky left-0 z-[1] bg-inherit font-medium text-navy",
    );
  // Cifras: monoespaciada y SIN saltos de línea, aunque el dato traiga espacios normales como
  // separador de miles (si no, «−96 000» se partiría en dos líneas en una celda angosta).
  const cells = (row: Row) =>
    columns.map((col, i) => (
      <TableCell key={col.key} className={cn(cellClass(col, i), col.mono && "font-mono tabular-nums whitespace-nowrap")}>
        {row[col.key]}
      </TableCell>
    ));

  return (
    <Reveal className={className}>
      {/* El título va FUERA de la región con scroll para que no se desplace con la tabla en móvil;
          el <caption> de abajo queda solo para lectores de pantalla. */}
      {caption && <p className="mb-2 px-1 text-sm font-semibold text-navy">{caption}</p>}
      <div
        role="region"
        tabIndex={0}
        aria-label={caption ?? "Tabla de datos"}
        className="overflow-x-auto rounded-xl border border-border bg-white"
      >
        <table className="w-full min-w-[34rem] text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <TableHeader>
            <TableRow className="border-b border-border bg-mist hover:bg-mist">
              {columns.map((col, i) => (
                <TableHead key={col.key} className={cn(cellClass(col, i), "text-xs font-semibold text-navy")}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, r) => (
              <TableRow
                key={r}
                className={cn(
                  "border-b border-border/70 transition-colors duration-150 hover:bg-mist",
                  highlightRows.includes(r)
                    ? ROW_HIGHLIGHT
                    : emphasisRows.includes(r)
                      ? ROW_EMPHASIS
                      : r % 2 === 0
                        ? ROW_WHITE
                        : ROW_ZEBRA,
                )}
              >
                {cells(row)}
              </TableRow>
            ))}
          </TableBody>
          {totalRow && (
            <TableFooter className="border-t-2 border-border bg-mist font-bold">
              <TableRow className="bg-mist hover:bg-mist">{cells(totalRow)}</TableRow>
            </TableFooter>
          )}
        </table>
      </div>
      {source && <p className="mt-2 text-xs text-muted-foreground">Fuente: {source}</p>}
    </Reveal>
  );
}
