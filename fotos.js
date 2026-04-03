/**
 * Fotos Page — Gallery & Lightbox Script
 */
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const captionText = document.getElementById('caption');
  const counterText = document.getElementById('modalCounter');
  const closeBtn = document.querySelector('.close-button');
  const prevBtn = document.querySelector('.modal-prev');
  const nextBtn = document.querySelector('.modal-next');

  let currentGridItems = [];
  let currentIndex = 0;
  let lastFocusedElement = null;
  const focusableElements = [closeBtn, prevBtn, nextBtn];

  // Attach click events to all grid items
  const photoGrids = document.querySelectorAll('.photo-grid');

  photoGrids.forEach(grid => {
    const items = Array.from(grid.querySelectorAll('.grid-item'));

    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        currentGridItems = items;
        currentIndex = index;
        openModal();
      });
    });
  });

  function openModal() {
    const item = currentGridItems[currentIndex];
    const img = item.querySelector('img');

    // Add transition effect
    modalImg.style.opacity = '0';
    modalImg.style.transform = 'scale(0.95)';

    setTimeout(() => {
      modalImg.src = img.src;
      captionText.textContent = img.alt || '';

      // Update counter
      if (counterText) {
        counterText.textContent = `${currentIndex + 1} / ${currentGridItems.length}`;
      }

      modalImg.style.opacity = '1';
      modalImg.style.transform = 'scale(1)';
    }, 150);

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus trap: save trigger and focus close button
    lastFocusedElement = document.activeElement;
    closeBtn.focus();

    updateNavigationButtons();
  }

  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Restore focus to the element that opened the modal
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  function updateNavigationButtons() {
    if (currentGridItems.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % currentGridItems.length;
    openModal();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + currentGridItems.length) % currentGridItems.length;
    openModal();
  }

  // Event Listeners
  closeBtn.addEventListener('click', closeModal);
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Keyboard navigation + focus trap
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('show')) return;

    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();

    // Focus trap: cycle Tab within modal controls
    if (e.key === 'Tab') {
      const visibleFocusable = focusableElements.filter(el => el.style.display !== 'none');
      if (visibleFocusable.length === 0) return;

      const currentFocusIndex = visibleFocusable.indexOf(document.activeElement);

      if (e.shiftKey) {
        // Shift+Tab: go backwards
        e.preventDefault();
        const prevIndex = currentFocusIndex <= 0 ? visibleFocusable.length - 1 : currentFocusIndex - 1;
        visibleFocusable[prevIndex].focus();
      } else {
        // Tab: go forwards
        e.preventDefault();
        const nextIndex = currentFocusIndex >= visibleFocusable.length - 1 ? 0 : currentFocusIndex + 1;
        visibleFocusable[nextIndex].focus();
      }
    }
  });

  // Add inline transition styles to modal image
  modalImg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
});