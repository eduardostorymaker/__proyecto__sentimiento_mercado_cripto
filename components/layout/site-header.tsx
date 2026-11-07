"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { PulseLogo, Wordmark } from "@/components/layout/pulse-logo";
import { ReadingProgress } from "@/components/layout/reading-progress";
import { useActiveSection } from "@/hooks/use-active-section";
import { activeNavId, navLinks, REFERENCIAS_HREF } from "@/data/nav";
import { dur, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SOLID_AFTER_PX = 24; // pasa de transparente a sólido
const HIDE_AFTER_PX = 400; // desde aquí se oculta al bajar
const SHOW_AFTER_UP_PX = 12; // sube al menos esto para reaparecer: un reajuste de 1 px del diseño no debe abrirlo

/**
 * Header fijo (SPEC 5.5):
 * - arriba del todo: transparente, texto blanco (sobre el hero navy), altura 72 px;
 * - tras 24 px: `bg-white/95` (el spec decía 80 %: sobre una sección navy el fondo se volvía gris azulado y los enlaces bajaban a 3,9:1) + desenfoque + borde, texto navy, altura 60 px;
 * - se oculta al bajar (después de 400 px) y reaparece al subir; nunca con el menú móvil abierto;
 * - los enlaces en línea caben desde 1280 px (a 1024 px 8 enlaces + «Referencias» saltaban de línea): por debajo, menú hamburguesa;
 * - fuera de la página principal no hay hero navy debajo, así que arranca ya sólido.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /** Lo que se lleva subido sin interrupción (se reinicia al bajar). */
  const subido = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > SOLID_AFTER_PX);
    if (y > previous) {
      subido.current = 0;
      if (y > HIDE_AFTER_PX) setHidden(true);
    } else if (y < previous) {
      subido.current += previous - y;
      // Arriba del todo no hay nada que esconder; en el resto, hace falta una subida real.
      if (subido.current >= SHOW_AFTER_UP_PX || y <= HIDE_AFTER_PX) setHidden(false);
    }
  });

  const section = useActiveSection(isHome);
  const activeId = section ? activeNavId(section) : null;

  const solid = scrolled || !isHome;
  const hrefFor = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
      transition={{ duration: dur.base, ease: ease.out }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-200 motion-reduce:duration-150",
        solid ? "border-border bg-white/95 backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 transition-[height] duration-200 motion-reduce:transition-none md:px-8",
          solid ? "h-[60px]" : "h-[72px]",
        )}
      >
        <Link
          prefetch={false}
          href={hrefFor("inicio")}
          aria-label="Pulse Analytics, ir al inicio"
          className={cn(
            "flex items-center gap-2 rounded-lg transition-colors duration-200",
            solid ? "text-navy" : "text-white",
          )}
        >
          <PulseLogo tone={solid ? "onLight" : "onDark"} />
          <Wordmark />
        </Link>

        <div className="flex items-center gap-2 xl:gap-6">
          <LayoutGroup id="site-nav">
            <NavigationMenu viewport={false} aria-label="Principal" className="hidden xl:flex">
              <NavigationMenuList className="gap-1">
                {navLinks.map((link) => {
                  const current = activeId === link.id;
                  return (
                    <NavigationMenuItem key={link.id}>
                      <Link
                        prefetch={false}
                        href={hrefFor(link.id)}
                        aria-current={current ? "location" : undefined}
                        className={cn(
                          "relative block rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                          solid
                            ? current
                              ? "text-navy"
                              : "text-navy/80 hover:text-navy"
                            : current
                              ? "text-white"
                              : "text-white/80 hover:text-white",
                        )}
                      >
                        {link.label}
                        {current && (
                          <motion.span
                            layoutId="nav-underline"
                            transition={{ type: "spring", stiffness: 420, damping: 32 }}
                            className="absolute inset-x-3 bottom-0.5 h-0.5 rounded-full bg-current"
                          />
                        )}
                      </Link>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </LayoutGroup>

          <Button
            asChild
            variant="outline"
            size="lg"
            className={cn(
              "hidden rounded-xl px-4 transition-all duration-150 active:scale-[0.97] xl:inline-flex",
              solid
                ? "border-navy/30 bg-transparent text-navy hover:bg-mist"
                : "border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white",
            )}
          >
            <Link href={REFERENCIAS_HREF}>Referencias</Link>
          </Button>

          <MobileNav
            open={menuOpen}
            onOpenChange={setMenuOpen}
            isHome={isHome}
            activeId={activeId}
            light={!solid}
          />
        </div>
      </div>

      <ReadingProgress />
    </motion.header>
  );
}
