// Router por hash: #/ruta?clave=valor
import { leer } from './almacen.js';

const home = () => import('./pantallas/home.js');
const proximamente = () => import('./pantallas/proximamente.js');

// madre: a dónde lleva "‹ Volver". Al construir una fase, cambia `modulo` por el real.
export const RUTAS = {
  '/': { modulo: home, titulo: 'Pisco Sour Club' },
  '/bienvenida': { modulo: () => import('./pantallas/bienvenida.js'), titulo: 'Bienvenida' },
  '/faro': { modulo: () => import('./pantallas/faro.js'), titulo: 'El faro', madre: '#/?ir=malecon' },

  '/barra': { modulo: proximamente, titulo: 'Conversa en la barra', madre: '#/?ir=barra' },
  '/barra/cierre': { modulo: proximamente, titulo: 'Cierre del día', madre: '#/barra' },
  '/tarjeta': { modulo: proximamente, titulo: 'Tarjeta de prompt', madre: '#/' },
  '/runner': { modulo: proximamente, titulo: 'Ruta del desierto', madre: '#/?ir=dato' },
  '/runner/jugar': { modulo: proximamente, titulo: 'Ruta del desierto', madre: '#/runner' },
  '/runner/final': { modulo: proximamente, titulo: 'Ruta del desierto · Final', madre: '#/runner' },
  '/runner/perdiste': { modulo: proximamente, titulo: 'Ruta del desierto · Game over', madre: '#/runner' },
  '/casita/taller': { modulo: proximamente, titulo: 'La casita · Taller', madre: '#/?ir=malecon' },
  '/casita/listo': { modulo: proximamente, titulo: 'Tus OCs', madre: '#/casita/taller' },
  '/casita/fotos': { modulo: proximamente, titulo: 'Estudio de fotos', madre: '#/casita/taller' },
  '/foto': { modulo: proximamente, titulo: 'Foto con texto', madre: '#/casita/fotos' },
  '/depa': { modulo: proximamente, titulo: 'El depa', madre: '#/?ir=malecon' },
  '/depa/sala': { modulo: proximamente, titulo: 'La sala', madre: '#/depa' },
  '/depa/cocina': { modulo: proximamente, titulo: 'La cocina', madre: '#/depa' },
  '/depa/afuera': { modulo: proximamente, titulo: 'Afuera', madre: '#/depa' },
  '/depa/portal': { modulo: proximamente, titulo: 'El portal', madre: '#/depa' },
  '/depa/editor': { modulo: proximamente, titulo: 'Modo editor', madre: '#/depa' },
  '/depa/accion': { modulo: proximamente, titulo: 'Acción', madre: '#/depa' },
  '/depa/secretos': { modulo: proximamente, titulo: 'Escenas secretas', madre: '#/depa' },
  '/quiosco': { modulo: proximamente, titulo: 'Quiosco de recuerdos', madre: '#/?ir=malecon' },
  '/buzon': { modulo: proximamente, titulo: 'El buzón del club', madre: '#/?ir=malecon' },
  '/galeria': { modulo: proximamente, titulo: 'La pared del club', madre: '#/buzon' },
  '/radio': { modulo: proximamente, titulo: 'Radio del muelle', madre: '#/?ir=radio' }
};

export function leerHash() {
  const crudo = decodeURIComponent(location.hash.replace(/^#/, '')) || '/';
  const [ruta, query = ''] = crudo.split('?');
  return { ruta: ruta.replace(/\/+$/, '') || '/', params: Object.fromEntries(new URLSearchParams(query)) };
}

export function navegar(href) {
  if (location.hash === href) iniciarRouter.render();
  else location.hash = href;
}

let limpiar = null;
let turno = 0;

export function iniciarRouter(app) {
  async function render() {
    const yo = ++turno;
    let { ruta, params } = leerHash();

    // La primera visita pasa por la bienvenida.
    if (!leer('visto') && ruta !== '/bienvenida') {
      location.replace('#/bienvenida');
      return;
    }

    const def = RUTAS[ruta];
    if (!def) { location.replace('#/'); return; }

    let mod;
    try {
      mod = await def.modulo();
    } catch (e) {
      console.error(e);
      app.innerHTML = '<p style="padding:24px">No se pudo abrir esta parte del club. Recarga la página.</p>';
      return;
    }
    if (yo !== turno) return;

    if (typeof limpiar === 'function') { try { limpiar(); } catch { /* nada */ } }
    limpiar = null;
    app.innerHTML = '';
    document.title = def.titulo === 'Pisco Sour Club' ? 'Pisco Sour Club · una página al Chirú' : `${def.titulo} · Pisco Sour Club`;

    try {
      limpiar = await mod.render(app, { ruta, params, def });
    } catch (e) {
      console.error(e);
      app.innerHTML = '<p style="padding:24px">Algo se cayó detrás de la barra. Recarga la página.</p>';
      return;
    }
    if (yo !== turno) return;

    if (!params.ir) window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }
  iniciarRouter.render = render;
  window.addEventListener('hashchange', render);
  render();
}
