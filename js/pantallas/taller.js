// La casita · Taller (ref: prototipo/Taller.dc.html, docs/PANTALLAS.md §10).
// Tu Perú / Tu Chile: 5 caras y 3 conjuntos de ropa (512×512, transparentes).
// Fondos: 4 espacios de 1080×1350 con plantillas de inicio.
import { Lienzo } from '../lienzo.js';
import { CARAS, ballURL, ponerOC, tieneOC, urlOC, usaOC, elegirOC } from '../personajes.js';
import { leer, guardar, idbDisponible, idbLeer, idbGuardar, idbTodos } from '../almacen.js';
import { t, tp, attr } from '../textos.js';

const PESTANAS = [
  { id: 'pe', label: 'taller.pestanaPe', color: 'var(--rojo-pe)' },
  { id: 'cl', label: 'taller.pestanaCl', color: 'var(--azul-cl)' },
  { id: 'fondos', label: 'taller.pestanaFondos', color: 'var(--tinta)' }
];
const NOMBRE_CARA = {
  normal: 'comun.caras.normal',
  feliz: 'comun.caras.feliz',
  enojado: 'comun.caras.enojado',
  sonrojo: 'comun.caras.sonrojo',
  triste: 'comun.caras.triste'
};
const CONJUNTOS = [1, 2, 3];
const FONDOS = ['f1', 'f2', 'f3', 'f4'];
const COLORES = [
  { c: '#D91023', label: 'taller.colorRojo' },
  { c: '#0039A6', label: 'taller.colorAzul' },
  { c: '#FFFFFF', label: 'taller.colorBlanco' },
  { c: '#C68B5E', label: 'taller.colorPiel' },
  { c: '#2B2622', label: 'taller.colorNegro' }
];
const GROSORES = [
  { g: 0.008, label: 'taller.fino', punto: 6 },
  { g: 0.02, label: 'taller.medio', punto: 11 },
  { g: 0.045, label: 'taller.grueso', punto: 18 }
];
const PLANTILLAS = [
  { id: 'playa', label: 'taller.plantillaPlaya' },
  { id: 'cocina', label: 'taller.plantillaCocina' },
  { id: 'cielo', label: 'taller.plantillaCielo' },
  { id: 'blanco', label: 'taller.plantillaBlanco' }
];

const ICONOS = {
  pincel: '<path d="M3 13 L11 5 L13 7 L5 15 Z M11 5 L13 3 L15 5 L13 7" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  borrador: '<path d="M2 11 L9 4 L14 9 L8 15 L4 15 Z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  deshacer: '<path d="M5 4 L2 7 L5 10 M2 7 H10 A4 4 0 0 1 10 15 H7" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  rehacer: '<path d="M11 4 L14 7 L11 10 M14 7 H6 A4 4 0 0 0 6 15 H9" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  limpiar: '<path d="M3 4 H13 M6 4 V2 H10 V4 M4 4 L5 15 H11 L12 4" fill="none" stroke="currentColor" stroke-width="1.6"/>'
};
const icono = (n) => `<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" focusable="false">${ICONOS[n]}</svg>`;

// Silueta base para el calco cuando todavía no hay cara normal.
let silueta = null;
function siluetaURL() {
  if (!silueta) {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const x = c.getContext('2d');
    x.fillStyle = '#2B2622';
    x.beginPath(); x.ellipse(256, 230, 150, 165, 0, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.moveTo(110, 512); x.quadraticCurveTo(120, 400, 256, 395); x.quadraticCurveTo(392, 400, 402, 512); x.fill();
    silueta = c.toDataURL('image/png');
  }
  return silueta;
}

// Plantillas de fondo a 1080×1350.
function plantilla(id) {
  const W = 1080, H = 1350;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');
  const rect = (col, a, b, w, h) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  if (id === 'blanco') { rect('#FFFFFF', 0, 0, W, H); return c; }
  if (id === 'playa') {
    rect('#CFE2EE', 0, 0, W, H);
    rect('#F2C14E', 800, 150, 150, 150);
    rect('#FFFFFF', 120, 200, 200, 44); rect('#FFFFFF', 170, 160, 100, 40);
    for (let i = 0; i < W; i += 60) rect(i % 120 ? '#2C6094' : '#1F4E79', i, 760, 60, 220);
    rect('#EBD5B0', 0, 980, W, H - 980);
    return c;
  }
  if (id === 'cocina') {
    rect('#FBF4E6', 0, 0, W, H);
    for (let i = 0; i < W; i += 96) rect('rgba(180,69,47,0.08)', i, 0, 48, 900);
    rect('#C99A6E', 80, 120, 460, 220); rect('#2B2622', 80, 336, 460, 12);
    rect('#E5ECEF', 780, 260, 240, 640); rect('#2B2622', 780, 520, 240, 10);
    rect('#A8774F', 0, 900, W, 60);
    for (let i = 0; i < W; i += 120) rect(i % 240 ? '#E5D8C3' : '#FFFFFF', i, 960, 120, H - 960);
    return c;
  }
  // cielo
  const g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#8C6BB1'); g.addColorStop(0.45, '#D98BA6'); g.addColorStop(1, '#F2A97A');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  rect('#FFFBF3', 140, 260, 220, 48); rect('#FFFBF3', 640, 480, 180, 40); rect('#FFFBF3', 300, 760, 260, 52);
  for (const [a, b] of [[90, 90], [520, 140], [930, 300], [760, 80], [240, 520]]) rect('#FFE29A', a, b, 16, 16);
  return c;
}

export async function render(app, { def, params }) {
  const hayAlmacen = await idbDisponible();
  const fondos = new Map();
  if (hayAlmacen) {
    try { for (const f of await idbTodos('fondos')) fondos.set(f.id, { blob: f.blob, url: URL.createObjectURL(f.blob) }); } catch { /* nada */ }
  }

  const s = {
    tab: ['pe', 'cl', 'fondos'].includes(params.tab) ? params.tab : 'pe',
    parte: params.parte === 'ropa' ? 'ropa' : 'caras',
    cara: 'normal',
    ropa: 1,
    fondo: 'f1',
    herramienta: 'pincel',
    color: '#2B2622',
    grosor: GROSORES[1].g
  };
  let lienzo = null;
  let turnoCarga = 0;

  app.innerHTML = `
<div class="taller">
  <header class="taller__techo">
    <a class="taller__boton" href="${def.madre}">${t('taller.volver')}</a>
    <a class="taller__boton taller__boton--sol" href="#/casita/fotos">${t('taller.fotos')}</a>
  </header>
  <div class="taller__cuerpo">
    <div class="taller__panel">
      <div class="taller__arriba">
        <div class="taller__pestanas" role="tablist" aria-label="${attr('taller.pestanasAria')}">
          ${PESTANAS.map((p) => `<button type="button" role="tab" class="taller__pestana" data-tab="${p.id}" style="--color:${p.color}">${t(p.label)}</button>`).join('')}
        </div>
        <div id="taller-selector" class="taller__selector"></div>
      </div>
      <div class="taller__abajo">
        <div class="taller__herramientas" role="toolbar" aria-label="${attr('taller.herramientasAria')}">
          <button type="button" class="herr" data-herr="pincel" aria-label="${attr('taller.pincel')}">${icono('pincel')}</button>
          <button type="button" class="herr" data-herr="borrador" aria-label="${attr('taller.borrador')}">${icono('borrador')}</button>
          <span class="taller__sep" aria-hidden="true"></span>
          ${GROSORES.map((g) => `<button type="button" class="herr herr--grosor" data-grosor="${g.g}" aria-label="${attr(g.label)}"><span style="--punto:${g.punto}px"></span></button>`).join('')}
          <span class="taller__sep" aria-hidden="true"></span>
          <button type="button" class="herr" data-accion="deshacer" aria-label="${attr('taller.deshacer')}">${icono('deshacer')}</button>
          <button type="button" class="herr" data-accion="rehacer" aria-label="${attr('taller.rehacer')}">${icono('rehacer')}</button>
          <button type="button" class="herr" data-accion="limpiar" aria-label="${attr('taller.limpiar')}">${icono('limpiar')}</button>
        </div>
        <div class="taller__colores" role="group" aria-label="${attr('taller.coloresAria')}">
          ${COLORES.map((c) => `<button type="button" class="color" data-color="${c.c}" style="--c:${c.c}" aria-label="${attr(c.label)}"></button>`).join('')}
          <label class="color color--libre" title="${attr('taller.colorLibre')}"><span class="sr-only">${t('taller.colorLibre')}</span><input type="color" id="color-libre" value="#F2C14E"></label>
        </div>
        <button type="button" class="boton boton--oceano taller__guardar" id="taller-guardar"></button>
        <p class="taller__estado" id="taller-estado" aria-live="polite">${hayAlmacen ? '' : t('taller.sinAlmacen')}</p>
        <p class="taller__nota">${t('taller.nota')}</p>
      </div>
    </div>
    <div class="taller__lienzo-col">
      <div class="taller__hoja" id="taller-hoja">
        <img class="taller__calco" id="taller-calco" alt="" hidden>
        <canvas class="taller__canvas" id="taller-canvas" role="img"></canvas>
        <span class="taller__dibujando pixel" id="taller-dibujando"></span>
        <span class="taller__guia" id="taller-guia"></span>
      </div>
    </div>
  </div>
</div>`;

  const $ = (sel) => app.querySelector(sel);
  const selector = $('#taller-selector');
  const estado = $('#taller-estado');
  const canvas = $('#taller-canvas');
  const hoja = $('#taller-hoja');
  const calco = $('#taller-calco');

  const esFondo = () => s.tab === 'fondos';
  const idActual = () => (esFondo() ? s.fondo : s.parte === 'caras' ? `${s.tab}:${s.cara}` : `${s.tab}:${s.ropa}`);
  const storeActual = () => (esFondo() ? 'fondos' : s.parte === 'caras' ? 'caras' : 'ropa');
  const nombreActual = () => {
    if (esFondo()) return tp('taller.fondo', { n: FONDOS.indexOf(s.fondo) + 1 });
    if (s.parte === 'caras') return tp(NOMBRE_CARA[s.cara]);
    return tp('taller.conjunto', { n: s.ropa });
  };
  const guardadoEn = (store, id) => (store === 'fondos' ? fondos.has(id) : tieneOC(store, id));

  // Antes de cambiar de dibujo, avisa si hay trazos sin guardar.
  const puedeSalir = () => !lienzo || !lienzo.sucio || window.confirm(tp('taller.descartar'));

  function pintarPestanas() {
    app.querySelectorAll('.taller__pestana').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === s.tab)));
  }

  function miniCara(pais, cara) {
    const id = `${pais}:${cara}`;
    const listo = tieneOC('caras', id);
    return { listo, src: listo ? urlOC('caras', id) : ballURL(pais, cara) };
  }

  function pintarSelector() {
    if (esFondo()) {
      const listos = FONDOS.filter((f) => fondos.has(f)).length;
      selector.innerHTML = `
        <div class="taller__fila"><span class="taller__progreso pixel">${t('taller.progresoFondos', { listos, total: FONDOS.length })}</span></div>
        <div class="taller__tira taller__tira--fondos" role="group" aria-label="${attr('taller.tiraFondos')}">
          ${FONDOS.map((f, i) => {
            const nombre = tp('taller.fondo', { n: i + 1 });
            const g = fondos.get(f);
            return `<button type="button" class="mini mini--fondo" data-fondo="${f}" aria-pressed="${f === s.fondo}" aria-label="${attr('taller.elegir', { nombre, estado: tp(g ? 'taller.listo' : 'taller.vacio') })}">
              ${g ? `<img src="${g.url}" alt="">` : '<span class="mini__mas" aria-hidden="true">+</span>'}
              <span class="mini__nombre">${t('taller.fondo', { n: i + 1 })}</span></button>`;
          }).join('')}
        </div>
        <div class="taller__plantillas"><span>${t('taller.plantillas')}</span>
          ${PLANTILLAS.map((p) => `<button type="button" class="plantilla" data-plantilla="${p.id}">${t(p.label)}</button>`).join('')}
        </div>`;
      return;
    }
    const pais = s.tab;
    const listasCaras = CARAS.filter((c) => tieneOC('caras', `${pais}:${c}`)).length;
    const listosRopa = CONJUNTOS.filter((n) => tieneOC('ropa', `${pais}:${n}`)).length;
    const normal = miniCara(pais, 'normal');
    const tira = s.parte === 'caras'
      ? `<div class="taller__tira" role="group" aria-label="${attr('taller.tiraCaras')}">
          ${CARAS.map((c) => {
            const m = miniCara(pais, c);
            const nombre = tp(NOMBRE_CARA[c]);
            return `<button type="button" class="mini${m.listo ? '' : ' mini--falta'}" data-cara="${c}" aria-pressed="${c === s.cara}" aria-label="${attr('taller.elegir', { nombre, estado: tp(m.listo ? 'taller.lista' : 'taller.falta') })}">
              <img src="${m.src}" alt="" class="${m.listo ? '' : 'mini__ball'}">
              <span class="mini__nombre">${t(NOMBRE_CARA[c])}</span>
              <span class="mini__estado pixel">${t(m.listo ? 'taller.lista' : 'taller.falta')}</span></button>`;
          }).join('')}
        </div>`
      : `<div class="taller__tira" role="group" aria-label="${attr('taller.tiraRopa')}">
          ${CONJUNTOS.map((n) => {
            const id = `${pais}:${n}`;
            const listo = tieneOC('ropa', id);
            const nombre = tp('taller.conjunto', { n });
            return `<button type="button" class="mini" data-ropa="${n}" aria-pressed="${n === s.ropa}" aria-label="${attr('taller.elegir', { nombre, estado: tp(listo ? 'taller.listo' : 'taller.falta') })}">
              <span class="mini__capas"><img src="${normal.src}" alt="" class="${normal.listo ? '' : 'mini__ball'}">${listo ? `<img src="${urlOC('ropa', id)}" alt="">` : ''}</span>
              <span class="mini__nombre">${t('taller.conjunto', { n })}</span>
              <span class="mini__estado pixel">${t(listo ? 'taller.listo' : 'taller.falta')}</span></button>`;
          }).join('')}
        </div>`;
    const toggle = tieneOC('caras', `${pais}:normal`)
      ? `<button type="button" class="taller__ball" id="taller-ball">${t(usaOC(pais) ? 'taller.usarBall' : 'taller.usarOc')}</button>`
      : '';
    selector.innerHTML = `
      <div class="taller__fila">
        <div class="taller__partes" role="group" aria-label="${attr('taller.partesAria')}">
          <button type="button" class="parte" data-parte="caras" aria-pressed="${s.parte === 'caras'}">${t('taller.parteCaras')}</button>
          <button type="button" class="parte" data-parte="ropa" aria-pressed="${s.parte === 'ropa'}">${t('taller.parteRopa')}</button>
        </div>
        <span class="taller__progreso pixel">${s.parte === 'caras'
          ? t('taller.progresoCaras', { listas: listasCaras, total: CARAS.length })
          : t('taller.progresoRopa', { listos: listosRopa, total: CONJUNTOS.length })}</span>
      </div>
      ${tira}
      ${toggle}`;
  }

  function pintarEtiquetas() {
    const nombre = nombreActual();
    $('#taller-dibujando').innerHTML = t('taller.dibujando', { nombre: nombre.toUpperCase() });
    canvas.setAttribute('aria-label', tp('taller.lienzoAria', { nombre }));
    $('#taller-guardar').innerHTML = esFondo() || s.parte === 'ropa'
      ? t('taller.guardarOtro', { nombre: nombre.toUpperCase() })
      : t('taller.guardarCara', { nombre: nombre.toUpperCase() });

    hoja.style.setProperty('--ar', esFondo() ? '0.8' : '1');
    hoja.classList.toggle('taller__hoja--fondo', esFondo());
    // Calco: cara normal (o silueta) debajo del lienzo; nunca se guarda en la imagen.
    let guia = 'taller.guiaFondo';
    calco.hidden = esFondo();
    if (!esFondo()) {
      const normal = urlOC('caras', `${s.tab}:normal`);
      const usarNormal = normal && !(s.parte === 'caras' && s.cara === 'normal');
      calco.src = usarNormal ? normal : siluetaURL();
      calco.classList.toggle('taller__calco--ropa', s.parte === 'ropa');
      guia = s.parte === 'ropa' ? 'taller.guiaRopa' : usarNormal ? 'taller.guiaCara' : 'taller.guiaCaraBase';
    }
    $('#taller-guia').innerHTML = t(guia);
  }

  function pintarHerramientas() {
    app.querySelectorAll('[data-herr]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.herr === s.herramienta)));
    app.querySelectorAll('[data-grosor]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.grosor) === s.grosor)));
    app.querySelectorAll('[data-color]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.color === s.color)));
    if (lienzo) {
      $('[data-accion="deshacer"]').disabled = !lienzo.puedeDeshacer;
      $('[data-accion="rehacer"]').disabled = !lienzo.puedeRehacer;
    }
  }

  // Abre el dibujo elegido en un lienzo nuevo (con su resolución y fondo).
  async function abrirDibujo() {
    const yo = ++turnoCarga;
    if (lienzo) lienzo.destruir();
    const fondo = esFondo();
    pintarEtiquetas();
    lienzo = new Lienzo(canvas, {
      ancho: fondo ? 1080 : 512,
      alto: fondo ? 1350 : 512,
      relleno: fondo ? '#FFFFFF' : null,
      onCambio: pintarHerramientas
    });
    Object.assign(lienzo, { herramienta: s.herramienta, color: s.color, grosor: s.grosor });
    const store = storeActual(), id = idActual();
    let blob = null;
    if (store === 'fondos') blob = fondos.get(id)?.blob || null;
    else if (tieneOC(store, id)) blob = (await idbLeer(store, id).catch(() => null))?.blob || null;
    if (yo !== turnoCarga) return;
    if (blob) {
      const bmp = await createImageBitmap(blob);
      if (yo !== turnoCarga) return;
      lienzo.cargarBase(bmp);
    }
    pintarHerramientas();
  }

  function cambiar(cambio) {
    if (!puedeSalir()) return;
    Object.assign(s, cambio);
    estado.innerHTML = hayAlmacen ? '' : t('taller.sinAlmacen');
    pintarPestanas();
    pintarSelector();
    abrirDibujo();
  }

  app.querySelectorAll('.taller__pestana').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.tab !== s.tab) cambiar({ tab: b.dataset.tab });
  }));

  selector.addEventListener('click', async (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.parte && b.dataset.parte !== s.parte) cambiar({ parte: b.dataset.parte });
    else if (b.dataset.cara && b.dataset.cara !== s.cara) cambiar({ cara: b.dataset.cara });
    else if (b.dataset.ropa && Number(b.dataset.ropa) !== s.ropa) cambiar({ ropa: Number(b.dataset.ropa) });
    else if (b.dataset.fondo && b.dataset.fondo !== s.fondo) cambiar({ fondo: b.dataset.fondo });
    else if (b.dataset.plantilla) lienzo.ponerImagen(plantilla(b.dataset.plantilla));
    else if (b.id === 'taller-ball') {
      const usar = !usaOC(s.tab);
      elegirOC(s.tab, usar);
      pintarSelector();
      estado.innerHTML = t(usar ? 'taller.usandoOc' : 'taller.usandoBall');
    }
  });

  app.querySelectorAll('[data-herr]').forEach((b) => b.addEventListener('click', () => {
    s.herramienta = b.dataset.herr;
    lienzo.herramienta = s.herramienta;
    pintarHerramientas();
  }));
  app.querySelectorAll('[data-grosor]').forEach((b) => b.addEventListener('click', () => {
    s.grosor = Number(b.dataset.grosor);
    lienzo.grosor = s.grosor;
    pintarHerramientas();
  }));
  const ponerColor = (c) => {
    s.color = c;
    s.herramienta = 'pincel';
    Object.assign(lienzo, { color: c, herramienta: 'pincel' });
    pintarHerramientas();
  };
  app.querySelectorAll('[data-color]').forEach((b) => b.addEventListener('click', () => ponerColor(b.dataset.color)));
  $('#color-libre').addEventListener('input', (e) => ponerColor(e.target.value));
  app.querySelectorAll('[data-accion]').forEach((b) => b.addEventListener('click', () => lienzo[b.dataset.accion]()));

  $('#taller-guardar').addEventListener('click', async () => {
    if (!hayAlmacen) { estado.innerHTML = t('taller.sinAlmacen'); return; }
    const boton = $('#taller-guardar');
    boton.disabled = true;
    estado.innerHTML = t('taller.guardando');
    try {
      const store = storeActual(), id = idActual();
      const blob = await lienzo.exportarBlob();
      const registro = { id, blob, actualizado: Date.now() };
      if (store === 'fondos') registro.nombre = nombreActual();
      await idbGuardar(store, registro);
      if (store === 'fondos') {
        const previo = fondos.get(id);
        if (previo) URL.revokeObjectURL(previo.url);
        fondos.set(id, { blob, url: URL.createObjectURL(blob) });
      } else {
        ponerOC(store, id, blob);
        elegirOC(s.tab, true);
      }
      lienzo.marcarGuardado();
      // La primera vez que se guarda un OC se celebra en "Tus OCs ya viven en el club".
      if (store !== 'fondos' && !leer('ocListo')) {
        guardar('ocListo', true);
        location.hash = '#/casita/listo';
        return;
      }
      pintarSelector();
      pintarEtiquetas();
      estado.innerHTML = t('taller.guardado');
    } catch (err) {
      console.error(err);
      estado.innerHTML = t('taller.errorGuardar');
    } finally {
      boton.disabled = false;
    }
  });

  pintarPestanas();
  pintarSelector();
  await abrirDibujo();

  return () => {
    if (lienzo) lienzo.destruir();
    for (const f of fondos.values()) URL.revokeObjectURL(f.url);
  };
}
