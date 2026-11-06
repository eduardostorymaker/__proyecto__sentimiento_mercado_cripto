import { cn } from "@/lib/utils";

/**
 * Logo de Pulse Analytics: burbuja de diálogo con una línea de pulso que pasa de teal (positivo)
 * a coral (negativo). Redibujado en SVG a partir de `logo.jpg` (924 KB, fondo blanco).
 * `tone="onDark"` usa borde blanco y las variantes claras de teal y coral (contraste sobre navy).
 */
export function PulseLogo({
  tone = "onLight",
  className,
}: {
  tone?: "onLight" | "onDark";
  className?: string;
}) {
  const dark = tone === "onDark";
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      <path
        d="M11.27 34.73 7.5 43 17.26 38.69A18 18 0 1 0 11.27 34.73Z"
        className={dark ? "stroke-white" : "stroke-navy"}
      />
      <path d="M11.5 22H18.5L22.5 11.5 26.7 22" className={dark ? "stroke-teal-soft" : "stroke-teal"} />
      <path d="M26.7 22 30.5 33 34 22H38.5" className={dark ? "stroke-coral-soft" : "stroke-coral"} />
    </svg>
  );
}

/** Texto de marca: «Pulse» en negrita y «Analytics» en peso normal. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("text-lg tracking-tight", className)}>
      <span className="font-bold">Pulse</span> <span className="font-normal">Analytics</span>
    </span>
  );
}
