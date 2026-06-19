(function () {
  'use strict';

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  var isHttp = location.protocol === 'http:' || location.protocol === 'https:';

  try {
    var header = $('#siteHeader');
    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
      }, { passive: true });
    }
  } catch (e) {}

  try {
    var burger = $('#burger');
    var nav = $('.primary-nav');
    if (burger && nav) {
      burger.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
      });
      $$('a', nav).forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }
  } catch (e) {}

  try {
    var themeBtn = $('#themeToggle');
    var root = document.documentElement;
    try {
      var stored = localStorage.getItem('atih-theme');
      if (stored) root.setAttribute('data-theme', stored);
    } catch (e) {}
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('atih-theme', next); } catch (e) {}
      });
    }
  } catch (e) {}

  try {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      $$('.reveal').forEach(function (el) { io.observe(el); });
    }
  } catch (e) {}

  try {
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var el = e.target;
            var target = parseFloat(el.dataset.count);
            var pre = el.dataset.prefix || '';
            var suf = el.dataset.suffix || '';
            var dur = 1600;
            var start = performance.now();
            var tick = function (now) {
              var p = Math.min((now - start) / dur, 1);
              var eased = 1 - Math.pow(1 - p, 4);
              var v = target * eased;
              var txt = target >= 1000
                ? Math.floor(v).toLocaleString()
                : v.toFixed(target % 1 ? 1 : 0);
              el.textContent = pre + txt + suf;
              if (p < 1) requestAnimationFrame(tick);
              else el.textContent = pre + (target >= 1000 ? Math.floor(target).toLocaleString() : target) + suf;
            };
            requestAnimationFrame(tick);
            cio.unobserve(el);
          }
        });
      }, { threshold: 0.4 });
      $$('.stat-num').forEach(function (c) { cio.observe(c); });
    }
  } catch (e) {}

  try {
    var form = $('#newsletterForm');
    var msg = $('#newsMsg');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = $('#newsEmail');
        var email = input ? input.value.trim() : '';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          if (msg) { msg.textContent = 'That email looks off. Try again?'; msg.className = 'form-msg is-err'; }
          return;
        }
        if (msg) { msg.textContent = 'Opening email client…'; msg.className = 'form-msg'; }
        window.location.href = 'mailto:austinewandera01@gmail.com?subject=Project%20enquiry&body=' + encodeURIComponent(email);
        setTimeout(function () {
          if (msg) { msg.textContent = 'Done — finish sending from your email.'; msg.className = 'form-msg is-ok'; }
          form.reset();
        }, 700);
      });
    }
  } catch (e) {}

  try {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var t = $(id);
        if (!t) return;
        e.preventDefault();
        try { t.scrollIntoView({ behavior: 'smooth' }); } catch (err) { t.scrollIntoView(); }
        if (isHttp) {
          try { history.pushState(null, '', id); } catch (err) {}
        }
      });
    });
  } catch (e) {}

  try {
    $$('.display .word').forEach(function (w, i) {
      var inner = w.innerHTML;
      w.innerHTML = '<span style="transition-delay:' + (i * 70) + 'ms">' + inner + '</span>';
    });
    setTimeout(function () {
      var d = $('.display');
      if (d) d.classList.add('is-visible');
    }, 100);
  } catch (e) {}

  try {
    var langBtn = $('#langBtn');
    var langMenu = $('#at-translate');
    if (langBtn && langMenu) {
      langBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        langMenu.classList.toggle('is-open');
      });
      document.addEventListener('click', function () { langMenu.classList.remove('is-open'); });
      $$('button[data-lang]', langMenu).forEach(function (b) {
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          var code = b.dataset.lang;
          if (window.atSetLang) window.atSetLang(code);
          langMenu.classList.remove('is-open');
          langBtn.setAttribute('aria-label', 'Change language — current: ' + code);
        });
      });
    }
  } catch (e) {}

  try {
    var savedLang = (function () { try { return localStorage.getItem('at-lang'); } catch (e) { return null; } })();
    if (savedLang && savedLang !== 'en' && window.atSetLang) {
      var apply = function () { window.atSetLang(savedLang); };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apply);
      } else {
        setTimeout(apply, 50);
      }
    }
  } catch (e) {}

})();
