// Revisa data/*.json: JSON válido, ids únicos y que textos.json tenga las claves del esquema.
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const errores = [];
const datos = {};

for (const archivo of readdirSync('data').filter((f) => f.endsWith('.json'))) {
  const crudo = readFileSync(`data/${archivo}`, 'utf8');
  try {
    datos[archivo] = JSON.parse(crudo);
  } catch (e) {
    const pos = Number((e.message.match(/position (\d+)/) || [])[1]);
    const linea = Number.isFinite(pos) ? crudo.slice(0, pos).split('\n').length : '?';
    errores.push(`✗ data/${archivo}, línea ${linea}: no es JSON válido (${e.message}). Revisa comas y comillas.`);
  }
}

// ids repetidos en cualquier lista con { id }
function revisarIds(nombre, valor, ruta = '') {
  if (Array.isArray(valor)) {
    const vistos = new Set();
    for (const el of valor) {
      if (el && typeof el === 'object' && 'id' in el) {
        if (vistos.has(el.id)) errores.push(`✗ data/${nombre}${ruta}: el id "${el.id}" está repetido.`);
        vistos.add(el.id);
      }
    }
    valor.forEach((el, i) => revisarIds(nombre, el, `${ruta}[${i}]`));
  } else if (valor && typeof valor === 'object') {
    for (const [k, v] of Object.entries(valor)) revisarIds(nombre, v, `${ruta}.${k}`);
  }
}
for (const [nombre, valor] of Object.entries(datos)) revisarIds(nombre, valor);

// claves de textos.json según data/esquema-textos.json (lista de rutas "home.barra.titulo")
if (existsSync('data/esquema-textos.json') && datos['textos.json'] && datos['esquema-textos.json']) {
  const obtener = (obj, ruta) => ruta.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  for (const clave of datos['esquema-textos.json']) {
    const v = obtener(datos['textos.json'], clave);
    if (typeof v !== 'string' || !v.trim()) errores.push(`✗ data/textos.json: falta el texto "${clave}" o está vacío.`);
  }
}

if (errores.length) {
  console.error(errores.join('\n'));
  process.exit(1);
}
console.log(`✓ ${Object.keys(datos).length} archivos de data/ correctos.`);
