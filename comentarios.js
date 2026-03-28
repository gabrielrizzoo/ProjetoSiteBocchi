document.getElementById('comment-form').addEventListener('submit', function (event) {
    event.preventDefault();

    var nameInput = document.getElementById('name');
    var commentInput = document.getElementById('comment');

    var name = nameInput.value.trim();
    var comment = commentInput.value.trim();

    if (name && comment) {
        var listItem = document.createElement('li');
        listItem.className = 'comment-card';

        // Escape basic HTML to prevent injection
        name = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        comment = comment.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        listItem.innerHTML = `
            <h3>${name}</h3>
            <p>${comment}</p>
        `;

        var list = document.getElementById('comment-list');
        list.insertBefore(listItem, list.firstChild);

        // Clear and visually highlight form reset
        nameInput.value = '';
        commentInput.value = '';

        // Focus state reset
        document.activeElement.blur();
    }
});

// Optionally load some initial dummy comments
document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('comment-list');
    if (list && list.children.length === 0) {
        const dummyComments = [
            { name: 'Gabriel', comment: 'Esse anime é fantástico! As músicas da Kessoku Band são incríveis.' },
            { name: 'Maria', comment: 'A evolução da Bocchi é muito boa. Me identifico muito com ela.' }
        ];

        dummyComments.forEach(c => {
            const li = document.createElement('li');
            li.className = 'comment-card';
            li.innerHTML = `<h3>${c.name}</h3><p>${c.comment}</p>`;
            list.appendChild(li);
        });
    }
});