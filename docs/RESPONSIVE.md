# Responsive: que todo se acomode siempre

La web debe verse bien desde un celular chico hasta una pantalla grande, en vertical y en horizontal, sin scroll lateral de la página y sin textos cortados.

## 1. Matriz de pruebas (obligatoria al cerrar cada fase)

| Dispositivo | Tamaño |
| --- | --- |
| Celular chico | 320 × 568 |
| Android común | 360 × 740 |
| iPhone | 390 × 844 |
| Celular grande | 430 × 932 |
| Celular horizontal | 844 × 390 |
| Tablet vertical | 768 × 1024 |
| Tablet horizontal / laptop chica | 1024 × 768 |
| Escritorio | 1440 × 900 |

Además: zoom del navegador al 200 % y tamaño de letra del sistema en "grande" sin que nada se corte.

## 2. Principios

1. **Celular primero**: el CSS base es para 360 px; las pantallas más grandes se agregan con `min-width`.
2. **Nada de anchos o altos fijos en px para contenedores.** Usar `%`, `fr`, `min()`, `max()`, `clamp()`, `aspect-ratio` y `dvh`. Los px quedan para bordes, radios y tamaños mínimos de toque (44 px).
3. **Escala de tipografía fluida** en `tokens.css`, por ejemplo:
   `--t-xs: clamp(11px, 2.9vw, 12px)` · `--t-s: clamp(13px, 3.4vw, 14px)` · `--t-m: clamp(15px, 4vw, 17px)` · `--t-l: clamp(19px, 5vw, 24px)` · `--t-xl: clamp(28px, 8vw, 44px)` · `--t-xxl: clamp(44px, 12vw, 92px)`. Ninguna pantalla define `font-size` suelto: usa estos tokens.
4. **Espacios fluidos**: `--e-1 … --e-6` con `clamp()`; el margen lateral es `--gutter: clamp(12px, 4vw, 32px)`.
5. **Container queries** (`container-type: inline-size`) en postales y tarjetas, para que se reacomoden según su propio ancho y no solo el de la pantalla.
6. **Textos largos**: `overflow-wrap: anywhere` en etiquetas, hashtags y nombres; nada de `white-space: nowrap` salvo en botones cortos. Si Rurú escribe un texto más largo en `textos.json`, la caja crece, no se corta.
7. **Áreas seguras** del celular (notch y barra inferior): `padding: env(safe-area-inset-*)` en cabeceras, barras inferiores y pantallas completas.

## 3. Escenas ilustradas (playa, malecón, cuartos, juegos)

Las escenas tienen un **tamaño lógico fijo** y se **escalan enteras**, en lugar de posicionar cada pieza en px de pantalla.

- Cada escena declara su tamaño lógico (por ejemplo, la playa 400×330, el malecón 1000×320, la sala 350×372) y se dibuja dentro de un contenedor con `aspect-ratio` igual a esas medidas.
- Las piezas se posicionan en **porcentajes** del contenedor (o en un SVG con `viewBox`, o en canvas con escala), así todo crece y se achica junto.
- Los personajes dentro de una escena miden un **porcentaje del alto de la escena**, no px fijos.
- En canvas: el tamaño real es `ancho_css × devicePixelRatio`, y se redibuja con `ResizeObserver` cuando cambia el contenedor.
- Los globos de texto se reposicionan para no salirse del borde (si no caben a la derecha, van a la izquierda o arriba).

### Malecón

- ≤ 767 px: scroll horizontal con snap por objeto, y una pista "desliza →" la primera vez.
- ≥ 768 px: la escena entra completa en el ancho disponible (sin scroll), escalada.
- En ningún caso el scroll del malecón mueve la página entera.

### Cómo está hecho (para Claude Code)

- Clase `.escena` (en `css/base.css`): `container-type: inline-size`, `aspect-ratio` y una unidad `--u` = 1 px lógico (`100cqw / ancho lógico`). Se declara con `style="--ancho:400;--alto:330"`.
- Las piezas `.pz` se colocan con `--x`, `--b` (desde abajo) o `--y` (desde arriba, con `.pz--arriba`), `--w` y `--h`, todos en px lógicos. Los personajes reciben `size: 'calc(112 * var(--u))'`.
- Para que una escena no sea más alta que la pantalla en horizontal se limita su ancho con `width: min(100%, calc(70dvh * ancho / alto))`.

## 4. Diseño por tamaño

| Ancho | Home | Pantallas tipo app (depa, taller, juegos, chat) |
| --- | --- | --- |
| < 600 px | Una columna; postales a todo el ancho | Pantalla completa |
| 600–1023 px | Postales en 2 columnas donde quepan | Columna centrada de máx. 560 px |
| ≥ 1024 px | Como el prototipo de escritorio (barra 7/12 + dato 5/12, etc.), máx. 1200 px | Editores (taller, Acción, editor del depa, estudio de fotos): **dos columnas**, el lienzo o escenario a la izquierda y las herramientas a la derecha. Juegos y chat: columna centrada de máx. 600 px con la escena escalada |

## 5. Horizontal en celular

- Juegos (runner): ocupan toda la pantalla; el HUD se pega a los bordes con áreas seguras.
- Editores: lienzo a la izquierda, herramientas en una columna a la derecha con scroll propio.
- Chat: el campo de texto queda visible sobre el teclado (`visualViewport`).
- Ninguna pantalla depende de una altura mínima mayor a 360 px; si no entra, hay scroll vertical.

## 6. Gestos y teclado

- Los botones de respaldo (−, +, ↺, ↻, flechas) siempre están, aunque haya gestos.
- En escritorio: arrastrar con el mouse, rueda para escalar con `Ctrl`, teclas de flecha para mover lo seleccionado.

## 7. Criterios (agregar a cada fase)

- Validar que no hay scroll horizontal de la página en ningún tamaño de la matriz.
- Validar que ningún texto se corta ni se superpone, también con zoom al 200 %.
- Validar que las escenas mantienen sus proporciones al cambiar el tamaño de la ventana en vivo.
- Validar que en horizontal (844 × 390) todas las pantallas son usables.
- Validar que con un texto de `textos.json` el doble de largo, el diseño sigue sin romperse.
