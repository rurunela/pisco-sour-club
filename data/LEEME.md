# Cómo editar los textos del Pisco Sour Club

Todo lo que se lee en la web está en esta carpeta. Puedes editar desde tu compu o directo en GitHub: abre el archivo, toca el lápiz ✎, cambia y dale a **Commit changes**. En 1–2 minutos se actualiza la web.

## Reglas para no romper nada

- Cada texto va **entre comillas dobles**: `"así"`.
- Entre elementos de una lista va **una coma**, pero **no** después del último.
- Si quieres comillas dentro de un texto, usa las tipográficas: « » o “ ”.
- Salto de línea dentro de un texto: `\n`.
- Cursiva: `*así*` · Negrita: `**así**`.
- Las palabras entre llaves, como `{numero}` o `{autor}`, las rellena la web: déjalas tal cual (puedes moverlas dentro de la frase).
- Para esconder algo sin borrarlo: agrega `"activo": false`.
- Si te equivocas, en la pestaña **Actions** aparece una ✗ roja que te dice el archivo y la línea.

## Cambiar un título o un botón → `textos.json`

```json
"barra": {
  "titulo": "La barra",
  "intro": "El pisco del día ya está servido. Si quieres quedarte a conversar con ellos, toca la copa."
}
```

Cambia solo lo que está a la derecha de los dos puntos. No cambies los nombres de la izquierda.

Dónde está cada cosa:

| Sección de `textos.json` | Qué tiene |
| --- | --- |
| `comun` | Botón "Volver", pie de página, nombres cortos y los nombres de las 5 caras (`comun.caras`) |
| `errores` | Mensaje cuando algo no carga |
| `rutas` | Nombre de cada pantalla (se ve en la pestaña del navegador y en "Próximamente") |
| `home` | Todo lo de la página principal: `hero`, `barra`, `dato`, `malecon`, `radio`, `cita`, `correo` |
| `bienvenida` | La pantalla de la primera visita |
| `faro` | La pantalla de redes |
| `taller` | La casita: pestañas, nombres de conjuntos y fondos, herramientas, colores, botón de guardar y avisos |
| `listo` | La pantalla "Tus OCs ya viven en el club" |
| `proximamente` | Lo que dicen Manuel y Miguel en las partes que aún no están listas |
| `descargas` | Textos que salen dentro de las imágenes descargables (postal de la cita) |

## Agregar una frase de Manuel o Miguel → `frases.json`

```json
"hero": {
  "manuel": ["…¿Qué miras?", "No estoy sonrojado. Es el frío.", "Tu frase nueva aquí"],
  "miguel": ["¡Hola, causa! ¿Ya comiste?", "Otra frase nueva"]
}
```

Para la barra (una charla por día) o la bienvenida (se elige una al azar), agrega un par:

```json
{"manuel": "Lo que dice Manuel", "miguel": "Lo que responde Miguel"}
```

`afuera` y `sala.tele` son listas de **escenas** (cada escena es una lista de pasos); `sala.marinera`, `sala.regueton`, `runner.gameOver` y `runner.final` son listas de frases. Si hay varias, se elige una al azar.

## Agregar un prompt → `prompts.json`

```json
{"id": "p25", "tipo": "escena", "texto": "Tu prompt aquí."}
```

`tipo` puede ser: `dibujo`, `escena`, `diálogo`, `au`. El `id` tiene que ser nuevo (sigue la numeración).

## Agregar un dato curioso → `datos.json`

```json
{"id": "d08", "geo": false, "texto": "El dato.", "fuente": "Nombre de la fuente", "url": "https://…"}
```

Pon `"geo": true` si es de geografía: así aparece el caminito del runner.

## Agregar una cita → `citas.json`

```json
{"id": "c06", "texto": "Tu frase.", "autor": "Frase del club"}
```

## Agregar una pregunta del runner → `trivia.json`

```json
{"id": "t13", "pregunta": "¿…?", "opciones": ["A", "B", "C"], "correcta": 0, "reaccion": "«Lo que dicen si aciertas.»"}
```

`correcta` es la posición de la respuesta buena: 0 = la primera, 1 = la segunda, 2 = la tercera.

## Agregar una comida conocida → `comidas.json`

```json
{"clave": "anticucho", "nombre": "Anticuchos", "miguel": "Su reacción", "manuel": "Su reacción"}
```

`clave` es lo que alguien escribiría al nombrar su dibujo (en minúsculas).

## Otros archivos

| Archivo | Qué tiene |
| --- | --- |
| `cartas-tema.json` | Cartas para el chat de la barra |
| `redes.json` | Hashtag, playlist, links de redes y publicaciones destacadas. Mientras un link no empiece con `https://`, la web lo muestra como "pendiente" |
| `personajes.json` | Fichas de Miguel y Manuel |
| `chat-system-prompt.md` | Cómo habla la IA del chat (cámbialo con cuidado) |
| `esquema-textos.json` | Lista automática de los textos que usa la web. **No lo edites a mano** |
