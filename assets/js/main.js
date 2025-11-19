/* NZT Foundation interactivity */
(function() {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // Mobile nav toggle
  const toggle = $('.nav__toggle');
  const navList = $('#nav-list');
  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Smooth scroll and active link highlighting
  const links = $$('.nav__link');
  links.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navList) navList.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // IntersectionObserver for active section
  const sectionIds = ['about','solutions','capabilities','testimonials','contact'];
  const sectionMap = new Map(sectionIds.map(id => [id, document.getElementById(id)]));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { threshold: 0.5 });
  sectionMap.forEach(sec => sec && obs.observe(sec));

  // Year in footer
  const year = new Date().getFullYear();
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(year);

  // Contact form (demo only)
  const form = $('.form');
  const note = $('.form__note');
  if (form && note) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const message = String(data.get('message') || '').trim();

      if (!name || !email || !message) {
        note.textContent = 'Please complete all fields.';
        note.style.color = '#ff9aa2';
        return;
      }
      note.textContent = 'Thanks! We\'ll get back to you soon.';
      note.style.color = '';
      form.reset();
    });
  }

  // Parallax effect on hero shader
  const shader = $('.hero__shader');
  if (shader) {
    window.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      shader.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
})();



