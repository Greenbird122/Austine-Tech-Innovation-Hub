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
    var heroPhotos = $$('[data-speed]');
    if (heroPhotos.length) {
      window.addEventListener('scroll', function () {
        var scrolled = window.scrollY;
        var hero = $('.hero');
        if (!hero) return;
        var heroBottom = hero.offsetTop + hero.offsetHeight;
        if (scrolled > heroBottom) return;
        heroPhotos.forEach(function (photo) {
          var speed = parseFloat(photo.dataset.speed) || 1;
          photo.style.transform = 'translateY(' + (scrolled * (speed - 1) * 0.15) + 'px)';
        });
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
          e.target.classList.toggle('is-visible', e.isIntersecting);
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

  try {
    var progressBar = $('#scrollProgress');
    var backBtn = $('#backToTop');
    window.addEventListener('scroll', function () {
      if (progressBar) {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = Math.min(progress, 100) + '%';
      }
      if (backBtn) {
        backBtn.classList.toggle('is-visible', window.scrollY > 500);
      }
    }, { passive: true });
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  } catch (e) {}

  try {
    var testiTrack = $('#testiTrack');
    var testiDots = $$('.testi-dot');
    if (testiTrack && testiDots.length) {
      var current = 0;
      var total = testiDots.length;
      var interval;

      function goTo(index) {
        current = index;
        testiTrack.style.transform = 'translateX(-' + (current * 100) + '%)';
        testiDots.forEach(function (d, i) {
          d.classList.toggle('is-active', i === current);
        });
      }

      testiDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          goTo(parseInt(dot.dataset.index, 10));
          resetTimer();
        });
      });

      function resetTimer() {
        clearInterval(interval);
        interval = setInterval(function () {
          goTo((current + 1) % total);
        }, 6000);
      }

      resetTimer();
    }
  } catch (e) {}

  try {
    var flowLine = $('#flowLine');
    var flowSteps = $$('.flow-step');
    if (flowLine && flowSteps.length) {
      var ft = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            ft.unobserve(e.target);

            var visible = flowSteps.filter(function (s) { return s.classList.contains('is-visible'); });
            var fraction = visible.length / flowSteps.length;
            flowLine.style.transform = 'scaleY(' + fraction + ')';
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
      flowSteps.forEach(function (s) { ft.observe(s); });
    }
  } catch (e) {}

})();
