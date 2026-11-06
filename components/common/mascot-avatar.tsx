import Image from "next/image";
import { cn } from "@/lib/utils";

export type Mascot = "max" | "bruno";

const POSTER = { src: "/images/max_bruno_poster.jpg", width: 2576, height: 1438 };

/**
 * Recorte de la cara de cada mascota dentro del póster (`background-position` en %, como en el
 * spec 6.3). El póster se amplía a 400 % del avatar. Valores iniciales calculados para centrar la
 * cara; se afinan mirando el resultado.
 */
const CROP: Record<Mascot, { x: number; y: number }> = {
  max: { x: 16, y: 29 },
  bruno: { x: 84.5, y: 29 },
};

const META: Record<Mascot, { name: string; ring: string; label: string }> = {
  max: { name: "Max", ring: "ring-teal", label: "Max, el toro" },
  bruno: { name: "Bruno", ring: "ring-coral", label: "Bruno, el oso" },
};

const SIZE = {
  md: { box: "size-12 md:size-14", sizes: "224px" },
  lg: { box: "size-20", sizes: "320px" },
  xl: { box: "size-32 md:size-40", sizes: "640px" },
} as const;

export type AvatarSize = keyof typeof SIZE;

/**
 * Avatar circular de Max o Bruno (SPEC 6.3). No hay imágenes individuales: se recorta del póster.
 * Si luego llegan `/images/max.png` y `/images/bruno.png`, pasar `src` y tendrán prioridad.
 */
export function MascotAvatar({
  mascot,
  size = "md",
  src,
  className,
}: {
  mascot: Mascot;
  size?: AvatarSize;
  src?: string;
  className?: string;
}) {
  const { ring, label } = META[mascot];
  const { box, sizes } = SIZE[size];
  const { x, y } = CROP[mascot];
  // Póster a 400 % del ancho del avatar; su alto es 400 % × (1438 / 2576) del ancho.
  const posterHeightPct = (400 * POSTER.height) / POSTER.width; // ≈ 223,3 % del alto del avatar (cuadrado)

  return (
    <span
      role="img"
      aria-label={label}
      className={cn("relative block shrink-0 overflow-hidden rounded-full bg-navy-deep ring-2", ring, box, className)}
    >
      {src ? (
        <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
      ) : (
        <span
          aria-hidden="true"
          className="absolute"
          style={{
            width: "400%",
            height: `${posterHeightPct}%`,
            left: `${-300 * (x / 100)}%`,
            top: `${-(posterHeightPct - 100) * (y / 100)}%`,
          }}
        >
          <Image src={POSTER.src} alt="" fill sizes={sizes} />
        </span>
      )}
    </span>
  );
}
