# 🎸 Bocchi The Rock! | Front-End Refactor

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)

Este projeto é uma **revisão completa e profissional** de uma *landing page* desenvolvida originalmente em 2023, como o 1º Projeto Prático de um curso de Front-End (Paulo Borges). 

Recentemente, em 2026, decidi retomar este código para aplicar minha bagagem da reta final de Ciência da Computação na UVA, unindo a engenharia de software estruturada com a minha futura transição para o Design Gráfico. O objetivo foi transformar um exercício inicial em uma aplicação interativa de alto nível para o meu portfólio.

---

## 🔄 O Grande Retrabalho (Refactor Log)

Diferente da versão estática original, esta aplicação foi reconstruída para demonstrar proficiência em manipulação de DOM, arquitetura de pastas e design de interfaces. As principais melhorias foram:

### 🎨 Engenharia de Estilos & UI/UX
* **Dark Theme Premium:** Implementação de uma paleta de cores consistente focada no contraste entre fundos escuros (`#1a1a1a` e `#0d0d0d`) e detalhes em amarelo vibrante (`#FFD700`).
* **Micro-interações:** Adição de animações de transição suaves, efeitos de elevação (`transform: translateY`) e sombras dinâmicas (`box-shadow`) nos cards e botões.
* **Acessibilidade (A11y) e Semântica:** Reestruturação total do HTML utilizando marcos semânticos (`<main>`, `<section>`) e atributos ARIA (`aria-label`, `role`, `aria-hidden`) para suporte robusto a leitores de tela.
* **Responsividade Completa:** Layout adaptável garantido por *Media Queries*, ajustando perfeitamente a grade de atores, vídeos e carrosséis para dispositivos móveis.

### 🛠️ Otimização de Código e Arquitetura
* **Sistema de Módulos Visual:** Refatoração da árvore de diretórios, separando páginas (`/home`, `/contato`, `/fotos`, `/comentarios`) e centralizando mídias no diretório `/assets`.
* **Lightbox / Modal Nativo:** Criação de um sistema de galeria em tela cheia construído 100% em Vanilla JavaScript, com suporte a navegação por setas, fechamento dinâmico e bloqueio de scroll do body.
* **Manipulação de DOM:** O sistema de comentários foi reescrito para injetar novos elementos diretamente no topo da lista (`prepend`) via *Client-Side rendering*, com validação de campos vazios.

---

## ✨ Funcionalidades Atuais

* 📸 **Galeria Dinâmica:** Carrosséis automatizados integrados com Slick Carousel e navegação customizada com Font Awesome.
* 🔍 **Experiência Imersiva:** Modal de imagens interativo para expandir as fotos do anime e dos shows.
* 💬 **Feedback em Tempo Real:** Seção de comentários com validação e inserção instantânea na interface.
* 🎥 **Integração Multimídia:** Trailer oficial do anime encapsulado em um player responsivo e customizado.

---

## 🛠️ Stack Tecnológica

As seguintes ferramentas foram fundamentais nesta nova etapa do projeto:

* **HTML5:** Estruturação semântica e A11y.
* **CSS3:** Flexbox, CSS Grid, Box-sizing global e animações avançadas.
* **JavaScript (Vanilla):** Lógica de Modais (Lightbox), interceptação de eventos (`preventDefault`) e injeção de DOM.
* **Slick Carousel:** Biblioteca jQuery para criação dos sliders de imagem.
* **Font Awesome:** Iconografia vetorial para os controles de interface.

---

## 👨‍💻 Autoria e Créditos

Este projeto possui duas fases de autoria:

1. **Versão Original (2023):** Desenvolvida como projeto de curso de Front-End (Prof. Paulo Borges) para fixação de fundamentos.
2. **Versão Refatorada (2026):** Reformulação total de design, arquitetura de pastas e interatividade via JavaScript realizada exclusivamente por **Gabriel Rizzo**.