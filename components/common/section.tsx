import type { ReactNode } from "react";
import type { SectionId } from "@/data/nav";
import { cn } from "@/lib/utils";

export type SectionTone = "white" | "mist" | "navy";

const toneClass: Record<SectionTone, string> = {
  white: "bg-white text-ink",
  mist: "bg-mist text-ink",
  navy: "bg-navy text-white",
};

/**
 * Sección de la página (SPEC 6.4): fondo, espaciado, `scroll-mt-20` para que el header fijo no tape
 * el título al navegar por anclas, y `aria-labelledby` apuntando al título (`{id}-titulo`, que
 * genera `SectionHeader`). El `id` solo puede ser uno de `data/nav.ts`: de ahí cuelgan el menú, el
 * pie y el scroll-spy.
 */
export function Section({
  id,
  tone = "white",
  className,
  children,
}: {
  id: SectionId;
  tone?: SectionTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className={cn("scroll-mt-20 py-20 md:py-28", toneClass[tone], className)}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">{children}</div>
    </section>
  );
}
