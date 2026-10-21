# Motor de "Acción" (animaciones por fotogramas)

La persona no anima cuadro por cuadro: solo dice **dónde está cada personaje y qué hace** en cada fotograma. El motor rellena el movimiento entre fotogramas: caminan por el piso, saltan sobre los muebles, hacen la acción y muestran su globo.

Referencia visual e interactiva: `prototipo/Accion.dc.html` (el prototipo ya reproduce una versión simple de este comportamiento).

## 1. Modelo de datos

```json
{
  "id": "uuid",
  "nombre": "La once que terminó en beso",
  "cuarto": "sala",
  "creado": "2026-10-20T19:30:00-05:00",
  "fotogramas": [
    {
      "duracion": 1800,
      "pe": {"x": 0.86, "cara": "normal", "ropa": 2, "accion": "", "globo": ""},
      "cl": {"x": 0.02, "cara": "normal", "ropa": 1, "accion": "", "globo": "¿Vienes o no?"}
    },
    {
      "duracion": 1800,
      "pe": {"x": 0.86, "cara": "sonrojo", "ropa": 2, "accion": "", "globo": "¡Ya voy, ya voy!"},
      "cl": {"x": 0.42, "cara": "feliz", "ropa": 1, "accion": "saltar", "globo": ""}
    }
  ]
}
```

- `x`: posición horizontal del **centro de los pies**, normalizada de 0 a 1 en el ancho del cuarto. La altura (`y`) no la elige la persona: la calcula el motor según el piso y los muebles.
- `accion`: `""` (solo caminar), `saltar`, `bailar`, `girar`, `abrazo`, `beso`, `pegarse`.
- `duracion`: por defecto 1800 ms; se puede cambiar entre 800 y 4000 ms manteniendo pulsado el fotograma.
- Máximo 24 fotogramas por animación.

## 2. Geometría de cada cuarto

Cada cuarto define su piso y sus **superficies** (muebles donde se puede estar encima) en unidades normalizadas.

```js
const CUARTOS = {
  sala:   { piso: 0.84, superficies: [{ id: 'sillon', x0: 0.34, x1: 0.69, altura: 0.68 }] },
  cocina: { piso: 0.84, superficies: [{ id: 'mesa',   x0: 0.12, x1: 0.66, altura: 0.70 }] },
  afuera: { piso: 0.82, superficies: [{ id: 'banca',  x0: 0.31, x1: 0.63, altura: 0.70 }] }
};
```

`altura` es la `y` (de 0 arriba a 1 abajo) donde quedan los pies si el personaje está sobre ese mueble. Si el modo editor cambió la imagen del mueble, la superficie se conserva (es una caja lógica, no se calcula de la imagen).

## 3. Cómo se calcula el movimiento entre dos fotogramas

Para cada personaje, de `a = anterior.x` a `b = actual.x`, durante la `duracion` del fotograma:

1. **Fase de traslado (primer 65 % del tiempo):**
   - `yInicio` = altura de la superficie bajo `a`, o el piso. `yFin` igual para `b`.
   - Si `a` y `b` están sobre la misma altura y el camino no cruza ninguna superficie → **camina**: `x` con easing `easeInOutSine`, bamboleo de ±4° y rebote vertical de 3 px cada 220 ms.
   - Si el camino **sube a** una superficie, **baja de** ella o la **cruza** de lado a lado → camina hasta el borde de la superficie y hace un **salto en arco** (parábola de 0,5 s, altura = diferencia de alturas + 18 % del alto del personaje) para caer arriba, abajo o del otro lado.
   - Si `a === b` → no se mueve.
   - Mira hacia donde camina (voltear si va a la izquierda). Al llegar, mira hacia el otro personaje.
2. **Fase de acción (35 % restante, o todo el fotograma si no se movió):**

| Acción | Qué se ve |
| --- | --- |
| `saltar` | 2 saltos en el sitio (60 px y 20 px), aplastándose un poco al caer |
| `bailar` | se mece ±8° y rebota 14 px en bucle hasta el siguiente fotograma; notas ♪ flotando |
| `girar` | 3 giros de 360° muy rápidos (0,45 s cada uno), sin sentido y feliz |
| `abrazo` | (de pareja) los dos caminan hasta quedar juntos (separación de 0,6 anchos de personaje) e inclinados el uno hacia el otro |
| `beso` | (de pareja) se juntan como en el abrazo, se inclinan, aparece un corazón pixel y el texto "*besito*" |
| `pegarse` | se juntan a un ancho de distancia, tiemblan, y aparece "¡PUM!" con estrellitas (cómico, nunca violento) |

   - Las acciones de pareja se aplican a los dos personajes a la vez: si la persona elige `abrazo` en uno, el editor lo pone en ambos. El motor ignora las `x` guardadas y calcula el punto de encuentro en el medio.
3. **Globo:** aparece al empezar el fotograma, sobre la cabeza, con una cola hacia el personaje; dura todo el fotograma. Si hay dos globos a la vez, el segundo sale 80 ms después y más alto para no taparse.
4. **Cara y ropa:** cambian al inicio del fotograma.

Con `prefers-reduced-motion`: sin bamboleos, giros ni temblores; los traslados se hacen con un fundido corto.

## 4. Render

- Un `<canvas>` por escenario, a la resolución del dispositivo. Capas: fondo (pared, piso u objetos del editor) → muebles → personajes (ordenados por `y`) → efectos (corazones, notas, PUM) → globos.
- Personajes desde `personajes.js` (OC o ball, con cara y ropa), escalados al 30 % del alto del escenario.
- Bucle con `requestAnimationFrame`; el estado se calcula en función del tiempo transcurrido (no por cuadros), así la animación dura lo mismo en cualquier celular.

## 5. Editor

- Tocar a un personaje lo selecciona; **arrastrarlo** cambia su `x` en el fotograma actual (se pega al piso o a la superficie más cercana al soltar).
- Fantasma del fotograma anterior al 25 % y línea punteada del recorrido (con un arco donde habrá salto).
- Tira de fotogramas: tocar = ir; **+** = duplicar el actual sin acción ni globo; mantener pulsado = menú (duplicar, mover a la izquierda/derecha, cambiar duración, borrar).
- **▶ Reproducir** desde el fotograma 1 (o desde el actual con doble toque). Mientras se reproduce, el editor se bloquea.
- **Guardar** en IndexedDB (`animaciones`) con nombre; lista de "Mis animaciones" para abrir, duplicar o borrar.

## 6. Exportar video

- `canvas.captureStream(30)` + `MediaRecorder`. Formato: `video/mp4` si el navegador lo soporta (Safari), si no `video/webm`.
- Resolución de exportación: 1080×1350 (4:5) con el marco postal y la marca "Pisco Sour Club" pequeña en la esquina.
- Si `MediaRecorder` no está disponible: exportar los fotogramas clave como PNG en un ZIP y avisar.
- Opcional: incluir la música de la radio si se eligió en algún fotograma (pistas libres de derechos).
