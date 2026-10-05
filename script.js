/* Portfolio script: vanilla ES6+, organised into small init functions */
(() => {
'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

/* ---------- Data ---------- */
const skills = [
  ['⌘','HTML5',95,'Frontend'],['🎨','CSS3',92,'Frontend'],['⚡','JavaScript',90,'JavaScript'],['📱','Responsive Design',94,'Frontend'],
  ['✨','CSS Animation',88,'UI/UX'],['⎇','Git',85,'Tools'],['🐙','GitHub',88,'Tools'],['◧','Figma',80,'UI/UX'],
  ['🔌','REST APIs',84,'JavaScript'],['💾','LocalStorage',90,'JavaScript'],['🧩','DOM Manipulation',93,'JavaScript'],['🚀','ES6+',91,'JavaScript']];
const projects = [
  {t:'E-Commerce Website',c:'web',img:1,d:'A fast storefront with cart, filters and checkout flow.',f:['Persistent cart','Product search','Responsive checkout'],tech:['HTML','CSS','JavaScript']},
  {t:'Gaming Website',c:'web ui',img:2,d:'A bold landing site for an indie game studio.',f:['Parallax hero','Trailer modal','Animated roster'],tech:['HTML','CSS','JS']},
  {t:'Admin Dashboard',c:'js ui',img:3,d:'Analytics dashboard with live charts and dark mode.',f:['Chart widgets','Sortable tables','Theme switch'],tech:['JavaScript','CSS Grid']},
  {t:'Weather Application',c:'js web',img:1,d:'Forecast app using a public weather API.',f:['City search','7-day forecast','Unit toggle'],tech:['REST API','JavaScript']},
  {t:'Portfolio Website',c:'web ui',img:2,d:'A premium personal site with motion and theming.',f:['Scroll reveals','Dark/light theme','Custom cursor'],tech:['HTML','CSS','JS']},
  {t:'JavaScript Game',c:'js games',img:3,d:'A canvas arcade game with levels and high scores.',f:['Canvas loop','Collision detection','Saved high score'],tech:['Canvas','JavaScript']}];
const services = [['</>','Frontend Development','Clean, maintainable interfaces built from scratch.'],['▭','Responsive Web Design','Layouts tuned for phones, tablets and large screens.'],['{ }','JavaScript Development','Interactive features, APIs and app logic.'],['◧','UI/UX Implementation','Turn Figma designs into pixel-accurate pages.'],['▤','Landing Page Development','Focused pages that load fast and convert.'],['⚙','Website Optimization','Faster loads, better accessibility and SEO.']];
const techs = ['HTML5','CSS3','JavaScript','Git','GitHub','Figma','VS Code','REST API'];
const reviews = [['Sara Khan','Product Manager','Delivered ahead of schedule and the site feels incredibly smooth.',5],['Daniel Reed','Startup Founder','Great communication and a clean, modern result.',5],['Ayesha Malik','Marketing Lead','Our landing page speed and conversions both improved.',4]];

/* ---------- Render ---------- */
function render() {
  $('#skillGrid').innerHTML = skills.map(([i,n,p,c]) => `<article class="skill glass"><header><span>${i} ${n}</span><span>${p}%</span></header><small>${c}</small><div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="${n}"><span data-w="${p}"></span></div></article>`).join('');
  $('#projGrid').innerHTML = projects.map((p,i) => `<button class="card glass" data-cat="${p.c}" data-i="${i}" aria-label="Open ${p.t} details"><img src="images/project${p.img}.jpg" alt="${p.t} preview" loading="lazy" width="800" height="600"><div><h3>${p.t}</h3><p>${p.d}</p><div class="tags">${p.tech.map(t=>`<span>${t}</span>`).join('')}</div></div></button>`).join('');
  $('#svcGrid').innerHTML = services.map(([i,t,d],n) => `<article class="svc glass reveal"><em>0${n+1}</em><span class="ico">${i}</span><h3>${t}</h3><p>${d}</p></article>`).join('');
  $('#track').innerHTML = [...techs,...techs].map(t => `<span>${t}</span>`).join('');
  $('#slides').innerHTML = reviews.map(([n,r,t,s]) => `<figure class="slide glass"><div class="who"><div class="av">${n[0]}</div><div><strong>${n}</strong><small>${r}</small></div></div><div class="st" aria-label="${s} out of 5">${'★'.repeat(s)}${'☆'.repeat(5-s)}</div><blockquote>${t}</blockquote></figure>`).join('');
}

/* ---------- Preloader ---------- */
function preloader() {
  let n = 0; const bar = $('#plBar'), pct = $('#plPct');
  const t = setInterval(() => {
    n = Math.min(100, n + Math.ceil(Math.random() * 9));
    bar.style.width = n + '%'; pct.textContent = n + '%';
    if (n >= 100) { clearInterval(t); setTimeout(() => $('#preloader').classList.add('done'), 300); }
  }, reduce ? 5 : 60);
}

/* ---------- Theme (localStorage) ---------- */
function theme() {
  let saved = null; try { saved = localStorage.getItem('theme'); } catch {}
  const set = v => { document.documentElement.dataset.theme = v; try { localStorage.setItem('theme', v); } catch {} };
  if (saved) document.documentElement.dataset.theme = saved;
  $('#theme').addEventListener('click', () => set(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
}

/* ---------- Navigation ---------- */
function nav() {
  const menu = $('#menu'), burger = $('#burger');
  const toggle = open => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); };
  burger.addEventListener('click', () => toggle(!menu.classList.contains('open')));
  menu.addEventListener('click', e => e.target.closest('a') && toggle(false));
  document.addEventListener('keydown', e => e.key === 'Escape' && toggle(false));
  const links = $$('#menu a');
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => io.observe(s));
}

/* ---------- Scroll: progress, navbar, back-to-top (one rAF-throttled listener) ---------- */
function scrollFx() {
  const bar = $('#progress'), nv = $('#nav'), top = $('#top'); let tick = false;
  const update = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    nv.classList.toggle('scrolled', y > 40); top.classList.toggle('show', y > 600); tick = false;
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  update();
}

/* ---------- Reveal, counters, skill bars (IntersectionObserver) ---------- */
function observers() {
  const once = (els, fn, th = .25) => { const io = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { fn(e.target); o.unobserve(e.target); } }), { threshold: th }); els.forEach(el => io.observe(el)); };
  once($$('.reveal'), el => el.classList.add('in'), .15);
  once($$('[data-w]'), el => el.style.width = el.dataset.w + '%');
  once($$('[data-count]'), el => {
    const end = +el.dataset.count; if (reduce) return el.textContent = end;
    const t0 = performance.now();
    (function step(t) { const p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(t0);
  });
}

/* ---------- Typing effect ---------- */
function typing() {
  const words = ['Frontend Developer','JavaScript Developer','UI/UX Enthusiast','Creative Coder'], el = $('#typed');
  if (reduce) return el.textContent = words[0];
  let w = 0, c = 0, del = false;
  (function loop() {
    const word = words[w]; c += del ? -1 : 1; el.textContent = word.slice(0, c);
    let d = del ? 40 : 90;
    if (!del && c === word.length) { del = true; d = 1400; } else if (del && c === 0) { del = false; w = (w + 1) % words.length; d = 300; }
    setTimeout(loop, d);
  })();
}

/* ---------- Project filter + modal ---------- */
function projectsUI() {
  $('.filters').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('.filters button').forEach(x => x.classList.toggle('active', x === b));
    $$('.card').forEach(c => c.classList.toggle('hide', b.dataset.f !== 'all' && !c.dataset.cat.split(' ').includes(b.dataset.f)));
  });
  const modal = $('#modal'); let last;
  const close = () => { modal.hidden = true; last && last.focus(); };
  $('#projGrid').addEventListener('click', e => {
    const c = e.target.closest('.card'); if (!c) return; last = c;
    const p = projects[c.dataset.i];
    $('#mBody').innerHTML = `<img src="images/project${p.img}.jpg" alt="${p.t} large preview"><h3 id="mTitle">${p.t}</h3><p>${p.d}</p><ul>${p.f.map(f=>`<li>${f}</li>`).join('')}</ul><div class="tags">${p.tech.map(t=>`<span>${t}</span>`).join('')}</div><div class="btns"><a class="btn ghost" href="#">GitHub</a><a class="btn primary" href="#">Live demo</a></div>`;
    modal.hidden = false; $('.m-close').focus();
  });
  modal.addEventListener('click', e => (e.target === modal || e.target.closest('.m-close')) && close());
  document.addEventListener('keydown', e => e.key === 'Escape' && !modal.hidden && close());
}

/* ---------- Testimonial slider ---------- */
function slider() {
  const slides = $$('.slide'), dots = $('#dots'), box = $('#slider'); let i = 0, timer;
  dots.innerHTML = slides.map((_, n) => `<button aria-label="Go to review ${n+1}"></button>`).join('');
  const go = n => { i = (n + slides.length) % slides.length; slides.forEach(s => s.style.transform = `translateX(-${i * 100}%)`); $$('button', dots).forEach((d, k) => d.classList.toggle('on', k === i)); };
  const auto = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => go(i + 1), 5000); };
  $('#prev').onclick = () => { go(i - 1); auto(); };
  $('#next').onclick = () => { go(i + 1); auto(); };
  dots.onclick = e => { const k = $$('button', dots).indexOf(e.target); if (k > -1) { go(k); auto(); } };
  box.addEventListener('mouseenter', () => clearInterval(timer)); box.addEventListener('mouseleave', auto);
  box.addEventListener('focusin', () => clearInterval(timer));
  go(0); auto();
}

/* ---------- Contact form (frontend-only demo) ---------- */
function form() {
  const f = $('#form'), st = $('#status');
  const rules = { name: v => v.trim() ? '' : 'Enter your name.', email: v => !v.trim() ? 'Enter your email.' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.', subject: v => v.trim() ? '' : 'Enter a subject.', message: v => v.trim().length >= 20 ? '' : 'Message must be at least 20 characters.' };
  f.addEventListener('submit', e => {
    e.preventDefault(); let ok = true;
    for (const k in rules) { const inp = f.elements[k], msg = rules[k](inp.value); inp.closest('label').classList.toggle('err', !!msg); inp.nextElementSibling.textContent = msg; if (msg) ok = false; }
    st.className = 'full show ' + (ok ? 'ok' : 'bad');
    st.textContent = ok ? 'Demo only: this form is not connected to a server, so nothing was sent.' : 'Fix the highlighted fields and try again.';
    if (ok) f.reset();
  });
}

/* ---------- Cursor, parallax, particles (desktop only) ---------- */
function desktopFx() {
  if (!fine || reduce) return;
  document.body.classList.add('has-cursor');
  const dot = $('.cursor-dot'), ring = $('.cursor-ring'); let mx = 0, my = 0, rx = 0, ry = 0;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; }, { passive: true });
  (function follow() { rx += (mx - rx) * .15; ry += (my - ry) * .15; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(follow); })();
  document.addEventListener('mouseover', e => ring.classList.toggle('hover', !!e.target.closest('a,button,input,textarea,.card')));
  // Mouse parallax on hero visuals
  const layers = $$('[data-depth]');
  addEventListener('mousemove', e => { const x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5); layers.forEach(l => l.style.transform = `translate(${x * l.dataset.depth}px,${y * l.dataset.depth}px)`); }, { passive: true });
  // Lightweight particles
  const cv = $('#particles'), ctx = cv.getContext('2d'); let pts = [];
  const size = () => { cv.width = innerWidth; cv.height = innerHeight; pts = Array.from({ length: Math.min(60, innerWidth / 25 | 0) }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 })); };
  size(); addEventListener('resize', size);
  (function draw() {
    if (!document.hidden) {
      ctx.clearRect(0, 0, cv.width, cv.height); ctx.fillStyle = 'rgba(0,229,255,.6)';
      pts.forEach((p, i) => {
        p.x = (p.x + p.vx + cv.width) % cv.width; p.y = (p.y + p.vy + cv.height) % cv.height;
        ctx.fillRect(p.x, p.y, 2, 2);
        for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(p.x - pts[j].x, p.y - pts[j].y); if (d < 110) { ctx.strokeStyle = `rgba(139,92,246,${.25 * (1 - d / 110)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); } }
      });
    }
    requestAnimationFrame(draw);
  })();
}

/* ---------- Init ---------- */
render(); preloader(); theme(); nav(); scrollFx(); observers(); typing(); projectsUI(); slider(); form(); desktopFx();
})();
