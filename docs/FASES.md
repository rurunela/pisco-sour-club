# Fases de construcción

Cada fase deja algo publicable en GitHub Pages. No pases a la siguiente sin que todos sus criterios "Validar que…" se cumplan en 390×844 y 360×740 (emulador o celular real) y en un navegador de escritorio.

---

## Fase 1 · Base y home

**Construir:** estructura de carpetas, `tokens.css`, router por hash, `almacen.js` (solo localStorage), countryballs pixel con 5 caras (`personajes.js`, sin OCs todavía), Bienvenida, Home completa (hero, barra con pisco del día, ¿Sabías que…? sin runner, malecón con tarjetas de destino, radio estática, cita, llegado por correo, pie), El faro. Las demás pantallas se crean como "Próximamente" con su ‹ Volver.

- Validar que la primera visita muestra la Bienvenida y las siguientes van directo a la home.
- Validar que la elección de equipo se guarda en `psc.equipo`.
- Validar que el pisco del día y la cita cambian al cambiar la fecha del sistema y son iguales durante todo el día.
- Validar que tocar a Manuel y a Miguel en el hero muestra sus 3 frases en rotación.
- Validar que las flechas del ¿Sabías que…? recorren todos los datos y muestran su fuente.
- Validar que el malecón se desliza en horizontal en celular y que cada objeto muestra su tarjeta y lleva a su pantalla.
- Validar que la copa de la barra lleva a `#/barra`.
- Validar que no hay scroll horizontal de la página en 360 px.
- Validar que todos los botones miden al menos 44×44 px y se pueden usar con teclado.
- Validar que con `prefers-reduced-motion` no hay rebotes.
- Validar que los countryballs se dibujan nítidos (sin suavizado) en pantallas de alta densidad.

## Fase 2 · La casita: taller

**Construir:** `lienzo.js` (Pointer Events, pincel con 3 grosores, borrador, deshacer/rehacer 20 pasos, paleta, calco), IndexedDB en `almacen.js`, Taller (Perú/Chile/Fondos, 5 caras, 3 conjuntos, 4 fondos con plantillas), OCs guardados, reemplazo de balls por OCs en toda la web (`personajes.js`), "Usar el ball original".

- Validar que se puede dibujar con el dedo sin que la página se desplace.
- Validar que deshacer y rehacer funcionan hasta 20 pasos.
- Validar que cada una de las 5 caras y los 3 conjuntos se guarda y se recupera tras cerrar el navegador.
- Validar que la tira de caras marca LISTA o FALTA correctamente.
- Validar que el calco de la cara normal aparece al dibujar otra cara y no sale en la imagen guardada.
- Validar que, al guardar un OC, la home, el malecón y la barra lo muestran en lugar del ball.
- Validar que "Usar el ball original" vuelve a mostrar el ball sin borrar el dibujo.
- Validar que si falta una cara se usa la cara normal.
- Validar que los fondos se guardan en 1080×1350.

## Fase 3 · Fotos

**Construir:** `escenario.js` (stickers: mover, pellizcar para escalar, girar con dos dedos o con el punto, voltear, botones de respaldo), Estudio de fotos, Foto con texto, `exportar.js` (PNG).

- Validar que se puede mover, escalar (0,5–1,5) y girar cada personaje con los dedos.
- Validar que los botones Voltear, −, +, ↺ y ↻ hacen lo mismo que los gestos.
- Validar que cambiar la cara afecta solo al personaje seleccionado.
- Validar que el texto escrito aparece en la polaroid mientras se escribe y no pasa de 60 caracteres.
- Validar que la foto descargada es PNG de 1080×1350 e incluye fondo, personajes, texto y, si se marcó, fecha y marca.
- Validar que la descarga funciona en Safari de iPhone y en Chrome de Android.

## Fase 4 · El depa

**Construir:** Entrada, Sala (radio con marinera/reguetón y secuencia de la tele), Cocina (6 espacios, dibujar comida, alimentar, panza que baja con el tiempo), Afuera, Modo editor (subir imagen por objeto, tamaño ideal, restaurar), Escenas secretas.

- Validar que la entrada muestra los OCs guardados (o los balls).
- Validar que la radio permite elegir marinera, reguetón o apagar, y que cada música tiene su baile.
- Validar que la tele reproduce pelea → perdón → besito en ese orden y que se puede repetir.
- Validar que un espacio vacío de la refri o alacena abre el lienzo y la comida dibujada queda guardada con su nombre.
- Validar que tocar una comida y luego a un personaje muestra su reacción y sube su panza.
- Validar que la panza baja con el tiempo real y nunca es menor que 0.
- Validar que el modo editor muestra el tamaño ideal correcto de cada objeto según la tabla de `docs/DATOS.md` §2.6.
- Validar que una imagen subida reemplaza el objeto en el cuarto y persiste tras recargar.
- Validar que "Restaurar original" vuelve al objeto por defecto.
- Validar que una imagen de 12 MB se reduce y se guarda sin colgar la página.
- Validar que las escenas secretas se desbloquean según los días visitados.

## Fase 5 · Acción

**Construir:** motor de `docs/ANIMACION.md` (geometría de cuartos, traslados con saltos, acciones, globos, render por tiempo), editor de fotogramas, guardar/abrir animaciones, exportar video.

- Validar que un personaje que va del piso al sillón camina y salta encima.
- Validar que un personaje que cruza el sillón de lado a lado salta por encima.
- Validar que cada acción (saltar, bailar, girar 360°, abrazo, beso, pegarse) se ve como se describe.
- Validar que abrazo y beso se aplican a los dos personajes y los juntan solos.
- Validar que el globo de cada fotograma aparece sobre el personaje correcto y no se tapa con el otro.
- Validar que la animación dura lo mismo en un celular lento y en uno rápido.
- Validar que se puede añadir, duplicar, mover, cambiar la duración y borrar fotogramas.
- Validar que las imágenes del modo editor aparecen en el escenario de Acción.
- Validar que la animación guardada se puede abrir después de cerrar el navegador.
- Validar que "Descargar video" genera un archivo reproducible (mp4 en Safari, webm en Chrome).

## Fase 6 · Portal

**Construir:** cámara con `getUserMedia` (trasera, cambiar a frontal), stickers encima, añadir personaje o comida, foto → Foto con texto.

- Validar que se pide permiso de cámara y que, si se niega, aparece la opción de usar una foto de la galería.
- Validar que se puede cambiar entre cámara trasera y frontal.
- Validar que la foto compuesta incluye la imagen de la cámara y los stickers en su posición, escala y giro.
- Validar que ninguna imagen se envía a internet (revisar la pestaña de red).
- Validar que la cámara se apaga al salir del portal.

## Fase 7 · Runner

**Construir:** juego en canvas, obstáculos, limones, corazones, escudos, letreros con trivia, final, game over, récord.

- Validar que tocar salta y mantener hace salto largo.
- Validar que el juego se pausa al abrir la trivia y al cambiar de pestaña.
- Validar que acertar da escudo y fallar resta 50 m sin terminar la partida.
- Validar que a los 1.200 m aparece el final y sin corazones aparece el game over.
- Validar que el récord se guarda y se muestra en el inicio.
- Validar que corre a 60 fps en un celular de gama media.
- Validar que el caminito del ¿Sabías que…? despliega la vista previa y lleva al inicio del runner.

## Fase 8 · Quiosco de recuerdos

**Construir:** carnet, postal con mensaje, wallpapers (1080×2340), stickers (ZIP de PNG), lineart, calendario, tarjeta de prompt 9:16.

- Validar que el carnet usa el nombre escrito, el equipo elegido y el OC o el ball.
- Validar que el n.º de socio se mantiene igual entre visitas.
- Validar que cada descargable se baja con el tamaño indicado y se ve nítido.

## Fase 9 · Supabase: buzón, galería, radio y panel

**Construir:** tablas y políticas de `docs/DATOS.md` §3, Buzón, Galería, Radio (playlist con recuerdos, sugerir), `admin.html` con enlace mágico.

- Validar que un dibujo enviado queda pendiente y no aparece en la galería hasta aprobarlo.
- Validar que alguien sin sesión no puede leer sugerencias ni dibujos pendientes (probar con la API directamente).
- Validar que solo el correo de Rurú puede entrar al panel.
- Validar que aceptar una sugerencia de una canción nueva crea la canción y su recuerdo.
- Validar que aceptar una sugerencia de una canción existente agrega el recuerdo debajo de ella.
- Validar que debajo de cada canción se ven máximo 2 recuerdos y "Ver N recuerdos más".
- Validar que los límites de envío por día funcionan y que el honeypot descarta bots.
- Validar que las claves de `js/config.js` son solo las públicas (anon).

## Fase 10 · Chat con IA

**Construir:** Worker (`docs/DATOS.md` §4), pantalla de chat, cierre del día, tarjeta.

- Validar que responden los dos personajes con su forma de hablar (`data/personajes.json`).
- Validar que la cara de cada mensaje corresponde a la emoción devuelta.
- Validar que al llegar a 20 mensajes se va al cierre y el Worker devuelve 429 en el mensaje 21.
- Validar que temas sensibles (guerra, tratados, política, +18) se desvían en personaje.
- Validar que la API key no aparece en ningún archivo del sitio ni en las peticiones del navegador.
- Validar que si el Worker falla aparece "La barra está cerrada un ratito".

## Fase 11 · Pulido

**Construir:** `manifest.json` y service worker (instalable, caché de la app), revisión de accesibilidad y rendimiento, textos finales.

- Validar que la web se puede instalar en la pantalla de inicio.
- Validar que Lighthouse móvil da al menos 90 en rendimiento y accesibilidad.
- Validar que la web abre sin conexión (excepto chat, buzón, radio y redes).
- Validar que todos los marcadores de `PENDIENTES.md` están resueltos o señalados.
