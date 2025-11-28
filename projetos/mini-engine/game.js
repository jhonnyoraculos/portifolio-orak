const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI elements
const speedControl = document.getElementById('speedControl');
const particlesToggle = document.getElementById('particlesToggle');
const ghostToggle = document.getElementById('ghostToggle');
const sceneSelect = document.getElementById('sceneSelect');
const speedLabel = document.getElementById('speedLabel');
const stateLabel = document.getElementById('stateLabel');
const hudScore = document.getElementById('hud-score');
const hudSpeed = document.getElementById('hud-speed');
const hudStatus = document.getElementById('hud-status');

const keys = new Set();
const player = {
  x: canvas.width * 0.2,
  y: canvas.height * 0.5,
  size: 22,
  speed: 140,
  vel: { x: 0, y: 0 },
  color: '#f4c76b'
};

const settings = {
  speedFactor: 1,
  particles: true,
  ghost: false,
  scene: 'neon'
};

const scenes = {
  neon: { bg: ['#0b0f18', '#0f1222'], accent: '#6cf4ff' },
  noite: { bg: ['#050608', '#0a0d15'], accent: '#f4c76b' },
  grass: { bg: ['#0b0f12', '#0f1b0f'], accent: '#6bff9c' }
};

let obstacles = [];
let orbs = [];
let particles = [];
let ghostTrail = [];
let score = 0;
let hitFlash = 0;
let lastTime = performance.now();

function resizeCanvas() {
  const ratio = 16 / 9;
  const width = canvas.clientWidth;
  canvas.width = width;
  canvas.height = Math.max(300, width / ratio);
  resetWorld();
}

function resetWorld() {
  obstacles = [
    { x: canvas.width * 0.45, y: canvas.height * 0.25, w: 80, h: 18 },
    { x: canvas.width * 0.65, y: canvas.height * 0.55, w: 70, h: 22 },
    { x: canvas.width * 0.30, y: canvas.height * 0.70, w: 90, h: 18 }
  ];
  spawnOrbs(6);
  player.x = canvas.width * 0.2;
  player.y = canvas.height * 0.5;
  ghostTrail = [];
}

function spawnOrbs(n) {
  orbs = [];
  for (let i = 0; i < n; i++) {
    orbs.push({
      x: 60 + Math.random() * (canvas.width - 120),
      y: 60 + Math.random() * (canvas.height - 120),
      r: 10,
      alive: true,
      pulse: Math.random()
    });
  }
}

function handleInput(dt) {
  const spd = player.speed * settings.speedFactor;
  player.vel.x = 0;
  player.vel.y = 0;
  if (keys.has('ArrowUp') || keys.has('w')) player.vel.y = -spd;
  if (keys.has('ArrowDown') || keys.has('s')) player.vel.y = spd;
  if (keys.has('ArrowLeft') || keys.has('a')) player.vel.x = -spd;
  if (keys.has('ArrowRight') || keys.has('d')) player.vel.x = spd;

  player.x += player.vel.x * dt;
  player.y += player.vel.y * dt;

  // bounds
  player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));
}

function rectCircleCollide(px, py, pr, rx, ry, rw, rh) {
  const cx = Math.max(rx, Math.min(px, rx + rw));
  const cy = Math.max(ry, Math.min(py, ry + rh));
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy < pr * pr;
}

function update(dt) {
  handleInput(dt);

  // Ghost trail
  if (settings.ghost) {
    ghostTrail.push({ x: player.x, y: player.y, life: 0.8 });
    if (ghostTrail.length > 120) ghostTrail.shift();
  } else {
    ghostTrail = [];
  }

  // Particles
  if (settings.particles && (player.vel.x !== 0 || player.vel.y !== 0)) {
    particles.push({
      x: player.x,
      y: player.y,
      life: 0.6,
      size: 6 + Math.random() * 4
    });
  }
  particles.forEach(p => {
    p.life -= dt;
    p.y += 8 * dt * 60;
  });
  particles = particles.filter(p => p.life > 0);

  // Collisions with obstacles
  obstacles.forEach(obs => {
    if (rectCircleCollide(player.x, player.y, player.size, obs.x, obs.y, obs.w, obs.h)) {
      hitFlash = 0.2;
      hudStatus.textContent = 'Status: colisão!';
    }
  });
  if (hitFlash > 0) hitFlash -= dt;

  // Orbs
  orbs.forEach(orb => {
    if (!orb.alive) return;
    const dx = player.x - orb.x;
    const dy = player.y - orb.y;
    const dist = Math.hypot(dx, dy);
    if (dist < player.size + orb.r) {
      orb.alive = false;
      score += 10;
      hudStatus.textContent = 'Status: coleta +10';
    }
  });
  if (orbs.every(o => !o.alive)) spawnOrbs(6);

  // HUD labels
  hudScore.textContent = `Pontuação: ${score}`;
  hudSpeed.textContent = `Velocidade: ${settings.speedFactor.toFixed(1)}x`;
}

function drawBackground() {
  const scene = scenes[settings.scene];
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, scene.bg[0]);
  grad.addColorStop(1, scene.bg[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  drawBackground();

  // Ghost path
  if (settings.ghost && ghostTrail.length) {
    ctx.strokeStyle = 'rgba(244, 199, 107, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ghostTrail.forEach((p, i) => {
      const alpha = p.life;
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
      ctx.globalAlpha = alpha;
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }

  // Obstacles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
  });

  // Orbs
  orbs.forEach(orb => {
    if (!orb.alive) return;
    const pulse = 0.6 + Math.sin(performance.now() / 250 + orb.pulse) * 0.2;
    ctx.beginPath();
    ctx.fillStyle = `rgba(244, 199, 107, ${0.6 + pulse * 0.2})`;
    ctx.arc(orb.x, orb.y, orb.r * (1 + pulse * 0.05), 0, Math.PI * 2);
    ctx.fill();
  });

  // Particles
  if (settings.particles) {
    particles.forEach(p => {
      ctx.fillStyle = `rgba(244, 199, 107, ${p.life})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Player
  ctx.save();
  if (hitFlash > 0) {
    ctx.shadowColor = 'rgba(255,80,80,0.8)';
    ctx.shadowBlur = 20;
  }
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // HUD overlay inside canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(10, 10, 120, 48);
  ctx.fillStyle = '#f2f3f8';
  ctx.font = '12px Inter, system-ui';
  ctx.fillText(`Pontuação: ${score}`, 18, 28);
  ctx.fillText(`Vel: ${settings.speedFactor.toFixed(1)}x`, 18, 44);
}

function loop(ts) {
  const dt = Math.min(0.033, (ts - lastTime) / 1000);
  lastTime = ts;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

// Controls wiring
speedControl.addEventListener('input', () => {
  settings.speedFactor = parseFloat(speedControl.value);
  speedLabel.textContent = `${settings.speedFactor.toFixed(1)}x`;
  updateStateLabel();
});

particlesToggle.addEventListener('change', () => {
  settings.particles = particlesToggle.checked;
  updateStateLabel();
});

ghostToggle.addEventListener('change', () => {
  settings.ghost = ghostToggle.checked;
  updateStateLabel();
});

sceneSelect.addEventListener('change', () => {
  settings.scene = sceneSelect.value;
  updateStateLabel();
});

function updateStateLabel() {
  const p = settings.particles ? 'ON' : 'OFF';
  const g = settings.ghost ? 'ON' : 'OFF';
  const scen = sceneSelect.options[sceneSelect.selectedIndex].text;
  stateLabel.textContent = `Velocidade: ${settings.speedFactor.toFixed(1)}x · Partículas: ${p} · Caminho: ${g} · Cenário: ${scen}`;
}

// Keyboard listeners
window.addEventListener('keydown', (e) => {
  keys.add(e.key);
});
window.addEventListener('keyup', (e) => {
  keys.delete(e.key);
});

window.addEventListener('resize', resizeCanvas);

// Init
resizeCanvas();
updateStateLabel();
requestAnimationFrame(loop);

// Comentário: o jogo é simples, mas os controles de UI (velocidade, partículas, trilha, cenário)
// estão conectados diretamente às variáveis do gameplay, simulando uma pequena engine tunável.
