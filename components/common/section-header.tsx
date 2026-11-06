import type { ReactNode } from "react";
import type { SectionId } from "@/data/nav";
import { Reveal } from "@/components/common/reveal";
import { cn } from "@/lib/utils";

/**
 * Cabecera de sección: eyebrow, H2 y subtítulo, dentro de `<Reveal>` (SPEC 6.4).
 * `id` es el de la sección: el H2 recibe `{id}-titulo`, al que apunta `aria-labelledby`.
 * `tone="dark"` para secciones sobre fondo navy.
 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "light",
}: {
  id: SectionId;
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <Reveal className={cn("mb-12 max-w-3xl md:mb-14", align === "center" && "mx-auto text-center")}>
      <p
        className={cn(
          "text-xs font-semibold tracking-[0.16em] uppercase",
          dark ? "text-teal-soft" : "text-teal-text",
        )}
      >
        {eyebrow}
      </p>
      <h2
        id={`${id}-titulo`}
        className={cn(
          "mt-3 text-3xl font-semibold tracking-tight md:text-4xl",
          dark ? "text-white" : "text-navy",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-[17px]",
            align === "center" && "mx-auto",
            "max-w-prose",
            dark ? "text-mist/85" : "text-ink/80",
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
