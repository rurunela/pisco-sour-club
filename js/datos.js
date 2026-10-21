// Carga y cachea el contenido estático de data/. Las listas nunca asumen un largo fijo.

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

// Quita los elementos con "activo": false.
export const activos = (lista) => (Array.isArray(lista) ? lista : [lista]).filter((x) => !(x && x.activo === false));

// Índice del día en hora de Lima (UTC−5), igual para todos durante el día.
export function diaLima(ahora = Date.now()) {
  return Math.floor((ahora - 5 * 3600 * 1000) / 86400000);
}

export function delDia(lista, ahora) {
  const l = activos(lista);
  return l[diaLima(ahora) % l.length];
}

export function alAzar(lista) {
  const l = activos(lista);
  return l[Math.floor(Math.random() * l.length)];
}
