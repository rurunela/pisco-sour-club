# Datos, almacenamiento y servicios

## 1. Contenido estático (`data/`)

| Archivo | Contenido |
| --- | --- |
| `prompts.json` | Prompts del pisco del día: `{id, texto, tipo}` (`tipo`: dibujo, escena, diálogo, au) |
| `datos.json` | ¿Sabías que…?: `{id, texto, fuente, url, geo}` — **verificar fuentes antes de publicar** |
| `citas.json` | Citas originales del club: `{id, texto, autor}` |
| `frases.json` | Líneas de los personajes, **siempre como listas** (ver abajo) |
| `trivia.json` | Preguntas del runner: `{id, pregunta, opciones[3], correcta, reaccion}` |
| `comidas.json` | Reacciones a comidas conocidas: `{clave, nombre, miguel, manuel}` |
| `cartas-tema.json` | Cartas del chat: `{etiqueta, texto}` |
| `personajes.json` | Fichas de Miguel y Manuel (para la UI y la IA) |
| `redes.json` | Enlaces y publicaciones curadas (marcadores pendientes) |
| `chat-system-prompt.md` | Instrucciones del chat para el Worker |
| `textos.json` | Todos los textos de la interfaz, por pantalla (ver `docs/CONTENIDO.md`) |
| `esquema-textos.json` | Lista automática de las claves de `textos.json` que usa el código (no se edita a mano) |

Todas las listas aceptan `"activo": false` para esconder un elemento sin borrarlo, y el código nunca asume cuántos hay.

### Forma de `frases.json`

| Clave | Tipo | Uso |
| --- | --- | --- |
| `hero.manuel`, `hero.miguel` | lista de textos | Rotan al tocar a cada uno en la portada |
| `barra` | lista de pares `{manuel, miguel}` | Uno por día (hora de Lima) |
| `bienvenida` | lista de pares `{manuel, miguel}` | Uno al azar en la bienvenida |
| `afuera` | lista de **escenas**; cada escena es una lista de pasos `{habla, texto, caras: {cl, pe}}` | Se elige una escena al azar; tocar avanza un paso |
| `sala.marinera`, `sala.regueton` | lista de pares `{manuel, miguel}` | Uno al azar cuando suena esa música |
| `sala.tele` | lista de **escenas**; cada escena es una lista de pasos `{manuel, miguel, caras: {cl, pe}, efecto?}` | Una al azar al prender la tele (pelea → perdón → besito) |
| `runner.gameOver`, `runner.final` | lista de textos | Uno al azar |

```json
{
  "hero": { "manuel": ["…¿Qué miras?"], "miguel": ["¡Hola, causa! ¿Ya comiste?"] },
  "barra": [{ "manuel": "Ya, ¿qué te sirvo?", "miguel": "¡Uno de la casa!" }],
  "bienvenida": [{ "manuel": "…Hola. Pasa, nomás.", "miguel": "¡Bienvenid@, causa!" }],
  "afuera": [[{ "habla": "manuel", "texto": "Hace frío. Me encanta.", "caras": { "cl": "feliz", "pe": "triste" } }]],
  "sala": {
    "marinera": [{ "manuel": "…Ya, pero yo marco el paso.", "miguel": "¡Pañuelo arriba, causa!" }],
    "regueton": [{ "manuel": "¿Desde cuándo sé bailar esto?", "miguel": "¡Dale, que tú puedes!" }],
    "tele": [[{ "manuel": "¡Ese penal no fue!", "miguel": "¡Claro que fue, ciego!", "caras": { "cl": "enojado", "pe": "enojado" } }]]
  },
  "runner": { "gameOver": ["¿Ya vienes? Se enfría la comida…"], "final": ["Miguel te esperaba con la cena lista"] }
}
```

El pisco del día y la cita del día se eligen con `Math.floor(Date.now() / 86400000) % total` en hora local de Lima (UTC−5), para que todos vean lo mismo el mismo día.

## 2. Almacenamiento local

Todo pasa por `js/almacen.js`. Prefijo de claves: `psc.`.

### 2.1 localStorage (datos pequeños, JSON)

| Clave | Ejemplo | Uso |
| --- | --- | --- |
| `psc.visto` | `true` | Ya pasó por la bienvenida |
| `psc.equipo` | `"pe" \| "cl" \| "ambos"` | Para el carnet |
| `psc.socio` | `"000127"` | N.º de socio |
| `psc.usarOC` | `{"pe": true, "cl": false}` | Si se usan los OCs o los balls |
| `psc.runner` | `{"record": 1240, "partidas": 7}` | Récord |
| `psc.depa` | `{"panza": {"pe": 4, "cl": 6}, "ultimaVisita": "2026-10-20", "diasVisitados": ["2026-10-18", "2026-10-20"]}` | Progreso del depa |
| `psc.chat` | `{"fecha": "2026-10-20", "usados": 12, "quimica": 5}` | Uso diario del chat |
| `psc.buzon` | `{"fecha": "2026-10-20", "envios": 1}` | Límite de envíos |
| `psc.idVisitante` | UUID | Para el límite del chat (no identifica a la persona) |

### 2.2 IndexedDB `psc` (versión 1)

Almacenes (object stores), todos con `keyPath: "id"` y blobs PNG/WebP:

| Store | id | Campos |
| --- | --- | --- |
| `caras` | `"pe:normal"`, `"cl:triste"`… (2 × 5) | `blob` 512×512 PNG transparente, `actualizado` |
| `ropa` | `"pe:1"`… `"cl:3"` (2 × 3) | `blob` 512×512 PNG transparente (solo la ropa), `actualizado` |
| `fondos` | `"f1"`…`"f4"` | `blob` 1080×1350, `nombre` |
| `comidas` | `"refri:0"`…`"alacena:2"` | `blob` 512×512, `nombre` |
| `objetos` | `"sala:tele"`, `"afuera:arbol"`… | `blob` al tamaño ideal |
| `animaciones` | UUID | ver `docs/ANIMACION.md` §1 |

### 2.3 Componer un personaje

`personajes.js` expone `imagenPersonaje({pais: 'pe'|'cl', cara, ropa: 1|2|3})` y devuelve un `ImageBitmap` cacheado:

1. Si `psc.usarOC[pais]` y existe `caras/<pais>:<cara>` → esa imagen; si falta esa cara, usa `normal`.
2. Encima, si existe `ropa/<pais>:<ropa>` → la capa de ropa.
3. Si no hay OC → countryball pixel con esa cara (generado por código, cuadrícula 20×20, escalado con `imageSmoothingEnabled = false`) y manos flotantes solo cuando la escena lo pide.

### 2.4 Las 5 caras (también para los balls)

| Cara | Ojos | Cejas | Boca | Extra |
| --- | --- | --- | --- | --- |
| normal | puntos | — | sonrisa suave | rubor leve |
| feliz | arcos ^ ^ | — | sonrisa abierta | rubor |
| enojado | puntos | inclinadas hacia el centro | boca hacia abajo | sin rubor |
| sonrojo | puntos | — | boca ondulada | rubor fuerte |
| triste | puntos | caídas hacia afuera | boca hacia abajo | lágrima |

En el chat, las emociones de la IA se mapean a estas mismas 5 caras.

### 2.5 Los 3 conjuntos

Conjunto 1 (casual), 2 y 3 son capas libres que dibuja la persona. Si no existen, se usan los de ejemplo: 1 = nada, 2 = bufanda, 3 = gorro con pompón (color del país).

### 2.6 Objetos editables y tamaño ideal

Coordenadas del escenario en unidades de 350×372 (se escalan al ancho real).

| Cuarto | Objeto | Caja (x, y, w, h) | Tamaño ideal |
| --- | --- | --- | --- |
| Sala | Pared | 0, 0, 350, 250 | 1080 × 760 px |
| Sala | Ventana | 130, 24, 90, 76 | 280 × 240 px |
| Sala | Radio | 12, 100, 82, 52 | 240 × 160 px |
| Sala | Tele | 228, 80, 112, 84 | 320 × 240 px |
| Sala | Sillón | 40, 200, 270, 84 | 820 × 260 px |
| Sala | Piso | 0, 290, 350, 82 | 1080 × 250 px |
| Cocina | Pared | 0, 0, 350, 250 | 1080 × 760 px |
| Cocina | Refri | 250, 60, 90, 220 | 270 × 660 px |
| Cocina | Alacena | 20, 24, 150, 70 | 460 × 210 px |
| Cocina | Mesa | 40, 220, 190, 60 | 580 × 180 px |
| Cocina | Piso | 0, 290, 350, 82 | 1080 × 250 px |
| Afuera | Cielo | 0, 0, 350, 200 | 1080 × 600 px |
| Afuera | Edificio de enfrente | 210, 40, 130, 210 | 400 × 640 px |
| Afuera | Árbol | 14, 70, 90, 180 | 280 × 560 px |
| Afuera | Banca | 110, 230, 110, 50 | 340 × 160 px |
| Afuera | Vereda | 0, 290, 350, 82 | 1080 × 250 px |

Pared, piso, cielo y vereda se ajustan con `cover`; los demás objetos con `contain` y fondo transparente. Toda imagen subida se reduce al tamaño ideal antes de guardarse.

## 3. Supabase (fase 9)

Proyecto gratuito. Claves públicas (`url`, `anon key`) en `js/config.js`. La persona admin se identifica por correo con Supabase Auth (enlace mágico).

```sql
-- Admins (solo Rurú)
create table admins (email text primary key);
insert into admins values ('[CORREO_DE_RURU]');

create or replace function es_admin() returns boolean
language sql stable as $$
  select exists (select 1 from admins where email = auth.jwt() ->> 'email');
$$;

-- Buzón de dibujos
create table dibujos (
  id uuid primary key default gen_random_uuid(),
  creado timestamptz not null default now(),
  firma text not null check (char_length(firma) between 1 and 30),
  mensaje text check (char_length(mensaje) <= 120),
  ruta_imagen text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente','aprobado','rechazado'))
);
alter table dibujos enable row level security;
create policy "cualquiera envía" on dibujos for insert to anon with check (estado = 'pendiente');
create policy "se ven aprobados" on dibujos for select using (estado = 'aprobado' or es_admin());
create policy "admin modera" on dibujos for update using (es_admin());

-- Playlist y recuerdos
create table canciones (
  id uuid primary key default gen_random_uuid(),
  orden int not null default 0,
  titulo text not null,
  artista text not null,
  url_spotify text,
  creado timestamptz not null default now()
);
create table recuerdos (
  id uuid primary key default gen_random_uuid(),
  cancion_id uuid not null references canciones(id) on delete cascade,
  texto text not null check (char_length(texto) <= 280),
  firma text not null check (char_length(firma) <= 30),
  creado timestamptz not null default now()
);
create table sugerencias (
  id uuid primary key default gen_random_uuid(),
  creado timestamptz not null default now(),
  cancion text not null check (char_length(cancion) <= 120),
  artista text not null check (char_length(artista) <= 120),
  link text check (char_length(link) <= 300),
  recuerdo text not null check (char_length(recuerdo) <= 280),
  firma text not null check (char_length(firma) <= 30),
  estado text not null default 'pendiente' check (estado in ('pendiente','aceptada','descartada')),
  cancion_id uuid references canciones(id)
);
alter table canciones enable row level security;
alter table recuerdos enable row level security;
alter table sugerencias enable row level security;
create policy "playlist pública" on canciones for select using (true);
create policy "recuerdos públicos" on recuerdos for select using (true);
create policy "admin canciones" on canciones for all using (es_admin()) with check (es_admin());
create policy "admin recuerdos" on recuerdos for all using (es_admin()) with check (es_admin());
create policy "cualquiera sugiere" on sugerencias for insert to anon with check (estado = 'pendiente' and cancion_id is null);
create policy "admin lee sugerencias" on sugerencias for select using (es_admin());
create policy "admin modera sugerencias" on sugerencias for update using (es_admin());
```

**Storage:** bucket `buzon`, público para lectura (las rutas son UUID, la galería solo lista aprobados), subida anónima limitada a `image/png` de máx. 1 MB en la carpeta `pendientes/`.

**Flujo "aceptar" en el panel:** si la sugerencia coincide con una canción existente (título y artista normalizados, sin tildes ni mayúsculas) → inserta en `recuerdos`; si no → inserta en `canciones` y luego en `recuerdos`. En ambos casos marca la sugerencia como `aceptada`. Rurú agrega la canción en Spotify a mano.

**Anti-spam simple:** límite por dispositivo en `localStorage`, campo trampa invisible (honeypot) en los formularios y longitud máxima en la base.

## 4. Chat con IA (fase 10)

### 4.1 Worker

`worker/chat-worker.js` en Cloudflare Workers. Secretos con `wrangler secret put` (`IA_API_KEY`). KV `LIMITES` para contar mensajes por `idVisitante` + IP por día (máx. 20). CORS solo para el dominio de GitHub Pages. Modelo configurable por variable (`IA_PROVEEDOR`: Gemini con nivel gratuito, o Claude/OpenAI de pago). Temperatura moderada, respuesta en JSON.

### 4.2 Contrato

`POST /chat`

```json
{
  "idVisitante": "uuid",
  "historial": [
    {"rol": "usuario", "texto": "¿Quién hace mejor pisco?"},
    {"rol": "miguel", "texto": "¿Perdón? El pisco es peruano, causa."},
    {"rol": "manuel", "texto": "Ya empezó."}
  ],
  "mensaje": "¿y si lo hacen juntos?",
  "quimica": 5
}
```

Respuesta:

```json
{
  "respuestas": [
    {"personaje": "manuel", "texto": "…Podría ser. Si él no mete la mano.", "cara": "sonrojo"},
    {"personaje": "miguel", "texto": "¡Hecho! Pero la receta es mía.", "cara": "feliz"}
  ],
  "nota": null,
  "quimica": 6,
  "restantes": 7
}
```

- `respuestas`: 1 a 3 mensajes; `cara` ∈ normal, feliz, enojado, sonrojo, triste.
- `nota`: texto de sistema opcional ("Miguel se dio la vuelta (ley del hielo)").
- `quimica`: 0–8.
- Errores: `429` con `{"error":"limite"}` → ir al Cierre; `5xx` → "La barra está cerrada un ratito" y reintento manual.

`POST /cierre` con el mismo historial → `{"resumen": "…", "prompt": "…"}`.

Las instrucciones del sistema están en `data/chat-system-prompt.md`: el Worker las carga como texto fijo (no se envían desde el navegador).
