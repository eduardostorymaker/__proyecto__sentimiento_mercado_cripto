import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BackToTop } from "@/components/layout/back-to-top";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: "Pulse Analytics — Sentimiento del mercado cripto con NLP",
  description:
    "Convertimos noticias y comentarios en español e inglés en un índice de sentimiento por criptoactivo, trazable hasta el texto que lo origina.",
};

export const viewport: Viewport = {
  themeColor: "#1F3A5F",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior="smooth": Next 16 ya no desactiva el scroll suave en las navegaciones
    // entre rutas; con este atributo, ir a /referencias salta arriba al instante y los anclas
    // dentro de la página siguen siendo suaves.
    <html lang="es" data-scroll-behavior="smooth" className={cn(inter.variable, jetbrains.variable)}>
      <body className="flex min-h-dvh flex-col">
        <Providers>
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-navy focus:shadow-lg"
          >
            Saltar al contenido
          </a>
          <SiteHeader />
          {children}
          <SiteFooter />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
