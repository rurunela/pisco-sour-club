// Diálogo modal con estilo de postal. Devuelve el id de la opción elegida.
// Escape (o el gesto atrás del sistema dentro del diálogo) elige `alCancelar`.
import { formato } from './textos.js';

let abierto = null;

/**
 * @param {{titulo:string, texto:string, opciones:{id:string, texto:string, clase?:string}[], alCancelar:string, foco?:string}} o
 *   titulo/texto/opciones[].texto: texto plano de tp() (se les aplica el formato seguro).
 */
export function preguntar({ titulo, texto, opciones, alCancelar, foco }) {
  if (abierto) return abierto;
  const d = document.createElement('dialog');
  d.className = 'dialogo';
  d.setAttribute('aria-labelledby', 'dialogo-titulo');
  d.setAttribute('aria-describedby', 'dialogo-texto');
  d.innerHTML = `
    <div class="dialogo__postal">
      <div class="dialogo__estampilla" aria-hidden="true">✉</div>
      <h2 class="dialogo__titulo" id="dialogo-titulo">${formato(titulo)}</h2>
      <p class="dialogo__texto" id="dialogo-texto">${formato(texto)}</p>
      <div class="dialogo__botones">
        ${opciones.map((o) => `<button type="button" class="boton ${o.clase || 'boton--borde'}" data-opcion="${o.id}">${formato(o.texto)}</button>`).join('')}
      </div>
    </div>`;
  document.body.appendChild(d);

  abierto = new Promise((resolve) => {
    const cerrar = (id) => {
      d.close();
      d.remove();
      abierto = null;
      resolve(id);
    };
    d.addEventListener('click', (e) => {
      const b = e.target.closest('[data-opcion]');
      if (b) cerrar(b.dataset.opcion);
    });
    d.addEventListener('cancel', (e) => { e.preventDefault(); cerrar(alCancelar); });
  });
  d.showModal();
  const enfocar = d.querySelector(`[data-opcion="${foco || opciones[0].id}"]`);
  if (enfocar) enfocar.focus();
  return abierto;
}
