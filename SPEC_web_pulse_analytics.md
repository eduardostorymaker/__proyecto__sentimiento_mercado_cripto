# SPEC — Sitio web de presentación de Pulse Analytics

> **Documento para Claude Code.** Contiene todo lo necesario para construir el sitio: stack, recursos, sistema de diseño, sistema de animación, componentes, contenido final de cada sección, datos y criterios de aceptación.
> Léelo completo antes de empezar. Si algo no está especificado, sigue el criterio de la sección 0.3.
> **`PLAN_ejecucion.md` prevalece sobre este documento** en decisiones de estructura, correcciones técnicas y numeración de figuras.

---

## 0. Instrucciones para Claude Code

### 0.1 Qué construir

Una **landing de presentación de una sola página** (con anclas) y una página secundaria `/referencias`, para el proyecto académico *“Análisis de sentimiento del mercado de criptomonedas mediante NLP – caso Pulse Analytics S.A.C.”*. Todo el contenido es estático: sin base de datos y sin llamadas a APIs externas. La única ruta de API es `GET /api/caso-binance`, que sirve el resultado del notebook de comprensión de datos (ver 8.1).

Las mascotas de la marca son **Max** (toro, sentimiento positivo, color teal) y **Bruno** (oso, sentimiento negativo y prudencia ante el riesgo, color coral). Son colegas analistas, no rivales.

### 0.2 Recursos que entrega el usuario (ya incluidos en el paquete)

```
paquete/
├─ SPEC_web_pulse_analytics.md     ← este documento
├─ data/referencias.ts             ← 55 referencias IEEE tipadas (copiar a /data)
├─ data/caso-binance/eda_summary.json      ← resultados del notebook 04 (fuente de la sección #caso-binance)
├─ data/caso-binance/pipeline_config.json  ← reglas versionadas del pipeline (para el modo en vivo futuro)
└─ public/
   ├─ images/ 01-latam-volumen.png … 15-proceso-suscripcion.png   (15 figuras)
   ├─ images/caso/ fig_4_3_1_volumen.png … fig_4_4b_embudo.png    (11 figuras del notebook)
   ├─ images/max_bruno_poster.jpg   (fotograma fijo de Max y Bruno, 2576×1438)
   └─ videos/max_bruno.mp4          (bucle de Max y Bruno — LO COLOCA EL USUARIO)
```

El informe y el notebook están en `docs/` (fuera de la app y excluidos del despliegue). Si `public/videos/max_bruno.mp4` no existe al construir, el hero debe funcionar igual mostrando `max_bruno_poster.jpg`.

### 0.3 Reglas de trabajo

1. **Idioma:** todo el texto visible en **español (Perú)**, con formato numérico latino: espacio para miles (`18 084`), coma decimal (`0,78`), `US$` antes de la cifra. Implementa un helper `formatUSD()` y `formatNum()` en `lib/format.ts` (`Intl.NumberFormat` con `formatToParts`: `es-PE` devuelve `18,084.5`, por lo que hay que fijar espacio fino U+202F para miles, coma decimal y signo `−`).
2. **El contenido no se inventa.** Las cifras de `#caso-binance` se leen siempre de `eda_summary.json`, nunca se escriben a mano en los componentes. Usa exactamente las cifras y textos de este documento. Si falta algo, deja un marcador visible `[Por completar]` con estilo `Badge variant="outline"`.
3. **Todo dato vive en `/data/*.ts`** con tipos; las secciones solo lo renderizan.
4. **Componentes de servidor por defecto.** Usa `"use client"` solo donde haya interacción o animación (gráficos, tabs, demo del Pulse Score, navegación, reveal on scroll).
5. **Sin dependencias extra** más allá de las listadas en la sección 2.
6. **Accesibilidad y `prefers-reduced-motion` son obligatorios** (secciones 5.6 y 9).
7. **Al terminar:** `pnpm build` sin errores ni warnings de TypeScript/ESLint, y pasa la lista de la sección 10.

---

## 1. Contexto en una línea por sección

| Ancla | Mensaje clave |
|---|---|
| `#inicio` | Pulse Analytics convierte noticias y comentarios en español e inglés en un índice de sentimiento por criptoactivo. |
| `#contexto` | Latinoamérica es un polo cripto y Perú crece rápido; falta información en español. |
| `#sector` | PESTEL y Porter: sector atractivo pero competitivo; la defensa es la especialización. |
| `#mercado` | TAM US$ 7 600 M → SAM US$ 5,8 M → SOM US$ 82 464 (1,4 %). |
| `#empresa` | Quiénes somos, estrategia de diferenciación enfocada, FODA y organización. |
| `#productos` | 4 productos y 5 planes; el plan Individual cuesta 61 % menos que la competencia. |
| `#competencia` | Frente a Glassnode, Santiment, LunarCrush y The Tie: español y precio accesible. |
| `#pulse-score` | Demo interactiva del índice con Max y Bruno. |
| `#procesos` | De la fuente al índice cada 30 min: flujograma, DAP y arquitectura. |
| `#negocio` | Cada métrica técnica responde a un objetivo de negocio. |
| `#situacion` | Recursos, requisitos, riesgos y glosario. |
| `#costos` | MVP de US$ 18 084; ronda semilla de US$ 150 000; equilibrio en el mes 22. |
| `#nlp` | Clasificador de 3 clases es/en; macro-F1 ≥ 0,78. |
| `#plan` | CRISP-DM en 16 semanas con 6 hitos. |
| `#caso-binance` | Caso Binance: 1 445 documentos de noticias y comentarios analizados; la comunidad reacciona 4 h después de los medios. |
| `#equipo` | Integrantes y datos del curso — **por completar**. |

---

## 2. Stack y configuración

| Pieza | Versión / detalle |
|---|---|
| Framework | **Next.js** última estable, **App Router**, TypeScript estricto |
| Estilos | **Tailwind CSS v4** (configuración en CSS con `@theme`) |
| UI | **shadcn/ui** (estilo *new-york*, color base *slate*) |
| Iconos | `lucide-react` |
| Animación | `motion` (importar desde `motion/react`) |
| Gráficos | componente `chart` de shadcn (Recharts) |
| Fuentes | `next/font/google`: **Inter** (texto) y **JetBrains Mono** (cifras y fórmulas) |
| Gestor | `pnpm` |

```bash
pnpm create next-app@latest pulse-web --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*"
cd pulse-web
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card badge tabs table accordion tooltip dialog \
  navigation-menu sheet separator progress hover-card chart scroll-area alert slider carousel
pnpm add motion lucide-react
```

`next.config.ts`: `images.formats = ['image/avif','image/webp']`. Despliegue en Vercel; **no** usar `output: 'export'` (rompe la optimización de `next/image` y las cabeceras de la API).

---

## 3. Estructura de carpetas

```
app/
  layout.tsx              # <html lang="es">, fuentes, metadata, Header, Footer, MotionConfig, providers
  template.tsx            # transición de entrada entre páginas (5.5)
  page.tsx                # ensambla las secciones en orden
  referencias/page.tsx
  not-found.tsx           # 404 con Bruno (6.4)
  globals.css             # tokens (4.1) y utilidades
components/
  ui/                     # shadcn
  layout/  site-header.tsx  mobile-nav.tsx  reading-progress.tsx  back-to-top.tsx  site-footer.tsx
  common/  section.tsx  section-header.tsx  kpi.tsx  figure.tsx  cite.tsx  data-table.tsx
           reveal.tsx  stagger.tsx  count-up.tsx  mascot-avatar.tsx  speech-bubble.tsx  status-badge.tsx
  charts/  latam-bar.tsx  pestel-chart.tsx  porter-radar.tsx  mvp-donut.tsx  mrr-chart.tsx
           cashflow-chart.tsx  risk-matrix.tsx  gantt.tsx
  sections/ hero.tsx contexto.tsx sector.tsx mercado.tsx empresa.tsx productos.tsx competencia.tsx
            pulse-score.tsx procesos.tsx negocio.tsx situacion.tsx costos.tsx nlp.tsx plan.tsx
            caso-binance.tsx equipo.tsx
  caso/    caso-kpis.tsx  volumen-chart.tsx  idioma-chart.tsx  terminos-chart.tsx  distintivos-chart.tsx
           entidades-chart.tsx  aspectos-heatmap.tsx  pulse-preliminar-chart.tsx  titulares-carousel.tsx
           calidad-grid.tsx  embudo-chart.tsx  galeria-notebook.tsx
app/api/caso-binance/route.ts       # GET estático con el JSON del caso (8.1)
data/caso-binance/  eda_summary.json  pipeline_config.json
lib/caso.ts                         # tipos CasoData y getCasoData() (8.1)
data/      kpis.ts mercado.ts pestel.ts porter.ts empresa.ts productos.ts competidores.ts dap.ts
           negocio.ts situacion.ts riesgos.ts glosario.ts costos.ts nlp.ts plan.ts nav.ts referencias.ts
lib/       format.ts  motion.ts (tokens de animación)  utils.ts
public/    images/  videos/
```

---

## 4. Sistema de diseño

### 4.1 Color

Paleta de marca (la misma de las figuras del informe y de las mascotas):

| Token | Hex | Uso |
|---|---|---|
| `navy` | `#1F3A5F` | Primario: header al hacer scroll, títulos, botones primarios, fondos oscuros |
| `navy-deep` | `#16304F` | Degradado del hero y del footer |
| `teal` | `#2A9D8F` | **Max** / sentimiento positivo / oportunidades / acento secundario |
| `coral` | `#E76F51` | **Bruno** / sentimiento negativo / amenazas / riesgo |
| `gold` | `#E9C46A` | Destacados (plan “Más popular”, pin de pulso, hitos) |
| `slate` | `#6B7280` | Texto secundario, competidores en gráficos |
| `mist` | `#EEF2F7` | Fondo de secciones alternas |
| `ink` | `#0F1B2D` | Texto principal sobre blanco |

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-navy: #1F3A5F;
  --color-navy-deep: #16304F;
  --color-teal: #2A9D8F;
  --color-coral: #E76F51;
  --color-gold: #E9C46A;
  --color-mist: #EEF2F7;
  --color-ink: #0F1B2D;
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-soft: cubic-bezier(0.65, 0, 0.35, 1);
}

:root {
  --background: #FFFFFF;
  --foreground: #0F1B2D;
  --primary: #1F3A5F;
  --primary-foreground: #FFFFFF;
  --secondary: #EEF2F7;
  --secondary-foreground: #1F3A5F;
  --accent: #2A9D8F;
  --accent-foreground: #FFFFFF;
  --destructive: #E76F51;
  --muted: #EEF2F7;
  --muted-foreground: #6B7280;
  --border: #DCE3EC;
  --ring: #2A9D8F;
  --radius: 0.875rem;
  --chart-1: #1F3A5F; --chart-2: #2A9D8F; --chart-3: #E76F51; --chart-4: #E9C46A; --chart-5: #6B7280;
}
```

Reglas de color:
- **Teal = positivo / Max, coral = negativo / Bruno.** Nunca invertir. Todo estado de color va acompañado de texto o icono (accesibilidad).
- Sobre `navy` usar texto blanco o `mist`. El teal sobre blanco solo para elementos ≥ 18 px o iconos (contraste 3,3:1); para texto pequeño teal usar `#1F7A70`.
- **Solo modo claro** en esta versión (no implementar dark mode).

### 4.2 Tipografía

| Rol | Clase Tailwind |
|---|---|
| H1 (hero) | `text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]` |
| H2 (sección) | `text-3xl md:text-4xl font-semibold tracking-tight` |
| H3 | `text-xl font-semibold` |
| Eyebrow | `text-xs font-semibold uppercase tracking-[0.16em] text-teal` |
| Cuerpo | `text-base md:text-[17px] leading-relaxed text-ink/80` |
| Cifras KPI | `font-mono tabular-nums text-3xl md:text-5xl font-semibold` |
| Pie de figura / fuente | `text-xs text-muted-foreground` |

Longitud máxima de párrafo: `max-w-prose`. Nunca justificar texto en la web.

### 4.3 Espaciado, bordes y sombras

- Contenedor: `mx-auto max-w-6xl px-5 md:px-8`.
- Sección: `py-20 md:py-28`, `scroll-mt-20` (para que el header no tape el título al navegar por anclas).
- Alternancia de fondo: blanco / `bg-mist`; las secciones `#inicio`, `#pulse-score` y el footer usan fondo `navy`.
- Radios: tarjetas `rounded-2xl`, botones `rounded-xl`, badges `rounded-full`, figuras `rounded-xl`.
- Sombras: reposo `shadow-sm`; hover de tarjeta `shadow-lg shadow-navy/10`. Bordes `border border-border`.
- Grid estándar: `grid gap-6 md:grid-cols-2 lg:grid-cols-3`.

### 4.4 Iconografía

`lucide-react`, trazo 1,75, tamaño 20 (en tarjetas, 24 dentro de un círculo `size-11 rounded-xl bg-mist text-navy`). Iconos por concepto: `Languages` (español), `Search` (trazabilidad), `Wallet` (precio), `Plug` (API), `LayoutDashboard`, `BellRing`, `FileText`, `Code`, `ShieldAlert` (riesgo), `TrendingUp`/`TrendingDown`, `Gauge`, `Clock`, `Database`, `Brain`.

### 4.5 Figuras

Las 15 PNG tienen fondo blanco: mostrarlas dentro de `Card` blanca (`p-3 md:p-4`) incluso sobre fondo `mist`. Siempre con pie (`Figura n. …`) y fuente. Al hacer clic se abren en un `Dialog` a pantalla ampliada (ver 5.4).

| Archivo (`/public/images`) | Tamaño (px) | Sección | Pie / alt |
|---|---|---|---|
| `01-latam-volumen.png` | 1348×690 | #contexto (respaldo del gráfico) | Volumen de criptoactivos recibido por país en Latinoamérica, Perú resaltado |
| `02-embudo-peru.png` | 1248×573 | #contexto | Perú: del usuario digital al inversionista cripto |
| `03-pestel-balance.png` | 1337×772 | #sector (respaldo) | Balance PESTEL de oportunidades y amenazas |
| `04-porter-radar.png` | 992×976 | #sector (respaldo) | Intensidad de las cinco fuerzas de Porter |
| `05-posicionamiento.png` | 1134×858 | #competencia | Mapa de posicionamiento frente a Glassnode, Santiment, LunarCrush y The Tie |
| `06-tam-sam-som.png` | 1271×757 | #mercado | Dimensionamiento del mercado: TAM, SAM y SOM |
| `07-organigrama.png` | 1187×634 | #empresa | Organigrama de Pulse Analytics S.A.C. |
| `08-flujograma-proceso.png` | 1218×942 | #procesos | Flujograma del proceso de generación del Pulse Score |
| `09-arquitectura-mvp.png` | 1249×681 | #procesos | Arquitectura técnica del MVP |
| `10-mrr-clientes.png` | 1462×707 | #costos (respaldo) | Proyección de MRR y clientes 2027-2029 |
| `11-flujo-acumulado.png` | 1374×675 | #costos (respaldo) | Flujo de caja acumulado con mes de equilibrio |
| `12-matriz-riesgos.png` | 931×868 | #situacion (respaldo) | Matriz de probabilidad e impacto de riesgos |
| `13-crisp-dm.png` | 840×880 | #plan | Ciclo CRISP-DM aplicado al proyecto |
| `14-gantt.png` | 1725×582 | #plan (móvil) | Cronograma del proyecto de 16 semanas con hitos |
| `caso/fig_4_3_*.png`, `caso/fig_4_4*.png` (11) | ~1600–2200 px de ancho | #caso-binance (galería J) | Figuras 15 a 25 del informe: volumen, sincronía, idioma, longitud, vocabulario, términos distintivos, entidades y aspectos, medios y videos, sentimiento preliminar, calidad, embudo |
| `15-proceso-suscripcion.png` | 1218×450 | #procesos | Proceso de adquisición y conversión de clientes |
| `max_bruno_poster.jpg` | 2576×1438 | Hero, OG, avatares | Max, el toro, y Bruno, el oso, junto al medidor de sentimiento |

“Respaldo” = la sección usa un gráfico nativo; la imagen se usa solo si el gráfico no puede construirse o en el lightbox “Ver como imagen”.


---

## 5. Sistema de animación e interacción

### 5.1 Tokens (`lib/motion.ts`)

```ts
export const dur = { fast: 0.15, base: 0.25, slow: 0.45, reveal: 0.6 } as const;
export const ease = {
  out: [0.16, 1, 0.3, 1] as const,       // entradas
  inOut: [0.65, 0, 0.35, 1] as const,    // cambios de estado
};
export const spring = {
  snappy: { type: "spring", stiffness: 420, damping: 32 } as const,  // tabs, botones
  soft:   { type: "spring", stiffness: 140, damping: 20 } as const,  // aguja del medidor
};
export const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: dur.reveal, ease: ease.out } },
};
export const staggerParent = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
```

Envuelve la app en `<MotionConfig reducedMotion="user">` para que `motion` respete la preferencia del sistema.

### 5.2 Animaciones al hacer scroll

| Patrón | Dónde | Especificación |
|---|---|---|
| **Reveal** (`<Reveal>`) | Cabecera de cada sección, figuras, tablas | `whileInView="show"`, `viewport={{ once: true, amount: 0.2 }}`, `revealVariants` |
| **Stagger** (`<Stagger>`) | Grids de tarjetas (KPIs, productos, planes, FODA, objetivos, tareas NLP) | Hijos entran con 80 ms de desfase; máximo 8 hijos animados, el resto aparece sin retardo |
| **Count-up** (`<CountUp>`) | **Solo** KPIs del hero y de `#mercado` | De 0 al valor en 1,2 s con `ease.out`, una sola vez al entrar en pantalla; formato final idéntico al estático. **No** usar en `#costos` (las cifras financieras se muestran fijas para evitar lecturas intermedias) |
| **Dibujo de gráficos** | Todos los `charts/*` | Animación nativa de Recharts al montar (`isAnimationActive`, `animationDuration={900}`, `animationEasing="ease-out"`), montando el gráfico solo cuando entra en pantalla (`useInView` de motion) |
| **Línea de pulso** | Separador decorativo entre grupos de secciones | SVG de una línea de pulso que se dibuja con `pathLength` 0→1 en 1,2 s al entrar en pantalla |

No usar parallax ni scroll-jacking. Nada debe moverse más de 24 px.

### 5.3 Interacciones de componentes

| Elemento | Hover | Press (`active`) | Focus visible | Otros |
|---|---|---|---|---|
| **Botón primario** (`bg-navy`) | `bg-navy-deep`, sombra `shadow-md`, el icono flecha se desplaza `translate-x-0.5` | `scale-[0.97]` | `ring-2 ring-teal ring-offset-2` | `transition-all duration-150` |
| **Botón secundario / outline** | fondo `mist`, borde `navy/30` | `scale-[0.97]` | igual | — |
| **Botón sobre fondo navy** | `bg-white/10` → `bg-white/20` | `scale-[0.97]` | `ring-white` | — |
| **Card interactiva** (productos, planes, objetivos) | `-translate-y-1`, `shadow-lg shadow-navy/10`, borde `teal/40` | — | anillo teal | `transition duration-200` |
| **Card de plan destacada** (Professional) | igual + borde `gold` permanente | — | — | Badge “Más popular” con brillo suave (gradiente que recorre el badge cada 4 s; se desactiva con reduced motion) |
| **Enlaces de texto** | subrayado que crece de izquierda a derecha (`bg-[length:0%_1px] → 100%`, 200 ms) | — | anillo | — |
| **Cite `[n]`** | `HoverCard` con la referencia (abre a 150 ms, cierra a 100 ms) | clic → navega a `/referencias#ref-n` | anillo | — |
| **Términos del glosario** | `Tooltip` (delay 200 ms) con definición y efecto en el sentimiento | — | — | — |
| **Filas de tabla** | `bg-mist/70` | — | — | — |
| **Figura** | `scale-[1.01]` y aparece icono `Maximize2` en la esquina | clic → `Dialog` | anillo | cursor `zoom-in` |

### 5.4 Componentes con estado

- **Tabs** (PESTEL, Situación, Costos, Plan): indicador de pestaña activa que se desliza con `layoutId="tab-indicator"` y `spring.snappy`. El contenido cambia con `AnimatePresence mode="wait"`: sale `opacity 0, y -8` (150 ms) y entra `opacity 0→1, y 8→0` (250 ms). Las tabs son navegables con flechas (shadcn ya lo resuelve).
- **Accordion** (Porter, requisitos, riesgos, funciones): animación de altura de shadcn (`data-[state=open]:animate-accordion-down`), chevron rota 180° en 200 ms.
- **Dialog / lightbox de figuras:** overlay `bg-navy/70 backdrop-blur-sm` con fade de 200 ms; contenido `scale 0.96→1` + fade 250 ms `ease.out`. Cerrar con Esc, clic fuera o botón. Muestra la imagen a tamaño completo, el pie y la fuente.
- **Sheet (menú móvil):** entra desde la derecha (300 ms). Al tocar un enlace, se cierra y hace scroll a la sección.
- **Slider del Pulse Score:** ver 6.2.

### 5.5 Navegación y cambio de página

- **Scroll a anclas:** `html { scroll-behavior: smooth }` (desactivado con reduced motion). Las secciones tienen `scroll-mt-20`.
- **Header:**
  - Arriba del todo: transparente, texto blanco (sobre el hero navy).
  - Al bajar más de 24 px: `bg-white/80 backdrop-blur-md border-b`, texto `navy`, altura de 72 → 60 px. Transición 200 ms.
  - Se oculta al hacer scroll hacia abajo (después de 400 px) y reaparece al subir (`translateY(-100%)` ↔ `0`, 250 ms). Nunca se oculta si el menú móvil está abierto.
- **Scroll-spy:** el enlace de la sección visible queda activo (texto `navy`/blanco con subrayado). El subrayado se mueve entre enlaces con `layoutId="nav-underline"`. Usar `IntersectionObserver` con `rootMargin: "-45% 0px -50% 0px"`.
- **Barra de progreso de lectura:** 2 px bajo el header, gradiente `teal → coral`, ancho ligado a `scrollYProgress` con `useSpring` (stiffness 200, damping 40).
- **Volver arriba:** botón circular flotante (abajo a la derecha) que aparece después de 1 200 px con fade + `scale 0.8→1`; al hacer clic, scroll suave al inicio.
- **Transición entre páginas** (`/` ↔ `/referencias`): `app/template.tsx` con `motion.main` que entra `opacity 0→1, y 12→0` en 350 ms `ease.out`. Además, activar View Transitions si la versión de Next.js lo soporta de forma estable (`experimental.viewTransition`) con un *crossfade* de 250 ms; si no, quedarse solo con `template.tsx`. Al volver a `/` desde `/referencias#ref-n`, el botón “Volver al sitio” lleva a `/#inicio`.
- **Enlaces externos** (fuentes en `/referencias`): `target="_blank" rel="noopener noreferrer"` con icono `ExternalLink` de 14 px.

### 5.6 Movimiento reducido (obligatorio)

Con `prefers-reduced-motion: reduce`:
- El video del hero **no se reproduce**: se muestra `max_bruno_poster.jpg`.
- Sin reveal, stagger, count-up ni dibujo de líneas: el contenido aparece directamente.
- Los gráficos se renderizan sin animación (`isAnimationActive={false}`).
- Scroll de anclas instantáneo; la aguja del medidor cambia sin resorte.
- Se mantienen solo cambios de color y opacidad ≤ 150 ms.

---

## 6. Componentes clave

### 6.1 Hero con video (`sections/hero.tsx`)

```tsx
<video
  className="aspect-video w-full rounded-3xl object-cover shadow-2xl shadow-black/30 motion-reduce:hidden"
  autoPlay muted loop playsInline preload="metadata"
  poster="/images/max_bruno_poster.jpg"
  aria-label="Max, el toro, y Bruno, el oso, analizan juntos el medidor de sentimiento del mercado"
>
  <source src="/videos/max_bruno.mp4" type="video/mp4" />
</video>
<Image src="/images/max_bruno_poster.jpg" alt="Max y Bruno junto al medidor de sentimiento"
  width={2576} height={1438} priority className="hidden aspect-video w-full rounded-3xl object-cover motion-reduce:block" />
```

- Pausar el video cuando sale de pantalla (`IntersectionObserver`) y reanudarlo al volver, para ahorrar batería.
- Botón pequeño de pausa/reproducción sobre el video (esquina inferior derecha, `bg-black/40`, iconos `Pause`/`Play`, `aria-label`) — requisito WCAG 2.2.2 para contenido en movimiento de más de 5 s.
- Entrada del hero (al cargar, no al hacer scroll): eyebrow → H1 → subtítulo → botones → video, con stagger de 100 ms; el video entra con `scale 0.96→1` + fade en 700 ms.

### 6.2 Demo interactiva del Pulse Score (`sections/pulse-score.tsx`) — nueva

**Objetivo:** que el visitante entienda el índice moviendo un control y viendo reaccionar a Max y Bruno.

**Layout** (fondo `navy`, texto blanco; 2 columnas en escritorio):
- **Izquierda:** eyebrow `Pulse Score`, H2 *“Un número para el ánimo del mercado”*, la fórmula en `font-mono`:
  `Pulse Score = 100 × (Σ cᵢ·positivo − Σ cᵢ·negativo) / Σ cᵢ`
  y 3 viñetas: rango −100 a +100 · cᵢ = confianza del modelo · siempre se muestra con el número de textos que lo respaldan.
- **Derecha:** medidor SVG semicircular (arco coral → gris → teal) con aguja, valor grande en `font-mono`, `Slider` de shadcn (−100 a 100, paso 1, valor inicial 0) y una burbuja de diálogo con el avatar de la mascota.

**Comportamiento:**
- La aguja rota de −90° a +90° con `spring.soft`; el número cambia en vivo.
- Color del valor: interpolado coral (`-100`) → `#94A3B8` (0) → teal (`+100`).
- Debajo, texto “Basado en **{n}** textos” con `n = 480 + |valor| × 3` (solo ilustrativo; rotular “Ejemplo ilustrativo”).
- Mensaje de mascota (cambia con fade + `y 6→0`, 200 ms; avatar con `scale` 0.9→1):

| Rango | Mascota | Mensaje |
|---|---|---|
| `≥ 20` | **Max** (borde teal) | “¡La conversación sobre este activo está en positivo! Revisa qué titulares impulsan el índice antes de decidir.” |
| `−19 a 19` | **Max y Bruno** | “Mercado dividido: las opiniones están equilibradas. Buen momento para mirar los datos con calma.” |
| `≤ −20` | **Bruno** (borde coral) | “Ojo: el sentimiento se volvió negativo. Mira qué noticias lo explican y cuida tu riesgo.” |

- Tres botones rápidos bajo el slider: “Positivo (+65)”, “Neutral (0)”, “Negativo (−58)” que animan el slider a ese valor.
- Accesibilidad: el slider tiene `aria-label="Valor de ejemplo del Pulse Score"` y el mensaje vive en una región `aria-live="polite"`.
- Pie fijo: *“Ejemplo ilustrativo. Los indicadores de Pulse Analytics no constituyen asesoría de inversión.”*

### 6.3 Avatares de las mascotas (`common/mascot-avatar.tsx`)

No hay imágenes individuales; se recortan del póster:
- **Max:** `background-image: url(/images/max_bruno_poster.jpg)`, `background-size: 400%`, `background-position: 24% 30%`.
- **Bruno:** igual con `background-position: 78% 32%`.
- Contenedor `size-12 md:size-14 rounded-full ring-2` (`ring-teal` Max, `ring-coral` Bruno) con `role="img"` y `aria-label`.
- Ajustar los porcentajes visualmente hasta centrar cada cara. Dejar preparado `src?: string` por si luego llegan PNG individuales (`/images/max.png`, `/images/bruno.png`), que tendrían prioridad.

`<SpeechBubble mascot="max" | "bruno" | "both">` = avatar(es) + globo `rounded-2xl` con borde del color de la mascota y una pequeña cola.

**Apariciones de las mascotas** (con moderación, máximo una por sección):

| Sección | Mascota | Texto |
|---|---|---|
| `#pulse-score` | ambos (6.2) | según el valor |
| `#situacion` (pestaña Riesgos) | Bruno | “Mi trabajo es anticipar riesgos: aquí están los 10 que vigilamos y qué haremos si ocurren.” |
| `#costos` (cierre) | Max | “Un MVP de US$ 18 084 nos dice si el índice convence antes de pedir la ronda semilla.” |
| `#nlp` (cierre) | Bruno | “Si el modelo no llega a macro-F1 de 0,78, no sale a producción. Así de simple.” |
| `#caso-binance` (sentimiento) | Bruno | “Ojo: los titulares fueron muy negativos, pero esta lectura es preliminar. El modelo final se valida con anotación manual.” |
| `#caso-binance` (cierre) | Max | “Con estos datos ya sabemos qué ajustar para el modelo: más comentarios en inglés, filtro antispam y una línea base.” |
| `not-found.tsx` | Bruno | “Esta página no existe… pero el mercado sigue. Vuelve al inicio.” |

### 6.4 Otros componentes comunes

| Componente | Props | Notas |
|---|---|---|
| `Section` | `id, tone: "white" \| "mist" \| "navy", children` | Aplica fondo, padding, `scroll-mt-20`, `aria-labelledby` |
| `SectionHeader` | `eyebrow, title, subtitle?, align?` | Dentro de `<Reveal>` |
| `Kpi` | `value, label, hint?, tone?, countUp?` | Valor en mono; `hint` en tooltip |
| `Figure` | `src, alt, caption, source, n, width, height` | `next/image`, lightbox (5.4), `sizes="(min-width:1024px) 900px, 100vw"` |
| `Cite` | `id` | Busca en `refById`, muestra `[n]`, `HoverCard` con el texto, enlace a `/referencias#ref-n` |
| `DataTable` | `columns: {key,label,align?,mono?}[], rows, caption?, source?, totalRow?` | `ScrollArea` horizontal en móvil, zebra, fila total en negrita con `bg-mist` |
| `StatusBadge` | `kind: "oportunidad" \| "amenaza" \| "alto" \| "medio" \| "bajo" \| "pendiente"` | Color + texto |

---

## 7. Contenido por sección

Orden en `app/page.tsx`. Las tablas indican el contenido exacto; `[ref:id]` = `<Cite id="id" />`.

### 7.0 Header y navegación (`data/nav.ts`)

Logo: texto “**Pulse** Analytics” (“Pulse” en bold) con un pequeño icono de línea de pulso SVG en teal. Enlaces (escritorio con `NavigationMenu`; móvil con `Sheet`):

`Contexto (#contexto) · Mercado (#mercado) · Empresa (#empresa) · Pulse Score (#pulse-score) · Costos (#costos) · NLP (#nlp) · Caso Binance (#caso-binance) · Plan (#plan)` + botón `Referencias` (outline) → `/referencias`.

### 7.1 `#inicio` — Hero (fondo navy → navy-deep, `min-h-[92vh]`)

- Eyebrow: `FinTech · NLP · Lima, Perú`
- H1: **Entiende en minutos lo que el mercado dice de tu criptomoneda, en tu idioma.**
- Subtítulo: Pulse Analytics convierte noticias y comentarios en español e inglés en un índice de sentimiento por activo, trazable hasta el texto que lo origina.
- Botones: `Ver el Pulse Score` (primario, blanco con texto navy, icono `ArrowRight`) → `#pulse-score` · `Costos y viabilidad` (secundario sobre navy) → `#costos`
- Visual: video de Max y Bruno (6.1), columna derecha (`lg:col-span-7`; texto `lg:col-span-5`). En móvil, el video va debajo del texto.
- Franja de KPIs (tarjetas blancas que se superponen al borde inferior del hero con `-mb-16`, count-up):

| Valor | Etiqueta | Cita |
|---|---|---|
| US$ 28 000 M | criptoactivos recibidos por Perú (jul-2024 a jun-2025) | [ref:forbes_pe] |
| 1,28 M | peruanos con criptoactivos (3,7 % de la población) | [ref:forbes_pe] |
| 2× | crecimiento de usuarios cripto en Perú en 2025 | [ref:lemon] |
| US$ 18 084 | costo total del MVP (16 semanas) | — |

### 7.2 `#contexto` (blanco)

- Eyebrow `Contexto` · H2 **Latinoamérica es un polo cripto, y Perú crece rápido**
- Columna izquierda (viñetas):
  - Latinoamérica movió cerca de **US$ 1,5 billones** en cripto entre jul-2022 y jun-2025 [ref:chain_latam].
  - Perú recibió **más de US$ 28 000 M** en un año y superó a Chile en volumen [ref:forbes_pe].
  - En 2025 hubo **≈ 2,9 M de descargas** de apps cripto en Perú [ref:lemon].
  - El BCP lanzó un piloto de compra de bitcoin y stablecoins [ref:forbes_pe].
- Columna derecha: `<LatamBar />` (barras horizontales; Perú en coral, resto slate; tooltip con valor en miles de millones de US$). Pie: “Volumen de criptoactivos recibido, jul-2024 a jun-2025. Fuente: Chainalysis vía [ref:monitor] y [ref:forbes_pe]”.
- Debajo: `Figure` `02-embudo-peru.png` + 3 tarjetas en stagger:
  - **El problema** (`MessageSquareWarning`): la información que mueve al mercado es texto disperso, en inglés y con jerga.
  - **La evidencia** (`LineChart`): el sentimiento público tiene poder predictivo sobre criptoactivos [ref:kraaijeveld], [ref:gurgul].
  - **La brecha** (`Languages`): las plataformas de sentimiento existentes están en inglés y tienen precio institucional.

### 7.3 `#sector` (mist)

- Eyebrow `Análisis del sector` · H2 **Un sector atractivo, pero competitivo**
- **Bloque PESTEL:** arriba `<PestelChart />` (barras divergentes: amenaza negativa en coral, oportunidad positiva en teal, etiquetas `+n`/`−n`). Debajo `Tabs` con 6 pestañas; cada pestaña: dos `StatusBadge`, evidencia en 2-3 viñetas e “Implicancia” en negrita.

| Pestaña | Evidencia | Oport. | Amen. | Implicancia |
|---|---|---|---|---|
| Político | Nuevo gobierno 2026-2031 proclamado con 50,135 % en segunda vuelta [ref:jne]; regulación cripto gradual | 2 | 4 | Diversificar clientes entre fintech, consultoras y medios |
| Económico | PBI 2026 +3,4 % e inflación 3,8 % [ref:peruretail]; bitcoin en fase bajista tras superar US$ 124 000 en ago-2025 [ref:expreso], [ref:statista_btc] | 4 | 3 | Plan gratuito y precios bajos para captar usuarios |
| Social | Usuarios cripto ×2 en 2025 [ref:lemon]; ≈ 350 000 operadores activos de bitcoin [ref:gestion_350k]; jerga y desinformación | 4 | 3 | Contenido en español y filtros antispam |
| Tecnológico | Transformers multilingües [ref:conneau]; YouTube Data API con 10 000 unidades diarias gratis [ref:yt_quota] | 5 | 2 | Ventaja de costo; diferenciarse por calidad de datos en español |
| Ecológico | Centros de datos: 415 TWh en 2024 → ≈ 945 TWh en 2030 [ref:iea] | 1 | 1 | Modelos eficientes y procesamiento por lotes |
| Legal | PSAV bajo la UIF [ref:ds006], [ref:sbs]; Ley 29733 y DS 016-2024-JUS [ref:ds016]; reglamento de IA vigente desde ene-2026 [ref:ds115], [ref:cuatrecasas]; términos de YouTube [ref:yt_terms] | 3 | 3 | Cumplimiento por diseño: seudonimización y avisos de no asesoría |

- **Bloque Porter** (2 columnas): izquierda `<PorterRadar />` (radar navy con relleno 25 %, escala 0-5); derecha `Accordion`:

| Fuerza | Nivel | Argumento | Respuesta |
|---|---|---|---|
| Rivalidad entre competidores | Alta (4) | Glassnode, Santiment, LunarCrush y The Tie consolidados, todos en inglés | Diferenciación en español y precio de entrada bajo |
| Amenaza de nuevos entrantes | Alta (4) | Modelos abiertos y nube reducen barreras técnicas | Corpus etiquetado propio y marca local |
| Poder de los proveedores | Media (3) | Dependencia de Google (YouTube API, Google News) y de la nube | Conectores modulares y fuentes alternativas |
| Poder de los clientes | Alta (4) | Costo de cambio bajo y oferta gratuita abundante | Plan Free como embudo y valor medible |
| Amenaza de sustitutos | Media (3) | Lectura manual, índices de miedo y codicia, análisis técnico | Complemento trazable del texto a la señal |

- Cierre (`Alert` con icono `Lightbulb`): **La defensa es la especialización:** un corpus en español cripto que toma tiempo construir y es difícil de imitar. [ref:porter]

### 7.4 `#mercado` (blanco)

- Eyebrow `Mercado` · H2 **Un nicho concreto dentro de un mercado de US$ 7 600 millones**
- Izquierda: `Figure` `06-tam-sam-som.png`. Derecha: 3 tarjetas apiladas con borde izquierdo de color (navy / teal / coral) y count-up en el valor:

| Nivel | Valor | Explicación |
|---|---|---|
| TAM | US$ 7 600 M (2027) | Analítica de sentimiento global: US$ 5 100 M en 2024 con TCAC de 14,3 % [ref:rnm] |
| SAM | US$ 5,8 M / año | 17 500 inversionistas que pagarían (5 % de 350 000) × US$ 25/mes + 120 organizaciones B2B × US$ 4 800/año [ref:gestion_350k] |
| SOM | US$ 82 464 ARR | 128 clientes de pago al cierre de 2027 = **1,4 % del SAM** |

- Ficha sectorial compacta (lista de definiciones, 2 columnas): Sector TIC – FinTech · CIIU 6312 / 6201 · Mercado inicial Perú (Lima) · Expansión Colombia, México, Chile, Argentina · 346 fintech en Perú, 21 del vertical cripto [ref:finnovista], [ref:forbes_fintech].

### 7.5 `#empresa` (mist)

- Eyebrow `La empresa` · H2 **Pulse Analytics S.A.C.**
- Ficha (chips): Lima, Perú · Sociedad Anónima Cerrada · FinTech / TIC · SaaS B2C + B2B · 6 colaboradores · Lanzamiento comercial: enero 2027.
- 3 tarjetas: **Misión** — Convertir la conversación digital sobre criptoactivos en indicadores claros, trazables y en español, para que inversionistas y organizaciones de Latinoamérica tomen decisiones mejor informadas. · **Visión** — Ser al 2030 la plataforma de referencia en Hispanoamérica para medir el sentimiento del mercado cripto, reconocida por la calidad de sus datos y la transparencia de sus modelos. · **Valores** — Rigor, transparencia, responsabilidad (no emitimos recomendaciones de inversión), privacidad por diseño, innovación continua.
- **Estrategia: diferenciación enfocada** — 4 tarjetas con icono: Especialización lingüística (`Languages`) · Trazabilidad (`Search`) · Accesibilidad, desde US$ 19 (`Wallet`) · Integración B2B (`Plug`).
- **FODA** (grid 2×2, borde superior de 4 px: F teal, O navy, D gold, A coral):
  - F: Especialización en español y jerga cripto · Costo de datos casi nulo · Equipo multidisciplinario · Trazabilidad del indicador
  - O: Usuarios cripto ×2 en 2025 · Banca y fintech entrando al segmento · Mercado con TCAC de 14,3 % · Escasa oferta en español
  - D: Marca nueva sin clientes · Dependencia de dos fuentes en el MVP · Corpus etiquetado inicial pequeño · Capital limitado para marketing
  - A: Competidores globales que agreguen español · Cambios en cuotas o términos de APIs · Fase bajista prolongada · Regulación más exigente
  - Debajo, 4 chips de estrategias cruzadas con `Tooltip`: **FO** plan gratuito en español · **DO** alianzas con fintech y exchanges · **FA** trazabilidad y corpus como barrera · **DA** conectores intercambiables y cumplimiento documentado.
- **Organización:** `Figure` `07-organigrama.png` + `Accordion` “Funciones por puesto”: CEO (estrategia, finanzas, alianzas) · Ingeniero(a) de datos (conectores, almacenamiento, calidad) · Científico(a) de datos / NLP (etiquetado, modelado, evaluación) · Desarrollador(a) full stack (dashboard, API, pagos) · Responsable comercial y marketing (adquisición, ventas B2B) · Analista de operaciones y calidad (pruebas, documentación, cumplimiento).

### 7.6 `#productos` (blanco)

- Eyebrow `Productos` · H2 **Cuatro productos, un mismo motor de NLP**
- 4 tarjetas: **Pulse Intelligence** (`LayoutDashboard`) dashboard con el Pulse Score por activo, fuente y periodo · **Pulse Alerts** (`BellRing`) avisos cuando el índice cambia más de un umbral · **Pulse Reports** (`FileText`) informe semanal y mensual con titulares más influyentes · **Pulse API** (`Code`) índices históricos y casi en tiempo real.
- Subtítulo “Planes” + 5 tarjetas de precio (en móvil, `Carousel`); **Professional** destacada (borde gold, badge “Más popular”, `scale-[1.03]` en escritorio). Cada tarjeta: nombre, segmento, precio grande (`/mes`), lista con `Check` en teal, botón “Elegir plan” (outline; solo decorativo, `aria-disabled`, tooltip “Disponible desde enero 2027”).

| Plan | Segmento | Precio | Activos | Actualización | Histórico | Incluye |
|---|---|---|---|---|---|---|
| Free | B2C | US$ 0 | 3 | Diaria | 7 días | Dashboard básico |
| Individual | B2C | US$ 19 | 10 | Cada hora | 90 días | 5 alertas |
| Professional | B2C | US$ 49 | 30 | Cada 30 min | 1 año | Alertas ilimitadas, exportación CSV |
| Business | B2B | US$ 349 | 30 | Cada 30 min | 2 años | API 50 000 llamadas/mes, 5 usuarios, reporte semanal |
| Enterprise | B2B | Desde US$ 799 | A medida | Casi en tiempo real | Completo | API dedicada, SLA 99,5 %, modelo personalizado |

- Nota: *Los planes de entrada de Santiment y Glassnode cuestan US$ 49/mes [ref:comparedge_s], [ref:comparedge_g]; el plan Individual está 61 % por debajo.*
- Segmentos (4 chips con tooltip): Inversionista minorista · Analista o creador de contenido · Fintech y exchanges · Consultoras, medios y fondos.

### 7.7 `#competencia` (mist)

- Eyebrow `Competencia` · H2 **Donde los demás hablan inglés, nosotros hablamos tu idioma**
- `DataTable` (la fila de Pulse Analytics resaltada con `bg-teal/10` y texto en negrita):

| Competidor | Especialización | Idioma y foco | Precio de entrada | Diferencia de Pulse |
|---|---|---|---|---|
| Glassnode [ref:glassnode] | Métricas on-chain | Inglés, institucional | US$ 49/mes (anual) | Sentimiento textual |
| Santiment [ref:santiment] | Social y on-chain | Inglés, global | US$ 49/mes | Español y fuentes LatAm |
| LunarCrush [ref:lunarcrush] | Actividad social | Inglés, global | Free + planes de pago | NLP, no solo volumen |
| The Tie [ref:thetie] | Datos institucionales | Inglés | A cotización | Oferta B2C y B2B accesible |
| **Pulse Analytics** | Sentimiento NLP | Español/inglés, Hispanoamérica | **US$ 0 / US$ 19** | — |

- `Figure` `05-posicionamiento.png`.

### 7.8 `#pulse-score` (navy) — demo interactiva

Ver 6.2.

### 7.9 `#procesos` (blanco)

- Eyebrow `Cómo funciona` · H2 **De la fuente al indicador, cada 30 minutos**
- *Stepper* horizontal de 5 pasos (vertical en móvil) con icono y conector que se dibuja al entrar en pantalla: **Recolectar** (`Download`) → **Limpiar** (`Sparkles`) → **Clasificar** (`Brain`) → **Agregar** (`Gauge`) → **Publicar** (`Send`).
- `Tabs`: **Flujograma** (`08-flujograma-proceso.png`) · **Arquitectura** (`09-arquitectura-mvp.png`) · **DAP** · **Adquisición de clientes** (`15-proceso-suscripcion.png`).
- Pestaña DAP: 5 KPIs mini (○ 6 operaciones · ⇨ 3 transportes · □ 3 inspecciones · D 1 demora · ▽ 2 almacenamientos), un KPI grande **80 s por lote de 500 textos (0,16 s/texto)** y una barra `Progress` “Clasificación = 31 % del tiempo”. Botón “Ver detalle” abre un `Dialog` con la tabla completa (`data/dap.ts`):

| N.° | Actividad | Tipo | s |
|---|---|---|---|
| 1 | Disparo del ciclo por el programador | ○ | 1 |
| 2 | Solicitud al feed de Google News RSS | ⇨ | 4 |
| 3 | Solicitudes a YouTube Data API v3 | ⇨ | 12 |
| 4 | Espera por límites de cuota | D | 10 |
| 5 | Almacenamiento en capa cruda | ▽ | 2 |
| 6 | Validación de esquema | □ | 3 |
| 7 | Limpieza y normalización | ○ | 6 |
| 8 | Detección de idioma | ○ | 4 |
| 9 | Control de duplicados | □ | 3 |
| 10 | Identificación del activo | ○ | 2 |
| 11 | Clasificación de sentimiento | ○ | 25 |
| 12 | Control de confianza (< 0,60 a revisión) | □ | 1 |
| 13 | Almacenamiento en base curada | ▽ | 3 |
| 14 | Cálculo del Pulse Score | ○ | 2 |
| 15 | Publicación en dashboard, API y alertas | ⇨ | 2 |
| | **Total** | | **80** |

- KPIs de procesos (tabla compacta): macro-F1 ≥ 0,78 · ciclo ≤ 120 s · duplicados residuales ≤ 2 % · completitud ≥ 98 % · frescura ≤ 30 min · disponibilidad ≥ 99,5 % · conversión Free→pago ≥ 10 % · churn ≤ 4 %.

### 7.10 `#negocio` (mist)

- Eyebrow `Comprensión del negocio` · H2 **Cada métrica técnica responde a un objetivo de negocio**
- 5 tarjetas OB1–OB5 (número grande en teal, objetivo, meta en `Badge`):
  - OB1 Reducir ≥ 90 % el tiempo de monitoreo — *lote de 500 textos en < 2 min (vs ≈ 8,3 h manual)*
  - OB2 Indicador confiable para BTC, ETH y SOL — *macro-F1 ≥ 0,78*
  - OB3 Atender en español e inglés — *brecha ≤ 5 p. p.*
  - OB4 Costo de datos nulo — *US$ 0 con Google News RSS y YouTube Data API v3*
  - OB5 Validar la propuesta de valor — *≥ 70 % de 20 usuarios piloto*
- **Puente negocio → NLP** (3 columnas con flecha animada entre ellas; al pasar el mouse sobre una fila se resaltan las 3 celdas):

| Objetivo de negocio | Objetivo NLP | Métrica de control |
|---|---|---|
| OB1 Tiempo | ON3 Modelo eficiente | ≤ 50 ms/texto; ciclo ≤ 2 min |
| OB2 Confiabilidad | ON1, ON3, ON4 Corpus y clasificador validados | Macro-F1 ≥ 0,78; precisión de activo ≥ 0,90 |
| OB3 Bilingüe | ON4 Evaluación por idioma | Brecha ≤ 0,05 |
| OB4 Costo | ON1 Corpus de fuentes gratuitas | US$ 0 |
| OB5 Valor | ON5 Utilidad del Pulse Score | Evidencia exploratoria y encuesta |

### 7.11 `#situacion` (blanco)

- Eyebrow `Evaluación de la situación` · H2 **Lo que tenemos, lo que necesitamos y lo que puede fallar**
- `Tabs`:
  1. **Recursos** — 4 tarjetas: Humanos (6 integrantes, 50 % técnicos / 25 % gestión, 16 semanas) · Datos (Google News RSS, YouTube Data API v3, precios de referencia) · Software (Python, scikit-learn, Transformers, Label Studio, PostgreSQL, Streamlit, FastAPI — código abierto) · Nube (GPU para ajuste fino, VM y base de datos; pago por uso).
  2. **Requisitos** — `Accordion` “Funcionales (RF01–RF09)” y “No funcionales (RNF01–RNF07)” (texto en `data/situacion.ts`, ver informe Tablas 21-22) + 2 columnas: **Supuestos** (fuentes estables, ≥ 10 000 textos, titulares con señal suficiente, kappa ≥ 0,70) y **Restricciones** (solo 2 fuentes, sin cuerpo de la noticia, cuota de YouTube, 16 semanas y US$ 18 084, sin predicción de precios ni recomendaciones).
  3. **Riesgos** — `SpeechBubble` de Bruno (6.3) + `<RiskMatrix />` (matriz 5×5 interactiva: celdas verde/ámbar/coral; cada riesgo es un círculo navy con su ID; al pasar el mouse se resalta su fila en el `Accordion` de al lado y viceversa) + `Accordion` R1–R10 con nivel (P×I ≥ 16 alto coral, 9–15 medio ámbar, ≤ 8 bajo verde), respuesta preventiva y contingencia (`data/riesgos.ts`).
  4. **Glosario** — chips con `Tooltip`: Bullish (positivo) · Bearish (negativo) · FUD (negativo) · FOMO (positivo/especulativo) · HODL (positivo) · To the moon (positivo, a menudo irónico) · Rug pull (negativo) · Ballena (neutral) · Halving (neutral/positivo) · Stablecoin (neutral) · ETF spot (positivo) · Liquidación (negativo) · Macro-F1 · Kappa de Cohen · Pulse Score · PSAV. Color del chip según el efecto (teal / coral / slate).

### 7.12 `#costos` (mist) — sección clave

- Eyebrow `Costos y viabilidad` · H2 **Un MVP de US$ 18 084 para validar un negocio que necesita US$ 150 000**
- 4 KPIs (sin count-up):

| Valor | Etiqueta | Tono |
|---|---|---|
| US$ 18 084 | Costo del MVP (16 semanas) | navy |
| US$ 0 | Costo de datos | teal |
| Mes 22 | Primer mes de equilibrio operativo (oct-2028); flujo positivo sostenido desde el mes 27 | teal |
| US$ 139 458 | Necesidad máxima de capital → ronda semilla de US$ 150 000 | coral |

- `Tabs` (5):
  1. **Presupuesto del MVP:** `<MvpDonut />` (donut con el total al centro; sectores navy, teal, slate, gold, coral) + `DataTable`: Equipo técnico (3 roles, 50 %, 4 meses) US$ 9 600 · Equipo de gestión y negocio (3 roles, 25 %, 4 meses) US$ 5 400 · Cómputo en la nube US$ 520 · Datos (Google News RSS y YouTube Data API v3) US$ 0 · Etiquetado manual (doble anotación de 3 000 textos) US$ 800 · Herramientas, dominio y despliegue US$ 120 · **Subtotal US$ 16 440** · Contingencia (10 %) US$ 1 644 · **Total US$ 18 084**.
  2. **Beneficios:** 3 tarjetas: **> 99 % de ahorro de tiempo** (500 textos en 80 s vs ≈ 8,3 h) · **≈ 80 h/mes liberadas** por cliente B2B con el plan Business (US$ 349) · **US$ 23 084 de inversión inicial** (MVP + constitución US$ 1 500 + equipos US$ 3 500).
  3. **Proyección 2027-2029:** `<MrrChart />` (barras de MRR mensual coloreadas por año: 2027 teal, 2028 navy, 2029 `#2F5D8A`; línea de clientes en coral en eje derecho; etiquetas en los meses 12, 24 y 36) + `DataTable` de flujo de caja:

| Concepto (US$) | 2027 | 2028 | 2029 |
|---|---:|---:|---:|
| Ingresos por suscripciones | 44 668 | 158 867 | 354 154 |
| Planilla | −96 000 | −132 000 | −186 000 |
| Infraestructura cloud | −7 200 | −12 000 | −20 400 |
| Marketing y ventas | −12 000 | −24 000 | −36 000 |
| Datos y licencias | −2 400 | −7 200 | −12 000 |
| Gastos administrativos y legales | −6 000 | −7 200 | −8 400 |
| Comisiones de pasarela (4,5 %) | −2 010 | −7 149 | −15 937 |
| **Flujo neto** | **−80 942** | **−30 682** | **75 417** |
| Clientes de pago al cierre | 128 | 366 | 782 |
| ARR al cierre | 82 464 | 224 208 | 463 416 |

  Valores negativos en coral; positivos del flujo neto en teal.
  4. **Evaluación económica:** `<CashflowChart />` (área acumulada desde el mes 0, relleno coral y eje Y con tope en 0, porque el acumulado nunca lo supera; punto marcado en el mínimo “US$ −139 458”; línea vertical en el mes 22 “Primer mes de equilibrio”, línea en el mes 27 “Flujo positivo sostenido” y etiqueta final “−US$ 59 291 al mes 36”). Nota bajo el gráfico: *La inversión no se recupera dentro del horizonte de tres años. Con el flujo del mes 36 (US$ 14 980) se recuperaría en unos cuatro meses, hacia abril de 2030, si los costos se mantuvieran en el nivel de 2029.* + 6 tarjetas: Primer mes de equilibrio operativo **mes 22** (sostenido desde el mes 27; enero y febrero de 2029 retroceden por el salto anual de costos) · Necesidad máx. de capital **US$ 139 458** · VAN 3 años (25 %) **−US$ 68 861** (solo captura la etapa de inversión) · VAN con valor terminal (g = 5 %) **US$ 133 860** · TIR con valor terminal **83 %** (> 25 %) · ARR 2029 **US$ 463 416** (782 clientes).
  5. **Sensibilidad:** 3 tarjetas lado a lado (borde coral / navy / teal), la base marcada como “Escenario base”:

| Escenario | Ingresos 2029 | Flujo 2029 | VAN 3 años | VAN con valor terminal |
|---|---:|---:|---:|---:|
| Pesimista (−30 % clientes) | 248 112 | −25 853 | −160 693 | −160 693 |
| Base | 354 154 | 75 417 | −68 861 | 133 860 |
| Optimista (+30 % clientes) | 459 795 | 176 304 | 22 861 | 496 766 |

- Pie de sección: *Cifras antes de impuestos. Supuestos: precios de los planes, rampa lineal mensual de clientes, tasa de descuento de 25 %, crecimiento perpetuo de 5 % para el valor terminal.*
- Cierre con `SpeechBubble` de Max (6.3).

### 7.13 `#nlp` (blanco)

- Eyebrow `Objetivos de NLP` · H2 **Un clasificador de sentimiento de 3 clases, en español e inglés**
- Objetivo general (párrafo): construir y evaluar un clasificador positivo/negativo/neutral para titulares de Google News RSS y títulos, descripciones y comentarios de YouTube, con macro-F1 ≥ 0,78 en un conjunto de prueba reservado.
- 5 tarjetas de tareas: **Sentimiento** (principal; clasificación multiclase a nivel de documento) · **Idioma** (fastText [ref:joulin]) · **Duplicados** (MinHash [ref:broder]) · **Activo** (reglas y alias BTC/ETH/SOL) · **Agregación** (Pulse Score y detección de cambios).
- **Escalera de modelos** (4 escalones de izquierda a derecha, cada uno más alto, con flecha): VADER, léxico [ref:hutto] → TF-IDF + LR/SVM, modelo base [ref:pedregosa] → XLM-T preentrenado [ref:barbieri] → **XLM-RoBERTa ajustado**, objetivo [ref:conneau]. El último escalón en teal con badge “Objetivo”.
- Métricas (grid de 8 `Kpi` pequeños con la meta): Macro-F1 ≥ 0,78 · Accuracy ≥ 0,80 · F1 por clase ≥ 0,70 · Brecha es/en ≤ 0,05 · Mejora vs. base ≥ +5 p. p. · Kappa ≥ 0,70 [ref:cohen] · Latencia ≤ 50 ms/texto · Precisión de activo ≥ 0,90.
- **Estrategia de evaluación:** barra segmentada animada (se llena de izquierda a derecha al entrar en pantalla) 70 % entrenamiento (navy) / 15 % validación (teal) / 15 % prueba (coral), con la etiqueta “Partición temporal”, y 3 viñetas: casi duplicados agrupados antes de dividir · el conjunto de prueba se usa una sola vez · intervalos por bootstrap y prueba de McNemar.
- Cierre: `SpeechBubble` de Bruno (6.3).

### 7.14 `#plan` (mist)

- Eyebrow `Plan del proyecto` · H2 **CRISP-DM en 16 semanas** [ref:chapman], [ref:wirth]
- `Tabs`:
  1. **Metodología:** `Figure` `13-crisp-dm.png` + texto: fases iterativas; la evaluación puede devolver a la preparación de datos o al modelado.
  2. **Cronograma:** `<Gantt />` (componente propio en HTML/CSS grid de 16 columnas; barras que crecen de izquierda a derecha con stagger al entrar en pantalla; tooltip con fase, semanas y entregable; rombos de hitos en coral). Alternativa en móvil: `Figure` `14-gantt.png`.
  3. **Hitos:** línea de tiempo vertical H1–H6 (el punto se rellena al entrar en pantalla).
  4. **RACI:** tabla con celdas de color (R teal, A navy, C gold, I slate claro) y leyenda.

Datos de fases, hitos y RACI en `data/plan.ts` (sección 8).

### 7.15 `#caso-binance` (blanco → navy en el cierre) — Comprensión de los datos

**Fuente única de datos:** `data/caso-binance/eda_summary.json` (ver 8.1). Ubicación en la página: **después de `#nlp` y antes de `#plan`**. Las cifras citadas abajo son las del JSON actual y sirven para revisar; los componentes deben leerlas del JSON.

**A. Cabecera y contexto**
- Eyebrow `Comprensión de los datos · CRISP-DM fase 2` · H2 **Caso Binance: lo que dijeron los medios y la comunidad**
- Párrafo: *El 29 de octubre de 2026, desde las 20:05 UTC, atacantes vaciaron hot wallets de Binance por cerca de US$ 6 300 millones, el mayor robo de criptoactivos registrado [ref:stingrai], [ref:techinsider]. Usamos el caso para probar si YouTube y Google News sirven para medir el sentimiento por entidad.*
- **Línea de tiempo horizontal** (5 hitos, se dibuja con `pathLength` al entrar en pantalla; vertical en móvil):

| Fecha (UTC) | Hito | Color |
|---|---|---|
| 29-oct 20:05 | Inicio del ataque | coral |
| 29-oct 20:49 | Primer titular en el corpus (+0,7 h) | navy |
| 30-oct 00:20 | Primer comentario en el corpus (+4,3 h) | coral claro |
| 01-nov | Titulares sobre la reanudación de retiros | teal |
| 03-nov | Pico de conversación (271 documentos) | gold |

Las horas de los hitos 2 y 3 se leen de `kpis.primer_documento_utc` (exactas) y los “+h”, de `kpis.reaccion_h`. No sumar `reaccion_h` al evento: está redondeado y daría 20:47 y 00:23.

**B. KPIs** (6 `Kpi`, grid 3×2 en escritorio y 2×3 en móvil; count-up permitido aquí):

| Valor (`kpis.*`) | Etiqueta |
|---|---|
| `documentos_iniciales` → `documentos_curados` (1 445 → 1 228) | documentos recolectados → curados |
| `titulares_google_news` (621) | titulares de `medios` (247) medios |
| `comentarios_youtube` (607) | comentarios de `videos` (18) videos |
| `+desfase_noticias_comentarios_h` h (+4 h) | la comunidad reacciona después de los medios (r = `correlacion_max`) |
| `pct_espanol` % (65,1 %) | del corpus curado en español |
| `chequeos_calidad.OK` / `chequeos_total` (39/52) | chequeos de calidad aprobados, 0 críticos |

**C. ¿Cuándo se habló?** — `<VolumenChart />`
- Barras apiladas por bloques de 6 h (`volumen_6h`: `google_news` en navy, `youtube` en coral), sobre eje X numérico de tiempo para que el evento (20:05) caiga dentro de su bloque, con `ReferenceLine` en el evento (coral, discontinua, etiqueta “Hackeo”) y `ReferenceArea` sombreada `coral/8` para la crisis aguda (`caso.evento_utc` → `caso.fin_durante_utc`, etiqueta “Crisis aguda (72 h)”).
- Toggle (`Tabs` pequeñas) “Cada 6 horas / Por día” que cambia a `volumen_diario` con animación de transición de barras.
- Tooltip: fecha y hora local de Lima + documentos por fuente.
- Texto bajo el gráfico: *Las noticias aparecen 0,7 h después del ataque y los comentarios 4,3 h después; el mayor volumen fue el 3 de noviembre.*
- Nota de base, generada desde `volumen_base`: vista diaria *“{documentos_ventana} documentos de la ventana del caso, antes del curado”*; vista de 6 h *“{documentos_6h} documentos con hora exacta; quedan fuera {sin_hora_exacta} titulares fechados solo por día y {anteriores_a_zoom} documentos anteriores”*. El bloque del 29-oct a las 06:00 es un artículo general previo al ataque: indicarlo en el tooltip de ese bloque.

**D. ¿En qué idioma y con qué longitud?** (2 columnas)
- `<IdiomaChart />`: barras apiladas 100 % por fuente desde `idioma` (español navy, inglés teal). Nota: *Google News está equilibrado; en YouTube domina el español, por lo que necesitamos más comentarios en inglés.*
- 2 `Kpi`: “13 palabras” (`kpis.mediana_palabras_corpus`, igual a la Tabla 37) y “`cobertura_max_length_128_pct` % cabe en 128 subtokens” con hint *longitud máxima elegida para el modelo*.

**E. ¿De qué se habló?** — `Tabs` “Medios” / “Comunidad” / “Durante vs. después” / “Entidades y temas”
1. **Medios** y **Comunidad**: `<TerminosChart />` (barras horizontales de `top_terminos.google_news` / `top_terminos.youtube`, color de la fuente). Si aparece el término `spcx90k`, mostrarlo en gris con `Tooltip` “Spam detectado (se excluye en el curado)”.
2. **Durante vs. después**: `<DistintivosChart />` barras divergentes desde `terminos_distintivos` (durante a la derecha en coral, después a la izquierda en teal). Leyenda: *Durante: magnitud del robo y promesa de cobertura. Después: cómo ocurrió (entrevista de trabajo falsa) y salida de fondos.*
3. **Entidades y temas**: izquierda `<EntidadesChart />` (barras agrupadas por fuente desde `entidades_pct`); derecha `<AspectosHeatmap />` (grid CSS: filas = aspectos, columnas = fuente·periodo de `aspectos_pct`; fondo `navy` con opacidad = valor/100; valor en texto; al pasar el mouse la celda se resalta con `ring-2 ring-teal`). Nota: *Binance aparece en el 97 % de los titulares, pero solo en el 11 % de los comentarios.*

**F. ¿Con qué tono?** — Sentimiento preliminar
- `Badge` gold “Preliminar · léxico” junto al título. `Alert`: *Lectura exploratoria con un léxico bilingüe; no es el modelo final. Los titulares que informan un hecho negativo salen negativos aunque sean descriptivos.*
- `<PulsePreliminarChart />`: líneas por fuente desde `pulse_score_diario_preliminar` (eje Y −100 a +100, `ReferenceLine` en 0, puntos con tamaño proporcional a `n`, tooltip con score y n). Banda de fondo coral bajo 0 y teal sobre 0 al 6 % de opacidad.
- Barras apiladas 100 % por fuente desde `sentimiento_lexico_pct` (negativo coral, neutral gris, positivo teal).
- `SpeechBubble` de Bruno (6.3).

**G. Titulares del caso** — `<TitularesCarousel />`
- Tarjetas desde `titulares_ejemplo` (8): medio en negrita, fecha (si la hora es 07:00 mostrar solo la fecha), chip de idioma (ES/EN), `StatusBadge` del sentimiento léxico, titular en 2-3 líneas y enlace “Leer en Google News” (`ExternalLink`, nueva pestaña). Agrupadas con encabezado “Crisis aguda” / “Después”.
- **No mostrar comentarios de usuarios** (consideración ética: solo agregados).

**H. ¿Los datos son confiables?** — Calidad
- `<CalidadGrid />`: 10 tarjetas, una por dimensión (Exactitud, Completitud, Consistencia, Integridad, Razonabilidad, Oportunidad, Unicidad, Validez, Sesgo, Calidad lingüística). Cada tarjeta: nombre, conteo “n OK / m a revisar” y color según el peor estado (OK teal, REVISAR gold, CRÍTICO coral). Clic → `Dialog` con la tabla de chequeos de esa dimensión (`calidad` filtrado: chequeo, fuente, valor, umbral, estado).
- `<EmbudoChart />`: barras horizontales decrecientes desde `embudo_curado` (1 445 → 1 338 → 1 303 → 1 277 → 1 238 → 1 228), la primera navy, las intermedias teal y la última coral; animación de ancho con stagger de 80 ms.
- 3 hallazgos destacados en `Alert` gold: *Spam: `spam_youtube_pct` % de los comentarios* · *3 videos truncados en 100 comentarios* · *Solo `documentos_antes` documentos antes del ataque: falta línea base*.

**I. Conclusiones** (fondo navy, texto blanco, 5 tarjetas numeradas en stagger + `SpeechBubble` de Max):
1. Los datos sirven para el caso: gratuitos, rápidos y de alta calidad estructural.
2. Es una primera iteración: 1 228 documentos curados frente a la meta de 10 000.
3. Falta una línea base previa al evento.
4. El ruido (spam, duplicados, textos cortos) está identificado y se filtra con reglas.
5. La etiqueta de sentimiento se construirá con 604 textos anotados por dos personas (kappa ≥ 0,70).

**J. Figuras del notebook** — botón “Ver las 11 figuras del análisis” que abre un `Dialog` grande con `Carousel` de `public/images/caso/*.png` (pie = nombre de la figura del informe; flechas y teclado). Sirve como evidencia para el jurado.

### 7.16 `#equipo` (blanco)

- H2 **Equipo del proyecto**. Grid de 4 tarjetas con avatar de iniciales, nombre, código y rol: `[Por completar]`.
- Datos del curso: Universidad `[Por completar]` · Curso `[Por completar]` · Docente `[Por completar]` · Lima, noviembre de 2026.

### 7.17 Footer (navy-deep)

Logo + lema *“Escuchamos lo que el mercado dice.”* · enlaces a secciones · enlace a `/referencias` · © 2026 Pulse Analytics S.A.C. · aviso permanente: *Los indicadores de Pulse Analytics son información complementaria y no constituyen asesoría de inversión.* · Línea de pulso decorativa en teal → coral en el borde superior.

### 7.18 `/referencias`

- Header y footer iguales. H1 **Referencias** + texto “Formato IEEE, en orden de primera cita del informe.”
- Filtro por grupo (`Tabs`: Todas · Mercado · Regulación · Competencia · NLP y metodología · Caso Binance). Al llegar con hash se fuerza “Todas”.
- Lista `<ol>` con `id="ref-{n}"`, número en `font-mono`, texto, y enlace externo si existe `url`. Al llegar con hash, la referencia destino se resalta 1,5 s con fondo `gold/30` que se desvanece.
- Botón “← Volver al sitio”.

### 7.19 `not-found.tsx`

Fondo navy, avatar grande de Bruno, texto “Esta página no existe… pero el mercado sigue.” y botón “Volver al inicio”.

---

## 8. Datos (`/data`)

`data/referencias.ts` viene en el paquete. El resto se crea con estos valores (más los textos de la sección 7):

```ts
// data/mercado.ts
export const latam = [
  { pais: "Brasil", valor: 318.8 }, { pais: "Argentina", valor: 93.9 },
  { pais: "México", valor: 71.2 }, { pais: "Colombia", valor: 44.2 },
  { pais: "Perú", valor: 28.0, destacado: true },
]; // miles de millones de US$, jul-2024 a jun-2025

// data/pestel.ts
export const pestel = [
  { factor: "Político", oportunidad: 2, amenaza: 4 },
  { factor: "Económico", oportunidad: 4, amenaza: 3 },
  { factor: "Social", oportunidad: 4, amenaza: 3 },
  { factor: "Tecnológico", oportunidad: 5, amenaza: 2 },
  { factor: "Ecológico", oportunidad: 1, amenaza: 1 },
  { factor: "Legal", oportunidad: 3, amenaza: 3 },
];

// data/porter.ts
export const porter = [
  { fuerza: "Rivalidad", nivel: 4 }, { fuerza: "Nuevos entrantes", nivel: 4 },
  { fuerza: "Proveedores", nivel: 3 }, { fuerza: "Clientes", nivel: 4 },
  { fuerza: "Sustitutos", nivel: 3 },
];

// data/costos.ts
export const mvp = [
  { concepto: "Equipo técnico", costo: 9600, color: "var(--chart-1)" },
  { concepto: "Gestión y negocio", costo: 5400, color: "var(--chart-2)" },
  { concepto: "Cómputo en la nube", costo: 520, color: "var(--chart-5)" },
  { concepto: "Datos", costo: 0, color: "var(--chart-5)" },
  { concepto: "Etiquetado manual", costo: 800, color: "var(--chart-4)" },
  { concepto: "Herramientas y despliegue", costo: 120, color: "var(--chart-5)" },
  { concepto: "Contingencia (10 %)", costo: 1644, color: "var(--chart-3)" },
]; // total 18 084 (excluir "Datos" del donut por ser 0, pero mantenerlo en la tabla)

export const mrr = [250,879,1508,2557,2807,3436,4065,4315,5364,5993,6622,6872,
  7732,8543,9853,10683,11543,13202,14013,14873,15703,16214,17824,18684,
  19900,22264,23480,25495,27060,29026,30242,31807,33822,35038,37402,38618]; // mes 1 = ene-2027
export const clientes = [10,21,32,43,53,64,75,85,96,107,118,128,
  148,167,187,207,227,248,267,287,307,326,346,366,
  400,436,470,505,540,574,608,643,678,712,748,782];
export const flujoAcumulado = [-23084,-33145,-42606,-51466,-59324,-66943,-73962,-80380,
  -86559,-91736,-96313,-100289,-104026,-111842,-118883,-124674,-129672,-133848,-136440,
  -138258,-139254,-139458,-139173,-137351,-134708,-137604,-138241,-137718,-135270,
  -131328,-125508,-118527,-110051,-99651,-88090,-74271,-59291]; // índice 0 = inversión inicial

export const flujoAnual = {
  anios: [2027, 2028, 2029],
  ingresos: [44668, 158867, 354154],
  costos: {
    "Planilla": [96000, 132000, 186000],
    "Infraestructura cloud": [7200, 12000, 20400],
    "Marketing y ventas": [12000, 24000, 36000],
    "Datos y licencias": [2400, 7200, 12000],
    "Gastos administrativos y legales": [6000, 7200, 8400],
    "Comisiones de pasarela (4,5 %)": [2010, 7149, 15937],
  },
  flujoNeto: [-80942, -30682, 75417],
  clientesCierre: [128, 366, 782],
  arrCierre: [82464, 224208, 463416],
};
export const indicadores = { equilibrioMes: 22, flujoSostenidoMes: 27, acumuladoMes36: -59291, flujoMes36: 14980, capitalMax: 139458, van3: -68861, vanTV: 133860,
  tirTV: 0.83, inversionInicial: 23084, rondaSemilla: 150000 };
export const sensibilidad = [
  { escenario: "Pesimista (−30 % clientes)", ingresos2029: 248112, flujo2029: -25853, van3: -160693, vanTV: -160693 },
  { escenario: "Base", ingresos2029: 354154, flujo2029: 75417, van3: -68861, vanTV: 133860 },
  { escenario: "Optimista (+30 % clientes)", ingresos2029: 459795, flujo2029: 176304, van3: 22861, vanTV: 496766 },
];

// data/riesgos.ts  (p = probabilidad, i = impacto, 1-5)
export const riesgos = [
  { id: "R1", riesgo: "Cambio de cuota, formato o términos en YouTube API o Google News RSS", p: 4, i: 4,
    prevencion: "Caché local, consultas optimizadas y monitoreo de errores", contingencia: "Activar fuentes alternativas autorizadas" },
  { id: "R2", riesgo: "Desbalance de clases (predominio de neutrales)", p: 3, i: 4,
    prevencion: "Muestreo estratificado para etiquetado", contingencia: "Ponderación de clases y evaluación con macro-F1" },
  { id: "R3", riesgo: "Spam, bots y comentarios promocionales en YouTube", p: 4, i: 3,
    prevencion: "Filtros por patrones, enlaces y repetición", contingencia: "Clase de descarte y revisión manual" },
  { id: "R4", riesgo: "Sarcasmo, ironía y jerga cripto", p: 4, i: 3,
    prevencion: "Glosario de dominio en la guía de etiquetado", contingencia: "Análisis de errores y ampliación dirigida del corpus" },
  { id: "R5", riesgo: "Desempeño desigual entre español e inglés", p: 3, i: 3,
    prevencion: "Corpus balanceado por idioma", contingencia: "Modelo multilingüe o modelos separados" },
  { id: "R6", riesgo: "Retrasos en el cronograma", p: 2, i: 4,
    prevencion: "Hitos semanales y priorización del MVP", contingencia: "Reducir alcance a dos activos" },
  { id: "R7", riesgo: "Noticias sindicadas que inflan el volumen", p: 3, i: 3,
    prevencion: "Deduplicación por similitud de títulos", contingencia: "Ponderar por medio único" },
  { id: "R8", riesgo: "Tratamiento indebido de datos personales", p: 2, i: 5,
    prevencion: "Seudonimización y minimización de datos", contingencia: "Protocolo de borrado y revisión legal" },
  { id: "R9", riesgo: "Sobrecosto de cómputo en la nube", p: 3, i: 2,
    prevencion: "Alertas de presupuesto y apagado automático", contingencia: "Modelos más ligeros o destilados" },
  { id: "R10", riesgo: "Uso del índice como recomendación de inversión", p: 2, i: 4,
    prevencion: "Avisos de no asesoría y documentación de límites", contingencia: "Revisión de comunicación y términos de uso" },
];

// data/plan.ts
export const fases = [
  { fase: "Comprensión del negocio", ini: 1, fin: 2, entregable: "Informe, secciones 1 a 3" },
  { fase: "Comprensión de los datos", ini: 3, fin: 4, entregable: "Informe de datos y diccionario" },
  { fase: "Preparación y etiquetado", ini: 5, fin: 7, entregable: "Corpus etiquetado (≥ 3 000 textos)" },
  { fase: "Modelado", ini: 8, fin: 11, entregable: "Modelos y registro de experimentos" },
  { fase: "Evaluación", ini: 12, fin: 13, entregable: "Informe de evaluación" },
  { fase: "Despliegue", ini: 14, fin: 16, entregable: "Prototipo y documentación" },
];
export const hitos = [
  { id: "H1", semana: 2, nombre: "Alcance aprobado", criterio: "Objetivos, criterios de éxito y riesgos validados" },
  { id: "H2", semana: 4, nombre: "Datos iniciales", criterio: "≥ 10 000 registros e informe de calidad" },
  { id: "H3", semana: 7, nombre: "Corpus etiquetado", criterio: "≥ 3 000 textos con kappa ≥ 0,70" },
  { id: "H4", semana: 11, nombre: "Modelos entrenados", criterio: "Modelo base y Transformer con resultados en validación" },
  { id: "H5", semana: 13, nombre: "Modelo seleccionado", criterio: "Cumple los criterios NLP o tiene plan de mejora" },
  { id: "H6", semana: 16, nombre: "Prototipo entregado", criterio: "Pipeline programado, dashboard y manual" },
];
export const raciRoles = ["CEO", "Ing. datos", "Cient. datos", "Full stack", "Comercial", "Calidad"];
export const raci = [
  { fase: "Comprensión del negocio", v: ["A", "C", "R", "I", "R", "C"] },
  { fase: "Comprensión de los datos", v: ["I", "R", "A", "I", "I", "C"] },
  { fase: "Preparación de los datos", v: ["I", "R", "A", "I", "C", "R"] },
  { fase: "Modelado", v: ["I", "C", "A/R", "I", "I", "C"] },
  { fase: "Evaluación", v: ["A", "C", "R", "I", "C", "R"] },
  { fase: "Despliegue", v: ["A", "R", "C", "R", "C", "R"] },
];
```

**Requisitos (`data/situacion.ts`):**
RF01 Recolectar periódicamente noticias y videos/comentarios para consultas por activo · RF02 Almacenar cada registro crudo con fuente, fechas e ID · RF03 Normalizar texto conservando el original · RF04 Detectar idioma y descartar otros · RF05 Eliminar duplicados y casi duplicados · RF06 Asignar el activo con diccionario de alias · RF07 Clasificar sentimiento con confianza · RF08 Calcular el Pulse Score por activo, fuente y ventana · RF09 Mostrar índice, volumen y textos de origen en el dashboard.
RNF01 Rendimiento: 500 textos en ≤ 2 min en CPU · RNF02 Escalabilidad: nuevas fuentes por conector · RNF03 Trazabilidad: todo indicador reconstruible · RNF04 Privacidad: seudonimizar autores · RNF05 Cumplimiento: respetar cuotas y políticas [ref:yt_policies] · RNF06 Reproducibilidad: semillas y versionado · RNF07 Seguridad: secretos en gestor y acceso autenticado.

---

### 8.1 Datos del caso Binance: arquitectura

**Decisión: la web consume el resultado del notebook (snapshot estático versionado) a través de una ruta de API de Next.js, y no recalcula el análisis en Next.js.**

| Criterio | Snapshot del notebook (elegido) | Generar en Next.js |
|---|---|---|
| Coincidencia con el informe | Exacta: mismas cifras que la sección 4 | Puede diferir (nuevos comentarios, otra hora de ejecución) |
| Técnicas usadas | Todas (langdetect, log-odds, casi duplicados, correlación cruzada) | Habría que reescribirlas en TypeScript |
| Costo y cuotas | Ninguno en tiempo de visita | Cada recolección consume cuota de YouTube y requiere `YOUTUBE_API_KEY` en el servidor |
| Velocidad | JSON de ~25 KB, servido estático | Llamadas externas y procesamiento en cada regeneración |
| Privacidad | Solo agregados y titulares | Manipula comentarios crudos en el servidor |
| Naturaleza del caso | Evento cerrado: los datos no deberían cambiar | Útil solo para monitoreo continuo |

**Implementación requerida**

```ts
// lib/caso.ts
import raw from "@/data/caso-binance/eda_summary.json";

export type Fuente = "google_news" | "youtube";
export type EstadoCalidad = "OK" | "REVISAR" | "CRÍTICO";
export interface CasoData {
  generado: string;
  caso: { nombre: string; evento_utc: string; segunda_ola_utc: string; inicio_ventana_utc: string; fin_durante_utc: string };
  kpis: {
    documentos_iniciales: number; documentos_curados: number; comentarios_youtube: number; titulares_google_news: number;
    videos: number; medios: number; pct_espanol: number; dia_pico: string; desfase_noticias_comentarios_h: number;
    chequeos_calidad: Partial<Record<EstadoCalidad, number>>; chequeos_total: number; pico_documentos: number;
    documentos_antes: number; reaccion_h: Record<Fuente, number>; primer_documento_utc: Record<Fuente, string>;
    mediana_palabras_corpus: number; correlacion_max: number;
    cobertura_max_length_128_pct: number; spam_youtube_pct: number;
  };
  volumen_diario: { t: string; google_news: number; youtube: number }[];
  volumen_6h: { t: string; google_news: number; youtube: number }[];
  volumen_base: { documentos_ventana: number; documentos_6h: number; sin_hora_exacta: number; anteriores_a_zoom: number };
  idioma: Record<Fuente, { es: number; en: number }>;
  longitud_mediana_palabras: Record<Fuente, number>;
  top_terminos: Record<Fuente, Record<string, number>>;
  terminos_distintivos: { durante: Record<string, number>; despues: Record<string, number> };
  entidades_pct: Record<string, Record<string, number>>;   // fuente → entidad → %
  aspectos_pct: Record<string, Record<string, number>>;    // "Google · durante" → aspecto → %
  top_medios: Record<string, number>;
  sentimiento_lexico_pct: Record<Fuente, { negativo: number; neutral: number; positivo: number }>;
  pulse_score_diario_preliminar: { fecha: string; fuente: Fuente; score: number; n: number }[];
  titulares_ejemplo: { periodo: "durante" | "despues"; fecha: string; medio: string; idioma: "es" | "en"; titular: string; url: string; sentimiento_lexico: "positivo" | "negativo" | "neutral" }[];
  calidad: { "Dimensión": string; Chequeo: string; Fuente: string; Valor: string; Umbral: string; Estado: EstadoCalidad }[];
  embudo_curado: { Paso: string; "Documentos restantes": number }[];
  nota: string;
}

export const caso = raw as CasoData;
export async function getCasoData(): Promise<CasoData> {
  return caso;   // Punto único de acceso: en el futuro puede leer de KV/DB sin cambiar los componentes.
}
```

```ts
// app/api/caso-binance/route.ts
import { getCasoData } from "@/lib/caso";
export const dynamic = "force-static";
export async function GET() {
  return Response.json(await getCasoData(), { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
```

- La sección `#caso-binance` es un **componente de servidor** que llama a `getCasoData()` directamente (no hace `fetch` a su propia API) y pasa a cada gráfico cliente solo el fragmento que necesita.
- `/api/caso-binance` existe para consumo externo, para el dashboard futuro y como contrato estable.
- **Actualizar los datos** = volver a ejecutar `docs/notebook/04_comprension_datos.ipynb` y copiar `docs/notebook/outputs/web/eda_summary.json` a `data/caso-binance/`. Mostrar en el pie de la sección: “Datos generados el {fecha de `generado`} · Notebook 04 de comprensión de datos”.
- Validar el JSON al compilar: si falta una clave obligatoria, `pnpm build` debe fallar con un mensaje claro (usar un `assert` simple en `lib/caso.ts`; no agregar dependencias).

**Modo en vivo (fuera de alcance de esta versión, solo dejar preparado):** cuando exista el modelo de la fase 4, un job programado (Vercel Cron cada 30 min) ejecutará `app/api/pulse/cron/route.ts` aplicando las reglas de `pipeline_config.json` (consultas, limpieza, idioma, spam, entidades) y guardará agregados en un almacenamiento KV; `getCasoData()` (o un `getPulseLive()`) leerá de allí. Nunca se recolecta ni se procesa en el momento de la visita.

## 9. Calidad transversal

**Accesibilidad (WCAG 2.2 AA)**
- `<html lang="es">`, un solo `h1`, jerarquía de encabezados sin saltos, landmarks (`header`, `nav`, `main`, `footer`), enlace “Saltar al contenido” visible al enfocarlo.
- Todo interactivo alcanzable con teclado y con foco visible (anillo teal de 2 px).
- `alt` descriptivo en todas las imágenes (tabla de la sección 4.5).
- Gráficos: `role="img"` + `aria-label` con la conclusión del gráfico, y la tabla de datos accesible (en `Dialog` “Ver datos” o `sr-only`).
- Video: sin audio, con control de pausa y póster; no reproducir con movimiento reducido.
- Contraste mínimo 4,5:1 para texto normal.

**Rendimiento**
- Todo estático (SSG). Lighthouse en móvil ≥ 90 en Performance, Accessibility, Best Practices y SEO.
- `next/image` en todas las figuras; `priority` solo en el póster del hero.
- Gráficos y lightbox cargados con `next/dynamic` (`ssr: false`) dentro de componentes cliente, montados al entrar en pantalla.
- Video con `preload="metadata"` y pausa fuera de pantalla. Si `max_bruno.mp4` pesa más de 6 MB, avisar al usuario para comprimirlo (H.264, CRF 26-28, 1080p, sin audio).

**SEO y metadata (`app/layout.tsx`)**
- `title`: “Pulse Analytics — Sentimiento del mercado cripto con NLP”
- `description`: “Convertimos noticias y comentarios en español e inglés en un índice de sentimiento por criptoactivo, trazable hasta el texto que lo origina.”
- OpenGraph y Twitter con `max_bruno_poster.jpg` (1200×630 recortado). `themeColor: #1F3A5F`. Favicon: icono de línea de pulso en SVG.

**Responsive** (probar en 360, 768, 1024 y 1440 px)
- Tablas con scroll horizontal y primera columna fija.
- Planes en `Carousel` en < 768 px.
- Gantt reemplazado por la imagen en < 768 px.
- Hero: texto arriba y video abajo en móvil.

---

## 10. Criterios de aceptación (Definition of Done)

- [ ] `pnpm build` y `pnpm lint` sin errores ni warnings.
- [ ] Las 16 secciones y `/referencias` existen con el contenido de la sección 7; los marcadores `[Por completar]` solo aparecen en `#equipo`.
- [ ] `#caso-binance` lee todas sus cifras de `eda_summary.json` mediante `getCasoData()`; `GET /api/caso-binance` responde 200 con el mismo JSON.
- [ ] Ningún comentario de usuario aparece en la página; solo agregados y titulares con enlace.
- [ ] Todas las cifras coinciden con este documento (revisar especialmente `#costos`).
- [ ] Cada `<Cite id>` resuelve a un número de `referencias.ts` y enlaza a `/referencias#ref-n`; no hay ids inexistentes (validar en tiempo de compilación con un tipo derivado de las claves).
- [ ] Las 15 figuras del informe y las 11 del notebook se ven, tienen pie y abren en lightbox.
- [ ] El video del hero se reproduce en bucle, silenciado, con botón de pausa, y se pausa fuera de pantalla; con movimiento reducido se ve el póster.
- [ ] La demo del Pulse Score funciona con mouse, toque y teclado, y el mensaje de Max/Bruno cambia según el rango.
- [ ] Header transparente → sólido al hacer scroll, se oculta al bajar y aparece al subir; scroll-spy y barra de progreso funcionan.
- [ ] Todas las animaciones de la sección 5 están implementadas y se desactivan con `prefers-reduced-motion`.
- [ ] Navegación completa con teclado; foco siempre visible.
- [ ] Lighthouse móvil ≥ 90 en las 4 categorías.
- [ ] Sin errores en consola.

---

## 11. Orden de construcción

1. Proyecto, shadcn, fuentes, tokens de color y `lib/format.ts`, `lib/motion.ts`.
2. Layout: header (con estados de scroll), menú móvil, barra de progreso, volver arriba, footer, `template.tsx`.
3. Componentes comunes: `Section`, `SectionHeader`, `Reveal`, `Stagger`, `CountUp`, `Kpi`, `Figure` + lightbox, `Cite`, `DataTable`, `MascotAvatar`, `SpeechBubble`, `StatusBadge`.
4. Archivos de `/data`.
5. Hero con video y KPIs.
6. **`#costos`** (la más densa) y sus gráficos.
7. **`#pulse-score`** (demo interactiva).
8. **`#caso-binance`**: `lib/caso.ts`, ruta de API y sus gráficos.
9. Resto de secciones en el orden del sitio.
10. `/referencias` y `not-found`.
11. Pasada de accesibilidad, movimiento reducido, responsive y Lighthouse; corregir y verificar la lista de la sección 10.
