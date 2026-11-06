import type { CasoData } from "@/lib/caso";
import { formatDiaMes, formatFechaLarga, formatHoraUTC, formatNum } from "@/lib/format";

/**
 * Sustituye marcadores `{ruta}` por valores del JSON del caso, para que NINGUNA cifra de
 * `#caso-binance` se escriba a mano (SPEC 0.3, regla 2).
 *
 *   {kpis.documentos_curados}        → 1 228
 *   {kpis.correlacion_max|2}         → 0,34          (decimales fijos tras `|`)
 *   {caso.evento_utc|fechaLarga}     → 29 de octubre de 2026
 *   {caso.evento_utc|hora}           → 20:05
 *   {kpis.dia_pico|diaMes}           → 3 de noviembre
 *
 * Un marcador sin valor LANZA un error (rompe el build), salvo `kpis.chequeos_calidad.<estado>`,
 * donde un estado ausente (p. ej. CRÍTICO) significa 0.
 */
export function fillCaso(plantilla: string, caso: CasoData): string {
  return plantilla.replace(/\{([^}|]+)(?:\|([^}]+))?\}/g, (_, ruta: string, formato?: string) => {
    let valor: unknown = caso;
    for (const clave of ruta.split(".")) {
      valor = valor !== null && typeof valor === "object" ? (valor as Record<string, unknown>)[clave] : undefined;
    }
    if (valor === undefined && ruta.startsWith("kpis.chequeos_calidad.")) valor = 0;
    if (valor === undefined) throw new Error(`fillCaso: «{${ruta}}» no existe en el JSON del caso. Plantilla: «${plantilla.slice(0, 80)}»`);

    if (formato === "fechaLarga") return formatFechaLarga(String(valor));
    if (formato === "hora") return formatHoraUTC(String(valor));
    if (formato === "diaMes") return formatDiaMes(String(valor));
    if (typeof valor === "number") return formatNum(valor, formato ? { decimals: Number(formato) } : {});
    return String(valor);
  });
}

/**
 * Los valores de calidad vienen del notebook con punto decimal (`96.7 %`, `36 (4.5 %)`): se muestran
 * con coma, como el resto del sitio. No toca otros puntos (`v1.2` no tiene dígito a ambos lados).
 */
export const decimalComa = (texto: string) => String(texto).replace(/(\d)\.(\d)/g, "$1,$2");
