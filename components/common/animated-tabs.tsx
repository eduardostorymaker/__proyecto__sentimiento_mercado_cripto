"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dur, ease, spring } from "@/lib/motion";

export interface TabDef {
  id: string;
  label: string;
  content: ReactNode;
}

/**
 * Pestañas de la página (SPEC 5.4): el indicador activo se desliza con `layoutId="tab-indicator"` y
 * `spring.snappy`; el contenido cambia con `AnimatePresence mode="wait"`: sale con `opacity 0, y -8`
 * (150 ms) y entra con `opacity 0 → 1, y 8 → 0` (250 ms). Se navegan con las flechas (Radix).
 *
 * Cada grupo tiene su propio `LayoutGroup`, para que los indicadores de dos grupos de pestañas
 * nunca se mezclen. Una sola `TabsContent` (con `forceMount`) hace de panel y siempre corresponde a
 * la pestaña activa; lo que se anima es su interior.
 *
 * En pantallas angostas la lista se desplaza horizontalmente.
 */
export function AnimatedTabs({
  tabs,
  label,
  className,
  value,
  onValueChange,
}: {
  tabs: readonly TabDef[];
  label: string;
  className?: string;
  /** Pestaña activa, si la controla quien lo usa (p. ej. el filtro de `/referencias`). */
  value?: string;
  onValueChange?: (id: string) => void;
}) {
  const [interno, setInterno] = useState(tabs[0].id);
  const active = value ?? interno;
  const setActive = (id: string) => {
    setInterno(id);
    onValueChange?.(id);
  };
  const group = useId();
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <Tabs value={active} onValueChange={setActive} className={className}>
      <LayoutGroup id={group}>
        {/* py-1 / -my-1: el contenedor con scroll recorta lo que sobresale, y el anillo de foco mide 3 px. */}
        <div className="-mx-5 -my-1 overflow-x-auto px-5 py-1 md:mx-0 md:px-0">
          <TabsList
            variant="line"
            aria-label={label}
            className="h-auto w-max min-w-full justify-start gap-1 rounded-none border-b border-border p-0"
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                // Radix pone `aria-controls` en TODAS las pestañas, pero aquí solo existe el panel de la activa:
                // una referencia a un id inexistente es un error de ARIA.
                {...(tab.id === active ? {} : { "aria-controls": undefined })}
                // Foco: el contorno global de 2 px con separación (cabe en el relleno del contenedor con scroll), no el borde + anillo pegados al texto de shadcn.
                className="relative h-11 flex-none rounded-md px-4 text-sm text-ink/70 after:hidden hover:text-navy focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-active:text-navy"
              >
                {tab.label}
                {tab.id === active && (
                  <motion.span
                    layoutId="tab-indicator"
                    transition={spring.snappy}
                    className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-teal-text"
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </LayoutGroup>

      {/* El panel es enfocable (Radix le pone tabindex=0): al enfocarlo con el teclado muestra el mismo contorno de 2 px que el resto. */}
      <TabsContent
        value={active}
        forceMount
        className="mt-8 rounded-md text-base focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-solid focus-visible:outline-ring"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.out } }}
            exit={{ opacity: 0, y: -8, transition: { duration: dur.fast } }}
          >
            {current.content}
          </motion.div>
        </AnimatePresence>
      </TabsContent>
    </Tabs>
  );
}
