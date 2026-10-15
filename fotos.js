/**
 * Fotos Page — Gallery & Lightbox Script
 */
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('imageModal');
  if (!modal) return;

  const modalImg = document.getElementById('modalImage');
  const captionText = document.getElementById('caption');
  const counterText = document.getElementById('modalCounter');
  const closeBtn = modal.querySelector('.close-button');
  const prevBtn = modal.querySelector('.modal-prev');
  const nextBtn = modal.querySelector('.modal-next');
  const pageParts = document.querySelectorAll('.site-header, main, .site-footer');

  let currentGridItems = [];
  let currentIndex = 0;
  let lastFocusedElement = null;
  let switchTimer = null;

  // Cada grade (anime / shows) navega só entre as próprias fotos
  document.querySelectorAll('.photo-grid').forEach(grid => {
    const items = Array.from(grid.querySelectorAll('.grid-item'));

    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        currentGridItems = items;
        currentIndex = index;
        openModal();
      });
    });
  });

  function showImage() {
    const img = currentGridItems[currentIndex].querySelector('img');

    modalImg.classList.add('is-switching');
    clearTimeout(switchTimer);
    switchTimer = setTimeout(() => {
      modalImg.src = img.currentSrc || img.src;
      modalImg.alt = img.alt;
      captionText.textContent = img.alt;
      counterText.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(currentGridItems.length).padStart(2, '0')}`;
      modalImg.classList.remove('is-switching');
    }, 150);

    const single = currentGridItems.length <= 1;
    prevBtn.hidden = single;
    nextBtn.hidden = single;
  }

  function openModal() {
    if (!modal.classList.contains('show')) {
      lastFocusedElement = document.activeElement;
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      pageParts.forEach(el => el.setAttribute('inert', ''));
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }
    showImage();
  }

  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    pageParts.forEach(el => el.removeAttribute('inert'));
    document.body.style.overflow = '';

    // Devolve o foco para a foto que abriu o modal
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  function step(delta) {
    currentIndex = (currentIndex + delta + currentGridItems.length) % currentGridItems.length;
    showImage();
  }

  closeBtn.addEventListener('click', closeModal);
  nextBtn.addEventListener('click', () => step(1));
  prevBtn.addEventListener('click', () => step(-1));

  // Clicar fora da imagem fecha
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-figure')) closeModal();
  });

  // Teclado + focus trap
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('show')) return;

    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);

    if (e.key === 'Tab') {
      const focusable = [closeBtn, prevBtn, nextBtn].filter(el => !el.hidden);
      const i = focusable.indexOf(document.activeElement);
      e.preventDefault();
      const next = e.shiftKey
        ? (i <= 0 ? focusable.length - 1 : i - 1)
        : (i >= focusable.length - 1 ? 0 : i + 1);
      focusable[next].focus();
    }
  });

  // Deslizar no celular
  let touchStartX = null;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    touchStartX = null;
  }, { passive: true });
});
