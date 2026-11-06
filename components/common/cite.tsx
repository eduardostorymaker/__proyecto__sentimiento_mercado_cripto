import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { refById, type RefId } from "@/data/referencias";
import { cn } from "@/lib/utils";

/**
 * Cita IEEE `[n]` (SPEC 5.3 y 6.4): muestra el texto de la referencia en un `HoverCard` (abre a
 * 150 ms, cierra a 100 ms; también se abre con el foco del teclado) y enlaza a
 * `/referencias#ref-n`. `id` es un `RefId`: un id inexistente no compila.
 * `tone="dark"` para fondos navy.
 */
export function Cite({ id, tone = "light" }: { id: RefId; tone?: "light" | "dark" }) {
  const ref = refById[id];

  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link
          href={`/referencias#ref-${ref.n}`}
          aria-label={`Referencia ${ref.n}`}
          className={cn(
            "rounded-sm font-mono text-[0.85em] font-medium hover:underline",
            tone === "dark" ? "text-teal-soft" : "text-teal-text",
          )}
        >
          [{ref.n}]
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 text-xs leading-relaxed">
        <p className="mb-1.5 text-[0.7rem] font-semibold tracking-[0.12em] text-teal-text uppercase">
          Referencia {ref.n} · {ref.grupo}
        </p>
        <p>{ref.texto}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
