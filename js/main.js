/* GAMD - main.js — navigation, mobile menu, navbar solid, smooth scroll */
(function () {
  'use strict';

  // ---- Navbar: toggle solid background on scroll & on light pages ----
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const isLight = navbar.classList.contains('navbar-solid');
    const onScroll = () => {
      if (!isLight) {
        if (window.scrollY > 30) {
          navbar.classList.add('navbar-solid');
        } else {
          navbar.classList.remove('navbar-solid');
        }
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Mobile menu ----
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Smooth scroll for in-page anchors ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Active nav link based on path ----
  const path = location.pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '/') || '/';
  const map = {
    '/': 'index.html',
    '/services.html': 'services.html',
    '/culture.html': 'culture.html',
    '/news.html': 'news.html',
    '/contact.html': 'contact.html',
    '/privacy.html': 'privacy.html',
    '/terms.html': 'terms.html'
  };
  const target = map[path] || (path === '/' ? 'index.html' : null);
  if (target) {
    document.querySelectorAll('.nav-link').forEach(l => {
      const href = l.getAttribute('href');
      if (!href) return;
      if (href === target) l.classList.add('active');
      if (path === '/' && href === 'index.html') l.classList.add('active');
    });
  }

  // ---- Current year in footer ----
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
})();
