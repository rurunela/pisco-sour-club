// Carga y cachea el contenido estático de data/.

const cache = new Map();

export function cargar(nombre) {
  if (!cache.has(nombre)) {
    const p = fetch(`data/${nombre}.json`).then((r) => {
      if (!r.ok) throw new Error(`No se pudo cargar data/${nombre}.json`);
      return r.json();
    });
    p.catch(() => cache.delete(nombre));
    cache.set(nombre, p);
  }
  return cache.get(nombre);
}

// Índice del día en hora de Lima (UTC−5), igual para todos durante el día.
export function diaLima(ahora = Date.now()) {
  return Math.floor((ahora - 5 * 3600 * 1000) / 86400000);
}

export function delDia(lista, ahora) {
  return lista[diaLima(ahora) % lista.length];
}
