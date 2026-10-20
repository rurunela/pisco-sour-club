// Bienvenida: solo en la primera visita (ref: prototipo/Bienvenida.dc.html).
import { cargar } from '../datos.js';
import { leer, guardar } from '../almacen.js';
import { htmlPersonaje } from '../personajes.js';
import { esc } from '../ui.js';

const EQUIPOS = [
  { id: 'pe', label: 'Perú', color: 'var(--rojo-pe)' },
  { id: 'cl', label: 'Chile', color: 'var(--azul-cl)' },
  { id: 'ambos', label: 'Los dos', color: 'var(--coral)' }
];

export async function render(app) {
  const frases = await cargar('frases');
  let equipo = leer('equipo', 'ambos');

  app.innerHTML = `
<div class="pantalla bienvenida">
  <div class="olas"></div>
  <div class="bienvenida__postal">
    <div class="nube" style="left:30px;top:40px;width:50px;height:12px"></div>
    <div class="bienvenida__sol"></div>
    <div class="playa__mar"></div>
    <div class="playa__arena"></div>
    <p class="globo bienvenida__globo bienvenida__globo--cl">${esc(frases.bienvenida.manuel)}</p>
    <p class="globo bienvenida__globo bienvenida__globo--pe">${esc(frases.bienvenida.miguel)}</p>
    <div class="bienvenida__pjs">
      ${htmlPersonaje({ pais: 'cl', size: 'clamp(84px, 27vw, 104px)', manos: true, etiqueta: 'Manuel (Chile) saluda' })}
      ${htmlPersonaje({ pais: 'pe', cara: 'feliz', size: 'clamp(84px, 27vw, 104px)', flip: true, manos: true, etiqueta: 'Miguel (Perú) saluda' })}
    </div>
  </div>

  <div class="bienvenida__cuerpo">
    <span class="pixel bienvenida__ante">UNA PÁGINA AL CHIRÚ</span>
    <h1 class="bienvenida__titulo">Pisco Sour <span>Club</span></h1>
    <p class="bienvenida__texto" id="pregunta-equipo">Aquí casi nada dice «juega». Toca lo que te dé curiosidad. ¿De qué lado de la barra te sientas?</p>
    <div class="bienvenida__equipos" role="group" aria-labelledby="pregunta-equipo">
      ${EQUIPOS.map((t) => `<button type="button" class="equipo" data-equipo="${t.id}" style="--color:${t.color}">${t.label}</button>`).join('')}
    </div>
    <button type="button" class="boton boton--oceano bienvenida__entrar" id="entrar">ENTRAR AL CLUB</button>
    <span class="bienvenida__credito">Proyecto fan de Rurú · Personajes de Latin Hetalia</span>
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
