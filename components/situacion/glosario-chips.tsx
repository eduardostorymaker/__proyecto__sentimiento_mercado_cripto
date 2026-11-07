import { Minus, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { ChipTooltip } from "@/components/common/chip-tooltip";
import { glosario, type TonoTermino } from "@/data/glosario";
import { cn } from "@/lib/utils";

const TONO: Record<TonoTermino, { clase: string; icono: LucideIcon; nombre: string }> = {
  positivo: { clase: "border-teal/40 bg-teal/10 text-teal-text", icono: TrendingUp, nombre: "Positivo" },
  negativo: { clase: "border-coral/40 bg-coral/10 text-coral-text", icono: TrendingDown, nombre: "Negativo" },
  neutral: { clase: "border-border bg-mist text-ink", icono: Minus, nombre: "Neutral o sin efecto" },
};

/**
 * Glosario del dominio (SPEC 7.11): un chip por término con su definición y su efecto en el sentimiento
 * en un tooltip (con el foco, el puntero o un toque). El color del chip es el del efecto (teal
 * positivo, coral negativo, gris neutral o sin efecto) y lo acompañan un icono y la leyenda.
 */
export function GlosarioChips() {
  return (
    <div>
      <ul className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/80" aria-label="Leyenda de colores">
        {(Object.keys(TONO) as TonoTermino[]).map((t) => {
          const { icono: Icono, nombre, clase } = TONO[t];
          return (
            <li key={t} className="flex items-center gap-2">
              <span className={cn("grid size-6 place-items-center rounded-md border", clase)}>
                <Icono className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              {nombre}
            </li>
          );
        })}
      </ul>
      <ul className="flex flex-wrap gap-2.5">
        {glosario.map((g) => {
          const { icono: Icono, clase } = TONO[g.tono];
          return (
            <li key={g.termino}>
              <ChipTooltip
                className={cn(
                  "flex min-h-10 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition duration-150 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
                  clase,
                )}
                contentClassName="max-w-xs"
                tip={
                  <div className="grid gap-1">
                    <span className="font-semibold">{g.termino}</span>
                    <span>{g.definicion}</span>
                    {g.efecto && (
                      <span className="opacity-90">
                        <strong className="font-semibold">Efecto en el sentimiento:</strong> {g.efecto}
                      </span>
                    )}
                  </div>
                }
              >
                <Icono className="size-4" strokeWidth={1.75} aria-hidden="true" />
                {g.termino}
              </ChipTooltip>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
