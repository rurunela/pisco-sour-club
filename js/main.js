import { cargarTextos } from './textos.js';
import { cargarOCs } from './personajes.js';
import { iniciarRouter } from './router.js';

await Promise.all([cargarTextos(), cargarOCs()]);
iniciarRouter(document.getElementById('app'));
