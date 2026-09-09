/* animations.js — decorative effects: parallax, tilt, mascot trails */
(function () {
  'use strict';

  // --- Parallax (light) for hero illustration on pointer move ---
  const hero = document.querySelector('.hero');
  if (hero && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const visual = hero.querySelector('.hero__visual');
    const mascots = hero.querySelectorAll('.hero__mascot');
    let raf = null;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener('pointerleave', () => {
      targetX = 0; targetY = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    });

    function loop() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      if (visual) visual.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      mascots.forEach((m, i) => {
        const factor = (i + 1) * 1.2;
        m.style.transform = `translate3d(${-currentX * factor}px, ${-currentY * factor}px, 0)`;
      });
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }
  }

  // --- 3D tilt on service block visuals ---
  const tiltEls = document.querySelectorAll('[data-tilt]');
  if (tiltEls.length && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    tiltEls.forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5);
        const y = ((e.clientY - r.top) / r.height - 0.5);
        el.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  // --- Set CSS custom property for SVG path drawing animations ---
  document.querySelectorAll('[data-draw]').forEach((el) => {
    try {
      const len = el.getTotalLength ? el.getTotalLength() : 1000;
      el.style.setProperty('--len', len);
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
    } catch (_) { /* not a path, skip */ }
  });

  // --- Header dark variant for dark hero sections ---
  const darkSections = document.querySelectorAll('.hero, .subhero');
  if (darkSections.length && headerForDark(darkSections[0])) {
    const header = document.querySelector('.site-header');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          header.classList.add('is-dark');
        } else if (entry.target === darkSections[0]) {
          // Only flip back when we've scrolled past the first dark section
          if (window.scrollY < entry.boundingClientRect.bottom) return;
          header.classList.remove('is-dark');
        }
      });
    }, { rootMargin: `-${getHeaderHeight()}px 0px 0px 0px` });
    darkSections.forEach((s) => observer.observe(s));

    // Cleanup: when scrolled to top of any non-dark page, remove dark
    window.addEventListener('scroll', () => {
      if (window.scrollY < 50) {
        const topIsDark = darkSections[0].getBoundingClientRect().bottom > 50;
        header.classList.toggle('is-dark', topIsDark);
      }
    }, { passive: true });
  }

  function headerForDark(el) { return el; }
  function getHeaderHeight() {
    const h = document.querySelector('.site-header');
    return h ? h.offsetHeight : 72;
  }

  // --- Add subtle hover float to card icons (CSS handles transform, this just adds slight randomness) ---
  document.querySelectorAll('.card__icon').forEach((icon) => {
    icon.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.15) rotate(-8deg)';
    });
    icon.addEventListener('mouseleave', () => {
      icon.style.transform = '';
    });
  });
})();
