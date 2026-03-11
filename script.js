/* ============================================================
   NAVBAR — scroll state
   ============================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ============================================================
   MOBILE MENU TOGGLE
   ============================================================ */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)'  : '';
  spans[1].style.opacity   = isOpen ? '0'                               : '';
  spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

/* ============================================================
   HERO CANVAS — animated manifold / network background
   ============================================================ */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes, raf;
  const NODE_COUNT = 60;
  const CONNECT_DIST = 160;
  const SPEED = 0.25;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomNode() {
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 0.5 + 0.2) * SPEED;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: Math.random() * 1.5 + 0.8,
    };
  }

  function init() {
    nodes = Array.from({ length: NODE_COUNT }, randomNode);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update positions
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }

    // Draw edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(99,179,237,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99,179,237,0.65)';
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize();
    init();
    draw();
  });

  resize();
  init();
  draw();
})();

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
(function initReveal() {
  const targets = [
    '.about-grid',
    '.about-avatar',
    '.about-text',
    '.pub-card',
    '.skill-group',
    '.timeline-item',
    '.contact-card',
    '.section-label',
    '.section-title',
    '.section-subtitle',
  ];

  const elements = [];
  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.07}s`;
      elements.push(el);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   ACTIVE NAV LINK — highlight based on scroll position
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  function updateActive() {
    const scrollY = window.scrollY + 100;
    let current = '';

    sections.forEach(s => {
      if (scrollY >= s.offsetTop) current = s.id;
    });

    links.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}`
        ? 'var(--text-primary)'
        : '';
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();
