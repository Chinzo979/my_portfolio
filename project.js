// project.js

document.addEventListener('DOMContentLoaded', async () => {
  const content     = document.getElementById('content');
  const titleEl     = document.getElementById('project-title');
  const sideTitleEl = document.getElementById('sidebar-title');
  const nav         = document.querySelector('.nav-links');

  try {
    // Read the project ID from URL (?id=...), fallback to 'search-engine'
    const params = new URLSearchParams(window.location.search);
    const id     = params.get('id') || 'search-engine';

    // Load JSON data
    const resp = await fetch('project_data.json');
    if (!resp.ok) throw new Error(`Failed to load data: ${resp.status}`);
    const data = await resp.json();
    const proj = data[id];
    if (!proj) throw new Error('Project not found');

    // Populate titles
    titleEl.textContent     = proj.title;
    if (sideTitleEl) sideTitleEl.textContent = proj.title;

    // Inject content sections
    content.innerHTML = `
      <section id="intro">
        <h2>Introduction</h2>
        <p>${proj.intro}</p>
      </section>
      <section id="design">
        <h2>Design & Architecture</h2>
        <p>${proj.design.replace(/\n/g, '<br>')}</p>
      </section>
      <section id="implementation">
        <h2>Implementation</h2>
        <p>${proj.implementation.replace(/\n/g, '<br>')}</p>
      </section>
      <section id="results">
        <h2>Results</h2>
        <p>${proj.results}</p>
      </section>
      <section id="future">
        <h2>Future Work</h2>
        <p>${proj.future}</p>
      </section>
    `;

    // Scroll-spy sidebar
    const links    = document.querySelectorAll('.sidebar a[href^="#"]');
    const sections = Array.from(links).map(l => document.getElementById(l.hash.slice(1)));
    const obs      = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const idx = sections.indexOf(e.target);
          if (links[idx]) links[idx].classList.add('active');
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach(s => s && obs.observe(s));

  } catch (err) {
    content.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }

  // Hide nav on scroll down, show on scroll up
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (currentY > lastY && currentY > 50) {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }
    lastY = currentY;
  });

  // Theme picker functionality
  const greenBtn  = document.getElementById('theme-green');
  const autumnBtn = document.getElementById('theme-autumn');
  const snowBtn   = document.getElementById('theme-snow');

  function applyTheme(theme) {
    document.body.classList.remove('theme-green','theme-autumn','theme-snow');
    document.body.classList.add(theme);
  }

  function spawnFalling(src, count, speedRange) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('img');
      el.src       = src;
      el.className = 'falling-item';
      el.style.left = Math.random() * (window.innerWidth - 32) + 'px';
      document.body.appendChild(el);
      const duration = Math.random() * (speedRange.max - speedRange.min) + speedRange.min;
      el.style.animation = `fall ${duration}s linear`;
      el.addEventListener('animationend', () => el.remove());
    }
  }

  greenBtn.addEventListener('click', () => {
    applyTheme('theme-green');
    spawnFalling('assets/green.png',   20, { min: 5,  max: 10 });
  });
  autumnBtn.addEventListener('click', () => {
    applyTheme('theme-autumn');
    spawnFalling('assets/autumn.png',  20, { min: 5,  max: 10 });
  });
  snowBtn.addEventListener('click', () => {
    applyTheme('theme-snow');
    spawnFalling('assets/snowflake.png', 50, { min: 2,  max: 5 });
  });
});
