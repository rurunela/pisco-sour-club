// Copia de seguridad de los OCs: un archivo .psc (JSON) con caras, ropa y fondos en base64.
// Sirve para no perder los dibujos si el navegador borra sus datos, o para pasarlos a otro navegador.
import { idbTodos, idbGuardar, leer, guardar } from './almacen.js';

const FORMATO = 'pisco-sour-club';
const VERSION = 1;
const MAX_BYTES = 80 * 1024 * 1024;
const IDS = {
  caras: /^(pe|cl):(normal|feliz|enojado|sonrojo|triste)$/,
  ropa: /^(pe|cl):[123]$/,
  fondos: /^f[1-4]$/
};
const TIPOS = /^data:image\/(png|webp|jpeg);base64,[A-Za-z0-9+/=]+$/;

const aDataURL = (blob) => new Promise((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(r.result);
  r.onerror = () => reject(r.error);
  r.readAsDataURL(blob);
});

export async function contarDibujos() {
  let n = 0;
  for (const store of Object.keys(IDS)) n += (await idbTodos(store)).length;
  return n;
}

// Devuelve un Blob con la copia, o null si no hay nada que copiar.
export async function crearCopia() {
  const copia = { formato: FORMATO, version: VERSION, creado: new Date().toISOString(), usarOC: leer('usarOC', {}) || {} };
  let total = 0;
  for (const store of Object.keys(IDS)) {
    copia[store] = [];
    for (const r of await idbTodos(store)) {
      if (!r || !r.blob) continue;
      const item = { id: r.id, imagen: await aDataURL(r.blob) };
      if (r.nombre) item.nombre = r.nombre;
      copia[store].push(item);
      total++;
    }
  }
  if (!total) return null;
  return new Blob([JSON.stringify(copia)], { type: 'application/json' });
}

// Lee un archivo .psc y guarda su contenido. Devuelve los registros recuperados por store.
export async function recuperarCopia(archivo) {
  if (!archivo || archivo.size > MAX_BYTES) throw new Error('copia-invalida');
  let copia;
  try { copia = JSON.parse(await archivo.text()); } catch { throw new Error('copia-invalida'); }
  if (!copia || copia.formato !== FORMATO || typeof copia.version !== 'number' || copia.version > VERSION) throw new Error('copia-invalida');

  const recuperados = { caras: [], ropa: [], fondos: [] };
  for (const store of Object.keys(IDS)) {
    for (const item of Array.isArray(copia[store]) ? copia[store] : []) {
      if (!item || !IDS[store].test(item.id) || typeof item.imagen !== 'string' || !TIPOS.test(item.imagen)) continue;
      const blob = await (await fetch(item.imagen)).blob();
      const registro = { id: item.id, blob, actualizado: Date.now() };
      if (store === 'fondos' && typeof item.nombre === 'string') registro.nombre = item.nombre.slice(0, 60);
      await idbGuardar(store, registro);
      recuperados[store].push(registro);
    }
  }
  if (!recuperados.caras.length && !recuperados.ropa.length && !recuperados.fondos.length) throw new Error('copia-invalida');
  if (copia.usarOC && typeof copia.usarOC === 'object') {
    const pref = leer('usarOC', {}) || {};
    for (const p of ['pe', 'cl']) if (typeof copia.usarOC[p] === 'boolean') pref[p] = copia.usarOC[p];
    guardar('usarOC', pref);
  }
  return recuperados;
}
