// Todo el guardado local pasa por aquí (docs/DATOS.md §2). Prefijo de claves: "psc.".
// Fase 1: solo localStorage. IndexedDB llega en la fase 2.

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
