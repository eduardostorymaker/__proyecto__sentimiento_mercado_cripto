# Plan de ejecución: sitio Pulse Analytics

Este plan **prevalece sobre `SPEC_web_pulse_analytics.md`** en estructura, correcciones técnicas y numeración de figuras. Las decisiones están cerradas: no hay que volver a discutirlas. El contenido y las cifras siguen en el spec, que ya incorpora los cambios de datos.

## 1. Estado de partida

**Ya hecho (no repetir):**
- Carpetas reacomodadas: informe y notebook en `docs/`.
- Notebook corregido y reejecutado. `data/caso-binance/*.json` y `public/images/caso/fig_4_3_1_volumen.png` ya están actualizados.
- Informe actualizado en `docs/informe/`. El original se conserva como `.original.docx`.
- Spec actualizado con los mismos cambios.

**Texto del informe para consultar:** `docs/informe/informe_texto.txt` (extraído del .docx).

| Contenido que falta en el spec | Dónde está |
|---|---|
| Definiciones del glosario | Tabla 24 |
| Tooltips de los segmentos | Tabla 6 (perfil y necesidad) |
| Tooltips FO, DO, FA, DA | Párrafo “Del cruce de la matriz…” de 2.1.2 |

## 2. Estructura

El proyecto Next.js va en la **raíz de `web_pulse_analytics/`**, no en `pulse-web/`.

- `create-next-app` puede rechazar una carpeta con contenido. Generar el proyecto en una carpeta temporal y fusionarlo, sin sobrescribir `data/`, `public/`, `docs/`, el spec ni este plan. No copiar los SVG de ejemplo a `public/`.
- `.gitignore`: agregar `docs/notebook/` (contiene comentarios crudos de usuarios).
- `.vercelignore`: `docs/`, `SPEC_web_pulse_analytics.md`, `PLAN_ejecucion.md`.
- No copiar nada de `docs/` a `public/`. `corpus_curado.csv` y `data/raw/` nunca llegan a la web.
- El repo git está en la raíz de `web_pulse_analytics/` (remoto `origin` en GitHub, público por decisión del usuario). Claude no hace `git add`, `commit` ni `push`: el usuario los hace.

## 3. Reglas técnicas que corrigen el spec

**Comandos y stack (versiones vigentes: Next 16, React 19, Tailwind 4, shadcn 4, motion 14, Recharts 3)**
- pnpm no está instalado: `npm i -g pnpm`. Si pnpm bloquea scripts de build (sharp), aprobarlos con `pnpm approve-builds`.
- `create-next-app`: `--ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm`. Si `--no-src-dir` no existe, responder “no” al prompt.
- shadcn: `init -t next -b radix`. El valor por defecto ya no es Radix. Dejar `style: new-york` y `baseColor: slate` en `components.json`; si la CLI no lo permite, usar el preset más cercano y aplicar los tokens de la sección 4.1 igualmente.
- Confirmar que `pnpm lint` ejecuta `eslint`: Next 16 retiró `next lint`.

**Resultado de la fase 0 (decisiones ya aplicadas)**
- `AGENTS.md` pide leer `node_modules/next/dist/docs/` antes de escribir código de Next: hacerlo al tocar rutas, `next/image`, fuentes o metadata.
- El scaffold trae `cacheComponents` y `partialPrefetching` activos: **se quitaron** (el sitio es estático y `force-static` es incompatible). No volver a activarlos.
- `pnpm-workspace.yaml`: `sharp: true` (necesario para `next/image` local y la imagen OG).
- shadcn: la CLI 4 ya no ofrece `new-york`. Se usó `-b radix -p vega` (`radix-vega`) y `baseColor: slate`. Los tokens de marca de la sección 4.1 sobrescriben su tema en la fase 1.
- Los componentes generados importan `cn` desde el paquete `cn` (publicado por shadcn; `lib/utils.ts` lo reexporta). No es una dependencia agregada a mano: no reemplazarla.
- `eslint.config.mjs`: `react-hooks/set-state-in-effect` desactivada solo en `components/ui/**` (carousel generado).
- Versiones instaladas: Next 16.4.5, React 19.3, Tailwind 4.3, motion 14.9, Recharts 3.8.
- `pnpm build` y `pnpm lint` pasan sin errores ni avisos.

**Resultado de la fase 1 (decisiones ya aplicadas)**
- `app/globals.css`: tokens de marca + variantes de contraste de la tabla anterior. Solo modo claro (sin bloque `.dark`, sin tema de sidebar).
- Dos desviaciones del spec en los tokens semánticos de shadcn: `--accent` es **mist/navy** (el spec dice teal; shadcn lo usa como fondo de hover con texto pequeño y blanco sobre teal da 3,32:1) y `--destructive` es `#A53C23` (blanco sobre coral da 3,09:1). El teal de marca se usa con `bg-teal`, `text-teal-text`, etc.
- Foco: `outline: 2px solid var(--ring)` global. En componentes propios usar `ring-ring`, no `ring-teal`.
- Fuentes: Inter (`--font-inter`) y JetBrains Mono (`--font-jetbrains`). **`--font-mono` lleva a Inter como respaldo**, porque JetBrains Mono no tiene el espacio fino U+202F. Texto con tildes, `ñ`, `¿`, `×`, `−` y comillas queda cubierto.
- Símbolos `≥ ≈ → ○ ⇨ ▽` no vienen en los subconjuntos de Google Fonts y usan la fuente del sistema. Aceptable para `≥ ≈`; **en la tabla DAP (fase 8) dibujar ○ ⇨ □ D ▽ como SVG**, no como texto, para que no cambien de ancho según el sistema.
- `lib/format.ts`: `formatNum`, `formatUSD`, `formatPct` y `formatFecha` (zona `Lima` o `UTC` explícita). Redondeo con `en-US` y separadores a mano: sin dependencia de la versión de ICU, servidor y cliente imprimen igual. 22 casos comprobados (los 4 del criterio: `US$ 18 084`, `1 445`, `0,78`, `−68 861`).
- `lib/motion.ts`: tokens del spec 5.1 + `reducedVariants` y `STAGGER_MAX`. `hooks/use-motion-ok.ts` es el único punto de decisión. Contrato para Reveal, Stagger, CountUp, líneas y gráficos: **renderizar el contenido visible por defecto** y aplicar el estado inicial animado solo cuando `useMotionOk()` sea `true`, ya montados; así nadie con movimiento reducido ve contenido oculto.
- `components/providers.tsx` (`MotionConfig reducedMotion="user"` + `TooltipProvider` a 200 ms) y `app/layout.tsx` (`lang="es"`, título, descripción, `themeColor`). `app/page.tsx` es un marcador temporal que se reemplaza en la fase 8.

**Resultado de la fase 2 (decisiones ya aplicadas)**
- Archivos: `data/nav.ts` (16 secciones, 8 enlaces, `activeNavId`), `hooks/use-active-section.ts`, `components/layout/{site-header,mobile-nav,reading-progress,back-to-top,site-footer,pulse-logo}.tsx`, `app/template.tsx`, `app/icon.svg`. Se borró el `favicon.ico` del scaffold.
- **Una sola fuente de verdad para las secciones:** `data/nav.ts`. Al armar la página (fase 8) cada `<Section id>` debe usar exactamente esos ids y el orden de `sections`; el menú, el pie y el scroll-spy dependen de ello. Orden del menú: Mercado antes que Empresa (orden real de la página).
- **`<main>` único en `app/template.tsx`** (`id="contenido"`, destino del enlace «Saltar al contenido»). Las páginas **no** declaran `<main>`. El header es `fixed`: las páginas que no empiezan con un hero navy deben dejar `pt-28` arriba (como `/referencias`).
- `<html data-scroll-behavior="smooth">`: sin él, Next 16 deja el scroll suave activo en cambios de ruta y `/` → `/referencias` sube lentamente. Con él, las rutas saltan arriba y los anclas siguen siendo suaves (comprobado).
- **Barra de progreso** colgada del borde inferior del header (`top-full mt-px`): bajo el header cuando se ve y pegada al borde superior de la ventana cuando se oculta, así que siempre es visible.
- `template.tsx` no anima la primera carga (LCP) y, al terminar la animación, **realinea el scroll al `#ancla`**: Next calcula el scroll con el contenido aún desplazado 12 px y el título quedaba 12 px más arriba de `scroll-mt`.
- **View Transitions no se activan** (React 19.3 las trae estables): con dos rutas, el fundido de `template.tsx` cumple lo mismo y apilar ambos animaría dos veces.
- Textos de accesibilidad de los componentes generados traducidos a mano en `components/ui/{sheet,dialog,carousel}.tsx` («Cerrar», «Diapositiva anterior/siguiente»). `shadcn add --overwrite` los revertiría: volver a aplicarlos.
- `app/page.tsx` y `app/referencias/page.tsx` son marcadores temporales (fases 8 y 9).
- **Verificación en navegador, fase 2** (Edge real, servidor de producción, 57 comprobaciones: escritorio, móvil 390 px y movimiento reducido): estados del header, ocultar/mostrar, scroll-spy de las 16 secciones, progreso, volver arriba, anclas suaves y alineadas, `/referencias`, teclado y foco, menú móvil, sin errores de consola. El script vive fuera del repositorio; para repetir la prueba hay que escribir otro.

**Formato**
- `lib/format.ts` con `formatToParts`: grupo U+202F, coma decimal, signo `−` (U+2212) y `useGrouping: 'always'`. Comprobar: `18 084`, `1 445`, `0,78`, `−68 861`.
- En `/data`, usar U+202F también en cifras escritas dentro de textos, para que no se partan de línea.
- `calidad[].Valor` y `Umbral` traen punto decimal en 41 de 52 filas: convertirlos al mostrarlos, sin tocar el JSON.
- Fechas con `timeZone` explícito (`America/Lima` o `UTC`) para evitar errores de hidratación.
- `chequeos_calidad.CRÍTICO` no existe en el JSON: usar `?? 0`.

**Contraste (AA).** Agregar tokens y usarlos en texto menor de 18 px:

| Token | Valor | Contraste | Reemplaza a |
|---|---|---|---|
| `teal-text` | `#1A6F65` | 5,99 blanco / 5,33 mist / 4,58 sobre tinte 15 % en mist | teal (3,32), incluido el eyebrow. El `#1F7A70` del spec daba 4,16 sobre su tinte en mist |
| `coral-text` | `#A53C23` | 6,42 blanco / 5,71 mist / 4,92 sobre tinte 15 % en mist | coral (3,09 / 2,75), incluida la tabla de flujo |
| `muted-foreground` | `#5B6472` | 5,98 blanco / 5,32 mist | `#6B7280` (4,30 sobre mist) |
| `teal-soft` | `#5CCFC0` | 6,09 navy / 7,10 navy-deep | teal sobre navy (3,45) |
| `coral-soft` | `#FF9E85` | 5,73 navy / 6,68 navy-deep | coral sobre navy (3,71) |
| `--ring` | `#289789` | 3,57 blanco / 3,18 mist / 3,21 navy | `#2A9D8F` (2,96 sobre mist; foco exige 3:1) |

Blanco sobre teal (3,32) solo en texto ≥ 18 px o negrita grande. Todos los pares se verificaron con un cálculo WCAG; repetirlo si se cambia un token.

**Movimiento y rendimiento**
- `reducedMotion="user"` no desactiva opacidad. Crear un hook único y usarlo en Reveal, Stagger, CountUp, líneas `pathLength`, gráficos y aguja.
- Entrada del hero con **CSS keyframes**, no con motion, y `template.tsx` animado solo en navegación cliente, nunca en la primera carga. Si no, el HTML llega con `opacity: 0` y se pierde el LCP.
- Video: `motion-reduce:hidden` no impide la descarga. Agregar `<source>` desde el cliente solo si se permite movimiento, y después de la carga inicial.
- Gráficos con `next/dynamic` y `ssr: false`: reservar la altura para evitar CLS.
- `layoutId="tab-indicator"`: envolver cada grupo de tabs en `<LayoutGroup id>`.
- CountUp: permitido en hero, `#mercado` y KPIs de `#caso-binance`. Prohibido en `#costos`.

**Datos y componentes**
- `referencias.ts`: cambiar a `as const satisfies readonly Referencia[]` y exportar `RefId`. Sin esto `Cite` no valida ids al compilar.
- Las 15 PNG de “respaldo” deben poder abrirse: botón “Ver como imagen” junto al gráfico nativo.
- Scroll-spy: en secciones sin enlace en el menú, mantener activo el último enlace previo. En `/referencias` el header arranca sólido y sus enlaces apuntan a `/#ancla`.
- RiskMatrix: varios círculos por celda (R3/R4, R5/R7, R6/R10 comparten posición).
- Avatares: valores iniciales Max `16% 24%` y Bruno `85% 27%`. Los del spec quedan descentrados; ajustar a ojo.
- Logo: no usar `logo.jpg` (924 KB, fondo blanco). Redibujarlo en SVG (burbuja navy, pulso teal y coral) con variante blanca para fondos navy. Usarlo en header, footer y `app/icon.svg`.
- Imagen OG: recorte 1200×630 del póster con `sharp`, en `public/images/og.jpg`.
- `spcx90k` no aparece en `top_terminos` actuales. Dejar la lógica condicional igualmente.
- Orden de la página: `… #costos → #nlp → #caso-binance → #plan → #equipo`.

## 4. Figuras (numeración y fuente del informe)

La columna “Fuente” usa `<Cite>` donde hay id. Las demás dicen “Elaboración propia.”

| Archivo | Fig. | Fuente |
|---|---|---|
| `01-latam-volumen.png` | 1 | Elaboración propia con datos de Chainalysis reportados en `monitor` y `forbes_pe` |
| `02-embudo-peru.png` | 2 | Elaboración propia con datos de `datareportal`, `forbes_pe` y `gestion_350k` |
| `03-pestel-balance.png` | 3 | |
| `04-porter-radar.png` | 4 | |
| `06-tam-sam-som.png` | 5 | Elaboración propia con datos de `rnm` y `gestion_350k` |
| `05-posicionamiento.png` | 6 | |
| `10-mrr-clientes.png` | 7 | Elaboración propia (modelo financiero, Anexo E) |
| `07-organigrama.png` | 8 | |
| `08-flujograma-proceso.png` | 9 | |
| `15-proceso-suscripcion.png` | 10 | |
| `12-matriz-riesgos.png` | 11 | |
| `11-flujo-acumulado.png` | 12 | |
| `13-crisp-dm.png` | 13 | Elaboración propia a partir de `chapman` |
| `14-gantt.png` | 14 | |
| `caso/fig_4_3_1_volumen.png` | 15 | |
| `caso/fig_4_3_2_sincronia.png` | 16 | |
| `caso/fig_4_3_3_idioma.png` | 17 | |
| `caso/fig_4_3_4_longitud.png` | 18 | |
| `caso/fig_4_3_5_vocabulario.png` | 19 | |
| `caso/fig_4_3_5b_log_odds.png` | 20 | |
| `caso/fig_4_3_6_entidades_aspectos.png` | 21 | |
| `caso/fig_4_3_6b_medios_videos.png` | 22 | |
| `caso/fig_4_3_7_sentimiento_preliminar.png` | 23 | |
| `caso/fig_4_4_calidad.png` | 24 | Elaboración propia (`calidad_datos.csv`) |
| `caso/fig_4_4b_embudo.png` | 25 | |
| `09-arquitectura-mvp.png` | 26 | |

Los títulos exactos están en el índice de figuras de `informe_texto.txt`.

## 5. Fases

Orden de la sección 11 del spec, con una fase 0. No pasar de fase sin cumplir su criterio.

| # | Fase | Terminada cuando |
|---|---|---|
| 0 | pnpm, proyecto, shadcn, dependencias, `.gitignore`, `.vercelignore` (**hecha**; el despliegue ya no es parte de esta fase, ver sección 6) | `pnpm build` y `pnpm lint` pasan |
| 1 | Tokens, fuentes, `format.ts`, `motion.ts`, hook de movimiento | Formatos comprobados con los 4 casos |
| 2 | Header, menú móvil, progreso, volver arriba, footer, `template.tsx` | Estados de scroll correctos, también en `/referencias` |
| 3 | Componentes comunes y lightbox | Funcionan con teclado |
| 4 | Archivos de `/data`, `lib/caso.ts` con assert, API | Un `Cite` inválido y una clave faltante rompen el build; probar ambos y revertir |
| 5 | Hero y `#costos` | Cifras iguales al spec, sin count-up en costos |
| 6 | `#pulse-score` | Mouse, toque y teclado; cambian los mensajes en ±20 |
| 7 | `#caso-binance` | Ninguna cifra escrita a mano; 0 comentarios de usuarios |
| 8 | Las 12 secciones restantes | Contenido completo de la sección 7 |
| 9 | `/referencias`, 404, SEO, OG, favicon | Los enlaces `#ref-n` resaltan la referencia |
| 10 | Control final | Lista de la sección 10 completa |

En la fase 10, medir Lighthouse móvil con `npx lighthouse` (sin agregarlo como dependencia) sobre `pnpm start`, y revisar 360, 768, 1024 y 1440 px. Reportar los puntajes reales, también si alguno queda bajo 90.

## 6. Vercel

Dominio final: `pulse.analytics.umihogar.com`. **El DNS aún no está configurado.**

**Flujo acordado: todo se construye en local; el usuario sube el repositorio a GitHub y lo conecta a Vercel desde el panel.** La CLI de Vercel falló al instalarse: no usarla ni pedir `vercel login`.

1. El usuario crea el repositorio y conecta el proyecto en Vercel (Framework: Next.js; raíz del proyecto: `web_pulse_analytics/` si el repositorio es la carpeta padre). Vercel asigna la URL `*.vercel.app`.
2. Claude no hace `git add`, `commit` ni `push` salvo que el usuario lo pida (el repo git está en la raíz de `web_pulse_analytics/`).
3. Para el dominio, el registro DNS exacto lo muestra el panel de Vercel (Settings → Domains), normalmente un CNAME con host `pulse.analytics` en la zona `umihogar.com`.
4. `metadataBase` desde `NEXT_PUBLIC_SITE_URL` (fase 9). Hasta tener la URL real, valor por defecto `http://localhost:3000`; el usuario la define como variable de entorno en Vercel.
5. `.vercelignore` solo aplica a la CLI; con despliegue por GitHub, `docs/` está en el repositorio. **Decidido: el repositorio es público e incluye `docs/informe/`, SPEC y PLAN** (no contienen comentarios de usuarios); `docs/notebook/` sigue en `.gitignore`.

## 7. Pendiente del usuario

- Datos de `#equipo` y carátula del informe: integrantes, universidad, curso y docente. Quedan como `[Por completar]`.
- Login en Vercel y registro DNS.
- `parte4/` en la carpeta padre es la copia anterior del notebook; la vigente es `docs/notebook/`.

**Resultado de la fase 3 (decisiones ya aplicadas)**
- Componentes en `components/common/`: `section`, `section-header`, `reveal`, `stagger`, `count-up`, `kpi`, `figure` (+ `figure-lightbox`), `cite`, `data-table`, `mascot-avatar`, `speech-bubble`, `status-badge`. Soporte: `hooks/use-reveal.ts`; `lib/motion.ts` suma `prefersReducedMotion()`, `REVEAL_DISTANCE_PX`, `STAGGER_*` y `EASE_OUT_CSS`.
- **Reveal y Stagger no usan `whileInView` de motion** sino la Web Animations API (`useReveal`): el HTML del servidor lleva todo visible; tras montar, solo lo que está bajo el primer pantallazo se oculta y entra al hacer scroll. Lo visible al cargar no parpadea (comprobado), con `prefers-reduced-motion` nunca queda nada oculto y, al terminar, no queda estilo en línea que pise los `hover:-translate-y-1` de las tarjetas. **`Stagger` anima los hijos DIRECTOS del contenedor: no hay que envolver cada tarjeta.**
- `CountUp` recibe datos serializables (`kind: num|usd|pct`, `decimals`, `prefix`, `suffix`), no una función de formato (un componente de servidor no puede pasarle funciones a uno de cliente). `Kpi` recibe `value` como `ReactNode`: se le pasa `<CountUp …/>` donde el spec permite conteo y texto simple en `#costos`.
- `Section` exige `id: SectionId` (de `data/nav.ts`) y `SectionHeader` recibe el mismo `id` para generar `{id}-titulo` (el `aria-labelledby`). Secciones sobre navy: `tone="navy"` en `Section` y `tone="dark"` en `SectionHeader`.
- **`Cite` valida en compilación:** `data/referencias.ts` ahora es `as const` y exporta `RefId`. Un id inexistente no compila. Pendiente fase 9: contrastar texto y orden de las 55 referencias con el informe (el archivo viene del paquete, no verificado contra el informe).
- `DataTable` **no usa `ScrollArea`** (el contenedor de la tabla de shadcn no admite atributos): región con `overflow-x-auto`, `tabIndex=0` y `aria-label`, para poder desplazarla con el teclado. Primera columna fija con fondos opacos; título **fuera** de la región con scroll (si no, se desplaza con la tabla en móvil); columnas `mono` en `whitespace-nowrap` aunque el dato traiga espacios normales. Filas destacadas por índice (`highlightRows`).
- `Figure`: lightbox con `next/dynamic` y `ssr:false`, montado solo al primer clic. **Radix solo devuelve el foco a un `DialogTrigger`**: `Figure` pasa `onReturnFocus` para devolverlo al botón (era un defecto real, corregido y probado).
- Mascotas: avatares recortados del póster con `next/image` (no `background-image`), recortes Max `16% 29%` y Bruno `84,5% 29%`, ya afinados a ojo. Pasar `src` si llegan PNG individuales.
- `StatusBadge`: además de los 6 tipos del spec incluye `positivo`/`negativo`/`neutral` (titulares del caso, 7.15-G). «Bajo» usa teal (el verde de la marca) y «medio» usa gold. La matriz de riesgos (fase 8) puede usar los mismos tonos.
- `components/ui/dialog.tsx` editado a mano: fondo `navy/70` con desenfoque, 200 ms, contenido 250 ms y `motion-reduce:duration-0` (spec 5.4). `shadcn add --overwrite` lo revertiría.
- **Aún no existe `PulseDivider`** (línea de pulso con `pathLength`, spec 5.2): se crea en la fase 8, donde se usa.
- Verificación en navegador, fase 3: 41 comprobaciones sobre una galería temporal (ya borrada): Reveal/Stagger/CountUp con y sin movimiento reducido, tooltips y HoverCard por mouse y teclado, lightbox por teclado, tabla en móvil con scroll y primera columna fija. Regresión de la fase 2: 57/57.

**Resultado de la fase 4 (decisiones ya aplicadas)**
- **Datos en `data/*.ts` tipados** (`kpis`, `mercado`, `pestel`, `porter`, `empresa`, `productos`, `competidores`, `dap`, `negocio`, `situacion`, `riesgos`, `glosario`, `costos`, `nlp`, `plan`, `equipo`, más `pulse-score`, `mascotas` y `types`). Se transcribieron del spec; las definiciones del glosario, las descripciones de la estrategia, los cruces del FODA y los perfiles de segmento son los del informe. Los títulos (eyebrow/H2) y los párrafos de transición pueden quedarse en los componentes de sección; **toda lista, tabla, tarjeta, cifra y tooltip vive en `/data`**.
- **Notación de texto: `[ref:id]`, `**negrita**` y `[Por completar]` dentro de las cadenas**, interpretada por `components/common/rich-text.tsx`. Un `.ts` no puede llevar JSX y las citas van en medio de la frase. **Cambio de política respecto a lo escrito en la sección 3:** los datos se escriben con espacios normales y es `typo()` (en `lib/format.ts`, aplicada por `RichText`) la que pone espacio fino en los miles y espacio duro tras `US$` y antes de `%`. Todo texto de `/data` que se muestre debe pasar por `<RichText>` o por `typo()`. Un `[ref:id]` inexistente **lanza error al prerenderizar** (rompe el build); un `<Cite id>` directo no compila.
- **Los datos guardan nombres de icono, no componentes** (`IconName`, en `components/common/icon.tsx`): son serializables y pueden pasar a componentes de cliente. Para usar un icono nuevo hay que sumarlo al mapa de ese archivo. `Icon` e `IconChip` ya existen.
- **Cifras numéricas sin formato** (`{ usd: 18084 }`, `CountSpec`, series): el formato se aplica al mostrar con `lib/format.ts`. En `#costos` no hay conteo.
- **Derivados, no duplicados:** `pestel` sale de `pestelDetalle`, `porter` de `porterDetalle`, `mvp`/`mvpTotal` de `partidas`, `dapTotalSegundos` y `dapConteo` de `dap`, la TIR mostrada de `indicadores`. Cambiar el origen cambia todo lo demás.
- **`lib/caso.ts`** valida el JSON al importarse: ~75 claves/tipos obligatorios y la forma de cada fila de `calidad`. La ruta `/api/caso-binance` (estática, `Cache-Control` del spec) lo importa, así que un JSON roto detiene `pnpm build` con un mensaje que lista qué falta. **Probado en una copia aislada con cinco JSON rotos (clave ausente, bloque ausente, estado inválido, tipo equivocado, varios a la vez): los cinco fallan el build con mensaje claro.** Tras restaurar, el build vuelve a pasar.
- **Verificación de datos** (script fuera del repositorio, 51 comprobaciones): citas existentes (45 usos, 37 referencias distintas), sumas del presupuesto, flujo neto = ingresos − costos, MRR mensual = ingresos anuales, ARR = MRR × 12, mínimo del acumulado en el mes 21, equilibrio en el mes 22 y flujo sostenido desde el 27, conteos del DAP (6/3/3/1/2 y 80 s), niveles de riesgo, escala de las puntuaciones. Contraste con el informe: **94 de 97 cifras coinciden**; las 3 que no aparecen en el informe son `1 500` y `3 500` (desglose de los US$ 23 084 de inversión inicial, que el informe menciona sin desglosar) y `224 208` (ARR 2028 = 18 684 × 12). Cuadran aritméticamente.
- **Narrativa del caso Binance** (cronología, conclusiones, hallazgos): se crea en la fase 7 en `data/caso.ts`, con **marcadores `{kpis.campo}` sustituidos desde el JSON**, para que ninguna cifra del caso se escriba a mano. La única cifra que no está en el JSON es la muestra de anotación (604 textos): verificada contra `muestra_anotacion.csv` (604 filas).
- `data/equipo.ts` usa `null` para lo pendiente; el componente de `#equipo` debe pintar `[Por completar]`. Es el único lugar donde puede aparecer ese marcador (spec 10).
- Referencias: el orden y los textos de las 55 siguen pendientes de contrastar con el informe (fase 9).

**Resultado de la fase 5 (decisiones ya aplicadas)**
- **Informe:** se agregó en 3.2.6 c) el desglose de la inversión inicial (MVP US$ 18 084 + constitución US$ 1 500 + equipamiento US$ 3 500) y el ARR de cierre de cada año (US$ 82 464 · 224 208 · 463 416). Ahora **las 97 cifras de `/data` coinciden con el informe**. Documento validado; `docs/informe/informe_texto.txt` regenerado.
- **Hero** (`components/sections/hero.tsx` + `hero-video.tsx`): póster optimizado como capa base (es el elemento del LCP) y `<video>` superpuesto. Con movimiento reducido el `<video>` ni se monta y el mp4 no se descarga (comprobado por red); con movimiento se monta tras el evento `load`, se pausa fuera de pantalla y se reanuda al volver, salvo que la persona lo haya pausado. Botón Pausar/Reproducir (WCAG 2.2.2). Entrada al cargar solo con CSS (`hero-rise`/`hero-media` en `globals.css`), no depende de hidratar. **La franja de KPI se superpone 64 px a la sección siguiente: `#contexto` debe llevar `pt-44` (7 rem + 4 rem).**
- **`#costos`** (`components/sections/costos.tsx`): 4 KPI fijos (sin conteo, comprobado), 5 pestañas animadas (`components/common/animated-tabs.tsx`), pie y cierre de Max. Las cifras se comprobaron contra **literales del spec escritos en la prueba**, no contra `/data`: presupuesto (9 filas), flujo de caja (10 filas × 3 años), 6 tarjetas de evaluación, 3 escenarios de sensibilidad.
- **Cuatro desviaciones del spec por la habilidad `dataviz`** (sus reglas son explícitas): (1) **MRR y clientes en dos paneles alineados**, no un plot con eje derecho (los ejes duales «inventan una correlación»); un solo tooltip lee ambas series. (2) **Barra segmentada alta en lugar de la dona** del presupuesto, con la cola plegada en «Otros» (cómputo + etiquetado + herramientas = US$ 1 440) y el detalle completo en la tabla; `mvp` (datos del donut) se reemplazó por `mvpBarra` en `data/costos.ts`. (3) **MRR coloreado por año con una rampa ordinal navy** (#8FA9C8 · #4B6E9E · #1F3A5F), no teal/navy/#2F5D8A. (4) **Línea de clientes en teal**, no coral: el coral es «negativo» en la marca y el crecimiento de clientes es positivo. Si prefieres el diseño literal del spec, es un cambio contenido.
- **Paleta de gráficos validada con `validate_palette.js`** contra fondo blanco (`lib/chart-colors.ts`): azul #2B63A8, teal #2A9D8F y coral #E76F51 pasan los 5 chequeos. **La paleta de marca pura NO pasa como categórica** (navy demasiado oscuro y poco cromático, gris pizarra sin croma, dorado fuera de banda); por eso los gráficos no la usan tal cual. El gris de «Otros» no pasa el piso de croma a propósito (es la cola plegada). `textoSobre()` elige blanco o tinta por contraste real dentro de los rellenos (la habilidad prescribe blanco, que sobre teal/coral da ~3:1).
- **Marcas y anatomía:** barras ≤ 24 px (14 px) con extremo redondeado de 4 px; líneas de 2 px; puntos de 8 px con anillo blanco de 2 px; área al 10 %; rejilla en hairline sólido; etiquetas directas selectivas (cierres de año, mínimo y cierre); cada gráfico con `role="img"` + conclusión y **tabla gemela solo para lectores de pantalla** (36 y 37 filas). Recharts se monta solo al entrar en pantalla (`InViewMount`, `next/dynamic` sin SSR, alto reservado).
- **Lecciones de la prueba en navegador (aplicar en la fase 8):**
  - Un `grid` sin columnas definidas crea una columna implícita `auto` que **crece con su contenido** y desborda en móvil (un gráfico de 546 px en un panel de 350 px). **Todo `grid` de una columna debe llevar `grid-cols-1`** (`minmax(0,1fr)`), y las tarjetas con gráficos `min-w-0`.
  - **Mi prueba de «sin desborde» pasaba siempre** porque en emulación móvil `innerWidth` crece con el contenido. Comparar contra el ancho real (390), no contra `innerWidth`.
  - Comprobar que un elemento «existe» no prueba que se vea: el indicador de pestaña existía pero un contenedor con scroll lo recortaba. Se verifica con `elementFromPoint`.
  - Una etiqueta sobre una serie creciente se ancla a la **derecha** de su barra (las barras siguientes son más altas y la tapan). Las marcas de eje se reducen en pantallas angostas (`hooks/use-media-query.ts`).
  - Leer un estilo justo tras `Tab` da el primer fotograma de la transición (`transition-all`): esperar ~400 ms.
- **Foco de las pestañas:** tras un clic de mouse `:focus-visible` ya es verdadero (Radix enfoca por script); se usa el contorno global de 2 px con separación en lugar del borde + anillo pegados de shadcn.
- **Verificación en navegador, fase 5:** 101 comprobaciones (hero escritorio/móvil/movimiento reducido, entrada CSS, video, `#costos` en escritorio/móvil/reducido). Regresión de la fase 2: 57/57.

**Resultado de la fase 6 (decisiones ya aplicadas)**
- **Archivos:** `components/sections/{pulse-score,pulse-demo,pulse-gauge}.tsx`, `lib/pulse-color.ts` (color, ángulo y zonas, sin dependencias), `data/pulse-score.ts` (ya existía). `app/page.tsx` renderiza la sección real.
- **Medidor SVG propio** (no Recharts): arco en **tres zonas** coral → gris → teal con un hueco de 2 px, cuyos límites son los mismos ±20 de los mensajes de las mascotas; leyenda de zonas; marcas −100 / −20 / 0 / +20 / +100. La aguja gira de −90° a +90° con `spring.soft` (`useSpring`) sobre el centro del arco —comprobado por geometría: a ±100 su pie coincide con el eje del arco y apunta al extremo— y sin resorte con movimiento reducido.
- **Color del número:** interpolado coral → gris → teal con las variantes CLARAS (`#FF9E85` · `#96A5BA` · `#5CCFC0`), no con el coral y el teal puros del spec, que sobre navy dan 3,7:1 y 3,5:1. Peor caso de los 201 valores: **4,58:1** (AA). El gris del cero es 2 unidades más claro que el `#94A3B8` del spec (daba 4,47:1); el arco conserva el gris exacto del spec (gráfico, basta 3:1).
- **`components/ui/slider.tsx` editado a mano:** shadcn no reenvía `aria-label` al *thumb* (el `role="slider"` que se enfoca), así que el deslizante habría salido sin nombre. Ahora acepta `thumbLabel`, `thumbValueText` (anuncia «+65, positivo»), `thumbClassName`, `thumbStyle`, `trackClassName` y `rangeClassName`. `shadcn add --overwrite` lo revertiría. El rango está transparente: el control es divergente y rellenar desde −100 mentiría.
- **Teclado y ratón:** flechas ±1, RePág/AvPág ±10, Inicio/Fin a los extremos (Radix); clic en la pista y arrastre; toque en móvil. Los 3 botones rápidos llevan el control a su valor con un tween de 0,7 s (salto directo con movimiento reducido), llevan `aria-pressed` y mover el control interrumpe el tween.
- **`aria-live` PERSISTENTE:** el mensaje vive en una región `aria-live="polite"` que nunca se remonta (se comprobó con una marca en el nodo tras cruzar los umbrales); solo se remonta su contenido para disparar la animación de entrada (CSS: fade + `slide-in-from-bottom-1.5` en 200 ms, avatar `zoom-in-90`; ambos sin animación con movimiento reducido). Solo cambia al cruzar ±20, así que no se anuncia a cada paso. `SpeechBubble` ganó `avatarClassName`.
- **Foco visible:** el anillo del deslizante era blanco al 30 % (≈ 2,2:1, bajo el 3:1 de WCAG); ahora es blanco pleno con separación del color del panel (`#2A4467`): 9,9:1, igual que los botones.
- **Umbrales verificados en navegador:** ±19 → ambos, 20 → Max, −20 → Bruno, ±100; avatares y color de borde de cada caso; n = 480 + |v|×3 (675, 654, 480).
- **Lecciones para la fase 8/10:** (1) Edge devuelve colores translúcidos como `oklab(… / α)` y los opacos como `rgb(…)`: las pruebas deben leer ambos. (2) Al medir un anillo de foco hay que evaluar TODAS las capas de `box-shadow` y quedarse con la de mayor contraste (la primera suele ser la separación). (3) Un «existe» no prueba que se vea ni que contraste: se mide.
- **Verificación en navegador, fase 6:** 81 comprobaciones (escritorio, movimiento reducido, móvil) + foco. Regresiones: fase 2 → 57/57, fase 5 → 101/101.

**Resultado de la fase 7 (decisiones ya aplicadas)**
- **Archivos:** `components/sections/caso-binance.tsx` (componente de SERVIDOR: llama a `getCasoData()` y pasa a cada gráfico de cliente solo su fragmento), `components/caso/*` (barra segmentada, idioma, sentimiento, términos, distintivos, entidades, mapa de calor de aspectos, embudo, volumen, Pulse Score preliminar, KPI, cronología, titulares, calidad, galería), `data/caso.ts`, `lib/caso-util.ts` (`fillCaso`, `decimalComa`), `hooks/use-draw-bars.ts`. Todas las cifras salen de `eda_summary.json`; los textos con cifras son plantillas (`{kpis.x}`) que fallan el build si falta el dato.
- **Privacidad:** la página NO publica comentarios de usuarios, solo agregados y titulares con enlace. Se comprobó contra los 694 comentarios reales de YouTube del notebook: ninguno (≥ 28 caracteres) aparece en el HTML ni en `/api/caso-binance`, y el JSON no trae campos de autor.
- **Volumen** sobre eje numérico en ms (no categórico): la línea del hackeo cae a las 20:05 UTC del 29-oct (±2,5 px) y la crisis aguda mide exactamente 72 h. Alternancia «Cada 6 horas / Por día» con notas de base propias (1 321 y 1 338 documentos). Sin etiquetas dentro del gráfico en móvil (la leyenda ya nombra «Hackeo» y «Crisis aguda»).
- **Sentimiento léxico = PRELIMINAR** (insignia dorada + alerta `role="note"` + Bruno): el Pulse Score de los titulares llega a −90 y el de los comentarios no baja de −20; el spec lo exige así y la página no lo presenta como el modelo final.
- **Defectos encontrados y corregidos por las pruebas en navegador:** (1) barra de entidades: el valor de Binance encogía la barra (87 % en vez de 97 %) → pista de ancho común y columna del valor reservada; (2) «10000» sin separador en la conclusión 2 → ahora «10 000»; (3) el carrusel de titulares desbordaba el móvil a 613 px (`grid` sin `grid-cols-1`/`min-w-0`) → aplicado `grid-cols-1` a todas las rejillas de una columna del caso; (4) las flechas del teclado no pasaban las figuras de la galería (el foco arranca en el diálogo) → `onKeyDown` en el diálogo; (5) galería en móvil: la figura desbordaba el diálogo → `min-w-0`, y la imagen se puede desplazar en horizontal (mínimo 720 px) para poder leerla; (6) «spcx90k (spam)» sin espacio y truncado en móvil; (7) eje X del Pulse Score con fechas encimadas en móvil (`interval` 1 si ≤ 640 px) y hueco en blanco bajo el gráfico (alto reservado 430 → 350).
- **Anclas entre rutas (`app/template.tsx`):** al ir de `/referencias` a `/#plan` en móvil, Next dejaba la página ~1 700 px más arriba del título (el diseño cambia tras calcular el scroll). `keepHashAligned` realinea al terminar la entrada y, durante 2,5 s, mientras cambie el diseño; se suelta ante cualquier gesto de la persona (rueda, toque, teclado, clic). Sustituye a `realignToHash` (que solo corregía ≤ 24 px).
- **Lecciones para la fase 8:** (1) toda rejilla de una columna lleva `grid-cols-1`; (2) los selectores de las pruebas deben acotarse al componente (las tablas gemelas `sr-only` y los grupos con la misma etiqueta duplican coincidencias); (3) al fijar la altura reservada de un gráfico perezoso, medir la real en móvil y escritorio.
- **Verificación en navegador, fase 7:** 112 comprobaciones (privacidad, escritorio, movimiento reducido, móvil 390 px) + revisión visual de capturas. Regresiones: fase 2 → 57/57, fase 5 → 101/101, fase 6 → 81/81. `tsc`, `pnpm lint` y `pnpm build` sin errores ni avisos.

**Resultado de la fase 8 (decisiones ya aplicadas)**
- **Archivos:** 12 secciones nuevas en `components/sections/` (`contexto, sector, mercado, empresa, productos, competencia, procesos, negocio, situacion, nlp, plan, equipo`); gráficos en `components/charts/` (`latam-bar`, `pestel-chart`, `porter-radar`); islas de cliente en `components/{procesos,situacion,nlp,plan}/` (stepper, DAP, matriz de riesgos, glosario, partición, Gantt, hitos); comunes nuevos `figura-informe`, `figura-alterna` (`VerFigura`), `ver-como-imagen`, `pulse-divider`, `chip-tooltip`, `subtitulo`; `data/figuras.ts` (número, título, alt y fuente de las 15 figuras no-caso, del índice del informe). `app/page.tsx` ya no tiene marcadores: un registro `Record<SectionId, …>` hace que añadir o quitar una sección de `data/nav.ts` sin tocar la página no compile.
- **Contenido = spec 7.2 a 7.16**, con los datos de `/data` (ninguna cifra escrita en el componente salvo rótulos). Verificado en navegador: filas, cifras, citas `[n]`, colores y orden de los 6 PESTEL, 5 fuerzas, TAM/SAM/SOM, FODA 2×2, 5 planes, tabla de 5 competidores, 15 actividades DAP (suma 80 s), 5 OB, puente 5×3, 9 RF + 7 RNF, 10 riesgos en su celda, 16 términos, 5 tareas NLP, 8 métricas, partición 70/15/15, 6 fases del Gantt, 6 hitos, RACI 6×6 y equipo.
- **Decisiones de diseño (reglas de dataviz y accesibilidad):** (1) LatamBar, PESTEL, partición y barras son HTML con tabla gemela y tooltip por hover **y** foco (como en la fase 7); (2) la partición usa los azul/teal/coral validados, no el navy del spec; (3) la severidad de la matriz de riesgos va en la celda (P×I escrito), en la fila (`Alto · 16`) y en la leyenda, no solo en color; **R6 y R10 (P×I = 8) caen en «bajo»**, no en «medio»; (4) los símbolos del DAP son SVG con nombre accesible (○ ⇨ □ D ▽ ya no son texto); (5) en móvil el Gantt se sustituye por la Figura 14 y las etiquetas «Hackeo/Crisis» no van dentro de gráficos angostos; (6) cada gráfico nativo con PNG de respaldo tiene «Ver como imagen» que abre la figura numerada del informe (1, 3, 4, 11).
- **`ChipTooltip` (táctil):** Radix no abre un tooltip con un toque y cierra en `pointerdown` y en `click`. Los chips del glosario, los segmentos y las estrategias cruzadas usan este componente: toque alterna, el mouse deja abierto, Enter/foco funcionan, Esc cierra. Los `Kpi` con `hint` de fases anteriores **siguen sin abrirse con un toque** (pendiente, fase 10).
- **`components/ui/tooltip.tsx` editado a mano:** la caja era `inline-flex` y convertía en columnas cualquier contenido de varias líneas (los `block` del tooltip del presupuesto, de términos y de spam salían en horizontal); ahora es `block w-fit`. `shadcn add --overwrite` lo revertiría.
- **Header:** reaparecía con un reajuste de **1 px** hacia arriba (scroll anchoring al cargar contenido); ahora exige subir ≥ 12 px sin interrupción. `SHOW_AFTER_UP_PX` en `site-header.tsx`.
- **Lecciones para la fase 10:** (1) `scrollIntoView` + `scrollBy` seguidos cancelan el scroll suave: las pruebas saltan con `scrollTo({behavior:"instant"})`; (2) `innerText` y no `textContent` para comparar texto (los bloques no llevan espacio entre sí); (3) `h3` también son los encabezados del acordeón de Radix; (4) los selectores de pestañas deben acotarse por sección; (5) los textos con cifras en títulos que no pasan por `RichText` necesitan `typo()`.
- **Verificación en navegador, fase 8:** 157 comprobaciones (escritorio, movimiento reducido, móvil 390 px, teclado y toque) + revisión visual de capturas. Regresiones: fase 2 → 57/57 (se actualizó su umbral de progreso a una página ya larga), fase 5 → 101/101, fase 6 → 81/81, fase 7 → 112/112. `tsc`, `pnpm lint` y `pnpm build` sin errores ni avisos.
