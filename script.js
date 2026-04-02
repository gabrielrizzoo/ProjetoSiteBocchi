/**
 * Global Script — Bocchi The Rock! Website
 * Handles: Mobile menu, scroll reveal, header shrink, back-to-top
 */

document.addEventListener('DOMContentLoaded', () => {
  // ================================================
  // MOBILE MENU
  // ================================================
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.main-nav');
  const icon = mobileBtn ? mobileBtn.querySelector('span') : null;
  const overlay = document.querySelector('.menu-overlay');

  function openMenu() {
    nav.classList.add('active');
    if (overlay) overlay.classList.add('active');
    if (icon) icon.textContent = 'close';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (icon) icon.textContent = 'menu';
    document.body.style.overflow = '';
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      if (nav.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // Close menu when clicking overlay
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close menu when clicking a nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (nav && nav.classList.contains('active')) {
        closeMenu();
      }
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
      closeMenu();
    }
  });

  // ================================================
  // HEADER SHRINK ON SCROLL
  // ================================================
  const header = document.querySelector('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (header) {
      if (currentScroll > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // ================================================
  // SCROLL REVEAL (IntersectionObserver)
  // ================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ================================================
  // BACK TO TOP BUTTON
  // ================================================
  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ================================================
  // SCROLL INDICATOR (Home page)
  // ================================================
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const nextSection = document.getElementById('trailer-container');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});