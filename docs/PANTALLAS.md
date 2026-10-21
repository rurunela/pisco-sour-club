# Pantallas

El prototipo tiene 28 tableros: 27 pantallas (la home tiene versión de escritorio y de celular) más el mapa del prototipo. Cada pantalla indica su **ruta**, el **archivo de referencia** en `prototipo/`, qué contiene, cómo se interactúa y a dónde lleva.

Convenciones comunes:

- Toda pantalla de celular mide 390×844 en el diseño, pero debe adaptarse de 360 a 430 px de ancho y a alturas desde 640 px (scroll si no entra).
- Botón **‹ Volver** arriba a la izquierda (44 px mínimo) que regresa a la pantalla madre indicada.
- Donde aparece un personaje, se usa el **OC** de la persona si existe; si no, el **countryball**. Ambos con la cara pedida.
- Textos entre corchetes son datos pendientes (`PENDIENTES.md`).

---

## Mapa de navegación

```
Bienvenida ─► Home
Home ├─ Barra (copa) ─► Chat ─► Cierre del día ─► Tarjeta
     ├─ ¿Sabías que…? (caminito) ─► Runner inicio ─► Runner ─► Final | Game over
     ├─ Malecón
     │   ├─ Casita ─► Taller ─► OCs guardados ─► Estudio de fotos ─► Foto con texto
     │   ├─ Edificio ─► Depa ─► Sala | Cocina | Afuera | Portal ─► Foto con texto
     │   │                  ├─ Modo editor
     │   │                  ├─ Acción
     │   │                  └─ Escenas secretas
     │   ├─ Quiosco ─► Recuerdos (descargables)
     │   ├─ Buzón ─► Galería
     │   └─ Faro ─► Redes
     └─ Radio (dial) ─► Playlist | Sugerir      (admin.html ─► Panel de Rurú)
```

---

## 1. Bienvenida — `#/bienvenida`
Ref: `prototipo/Bienvenida.dc.html`

- Solo en la primera visita (`localStorage.psc.visto`); después se entra directo a la home.
- Postal con los dos personajes saludando ("…Hola. Pasa, nomás." / "¡Bienvenid@, causa! ¿Ya comiste?").
- Selector **Perú / Chile / Los dos** (guarda `psc.equipo`; se usa en el carnet).
- Botón **Entrar al club** → Home.

## 2. Home — `#/`
Ref: `prototipo/Home2.dc.html` (escritorio) y `prototipo/HomeMovil.dc.html` (celular)

- **Nav:** La barra · Dato · Malecón · Redes (anclas).
- **Hero:** título "Pisco Sour Club", subtítulo, postal girada con playa (cielo, sol, mar pixel, arena) y los dos personajes con manos sosteniendo una copa. Tocar a Manuel o a Miguel muestra un globo; cada toque pasa a la siguiente frase (3 por personaje, en `data/frases.json`).
- **La barra (postal n.º 1):** estampilla PE×CL, "Pisco del día" (prompt elegido por fecha: `prompts[díasDesdeEpoch % total]`), una línea de Manuel y otra de Miguel (`data/frases.json` → `barra`, rotadas por fecha). La copa pixel es un enlace → Chat. Pie: "Mañana se sirve otro ✦". **Sin** botones de mood, otro pisco, copiar ni vitrina.
- **¿Sabías que…? (postal n.º 2):** dato con fuente y contador "1 / N", flechas ‹ ›. Si el dato tiene `geo: true`, aparece al pie un caminito pixel (botón). Al tocarlo, la postal se despliega con un mini escenario del runner y un enlace "Pantalla completa →" → Runner inicio.
- **El malecón:** ilustración de 1000 px de ancho (en celular, scroll horizontal con snap por objeto). Objetos-botón: casita, edificio (con los dos personajes en una ventana), quiosco con toldo, buzón, faro. Al tocar uno, abajo aparece una tarjeta con nombre, descripción y **Entrar →**.
- **Radio del muelle (postal n.º 3):** dial (enlace → Radio), nombre de la playlist, "Abrir en Spotify".
- **Cita (postal n.º 4):** frase del día (`data/citas.json`) en Fraunces itálica. La estampilla es un botón que genera la postal descargable (PNG).
- **Llegado por correo:** 3 publicaciones de `data/redes.json` como polaroids giradas, más los botones de redes.
- **Pie:** "Pisco Sour Club es un proyecto fan hecho por Rurú. Personajes de Latin Hetalia; no es la cuenta oficial del fandom."

## 3. Conversa en la barra — `#/barra`
Ref: `prototipo/Chat.dc.html`

- Cabecera azul: ‹ Volver, contador "12/20 · Cerrar la barra" (enlace → Cierre), los dos personajes, "La barra", medidor de **química** (8 segmentos).
- Mensajes: los tuyos a la derecha (azul); los de Miguel y Manuel a la izquierda con su cara pequeña y la etiqueta de emoción. Notas de sistema centradas (por ejemplo, "Miguel se dio la vuelta (ley del hielo)").
- Mientras responde: "Miguel está escribiendo…".
- **Cartas de tema** (scroll horizontal, borde punteado): rellenan el campo de texto. Ver `data/cartas-tema.json`.
- Campo de texto + botón enviar.
- Al llegar a 20 mensajes en el día → Cierre.
- Contrato con el Worker en `docs/DATOS.md` §4.

## 4. Cierre del día — `#/barra/cierre`
Ref: `prototipo/ChatFin.dc.html`

- "20 DE 20 MENSAJES · LA BARRA CERRÓ", "Vuelve mañana, que te guardamos sitio".
- Resumen de lo que pasó (lo genera la IA), química final, prompt generado.
- **Hacer tarjeta** → Tarjeta · **Volver al club** → Home.

## 5. Tarjeta de prompt — `#/tarjeta`
Ref: `prototipo/Tarjeta.dc.html`

- Vista previa 9:16 (postal con número, tipo, prompt, escena con los personajes, hashtag).
- **Descargar PNG** (1080×1920) · **Copiar texto** · **Al club**.

## 6. Runner · inicio — `#/runner`
Ref: `prototipo/RunnerInicio.dc.html`

- Escena de desierto con Manuel; tarjeta con historia, 3 reglas numeradas, récord y **▶ Empezar** → Runner.

## 7. Runner · jugando — `#/runner/jugar`
Ref: `prototipo/Runner.dc.html`

- Canvas a pantalla completa. HUD: salir ✕, corazones, metros, limones, escudos, "Atacama → Lima", récord.
- Tocar en cualquier parte = saltar; mantener = salto largo. Zona inferior "Toca para saltar".
- Obstáculos: cactus, llama con lentes, tumbleweeds y olas en el tramo costero. Recolectables: limones.
- Cada ~400 m, un letrero "?" abre la trivia (`data/trivia.json`): 3 opciones; acierto = escudo, fallo = −50 m (nunca mata). El juego se pausa mientras está abierta.
- Meta: 1.200 m → Final. Sin corazones → Game over.
- Dificultad: la velocidad sube cada 300 m; tope razonable para celular.

## 8. Runner · final — `#/runner/final`
Ref: `prototipo/RunnerFin.dc.html`

- Atardecer en un mirador, los dos juntos con corazón pixel y fuegos artificiales.
- Estadísticas, prompt ("dibuja lo que se dijeron justo antes del beso"), **Descargar postal**, **Otra vez**, **Al club**.

## 9. Runner · game over — `#/runner/perdiste`
Ref: `prototipo/RunnerGameOver.dc.html`

- Desierto de noche, Manuel caído; Miguel llama: "¿Ya vienes? Se enfría la comida… ya fue, la recaliento." **Reintentar** · **Volver al club**.

## 10. Taller — `#/casita/taller`
Ref: `prototipo/Taller.dc.html`

- Techo de casita; ‹ Malecón, **Fotos →**.
- Pestañas: **Tu Perú · Tu Chile · Fondos**.
- Personaje → selector **Caras (5) · Ropa (3)**:
  - **Caras:** tira con normal, feliz, enojado, sonrojo, triste; cada una muestra LISTA o FALTA. Lienzo 512×512 con **calco** al 18 % de la cara normal (o silueta base si aún no existe).
  - **Ropa:** Conjunto 1, 2, 3. Lienzo con calco de la cara normal; se dibuja solo la ropa (capa transparente).
- Fondos: 4 espacios (2 ejemplos + vacíos), lienzo 1080×1350 (4:5), plantillas: playa, cocina, cielo, en blanco.
- Herramientas: pincel (3 grosores), borrador, deshacer/rehacer (20 pasos), paleta (rojo Perú, azul Chile, blanco, piel, negro, más selector libre).
- **Guardar** → IndexedDB → OCs guardados (la primera vez) o se queda en el taller.
- Nota: "Todo se guarda solo en este celular".

## 11. OCs guardados — `#/casita/listo`
Ref: `prototipo/TallerListo.dc.html`

- "Tus OCs ya viven en el club" con vista previa de la portada usando sus dibujos.
- **Ver en el club** · **Volver a dibujar** · **Mandar al buzón** · "Usar el ball original" (en el taller).

## 12. Estudio de fotos — `#/casita/fotos`
Ref: `prototipo/CasitaFoto.dc.html`

- Barra de caras del personaje seleccionado (5 botones con miniatura).
- Escenario 4:5 con el fondo elegido; personajes como stickers (ver `js/escenario.js`):
  - tocar = seleccionar (marco punteado coral con 4 esquinas y un punto de giro);
  - arrastrar = mover; pellizcar = escalar (0,5–1,5); punto de giro o dos dedos = girar;
  - botones de respaldo: Voltear, −, +, ↺, ↻.
- Fila de fondos propios + "+" (→ Taller, pestaña Fondos).
- Obturador → Foto con texto (la composición se pasa como imagen).

## 13. Foto con texto — `#/foto`
Ref: `prototipo/Polaroid.dc.html`

- Polaroid con la foto y texto en Caveat que se actualiza mientras escribes (máx. 60 caracteres).
- Casilla "Poner la fecha y «Pisco Sour Club» en la esquina".
- **Descargar foto** (PNG 1080×1350 con marco) · **Mandar al buzón** · **Al club**. Vuelve a la pantalla de origen (estudio o portal).

## 14. El depa · entrada — `#/depa`
Ref: `prototipo/Depa.dc.html`

- "Tus OCs llegaron a casa" con los dos personajes.
- Tarjetas ilustradas: **Sala**, **Cocina**, **Portal**, **Afuera**.
- Botones **▶ Acción** y **✎ Modo editor**. Enlace "Escenas secretas (n/5)".

## 15. Sala — `#/depa/sala`
Ref: `prototipo/DepaSala.dc.html`

- Escena: ventana, sillón, repisa con radio, tele, piso de madera.
- **Radio** (botón) → menú: Marinera · Reguetón · Apagar. Marinera: ambos se mecen con pañuelo, cara feliz, notas flotando. Reguetón: saltan alternados.
- **Tele** (botón) → secuencia automática: (1) partido "PE 1 - 1 CL ¡PENAL!", se pelean (cara enojado, temblor) — "¡Ese penal no fue!" / "¡Claro que fue, ciego!"; (2) a los 2,4 s se piden perdón (triste / sonrojo) — "…Ya. Lo siento." / "Yo también, tonto."; (3) a los 4,8 s se acercan, sonrojo, corazón y "*besito*".
- Abajo: estado, ayuda, nota de música libre, **▶ Acción** y **✎ Editar sala**.
- Si el modo editor cambió algún objeto, se usa la imagen de la persona.

## 16. Cocina — `#/depa/cocina`
Ref: `prototipo/DepaCocina.dc.html`

- **Refri** (3 espacios) y **Alacena** (3 espacios). Cada espacio: dibujo de la comida + nombre, o "+ Dibujar".
- Espacio vacío → modal con lienzo cuadrado (512×512), nombre de la comida, **Guardar** (IndexedDB).
- Mecánica: tocar una comida (se resalta) → los personajes se marcan como destino → tocar a uno: cara feliz, globo con reacción, su barra de **panza** sube.
- Reacciones: si la comida tiene nombre conocido (`data/comidas.json`), usa su frase; si no, frases genéricas por personaje.
- Las barras de panza bajan con el tiempo real (−1 cada 6 h, mínimo 0).

## 17. Afuera — `#/depa/afuera`
Ref: `prototipo/DepaAfuera.dc.html`

- Cielo, edificio de enfrente, árbol, banca, vereda, farol. Manuel con gorro y Miguel con bufanda (conjuntos 3 y 2).
- Tocar a los personajes avanza un mini diálogo de 3 pasos (`data/frases.json` → `afuera`).
- **▶ Acción** · **✎ Editar afuera**.

## 18. Portal (cámara) — `#/depa/portal`
Ref: `prototipo/DepaPortal.dc.html`

- Pide permiso de cámara (`getUserMedia`, cámara trasera por defecto; botón para cambiar). Si se niega o no hay cámara: mensaje claro y opción de usar una foto de la galería.
- Encima del video: personajes como stickers (mismo `escenario.js` que el estudio), barra de caras arriba.
- Pie: Voltear, −, +, ↺, ↻, **+ Añadir** (otro personaje o comida dibujada), obturador.
- Foto: compone video + stickers en canvas → Foto con texto. Aviso: "La foto no sale de tu celular".

## 19. Modo editor — `#/depa/editor`
Ref: `prototipo/DepaEditor.dc.html`

- Pestañas **Sala · Cocina · Afuera**. Cada objeto editable tiene borde punteado y etiqueta.
- Tocar un objeto abre la hoja inferior: "Cambiar: Tele", miniatura, **tamaño ideal** (tabla en `docs/DATOS.md` §2.6), **Subir imagen** (PNG/JPG/WebP), **Restaurar original**.
- La imagen se recorta/ajusta a la proporción del objeto (cover) y se guarda reducida al tamaño ideal ×1 en IndexedDB.
- Lo que se cambia aparece en el cuarto, en Acción y en el portal.

## 20. Acción — `#/depa/accion`
Ref: `prototipo/Accion.dc.html` · motor en `docs/ANIMACION.md`

- Cabecera: ‹ Depa, título, selector de cuarto (Sala · Cocina · Afuera).
- Escenario del cuarto con los personajes; el seleccionado tiene marco coral. Fantasma del fotograma anterior al 25 % y línea punteada con el recorrido.
- Tira de fotogramas (1, 2, 3…), **+** para añadir (duplica el actual sin acción ni globo), **▶ Reproducir / ■ Parar**.
- Elegir personaje (Manuel / Miguel) y moverlo: arrastrarlo en el escenario (flechas ← → de respaldo).
- **Acción en este fotograma:** Caminar · Saltar · Bailar · Girar 360° · Abrazo · Beso · Pegarse.
- **Cara** (5) y **conjunto** (3) por fotograma.
- **Globo:** texto de hasta 40 caracteres por personaje y fotograma.
- **Guardar** (IndexedDB, varias animaciones con nombre) · **Descargar video**.
- Mantener pulsado un fotograma: duplicar, mover o borrar.

## 21. Escenas secretas — `#/depa/secretos`
Ref: `prototipo/DepaSecreto.dc.html`

- 5 escenas ilustradas; se desbloquea una por cada 2 días distintos visitando el depa (contador en `localStorage`).
- Muestra la escena desbloqueada con texto; **Descargar escena**; las bloqueadas se ven como siluetas con candado.
- Escena 1: "La primera once".

## 22. Quiosco de recuerdos — `#/quiosco`
Ref: `prototipo/Kiosco.dc.html`

- Toldo a rayas, "TODO GRATIS". Vista previa grande del ítem elegido; campo "Tu nombre o @".
- Ítems: Carnet de socio · Postal · Wallpaper · Stickers · Lineart · Calendario.
- **Descargar PNG** (o ZIP para stickers).
- Carnet: 1012×638, equipo según la bienvenida, n.º de socio aleatorio de 6 cifras guardado localmente, OC o ball.

## 23. El buzón — `#/buzon`
Ref: `prototipo/Buzon.dc.html`

- Lienzo 1:1, paleta, deshacer, firma (obligatoria, máx. 30), mensaje (opcional, máx. 120), **Echar al buzón**.
- Sube a Supabase (estado `pendiente`). Confirmación: "Le llegó a Rurú. Si le gusta, lo cuelga en la galería".
- Enlace **Ver galería →**. Límite: 3 envíos por día por dispositivo.

## 24. Galería del club — `#/galeria`
Ref: `prototipo/Galeria.dc.html`

- Pared con polaroids giradas (dibujo + @firma), solo los aprobados, paginado de a 12.
- **Dejar el mío** → Buzón.

## 25. El faro — `#/faro`
Ref: `prototipo/Faro.dc.html`

- Faro pixel con haz de luz. Botones grandes: Discord, Instagram, X, TikTok, Webtoon, Drive (`data/redes.json`).
- Rejilla "Lo último con [#TU_HASHTAG]" (curada a mano en la v1).

## 26. Radio del muelle — `#/radio`
Ref: `prototipo/Radio.dc.html`

- Cabecera: radio con dial, nombre de la playlist, "Curada por Rurú · N canciones", botón ▶ (abre o muestra el reproductor de Spotify).
- Pestaña **La playlist:** canciones numeradas; debajo de cada una, sus **recuerdos** (texto en Caveat + @firma), máximo 2 visibles y "Ver N recuerdos más".
- Pestaña **Sugerir:** canción, artista, link (opcional), "¿Qué te recuerda? ¿Por qué la pondrías?", firma → **Mandar a la radio** → confirmación con los dos felices.

## 27. Panel de Rurú — `admin.html`
Ref: `prototipo/RadioPanel.dc.html`

- Acceso con Supabase Auth (enlace mágico al correo de Rurú). Nadie más puede entrar (políticas en `docs/DATOS.md`).
- Pestañas: **Canciones** (sugerencias) y **Dibujos** (buzón).
- Canciones: tarjeta con canción, artista, de @quién, recuerdo, etiqueta NUEVA o YA ESTÁ EN LA PLAYLIST (coincidencia por título y artista). Acciones: **Añadida a la playlist ✓** (crea la canción si no existe y publica el recuerdo) o **Publicar como recuerdo** · **Descartar**. También se puede editar el orden de las canciones.
- Dibujos: aprobar o rechazar.
