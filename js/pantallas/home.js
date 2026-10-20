// Home: hero, la barra, ¿Sabías que…?, malecón, radio, cita, llegado por correo y pie.
import { cargar, delDia, diaLima } from '../datos.js';
import { htmlPersonaje, dibujarBall } from '../personajes.js';
import { esc, svgCopa, PIE } from '../ui.js';
import { esPendiente } from '../config.js';
import { descargarCanvas, fuentesListas, lineas } from '../exportar.js';

const LUGARES = {
  casita: { t: 'La casita', d: 'Aquí viven tus OCs. Dibuja a tu Perú y tu Chile.', href: '#/casita/taller' },
  depa: { t: 'El depa', d: 'Miguel y Manuel viven juntos… y necesitan que alguien los cuide.', href: '#/depa' },
  quiosco: { t: 'Quiosco de recuerdos', d: 'Carnet de socio, postales, wallpapers y stickers para llevar.', href: '#/quiosco' },
  buzon: { t: 'El buzón', d: 'Déjale un dibujito al club. Rurú lo recibe y lo cuelga si le gusta.', href: '#/buzon' },
  faro: { t: 'El faro', d: 'Desde aquí se ven todas las redes del fandom.', href: '#/faro' }
};

const SECCIONES = [
  { id: 'barra', label: 'La barra' },
  { id: 'dato', label: 'Dato' },
  { id: 'malecon', label: 'Malecón' },
  { id: 'redes', label: 'Redes' }
];

function enlaceOPendiente(url, contenido, clase) {
  return esPendiente(url)
    ? `<span class="${clase} es-pendiente" title="Enlace pendiente">${contenido}</span>`
    : `<a class="${clase}" href="${esc(url)}" target="_blank" rel="noopener">${contenido}</a>`;
}

function htmlFuente(dato) {
  const texto = esc(dato.fuente);
  return dato.url && !esPendiente(dato.url)
    ? `Fuente: <a href="${esc(dato.url)}" target="_blank" rel="noopener">${texto}</a>`
    : `Fuente: ${texto}`;
}

function htmlMalecon() {
  return `
<div class="malecon__scroll" tabindex="-1">
  <div class="malecon__escena">
    <div class="nube" style="left:40px;top:30px;width:60px"></div>
    <div class="nube" style="left:540px;top:50px;width:46px"></div>
    <div class="malecon__mar"></div>
    <div class="malecon__muelle"></div>

    <button type="button" class="malecon__obj" data-lugar="casita" aria-label="La casita" aria-controls="malecon-tarjeta" style="left:40px;width:160px;height:170px">
      <span class="pz" style="left:5px;bottom:96px;width:150px;height:70px;background:#B4452F;clip-path:polygon(50% 0,100% 100%,0 100%)"></span>
      <span class="pz pz--borde" style="left:20px;bottom:0;width:120px;height:96px;background:#FFFBF3"></span>
      <span class="pz" style="left:36px;bottom:0;width:26px;height:46px;background:#8E3524"></span>
      <span class="pz pz--borde3" style="left:88px;bottom:40px;width:30px;height:28px;background:#F2C14E"></span>
    </button>

    <button type="button" class="malecon__obj" data-lugar="depa" aria-label="El edificio" aria-controls="malecon-tarjeta" style="left:240px;width:150px;height:230px">
      <span class="pz pz--borde" style="left:0;bottom:0;width:150px;height:220px;background:#E9B872"></span>
      <span class="pz pz--borde3" style="left:18px;bottom:150px;width:30px;height:30px;background:#CFE2EE"></span>
      <span class="pz pz--borde3" style="left:60px;bottom:150px;width:30px;height:30px;background:#CFE2EE"></span>
      <span class="pz pz--borde3" style="left:102px;bottom:150px;width:30px;height:30px;background:#CFE2EE"></span>
      <span class="pz pz--borde3 malecon__ventana" style="left:18px;bottom:60px;width:72px;height:60px;background:#F2C14E">${htmlPersonaje({ pais: 'cl', size: 26 })}${htmlPersonaje({ pais: 'pe', size: 26, flip: true })}</span>
      <span class="pz pz--borde3" style="left:102px;bottom:90px;width:30px;height:30px;background:#CFE2EE"></span>
      <span class="pz" style="left:58px;bottom:0;width:34px;height:44px;background:#8E3524"></span>
    </button>

    <button type="button" class="malecon__obj" data-lugar="quiosco" aria-label="El quiosco" aria-controls="malecon-tarjeta" style="left:430px;width:150px;height:130px">
      <span class="pz pz--borde3" style="left:0;bottom:84px;width:150px;height:30px;background:repeating-linear-gradient(90deg,#B4452F 0 15px,#FFFBF3 15px 30px)"></span>
      <span class="pz pz--borde pixel" style="left:12px;bottom:0;width:126px;height:84px;background:#FFFBF3;display:flex;align-items:center;justify-content:center;font-size:13px;color:#1F4E79">RECUERDOS</span>
    </button>

    <button type="button" class="malecon__obj" data-lugar="buzon" aria-label="El buzón" aria-controls="malecon-tarjeta" style="left:630px;width:70px;height:110px">
      <span class="pz" style="left:30px;bottom:0;width:10px;height:60px;background:#5B4F45"></span>
      <span class="pz pz--borde" style="left:6px;bottom:56px;width:58px;height:48px;background:#1F4E79;border-radius:24px 24px 0 0"></span>
      <span class="pz" style="left:20px;bottom:78px;width:30px;height:5px;background:#2B2622"></span>
    </button>

    <button type="button" class="malecon__obj" data-lugar="faro" aria-label="El faro" aria-controls="malecon-tarjeta" style="left:790px;width:110px;height:236px">
      <span class="pz" style="left:25px;bottom:210px;width:60px;height:26px;background:#2B2622;clip-path:polygon(50% 0,100% 100%,0 100%)"></span>
      <span class="pz pz--borde" style="left:30px;bottom:180px;width:50px;height:30px;background:#F2C14E"></span>
      <span class="pz pz--borde" style="left:32px;bottom:0;width:46px;height:180px;background:repeating-linear-gradient(0deg,#FFFBF3 0 30px,#B4452F 30px 60px)"></span>
    </button>
  </div>
</div>`;
}

export async function render(app, { params }) {
  const [prompts, frases, datos, citas, redes] = await Promise.all(
    ['prompts', 'frases', 'datos', 'citas', 'redes'].map(cargar)
  );

  const ahora = Date.now();
  const pisco = delDia(prompts, ahora);
  const numeroPisco = String((diaLima(ahora) % prompts.length) + 1).padStart(2, '0');
  const charla = delDia(frases.barra, ahora);
  const cita = delDia(citas, ahora);

  app.innerHTML = `
<div class="home">
  <div class="olas"></div><div class="olas--claras"></div>
  <div class="home__contenido">

    <nav class="home__nav" aria-label="Secciones">
      <a class="home__marca pixel" href="#/">PSC ✉</a>
      <div class="home__nav-links">
        ${SECCIONES.map((s) => `<button type="button" class="home__nav-link" data-ir="${s.id}">${s.label}</button>`).join('')}
      </div>
    </nav>

    <header class="hero">
      <div class="hero__texto">
        <span class="pixel hero__antetitulo">Saludos desde la costa del Pacífico</span>
        <h1 class="hero__titulo">Pisco Sour<br><span>Club</span></h1>
        <p class="hero__sub">Una página al Chirú. Pasea, toca lo que te dé curiosidad y llévate una idea para crear.</p>
      </div>
      <div class="postal hero__postal">
        <div class="playa">
          <div class="nube" style="left:10%;top:34px;width:54px"></div>
          <div class="nube" style="left:calc(10% + 12px);top:24px;width:28px;height:10px"></div>
          <div class="nube" style="right:30%;top:64px;width:40px;height:10px"></div>
          <div class="playa__sol"></div>
          <div class="playa__mar"></div>
          <div class="playa__arena"></div>
          <p class="globo hero__globo hero__globo--cl" id="globo-cl" hidden aria-live="polite"></p>
          <p class="globo hero__globo hero__globo--pe" id="globo-pe" hidden aria-live="polite"></p>
          <div class="hero__pjs">
            <button type="button" class="hero__pj" data-pais="cl" aria-label="Tocar a Manuel (Chile)" aria-describedby="globo-cl">${htmlPersonaje({ pais: 'cl', size: 'clamp(76px, 25vw, 112px)', manos: true })}</button>
            <span class="hero__copa">${svgCopa(52, 60)}</span>
            <button type="button" class="hero__pj" data-pais="pe" aria-label="Tocar a Miguel (Perú)" aria-describedby="globo-pe">${htmlPersonaje({ pais: 'pe', size: 'clamp(76px, 25vw, 112px)', flip: true, manos: true })}</button>
          </div>
        </div>
        <div class="postal__pie pixel"><span>LIMA ⇄ SANTIAGO</span><span>tócalos ✦</span></div>
      </div>
    </header>

    <div class="home__fila">
      <section id="barra" class="postal postal--texto barra" aria-labelledby="barra-titulo">
        <div class="estampilla pixel" aria-hidden="true">PE<br>×<br>CL</div>
        <span class="pixel postal__etiqueta">Postal n.º 1</span>
        <h2 id="barra-titulo" class="postal__titulo">La barra</h2>
        <p class="barra__intro">El pisco del día ya está servido. Si quieres quedarte a conversar con ellos, toca la copa.</p>
        <div class="barra__cuerpo">
          <div class="barra__charla">
            <p class="barra__linea barra__linea--cl">${htmlPersonaje({ pais: 'cl', size: 40 })}<span><strong>Manuel:</strong> ${esc(charla.manuel)}</span></p>
            <p class="barra__linea barra__linea--pe">${htmlPersonaje({ pais: 'pe', size: 40, flip: true })}<span><strong>Miguel:</strong> ${esc(charla.miguel)}</span></p>
          </div>
          <div class="barra__pisco">
            <a class="barra__copa" href="#/barra" aria-label="Tocar la copa: conversar en la barra">${svgCopa(64, 74, true)}</a>
            <div class="barra__prompt">
              <span class="pixel barra__prompt-etiqueta">Pisco del día · n.º ${numeroPisco} · ${esc(pisco.tipo)}</span>
              <p class="barra__prompt-texto">${esc(pisco.texto)}</p>
            </div>
          </div>
        </div>
        <span class="pixel postal__pie-texto">Mañana se sirve otro ✦</span>
      </section>

      <section id="dato" class="postal dato" aria-labelledby="dato-titulo">
        <div class="dato__cabeza">
          <h2 id="dato-titulo" class="pixel dato__etiqueta">Postal n.º 2 · ¿Sabías que…?</h2>
          <span class="pixel dato__contador" id="dato-contador"></span>
        </div>
        <p class="dato__texto" id="dato-texto" aria-live="polite"></p>
        <span class="dato__fuente" id="dato-fuente"></span>
        <div class="dato__flechas">
          <button type="button" class="dato__flecha pixel" data-paso="-1" aria-label="Dato anterior">‹</button>
          <button type="button" class="dato__flecha pixel" data-paso="1" aria-label="Dato siguiente">›</button>
        </div>
      </section>
    </div>

    <section id="malecon" class="malecon" aria-labelledby="malecon-titulo">
      <div class="seccion__cabeza">
        <h2 id="malecon-titulo" class="seccion__titulo">El malecón</h2>
        <span class="pixel seccion__nota">Toca algo… ✦</span>
      </div>
      <div class="malecon__marco">${htmlMalecon()}</div>
      <div class="malecon__tarjeta" id="malecon-tarjeta" aria-live="polite">
        <span class="pixel malecon__ayuda">Cada cosa del malecón esconde algo. Toca una.</span>
      </div>
    </section>

    <div class="home__fila">
      <section id="radio" class="postal postal--texto radio" aria-labelledby="radio-titulo">
        <span class="pixel postal__etiqueta">Postal n.º 3 · Radio del muelle</span>
        <div class="radio__fila">
          <a class="radio__dial" href="#/radio" aria-label="Girar el dial: abrir la radio"></a>
          <div class="radio__info">
            <h2 id="radio-titulo" class="radio__nombre">${esc(redes.playlist.nombre)}</h2>
            <span class="radio__nota">Curada por Rurú · gira el dial</span>
          </div>
        </div>
        ${enlaceOPendiente(redes.playlist.spotifyUrl, 'Abrir en Spotify →', 'radio__spotify')}
      </section>

      <section id="cita" class="postal postal--texto cita" aria-labelledby="cita-etiqueta">
        <button type="button" class="cita__estampilla" id="cita-estampilla" aria-label="Estampilla: convertir la cita en postal descargable">${htmlPersonaje({ pais: 'pe', size: 40 })}</button>
        <h2 id="cita-etiqueta" class="pixel postal__etiqueta">Postal n.º 4 · Cita</h2>
        <blockquote class="cita__texto">“${esc(cita.texto)}”</blockquote>
        <span class="cita__autor">— ${esc(cita.autor)}</span>
        <span class="pixel cita__estado" id="cita-estado" aria-live="polite"></span>
      </section>
    </div>

    <section id="redes" class="correo" aria-labelledby="redes-titulo">
      <div class="seccion__cabeza">
        <h2 id="redes-titulo" class="seccion__titulo">Llegado por correo</h2>
        <span class="pixel seccion__nota">${esc(redes.hashtag)}</span>
      </div>
      <div class="correo__grilla">
        ${redes.publicaciones.map((p, i) => {
          const foto = p.imagen
            ? `<img class="correo__img" src="${esc(p.imagen)}" alt="Publicación de ${esc(p.autor)} en ${esc(p.red)}" loading="lazy">`
            : `<div class="correo__img correo__img--vacia">[Publicación de ${esc(p.red)}]</div>`;
          const pie = `<div class="correo__pie">${esc(p.autor)} · ${esc(p.red)}</div>`;
          const giro = [-1, 1, -0.5][i % 3];
          return esPendiente(p.url)
            ? `<div class="correo__polaroid" style="--giro:${giro}deg">${foto}${pie}</div>`
            : `<a class="correo__polaroid" style="--giro:${giro}deg" href="${esc(p.url)}" target="_blank" rel="noopener">${foto}${pie}</a>`;
        }).join('')}
      </div>
      <div class="correo__redes">
        ${redes.enlaces.map((r) => enlaceOPendiente(r.url, esc(r.red), 'pildora')).join('')}
      </div>
    </section>

    <footer class="pie">${PIE}</footer>
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

  // Hero: cada toque muestra la siguiente frase (3 por personaje).
  const turnos = { cl: -1, pe: -1 };
  const lineasHero = { cl: frases.hero.manuel, pe: frases.hero.miguel };
  app.querySelectorAll('.hero__pj').forEach((b) => b.addEventListener('click', () => {
    const pais = b.dataset.pais;
    turnos[pais] = (turnos[pais] + 1) % lineasHero[pais].length;
    const globo = app.querySelector('#globo-' + pais);
    globo.textContent = lineasHero[pais][turnos[pais]];
    globo.hidden = false;
    b.classList.remove('salta');
    void b.offsetWidth;
    b.classList.add('salta');
  }));

  // ¿Sabías que…?
  let iDato = 0;
  const pintarDato = () => {
    const d = datos[iDato];
    app.querySelector('#dato-texto').textContent = d.texto;
    app.querySelector('#dato-contador').textContent = `${iDato + 1} / ${datos.length}`;
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
        <strong class="malecon__nombre">${esc(lugar.t)}</strong>
        <span class="malecon__desc">${esc(lugar.d)}</span>
      </div>
      <a class="malecon__entrar" href="${lugar.href}">Entrar →</a>`;
  }));

  // Cita: la estampilla genera la postal descargable.
  const estado = app.querySelector('#cita-estado');
  app.querySelector('#cita-estampilla').addEventListener('click', async () => {
    estado.textContent = 'Preparando la postal…';
    try {
      await descargarCanvas(await postalCita(cita), `pisco-sour-club-cita-${cita.id}.png`);
      estado.textContent = '✦ ¡Postal lista! Revisa tus descargas.';
    } catch {
      estado.textContent = 'No se pudo crear la postal. Inténtalo otra vez.';
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
  ctx.fillText('Postal n.º 4 · Cita', 140, 210);

  ctx.fillStyle = '#1F4E79';
  ctx.font = 'italic 500 64px Fraunces, Georgia, serif';
  const ls = lineas(ctx, `“${cita.texto}”`, W - 300);
  ls.forEach((l, i) => ctx.fillText(l, 140, 460 + i * 88));

  ctx.fillStyle = '#5B4F45';
  ctx.font = '600 32px Karla, sans-serif';
  ctx.fillText(`— ${cita.autor}`, 140, 460 + ls.length * 88 + 40);

  dibujarBall(ctx, 'cl', 'sonrojo', 140, H - 360, 150);
  dibujarBall(ctx, 'pe', 'feliz', 300, H - 360, 150, true);

  ctx.fillStyle = '#5B4F45';
  ctx.font = '500 32px "Pixelify Sans", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('Pisco Sour Club', W - 140, H - 170);
  ctx.fillText('LIMA ⇄ SANTIAGO', W - 140, H - 220);
  return c;
}
