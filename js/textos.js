// Textos de la interfaz (docs/CONTENIDO.md). Todo lo visible sale de data/textos.json.
import RESPALDO from './textos-respaldo.js';

let textos = RESPALDO;
const avisados = new Set();

export async function cargarTextos() {
  try {
    const r = await fetch('data/textos.json');
    if (!r.ok) throw new Error(r.status);
    textos = await r.json();
    return true;
  } catch (e) {
    console.warn('No se pudo cargar data/textos.json; uso los textos de respaldo.', e);
    return false;
  }
}

const buscar = (obj, clave) => clave.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

const escapar = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function crudo(clave, vars) {
  let v = buscar(textos, clave);
  if (typeof v !== 'string') v = buscar(RESPALDO, clave);
  if (typeof v !== 'string') {
    if (!avisados.has(clave)) { avisados.add(clave); console.warn(`Falta el texto "${clave}" en data/textos.json`); }
    return `[${clave}]`;
  }
  return v.replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? String(vars[k]) : m));
}

// Texto con formato seguro: escapa todo y luego **negrita**, *cursiva* y \n.
export function formato(texto) {
  return escapar(texto)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

// Texto plano, sin marcas (para aria-label, títulos de pestaña y canvas).
export function plano(texto) {
  return String(texto ?? '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
}

// HTML listo para insertar.
export const t = (clave, vars) => formato(crudo(clave, vars));

// Texto plano sin escapar: para textContent, canvas o document.title.
export const tp = (clave, vars) => plano(crudo(clave, vars));

// Texto plano escapado para usar dentro de un atributo HTML.
export const attr = (clave, vars) => escapar(tp(clave, vars));
