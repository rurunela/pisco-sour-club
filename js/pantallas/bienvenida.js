// Bienvenida: solo en la primera visita (ref: prototipo/Bienvenida.dc.html).
import { cargar, alAzar } from '../datos.js';
import { leer, guardar } from '../almacen.js';
import { htmlPersonaje } from '../personajes.js';
import { t, tp, formato } from '../textos.js';

const EQUIPOS = [
  { id: 'pe', label: 'bienvenida.equipoPe', color: 'var(--rojo-pe)' },
  { id: 'cl', label: 'bienvenida.equipoCl', color: 'var(--azul-cl)' },
  { id: 'ambos', label: 'bienvenida.equipoAmbos', color: 'var(--coral)' }
];

const pzArriba = (x, y, w, h, estilo) => `<span class="pz pz--arriba" style="--x:${x};--y:${y};--w:${w};--h:${h};${estilo}"></span>`;

export async function render(app) {
  const frases = await cargar('frases');
  const saludo = alAzar(frases.bienvenida) || { manuel: '', miguel: '' };
  let equipo = leer('equipo', 'ambos');

  app.innerHTML = `
<div class="pantalla bienvenida">
  <div class="olas"></div>
  <div class="bienvenida__marco">
    <div class="escena bienvenida__escena" style="--ancho:358;--alto:330">
      ${pzArriba(30, 40, 50, 12, 'background:#FFFFFF')}
      ${pzArriba(284, 24, 44, 44, 'background:var(--sol)')}
      <span class="playa__mar"></span>
      <span class="playa__arena"></span>
      <p class="globo escena__globo escena__globo--izq bienvenida__globo">${formato(saludo.manuel)}</p>
      <p class="globo escena__globo escena__globo--der bienvenida__globo">${formato(saludo.miguel)}</p>
      <div class="escena__fila bienvenida__pjs">
        ${htmlPersonaje({ pais: 'cl', size: 'calc(104 * var(--u))', manos: true, etiqueta: tp('bienvenida.saludoManuel') })}
        ${htmlPersonaje({ pais: 'pe', cara: 'feliz', size: 'calc(104 * var(--u))', flip: true, manos: true, etiqueta: tp('bienvenida.saludoMiguel') })}
      </div>
    </div>
  </div>

  <div class="bienvenida__cuerpo">
    <span class="pixel bienvenida__ante">${t('bienvenida.antetitulo')}</span>
    <h1 class="bienvenida__titulo">${t('bienvenida.titulo')} <span>${t('bienvenida.tituloCursiva')}</span></h1>
    <p class="bienvenida__texto" id="pregunta-equipo">${t('bienvenida.pregunta')}</p>
    <div class="bienvenida__equipos" role="group" aria-labelledby="pregunta-equipo">
      ${EQUIPOS.map((e) => `<button type="button" class="equipo" data-equipo="${e.id}" style="--color:${e.color}">${t(e.label)}</button>`).join('')}
    </div>
    <button type="button" class="boton boton--oceano bienvenida__entrar" id="entrar">${t('bienvenida.entrar')}</button>
    <span class="bienvenida__credito">${t('bienvenida.credito')}</span>
  </div>
</div>`;

  const botones = app.querySelectorAll('.equipo');
  const marcar = () => botones.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.equipo === equipo)));
  marcar();
  botones.forEach((b) => b.addEventListener('click', () => {
    equipo = b.dataset.equipo;
    guardar('equipo', equipo);
    marcar();
  }));

  app.querySelector('#entrar').addEventListener('click', () => {
    guardar('equipo', equipo);
    guardar('visto', true);
    location.hash = '#/';
  });
}
