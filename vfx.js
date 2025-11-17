const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');
let w, h;
function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);

let gridOffset = 0;
function drawGrid() {
  ctx.clearRect(0, 0, w, h);
  const spacing = 60;
  const horizon = h * 0.7;
  const vanishY = h * 1.5;
  ctx.strokeStyle = 'rgba(0, 255, 65, 0.15)';
  ctx.lineWidth = 1.5;
  for (let i = -20; i <= 20; i++) {
    const x = w/2 + i * spacing + (gridOffset % spacing);
    const scale = (vanishY - horizon) / (vanishY - h);
    ctx.beginPath();
    ctx.moveTo(x, horizon);
    ctx.lineTo(x * scale + w/2 * (1 - scale), vanishY);
    ctx.stroke();
  }
  gridOffset += 2;
}

const particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 3 + 1, opacity: Math.random() * 0.6 + 0.2
  });
}
function drawParticles() {
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;
    ctx.fillStyle = `rgba(0, 255, 65, ${p.opacity})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
  });
}

const rain = [];
for (let i = 0; i < 50; i++) {
  rain.push({
    x: Math.random() * w, y: Math.random() * h - h,
    speed: Math.random() * 8 + 4, chars: 'XPΛΣΩΔΨΦΓ'.split(''), length: Math.floor(Math.random() * 15) + 5
  });
}
function drawRain() {
  ctx.font = '16px monospace';
  rain.forEach(drop => {
    drop.y += drop.speed;
    if (drop.y > h) drop.y = -100;
    for (let i = 0; i < drop.length; i++) {
      const char = drop.chars[Math.floor(Math.random() * drop.chars.length)];
      const opacity = (1 - i / drop.length) * 0.8;
      ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
      ctx.fillText(char, drop.x, drop.y - i * 20);
    }
  });
}

let pulseTime = 0;
function drawPulse() {
  pulseTime += 0.03;
  const radius = (pulseTime * 100) % 600;
  if (radius < 50) return;
  const gradient = ctx.createRadialGradient(w/2, h/2, radius - 50, w/2, h/2, radius);
  gradient.addColorStop(0, 'rgba(0, 255, 65, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

function drawLightning() {
  if (Math.random() > 0.98) {
    const startX = Math.random() * w;
    const startY = Math.random() * h * 0.3;
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    let x = startX, y = startY;
    for (let i = 0; i < 8; i++) {
      x += (Math.random() - 0.5) * 80;
      y += Math.random() * 60;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function animate() {
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 1;

  drawGrid();
  drawParticles();
  drawRain();
  drawPulse();
  drawLightning();

  requestAnimationFrame(animate);
}
animate();

const scanline = document.getElementById('scanline');
scanline.style.background = 'linear-gradient(transparent, rgba(0,255,65,0.03), transparent)';
scanline.style.animation = 'scan 6s linear infinite, flicker 0.1s infinite';

const style = document.createElement('style');
style.textContent = `
  @keyframes scan { 0% { top: -100%; } 100% { top: 100%; } }
  @keyframes flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.98; } }
`;
document.head.appendChild(style);