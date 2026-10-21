# Pendientes de Rurú

Datos que faltan. Mientras no estén, el código usa el marcador indicado.

| Qué | Dónde va | Marcador |
| --- | --- | --- |
| Hashtag del fandom (IG y X) | `data/redes.json` | `[#TU_HASHTAG]` |
| Nombre y link de la playlist de Spotify | `data/redes.json` | `[Nombre de tu playlist]`, `[LINK_DE_LA_PLAYLIST]` |
| Links de Discord, Instagram, X, TikTok, Webtoon, Drive | `data/redes.json` | `[LINK]` |
| Publicaciones para "Llegado por correo" y el faro | `data/redes.json` | `[@usuario]` |
| Fuentes de los ¿Sabías que…? (verificar cada dato) | `data/datos.json` | `[VERIFICAR Y AÑADIR FUENTE]` |
| Más prompts (meta: 60) y citas propias | `data/prompts.json`, `data/citas.json` | — |
| Pistas de música libres de derechos (marinera, reguetón) | `assets/audio/` | archivos vacíos |
| Correo de admin para el panel | SQL de `docs/DATOS.md` §3 | `[CORREO_DE_RURU]` |
| Proyecto de Supabase (URL y anon key) | `js/config.js` | `[SUPABASE_URL]`, `[SUPABASE_ANON_KEY]` |
| Cuenta de Cloudflare y proveedor de IA (Gemini gratis o de pago) | `worker/`, `js/config.js` | `[WORKER_URL]` |
| Nombre del repositorio en GitHub (`rurunela/…`) | GitHub Pages | — |

Notas:
- La ficha de Perú pide consultar a su creadora (Kuraudia) antes de cualquier uso pagado. La web y los descargables son gratis.
- Mientras un enlace de `data/redes.json` sea un marcador (no empieza con `http`), la web lo muestra como "pendiente" y no lo enlaza.

## Decisiones de la fase 2

- El lienzo (`js/lienzo.js`) guarda los trazos como vectores: se ve nítido en cualquier pantalla y se exporta a la resolución final (512×512 caras y ropa, 1080×1350 fondos). Se pueden deshacer los últimos 20 trazos; los anteriores quedan fijos.
- "Borrar todo" también se puede deshacer.
- Los 4 espacios de fondos empiezan vacíos (en blanco); las plantillas Playa, Cocina, Cielo y En blanco reemplazan el lienzo y se pueden deshacer.
- La pantalla "Tus OCs ya viven en el club" aparece solo la primera vez que se guarda una cara o un conjunto (`psc.ocListo`). Guardar un dibujo vuelve a activar el OC si se había elegido "Usar el ball original".
- Un OC se muestra cuando existe su cara **normal**; si falta otra cara, se usa la normal.
- Si hay trazos sin guardar, el diálogo propio (`js/dialogo.js`: Guardar / Descartar / Seguir dibujando) salta al cambiar de cara, conjunto o fondo y al salir del taller por ‹ Volver, el botón atrás o cualquier enlace (guardia del router). Al cerrar o recargar la pestaña pregunta el navegador (`beforeunload`). Si se guarda desde el diálogo, no se muestra la pantalla de celebración.
- "Sin guardar" significa distinto del último guardado: si se deshace hasta ese punto, ya no pregunta.
- Al guardar se pide `navigator.storage.persist()`. Si el navegador no lo concede, el taller recomienda guardar una copia.
- Copia de seguridad: archivo `.psc` (JSON con las imágenes en base64 y la preferencia OC/ball). Recuperar una copia reemplaza los dibujos con el mismo nombre y deja los demás.
- **Pendiente para la fase 4:** los conjuntos de ejemplo (2 = bufanda, 3 = gorro) de `docs/DATOS.md` §2.5 todavía no se dibujan cuando la persona no hizo su propia ropa.

## Decisiones de la fase 1

- Las frases de `data/frases.json` ahora son siempre listas (`bienvenida`, `sala.*`, `runner.*`; `afuera` y `sala.tele` son listas de escenas), como pide `docs/CONTENIDO.md`.
- En celular el malecón conserva su tamaño de 1000×320 px y se desliza; desde 768 px se escala entero al ancho.
- Las caras de los countryballs se generan por código en una cuadrícula 20×20 (`js/personajes.js`) y se muestran como imagen con `image-rendering: pixelated`.
- Los enlaces del menú de la home (La barra · Dato · Malecón · Redes) son botones que desplazan la página, porque el `#` lo usa el router. También se puede entrar a una sección con `#/?ir=malecon`.
