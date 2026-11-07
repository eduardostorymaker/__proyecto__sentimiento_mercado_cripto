"use client";

import { useRef } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PulseLogo, Wordmark } from "@/components/layout/pulse-logo";
import { navLinks, REFERENCIAS_HREF, type NavId } from "@/data/nav";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isHome: boolean;
  activeId: NavId | null;
  /** Header en estado transparente (texto blanco sobre el hero navy). */
  light: boolean;
}

/** Menú móvil: `Sheet` que entra desde la derecha (SPEC 5.4). */
export function MobileNav({ open, onOpenChange, isHome, activeId, light }: MobileNavProps) {
  const pendingId = useRef<string | null>(null);

  // En la página principal el scroll se hace al cerrar el panel: mientras está abierto, Radix
  // bloquea el scroll del cuerpo y un salto a un ancla se perdería.
  function handleSelect(event: React.MouseEvent, id: string) {
    if (isHome) {
      event.preventDefault();
      pendingId.current = id;
    }
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Abrir menú"
          className={cn(
            "xl:hidden",
            light ? "text-white hover:bg-white/10 hover:text-white" : "text-navy",
          )}
        >
          <Menu className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="data-[side=right]:w-[min(20rem,85vw)] gap-0 p-0"
        onCloseAutoFocus={(event) => {
          const id = pendingId.current;
          if (!id) return;
          pendingId.current = null;
          event.preventDefault();
          // Sin `behavior`, respeta el CSS: suave, o instantáneo con movimiento reducido.
          document.getElementById(id)?.scrollIntoView();
          history.replaceState(null, "", `#${id}`);
        }}
      >
        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
        <SheetDescription className="sr-only">Enlaces a las secciones del sitio</SheetDescription>

        <div className="flex h-[72px] items-center gap-2 border-b border-border px-5 text-navy">
          <PulseLogo />
          <Wordmark />
        </div>

        <nav aria-label="Secciones" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const current = activeId === link.id;
              return (
                <li key={link.id}>
                  <Link
                    prefetch={false}
                    href={isHome ? `#${link.id}` : `/#${link.id}`}
                    onClick={(event) => handleSelect(event, link.id)}
                    aria-current={current ? "location" : undefined}
                    className={cn(
                      "flex min-h-11 items-center rounded-xl px-3 text-base font-medium transition-colors duration-150",
                      current ? "bg-mist text-navy" : "text-ink/80 hover:bg-mist hover:text-navy",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-5">
          <Button asChild variant="outline" size="lg" className="w-full rounded-xl">
            <Link href={REFERENCIAS_HREF} onClick={() => onOpenChange(false)}>
              Referencias
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
