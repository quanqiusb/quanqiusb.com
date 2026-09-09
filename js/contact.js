/* contact.js — form handler (mailto fallback for static site) */
(function () {
  'use strict';
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const topic = (data.get('topic') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();
    if (!name || !email || !topic || !message) {
      note.textContent = 'Please fill in all required fields.';
      note.classList.add('error');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      note.textContent = 'Please enter a valid email address.';
      note.classList.add('error');
      return;
    }
    const subject = encodeURIComponent('[GAMD] ' + topic + ' — ' + name);
    const body = encodeURIComponent(
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n' +
      'Organisation: ' + (data.get('org') || '') + '\n' +
      'Topic: ' + topic + '\n\n' +
      message + '\n'
    );
    window.location.href = 'mailto:support@quanqiusb.com?subject=' + subject + '&body=' + body;
    note.textContent = 'Opening your email client…';
    note.classList.remove('error');
  });
})();
