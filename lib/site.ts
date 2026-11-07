import type { Metadata } from "next";

/**
 * URL pública del sitio. Orden: `NEXT_PUBLIC_SITE_URL` (la define el usuario en Vercel cuando el DNS
 * de `pulse.analytics.umihogar.com` esté listo) → el dominio de producción que Vercel expone en el
 * build (`*.vercel.app`, para que las vistas previas ya salgan con la URL correcta) → localhost.
 */
function resolverUrl(): string {
  const explicita = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicita) return explicita.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolverUrl();
export const SITE_NAME = "Pulse Analytics";
export const SITE_TITLE = "Pulse Analytics — Sentimiento del mercado cripto con NLP";
export const SITE_DESCRIPTION =
  "Convertimos noticias y comentarios en español e inglés en un índice de sentimiento por criptoactivo, trazable hasta el texto que lo origina.";

/** Imagen para redes (póster de Max y Bruno recortado a 1200×630). */
export const OG_IMAGE = {
  url: "/images/og.jpg",
  width: 1200,
  height: 630,
  alt: "Max, el toro, y Bruno, el oso, junto al medidor de sentimiento de Pulse Analytics",
} as const;

/**
 * Metadatos de una página: título, descripción, canónica y Open Graph/Twitter con la imagen común.
 * `openGraph` y `twitter` de una página REEMPLAZAN a los del layout (no se fusionan), por eso se arman
 * completos aquí.
 */
export function metaPagina({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const completo = `${title} — ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "es_PE", siteName: SITE_NAME, title: completo, description, url: path, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: completo, description, images: [OG_IMAGE.url] },
  };
}
