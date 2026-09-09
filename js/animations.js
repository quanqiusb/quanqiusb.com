/* GAMD - animations.js — scroll reveal, counters, parallax, emoji bubbles */
(function () {
  'use strict';

  // ---- IntersectionObserver: reveal elements ----
  const revealTargets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in'));
  }

  // ---- Animated counters ----
  const counters = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window && counters.length) {
    const animate = (el) => {
      const target = parseFloat(el.getAttribute('data-counter'));
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = parseInt(el.getAttribute('data-duration') || '1800', 10);
      const start = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const v = target * ease(p);
        el.textContent = v.toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals) + suffix;
      };
      requestAnimationFrame(tick);
    };
    const co = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => co.observe(el));
  }

  // ---- Subtle parallax on hero ----
  const parallax = document.querySelectorAll('[data-parallax]');
  if (parallax.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        parallax.forEach(el => {
          const speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
          el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
        });
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Tilt-on-hover for cards (subtle 3D) ----
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    let raf = null;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
      });
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
