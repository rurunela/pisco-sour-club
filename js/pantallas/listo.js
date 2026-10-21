// La casita · OCs guardados (ref: prototipo/TallerListo.dc.html, docs/PANTALLAS.md §11).
import { htmlPersonaje } from '../personajes.js';
import { t, tp } from '../textos.js';
import { volver } from '../ui.js';

const pzArriba = (x, y, w, h, estilo) => `<span class="pz pz--arriba" style="--x:${x};--y:${y};--w:${w};--h:${h};${estilo}"></span>`;

export function render(app, { def }) {
  app.innerHTML = `
<div class="pantalla listo">
  <div class="listo__cuerpo">
    ${volver(def.madre, t('listo.volver'))}
    <span class="pixel listo__ante">${t('listo.antetitulo')}</span>
    <h1 class="listo__titulo">${t('listo.titulo')}</h1>
    <p class="listo__texto">${t('listo.texto')}</p>
    <div class="postal listo__postal">
      <div class="escena playa" style="--ancho:400;--alto:300">
        ${pzArriba(330, 24, 46, 46, 'background:var(--sol)')}
        <span class="playa__mar"></span>
        <span class="playa__arena"></span>
        <span class="listo__etiqueta pixel">${t('listo.portada')}</span>
        <div class="escena__fila listo__pjs">
          ${htmlPersonaje({ pais: 'cl', cara: 'normal', size: 'calc(140 * var(--u))', manos: true, etiqueta: tp('comun.tuOcCl') })}
          ${htmlPersonaje({ pais: 'pe', cara: 'feliz', size: 'calc(140 * var(--u))', flip: true, manos: true, etiqueta: tp('comun.tuOcPe') })}
        </div>
      </div>
    </div>
    <div class="listo__acciones">
      <a class="boton boton--oceano" href="#/">${t('listo.verClub')}</a>
      <div class="listo__fila">
        <a class="boton boton--borde" href="#/casita/taller">${t('listo.volverDibujar')}</a>
        <a class="boton boton--borde" href="#/buzon">${t('listo.buzon')}</a>
      </div>
      <p class="listo__nota">${t('listo.nota')}</p>
    </div>
  </div>
</div>`;
}
