// Todo el guardado local pasa por aquí (docs/DATOS.md §2). Prefijo de claves: "psc.".
// localStorage para datos pequeños; IndexedDB "psc" para imágenes.

const PREFIJO = 'psc.';

export function leer(clave, porDefecto = null) {
  try {
    const crudo = localStorage.getItem(PREFIJO + clave);
    return crudo === null ? porDefecto : JSON.parse(crudo);
  } catch {
    return porDefecto;
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function borrar(clave) {
  try { localStorage.removeItem(PREFIJO + clave); } catch { /* sin almacenamiento */ }
}

function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15);
    return (c === 'x' ? r : (r & 3) | 8).toString(16);
  });
}

// Identificador anónimo del dispositivo (para límites del chat; no identifica a la persona).
export function idVisitante() {
  let id = leer('idVisitante');
  if (!id) { id = uuid(); guardar('idVisitante', id); }
  return id;
}

// N.º de socio de 6 cifras, estable entre visitas.
export function numeroSocio() {
  let n = leer('socio');
  if (!n) {
    n = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, '0');
    guardar('socio', n);
  }
  return n;
}

// ---------- IndexedDB (docs/DATOS.md §2.2) ----------

const DB_NOMBRE = 'psc';
const DB_VERSION = 1;
export const STORES = ['caras', 'ropa', 'fondos', 'comidas', 'objetos', 'animaciones'];

let conexion = null;

function abrir() {
  if (!conexion) {
    conexion = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) { reject(new Error('Sin IndexedDB')); return; }
      const req = indexedDB.open(DB_NOMBRE, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        for (const s of STORES) if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' });
      };
      req.onsuccess = () => {
        const db = req.result;
        // Si otra pestaña abre una versión nueva de la base, cerramos esta para no bloquearla.
        db.onversionchange = () => { db.close(); conexion = null; };
        resolve(db);
      };
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error('IndexedDB bloqueada'));
    });
    conexion.catch(() => { conexion = null; });
  }
  return conexion;
}

async function operar(store, modo, accion) {
  const db = await abrir();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, modo);
    const req = accion(tx.objectStore(store));
    tx.oncomplete = () => resolve(req ? req.result : undefined);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Transacción cancelada'));
  });
}

export const idbLeer = (store, id) => operar(store, 'readonly', (s) => s.get(id));
export const idbTodos = (store) => operar(store, 'readonly', (s) => s.getAll());
export const idbGuardar = (store, objeto) => operar(store, 'readwrite', (s) => s.put(objeto));
export const idbBorrar = (store, id) => operar(store, 'readwrite', (s) => s.delete(id));

// Pide al navegador que no borre los dibujos cuando le falte espacio.
export async function pedirPersistencia() {
  try {
    if (!navigator.storage || !navigator.storage.persist) return false;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

export async function esPersistente() {
  try { return !!(navigator.storage && navigator.storage.persisted && await navigator.storage.persisted()); } catch { return false; }
}

export async function idbDisponible() {
  try { await abrir(); return true; } catch { return false; }
}
