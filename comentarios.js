/**
 * Comentários Page — Mural de fãs com avaliação
 * Usa o FormFeedback definido em script.js
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('comment-form');
  const list = document.getElementById('comment-list');
  const countEl = document.getElementById('commentCount');
  const emptyState = document.getElementById('emptyState');

  if (!form || !list) return;

  const STORAGE_KEY = 'bocchi_comments';
  const RATING_STORAGE_KEY = 'bocchi_rating';

  // ================================================
  // RATING WIDGET LOGIC
  // ================================================
  const stars = document.querySelectorAll('.star');
  const starsContainer = document.querySelector('.stars-container');
  const ratingFeedback = document.getElementById('rating-feedback');

  const ratingTexts = [
    'Toque nas estrelas para avaliar',
    'Não curti',
    'Mais ou menos',
    'Bom',
    'Muito bom',
    'Obra-prima'
  ];

  let currentRating = 0;
  try {
    currentRating = parseInt(localStorage.getItem(RATING_STORAGE_KEY), 10) || 0;
  } catch {
    // Storage indisponível
  }

  function paintStars(value) {
    stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value, 10) <= value));
  }

  function showRating(value) {
    paintStars(value);
    ratingFeedback.textContent = value > 0 ? `${value}/5 · ${ratingTexts[value]}` : ratingTexts[0];
  }

  function saveRating(value) {
    currentRating = value;
    stars.forEach(s => s.setAttribute('aria-pressed', String(parseInt(s.dataset.value, 10) === value)));
    showRating(value);
    try {
      localStorage.setItem(RATING_STORAGE_KEY, value);
    } catch {
      // ignora
    }
  }

  stars.forEach(star => {
    const value = parseInt(star.dataset.value, 10);
    // Pré-visualização ao passar o mouse
    star.addEventListener('mouseenter', () => showRating(value));
    star.addEventListener('click', () => saveRating(value));
  });

  starsContainer.addEventListener('mouseleave', () => showRating(currentRating));

  if (currentRating > 0) saveRating(currentRating);

  // ================================================
  // UTILITY FUNCTIONS
  // ================================================

  /**
   * Get time-ago string from ISO date string
   */
  function getTimeAgo(dateStr) {
    const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (seconds < 60) return 'agora mesmo';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `há ${days} dia${days !== 1 ? 's' : ''}`;
    const months = Math.floor(days / 30);
    return `há ${months} ${months !== 1 ? 'meses' : 'mês'}`;
  }

  /**
   * Get initials from name
   */
  function getInitials(name) {
    return name.split(' ')
      .filter(w => w.length > 0)
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Cada nome ganha sempre a mesma cor de integrante no avatar
   */
  const AVATAR_COLORS = ['var(--kb-pink)', 'var(--kb-blue)', 'var(--kb-yellow)', 'var(--kb-red)'];

  function getAvatarColor(name) {
    let hash = 0;
    for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
  }

  // ================================================
  // STORAGE
  // ================================================
  function loadComments() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  function saveComments(comments) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch {
      // Storage cheio ou indisponível — falha silenciosa
    }
  }

  /**
   * Get all comments as data array (from storage or defaults)
   */
  function getCommentsData() {
    const stored = loadComments();
    if (stored && stored.length > 0) return stored;

    // Comentários iniciais (só na primeira visita)
    return [
      {
        name: 'Gabriel',
        comment: 'Esse anime é fantástico! As músicas da Kessoku Band são incríveis.',
        date: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        name: 'Maria Silva',
        comment: 'A evolução da Bocchi é muito boa. Me identifico muito com ela.',
        date: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        name: 'Lucas Tanaka',
        comment: 'Ryo Yamada é a melhor personagem! O jeito descolado dela é demais.',
        date: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ];
  }

  // ================================================
  // UI RENDERING
  // ================================================
  function updateCount() {
    const count = list.children.length;
    countEl.textContent = `${count} comentário${count !== 1 ? 's' : ''}`;
    emptyState.classList.toggle('hidden', count > 0);
  }

  /**
   * Monta o card com textContent (sem innerHTML) para evitar XSS
   */
  function createCommentCard({ name, comment, date }) {
    const li = document.createElement('li');
    li.className = 'comment-card';

    const avatar = document.createElement('div');
    avatar.className = 'comment-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.style.setProperty('--avatar', getAvatarColor(name));
    avatar.textContent = getInitials(name);

    const body = document.createElement('div');

    const header = document.createElement('div');
    header.className = 'comment-header';

    const nameEl = document.createElement('span');
    nameEl.className = 'comment-name';
    nameEl.textContent = name;

    const timeEl = document.createElement('time');
    timeEl.className = 'comment-time';
    timeEl.dateTime = date;
    timeEl.title = new Date(date).toLocaleString('pt-BR');
    timeEl.textContent = getTimeAgo(date);

    const text = document.createElement('p');
    text.className = 'comment-text';
    text.textContent = comment;

    header.append(nameEl, timeEl);
    body.append(header, text);
    li.append(avatar, body);
    return li;
  }

  function renderComments(comments) {
    list.replaceChildren(...comments.map(createCommentCard));
    updateCount();
  }

  // ================================================
  // INITIALIZATION
  // ================================================
  const commentsData = getCommentsData();
  saveComments(commentsData); // Persiste os iniciais na primeira visita
  renderComments(commentsData);

  // ================================================
  // FORM SUBMISSION WITH VALIDATION
  // ================================================
  const nameInput = document.getElementById('name');
  const commentInput = document.getElementById('comment');
  const counter = document.getElementById('comment-count');
  const maxLength = commentInput.maxLength > 0 ? commentInput.maxLength : 500;

  function validateName() {
    const val = nameInput.value.trim();
    if (!val) return 'Diga como quer ser chamado';
    if (val.length < 2) return 'O nome precisa de pelo menos 2 caracteres';
    return '';
  }

  function validateComment() {
    const val = commentInput.value.trim();
    if (!val) return 'Escreva seu comentário';
    if (val.length < 5) return 'O comentário precisa de pelo menos 5 caracteres';
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

  nameInput.addEventListener('blur', () => {
    if (nameInput.value.trim()) check(nameInput, validateName);
  });

  commentInput.addEventListener('blur', () => {
    if (commentInput.value.trim()) check(commentInput, validateComment);
  });

  [nameInput, commentInput].forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('field-error')) FormFeedback.clear(input);
    });
  });

  function updateCounter() {
    if (counter) counter.textContent = `${commentInput.value.length}/${maxLength}`;
  }

  commentInput.addEventListener('input', updateCounter);
  updateCounter();

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameOk = check(nameInput, validateName);
    const commentOk = check(commentInput, validateComment);

    if (!nameOk || !commentOk) {
      (nameOk ? commentInput : nameInput).focus();
      return;
    }

    const newComment = {
      name: nameInput.value.trim(),
      comment: commentInput.value.trim(),
      date: new Date().toISOString()
    };

    // Adiciona aos dados e persiste
    commentsData.unshift(newComment);
    saveComments(commentsData);

    // Adiciona na tela
    const card = createCommentCard(newComment);
    card.classList.add('is-new');
    list.prepend(card);

    // Limpa o formulário
    form.reset();
    FormFeedback.clear(nameInput);
    FormFeedback.clear(commentInput);
    updateCounter();
    updateCount();
    FormFeedback.flash(form, 'Comentário publicado!', 2500);
  });
});
