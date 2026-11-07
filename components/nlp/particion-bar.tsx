"use client";

import { useRef } from "react";
import { BarraSegmentada } from "@/components/caso/barra-segmentada";
import { categorico } from "@/lib/chart-colors";
import { useDrawBars } from "@/hooks/use-draw-bars";
import { particion } from "@/data/nlp";

const COLOR = { navy: categorico.azul, teal: categorico.teal, coral: categorico.coral } as const;

/**
 * Partición temporal 70/15/15 (SPEC 7.13): barra segmentada que se llena de izquierda a derecha al
 * entrar en pantalla. Usa los azul, teal y coral de los gráficos (validados como categóricos) en
 * lugar del navy del spec, que junto al teal se separa menos para daltonismo. Cada tramo lleva su
 * porcentaje escrito dentro (todos miden ≥ 15 %) y la leyenda da el nombre.
 */
export function ParticionBar() {
  const ref = useRef<HTMLDivElement>(null);
  useDrawBars(ref);
  const partes = particion.tramos.map((t) => ({ clave: t.nombre, nombre: t.nombre, valor: t.porcentaje, color: COLOR[t.color] }));

  return (
    <div ref={ref}>
      <div data-barra className="origin-left">
        <BarraSegmentada fila={particion.etiqueta} partes={partes} unidad={null} />
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/80">
        {particion.tramos.map((t) => (
          <li key={t.nombre} className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-[3px]" style={{ backgroundColor: COLOR[t.color] }} />
            {t.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}
