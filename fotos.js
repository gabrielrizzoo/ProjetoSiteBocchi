    document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.close-button');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');

    let currentGridItems = [];
    let currentIndex = 0;

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

        modalImg.src = img.src;
        captionText.textContent = img.alt || '';

        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent scrolling

        updateNavigationButtons();
    }

    function closeModal() {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
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

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('show')) return;

        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
});