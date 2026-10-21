# CLAUDE.md — Pisco Sour Club

Instrucciones para Claude Code. Léelas completas antes de escribir código.

## Qué es

**Pisco Sour Club — una página al Chirú.** Web fan (no oficial) para el fandom Perú × Chile de Latin Hetalia, hecha por Rurú (GitHub: `rurunela`). Es un "malecón" con cuartos escondidos: casi nada dice "juega"; la gente toca cosas y descubre juegos, un taller para dibujar sus OCs, un depa donde viven, un creador de animaciones, fotos descargables, una radio con recuerdos y un chat con IA.

Lee en este orden:

1. `docs/BOSQUEJO.md` — concepto, personajes, identidad visual, módulos.
2. `docs/PANTALLAS.md` — las 28 pantallas, una por una, con interacciones y enlaces.
3. `docs/DATOS.md` — modelos de datos, almacenamiento local, Supabase (SQL) y contrato del chat.
4. `docs/ANIMACION.md` — motor de "Acción" (fotogramas → animación).
5. `docs/FASES.md` — orden de construcción y criterios de aceptación.
5b. `docs/CONTENIDO.md` y `docs/RESPONSIVE.md` — textos editables y reglas de responsive (aplican a todas las fases).
6. `prototipo/` — las pantallas diseñadas (referencia visual; ver `prototipo/LEEME.md`).
7. `data/` — contenido inicial (prompts, datos, trivia, personajes, etc.).

## Stack y restricciones

- **Hosting:** GitHub Pages (estático, HTTPS). Nada de servidor propio.
- **Frontend:** HTML + CSS + JavaScript (ES modules), **sin framework y sin paso de build**. Debe funcionar subiendo la carpeta tal cual.
- **Router:** una sola `index.html` con rutas por hash (`#/depa/sala`). Cada pantalla es un módulo en `js/pantallas/`.
- **Gráficos:** `<canvas>` para dibujo, juegos, animaciones y exportar imágenes. SVG/CSS para la interfaz.
- **Guardado local:** `localStorage` para datos pequeños (récords, progreso, ajustes) e **IndexedDB** para imágenes (dibujos, fondos, comidas, imágenes subidas, animaciones). Usa un solo módulo `js/almacen.js` para todo.
- **Servicios externos (solo en las fases indicadas):**
  - **Supabase** para el buzón de dibujos, sugerencias de canciones y recuerdos (fase 9).
  - **Cloudflare Worker** como intermediario del chat con IA (fase 10). La API key **nunca** va en el frontend.
- **Librerías:** solo si son imprescindibles, cargadas desde `cdn.jsdelivr.net` con versión fija (por ejemplo, `@supabase/supabase-js` en la fase 9). Nada de jQuery ni frameworks.

## Reglas que no se rompen

1. **Celular primero.** Se diseña a 390 px de ancho y se prueba a 360 px. Toques de 44 px como mínimo. Nada depende del hover. En escritorio la web se abre con `max-width`.
2. **Gestos:** dibujo, arrastre, pellizco y giro con **Pointer Events** (`touch-action: none` en lienzos y escenarios). Lienzos escalados con `devicePixelRatio`.
3. **Accesibilidad:** botones reales (`<button>`, `<a href>`), `aria-label` en botones de icono, contraste AA, `prefers-reduced-motion` desactiva rebotes, giros y parallax.
4. **Idioma:** toda la interfaz en **español** (de Perú y Chile, sin voseo).
5. **Contenido:** SFW siempre. El romance es tierno (sonrojos, abrazo, besito). Nada de la Guerra del Pacífico, tratados ni límites marítimos como chiste. Ver límites en `docs/BOSQUEJO.md` §2.
6. **Derechos:** no incrustar canciones comerciales ni personajes de otras obras. La música de la sala son pistas libres de derechos que Rurú pondrá en `assets/audio/` (deja el código listo y archivos de ejemplo vacíos o tonos simples). La playlist va por el reproductor oficial de Spotify (iframe).
7. **Privacidad:** las fotos de cámara, los dibujos y las animaciones **no salen del dispositivo** salvo que la persona use explícitamente "Mandar al buzón".
8. **Sin secretos en el repo:** las claves públicas de Supabase van en `js/config.js`; la API key de la IA vive solo en el Worker (`wrangler secret`).
9. **Proyecto fan:** el pie de página siempre dice que es un proyecto fan hecho por Rurú y que no es la cuenta oficial del fandom. La ficha de Perú pide no usar al personaje en proyectos pagados sin consultar a su creadora (Kuraudia): **todo es gratis**.
10. **Rendimiento:** los countryballs se dibujan una vez en canvas y se cachean como imagen (en el prototipo son 400 divs: **no** copiar eso). Spotify y las redes se cargan con lazy load. El runner y las animaciones usan `requestAnimationFrame` y se pausan con `visibilitychange`.
11. **Textos editables:** ningún texto visible va escrito en `js/`. Todo sale de `data/textos.json` (interfaz) o de las listas de `data/` (frases, prompts…), y el código se adapta al largo de cada lista. Ver `docs/CONTENIDO.md`. Al agregar una pantalla, sus textos van a `textos.json`, sus claves a `data/esquema-textos.json` y, si hace falta, un ejemplo a `data/LEEME.md`.
12. **Totalmente responsive:** de 320 px a 1440 px, vertical y horizontal, sin anchos fijos en contenedores, con tipografía y espacios fluidos y escenas que se escalan enteras. Ver `docs/RESPONSIVE.md`; su matriz de pruebas y sus criterios se suman a los de cada fase.

## Estructura de carpetas

```
/
├── index.html
├── admin.html              (panel de Rurú, fase 9)
├── manifest.json           (fase 11)
├── css/
│   ├── tokens.css          (colores, tipos, espacios)
│   ├── base.css
│   └── pantallas/*.css
├── js/
│   ├── main.js             (arranque + router)
│   ├── router.js
│   ├── config.js           (URLs y claves públicas)
│   ├── almacen.js          (localStorage + IndexedDB)
│   ├── personajes.js       (balls, OCs, caras, ropa → imágenes)
│   ├── lienzo.js           (motor de dibujo reutilizable)
│   ├── escenario.js        (stickers: mover, escalar, girar, voltear)
│   ├── exportar.js         (PNG, video)
│   ├── animacion/          (motor de Acción)
│   ├── juegos/runner.js
│   └── pantallas/*.js      (una por pantalla)
├── data/*.json
├── assets/
│   ├── sprites/  fondos/  audio/  fuentes/
└── worker/chat-worker.js   (se despliega en Cloudflare, no en Pages)
```

## Cómo trabajar

- Construye **por fases** (`docs/FASES.md`). No empieces una fase sin cerrar la anterior.
- Al terminar cada fase, recorre sus criterios "Validar que…" en un celular real o en el emulador del navegador a 390×844 y 360×740. Si algo falla, arréglalo antes de seguir.
- Un commit por tarea lógica, con mensaje en español: `fase 2: lienzo con deshacer y borrador`.
- Servidor local: `npx serve .` o `python3 -m http.server`. La cámara necesita `localhost` o HTTPS.
- Si un dato falta (hashtag, link de la playlist, redes, correo de admin, URLs de Supabase o del Worker), **no lo inventes**: deja el marcador entre corchetes (`[#TU_HASHTAG]`) en `data/` o `js/config.js` y anótalo en `PENDIENTES.md`.
- Si algo del diseño no se puede hacer en celular con buen rendimiento, propón la alternativa más simple que conserve la idea y anótala en `PENDIENTES.md`.
- Ante la duda, gana el prototipo en lo visual y `docs/` en el comportamiento.

## Arquitectura (fase 1 en adelante)

- `js/main.js` carga `data/textos.json` (`cargarTextos()`) y arranca el router.
- `js/router.js` define la tabla de rutas. Cada pantalla exporta `render(app, ctx)` y puede devolver una función de limpieza. `ctx` trae `params` (query del hash), `ruta` y `def`. El título de cada ruta es una clave de `rutas.*`. Si un JSON no carga, el router muestra la postal de error (`postalCaida` en `js/ui.js`).
- Una pantalla puede llamar a `ponerGuardia(fn)` (`js/router.js`) para pedir permiso antes de salir: `fn()` devuelve una promesa con `true` para seguir. Se borra sola al cambiar de pantalla. Para preguntar, usar `preguntar()` de `js/dialogo.js` (diálogo con estilo de postal), nunca `confirm()`.
- Las rutas que aún no existen usan `js/pantallas/proximamente.js` con su pantalla madre para "‹ Volver"; al construir una fase, cambia su entrada en la tabla por el módulo real.
- `js/textos.js`: `t(clave, vars)` → HTML seguro; `tp()` → texto plano (canvas, `document.title`); `attr()` → texto plano escapado para atributos (`aria-label`). `formato()`/`plano()` para textos de las listas. Las claves se escriben siempre literales y completas (`'home.barra.titulo'`).
- Tras agregar o quitar textos: `node .github/scripts/generar-esquema.mjs` y luego `node .github/scripts/validar-datos.mjs`.
- `js/datos.js` carga y cachea `data/*.json`. `activos()`, `delDia()` (hora de Lima, UTC−5) y `alAzar()` respetan `"activo": false` y el largo real de cada lista.
- Escenas: clase `.escena` con `style="--ancho:N;--alto:M"` y piezas `.pz` en px lógicos (`--x`, `--b`/`--y`, `--w`, `--h`), ver `docs/RESPONSIVE.md` §3. Tipografía y espacios solo con los tokens `--t-*` y `--e-*` de `css/tokens.css`.
- `js/personajes.js`: `htmlPersonaje({pais, cara, ropa, size, flip, manos, etiqueta})` devuelve el OC si existe (y no se eligió el ball) o el countryball; `size` puede ser `'calc(112 * var(--u))'`. Para exportar: `await dibujarPersonaje(ctx, {pais, cara, ropa, x, y, tamano, voltear})`. `cargarOCs()` se llama al arrancar; `ponerOC()` actualiza la caché al guardar.
- `js/almacen.js`: `leer/guardar` (localStorage) e `idbLeer/idbGuardar/idbTodos/idbBorrar` (IndexedDB `psc`, stores de `docs/DATOS.md` §2.2).
- `js/lienzo.js`: clase `Lienzo` (Pointer Events, trazos vectoriales, deshacer/rehacer 20 pasos, `exportarBlob()`). El calco va en un `<img>` debajo del canvas, nunca dentro del dibujo.

## Datos pendientes de Rurú

Ver `PENDIENTES.md`.
