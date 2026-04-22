/**
 * Contato Page — Contact form handling with inline validation
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('comentario');

  // ================================================
  // INLINE VALIDATION HELPERS
  // ================================================
  function showFieldError(input, message) {
    clearFieldState(input);
    input.classList.add('field-error');
    const errorEl = document.createElement('span');
    errorEl.className = 'field-error-msg';
    errorEl.innerHTML = `<span class="material-symbols-outlined" style="font-size:14px">error</span> ${message}`;
    input.parentElement.appendChild(errorEl);
  }

  function showFieldSuccess(input) {
    clearFieldState(input);
    input.classList.add('field-success');
  }

  function clearFieldState(input) {
    input.classList.remove('field-error', 'field-success');
    const existing = input.parentElement.querySelector('.field-error-msg');
    if (existing) existing.remove();
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Real-time validation on blur
  emailInput.addEventListener('blur', () => {
    const val = emailInput.value.trim();
    if (!val) {
      showFieldError(emailInput, 'E-mail é obrigatório');
    } else if (!isValidEmail(val)) {
      showFieldError(emailInput, 'Formato de e-mail inválido');
    } else {
      showFieldSuccess(emailInput);
    }
  });

  messageInput.addEventListener('blur', () => {
    const val = messageInput.value.trim();
    if (!val) {
      showFieldError(messageInput, 'Mensagem é obrigatória');
    } else if (val.length < 10) {
      showFieldError(messageInput, 'Mensagem deve ter pelo menos 10 caracteres');
    } else {
      showFieldSuccess(messageInput);
    }
  });

  // Clear error on focus
  [emailInput, messageInput].forEach(input => {
    input.addEventListener('focus', () => clearFieldState(input));
  });

  // ================================================
  // SUCCESS MESSAGE
  // ================================================
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

  // ================================================
  // FORM SUBMIT
  // ================================================
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // Validate all fields
    let hasError = false;

    if (!email) {
      showFieldError(emailInput, 'E-mail é obrigatório');
      hasError = true;
    } else if (!isValidEmail(email)) {
      showFieldError(emailInput, 'Formato de e-mail inválido');
      hasError = true;
    }

    if (!message) {
      showFieldError(messageInput, 'Mensagem é obrigatória');
      hasError = true;
    } else if (message.length < 10) {
      showFieldError(messageInput, 'Mensagem deve ter pelo menos 10 caracteres');
      hasError = true;
    }

    if (hasError) return;

    // Simulate sending
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined">hourglass_top</span> Enviando...';
    btn.disabled = true;

    setTimeout(() => {
      emailInput.value = '';
      messageInput.value = '';
      clearFieldState(emailInput);
      clearFieldState(messageInput);
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      showSuccess();
    }, 1200);
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

      // Close all other accordions
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
