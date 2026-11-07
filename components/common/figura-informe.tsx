import { Figure } from "@/components/common/figure";
import { RichText } from "@/components/common/rich-text";
import { figuras, FUENTE_PROPIA, type FiguraId } from "@/data/figuras";

/**
 * Figura del informe por id (`data/figuras.ts`): una sola fuente para número, título, alt y
 * fuente, con lightbox. Componente de servidor: arma la fuente con `<Cite>` y se la pasa a `Figure`.
 */
export function FiguraInforme({ id, className, sizes }: { id: FiguraId; className?: string; sizes?: string }) {
  const f = figuras[id];
  return (
    <Figure
      src={`/images/${f.archivo}`}
      alt={f.alt}
      caption={f.titulo}
      n={f.n}
      width={f.width}
      height={f.height}
      source={<RichText>{"fuente" in f ? f.fuente : FUENTE_PROPIA}</RichText>}
      className={className}
      sizes={sizes}
    />
  );
}
