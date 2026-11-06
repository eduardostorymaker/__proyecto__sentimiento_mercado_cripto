import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referencias — Pulse Analytics",
};

/** MARCADOR TEMPORAL (fase 2): la página real, con filtro y resaltado de `#ref-n`, es la fase 9. */
export default function ReferenciasPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-28 pb-24 md:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-navy md:text-6xl">Referencias</h1>
      <p className="mt-4 max-w-prose text-ink/80">Formato IEEE, en orden de primera cita del informe.</p>
      <div className="mt-10 space-y-6" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="h-16 rounded-xl bg-mist" />
        ))}
      </div>
    </div>
  );
}
