/**
 * Global Script — Bocchi The Rock! Website
 * Handles: Mobile menu, scroll reveal, header shrink, back-to-top, theme toggle
 */

// ================================================
// THEME INITIALIZATION (Avoid FOUC)
// ================================================
(function initTheme() {
  const savedTheme = localStorage.getItem('bocchiTheme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-theme');
    document.body.classList.add('light-theme'); // Backup for older code
  }
})();

// ================================================
// PWA SERVICE WORKER
// ================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('Service Worker registrado!', reg))
      .catch(err => console.error('Falha ao registrar Service Worker', err));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // ================================================
  // THEME TOGGLE LOGIC
  // ================================================
  const themeBtns = document.querySelectorAll('.theme-toggle');
  
  function toggleTheme() {
    // Add transition class for smooth color change
    document.body.classList.add('theme-transitioning');

    const isLight = document.body.classList.contains('light-theme');
    if (isLight) {
      document.body.classList.remove('light-theme');
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('bocchiTheme', 'dark');
    } else {
      document.body.classList.add('light-theme');
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('bocchiTheme', 'light');
    }

    // Remove transition class after animation completes
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 600);
  }

  themeBtns.forEach(btn => btn.addEventListener('click', toggleTheme));

  // ================================================
  // SPLASH SCREEN
  // ================================================
  const splash = document.getElementById('splash-screen');
  if (splash) {
    // Hide splash after load event, with a small min-delay to show the animation
    window.addEventListener('load', () => {
      setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => splash.remove(), 600); // Wait for transition then remove from DOM
      }, 500);
    });
  }

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
  // DYNAMIC COPYRIGHT YEAR
  // ================================================
  const copyrightYears = document.querySelectorAll('.copyright-year');
  const currentYear = new Date().getFullYear();
  copyrightYears.forEach(el => {
    el.textContent = currentYear > 2024 ? `2024–${currentYear}` : '2024';
  });

  // ================================================
  // FLOATING MINI PLAYER INJECTION
  // ================================================
  function initMiniPlayer() {
    // Don't show player if user previously dismissed it this session
    if (sessionStorage.getItem('bocchiPlayerDismissed') === 'true') return;

    const playerHTML = `
      <div id="mini-player" class="mini-player">
        <div class="player-cover"></div>
        <div class="player-info">
          <p class="player-title">Seishun Complex</p>
          <p class="player-band">Kessoku Band</p>
        </div>
        <div class="player-controls">
          <button class="player-btn" aria-label="Anterior">
            <span class="material-symbols-outlined">skip_previous</span>
          </button>
          <button id="player-play-btn" class="player-btn play-btn" aria-label="Tocar">
            <span class="material-symbols-outlined" id="play-icon">play_arrow</span>
          </button>
          <button class="player-btn" aria-label="Próxima">
            <span class="material-symbols-outlined">skip_next</span>
          </button>
        </div>
        <button id="player-close-btn" class="player-btn player-close" aria-label="Fechar player">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', playerHTML);
    
    const player = document.getElementById('mini-player');
    const playBtn = document.getElementById('player-play-btn');
    const playIcon = document.getElementById('play-icon');
    const closePlayerBtn = document.getElementById('player-close-btn');
    
    // Slide in animation after 1.5s
    setTimeout(() => {
      player.classList.add('visible');
    }, 1500);

    // Close/dismiss player
    closePlayerBtn.addEventListener('click', () => {
      player.classList.remove('visible');
      sessionStorage.setItem('bocchiPlayerDismissed', 'true');
      setTimeout(() => player.remove(), 600);
    });

    // Toggle Play/Pause UI (Visual only)
    let isPlaying = sessionStorage.getItem('bocchiPlayerPlaying') === 'true';
    
    function updatePlayerState() {
      if (isPlaying) {
        player.classList.add('playing');
        playIcon.textContent = 'pause';
      } else {
        player.classList.remove('playing');
        playIcon.textContent = 'play_arrow';
      }
    }

    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      sessionStorage.setItem('bocchiPlayerPlaying', isPlaying);
      updatePlayerState();
    });

    // Initialize state
    updatePlayerState();
  }

  initMiniPlayer();
});