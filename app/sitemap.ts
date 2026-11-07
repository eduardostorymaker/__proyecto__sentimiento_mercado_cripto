import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Las dos rutas del sitio. Las secciones son anclas de `/`, no páginas. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/referencias`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
