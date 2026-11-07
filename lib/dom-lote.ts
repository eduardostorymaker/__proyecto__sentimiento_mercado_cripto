/**
 * Lecturas y escrituras del DOM en lote, para no forzar un relayout por componente.
 *
 * La página monta ~150 componentes que, al hidratar, leen `getBoundingClientRect()` y luego escriben
 * estilos (revelados, barras, líneas). Hecho en cada `useEffect`, cada lectura obliga al navegador a
 * recalcular el diseño que la escritura del componente anterior acaba de invalidar: ~1 s de hilo
 * principal en un móvil. Aquí todas las lecturas van juntas (un solo recálculo) y luego todas las
 * escrituras. `observar` comparte un único `IntersectionObserver` entre todos los componentes.
 */

interface Tarea {
  leer: () => unknown;
  escribir: (dato: never) => void;
  cancelada: boolean;
}

let cola: Tarea[] = [];
let programado = false;

function vaciar() {
  programado = false;
  const lote = cola;
  cola = [];
  // Todas las lecturas primero: un solo cálculo de diseño sirve para todas.
  const datos = lote.map((t) => (t.cancelada ? undefined : t.leer()));
  lote.forEach((t, i) => {
    if (!t.cancelada) (t.escribir as (d: unknown) => void)(datos[i]);
  });
}

/** Lee y escribe en el siguiente cuadro, agrupado con el resto. Devuelve la función que lo cancela. */
export function enLote<T>(leer: () => T, escribir: (dato: T) => void): () => void {
  const tarea: Tarea = { leer, escribir: escribir as (d: never) => void, cancelada: false };
  cola.push(tarea);
  if (!programado) {
    programado = true;
    requestAnimationFrame(vaciar);
  }
  return () => {
    tarea.cancelada = true;
  };
}

interface Grupo {
  io: IntersectionObserver;
  avisos: WeakMap<Element, Set<(entrada: IntersectionObserverEntry) => void>>;
}
const grupos = new Map<string, Grupo>();

/**
 * Observa `el` con un `IntersectionObserver` compartido por todos los que piden el mismo umbral. El
 * aviso recibe cada entrada en orden (puede haber varias de un mismo elemento en un lote). Un mismo
 * elemento admite varios avisos (p. ej. dos hooks sobre la misma raíz). Devuelve la función que deja
 * de observarlo.
 */
export function observar(el: Element, umbral: number | number[], aviso: (entrada: IntersectionObserverEntry) => void): () => void {
  const clave = JSON.stringify(umbral);
  let grupo = grupos.get(clave);
  if (!grupo) {
    const avisos: Grupo["avisos"] = new WeakMap();
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) for (const f of [...(avisos.get(e.target) ?? [])]) f(e);
      },
      { threshold: umbral },
    );
    grupo = { io, avisos };
    grupos.set(clave, grupo);
  }
  const { io, avisos } = grupo;
  let set = avisos.get(el);
  if (!set) {
    set = new Set();
    avisos.set(el, set);
  }
  set.add(aviso);
  io.observe(el);
  return () => {
    set.delete(aviso);
    if (set.size === 0) {
      io.unobserve(el);
      avisos.delete(el);
    }
  };
}
