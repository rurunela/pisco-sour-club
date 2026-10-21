# Contenido editable por Rurú

Regla: **ningún texto que lea la gente va escrito dentro de `js/`.** Todo sale de `data/`. Rurú tiene que poder cambiar un título, agregar una frase o un prompt editando solo un JSON (incluso desde la web de GitHub, con el lápiz ✎), y la web debe adaptarse sola.

## 1. Dos tipos de archivo

| Tipo | Archivo | Para qué |
| --- | --- | --- |
| **Textos de la interfaz** | `data/textos.json` | Títulos, subtítulos, botones, ayudas, mensajes de error, etiquetas de postales, descripciones del malecón, textos de "Próximamente", pie de página, nombres de rutas |
| **Listas de contenido** | `prompts.json`, `datos.json`, `citas.json`, `frases.json`, `trivia.json`, `comidas.json`, `cartas-tema.json`, `redes.json`, `personajes.json` | Cosas que crecen: más frases, más prompts, más datos, más preguntas |

## 2. `data/textos.json`

- Organizado **por pantalla**, con claves cortas en español: `textos.home.barra.titulo`, `textos.faro.titulo`, `textos.comun.volver`.
- Se carga una vez al arrancar (`js/textos.js`) y se usa con una función `t('home.barra.titulo')`.
- **Variables** entre llaves: `"Pisco del día · n.º {numero} · {tipo}"` → `t('home.barra.etiqueta', { numero: 3, tipo: 'dibujo' })`.
- **Saltos de línea** con `\n` en el JSON (se muestran como salto real con `white-space: pre-line`).
- **Énfasis simple** permitido solo con `*cursiva*` y `**negrita**` (el código lo convierte con un mini parser seguro; nada de HTML en los JSON).
- Si falta una clave, la web muestra la clave entre corchetes (`[home.barra.titulo]`) y escribe un aviso en la consola, **nunca se rompe**.
- Los textos que van dentro de imágenes descargables (postal, carnet, tarjeta) también salen de aquí (`textos.descargas.*`).

## 3. Listas que crecen

- El código **nunca** asume cuántos elementos hay: rota, elige al azar o pagina según el largo real de la lista. Agregar una frase = agregar una línea.
- Cada elemento lleva `id` único (`p25`, `d08`…) para que el "visto" y el "del día" no se desordenen al agregar nuevos al final.
- Las frases de los personajes van siempre como lista, aunque hoy haya una sola, para poder agregar más:
  - `frases.hero.manuel` / `frases.hero.miguel`: lista que rota al tocarlos.
  - `frases.barra`: lista de pares `{manuel, miguel}`, uno por día.
  - `frases.afuera`, `frases.sala.*`, `frases.runner.*`: listas; si hay varias, se elige una al azar cada vez.
- Campo opcional `"activo": false` en cualquier elemento para esconderlo sin borrarlo.

## 4. Que un error no rompa la web

1. **GitHub Action `validar-datos.yml`**: en cada push revisa que todos los `data/*.json` sean JSON válido, que no haya `id` repetidos y que `textos.json` tenga todas las claves que usa el código (lista en `data/esquema-textos.json`, generada por Claude Code). Si algo falla, el commit sale con ✗ rojo y el mensaje dice el archivo y la línea.
2. En el navegador: si un JSON no carga, la pantalla muestra una postal "Se nos cayó una postal, vuelve en un ratito" en vez de quedar en blanco, y usa los textos de respaldo de `js/textos-respaldo.js` (copia mínima de `comun.*`).

## 5. Guía para Rurú

`data/LEEME.md` explica, con ejemplos para copiar y pegar, cómo agregar una frase, un prompt, un dato curioso, una pregunta de trivia o una comida, y cómo cambiar un título. Mantenerla al día cada vez que se agrega un archivo o una sección nueva.

## 6. Cómo está hecho (para Claude Code)

- `js/textos.js`: `t(clave, vars)` devuelve HTML seguro (escapa todo, luego `**…**` → `<strong>`, `*…*` → `<em>`, `\n` → `<br>`). `tp(clave, vars)` devuelve texto plano sin marcas (para `aria-label`, `title` de la pestaña y canvas). `formato(texto)` y `plano(texto)` hacen lo mismo con textos de las listas.
- `js/datos.js`: `activos(lista)` quita los `"activo": false`; `delDia`, `alAzar` ya lo usan.
- `data/esquema-textos.json` se regenera con `node .github/scripts/generar-esquema.mjs`: busca en `js/` toda cadena que sea una clave de textos (empieza por una sección conocida, por ejemplo `'home.barra.titulo'`). Por eso las claves se escriben siempre **completas y literales** en el código, nunca armadas con `+` o plantillas.
