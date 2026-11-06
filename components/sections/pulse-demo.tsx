"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "motion/react";
import { PulseGauge } from "@/components/sections/pulse-gauge";
import { SpeechBubble } from "@/components/common/speech-bubble";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { mensajePulse, pulseScore, textosDeEjemplo, valoresRapidos } from "@/data/pulse-score";
import { dur, ease, prefersReducedMotion } from "@/lib/motion";
import { formatNum } from "@/lib/format";
import { arco, colorPulse, PULSE_MAX, PULSE_MIN, UMBRAL, zonaPulse } from "@/lib/pulse-color";
import { cn } from "@/lib/utils";

const NOMBRE_ZONA = { negativo: "negativo", dividido: "dividido", positivo: "positivo" } as const;

const LEYENDA = [
  { color: arco.negativo, texto: `Negativo (≤ −${UMBRAL})` },
  { color: arco.neutro, texto: `Dividido (−${UMBRAL - 1} a ${UMBRAL - 1})` },
  { color: arco.positivo, texto: `Positivo (≥ ${UMBRAL})` },
] as const;

/**
 * Demo interactiva del Pulse Score (SPEC 6.2): al mover el control, la aguja y el número reaccionan y
 * Max y Bruno comentan el resultado. Todo es ilustrativo, y así se rotula.
 *
 * - Teclado: flechas ±1, RePág/AvPág ±10, Inicio/Fin a los extremos (lo resuelve Radix).
 * - Los botones rápidos llevan el control a su valor con un tween de 0,7 s (salto directo con
 *   movimiento reducido); arrastrar el control lo interrumpe.
 * - El mensaje vive en una región `aria-live="polite"` PERSISTENTE y solo cambia al cruzar ±20.
 */
export function PulseDemo() {
  const [valor, setValor] = useState(0);
  const tween = useRef<{ stop: () => void } | null>(null);

  useEffect(() => () => tween.current?.stop(), []);

  function irA(destino: number) {
    tween.current?.stop();
    if (prefersReducedMotion()) {
      setValor(destino);
      return;
    }
    tween.current = animate(valor, destino, {
      duration: dur.reveal + 0.1,
      ease: ease.out,
      onUpdate: (v) => setValor(Math.round(v)),
      onComplete: () => setValor(destino),
    });
  }

  function alMover([nuevo]: number[]) {
    tween.current?.stop();
    setValor(nuevo);
  }

  const color = colorPulse(valor);
  const zona = zonaPulse(valor);
  const { quien, mensaje } = mensajePulse(valor);
  const textos = textosDeEjemplo(valor);
  const firmado = formatNum(valor, { signed: true });

  return (
    <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 md:p-8">
      <PulseGauge valor={valor} />

      <p
        id="pulse-valor"
        aria-hidden="true"
        style={{ color }}
        className="mt-2 text-center font-mono text-6xl font-semibold md:text-7xl"
      >
        {firmado}
      </p>

      <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-sm text-mist/85">
        <span>
          Basado en <strong className="font-semibold text-white">{formatNum(textos)}</strong> textos
        </span>
        <Badge variant="outline" className="h-5 rounded-full border-white/30 px-2.5 text-mist">
          {pulseScore.rotuloEjemplo}
        </Badge>
      </p>

      <div className="relative mt-6">
        <Slider
          min={PULSE_MIN}
          max={PULSE_MAX}
          step={1}
          value={[valor]}
          onValueChange={alMover}
          thumbLabel={pulseScore.sliderLabel}
          thumbValueText={`${firmado}, ${NOMBRE_ZONA[zona]}`}
          className="h-10"
          trackClassName="h-1.5 bg-white/20"
          rangeClassName="bg-transparent"
          // Foco: anillo blanco pleno con una separación del color del panel (#2A4467 = navy + 5 % blanco). Un anillo
          // blanco al 30 % daba ~2,2:1, bajo el 3:1 que exige WCAG a un indicador de foco.
          thumbClassName="size-6 border-2 border-white shadow-md ring-white/30 focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a4467]"
          thumbStyle={{ backgroundColor: color }}
        />
        {/* Marca del cero: el control es divergente, así que su centro es el punto de referencia. */}
        <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-white/40" />
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Valores de ejemplo">
        {valoresRapidos.map((rapido) => (
          <Button
            key={rapido.etiqueta}
            type="button"
            variant="ghost"
            aria-pressed={valor === rapido.valor}
            onClick={() => irA(rapido.valor)}
            className={cn(
              "h-10 rounded-xl px-4 text-sm text-white transition-all duration-150 hover:bg-white/20 hover:text-white active:scale-[0.97] focus-visible:ring-white",
              valor === rapido.valor ? "bg-white/25" : "bg-white/10",
            )}
          >
            {rapido.etiqueta}
          </Button>
        ))}
      </div>

      <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-mist/80">
        {LEYENDA.map((z) => (
          <li key={z.texto} className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ backgroundColor: z.color }} />
            {z.texto}
          </li>
        ))}
      </ul>

      {/* Región viva persistente: lo que se remonta al cambiar es su contenido, nunca la región. */}
      <div aria-live="polite" aria-atomic="true" className="mt-6 min-h-32 sm:min-h-24">
        <div key={quien} className="animate-in fade-in slide-in-from-bottom-1.5 duration-200 motion-reduce:animate-none">
          <SpeechBubble mascot={quien} avatarClassName="animate-in zoom-in-90 duration-200 motion-reduce:animate-none">
            {mensaje}
          </SpeechBubble>
        </div>
      </div>
    </div>
  );
}
