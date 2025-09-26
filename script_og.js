// script.js

// ─── NAVIGATION TOGGLE ───
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// ─── FLIP CARD (coin-flip effect) ───
function flipCard(element) {
    element.classList.toggle("flipped");
}

document.addEventListener('DOMContentLoaded', () => {
    // Card click to flip
    const card = document.querySelector('.flip-card');
    if (card) {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    }

    // Initialize canvas sizes for wind/leaves & creative modes
    window.dispatchEvent(new Event('resize'));

    // Start ambient leaves & wind if creative mode is OFF
    if (!creativeToggle.checked) {
        startWindAndLeaves();
    }

    // ─── SECTION OBSERVER: Projects & URL hash + "Browse My Recent" visibility ───
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.target === projectsSection) {
                    if (entry.isIntersecting) {
                        // Show the "Browse My Recent" text
                        document.body.classList.add('show-typewriter');
                        // Set URL hash
                        history.replaceState(null, '', '#projects');
                    } else {
                        // Hide the "Browse My Recent" text
                        document.body.classList.remove('show-typewriter');
                        // If we've scrolled above Projects, clear the hash
                        if (window.scrollY < projectsSection.offsetTop) {
                            history.replaceState(null, '', window.location.pathname);
                        }
                    }
                }
            });
        }, { threshold: 0.1 });
        observer.observe(projectsSection);
    }
});

// ─── AMBIENT LEAVES ───
const leafContainer = document.getElementById('leaf-container');
function spawnLeaf() {
    if (!leafContainer) return;
    const img = document.createElement('img');
    img.src = './assets/leaf.png';
    img.className = 'leaf';
    const startTop = 10 + Math.random() * 80;
    img.style.setProperty('--leaf-start-top', `${startTop}%`);
    const rotStart = `${Math.random() * 360}deg`;
    const rotEnd = `${Math.random() * 360 + 360}deg`;
    const duration = `${Math.random() * 8 + 6}s`;
    img.style.setProperty('--leaf-rotate-start', rotStart);
    img.style.setProperty('--leaf-rotate-end', rotEnd);
    img.style.setProperty('--leaf-duration', duration);
    leafContainer.appendChild(img);
    img.addEventListener('animationend', () => img.remove());
}

// ─── AMBIENT WIND GUSTS ───
const windContainer = document.getElementById('wind-container');
function spawnGust() {
    if (!windContainer) return;
    const gust = document.createElement('div');
    gust.className = 'wind-gust';
    const top = 5 + Math.random() * 90;
    gust.style.setProperty('--gust-start-top', `${top}%`);
    gust.style.setProperty('--gust-duration', `${4 + Math.random() * 4}s`);
    windContainer.appendChild(gust);
    gust.addEventListener('animationend', () => gust.remove());
}

let leafInterval = null;
let gustInterval = null;
function startWindAndLeaves() {
    if (!leafInterval) leafInterval = setInterval(spawnLeaf, 1000);
    if (!gustInterval) gustInterval = setInterval(spawnGust, 2500);
}
function stopWindAndLeaves() {
    clearInterval(leafInterval);
    clearInterval(gustInterval);
    leafInterval = null;
    gustInterval = null;
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopWindAndLeaves();
    else if (!creativeToggle.checked) startWindAndLeaves();
});

// ─── “Get Creative” PARTICLE + PAINT-BRUSH CURSOR ───
const creativeToggle = document.getElementById('creativeToggle');
const canvas = document.getElementById('cw');
const paintCanvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const pCtx = paintCanvas.getContext('2d');

let particles = [];
let paintDots = [];
let animId = null;

// track mouse & painting state
const cursor = { x: innerWidth / 2, y: innerHeight / 2 };
let painting = false;

window.addEventListener('mousemove', e => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    if (painting && creativeToggle.checked) stampDot(e.clientX, e.clientY);
});
window.addEventListener('mousedown', e => {
    if (!creativeToggle.checked) return;
    painting = true;
    stampDot(e.clientX, e.clientY);
});
window.addEventListener('mouseup', () => painting = false);

window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    paintCanvas.width = innerWidth;
    paintCanvas.height = innerHeight;
});

// Particle class
function Particle() {
    this.x = cursor.x;
    this.y = cursor.y;
    this.theta = Math.random() * 2 * Math.PI;
    this.radius = Math.random() * 150 + 30;
    this.speed = 0.02;
    this.width = 2 + Math.random() * 3;
    this.color = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
    this.prevX = this.x;
    this.prevY = this.y;
}
Particle.prototype.update = function () {
    this.prevX = this.x; this.prevY = this.y;
    this.theta += this.speed;
    this.x = cursor.x + Math.cos(this.theta) * this.radius;
    this.y = cursor.y + Math.sin(this.theta) * this.radius;
    ctx.beginPath();
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.prevX, this.prevY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
};

// Paint‐brush dots
function getRandomColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
}
function stampDot(x, y) {
    paintDots.push({ x, y, t: performance.now(), color: getRandomColor() });
}

// Main animation loop
function animate() {
    // Paint‐dots
    pCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
    const now = performance.now();
    paintDots = paintDots.filter(d => now - d.t < 1000);
    paintDots.forEach(d => {
        const alpha = 1 - (now - d.t) / 1000;
        pCtx.globalAlpha = alpha;
        pCtx.beginPath();
        pCtx.arc(d.x, d.y, 5, 0, Math.PI * 2);
        pCtx.fillStyle = d.color;
        pCtx.fill();
    });
    pCtx.globalAlpha = 1;

    // Particle trails
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => p.update());

    animId = requestAnimationFrame(animate);
}

// Enable / disable creative mode
function enableCreative() {
    canvas.style.display = 'block';
    paintCanvas.style.display = 'block';
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    paintCanvas.width = innerWidth;
    paintCanvas.height = innerHeight;
    particles = Array.from({ length: 20 }, () => new Particle());
    animate();
}

function disableCreative() {
    canvas.style.display = 'none';
    paintCanvas.style.display = 'none';
    cancelAnimationFrame(animId);
    particles = [];
    paintDots = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
}

// Hook up the creative toggle
creativeToggle.addEventListener('change', () => {
    if (creativeToggle.checked) {
        stopWindAndLeaves();
        enableCreative();
    } else {
        disableCreative();
        startWindAndLeaves();
    }
});
