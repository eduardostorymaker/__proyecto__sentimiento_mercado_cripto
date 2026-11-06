import { Fragment } from "react";
import { Cite } from "@/components/common/cite";
import { StatusBadge } from "@/components/common/status-badge";
import { refById, type RefId } from "@/data/referencias";
import { typo } from "@/lib/format";

// Con el grupo de captura, `split` conserva las marcas entre los trozos de texto.
const MARKS = /(\*\*[^*]+\*\*|\[ref:[a-z0-9_]+\]|\[Por completar\])/g;

/**
 * Texto de `/data` con marcas del spec: `**negrita**`, `[ref:id]` → `<Cite>` y `[Por completar]` →
 * marcador visible. Aplica `typo()` al texto (espacio fino en miles, espacio duro tras `US$` y
 * antes de `%`).
 *
 * Un `[ref:id]` inexistente LANZA un error: como las páginas se prerenderizan en `pnpm build`,
 * una cita rota detiene el build (SPEC 10), igual que un `<Cite id="…">` directo no compila.
 */
export function RichText({ children, tone = "light" }: { children: string; tone?: "light" | "dark" }) {
  return (
    <>
      {children.split(MARKS).map((part, i) => {
        const ref = part.match(/^\[ref:([a-z0-9_]+)\]$/);
        if (ref) {
          if (!(ref[1] in refById)) {
            throw new Error(
              `RichText: la referencia "${ref[1]}" no existe en data/referencias.ts. Texto: «${children.slice(0, 90)}…»`,
            );
          }
          return <Cite key={i} id={ref[1] as RefId} tone={tone} />;
        }
        if (part === "[Por completar]") return <StatusBadge key={i} kind="pendiente" />;
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) {
          return (
            <strong key={i} className="font-semibold">
              {typo(bold[1])}
            </strong>
          );
        }
        return <Fragment key={i}>{typo(part)}</Fragment>;
      })}
    </>
  );
}
