// Home: hero, la barra, ¿Sabías que…?, malecón, radio, cita, llegado por correo y pie.
import { cargar, delDia, diaLima, activos } from '../datos.js';
import { htmlPersonaje, dibujarBall } from '../personajes.js';
import { t, tp, attr, formato, plano } from '../textos.js';
import { esc, svgCopa } from '../ui.js';
import { leer, guardar } from '../almacen.js';
import { esPendiente } from '../config.js';
import { descargarCanvas, fuentesListas, lineas } from '../exportar.js';

const LUGARES = {
  casita: { nombre: 'home.malecon.casita.nombre', desc: 'home.malecon.casita.descripcion', href: '#/casita/taller' },
  depa: { nombre: 'home.malecon.depa.nombre', desc: 'home.malecon.depa.descripcion', href: '#/depa' },
  quiosco: { nombre: 'home.malecon.quiosco.nombre', desc: 'home.malecon.quiosco.descripcion', href: '#/quiosco' },
  buzon: { nombre: 'home.malecon.buzon.nombre', desc: 'home.malecon.buzon.descripcion', href: '#/buzon' },
  faro: { nombre: 'home.malecon.faro.nombre', desc: 'home.malecon.faro.descripcion', href: '#/faro' }
};

const SECCIONES = [
  { id: 'barra', label: 'home.nav.barra' },
  { id: 'dato', label: 'home.nav.dato' },
  { id: 'malecon', label: 'home.nav.malecon' },
  { id: 'redes', label: 'home.nav.redes' }
];

// Pieza de escena en px lógicos (ver docs/RESPONSIVE.md §3).
const pz = (x, b, w, h, estilo = '', clase = '') => `<span class="pz ${clase}" style="--x:${x};--b:${b};--w:${w};--h:${h};${estilo}"></span>`;
const pzArriba = (x, y, w, h, estilo = '') => `<span class="pz pz--arriba" style="--x:${x};--y:${y};--w:${w};--h:${h};${estilo}"></span>`;

function enlaceOPendiente(url, contenidoHtml, clase) {
  return esPendiente(url)
    ? `<span class="${clase} es-pendiente" title="${attr('comun.enlacePendiente')}">${contenidoHtml}</span>`
    : `<a class="${clase}" href="${esc(url)}" target="_blank" rel="noopener">${contenidoHtml}</a>`;
}

function htmlFuente(dato) {
  const fuente = dato.url && !esPendiente(dato.url)
    ? `<a href="${esc(dato.url)}" target="_blank" rel="noopener">${esc(dato.fuente)}</a>`
    : esc(dato.fuente);
  return t('comun.fuente', { fuente: '\u0000' }).replace('\u0000', fuente);
}

function objeto(id, x, w, h, piezas) {
  return `<button type="button" class="malecon__obj" data-lugar="${id}" aria-label="${attr(LUGARES[id].nombre)}" aria-controls="malecon-tarjeta" aria-pressed="false" style="--x:${x};--w:${w};--h:${h}">${piezas}</button>`;
}

function htmlMalecon() {
  const borde = 'pz--borde', borde3 = 'pz--borde3';
  return `
<div class="malecon__scroll" id="malecon-scroll">
  <div class="escena malecon__escena" style="--ancho:1000;--alto:320">
    ${pzArriba(40, 30, 60, 14, 'background:#FFFFFF')}
    ${pzArriba(540, 50, 46, 12, 'background:#FFFFFF')}
    ${pz(0, 0, 1000, 44, '', 'malecon__mar')}
    ${pz(0, 44, 1000, 30, '', 'malecon__muelle')}
    ${objeto('casita', 40, 160, 170,
      pz(5, 96, 150, 70, 'background:#B4452F;clip-path:polygon(50% 0,100% 100%,0 100%)') +
      pz(20, 0, 120, 96, 'background:#FFFBF3', borde) +
      pz(36, 0, 26, 46, 'background:#8E3524') +
      pz(88, 40, 30, 28, 'background:#F2C14E', borde3))}
    ${objeto('depa', 240, 150, 230,
      pz(0, 0, 150, 220, 'background:#E9B872', borde) +
      pz(18, 150, 30, 30, 'background:#CFE2EE', borde3) +
      pz(60, 150, 30, 30, 'background:#CFE2EE', borde3) +
      pz(102, 150, 30, 30, 'background:#CFE2EE', borde3) +
      `<span class="pz pz--borde3 malecon__ventana" style="--x:18;--b:60;--w:72;--h:60;background:#F2C14E">${htmlPersonaje({ pais: 'cl', size: 'calc(26 * var(--u))' })}${htmlPersonaje({ pais: 'pe', size: 'calc(26 * var(--u))', flip: true })}</span>` +
      pz(102, 90, 30, 30, 'background:#CFE2EE', borde3) +
      pz(58, 0, 34, 44, 'background:#8E3524'))}
    ${objeto('quiosco', 430, 150, 130,
      pz(0, 84, 150, 30, 'background:repeating-linear-gradient(90deg,#B4452F 0 10%,#FFFBF3 10% 20%)', borde3) +
      `<span class="pz pz--borde malecon__letrero pixel" style="--x:12;--b:0;--w:126;--h:84">${t('home.malecon.letreroQuiosco')}</span>`)}
    ${objeto('buzon', 630, 70, 110,
      pz(30, 0, 10, 60, 'background:#5B4F45') +
      pz(6, 56, 58, 48, 'background:#1F4E79;border-radius:calc(24 * var(--u)) calc(24 * var(--u)) 0 0', borde) +
      pz(20, 78, 30, 5, 'background:#2B2622'))}
    ${objeto('faro', 790, 110, 236,
      pz(25, 210, 60, 26, 'background:#2B2622;clip-path:polygon(50% 0,100% 100%,0 100%)') +
      pz(30, 180, 50, 30, 'background:#F2C14E', borde) +
      pz(32, 0, 46, 180, 'background:repeating-linear-gradient(0deg,#FFFBF3 0 16.66%,#B4452F 16.66% 33.33%)', borde))}
  </div>
  <span class="malecon__desliza pixel" id="malecon-desliza" hidden>${t('home.malecon.desliza')}</span>
</div>`;
}

export async function render(app, { params }) {
  const [prompts, frases, datosLista, citas, redes] = await Promise.all(
    ['prompts', 'frases', 'datos', 'citas', 'redes'].map(cargar)
  );

  const ahora = Date.now();
  const listaPrompts = activos(prompts);
  const pisco = delDia(listaPrompts, ahora);
  const numeroPisco = String((diaLima(ahora) % listaPrompts.length) + 1).padStart(2, '0');
  const charla = delDia(frases.barra, ahora);
  const cita = delDia(citas, ahora);
  const datos = activos(datosLista);
  const publicaciones = activos(redes.publicaciones);
  const enlaces = activos(redes.enlaces);
  const ball = (opc) => htmlPersonaje(opc);

  app.innerHTML = `
<div class="home">
  <div class="olas"></div><div class="olas--claras"></div>
  <div class="home__contenido">

    <nav class="home__nav" aria-label="${attr('home.nav.aria')}">
      <a class="home__marca pixel" href="#/">${t('home.nav.marca')}</a>
      <div class="home__nav-links">
        ${SECCIONES.map((s) => `<button type="button" class="home__nav-link" data-ir="${s.id}">${t(s.label)}</button>`).join('')}
      </div>
    </nav>

    <header class="hero">
      <div class="hero__texto">
        <span class="pixel hero__antetitulo">${t('home.hero.antetitulo')}</span>
        <h1 class="hero__titulo">${t('home.hero.titulo')}<br><span>${t('home.hero.tituloCursiva')}</span></h1>
        <p class="hero__sub">${t('home.hero.sub')}</p>
      </div>
      <div class="postal hero__postal">
        <div class="escena playa" style="--ancho:400;--alto:330">
          ${pzArriba(40, 34, 54, 14, 'background:#FFFFFF')}
          ${pzArriba(52, 24, 28, 10, 'background:#FFFFFF')}
          ${pzArriba(240, 64, 40, 10, 'background:#FFFFFF')}
          ${pzArriba(308, 28, 52, 52, 'background:var(--sol)')}
          <span class="playa__mar"></span>
          <span class="playa__arena"></span>
          <p class="globo escena__globo escena__globo--izq" id="globo-cl" hidden aria-live="polite"></p>
          <p class="globo escena__globo escena__globo--der" id="globo-pe" hidden aria-live="polite"></p>
          <div class="escena__fila hero__pjs">
            <button type="button" class="hero__pj" data-pais="cl" aria-label="${attr('home.hero.tocarManuel')}" aria-describedby="globo-cl">${ball({ pais: 'cl', size: 'calc(112 * var(--u))', manos: true })}</button>
            ${svgCopa('calc(52 * var(--u))', 'calc(60 * var(--u))')}
            <button type="button" class="hero__pj" data-pais="pe" aria-label="${attr('home.hero.tocarMiguel')}" aria-describedby="globo-pe">${ball({ pais: 'pe', size: 'calc(112 * var(--u))', flip: true, manos: true })}</button>
          </div>
        </div>
        <div class="postal__pie pixel"><span>${t('home.hero.postalIzquierda')}</span><span>${t('home.hero.postalDerecha')}</span></div>
      </div>
    </header>

    <div class="home__fila home__fila--barra">
      <section id="barra" class="postal postal--texto barra" aria-labelledby="barra-titulo">
        <div class="estampilla pixel" aria-hidden="true">${t('home.barra.estampilla')}</div>
        <span class="pixel postal__etiqueta">${t('home.barra.etiqueta')}</span>
        <h2 id="barra-titulo" class="postal__titulo">${t('home.barra.titulo')}</h2>
        <p class="barra__intro">${t('home.barra.intro')}</p>
        <div class="barra__cuerpo">
          <div class="barra__charla">
            <p class="barra__linea barra__linea--cl">${ball({ pais: 'cl', size: 40 })}<span>${t('home.barra.linea', { nombre: tp('comun.manuel'), texto: plano(charla.manuel) })}</span></p>
            <p class="barra__linea barra__linea--pe">${ball({ pais: 'pe', size: 40, flip: true })}<span>${t('home.barra.linea', { nombre: tp('comun.miguel'), texto: plano(charla.miguel) })}</span></p>
          </div>
          <div class="barra__pisco">
            <a class="barra__copa" href="#/barra" aria-label="${attr('home.barra.copa')}">${svgCopa('64px', '74px', true)}</a>
            <div class="barra__prompt">
              <span class="pixel barra__prompt-etiqueta">${t('home.barra.pisco', { numero: numeroPisco, tipo: pisco.tipo })}</span>
              <p class="barra__prompt-texto">${formato(pisco.texto)}</p>
            </div>
          </div>
        </div>
        <span class="pixel postal__pie-texto">${t('home.barra.pie')}</span>
      </section>

      <section id="dato" class="postal dato" aria-labelledby="dato-titulo">
        <div class="dato__cabeza">
          <h2 id="dato-titulo" class="pixel dato__etiqueta">${t('home.dato.etiqueta')}</h2>
          <span class="pixel dato__contador" id="dato-contador"></span>
        </div>
        <p class="dato__texto" id="dato-texto" aria-live="polite"></p>
        <span class="dato__fuente" id="dato-fuente"></span>
        <div class="dato__flechas">
          <button type="button" class="dato__flecha pixel" data-paso="-1" aria-label="${attr('home.dato.anterior')}">‹</button>
          <button type="button" class="dato__flecha pixel" data-paso="1" aria-label="${attr('home.dato.siguiente')}">›</button>
        </div>
      </section>
    </div>

    <section id="malecon" class="malecon" aria-labelledby="malecon-titulo">
      <div class="seccion__cabeza">
        <h2 id="malecon-titulo" class="seccion__titulo">${t('home.malecon.titulo')}</h2>
        <span class="pixel seccion__nota">${t('home.malecon.nota')}</span>
      </div>
      <div class="malecon__marco">${htmlMalecon()}</div>
      <div class="malecon__tarjeta" id="malecon-tarjeta" aria-live="polite">
        <span class="pixel malecon__ayuda">${t('home.malecon.ayuda')}</span>
      </div>
    </section>

    <div class="home__fila home__fila--dos">
      <section id="radio" class="postal postal--texto radio" aria-labelledby="radio-titulo">
        <span class="pixel postal__etiqueta">${t('home.radio.etiqueta')}</span>
        <div class="radio__fila">
          <a class="radio__dial" href="#/radio" aria-label="${attr('home.radio.dial')}"></a>
          <div class="radio__info">
            <h2 id="radio-titulo" class="radio__nombre">${formato(redes.playlist.nombre)}</h2>
            <span class="radio__nota">${t('home.radio.nota')}</span>
          </div>
        </div>
        ${enlaceOPendiente(redes.playlist.spotifyUrl, t('home.radio.spotify'), 'radio__spotify')}
      </section>

      <section id="cita" class="postal postal--texto cita" aria-labelledby="cita-etiqueta">
        <button type="button" class="cita__estampilla" id="cita-estampilla" aria-label="${attr('home.cita.estampilla')}">${ball({ pais: 'pe', size: 40 })}</button>
        <h2 id="cita-etiqueta" class="pixel postal__etiqueta">${t('home.cita.etiqueta')}</h2>
        <blockquote class="cita__texto">“${formato(cita.texto)}”</blockquote>
        <span class="cita__autor">${t('home.cita.autor', { autor: cita.autor })}</span>
        <span class="pixel cita__estado" id="cita-estado" aria-live="polite"></span>
      </section>
    </div>

    <section id="redes" class="correo" aria-labelledby="redes-titulo">
      <div class="seccion__cabeza">
        <h2 id="redes-titulo" class="seccion__titulo">${t('home.correo.titulo')}</h2>
        <span class="pixel seccion__nota">${esc(redes.hashtag)}</span>
      </div>
      <div class="correo__grilla">
        ${publicaciones.map((p, i) => {
          const vars = { red: p.red, autor: p.autor };
          const foto = p.imagen
            ? `<img class="correo__img" src="${esc(p.imagen)}" alt="${attr('home.correo.alt', vars)}" loading="lazy">`
            : `<div class="correo__img correo__img--vacia">${t('home.correo.vacia', vars)}</div>`;
          const pie = `<div class="correo__pie">${t('home.correo.pie', vars)}</div>`;
          const giro = [-1, 1, -0.5][i % 3];
          return esPendiente(p.url)
            ? `<div class="correo__polaroid" style="--giro:${giro}deg">${foto}${pie}</div>`
            : `<a class="correo__polaroid" style="--giro:${giro}deg" href="${esc(p.url)}" target="_blank" rel="noopener">${foto}${pie}</a>`;
        }).join('')}
      </div>
      <div class="correo__redes">
        ${enlaces.map((r) => enlaceOPendiente(r.url, esc(r.red), 'pildora')).join('')}
      </div>
    </section>

    <footer class="pie">${t('comun.pie')}</footer>
  </div>
  <div class="olas--claras"></div><div class="olas"></div>
</div>`;

  // Navegación interna por secciones (el # lo usa el router).
  const irA = (id, suave = true) => {
    const destino = app.querySelector('#' + CSS.escape(id));
    if (destino) destino.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' });
  };
  app.querySelectorAll('[data-ir]').forEach((b) => b.addEventListener('click', () => irA(b.dataset.ir)));
  if (params.ir) requestAnimationFrame(() => irA(params.ir, false));

  // Hero: cada toque muestra la siguiente frase de la lista.
  const turnos = { cl: -1, pe: -1 };
  const lineasHero = { cl: activos(frases.hero.manuel), pe: activos(frases.hero.miguel) };
  app.querySelectorAll('.hero__pj').forEach((b) => b.addEventListener('click', () => {
    const pais = b.dataset.pais;
    const lista = lineasHero[pais];
    if (!lista.length) return;
    turnos[pais] = (turnos[pais] + 1) % lista.length;
    const globo = app.querySelector('#globo-' + pais);
    globo.innerHTML = formato(lista[turnos[pais]]);
    globo.hidden = false;
    b.classList.remove('salta');
    void b.offsetWidth;
    b.classList.add('salta');
  }));

  // ¿Sabías que…?
  let iDato = 0;
  const pintarDato = () => {
    const d = datos[iDato];
    if (!d) return;
    app.querySelector('#dato-texto').innerHTML = formato(d.texto);
    app.querySelector('#dato-contador').innerHTML = t('home.dato.contador', { n: iDato + 1, total: datos.length });
    app.querySelector('#dato-fuente').innerHTML = htmlFuente(d);
  };
  pintarDato();
  app.querySelectorAll('.dato__flecha').forEach((b) => b.addEventListener('click', () => {
    iDato = (iDato + Number(b.dataset.paso) + datos.length) % datos.length;
    pintarDato();
  }));

  // Malecón: primer toque muestra la tarjeta, segundo toque entra.
  const tarjeta = app.querySelector('#malecon-tarjeta');
  let lugarActual = null;
  app.querySelectorAll('.malecon__obj').forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.lugar;
    const lugar = LUGARES[id];
    if (lugarActual === id) { location.hash = lugar.href; return; }
    lugarActual = id;
    app.querySelectorAll('.malecon__obj').forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    tarjeta.innerHTML = `
      <div class="malecon__info">
        <strong class="malecon__nombre">${t(lugar.nombre)}</strong>
        <span class="malecon__desc">${t(lugar.desc)}</span>
      </div>
      <a class="malecon__entrar" href="${lugar.href}">${t('home.malecon.entrar')}</a>`;
  }));

  // Pista "desliza →" la primera vez (solo se ve en pantallas angostas, por CSS).
  const scroll = app.querySelector('#malecon-scroll');
  const pista = app.querySelector('#malecon-desliza');
  if (!leer('pistaMalecon')) {
    pista.hidden = false;
    scroll.addEventListener('scroll', () => {
      if (scroll.scrollLeft > 24) { pista.hidden = true; guardar('pistaMalecon', true); }
    }, { passive: true });
  }

  // Cita: la estampilla genera la postal descargable.
  const estado = app.querySelector('#cita-estado');
  app.querySelector('#cita-estampilla').addEventListener('click', async () => {
    estado.innerHTML = t('home.cita.preparando');
    try {
      await descargarCanvas(await postalCita(cita), tp('descargas.cita.archivo', { id: cita.id }));
      estado.innerHTML = t('home.cita.lista');
    } catch {
      estado.innerHTML = t('home.cita.error');
    }
  });
}

// Postal 1080×1350 con la cita del día.
async function postalCita(cita) {
  await fuentesListas(['italic 500 64px Fraunces', '500 36px "Pixelify Sans"', '600 32px Karla']);
  const W = 1080, H = 1350;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#F3E8D6';
  ctx.fillRect(0, 0, W, H);
  for (let x = 0; x < W; x += 40) {
    ctx.fillStyle = (x / 40) % 2 ? '#3E78A8' : '#1F4E79';
    ctx.fillRect(x, 0, 40, 28);
    ctx.fillRect(x, H - 28, 40, 28);
  }
  ctx.fillStyle = '#E2D2B8';
  ctx.fillRect(84, 112, W - 156, H - 210);
  ctx.fillStyle = '#FFFBF3';
  ctx.fillRect(72, 96, W - 156, H - 210);

  // Estampilla
  ctx.setLineDash([14, 10]);
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#1F4E79';
  ctx.fillStyle = '#EAF1F6';
  ctx.fillRect(W - 290, 150, 160, 190);
  ctx.strokeRect(W - 290, 150, 160, 190);
  ctx.setLineDash([]);
  dibujarBall(ctx, 'pe', 'feliz', W - 270, 185, 120);

  ctx.fillStyle = '#B4452F';
  ctx.font = '500 36px "Pixelify Sans", monospace';
  ctx.fillText(tp('descargas.cita.etiqueta'), 140, 210);

  // La cita se achica si es muy larga, para que siempre quepa.
  let tam = 68, ls;
  do {
    tam -= 4;
    ctx.font = `italic 500 ${tam}px Fraunces, Georgia, serif`;
    ls = lineas(ctx, `“${plano(cita.texto)}”`, W - 300);
  } while (ls.length * (tam + 24) > 620 && tam > 32);
  const alto = tam + 24;
  ctx.fillStyle = '#1F4E79';
  ls.forEach((l, i) => ctx.fillText(l, 140, 460 + i * alto));

  ctx.fillStyle = '#5B4F45';
  ctx.font = '600 32px Karla, sans-serif';
  ctx.fillText(tp('descargas.cita.autor', { autor: plano(cita.autor) }), 140, 460 + ls.length * alto + 40);

  dibujarBall(ctx, 'cl', 'sonrojo', 140, H - 360, 150);
  dibujarBall(ctx, 'pe', 'feliz', 300, H - 360, 150, true);

  ctx.fillStyle = '#5B4F45';
  ctx.font = '500 32px "Pixelify Sans", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(tp('descargas.cita.marca'), W - 140, H - 170);
  ctx.fillText(tp('descargas.cita.ruta'), W - 140, H - 220);
  return c;
}
