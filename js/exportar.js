// Exportar imágenes (PNG). El video llega en la fase 5.

export function descargarCanvas(canvas, nombre) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error('No se pudo crear la imagen')); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombre;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      resolve();
    }, 'image/png');
  });
}

// Asegura que las fuentes estén listas antes de dibujar texto en un canvas.
export async function fuentesListas(especificaciones) {
  if (!document.fonts) return;
  try { await Promise.all(especificaciones.map((f) => document.fonts.load(f))); } catch { /* usa la fuente de respaldo */ }
}

// Corta un texto en líneas que caben en `ancho`.
export function lineas(ctx, texto, ancho) {
  const palabras = texto.split(/\s+/);
  const res = [];
  let actual = '';
  for (const p of palabras) {
    const prueba = actual ? actual + ' ' + p : p;
    if (ctx.measureText(prueba).width > ancho && actual) {
      res.push(actual);
      actual = p;
    } else {
      actual = prueba;
    }
  }
  if (actual) res.push(actual);
  return res;
}
