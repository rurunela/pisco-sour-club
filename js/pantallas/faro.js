// El faro: redes y publicaciones con el hashtag (ref: prototipo/Faro.dc.html).
import { cargar, activos } from '../datos.js';
import { esPendiente } from '../config.js';
import { t, attr } from '../textos.js';
import { esc, volver } from '../ui.js';

const pz = (x, y, w, h, clase) => `<span class="pz pz--arriba ${clase}" style="--x:${x};--y:${y};--w:${w};--h:${h}"></span>`;

export async function render(app, { def }) {
  const redes = await cargar('redes');

  const enlace = (r) => {
    const dentro = `<strong>${esc(r.red)}</strong><span>${esc(r.detalle)}</span>`;
    return esPendiente(r.url)
      ? `<span class="faro__red es-pendiente" title="${attr('comun.enlacePendiente')}">${dentro}</span>`
      : `<a class="faro__red" href="${esc(r.url)}" target="_blank" rel="noopener">${dentro}</a>`;
  };

  const post = (p) => {
    const vars = { red: p.red, autor: p.autor };
    const dentro = p.imagen
      ? `<img src="${esc(p.imagen)}" alt="${attr('faro.alt', vars)}" loading="lazy">`
      : `<span>${t('faro.postVacio', vars)}</span>`;
    return esPendiente(p.url)
      ? `<div class="faro__post">${dentro}</div>`
      : `<a class="faro__post" href="${esc(p.url)}" target="_blank" rel="noopener">${dentro}</a>`;
  };

  app.innerHTML = `
<div class="pantalla faro">
  <div class="faro__cielo">
    <div class="faro__volver">${volver(def.madre, t('faro.volver'))}</div>
    <div class="escena faro__escena" style="--ancho:390;--alto:230" aria-hidden="true">
      ${pz(175, 66, 200, 34, 'faro__haz')}
      ${pz(160, 40, 70, 26, 'faro__techo')}
      ${pz(165, 66, 60, 34, 'faro__luz')}
      ${pz(167, 100, 56, 130, 'faro__cuerpo')}
      <span class="faro__mar"></span>
    </div>
  </div>
  <div class="faro__pagina">
    <h1 class="faro__titulo">${t('faro.titulo')}</h1>
    <div class="faro__redes">${activos(redes.enlaces).map(enlace).join('')}</div>
    <h2 class="pixel faro__etiqueta">${t('faro.ultimo', { hashtag: redes.hashtag })}</h2>
    <div class="faro__posts">${activos(redes.publicaciones).map(post).join('')}</div>
    <p class="faro__pie">${t('comun.pie')}</p>
  </div>
</div>`;
}
