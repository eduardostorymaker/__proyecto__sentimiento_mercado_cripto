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
  { nombre: "Sayumi Canchari", codigo: "26207048", rol: "Cientifico de Datos" },
  { nombre: "Lesli Diaz", codigo: "26207058", rol: "Gerente Comercial" },
  { nombre: "Eduardo Espinoza", codigo: "26207059", rol: "Ingeniero Devops/Mlops" },
  { nombre: "Rodeny Llantoy", codigo: "26207068", rol: "Ingeniero de Datos" },
  { nombre: "Elliot Garamendi", codigo: "26207060", rol: "Desarrollador Fullstack" },
];

export const datosCurso = {
  universidad: "Universidad Nacional Mayor de San Marcos" as string | null,
  curso: "Procesamiento de Lenguaje Natural" as string | null,
  docente: "Saúl Ascue" as string | null,
  lugarFecha: "Lima, noviembre de 2026",
};
