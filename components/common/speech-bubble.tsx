import type { ReactNode } from "react";
import { MascotAvatar, type AvatarSize } from "@/components/common/mascot-avatar";
import { cn } from "@/lib/utils";

const WHO = {
  max: { name: "Max", border: "border-teal" },
  bruno: { name: "Bruno", border: "border-coral" },
  both: { name: "Max y Bruno", border: "border-navy/40" },
} as const;

export type SpeechMascot = keyof typeof WHO;

/**
 * Globo de diálogo de las mascotas (SPEC 6.3): avatar(es) + globo `rounded-2xl` con borde del color
 * de la mascota y una cola. Máximo una aparición por sección. El nombre de quien habla se anuncia a
 * lectores de pantalla («Max dice:»). `live` marca el globo como región `aria-live="polite"`, para
 * la demo del Pulse Score, cuyo mensaje cambia al mover el control.
 */
export function SpeechBubble({
  mascot,
  children,
  size = "md",
  live = false,
  className,
  avatarClassName,
}: {
  mascot: SpeechMascot;
  children: ReactNode;
  size?: AvatarSize;
  live?: boolean;
  className?: string;
  /** Clases extra para el/los avatar(es): p. ej. una entrada con escala (demo del Pulse Score). */
  avatarClassName?: string;
}) {
  const { name, border } = WHO[mascot];

  return (
    <div className={cn("flex items-start gap-3 md:gap-4", className)}>
      {mascot === "both" ? (
        <div className="flex -space-x-3">
          <MascotAvatar mascot="max" size={size} className={avatarClassName} />
          <MascotAvatar mascot="bruno" size={size} className={avatarClassName} />
        </div>
      ) : (
        <MascotAvatar mascot={mascot} size={size} className={avatarClassName} />
      )}
      <div
        {...(live ? { "aria-live": "polite" as const, "aria-atomic": true } : { role: "note" })}
        className={cn(
          "relative flex-1 rounded-2xl border-2 bg-white px-4 py-3 text-sm leading-relaxed text-ink shadow-sm md:px-5 md:text-base",
          border,
        )}
      >
        {/* Cola: cuadrado girado que hereda el color del borde del globo. */}
        <span
          aria-hidden="true"
          className="absolute top-5 -left-[9px] size-4 rotate-45 border-b-2 border-l-2 border-inherit bg-white"
        />
        <span className="sr-only">{name} dice: </span>
        {children}
      </div>
    </div>
  );
}
