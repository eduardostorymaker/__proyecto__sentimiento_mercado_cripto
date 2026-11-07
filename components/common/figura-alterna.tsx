import { RichText } from "@/components/common/rich-text";
import { VerComoImagen } from "@/components/common/ver-como-imagen";
import { figuras, FUENTE_PROPIA, type FiguraId } from "@/data/figuras";

/** `<VerComoImagen>` de una figura del informe, por id (`data/figuras.ts`). */
export function VerFigura({ id, className }: { id: FiguraId; className?: string }) {
  const f = figuras[id];
  return (
    <VerComoImagen
      src={`/images/${f.archivo}`}
      alt={f.alt}
      title={`Figura ${f.n}. ${f.titulo}`}
      width={f.width}
      height={f.height}
      source={<RichText>{"fuente" in f ? f.fuente : FUENTE_PROPIA}</RichText>}
      className={className}
    />
  );
}
