// Pantalla temporal para las rutas de fases que aún no se construyen.
import { htmlPersonaje } from '../personajes.js';
import { esc, volver } from '../ui.js';

export function render(app, { def }) {
  app.innerHTML = `
<div class="pantalla proximamente">
  <div class="olas"></div>
  <div class="proximamente__cuerpo">
    ${volver(def.madre || '#/')}
    <span class="pixel proximamente__ante">PRÓXIMAMENTE</span>
    <h1 class="proximamente__titulo">${esc(def.titulo)}</h1>
    <div class="proximamente__escena">
      ${htmlPersonaje({ pais: 'cl', cara: 'sonrojo', size: 96, manos: true })}
      ${htmlPersonaje({ pais: 'pe', cara: 'feliz', size: 96, flip: true, manos: true })}
    </div>
    <p class="globo"><strong>Manuel:</strong> …Todavía lo estamos armando. No mires.</p>
    <p class="globo"><strong>Miguel:</strong> ¡Ya casi, causa! Vuelve prontito, que te guardo un plato.</p>
    <a class="boton boton--oceano" href="#/">AL CLUB</a>
  </div>
</div>`;
}
