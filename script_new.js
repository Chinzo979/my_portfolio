// Mobile Navigation Functions
function toggleMobileMenu() {
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburgerIcon.classList.toggle('active');
    mobileMenu.classList.toggle('active');
}

function closeMobileMenu() {
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburgerIcon.classList.remove('active');
    mobileMenu.classList.remove('active');
}

// Flip Card Function
function flipCard(element) {
    element.classList.toggle('flipped');
}

// Creative Mode Toggle
const creativeToggle = document.getElementById('creativeToggle');
const canvas = document.getElementById('creativeCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationId = null;
let isCreativeMode = false;

// Particle class for creative mode
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.005;
        this.size = Math.random() * 4 + 2;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.vx *= 0.99;
        this.vy *= 0.99;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Creative mode functions
function enableCreativeMode() {
    isCreativeMode = true;
    canvas.style.display = 'block';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    animate();
}

function disableCreativeMode() {
    isCreativeMode = false;
    canvas.style.display = 'none';
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    particles = [];
}

function animate() {
    if (!isCreativeMode) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        particle.draw();

        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }

    animationId = requestAnimationFrame(animate);
}

// Mouse interaction for creative mode
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (isCreativeMode && Math.random() < 0.3) {
        particles.push(new Particle(mouseX, mouseY));
    }
});

document.addEventListener('click', (e) => {
    if (isCreativeMode) {
        for (let i = 0; i < 10; i++) {
            particles.push(new Particle(e.clientX, e.clientY));
        }
    }
});

// Creative toggle event listener
creativeToggle.addEventListener('change', () => {
    if (creativeToggle.checked) {
        enableCreativeMode();
    } else {
        disableCreativeMode();
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.project-card, .profile-text, .mobile-text-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Handle window resize for creative canvas
    window.addEventListener('resize', () => {
        if (isCreativeMode) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const mobileNav = document.getElementById('mobile-nav');
        const hamburgerMenu = document.querySelector('.hamburger-menu');

        if (!mobileNav.contains(e.target) && document.getElementById('mobile-menu').classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Handle escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
});

// Parallax effect for scroll indicator
window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        scrollIndicator.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

const leafContainer = document.getElementById('leaf-container');
const windContainer = document.getElementById('wind-container');

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

// Start leaves and wind when page loads (if creative mode is off)
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...

    // Start ambient leaves & wind if creative mode is OFF
    if (!creativeToggle.checked) {
        startWindAndLeaves();
    }
});

// Stop/start based on creative toggle
creativeToggle.addEventListener('change', () => {
    if (creativeToggle.checked) {
        stopWindAndLeaves();
        enableCreativeMode();
    } else {
        disableCreativeMode();
        startWindAndLeaves();
    }
});

// Stop when page is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopWindAndLeaves();
    else if (!creativeToggle.checked) startWindAndLeaves();
});