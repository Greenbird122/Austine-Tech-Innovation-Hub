/* ATIH v2 — bespoke motion + interactions */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;

  /* ----- Sticky header ----- */
  const header = $('#siteHeader');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- Mobile menu ----- */
  const burger = $('#burger');
  const nav = $('.primary-nav');
  if (burger) burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('a', nav).forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  /* ----- Theme ----- */
  const themeBtn = $('#themeToggle');
  const root = document.documentElement;
  const stored = localStorage.getItem('atih-theme');
  if (stored) root.setAttribute('data-theme', stored);
  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('atih-theme', next);
  });

  /* ----- Custom cursor ----- */
  const cursor = $('#cursor');
  const cursorDot = $('#cursorDot');
  if (cursor && !isTouch) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`; });
    const loop = () => {
      cx += (mx - cx) * 0.15; cy += (my - cy) * 0.15;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    document.addEventListener('mouseenter', () => { cursor.classList.add('is-on'); cursorDot.classList.add('is-on'); });
    document.addEventListener('mouseleave', () => { cursor.classList.remove('is-on'); cursorDot.classList.remove('is-on'); });
    $$('a, button, [data-tilt]').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  /* ----- Reveal on scroll ----- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    $$('.reveal, [data-reveal]').forEach(el => io.observe(el));
  } else $$('.reveal, [data-reveal]').forEach(el => el.classList.add('is-visible'));

  /* ----- Hero parallax photos ----- */
  if (!reduce && !isTouch) {
    const photos = $$('.hero-photo .photo');
    const heroPh = $('.hero-photo');
    if (heroPh) {
      heroPh.addEventListener('mousemove', e => {
        const r = heroPh.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        photos.forEach(p => {
          const s = parseFloat(p.dataset.speed) || 1;
          p.style.transform = `${p.style.getPropertyValue('--base-tilt') || ''} translate(${x * 12 * s}px, ${y * 12 * s}px)`;
        });
      });
      heroPh.addEventListener('mouseleave', () => {
        photos.forEach((p, i) => {
          const base = ['rotate(2deg)', 'rotate(-3deg)', 'rotate(5deg)'][i];
          p.style.transform = base;
        });
      });
    }

    /* scroll parallax */
    addEventListener('scroll', () => {
      photos.forEach((p, i) => {
        const r = p.getBoundingClientRect();
        const speed = [.04, -.06, .08][i] || 0;
        if (r.top < innerHeight && r.bottom > 0) p.style.translate = `0 ${(r.top - innerHeight/2) * speed}px`;
      });
    }, { passive: true });
  }

  /* ----- Tilt cards ----- */
  if (!reduce && !isTouch) {
    $$('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
        const y = ((e.clientY - r.top) / r.height - 0.5) * -8;
        card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ----- Magnetic buttons ----- */
  if (!reduce && !isTouch) {
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ----- Stat counters ----- */
  const animateCount = el => {
    const target = +el.dataset.count;
    const pre = el.dataset.prefix || '';
    const suf = el.dataset.suffix || '';
    const dur = 1600;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      const v = target * e;
      const txt = target >= 1000 ? Math.floor(v).toLocaleString() : (v.toFixed(target % 1 ? 1 : 0));
      el.textContent = pre + txt + suf;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = pre + (target >= 1000 ? Math.floor(target).toLocaleString() : target) + suf;
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } }), { threshold: 0.4 });
    $$('.stat-num').forEach(c => cio.observe(c));
  }

  /* ----- Startup filter ----- */
  const chips = $$('.filters .chip');
  const cards = $$('.m-card');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.remove('is-active'));
    c.classList.add('is-active');
    const f = c.dataset.filter;
    cards.forEach(card => card.classList.toggle('is-hidden', f !== 'all' && card.dataset.sector !== f));
  }));

  /* ----- Newsletter ----- */
  const form = $('#newsletterForm');
  const msg = $('#newsMsg');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const email = $('#newsEmail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = 'That email looks off. Try again?'; msg.className = 'form-msg is-err'; return;
    }
    msg.textContent = 'Sending…'; msg.className = 'form-msg';
    setTimeout(() => { msg.textContent = "✓ You're in. Check your inbox."; msg.className = 'form-msg is-ok'; form.reset(); }, 700);
  });

  /* ----- Search modal ----- */
  const sBtn = $('#searchBtn');
  const sModal = $('#searchModal');
  const sInput = $('#searchInput');
  sBtn?.addEventListener('click', () => { sModal.hidden = false; setTimeout(() => sInput.focus(), 50); });
  $$('[data-close]', sModal).forEach(el => el.addEventListener('click', () => sModal.hidden = true));
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && !sModal.hidden) sModal.hidden = true;
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); sBtn?.click(); }
  });

  /* ----- Smooth scroll ----- */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = $(id);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); history.pushState(null, '', id); t.setAttribute('tabindex', '-1'); setTimeout(() => t.focus({ preventScroll: true }), 500); }
  }));

  /* ----- Hero word reveal ----- */
  if (!reduce) {
    const words = $$('.display .word');
    words.forEach((w, i) => {
      const inner = w.innerHTML;
      w.innerHTML = `<span style="transition-delay:${i * 70}ms">${inner}</span>`;
    });
    setTimeout(() => { $('.display')?.classList.add('is-visible'); }, 100);
  }
})();
