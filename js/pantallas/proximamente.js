// Pantalla temporal para las rutas de fases que aún no se construyen.
import { htmlPersonaje } from '../personajes.js';
import { t } from '../textos.js';
import { volver } from '../ui.js';

export function render(app, { def }) {
  app.innerHTML = `
<div class="pantalla proximamente">
  <div class="olas"></div>
  <div class="proximamente__cuerpo">
    ${volver(def.madre || '#/')}
    <span class="pixel proximamente__ante">${t('proximamente.antetitulo')}</span>
    <h1 class="proximamente__titulo">${t(def.titulo)}</h1>
    <div class="proximamente__escena">
      ${htmlPersonaje({ pais: 'cl', cara: 'sonrojo', size: 'clamp(72px, 24vw, 96px)', manos: true })}
      ${htmlPersonaje({ pais: 'pe', cara: 'feliz', size: 'clamp(72px, 24vw, 96px)', flip: true, manos: true })}
    </div>
    <p class="globo">${t('proximamente.manuel')}</p>
    <p class="globo">${t('proximamente.miguel')}</p>
    <a class="boton boton--oceano" href="#/">${t('comun.alClub')}</a>
  </div>
</div>`;
}
