// El faro: redes y publicaciones con el hashtag (ref: prototipo/Faro.dc.html).
import { cargar } from '../datos.js';
import { esPendiente } from '../config.js';
import { esc, volver, PIE } from '../ui.js';

export async function render(app, { def }) {
  const redes = await cargar('redes');

  const enlace = (r) => {
    const dentro = `<strong>${esc(r.red)}</strong><span>${esc(r.detalle)}</span>`;
    return esPendiente(r.url)
      ? `<span class="faro__red es-pendiente" title="Enlace pendiente">${dentro}</span>`
      : `<a class="faro__red" href="${esc(r.url)}" target="_blank" rel="noopener">${dentro}</a>`;
  };

  const post = (p) => {
    const dentro = p.imagen
      ? `<img src="${esc(p.imagen)}" alt="Publicación de ${esc(p.autor)} en ${esc(p.red)}" loading="lazy">`
      : `<span>[Post ${esc(p.red)}]<br>${esc(p.autor)}</span>`;
    return esPendiente(p.url)
      ? `<div class="faro__post">${dentro}</div>`
      : `<a class="faro__post" href="${esc(p.url)}" target="_blank" rel="noopener">${dentro}</a>`;
  };

  app.innerHTML = `
<div class="pantalla faro">
  <div class="faro__cielo">
    <div class="faro__volver">${volver(def.madre, '‹ Malecón')}</div>
    <div class="faro__haz" aria-hidden="true"></div>
    <div class="faro__torre" aria-hidden="true">
      <span class="faro__techo"></span>
      <span class="faro__luz"></span>
      <span class="faro__cuerpo"></span>
    </div>
    <div class="faro__mar"></div>
  </div>
  <div class="faro__cuerpo-pagina">
    <h1 class="faro__titulo">Desde el faro se ve todo</h1>
    <div class="faro__redes">${redes.enlaces.map(enlace).join('')}</div>
    <h2 class="pixel faro__etiqueta">LO ÚLTIMO CON ${esc(redes.hashtag)}</h2>
    <div class="faro__posts">${redes.publicaciones.map(post).join('')}</div>
    <p class="faro__pie">${PIE}</p>
  </div>
</div>`;
}
