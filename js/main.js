import { cargarTextos } from './textos.js';
import { iniciarRouter } from './router.js';

await cargarTextos();
iniciarRouter(document.getElementById('app'));
