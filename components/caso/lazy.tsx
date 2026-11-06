"use client";

import dynamic from "next/dynamic";
import { InViewMount, Reserva } from "@/components/charts/lazy";
import type { PuntoPulse } from "@/components/caso/pulse-preliminar-chart";
import type { FilaVolumen } from "@/components/caso/volumen-chart";

const VolumenDinamico = dynamic(() => import("@/components/caso/volumen-chart"), { ssr: false, loading: () => <Reserva height={470} /> });
const PulseDinamico = dynamic(() => import("@/components/caso/pulse-preliminar-chart"), { ssr: false, loading: () => <Reserva height={350} /> });

type PropsVolumen = {
  seis: readonly FilaVolumen[];
  dia: readonly FilaVolumen[];
  eventoUtc: string;
  finDuranteUtc: string;
  conclusion: string;
  notaSeis: string;
  notaDia: string;
  bloquePrevio: string;
  resumen: string;
};

/** Recharts se monta solo al acercarse a la pantalla y con el alto reservado (sin saltos de diseño). */
export function VolumenChartLazy(props: PropsVolumen) {
  return (
    <InViewMount height={470}>
      <VolumenDinamico {...props} />
    </InViewMount>
  );
}

export function PulsePreliminarChartLazy({ puntos }: { puntos: readonly PuntoPulse[] }) {
  return (
    <InViewMount height={350}>
      <PulseDinamico puntos={puntos} />
    </InViewMount>
  );
}
