document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('comment-form');
  const list = document.getElementById('comment-list');
  const countEl = document.getElementById('commentCount');
  const emptyState = document.getElementById('emptyState');

  const STORAGE_KEY = 'bocchi_comments';
  const RATING_STORAGE_KEY = 'bocchi_rating';

  // ================================================
  // RATING WIDGET LOGIC
  // ================================================
  const stars = document.querySelectorAll('.star');
  const ratingFeedback = document.getElementById('rating-feedback');
  let currentRating = parseInt(localStorage.getItem(RATING_STORAGE_KEY)) || 0;

  const ratingTexts = [
    "Sua avaliação: Nenhuma",
    "Ruim! 😞",
    "Razoável 😐",
    "Bom! 🙂",
    "Muito Bom! 🤩",
    "Perfeito! 🎸✨"
  ];

  function updateStars(value) {
    stars.forEach(s => {
      const starVal = parseInt(s.dataset.value);
      if (starVal <= value) {
        s.classList.add('active');
        s.style.fontVariationSettings = "'FILL' 1";
      } else {
        s.classList.remove('active');
        s.style.fontVariationSettings = "'FILL' 0";
      }
    });
    ratingFeedback.textContent = ratingTexts[value];
  }

  // Init rating
  if (currentRating > 0) updateStars(currentRating);

  stars.forEach(star => {
    // Hover event
    star.addEventListener('mouseenter', function() {
      const hoverValue = parseInt(this.dataset.value);
      updateStars(hoverValue);
    });

    // Leaves widget -> restore selected
    star.parentElement.addEventListener('mouseleave', function() {
      updateStars(currentRating);
    });

    // Click -> save
    star.addEventListener('click', function() {
      currentRating = parseInt(this.dataset.value);
      updateStars(currentRating);
      localStorage.setItem(RATING_STORAGE_KEY, currentRating);
      
      // Little success animation
      ratingFeedback.style.color = 'var(--neon-pink)';
      setTimeout(() => ratingFeedback.style.color = 'var(--text-muted)', 1000);
    });
  });

  // ================================================
  // UTILITY FUNCTIONS
  // ================================================

  /**
   * Sanitize HTML to prevent XSS
   */
  function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Get time-ago string from ISO date string
   */
  function getTimeAgo(dateStr) {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'agora mesmo';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `há ${days} dia${days !== 1 ? 's' : ''}`;
    return `há ${Math.floor(days / 30)} mês(es)`;
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

  // ================================================
  // STORAGE
  // ================================================

  /**
   * Load comments from localStorage
   */
  function loadComments() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Save comments array to localStorage
   */
  function saveComments(comments) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch {
      // Storage full or unavailable — fail silently
    }
  }

  /**
   * Get all comments as data array (from storage or defaults)
   */
  function getCommentsData() {
    const stored = loadComments();
    if (stored && stored.length > 0) return stored;

    // Default seed comments (only used on first visit)
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
        comment: 'Ryou Yamada é a melhor personagem! O jeito descolado dela é demais.',
        date: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ];
  }

  // ================================================
  // UI RENDERING
  // ================================================

  /**
   * Update comment counter
   */
  function updateCount() {
    const count = list.children.length;
    if (countEl) {
      countEl.textContent = `${count} comentário${count !== 1 ? 's' : ''}`;
    }
    if (emptyState) {
      emptyState.classList.toggle('hidden', count > 0);
    }
  }

  /**
   * Create a comment card element
   */
  function createCommentCard(name, comment, dateStr) {
    const li = document.createElement('li');
    li.className = 'comment-card';

    const safeName = sanitize(name);
    const safeComment = sanitize(comment);
    const initials = getInitials(name);
    const timeAgo = getTimeAgo(dateStr);

    li.innerHTML = `
      <div class="comment-header">
        <div class="comment-author">
          <div class="comment-avatar">${initials}</div>
          <span class="comment-name">${safeName}</span>
        </div>
        <span class="comment-time">${timeAgo}</span>
      </div>
      <p class="comment-text">${safeComment}</p>
    `;

    return li;
  }

  /**
   * Render all comments from data array
   */
  function renderComments(comments) {
    list.innerHTML = '';
    comments.forEach(c => {
      const card = createCommentCard(c.name, c.comment, c.date);
      list.appendChild(card);
    });
    updateCount();
  }

  /**
   * Show success flash message
   */
  function showSuccess() {
    const existing = form.parentElement.querySelector('.form-success');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = 'form-success';
    msg.textContent = '✓ Comentário enviado com sucesso!';
    form.parentElement.insertBefore(msg, form);

    setTimeout(() => {
      msg.style.opacity = '0';
      msg.style.transform = 'scale(0.95)';
      msg.style.transition = 'all 0.3s ease';
      setTimeout(() => msg.remove(), 300);
    }, 2500);
  }

  // ================================================
  // INITIALIZATION
  // ================================================

  // Load and render stored (or default) comments
  let commentsData = getCommentsData();
  saveComments(commentsData); // Persist defaults on first visit
  renderComments(commentsData);

  // ================================================
  // FORM SUBMISSION
  // ================================================

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const commentInput = document.getElementById('comment');

    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();

    if (name && comment) {
      const newComment = {
        name,
        comment,
        date: new Date().toISOString()
      };

      // Add to data and persist
      commentsData.unshift(newComment);
      saveComments(commentsData);

      // Add to UI
      const card = createCommentCard(name, comment, newComment.date);
      list.insertBefore(card, list.firstChild);

      // Clear form
      nameInput.value = '';
      commentInput.value = '';
      document.activeElement.blur();

      updateCount();
      showSuccess();
    }
  });
});