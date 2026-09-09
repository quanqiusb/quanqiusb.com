/* main.js — nav, mobile menu, scroll effects, page load, smooth scroll, form */
(function () {
  'use strict';

  // Mark page as JS-enabled and start loader
  const body = document.body;

  // --- Page loader progress bar ---
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  document.body.appendChild(loader);
  requestAnimationFrame(() => { loader.style.width = '60%'; });

  // --- Sticky header scroll state ---
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    const scrolled = window.scrollY > 12;
    header.classList.toggle('is-scrolled', scrolled);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile menu toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close on link click (mobile)
    nav.addEventListener('click', (e) => {
      if (e.target.matches('a')) {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || menuToggle.contains(e.target)) return;
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  }

  // --- Active nav link based on path ---
  try {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const links = document.querySelectorAll('.site-nav__link');
    links.forEach((a) => {
      const href = a.getAttribute('href');
      if (!href) return;
      const normalized = href.replace(/^\.\//, '/').replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '') || '/';
      if (normalized === path) a.classList.add('is-active');
      if (path === '/' && (normalized === '/' || normalized === '/index.html' || normalized === '')) {
        a.classList.add('is-active');
      }
    });
  } catch (_) { /* noop */ }

  // --- Smooth scroll for in-page anchors ---
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const headerH = header ? header.offsetHeight : 0;
    const y = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });

  // --- Reveal-on-scroll using IntersectionObserver ---
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: just reveal everything
    revealEls.forEach((el) => el.classList.add('is-revealed'));
  }

  // --- Mark page as loaded (trigger load animations) ---
  window.addEventListener('load', () => {
    body.classList.add('page-loaded');
    loader.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('is-done');
      setTimeout(() => loader.remove(), 400);
    }, 200);
  });

  // --- Animated number counters ---
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseFloat(el.getAttribute('data-count')) || 0;
        const duration = parseInt(el.getAttribute('data-duration')) || 1800;
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const startTime = performance.now();
        const start = 0;
        const ease = (t) => 1 - Math.pow(1 - t, 3);
        const tick = (now) => {
          const t = Math.min((now - startTime) / duration, 1);
          const v = start + (end - start) * ease(t);
          el.textContent = prefix + (Number.isInteger(end) ? Math.round(v).toLocaleString() : v.toFixed(1)) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countIO.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => countIO.observe(el));
  }

  // --- Contact form (client-side only — shows confirmation, no real submit) ---
  const form = document.querySelector('[data-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const notice = form.querySelector('.form__notice');
      const submit = form.querySelector('[type="submit"]');
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Sending…';
      }
      setTimeout(() => {
        if (notice) {
          notice.classList.add('is-visible');
          notice.textContent = '✓ Thanks! Your message has been received. Our team will get back to you within 2 business days.';
        }
        form.reset();
        if (submit) {
          submit.disabled = false;
          submit.textContent = 'Send Message';
        }
        setTimeout(() => notice && notice.classList.remove('is-visible'), 6000);
      }, 700);
    });
  }

  // --- News filter buttons ---
  const filterButtons = document.querySelectorAll('.news-filter');
  const newsCards = document.querySelectorAll('.news-card[data-tag]');
  if (filterButtons.length && newsCards.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const tag = btn.getAttribute('data-filter');
        newsCards.forEach((card) => {
          const cardTag = card.getAttribute('data-tag');
          if (tag === 'all' || cardTag === tag) {
            card.style.display = '';
            requestAnimationFrame(() => card.classList.add('is-revealed'));
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Update copyright year ---
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
