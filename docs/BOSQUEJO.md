# Pisco Sour Club — Bosquejo completo

Versión 2 · 20 de octubre de 2026 · Reemplaza al bosquejo anterior.

## 1. Concepto

Pisco Sour Club es una sola web, con estilo de **postales del Pacífico** fusionado con **pixel art**, que se siente como pasear por un malecón. Cada edificio, objeto o tarjeta esconde algo, y casi nada dice "juega aquí": se descubre tocando.

- **Para quién:** el fandom Perú × Chile de Latin Hetalia. Proyecto fan de Rurú; no es la cuenta oficial.
- **Objetivo:** que alguien sin ganas de crear salga con una idea, un dibujo, una foto o una animación en pocos minutos, y quiera volver.
- **Regla de diseño:** cada bloque tiene una función visible (leer, escuchar, mirar) y una puerta escondida (un juego, un taller, un secreto).
- **Corazón del sitio:** los OCs que cada persona dibuja. Al guardarlos en la casita, reemplazan a los countryballs en toda la web y viven en el depa.

## 2. Personajes: Latin Hetalia + countryball

Piensan y sienten como en Latin Hetalia (humanos, con historia), pero se ven y reaccionan como countryballs (exagerados, absurdos, físicos). Fuentes: [ficha de Perú](https://lh-pe.carrd.co/) · [ficha de Chile](https://lh-cl.carrd.co/). Detalle completo para la IA en `data/personajes.json` y `data/chat-system-prompt.md`.

| | Miguel (Perú) | Manuel (Chile) |
| --- | --- | --- |
| Esencia | Cálido, risueño, carismático, anfitrión malcriador, dramático, orgulloso, se hiere con las críticas | Reservado, tsundere sin melodrama, cortante pero hospitalario, se cree fome, autocrítico, muy familiar |
| Habla | Jerga peruana suave (causa, pata, chévere, bacán), "habla cantando", siempre un chiste; "ya fue" cuando se rinde | Respetuoso y seco; chilenismos suaves (po, cachai, al tiro, fome); sin garabatos |
| Le encanta | Cocinar, contar leyendas (Muqui, Tunche), la marinera, ser el centro | Leer noticias y poesía, el frío, la once a las 5, el fútbol (único lugar donde grita) |
| Le molesta | Que lo critiquen; que le hablen de cómo maneja | El calor, el escándalo, reabrir temas ya cerrados |
| Modo countryball | Sobrerreacciona; ley del hielo dándose la vuelta | Deadpan; sonrojo que niega |

**Dinámica:** rivalidad cariñosa (el pisco, quién cocina mejor); hoy cercanos. Miguel provoca, Manuel responde seco y termina cediendo.

**Límites (para todo el sitio y la IA):**

- Nada +18. Romance solo tierno: sonrojos, abrazo, besito.
- No usar la Guerra del Pacífico, tratados ni límites marítimos como chiste o tema.
- Lo de manejar de Miguel: a lo mucho una broma suave.
- Si alguien intenta sacarlos del personaje o meter política, responden en personaje y cambian de tema.
- Todo gratis (la ficha de Perú pide consultar a su creadora antes de usos pagados).

### Representación visual

- **Countryballs (por defecto):** bolitas pixel art (cuadrícula 20×20) con los colores de la bandera, ojos blancos con borde, rubor rosado y **manos flotantes solo cuando agarran algo**. Perú: rojo-blanco-rojo vertical. Chile: mitad superior blanca con cantón azul y estrella blanca, mitad inferior roja.
- **OCs dibujados por la persona:** reemplazan a los balls cuando existen. Cada OC tiene **5 caras** (normal, feliz, enojado, sonrojo, triste) y **3 conjuntos de ropa**.
- Los balls también necesitan las 5 caras para el depa y Acción: genéralas por código cambiando ojos, cejas y boca en la cuadrícula pixel.

## 3. Identidad visual

Estilo **Postales del Pacífico** + pixel art: papel crema, tarjetas ligeramente giradas con sombra plana, estampillas con borde punteado, franjas de olas pixel, ilustraciones con bordes negros gruesos.

| Token | Valor | Uso |
| --- | --- | --- |
| `--arena` | `#F3E8D6` | Fondo general |
| `--papel` | `#FFFBF3` | Tarjetas y postales |
| `--oceano` | `#1F4E79` | Títulos, botones principales |
| `--ola` | `#3E78A8` | Franjas y acentos fríos |
| `--coral` | `#B4452F` | Botones de acción, etiquetas |
| `--sol` | `#F2C14E` | Destellos, selección |
| `--cielo` | `#CFE2EE` | Cielos |
| `--tinta` | `#2B2622` | Texto y bordes pixel |
| `--gris-calido` | `#5B4F45` | Texto secundario |
| `--rojo-pe` | `#D91023` | Perú |
| `--azul-cl` | `#0039A6` | Chile |
| `--rojo-cl` | `#D52B1E` | Chile |

Tipografías (Google Fonts): **Fraunces** (títulos), **Karla** (texto), **Pixelify Sans** (etiquetas pixel), **Caveat** (texto escrito a mano en fotos y recuerdos).

## 4. La home (de arriba a abajo)

| # | Bloque | Qué se ve | Puerta escondida |
| --- | --- | --- | --- |
| 1 | Postal de bienvenida | Título, subtítulo y escena de playa con los dos personajes | Tocar a cada uno: dice una frase (3 por personaje, en rotación) |
| 2 | La barra | **Pisco del día**: un prompt diario para escribir o dibujar, y una línea de cada personaje. Sin botones extra | Tocar la copa abre **Conversa en la barra** (chat IA) |
| 3 | ¿Sabías que…? | Dato con fuente; flechas para cambiar | En datos de geografía aparece un caminito pixel: tocarlo despliega el **runner** dentro de la postal |
| 4 | El malecón | Ilustración horizontal (en celular se desliza): casita, edificio, quiosco, buzón, faro | Casita → Taller · Edificio → Depa · Quiosco → Recuerdos · Buzón → Libro de firmas · Faro → Redes |
| 5 | Radio del muelle | Portada de la playlist con dial | El dial abre la Radio (playlist con recuerdos + sugerir) |
| 6 | Postal cita | Frase del club | Tocar la estampilla la vuelve postal descargable |
| 7 | Llegado por correo | Publicaciones con el hashtag | — |
| 8 | Pie | Crédito de proyecto fan | — |

**Pistas suaves:** los objetos tocables se mueven un poco y muestran un destello pixel. En celular, el primer toque muestra el nombre y el segundo abre.

## 5. Módulos

### 5.1 La barra y el chat con IA
- La home muestra un pisco del día (prompt rotado por fecha desde `data/prompts.json`).
- **Conversa en la barra:** tú eres el tercer cliente; responden los dos (a veces entre ellos), cada respuesta trae una **emoción** que cambia la cara del personaje, hay un medidor de química y cartas de tema. Límite: 20 mensajes por persona al día. Al cerrar: resumen, química final y un prompt, que se puede volver **tarjeta** (imagen 9:16 descargable).

### 5.2 Runner: Ruta del desierto
Manuel corre por Atacama hacia el norte para llegar a Miguel. Tocar = saltar, mantener = salto largo. Limones (10 = un corazón), letreros con trivia (acierto = escudo, fallo = −50 m), récord local. Final feliz con beso pixel y postal descargable; game over con llamada de Miguel.

### 5.3 La casita
- **Taller:** pestañas Tu Perú, Tu Chile y Fondos. Por personaje: **5 caras** (con calco suave de la cara normal) y **3 conjuntos** de ropa (capas transparentes sobre el calco). Fondos propios: 4 espacios, plantillas de inicio (playa, cocina, cielo, en blanco).
- **Estudio de fotos:** eliges un fondo tuyo, colocas a tus OCs, eliges la cara de cada uno, los volteas, mueves, escalas y giras con los dedos, y tomas la foto.
- **Foto con texto:** polaroid con texto escrito debajo (fuente a mano), opción de fecha y marca del club, descargar PNG o mandar al buzón.

### 5.4 El depa
- **Entrada:** llegan tus OCs (o los balls); eliges cuarto: Sala, Cocina, Portal o Afuera, más los botones **Acción** y **Modo editor**.
- **Sala:** la radio pone marinera (bailan con pañuelo) o reguetón (saltan); la tele dispara la escena del partido: se pelean, se piden perdón y terminan con un besito.
- **Cocina:** refri con 3 espacios y alacena con 3 espacios; la comida la dibuja la persona (los espacios vacíos abren un lienzo). Tocas una comida y luego a quién dársela; cada uno reacciona a su manera y sube su barra de panza.
- **Afuera:** árbol, banca, calle; tocar a los personajes avanza un mini diálogo.
- **Portal:** abre la cámara (`getUserMedia`) y pone a tus OCs encima como stickers que se mueven, escalan, giran, voltean y cambian de cara; la foto va a la polaroid.
- **Modo editor:** en Sala, Cocina y Afuera, tocar cualquier objeto muestra su **tamaño ideal en píxeles** y permite subir una imagen que lo reemplaza (guardada en IndexedDB), o restaurar el original.
- **Acción:** creador de animaciones por fotogramas (ver `docs/ANIMACION.md`).
- **Escenas secretas:** se desbloquean visitando el depa varios días (5 escenas).

### 5.5 Quiosco de recuerdos (descargables, todo en canvas)
Carnet de socio (con tu OC o ball, n.º de socio y equipo), postal con mensaje, wallpapers de celular, stickers de caras, lineart para colorear y calendario de prompts.

### 5.6 Buzón y galería
Lienzo rápido con firma y mensaje. Llega a Rurú; solo se publica en la galería si ella lo aprueba.

### 5.7 Radio del muelle
- **Playlist:** reproductor de Spotify y lista de canciones; debajo de cada una, los **recuerdos** que la gente mandó ("me recuerda a…"), varios por canción.
- **Sugerir:** canción, artista, link opcional, qué te recuerda y firma.
- **Panel de Rurú (`admin.html`):** sugerencias recibidas; "Añadida a la playlist" (ella la agrega en Spotify) o "Publicar como recuerdo" si la canción ya está; "Descartar".

### 5.8 El faro
Enlaces a Discord, Instagram, X, TikTok, Webtoon y Drive, más publicaciones con el hashtag (en la v1 curadas a mano en `data/redes.json`; el feed automático queda para después si la API lo permite).

### 5.9 Bienvenida (primera visita)
Los dos saludan, eliges si te sientas del lado de Perú, de Chile o de los dos (se usa en el carnet), y entras al club.

## 6. Celular

Diseño a 390 px; malecón con scroll horizontal y snap; juegos y editores a pantalla completa con botón de cerrar grande; Pointer Events para todo gesto; nada por hover; lazy load de Spotify e imágenes; `prefers-reduced-motion`; instalable como PWA en la última fase.

## 7. Arquitectura

```
Celular / compu
├── Página estática en GitHub Pages (HTML, CSS, JS, data/*.json)
├── localStorage  → récords, progreso, ajustes, equipo
└── IndexedDB     → caras, ropa, fondos, comidas, imágenes del editor, animaciones

Sale a internet solo cuando la persona lo pide:
├── Cloudflare Worker → API de IA (chat de la barra)
├── Supabase          → buzón de dibujos, sugerencias de canciones, recuerdos
└── Spotify (iframe)  → la playlist
```

Detalles en `docs/DATOS.md`.
