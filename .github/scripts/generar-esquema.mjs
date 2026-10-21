// Genera data/esquema-textos.json: todas las claves de textos que usa el código en js/.
// Uso: node .github/scripts/generar-esquema.mjs
// Una clave es una cadena literal 'seccion.algo' cuya sección existe en data/textos.json.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const textos = JSON.parse(readFileSync('data/textos.json', 'utf8'));
const secciones = Object.keys(textos);
const patron = new RegExp(`['"\`]((?:${secciones.join('|')})\\.[A-Za-z0-9_.]+)['"\`]`, 'g');

function archivos(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? archivos(p) : p.endsWith('.js') ? [p] : [];
  });
}

const claves = new Set();
for (const archivo of archivos('js')) {
  if (archivo.endsWith('textos-respaldo.js')) continue;
  for (const m of readFileSync(archivo, 'utf8').matchAll(patron)) claves.add(m[1]);
}

const lista = [...claves].sort();
writeFileSync('data/esquema-textos.json', JSON.stringify(lista, null, 2) + '\n');
console.log(`✓ ${lista.length} claves en data/esquema-textos.json`);
