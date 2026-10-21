// Router por hash: #/ruta?clave=valor
import { leer } from './almacen.js';
import { tp } from './textos.js';
import { postalCaida } from './ui.js';

const home = () => import('./pantallas/home.js');
const proximamente = () => import('./pantallas/proximamente.js');

// titulo: clave de data/textos.json. madre: a dónde lleva "‹ Volver".
// Al construir una fase, cambia `modulo` por el real.
export const RUTAS = {
  '/': { modulo: home, titulo: 'rutas.home' },
  '/bienvenida': { modulo: () => import('./pantallas/bienvenida.js'), titulo: 'rutas.bienvenida' },
  '/faro': { modulo: () => import('./pantallas/faro.js'), titulo: 'rutas.faro', madre: '#/?ir=malecon' },

  '/barra': { modulo: proximamente, titulo: 'rutas.barra', madre: '#/?ir=barra' },
  '/barra/cierre': { modulo: proximamente, titulo: 'rutas.barraCierre', madre: '#/barra' },
  '/tarjeta': { modulo: proximamente, titulo: 'rutas.tarjeta', madre: '#/' },
  '/runner': { modulo: proximamente, titulo: 'rutas.runner', madre: '#/?ir=dato' },
  '/runner/jugar': { modulo: proximamente, titulo: 'rutas.runnerJugar', madre: '#/runner' },
  '/runner/final': { modulo: proximamente, titulo: 'rutas.runnerFinal', madre: '#/runner' },
  '/runner/perdiste': { modulo: proximamente, titulo: 'rutas.runnerPerdiste', madre: '#/runner' },
  '/casita/taller': { modulo: () => import('./pantallas/taller.js'), titulo: 'rutas.casitaTaller', madre: '#/?ir=malecon' },
  '/casita/listo': { modulo: () => import('./pantallas/listo.js'), titulo: 'rutas.casitaListo', madre: '#/casita/taller' },
  '/casita/fotos': { modulo: proximamente, titulo: 'rutas.casitaFotos', madre: '#/casita/taller' },
  '/foto': { modulo: proximamente, titulo: 'rutas.foto', madre: '#/casita/fotos' },
  '/depa': { modulo: proximamente, titulo: 'rutas.depa', madre: '#/?ir=malecon' },
  '/depa/sala': { modulo: proximamente, titulo: 'rutas.depaSala', madre: '#/depa' },
  '/depa/cocina': { modulo: proximamente, titulo: 'rutas.depaCocina', madre: '#/depa' },
  '/depa/afuera': { modulo: proximamente, titulo: 'rutas.depaAfuera', madre: '#/depa' },
  '/depa/portal': { modulo: proximamente, titulo: 'rutas.depaPortal', madre: '#/depa' },
  '/depa/editor': { modulo: proximamente, titulo: 'rutas.depaEditor', madre: '#/depa' },
  '/depa/accion': { modulo: proximamente, titulo: 'rutas.depaAccion', madre: '#/depa' },
  '/depa/secretos': { modulo: proximamente, titulo: 'rutas.depaSecretos', madre: '#/depa' },
  '/quiosco': { modulo: proximamente, titulo: 'rutas.quiosco', madre: '#/?ir=malecon' },
  '/buzon': { modulo: proximamente, titulo: 'rutas.buzon', madre: '#/?ir=malecon' },
  '/galeria': { modulo: proximamente, titulo: 'rutas.galeria', madre: '#/buzon' },
  '/radio': { modulo: proximamente, titulo: 'rutas.radio', madre: '#/?ir=radio' }
};

export function leerHash() {
  const crudo = decodeURIComponent(location.hash.replace(/^#/, '')) || '/';
  const [ruta, query = ''] = crudo.split('?');
  return { ruta: ruta.replace(/\/+$/, '') || '/', params: Object.fromEntries(new URLSearchParams(query)) };
}

let limpiar = null;
let turno = 0;
let guardia = null;
let hashActual = location.hash;

// Una pantalla puede pedir permiso antes de que se salga de ella (por ejemplo, trazos sin guardar).
// fn() devuelve una promesa: true = se puede salir. Se borra sola al cambiar de pantalla.
export function ponerGuardia(fn) {
  guardia = fn;
}

export function iniciarRouter(app) {
  async function render() {
    const yo = ++turno;
    hashActual = location.hash;
    guardia = null;
    const { ruta, params } = leerHash();

    // La primera visita pasa por la bienvenida.
    if (!leer('visto') && ruta !== '/bienvenida') {
      location.replace('#/bienvenida');
      return;
    }

    const def = RUTAS[ruta];
    if (!def) { location.replace('#/'); return; }

    if (typeof limpiar === 'function') { try { limpiar(); } catch { /* nada */ } }
    limpiar = null;

    try {
      const mod = await def.modulo();
      if (yo !== turno) return;
      app.innerHTML = '';
      const cleanup = await mod.render(app, { ruta, params, def });
      if (yo !== turno) { if (typeof cleanup === 'function') cleanup(); return; }
      limpiar = cleanup;
    } catch (e) {
      console.error(e);
      if (yo !== turno) return;
      postalCaida(app, render);
    }

    document.title = def.titulo === 'rutas.home' ? tp('rutas.home') : tp('rutas.pestana', { titulo: tp(def.titulo) });
    if (!params.ir) window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }
  // Si la pantalla tiene guardia, se vuelve a la dirección anterior mientras pregunta;
  // si da permiso, se continúa hacia el destino (sirve para enlaces, ‹ Volver y el botón atrás).
  let preguntando = false;
  async function alCambiarHash() {
    const destino = location.hash;
    if (guardia && destino !== hashActual) {
      history.replaceState(null, '', hashActual || '#/');
      if (preguntando) return;
      preguntando = true;
      const fn = guardia;
      let seguir = false;
      try { seguir = await fn(); } finally { preguntando = false; }
      if (!seguir || guardia !== fn) return;
      guardia = null;
      location.hash = destino;
      return;
    }
    render();
  }
  window.addEventListener('hashchange', alCambiarHash);
  render();
}
