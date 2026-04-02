/**
 * Comentários Page — Comment form handling
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('comment-form');
  const list = document.getElementById('comment-list');
  const countEl = document.getElementById('commentCount');
  const emptyState = document.getElementById('emptyState');

  /**
   * Sanitize HTML to prevent XSS
   */
  function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Get time-ago string
   */
  function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'agora mesmo';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours}h`;
    return `há ${Math.floor(hours / 24)} dia(s)`;
  }

  /**
   * Get initials from name
   */
  function getInitials(name) {
    return name.split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

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
  function createCommentCard(name, comment, date) {
    const li = document.createElement('li');
    li.className = 'comment-card';

    const safeName = sanitize(name);
    const safeComment = sanitize(comment);
    const initials = getInitials(name);
    const timeAgo = getTimeAgo(date);

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
   * Show success flash message
   */
  function showSuccess() {
    // Remove any existing success message
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

  // Handle form submission
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const commentInput = document.getElementById('comment');

    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();

    if (name && comment) {
      const card = createCommentCard(name, comment, new Date());
      list.insertBefore(card, list.firstChild);

      // Clear form
      nameInput.value = '';
      commentInput.value = '';
      document.activeElement.blur();

      updateCount();
      showSuccess();
    }
  });

  // Load initial dummy comments
  const dummyComments = [
    {
      name: 'Gabriel',
      comment: 'Esse anime é fantástico! As músicas da Kessoku Band são incríveis.',
      date: new Date(Date.now() - 3600000 * 2) // 2h ago
    },
    {
      name: 'Maria Silva',
      comment: 'A evolução da Bocchi é muito boa. Me identifico muito com ela.',
      date: new Date(Date.now() - 3600000 * 24) // 1 day ago
    },
    {
      name: 'Lucas Tanaka',
      comment: 'Ryou Yamada é a melhor personagem! O jeito descolado dela é demais.',
      date: new Date(Date.now() - 3600000 * 48) // 2 days ago
    }
  ];

  dummyComments.forEach(c => {
    const card = createCommentCard(c.name, c.comment, c.date);
    list.appendChild(card);
  });

  updateCount();
});