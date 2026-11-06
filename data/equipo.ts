/**
 * #equipo (SPEC 7.16). Es la ÚNICA sección que puede mostrar `[Por completar]` (SPEC 10).
 * `null` = pendiente: el componente pinta el marcador visible. Al tener los datos, reemplazar `null`
 * por el texto; no hay que tocar ningún componente.
 */
export interface Integrante {
  nombre: string | null;
  codigo: string | null;
  rol: string | null;
}

export const integrantes: readonly Integrante[] = [
  { nombre: null, codigo: null, rol: null },
  { nombre: null, codigo: null, rol: null },
  { nombre: null, codigo: null, rol: null },
  { nombre: null, codigo: null, rol: null },
];

export const datosCurso = {
  universidad: null as string | null,
  curso: null as string | null,
  docente: null as string | null,
  lugarFecha: "Lima, noviembre de 2026",
};
