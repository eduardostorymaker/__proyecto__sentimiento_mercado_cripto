"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMotionOk } from "@/hooks/use-motion-ok";
import { anguloPulse, arco, PULSE_MAX, PULSE_MIN, UMBRAL } from "@/lib/pulse-color";
import { spring } from "@/lib/motion";

// Geometría del medidor (viewBox 300 × 178): semicírculo de radio 116 centrado en (150, 150).
const CX = 150;
const CY = 150;
const R = 116;
const ANCHO_ARCO = 16;
const LARGO_AGUJA = 94;
/** Hueco entre zonas, en unidades de valor: la separación de 2 px de la habilidad de gráficos. */
const HUECO = 1.4;

/** Punto del semicírculo para un valor: −100 a la izquierda, 0 arriba, +100 a la derecha. */
function punto(valor: number, radio: number): [number, number] {
  const angulo = Math.PI - ((valor - PULSE_MIN) / (PULSE_MAX - PULSE_MIN)) * Math.PI;
  return [CX + radio * Math.cos(angulo), CY - radio * Math.sin(angulo)];
}

function trazo(desde: number, hasta: number): string {
  const [x1, y1] = punto(desde, R);
  const [x2, y2] = punto(hasta, R);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

/** Las tres zonas coinciden con los umbrales de los mensajes de las mascotas (±20). */
const ZONAS = [
  { id: "negativo", d: trazo(PULSE_MIN, -UMBRAL - HUECO), color: arco.negativo },
  { id: "dividido", d: trazo(-UMBRAL + HUECO, UMBRAL - HUECO), color: arco.neutro },
  { id: "positivo", d: trazo(UMBRAL + HUECO, PULSE_MAX), color: arco.positivo },
] as const;

const MARCAS = [
  { valor: PULSE_MIN, texto: "−100", radio: R, dy: 24 },
  { valor: -UMBRAL, texto: "−20", radio: R + 20, dy: 4 },
  { valor: 0, texto: "0", radio: R + 20, dy: 4 },
  { valor: UMBRAL, texto: "+20", radio: R + 20, dy: 4 },
  { valor: PULSE_MAX, texto: "+100", radio: R, dy: 24 },
] as const;

/**
 * Medidor semicircular del Pulse Score: arco coral → gris → teal con aguja. La aguja gira de −90° a
 * +90° con `spring.soft` y, con movimiento reducido, cambia sin resorte (SPEC 5.6).
 * Es decorativo para lectores de pantalla (`aria-hidden`): el valor lo da el control deslizante y el
 * número.
 */
export function PulseGauge({ valor }: { valor: number }) {
  const animar = useMotionOk();
  const objetivo = useMotionValue(0);
  const conResorte = useSpring(objetivo, spring.soft);
  const rotate = animar ? conResorte : objetivo;

  useEffect(() => {
    objetivo.set(anguloPulse(valor));
  }, [valor, objetivo]);

  return (
    <svg viewBox="0 0 300 178" aria-hidden="true" className="mx-auto block w-full max-w-md overflow-visible">
      {ZONAS.map((z) => (
        <path key={z.id} data-zona={z.id} d={z.d} fill="none" stroke={z.color} strokeWidth={ANCHO_ARCO} strokeLinecap="butt" />
      ))}

      {MARCAS.map((m) => {
        const [x, y] = punto(m.valor, m.radio);
        return (
          <text key={m.texto} x={x} y={y + m.dy} textAnchor="middle" className="fill-mist/75 text-[11px]">
            {m.texto}
          </text>
        );
      })}

      {/* Aguja: su caja es la propia línea, así que el origen al pie (originY: 1) es el centro del arco. */}
      <motion.g data-aguja style={{ rotate, originX: 0.5, originY: 1 }}>
        <line x1={CX} y1={CY} x2={CX} y2={CY - LARGO_AGUJA} stroke="#ffffff" strokeWidth={3} strokeLinecap="round" />
      </motion.g>
      <circle cx={CX} cy={CY} r={8} fill="#ffffff" stroke="#1f3a5f" strokeWidth={3} />
    </svg>
  );
}
