// Utilidades de interfaz compartidas.

export function esc(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export const PIE = 'Pisco Sour Club es un proyecto fan hecho por Rurú. Personajes de Latin Hetalia; no es la cuenta oficial del fandom.';

export function volver(href, texto = '‹ Volver') {
  return `<a class="volver" href="${href}">${esc(texto)}</a>`;
}

// Copa de pisco sour en pixel art (14×16).
export function svgCopa(ancho = 64, alto = 74, destellos = false) {
  return `<svg width="${ancho}" height="${alto}" viewBox="0 0 14 16" shape-rendering="crispEdges" aria-hidden="true" focusable="false">
<rect x="1" y="2" width="12" height="1" fill="#2B2622"/><rect x="0" y="3" width="1" height="2" fill="#2B2622"/><rect x="13" y="3" width="1" height="2" fill="#2B2622"/><rect x="1" y="3" width="12" height="2" fill="#FFFDF5"/><rect x="1" y="5" width="1" height="2" fill="#2B2622"/><rect x="12" y="5" width="1" height="2" fill="#2B2622"/><rect x="2" y="5" width="10" height="2" fill="#EAD58A"/><rect x="3" y="7" width="8" height="1" fill="#2B2622"/><rect x="4" y="7" width="6" height="1" fill="#EAD58A"/><rect x="6" y="8" width="2" height="5" fill="#9BC2D6"/><rect x="3" y="13" width="8" height="1" fill="#9BC2D6"/>${destellos ? '<rect x="9" y="3" width="1" height="1" fill="#B5652E"/><rect x="12" y="0" width="1" height="1" fill="#F2C14E"/><rect x="11" y="1" width="1" height="1" fill="#F2C14E"/>' : ''}
</svg>`;
}

export const reducirMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
