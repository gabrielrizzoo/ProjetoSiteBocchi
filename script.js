/**
 * Global Script — Bocchi The Rock! Website
 * Handles: tema, menu mobile, header, scroll reveal, voltar ao topo
 * (o mini player fica em player.js)
 *
 * O tema salvo é aplicado por um script inline no <head> de cada página,
 * antes da primeira pintura, para evitar o "flash" de tema errado.
 */

const THEME_KEY = 'bocchiTheme';
const root = document.documentElement;

// ================================================
// FORM FEEDBACK (usado por contato.js e comentarios.js)
// ================================================
const FormFeedback = {
  error(input, message) {
    this.clear(input);
    const errorEl = document.createElement('span');
    errorEl.className = 'field-error-msg';
    errorEl.id = `${input.id}-error`;
    errorEl.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">error</span>';
    errorEl.append(message);
    input.classList.add('field-error');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorEl.id);
    input.insertAdjacentElement('afterend', errorEl);
  },

  success(input) {
    this.clear(input);
    input.classList.add('field-success');
  },

  clear(input) {
    input.classList.remove('field-error', 'field-success');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    const existing = input.parentElement.querySelector('.field-error-msg');
    if (existing) existing.remove();
  },

  // Mensagem de sucesso acima do formulário, some sozinha
  flash(form, message, duration = 3500) {
    const old = form.parentElement.querySelector('.form-success');
    if (old) old.remove();

    const msg = document.createElement('div');
    msg.className = 'form-success';
    msg.setAttribute('role', 'status');
    msg.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">check_circle</span>';
    msg.append(message);
    form.parentElement.insertBefore(msg, form);

    setTimeout(() => {
      msg.style.opacity = '0';
      setTimeout(() => msg.remove(), 300);
    }, duration);
  }
};

// ================================================
// PWA SERVICE WORKER
// ================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .catch(err => console.error('Falha ao registrar Service Worker', err));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // ================================================
  // THEME TOGGLE
  // ================================================
  const themeBtns = document.querySelectorAll('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function syncThemeUI() {
    const isLight = root.classList.contains('light-theme');
    themeBtns.forEach(btn => btn.setAttribute('aria-pressed', String(isLight)));
    if (themeMeta) themeMeta.setAttribute('content', isLight ? '#f5f2eb' : '#0d0c10');
  }

  function toggleTheme() {
    root.classList.add('theme-transitioning');
    const isLight = root.classList.toggle('light-theme');

    try {
      localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
    } catch {
      // Storage indisponível — o tema vale só para esta visita
    }

    syncThemeUI();
    setTimeout(() => root.classList.remove('theme-transitioning'), 400);
  }

  themeBtns.forEach(btn => btn.addEventListener('click', toggleTheme));
  syncThemeUI();

  // ================================================
  // MOBILE MENU
  // ================================================
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.main-nav');
  const menuIcon = menuBtn ? menuBtn.querySelector('.material-symbols-outlined') : null;
  const overlay = document.querySelector('.menu-overlay');
  const mobileQuery = window.matchMedia('(max-width: 820px)');

  function setMenu(open) {
    if (!nav || !menuBtn) return;
    nav.classList.toggle('active', open);
    if (overlay) overlay.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (menuIcon) menuIcon.textContent = open ? 'close' : 'menu';

    if (open) {
      const firstLink = nav.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  }

  const isMenuOpen = () => nav && nav.classList.contains('active');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => setMenu(!isMenuOpen()));
  }

  if (overlay) {
    overlay.addEventListener('click', () => setMenu(false));
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen()) setMenu(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen()) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  // Fecha o menu se a tela crescer para o layout desktop
  mobileQuery.addEventListener('change', (e) => {
    if (!e.matches && isMenuOpen()) setMenu(false);
  });

  // ================================================
  // HEADER + BACK TO TOP ON SCROLL
  // ================================================
  const header = document.querySelector('.site-header');
  const backToTop = document.querySelector('.back-to-top');

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (backToTop) backToTop.classList.toggle('visible', y > 600);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ================================================
  // SCROLL REVEAL (IntersectionObserver)
  // ================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealElements.forEach(el => el.classList.add('active'));
  } else if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ================================================
  // DYNAMIC COPYRIGHT YEAR
  // ================================================
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.copyright-year').forEach(el => {
    el.textContent = currentYear > 2024 ? `2024–${currentYear}` : '2024';
  });

});
