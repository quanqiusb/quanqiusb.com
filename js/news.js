/* news.js — category filter */
(function () {
  'use strict';
  const chips = document.querySelectorAll('.news-filter .chip');
  const cards = document.querySelectorAll('.news-grid-full .news-card');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const f = chip.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const show = (f === 'all' || f === cat);
        card.hidden = !show;
      });
    });
  });
})();
