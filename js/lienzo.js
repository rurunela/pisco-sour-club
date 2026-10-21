// Motor de dibujo reutilizable (taller, comida, buzón).
// Los trazos se guardan como vectores normalizados (0–1): así el lienzo se ve nítido con
// devicePixelRatio, deshacer/rehacer no copia imágenes y se exporta a la resolución final.
// Los 20 trazos más recientes se pueden deshacer; los anteriores se "aplanan" en la base.

const MAX_PASOS = 20;

function pintar(ctx, op, W, H, relleno) {
  if (op.tipo === 'limpiar') {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    if (relleno) { ctx.fillStyle = relleno; ctx.fillRect(0, 0, W, H); }
    ctx.restore();
    return;
  }
  if (op.tipo === 'imagen') {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(op.imagen, 0, 0, W, H);
    ctx.restore();
    return;
  }
  const borra = op.herramienta === 'borrador';
  ctx.save();
  ctx.globalCompositeOperation = borra && !relleno ? 'destination-out' : 'source-over';
  const color = borra ? (relleno || '#000') : op.color;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = op.grosor * W;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const p = op.puntos.map(([x, y]) => [x * W, y * H]);
  if (p.length === 1) {
    ctx.beginPath();
    ctx.arc(p[0][0], p[0][1], ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Curva suave por los puntos medios.
    ctx.beginPath();
    ctx.moveTo(p[0][0], p[0][1]);
    for (let i = 1; i < p.length - 1; i++) {
      const mx = (p[i][0] + p[i + 1][0]) / 2, my = (p[i][1] + p[i + 1][1]) / 2;
      ctx.quadraticCurveTo(p[i][0], p[i][1], mx, my);
    }
    const u = p[p.length - 1];
    ctx.lineTo(u[0], u[1]);
    ctx.stroke();
  }
  ctx.restore();
}

export class Lienzo {
  /**
   * @param {HTMLCanvasElement} canvas  lienzo visible (se ajusta a su tamaño CSS × devicePixelRatio)
   * @param {{ancho:number, alto:number, relleno?:string|null, onCambio?:Function}} opciones
   *   ancho/alto: resolución final al exportar. relleno: color de fondo opaco (fondos); null = transparente.
   */
  constructor(canvas, { ancho, alto, relleno = null, onCambio = () => {} }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ancho = ancho;
    this.alto = alto;
    this.relleno = relleno;
    this.onCambio = onCambio;
    this.herramienta = 'pincel';
    this.color = '#2B2622';
    this.grosor = 0.02;
    this.base = document.createElement('canvas');
    this.base.width = ancho;
    this.base.height = alto;
    this.pasos = [];
    this.rehechos = [];
    this.actual = null;
    this.punteroId = null;
    this._pendiente = false;
    // "Sin guardar" = el dibujo es distinto del último guardado (deshacer hasta ahí lo deja limpio).
    this._versionBase = 0;
    this._marca = null;
    this._marcaBase = 0;

    this._abajo = (e) => this.abajo(e);
    this._mover = (e) => this.mover(e);
    this._arriba = (e) => this.arriba(e);
    canvas.addEventListener('pointerdown', this._abajo);
    canvas.addEventListener('pointermove', this._mover);
    canvas.addEventListener('pointerup', this._arriba);
    canvas.addEventListener('pointercancel', this._arriba);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    this.observador = new ResizeObserver(() => this.ajustar());
    this.observador.observe(canvas);
    this.cargarBase(null);
  }

  // Imagen inicial (dibujo guardado o plantilla). Reinicia el historial.
  cargarBase(imagen) {
    const c = this.base.getContext('2d');
    c.clearRect(0, 0, this.ancho, this.alto);
    if (this.relleno) { c.fillStyle = this.relleno; c.fillRect(0, 0, this.ancho, this.alto); }
    if (imagen) c.drawImage(imagen, 0, 0, this.ancho, this.alto);
    this.pasos = [];
    this.rehechos = [];
    this._versionBase++;
    this.marcar();
    this.redibujar();
    this.onCambio(this);
  }

  // Reemplaza todo por una imagen como paso deshacible (plantillas de fondo).
  ponerImagen(imagen) {
    this.agregarPaso({ tipo: 'imagen', imagen });
  }

  ajustar() {
    const r = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(r.width * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.redibujar();
  }

  redibujar() {
    const { width: W, height: H } = this.canvas;
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this.base, 0, 0, W, H);
    ctx.restore();
    for (const op of this.pasos) pintar(ctx, op, W, H, this.relleno);
    if (this.actual) pintar(ctx, this.actual, W, H, this.relleno);
  }

  pedirDibujo() {
    if (this._pendiente) return;
    this._pendiente = true;
    requestAnimationFrame(() => { this._pendiente = false; this.redibujar(); });
  }

  punto(e) {
    const r = this.canvas.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    return [Math.round(x * 10000) / 10000, Math.round(y * 10000) / 10000];
  }

  abajo(e) {
    if (this.punteroId !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    this.punteroId = e.pointerId;
    try { this.canvas.setPointerCapture(e.pointerId); } catch { /* nada */ }
    // El grosor se guarda relativo al ancho: se ve igual en cualquier tamaño.
    this.actual = { tipo: 'trazo', herramienta: this.herramienta, color: this.color, grosor: this.grosor, puntos: [this.punto(e)] };
    this.pedirDibujo();
  }

  mover(e) {
    if (e.pointerId !== this.punteroId || !this.actual) return;
    e.preventDefault();
    const eventos = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [e];
    for (const ev of (eventos.length ? eventos : [e])) this.actual.puntos.push(this.punto(ev));
    this.pedirDibujo();
  }

  arriba(e) {
    if (e.pointerId !== this.punteroId) return;
    this.punteroId = null;
    const op = this.actual;
    this.actual = null;
    if (op) this.agregarPaso(op);
  }

  agregarPaso(op) {
    this.pasos.push(op);
    this.rehechos = [];
    while (this.pasos.length > MAX_PASOS) {
      pintar(this.base.getContext('2d'), this.pasos.shift(), this.ancho, this.alto, this.relleno);
      this._versionBase++;
    }
    this.redibujar();
    this.onCambio(this);
  }

  get puedeDeshacer() { return this.pasos.length > 0; }
  get puedeRehacer() { return this.rehechos.length > 0; }

  deshacer() {
    if (!this.pasos.length) return;
    this.rehechos.push(this.pasos.pop());
    this.redibujar();
    this.onCambio(this);
  }

  rehacer() {
    if (!this.rehechos.length) return;
    this.pasos.push(this.rehechos.pop());
    this.redibujar();
    this.onCambio(this);
  }

  limpiar() {
    this.agregarPaso({ tipo: 'limpiar' });
  }

  marcar() {
    this._marca = this.pasos[this.pasos.length - 1] || null;
    this._marcaBase = this._versionBase;
  }

  get sucio() {
    return (this.pasos[this.pasos.length - 1] || null) !== this._marca || this._versionBase !== this._marcaBase;
  }

  marcarGuardado() {
    this.marcar();
    this.onCambio(this);
  }

  // Lienzo a la resolución final, sin calco ni nada de la interfaz.
  exportar() {
    const c = document.createElement('canvas');
    c.width = this.ancho;
    c.height = this.alto;
    const ctx = c.getContext('2d');
    ctx.drawImage(this.base, 0, 0);
    for (const op of this.pasos) pintar(ctx, op, this.ancho, this.alto, this.relleno);
    return c;
  }

  exportarBlob(tipo = 'image/png') {
    return new Promise((resolve, reject) => {
      this.exportar().toBlob((b) => (b ? resolve(b) : reject(new Error('No se pudo exportar'))), tipo);
    });
  }

  destruir() {
    this.observador.disconnect();
    this.canvas.removeEventListener('pointerdown', this._abajo);
    this.canvas.removeEventListener('pointermove', this._mover);
    this.canvas.removeEventListener('pointerup', this._arriba);
    this.canvas.removeEventListener('pointercancel', this._arriba);
  }
}
