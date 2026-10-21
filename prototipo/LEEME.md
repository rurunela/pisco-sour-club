# Prototipo (referencia visual)

Estas son las pantallas diseñadas en el canvas de Claude. **No son el código final**: están en un formato de diseño (`.dc.html`) que necesita un runtime que no existe en este repo, así que no se abren bien en el navegador. Úsalas para:

- **Colores, tipografías, tamaños y espaciados:** están en los `style="…"` de cada elemento.
- **Textos:** copiar los textos tal cual.
- **Comportamiento:** el `<script type="text/x-dc">` al final de cada archivo muestra los estados y qué hace cada botón (`renderVals()` devuelve los valores; `{{nombre}}` en el HTML los usa; `<sc-if>` = mostrar si; `<sc-for>` = repetir).
- **Componentes:** `Ball.dc.html` (countryball pixel) y `Oc.dc.html` (OC dibujado de ejemplo, con las 5 caras y 3 conjuntos). `<dc-import name="Oc" …>` los inserta.

No copies estas decisiones del prototipo:

- El countryball como 400 `<div>`: en el código real se dibuja en canvas y se cachea.
- Los botones −, +, ↺, ↻ como única forma de mover/escalar: en el código real son respaldo; lo principal son los gestos.
- Los textos entre corchetes: son datos pendientes.
- La cara "sorpresa" que aún existe dentro de `Oc.dc.html`: ya no se usa; son **5 caras** (normal, feliz, enojado, sonrojo, triste).

## Archivo → pantalla

| Archivo | Pantalla (`docs/PANTALLAS.md`) |
| --- | --- |
| `Flujo.dc.html` | Mapa del prototipo (no es pantalla del sitio) |
| `Bienvenida.dc.html` | 1. Bienvenida |
| `Home2.dc.html`, `HomeMovil.dc.html` | 2. Home (escritorio y celular) |
| `Chat.dc.html` | 3. Conversa en la barra |
| `ChatFin.dc.html` | 4. Cierre del día |
| `Tarjeta.dc.html` | 5. Tarjeta de prompt |
| `RunnerInicio.dc.html` | 6. Runner · inicio |
| `Runner.dc.html` | 7. Runner · jugando |
| `RunnerFin.dc.html` | 8. Runner · final |
| `RunnerGameOver.dc.html` | 9. Runner · game over |
| `Taller.dc.html` | 10. Taller |
| `TallerListo.dc.html` | 11. OCs guardados |
| `CasitaFoto.dc.html` | 12. Estudio de fotos |
| `Polaroid.dc.html` | 13. Foto con texto |
| `Depa.dc.html` | 14. El depa · entrada |
| `DepaSala.dc.html` | 15. Sala |
| `DepaCocina.dc.html` | 16. Cocina |
| `DepaAfuera.dc.html` | 17. Afuera |
| `DepaPortal.dc.html` | 18. Portal (cámara) |
| `DepaEditor.dc.html` | 19. Modo editor |
| `Accion.dc.html` | 20. Acción |
| `DepaSecreto.dc.html` | 21. Escenas secretas |
| `Kiosco.dc.html` | 22. Quiosco de recuerdos |
| `Buzon.dc.html` | 23. El buzón |
| `Galeria.dc.html` | 24. Galería |
| `Faro.dc.html` | 25. El faro |
| `Radio.dc.html` | 26. Radio del muelle |
| `RadioPanel.dc.html` | 27. Panel de Rurú |
| `Ball.dc.html`, `Oc.dc.html` | Componentes de personaje |
