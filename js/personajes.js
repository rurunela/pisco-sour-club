// Personajes: countryballs pixel (20×20) con 5 caras, generados por código y cacheados.
// En la fase 2 los OCs de la persona reemplazan a los balls (docs/DATOS.md §2.3).

export const CARAS = ['normal', 'feliz', 'enojado', 'sonrojo', 'triste'];

const N = 20;
const R = 10;
const BORDE = '#1A1A1A';
const BLANCO = '#FFFFFF';
const ROJO_PE = '#D91023';
const ROJO_CL = '#D52B1E';
const AZUL_CL = '#0039A6';
const BRILLO = { [ROJO_PE]: '#EE4D5C', [ROJO_CL]: '#EA5A4C', [AZUL_CL]: '#3A6BD0' };
const ESTRELLA = new Set(['4,4', '3,5', '4,5', '5,5', '4,6']);
const DESTELLO = new Set(['13,3', '14,3', '15,4']);
const OJOS_X = [8, 13];

// Rasgos de cada cara sobre la cuadrícula: [x, y, color].
const BOCA_SONRISA = [[11, 13], [12, 14], [13, 14], [14, 13]];
const BOCA_ABAJO = [[11, 14], [12, 13], [13, 13], [14, 14]];
const rubor = (color, filas, xs) => filas.flatMap((y) => xs.map((x) => [x, y, color]));

const RASGOS = {
  normal: {
    ojos: 'blancos',
    extra: [...BOCA_SONRISA.map(([x, y]) => [x, y, BORDE]), ...rubor('#FFB3C6', [12], [8, 9, 15, 16])]
  },
  feliz: {
    ojos: 'arcos',
    extra: [
      [11, 13, BORDE], [12, 13, BLANCO], [13, 13, BLANCO], [14, 13, BORDE], [12, 14, BORDE], [13, 14, BORDE],
      ...rubor('#FF8FAB', [12], [8, 9, 15, 16])
    ]
  },
  enojado: {
    ojos: 'blancos',
    extra: [
      [8, 5, BORDE], [9, 5, BORDE], [10, 6, BORDE], [11, 6, BORDE],
      [13, 6, BORDE], [14, 6, BORDE], [15, 5, BORDE], [16, 5, BORDE],
      [10, 8, BORDE], [14, 8, BORDE],
      ...BOCA_ABAJO.map(([x, y]) => [x, y, BORDE])
    ]
  },
  sonrojo: {
    ojos: 'blancos',
    extra: [
      [11, 14, BORDE], [12, 13, BORDE], [13, 14, BORDE], [14, 13, BORDE],
      ...rubor('#FF6F91', [11, 12], [7, 8, 9, 15, 16, 17])
    ]
  },
  triste: {
    ojos: 'blancos',
    extra: [
      [8, 6, BORDE], [9, 6, BORDE], [10, 5, BORDE], [11, 5, BORDE],
      [13, 5, BORDE], [14, 5, BORDE], [15, 6, BORDE], [16, 6, BORDE],
      ...BOCA_ABAJO.map(([x, y]) => [x, y, BORDE]),
      [15, 11, '#9BC2D6'], [15, 12, '#9BC2D6'], [15, 13, '#9BC2D6']
    ]
  }
};

function colorBandera(pais, x, y) {
  if (pais === 'pe') return (x < 7 || x >= 13) ? ROJO_PE : BLANCO;
  if (ESTRELLA.has(x + ',' + y)) return BLANCO;
  return y < 10 ? (x < 8 ? AZUL_CL : BLANCO) : ROJO_CL;
}

function ojoBlanco(x, y, x0) {
  const cx = x - x0, cy = y - 7;
  if (cx < 0 || cx > 3 || cy < 0 || cy > 3) return null;
  if ((cx === 0 || cx === 3) && (cy === 0 || cy === 3)) return null;
  return (cx === 0 || cx === 3 || cy === 0 || cy === 3) ? BORDE : BLANCO;
}

function grilla(pais, cara) {
  const rasgos = RASGOS[cara] || RASGOS.normal;
  const g = [];
  for (let y = 0; y < N; y++) {
    const fila = [];
    for (let x = 0; x < N; x++) {
      const dx = x + 0.5 - R, dy = y + 0.5 - R;
      const d = Math.hypot(dx, dy);
      let c = null;
      if (d <= R) {
        if (d > R - 1.15) {
          c = BORDE;
        } else {
          c = colorBandera(pais, x, y);
          if (DESTELLO.has(x + ',' + y)) c = BRILLO[c] || c;
          if (rasgos.ojos === 'blancos') c = ojoBlanco(x, y, OJOS_X[0]) || ojoBlanco(x, y, OJOS_X[1]) || c;
        }
      }
      fila.push(c);
    }
    g.push(fila);
  }
  if (rasgos.ojos === 'arcos') {
    for (const x0 of OJOS_X) {
      g[9][x0] = BORDE; g[8][x0 + 1] = BORDE; g[8][x0 + 2] = BORDE; g[9][x0 + 3] = BORDE;
    }
  }
  for (const [x, y, c] of rasgos.extra) g[y][x] = c;
  return g;
}

const cacheCanvas = new Map();
const cacheURL = new Map();

// Canvas 20×20 del ball (para exportar: dibujar escalado con imageSmoothingEnabled = false).
export function ballCanvas(pais, cara = 'normal') {
  const clave = pais + ':' + cara;
  if (!cacheCanvas.has(clave)) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = N;
    const ctx = canvas.getContext('2d');
    grilla(pais, cara).forEach((fila, y) => fila.forEach((c, x) => {
      if (c) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); }
    }));
    cacheCanvas.set(clave, canvas);
  }
  return cacheCanvas.get(clave);
}

export function ballURL(pais, cara = 'normal') {
  const clave = pais + ':' + cara;
  if (!cacheURL.has(clave)) cacheURL.set(clave, ballCanvas(pais, cara).toDataURL('image/png'));
  return cacheURL.get(clave);
}

// Dibuja un ball nítido en un contexto 2D (exportar PNG, postales…).
export function dibujarBall(ctx, pais, cara, x, y, tamano, voltear = false) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  if (voltear) {
    ctx.translate(x + tamano, y);
    ctx.scale(-1, 1);
    ctx.drawImage(ballCanvas(pais, cara), 0, 0, tamano, tamano);
  } else {
    ctx.drawImage(ballCanvas(pais, cara), x, y, tamano, tamano);
  }
  ctx.restore();
}

const NOMBRES = { pe: 'Miguel (Perú)', cl: 'Manuel (Chile)' };

/**
 * HTML de un personaje para la interfaz.
 * size: número (px) o cualquier longitud CSS (por ejemplo "clamp(80px, 26vw, 112px)").
 * etiqueta: si se da, el personaje se anuncia como imagen; si no, es decorativo.
 */
export function htmlPersonaje({ pais, cara = 'normal', size = 112, flip = false, manos = false, etiqueta = null, clase = '' }) {
  const t = typeof size === 'number' ? size + 'px' : size;
  const rol = etiqueta === null ? 'aria-hidden="true"' : `role="img" aria-label="${etiqueta || NOMBRES[pais]}"`;
  const mano = manos ? '<span class="pj__mano pj__mano--a"></span><span class="pj__mano pj__mano--b"></span>' : '';
  return `<span class="pj pj--${pais}${flip ? ' pj--flip' : ''}${clase ? ' ' + clase : ''}" style="--t:${t}" data-pais="${pais}" ${rol}><img class="pj__img" src="${ballURL(pais, cara)}" alt="" draggable="false">${mano}</span>`;
}

// Cambia la cara de un personaje ya pintado.
export function cambiarCara(elemento, cara) {
  const img = elemento.querySelector('.pj__img');
  if (img) img.src = ballURL(elemento.dataset.pais, cara);
}
