// Utilidades de interfaz compartidas.
import { t } from './textos.js';

export function esc(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Enlace "‹ Volver"; `etiquetaHtml` viene de t().
export function volver(href, etiquetaHtml = t('comun.volver')) {
  return `<a class="volver" href="${href}">${etiquetaHtml}</a>`;
}

// Copa de pisco sour en pixel art (14×16). Tamaño por CSS (ancho/alto en cualquier unidad).
export function svgCopa(ancho, alto, destellos = false) {
  return `<svg style="width:${ancho};height:${alto}" viewBox="0 0 14 16" shape-rendering="crispEdges" aria-hidden="true" focusable="false">
<rect x="1" y="2" width="12" height="1" fill="#2B2622"/><rect x="0" y="3" width="1" height="2" fill="#2B2622"/><rect x="13" y="3" width="1" height="2" fill="#2B2622"/><rect x="1" y="3" width="12" height="2" fill="#FFFDF5"/><rect x="1" y="5" width="1" height="2" fill="#2B2622"/><rect x="12" y="5" width="1" height="2" fill="#2B2622"/><rect x="2" y="5" width="10" height="2" fill="#EAD58A"/><rect x="3" y="7" width="8" height="1" fill="#2B2622"/><rect x="4" y="7" width="6" height="1" fill="#EAD58A"/><rect x="6" y="8" width="2" height="5" fill="#9BC2D6"/><rect x="3" y="13" width="8" height="1" fill="#9BC2D6"/>${destellos ? '<rect x="9" y="3" width="1" height="1" fill="#B5652E"/><rect x="12" y="0" width="1" height="1" fill="#F2C14E"/><rect x="11" y="1" width="1" height="1" fill="#F2C14E"/>' : ''}
</svg>`;
}

// Postal de error para cuando un JSON no carga.
export function postalCaida(app, reintentar) {
  app.innerHTML = `
<div class="pantalla postal-caida">
  <div class="olas"></div>
  <div class="postal-caida__tarjeta">
    <p class="postal-caida__texto">${t('errores.postalCaida')}</p>
    <button type="button" class="boton boton--oceano" id="reintentar">${t('errores.reintentar')}</button>
    <p class="pie">${t('comun.pie')}</p>
  </div>
</div>`;
  app.querySelector('#reintentar').addEventListener('click', reintentar);
}

export const reducirMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
