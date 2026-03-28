document.getElementById('comment-form').addEventListener('submit', function (event) {
            event.preventDefault(); // Impedir o envio padrão do formulário

            // Obter os valores do formulário
            var name = document.getElementById('name').value;
            var comment = document.getElementById('comment').value;

            // Criar um novo elemento de lista para o comentário
            if (name && comment) {
                var listItem = document.createElement('li');
                listItem.classList.add('comment-item');
                listItem.innerHTML = '<p class="comment-author"><strong>' + name + ':</strong></p><p class="comment-text">' + comment + '</p>';

                document.getElementById('comment-list').prepend(listItem); // Adicionar no início da lista

                document.getElementById('name').value = '';
                document.getElementById('comment').value = '';
            } else {
                alert('Por favor, preencha todos os campos!');
            }
        });