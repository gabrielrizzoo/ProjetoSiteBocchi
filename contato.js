/**
 * Contato Page — Contact form handling with inline validation
 * Usa o FormFeedback definido em script.js
 */
document.addEventListener('DOMContentLoaded', () => {
  // ================================================
  // FAQ ACCORDION
  // ================================================
  const faqButtons = document.querySelectorAll('.faq-button');

  function setFaq(item, open) {
    const button = item.querySelector('.faq-button');
    const content = item.querySelector('.faq-content');
    item.classList.toggle('active', open);
    button.setAttribute('aria-expanded', String(open));
    content.style.maxHeight = open ? content.scrollHeight + 'px' : null;
  }

  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      // Fecha as outras perguntas
      document.querySelectorAll('.faq-item.active').forEach(activeItem => {
        if (activeItem !== item) setFaq(activeItem, false);
      });

      setFaq(item, !isOpen);
    });
  });

  // ================================================
  // CONTACT FORM
  // ================================================
  const form = document.getElementById('contact-form');
  if (!form) return;

  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('comentario');
  const counter = document.getElementById('message-count');
  const maxLength = messageInput.maxLength > 0 ? messageInput.maxLength : 1000;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) return 'Informe seu e-mail';
    if (!isValidEmail(val)) return 'Esse e-mail parece incompleto';
    return '';
  }

  function validateMessage() {
    const val = messageInput.value.trim();
    if (!val) return 'Escreva sua mensagem';
    if (val.length < 10) return 'A mensagem precisa de pelo menos 10 caracteres';
    return '';
  }

  function check(input, validator) {
    const error = validator();
    if (error) {
      FormFeedback.error(input, error);
    } else {
      FormFeedback.success(input);
    }
    return !error;
  }

  // Valida ao sair do campo (só se a pessoa já digitou algo)
  emailInput.addEventListener('blur', () => {
    if (emailInput.value.trim()) check(emailInput, validateEmail);
  });

  messageInput.addEventListener('blur', () => {
    if (messageInput.value.trim()) check(messageInput, validateMessage);
  });

  // Ao corrigir o campo, o erro some
  [emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('field-error')) FormFeedback.clear(input);
    });
  });

  // Contador de caracteres
  function updateCounter() {
    if (counter) counter.textContent = `${messageInput.value.length}/${maxLength}`;
  }

  messageInput.addEventListener('input', updateCounter);
  updateCounter();

  // ================================================
  // FORM SUBMIT (envio simulado)
  // ================================================
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailOk = check(emailInput, validateEmail);
    const messageOk = check(messageInput, validateMessage);

    if (!emailOk || !messageOk) {
      (emailOk ? messageInput : emailInput).focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined spin" aria-hidden="true">progress_activity</span> Enviando...';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      FormFeedback.clear(emailInput);
      FormFeedback.clear(messageInput);
      updateCounter();
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      FormFeedback.flash(form, 'Mensagem enviada! Obrigado por escrever.');
    }, 1200);
  });
});
