import { getCasoData } from "@/lib/caso";

// Estático: el caso es un evento cerrado y el JSON es un snapshot versionado (SPEC 8.1).
export const dynamic = "force-static";

/** Contrato estable para consumo externo y para el dashboard futuro. */
export async function GET() {
  return Response.json(await getCasoData(), {
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
