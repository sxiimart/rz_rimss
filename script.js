/* ===========================================================
   KARIM SIMARMATA — PREMIUM PORTFOLIO 2026
   script.js
   =========================================================== */

(() => {
'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none)').matches;
const isMobileViewport = window.innerWidth < 860;

/* ===========================================================
   1. LOADING SCREEN
   =========================================================== */
function initLoader() {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const percent = document.getElementById('loaderPercent');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = progress + '%';
      percent.textContent = '100%';
      setTimeout(() => {
        loader.classList.add('is-hidden');
        document.body.style.overflow = '';
        startPageAnimations();
      }, 350);
      return;
    }
    fill.style.width = progress + '%';
    percent.textContent = Math.floor(progress) + '%';
  }, 180);
}
document.body.style.overflow = 'hidden';

/* ===========================================================
   2. CUSTOM CURSOR
   =========================================================== */
function initCursor() {
  if (isTouchDevice || isMobileViewport) return;
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  function rafLoop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(rafLoop);
  }
  rafLoop();

  const hoverables = 'a, button, [data-tilt], input, textarea, .faq-question, .filter-btn, .blog-tag';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverables)) ring.classList.add('is-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverables)) ring.classList.remove('is-hover');
  });
}

/* ===========================================================
   3. SPOTLIGHT CURSOR GLOW
   =========================================================== */
function initSpotlight() {
  if (isTouchDevice) return;
  const spotlight = document.getElementById('spotlight');
  let sx = window.innerWidth / 2, sy = window.innerHeight / 2;
  let tx = sx, ty = sy;
  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  function loop() {
    sx += (tx - sx) * 0.08;
    sy += (ty - sy) * 0.08;
    spotlight.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();
}

/* ===========================================================
   4. LENIS SMOOTH SCROLL
   =========================================================== */
let lenis;
function initLenis() {
  if (prefersReducedMotion || typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on('scroll', () => {
    if (window.ScrollTrigger) ScrollTrigger.update();
  });

  if (window.gsap && window.ScrollTrigger) {
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
}

/* ===========================================================
   5. NAVBAR — scroll state, active link, progress, mobile menu
   =========================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navProgress = document.getElementById('navProgress');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('is-scrolled', y > 40);
    backToTop.classList.toggle('is-visible', y > 600);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
    navProgress.style.width = progress + '%';

    let current = 'home';
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    burger.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }
  burger.addEventListener('click', () => {
    const willOpen = !mobileMenu.classList.contains('is-open');
    mobileMenu.classList.toggle('is-open');
    burger.classList.toggle('is-open');
    document.body.style.overflow = willOpen ? 'hidden' : '';
    if (lenis) { willOpen ? lenis.stop() : lenis.start(); }
  });
  mobileMenu.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  backToTop.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Smooth anchor scrolling for all in-page links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.3, offset: -80 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ===========================================================
   6. THEME TOGGLE (Dark Premium <-> Light)
   =========================================================== */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const saved = null; // no localStorage per artifact rules; session-only state
  let isLight = false;

  toggle.addEventListener('click', () => {
    isLight = !isLight;
    root.classList.toggle('light-mode', isLight);
  });
}

window.__portfolioInit = window.__portfolioInit || {};
window.__portfolioInit.initLoader = initLoader;
window.__portfolioInit.initCursor = initCursor;
window.__portfolioInit.initSpotlight = initSpotlight;
window.__portfolioInit.initLenis = initLenis;
window.__portfolioInit.initNavbar = initNavbar;
window.__portfolioInit.initThemeToggle = initThemeToggle;
window.__lenisRef = () => lenis;

})();

(() => {
'use strict';

/* ===========================================================
   7. THREE.JS HERO — SIGNAL SPHERE
   Rotating icosahedron wireframe with pulsing node points,
   reacting subtly to cursor position.
   =========================================================== */
function initHeroThree() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const isSmall = window.innerWidth < 860;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = isSmall ? 9 : 7.2;

  const group = new THREE.Group();
  scene.add(group);

  // Core wireframe icosahedron (signal sphere)
  const coreGeo = new THREE.IcosahedronGeometry(2.4, 1);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x7c3aed,
    wireframe: true,
    transparent: true,
    opacity: 0.45,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  group.add(coreMesh);

  // Outer larger wireframe shell, opposite rotation
  const shellGeo = new THREE.IcosahedronGeometry(3.3, 0);
  const shellMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  });
  const shellMesh = new THREE.Mesh(shellGeo, shellMat);
  group.add(shellMesh);

  // Glowing node points at icosahedron vertices
  const nodePositions = coreGeo.attributes.position;
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions.array.slice(), 3));
  const nodeMat = new THREE.PointsMaterial({
    color: 0x67e8f9,
    size: 0.09,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  });
  const nodePoints = new THREE.Points(nodeGeo, nodeMat);
  group.add(nodePoints);

  // Ambient floating particle field around the sphere
  const particleCount = isSmall ? 140 : 260;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const radius = 5 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x3b82f6,
    size: 0.045,
    transparent: true,
    opacity: 0.55,
  });
  const particleField = new THREE.Points(particleGeo, particleMat);
  scene.add(particleField);

  // Mouse tracking for subtle parallax tilt
  let targetRotX = 0, targetRotY = 0;
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    targetRotY = mouseX * 0.35;
    targetRotX = mouseY * 0.25;
  });

  let clock = new THREE.Clock();
  let rafId;
  function animate() {
    rafId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    coreMesh.rotation.y = t * 0.12;
    coreMesh.rotation.x = t * 0.06;
    nodePoints.rotation.copy(coreMesh.rotation);

    shellMesh.rotation.y = -t * 0.05;
    shellMesh.rotation.x = -t * 0.03;

    particleField.rotation.y = t * 0.015;

    group.rotation.y += (targetRotY - group.rotation.y) * 0.04;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.04;

    // pulsing node opacity
    nodeMat.opacity = 0.7 + Math.sin(t * 1.6) * 0.2;

    renderer.render(scene, camera);
  }
  animate();

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  // Pause rendering when hero is off-screen (perf)
  const heroSection = document.getElementById('home');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!rafId) animate();
        } else {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    }, { threshold: 0.01 });
    io.observe(heroSection);
  }
}

/* ===========================================================
   8. AMBIENT PARTICLES CANVAS (full-page floating dust)
   =========================================================== */
function initParticlesCanvas() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const count = window.innerWidth < 768 ? 26 : 50;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.6 + 0.4,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    hue: Math.random() > 0.5 ? '124,58,237' : '6,182,212',
    alpha: Math.random() * 0.4 + 0.15,
  }));

  function loop() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue},${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  if (!prefersReducedMotionGlobal()) loop();
}
function prefersReducedMotionGlobal() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ===========================================================
   9. TYPING EFFECT (Hero)
   =========================================================== */
function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const phrases = [
    'Building Modern Websites',
    'Building Smart IoT Systems',
    'Creating Digital Experiences',
  ];
  let phraseIndex = 0, charIndex = 0, isDeleting = false;

  function tick() {
    const current = phrases[phraseIndex];
    if (!isDeleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, isDeleting ? 35 : 65);
  }
  tick();
}

window.__portfolioInit.initHeroThree = initHeroThree;
window.__portfolioInit.initParticlesCanvas = initParticlesCanvas;
window.__portfolioInit.initTypingEffect = initTypingEffect;

})();

(() => {
'use strict';

/* ===========================================================
   10. GSAP SCROLL REVEALS
   =========================================================== */
function initScrollReveals() {
  if (typeof gsap === 'undefined') {
    // Fallback: IntersectionObserver-based reveal
    const items = document.querySelectorAll('[data-reveal]:not(#home [data-reveal])');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach((el) => io.observe(el));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const items = document.querySelectorAll('[data-reveal]:not(#home [data-reveal])');
  items.forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Hero-specific staggered entrance is handled separately on load.
}

/* ===========================================================
   11. HERO LOAD-IN SEQUENCE (staggered, runs once loader hides)
   =========================================================== */
function playHeroIntro() {
  const items = document.querySelectorAll('#home [data-reveal]');
  if (typeof gsap === 'undefined') {
    items.forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  gsap.fromTo(items,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 }
  );
  gsap.fromTo('.float-card',
    { opacity: 0, scale: 0.85 },
    { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.6)', stagger: 0.15, delay: 0.5 }
  );
}

/* ===========================================================
   12. 3D TILT EFFECT (cards with data-tilt)
   =========================================================== */
function initTiltEffect() {
  if (isTouchDeviceGlobal()) return;
  const tiltEls = document.querySelectorAll('[data-tilt]');
  tiltEls.forEach((el) => {
    let rect;
    el.addEventListener('mouseenter', () => { rect = el.getBoundingClientRect(); });
    el.addEventListener('mousemove', (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * 10;
      const rotX = (0.5 - py) * 10;
      el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // Profile card subtle 3D
  const profileCard = document.getElementById('profileCard3d');
  if (profileCard) {
    const wrap = profileCard.closest('.about-card-wrap');
    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * 14;
      const rotX = (0.5 - py) * 14;
      profileCard.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    wrap.addEventListener('mouseleave', () => {
      profileCard.style.transform = 'rotateX(0) rotateY(0)';
    });
  }
}
function isTouchDeviceGlobal() {
  return window.matchMedia('(hover: none)').matches;
}

/* ===========================================================
   13. COUNTER ANIMATION (Statistics)
   =========================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const startTime = performance.now();
      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => io.observe(el));
}

/* ===========================================================
   14. SKILL PROGRESS BARS
   =========================================================== */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill[data-progress]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.width = el.dataset.progress + '%';
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  bars.forEach((el) => io.observe(el));
}

/* ===========================================================
   15. SKILL ORBIT — populate orbiting tech icons
   =========================================================== */
function initSkillOrbit() {
  const orbit = document.getElementById('skillOrbit');
  if (!orbit) return;
  const ring1Icons = ['🌐', '🎨', '⚡'];
  const ring2Icons = ['🗄️', '🔌', '📡', '🛠️'];
  const ring3Icons = ['⚛️', '🐙', '💾', '🔧', '📶'];

  function placeIcons(icons, radius, duration, reverse) {
    icons.forEach((icon, i) => {
      const angleOffset = (360 / icons.length) * i;
      const wrapper = document.createElement('div');
      wrapper.className = 'orbit-icon-wrapper';
      wrapper.style.cssText = `position:absolute; top:50%; left:50%; width:0; height:0; animation: orbitSpin ${duration}s linear infinite ${reverse ? 'reverse' : ''}; animation-delay: ${-(angleOffset/360)*duration}s;`;
      const iconEl = document.createElement('div');
      iconEl.className = 'orbit-icon';
      iconEl.textContent = icon;
      iconEl.style.cssText = `position:absolute; left:${radius}px; top:0; transform: translate(-50%,-50%);`;
      wrapper.appendChild(iconEl);
      orbit.appendChild(wrapper);
    });
  }

  // inject keyframes for orbit rotation dynamically
  const styleTag = document.createElement('style');
  styleTag.textContent = `@keyframes orbitSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
  document.head.appendChild(styleTag);

  placeIcons(ring1Icons, 70, 14, false);
  placeIcons(ring2Icons, 110, 22, true);
  placeIcons(ring3Icons, 150, 32, false);
}

/* ===========================================================
   16. EXPERIENCE TIMELINE PROGRESS LINE
   =========================================================== */
function initTimelineProgress() {
  const timeline = document.getElementById('timeline');
  const fill = document.getElementById('timelineFill');
  if (!timeline || !fill) return;

  function update() {
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height;
    const visible = Math.min(Math.max(vh * 0.75 - rect.top, 0), total);
    const pct = total > 0 ? (visible / total) * 100 : 0;
    fill.style.height = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

window.__portfolioInit.initScrollReveals = initScrollReveals;
window.__portfolioInit.playHeroIntro = playHeroIntro;
window.__portfolioInit.initTiltEffect = initTiltEffect;
window.__portfolioInit.initCounters = initCounters;
window.__portfolioInit.initSkillBars = initSkillBars;
window.__portfolioInit.initSkillOrbit = initSkillOrbit;
window.__portfolioInit.initTimelineProgress = initTimelineProgress;

})();

(() => {
'use strict';

/* ===========================================================
   17. PROJECTS DATA + RENDER + FILTER + MODAL
   =========================================================== */
const PROJECTS = [
  {
    id: 'p1', name: 'NusaCommerce Dashboard', category: 'Dashboard', filter: 'dashboard',
    icon: '📊', colors: ['#7c3aed', '#3b82f6'],
    tech: ['PHP', 'MySQL', 'Tailwind', 'Chart.js'],
    desc: 'Dashboard analitik penjualan untuk platform e-commerce lokal, menampilkan data transaksi real-time, manajemen stok, dan laporan visual interaktif untuk pengambilan keputusan bisnis yang lebih cepat.'
  },
  {
    id: 'p2', name: 'SmartFarm Monitoring', category: 'IoT System', filter: 'iot',
    icon: '🌱', colors: ['#06b6d4', '#34d399'],
    tech: ['ESP32', 'Arduino', 'MQTT', 'Node.js'],
    desc: 'Sistem monitoring kelembapan tanah dan suhu untuk lahan pertanian skala kecil, mengirim data sensor secara berkala ke dashboard web agar petani dapat memantau kondisi lahan dari jarak jauh.'
  },
  {
    id: 'p3', name: 'Aurora Portfolio Builder', category: 'Web App', filter: 'web',
    icon: '✨', colors: ['#7c3aed', '#06b6d4'],
    tech: ['JavaScript', 'Tailwind', 'GSAP'],
    desc: 'Builder portfolio drag-and-drop yang memungkinkan kreator membangun halaman personal dengan animasi premium tanpa perlu menulis kode satu baris pun.'
  },
  {
    id: 'p4', name: 'HomeGuard IoT Security', category: 'IoT System', filter: 'iot',
    icon: '🔒', colors: ['#3b82f6', '#7c3aed'],
    tech: ['ESP32', 'PIR Sensor', 'Telegram API'],
    desc: 'Sistem keamanan rumah berbasis sensor gerak dan kamera mini yang mengirimkan notifikasi instan ke Telegram saat mendeteksi aktivitas mencurigakan.'
  },
  {
    id: 'p5', name: 'KlinikPro Booking App', category: 'Mobile Web', filter: 'mobile',
    icon: '🏥', colors: ['#06b6d4', '#3b82f6'],
    tech: ['PHP', 'MySQL', 'REST API'],
    desc: 'Aplikasi web mobile-first untuk reservasi jadwal dokter, lengkap dengan sistem antrian digital dan notifikasi pengingat janji temu otomatis.'
  },
  {
    id: 'p6', name: 'Logistix Fleet Dashboard', category: 'Dashboard', filter: 'dashboard',
    icon: '🚚', colors: ['#7c3aed', '#06b6d4'],
    tech: ['Vue-style JS', 'MySQL', 'Maps API'],
    desc: 'Dashboard pelacakan armada logistik real-time dengan visualisasi rute, estimasi waktu tiba, dan laporan efisiensi bahan bakar per kendaraan.'
  },
  {
    id: 'p7', name: 'EcoLight Smart Switch', category: 'IoT System', filter: 'iot',
    icon: '💡', colors: ['#34d399', '#06b6d4'],
    tech: ['ESP32', 'Relay Module', 'Web Dashboard'],
    desc: 'Sistem saklar lampu pintar yang dapat dikontrol dan dijadwalkan dari web dashboard, dirancang untuk efisiensi konsumsi listrik rumah tangga.'
  },
  {
    id: 'p8', name: 'Studio Reka — Agency Site', category: 'Website', filter: 'web',
    icon: '🎬', colors: ['#3b82f6', '#7c3aed'],
    tech: ['HTML5', 'Tailwind', 'GSAP'],
    desc: 'Landing page agency kreatif dengan animasi scroll premium, showcase portofolio interaktif, dan performa loading yang sangat ringan.'
  },
  {
    id: 'p9', name: 'TaniConnect Mobile', category: 'Mobile Web', filter: 'mobile',
    icon: '🌾', colors: ['#06b6d4', '#34d399'],
    tech: ['JavaScript', 'PHP', 'MySQL'],
    desc: 'Platform mobile-web yang menghubungkan petani lokal langsung dengan pembeli, lengkap dengan sistem chat dan katalog hasil panen real-time.'
  },
];

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = PROJECTS.map((p) => `
    <article class="project-card" data-filter="${p.filter}" data-id="${p.id}" tabindex="0">
      <div class="project-thumb" style="--card-c1:${p.colors[0]}; --card-c2:${p.colors[1]}">
        <span class="project-thumb-icon">${p.icon}</span>
        <div class="project-thumb-overlay"><span class="project-thumb-view">View Details</span></div>
      </div>
      <div class="project-body">
        <span class="project-category">${p.category}</span>
        <h3 class="project-name">${p.name}</h3>
        <div class="project-tech">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
      </div>
    </article>
  `).join('');

  // staggered visibility on load
  requestAnimationFrame(() => {
    const cards = grid.querySelectorAll('.project-card');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), idx * 60);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    cards.forEach((c) => io.observe(c));
  });

  grid.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', () => openProjectModal(card.dataset.id));
    card.addEventListener('keypress', (e) => { if (e.key === 'Enter') openProjectModal(card.dataset.id); });
  });
}

function initProjectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach((card) => {
        const match = filter === 'all' || card.dataset.filter === filter;
        card.classList.toggle('is-hidden-filter', !match);
      });
    });
  });
}

function openProjectModal(id) {
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) return;
  const modal = document.getElementById('projectModal');
  const body = document.getElementById('modalBody');
  body.innerHTML = `
    <div class="modal-icon-hero" style="background:linear-gradient(135deg, ${project.colors[0]}, ${project.colors[1]})">${project.icon}</div>
    <span class="project-category">${project.category}</span>
    <h3>${project.name}</h3>
    <p>${project.desc}</p>
    <div class="modal-tech-list">${project.tech.map(t => `<span>${t}</span>`).join('')}</div>
    <div class="modal-actions">
      <a href="#" class="btn-primary" onclick="return false;"><span>Live Demo</span></a>
      <a href="#" class="btn-secondary" onclick="return false;"><span>GitHub</span></a>
    </div>
  `;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  if (window.__lenisRef && window.__lenisRef()) window.__lenisRef().stop();
}

function initProjectModalClose() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');
  const backdrop = document.getElementById('modalBackdrop');
  function close() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (window.__lenisRef && window.__lenisRef()) window.__lenisRef().start();
  }
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

window.__portfolioInit.renderProjects = renderProjects;
window.__portfolioInit.initProjectFilters = initProjectFilters;
window.__portfolioInit.initProjectModalClose = initProjectModalClose;

})();

(() => {
'use strict';

/* ===========================================================
   18. BLOG DATA + RENDER + SEARCH + TAG FILTER
   =========================================================== */
const BLOG_POSTS = [
  { id: 'b1', title: 'Optimasi Query MySQL untuk Dashboard Berat', date: '5 Juni 2026', category: 'Web Dev', tag: 'web', icon: '🗄️' },
  { id: 'b2', title: 'Mengenal Protokol MQTT untuk Komunikasi IoT', date: '28 Mei 2026', category: 'IoT', tag: 'iot', icon: '📡' },
  { id: 'b3', title: 'Prinsip Glassmorphism dalam Desain Modern', date: '20 Mei 2026', category: 'Design', tag: 'design', icon: '🪟' },
  { id: 'b4', title: 'Dari Otodidak ke Freelancer: Cerita Saya', date: '12 Mei 2026', category: 'Career', tag: 'career', icon: '🧭' },
  { id: 'b5', title: 'Tips Memilih Sensor yang Tepat untuk Proyek IoT', date: '30 April 2026', category: 'IoT', tag: 'iot', icon: '🔬' },
  { id: 'b6', title: 'Animasi Scroll dengan GSAP: Panduan Praktis', date: '18 April 2026', category: 'Web Dev', tag: 'web', icon: '🎞️' },
];

function renderBlog() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  grid.innerHTML = BLOG_POSTS.map((b) => `
    <article class="blog-card" data-tag="${b.tag}" data-title="${b.title.toLowerCase()}">
      <div class="blog-card-thumb" style="background:linear-gradient(135deg, rgba(124,58,237,0.5), rgba(6,182,212,0.5))">${b.icon}</div>
      <div class="blog-card-body">
        <span class="blog-category">${b.category}</span>
        <h4 class="blog-card-title">${b.title}</h4>
        <div class="blog-card-meta">${b.date}</div>
      </div>
    </article>
  `).join('');

  requestAnimationFrame(() => {
    const cards = grid.querySelectorAll('.blog-card');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), idx * 70);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    cards.forEach((c) => io.observe(c));
  });
}

function initBlogFilters() {
  const tags = document.querySelectorAll('.blog-tag');
  const search = document.getElementById('blogSearch');

  function applyFilters() {
    const activeTag = document.querySelector('.blog-tag.active')?.dataset.tag || 'all';
    const query = (search?.value || '').toLowerCase().trim();
    document.querySelectorAll('.blog-card').forEach((card) => {
      const matchesTag = activeTag === 'all' || card.dataset.tag === activeTag;
      const matchesSearch = !query || card.dataset.title.includes(query);
      card.classList.toggle('is-hidden-filter', !(matchesTag && matchesSearch));
    });
  }

  tags.forEach((tag) => {
    tag.addEventListener('click', () => {
      tags.forEach((t) => t.classList.remove('active'));
      tag.classList.add('active');
      applyFilters();
    });
  });
  search?.addEventListener('input', applyFilters);
}

/* ===========================================================
   19. FAQ ACCORDION
   =========================================================== */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ===========================================================
   20. CONTACT FORM (front-end demo submission)
   =========================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('btnSubmit');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    btn.classList.add('is-loading');
    setTimeout(() => {
      btn.classList.remove('is-loading');
      success.classList.add('is-visible');
      form.reset();
      setTimeout(() => success.classList.remove('is-visible'), 3600);
    }, 1300);
  });
}

window.__portfolioInit.renderBlog = renderBlog;
window.__portfolioInit.initBlogFilters = initBlogFilters;
window.__portfolioInit.initFAQ = initFAQ;
window.__portfolioInit.initContactForm = initContactForm;

})();

/* ===========================================================
   21. PAGE START — orchestrates animations after loader hides
   =========================================================== */
function startPageAnimations() {
  window.__portfolioInit.playHeroIntro();
}
window.startPageAnimations = startPageAnimations;

/* ===========================================================
   22. BOOTSTRAP — DOMContentLoaded
   =========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const I = window.__portfolioInit;

  // Safety net: ensure loader never traps the user if something throws
  const safetyTimeout = setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('is-hidden')) {
      loader.classList.add('is-hidden');
      document.body.style.overflow = '';
    }
  }, 6000);

  try {
    runInit(I);
  } catch (err) {
    console.error('Portfolio init error:', err);
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('is-hidden');
    document.body.style.overflow = '';
  } finally {
    clearTimeout(safetyTimeout);
  }
});

function runInit(I) {

  // Footer year
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Core systems
  I.initCursor();
  I.initSpotlight();
  I.initLenis();
  I.initNavbar();
  I.initThemeToggle();

  // Hero visuals
  I.initHeroThree();
  I.initParticlesCanvas();
  I.initTypingEffect();

  // Content render
  I.renderProjects();
  I.initProjectFilters();
  I.initProjectModalClose();
  I.renderBlog();
  I.initBlogFilters();
  I.initFAQ();
  I.initContactForm();

  // Interaction / motion
  I.initTiltEffect();
  I.initCounters();
  I.initSkillBars();
  I.initSkillOrbit();
  I.initTimelineProgress();
  I.initScrollReveals();

  // Loader (kicks off last so DOM is ready underneath)
  I.initLoader();
}
