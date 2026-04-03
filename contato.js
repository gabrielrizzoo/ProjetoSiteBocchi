/**
 * Contato Page — Contact form handling
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  /**
   * Show success flash message
   */
  function showSuccess() {
    const existing = form.parentElement.querySelector('.form-success');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = 'form-success';
    msg.innerHTML = `
      <span class="material-symbols-outlined">check_circle</span>
      Mensagem enviada com sucesso! Entraremos em contato em breve.
    `;
    form.parentElement.insertBefore(msg, form);

    setTimeout(() => {
      msg.style.opacity = '0';
      msg.style.transform = 'scale(0.95)';
      msg.style.transition = 'all 0.3s ease';
      setTimeout(() => msg.remove(), 300);
    }, 3500);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('comentario');

    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (email && message) {
      // Simulate sending (in production, replace with a real API call)
      const btn = form.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined">hourglass_top</span> Enviando...';
      btn.disabled = true;

      setTimeout(() => {
        emailInput.value = '';
        messageInput.value = '';
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        showSuccess();
      }, 1200);
    }
  });

  // ================================================
  // FAQ ACCORDION
  // ================================================
  const faqButtons = document.querySelectorAll('.faq-button');

  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      const content = item.querySelector('.faq-content');
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      // Close all other accordions (optional, but good for UX)
      document.querySelectorAll('.faq-item.active').forEach(activeItem => {
        if (activeItem !== item) {
          activeItem.classList.remove('active');
          activeItem.querySelector('.faq-button').setAttribute('aria-expanded', 'false');
          activeItem.querySelector('.faq-content').style.maxHeight = null;
        }
      });

      // Toggle current
      if (isExpanded) {
        item.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
});

