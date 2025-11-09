const canvas = document.getElementById("corazonesCanvas");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* === CORAZONES === */
class Corazon {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * w;
    this.y = h + Math.random() * h;
    this.size = 28 + Math.random() * 22;
    this.speed = 0.4 + Math.random() * 1.1;
    this.alpha = 0.4 + Math.random() * 0.6;
    this.color = `hsl(${Math.random() * 20 + 340}, 80%, 60%)`;
  }
  dibujar() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.size / 20, this.size / 20);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(0, -3, -3, -5, -5, -2);
    ctx.bezierCurveTo(-8, 1, 0, 8, 0, 8);
    ctx.bezierCurveTo(0, 8, 8, 1, 5, -2);
    ctx.bezierCurveTo(3, -5, 0, -3, 0, 0);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
  }
  actualizar() {
    this.y -= this.speed;
    this.x += Math.sin(this.y / 40) * 0.7;
    if (this.y < -30) this.reset();
  }
}

/* === LUCIÉRNAGAS === */
class Luciernaga {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = 2 + Math.random() * 3;
    this.speed = 0.3 + Math.random() * 0.4;
    this.angle = Math.random() * 2 * Math.PI;
  }
  dibujar() {
    ctx.save();
    ctx.globalAlpha = 0.7 + Math.sin(Date.now() / 500 + this.x) * 0.3;
    ctx.fillStyle = "white";
    ctx.shadowColor = "white";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  actualizar() {
    this.angle += 0.01;
    this.x += Math.cos(this.angle) * 0.4;
    this.y += Math.sin(this.angle / 2) * 0.3;
    if (this.x > w + 10) this.x = -10;
    if (this.x < -10) this.x = w + 10;
    if (this.y > h + 10) this.y = -10;
    if (this.y < -10) this.y = h + 10;
  }
}

/* === INSTANCIAS === */
let corazones = Array.from({ length: 50 }, () => new Corazon());
let luciernagas = Array.from({ length: 30 }, () => new Luciernaga());

/* === ANIMACIÓN PRINCIPAL === */
function animar() {
  ctx.clearRect(0, 0, w, h);

  // Fondo estrellado tenue
  ctx.fillStyle = "rgba(255,255,255,0.02)";
  for (let i = 0; i < 60; i++) {
    const sx = Math.random() * w;
    const sy = Math.random() * h;
    ctx.fillRect(sx, sy, 1, 1);
  }

  luciernagas.forEach(l => { l.actualizar(); l.dibujar(); });
  corazones.forEach(c => { c.actualizar(); c.dibujar(); });

  requestAnimationFrame(animar);
}
animar();

/* === NUBES === */
function crearNubes() {
  const numNubes = 4;
  for (let i = 0; i < numNubes; i++) {
    const nube = document.createElement("div");
    nube.classList.add("nube");
    nube.style.width = `${200 + Math.random() * 250}px`;
    nube.style.height = `${60 + Math.random() * 70}px`;
    nube.style.top = `${Math.random() * (h * 0.4)}px`;
    nube.style.left = `${-300 + Math.random() * w}px`;
    nube.style.animationDelay = `${Math.random() * 50}s`;
    document.body.appendChild(nube);
  }
}
crearNubes();

/* === ESTRELLAS === */
function crearEstrellas() {
  const cantidad = 40;
  for (let i = 0; i < cantidad; i++) {
    const estrella = document.createElement("div");
    estrella.classList.add("estrella");
    estrella.style.top = `${Math.random() * h}px`;
    estrella.style.left = `${Math.random() * w}px`;
    estrella.style.animationDelay = `${Math.random() * 3}s`;
    estrella.style.opacity = Math.random() * 0.8;
    document.body.appendChild(estrella);
  }
}
crearEstrellas();

/* === LUNA === */
const luna = document.createElement("div");
luna.classList.add("luna");
document.body.appendChild(luna);

/* === AUDIO REACTIVO === */
// Reproduce cualquier música local o una canción incluida
const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_5a6df7a50d.mp3?filename=romantic-night-melody-21410.mp3");
audio.loop = true;
audio.volume = 0.5;
audio.play();

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const src = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;
src.connect(analyser);
analyser.connect(audioCtx.destination);

const dataArray = new Uint8Array(analyser.frequencyBinCount);

function iluminarLuna() {
  analyser.getByteFrequencyData(dataArray);
  const promedio = dataArray.reduce((a, b) => a + b) / dataArray.length;
  const brillo = Math.min(1, promedio / 100);
  luna.style.boxShadow = `0 0 ${50 + brillo * 60}px rgba(255,255,200,${0.5 + brillo / 2})`;
  luna.style.transform = `translateX(-50%) scale(${1 + brillo * 0.08})`;
  requestAnimationFrame(iluminarLuna);
}
iluminarLuna();
