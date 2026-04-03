# 🎸 Bocchi The Rock! — Fan Website

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)

Site interativo dedicado ao anime **Bocchi The Rock!**, desenvolvido como um projeto de portfólio que combina engenharia de software com design de interfaces.

Originalmente criado em 2023 como exercício de um curso de Front-End (Prof. Paulo Borges), o projeto foi completamente refatorado em 2026 para demonstrar proficiência em desenvolvimento web moderno.

---

## ✨ Funcionalidades

- 🎬 **Hero Section Dinâmico** — Banner imersivo com informações do anime, notas musicais flutuantes e CTA interativo
- 🎸 **Cards de Personagens** — Cada integrante da Kessoku Band com cor temática individual (Rosa, Azul, Amarelo, Vermelho)
- 📸 **Galeria Interativa** — Grid responsivo com lightbox nativo em Vanilla JS (navegação por setas, teclado e counter)
- 💬 **Mural de Comentários** — Sistema client-side com sanitização XSS, avatares e timestamps relativos
- ✉️ **Formulário de Contato** — Com feedback visual simulado (loading state + mensagem de sucesso)
- 🎵 **Elementos Temáticos** — Separadores de cordas de guitarra, equalizer animado no footer, notas musicais decorativas
- 📱 **Mobile-First** — Menu hamburger com overlay, layout responsivo completo

---

## 🎨 Design System

| Token | Valor | Uso |
|-------|-------|-----|
| `--neon-pink` | `#ff4b98` | Cor principal / acentos |
| `--neon-purple` | `#a855f7` | Gradientes / hover |
| `--neon-blue` | `#4bd5ff` | Acentos secundários |
| `--bg-color` | `#0a0a10` | Background principal |
| `--font-display` | Outfit | Títulos |
| `--font-body` | Inter | Corpo do texto |

**Estética:** Dark mode premium com glassmorphism, micro-animações e identidade visual inspirada no universo musical do anime.

---

## 🛠️ Stack Tecnológica

| Tecnologia | Uso |
|-----------|-----|
| **HTML5** | Estrutura semântica com ARIA labels |
| **CSS3** | Flexbox, Grid, Custom Properties, clamp(), animações |
| **JavaScript (Vanilla)** | DOM manipulation, IntersectionObserver, Lightbox, XSS sanitization |
| **Google Material Symbols** | Iconografia |
| **Google Fonts** | Outfit + Inter |

> Nenhuma dependência de framework. Zero jQuery. 100% Vanilla.

---

## 📁 Estrutura do Projeto

```
Bocchi_Site/
├── index.html          # Home — Hero + Trailer + Cards
├── contato.html        # Formulário de contato
├── fotos.html          # Galeria de fotos (anime + shows)
├── comentarios.html    # Mural de comentários dos fãs
├── global.css          # Design system + componentes globais
├── styles.css          # Estilos específicos da home
├── contato.css         # Estilos do contato
├── fotos.css           # Estilos da galeria
├── comentarios.css     # Estilos dos comentários
├── script.js           # JS global (menu, scroll, reveal)
├── contato.js          # JS do formulário de contato
├── fotos.js            # JS da galeria / lightbox
├── comentarios.js      # JS do sistema de comentários
└── assets/
    ├── images/         # Logos, fotos do anime, shows
    └── videos/         # Trailer oficial
```

---

## 🚀 Como Rodar

1. Clone o repositório:
   ```bash
   git clone https://github.com/gabrielrizzoo/ProjetoSiteBocchi.git
   ```

2. Abra `index.html` no navegador, ou inicie um servidor local:
   ```bash
   npx serve .
   ```

---

## 👨‍💻 Autoria

| Fase | Descrição |
|------|-----------|
| **v1.0 (2023)** | Projeto de curso de Front-End — fundamentos HTML/CSS |
| **v2.0 (2026)** | Refatoração completa de design, arquitetura e interatividade por **Gabriel Rizzo** |

---

## 📜 Licença

Este é um projeto de fã sem fins lucrativos. Todas as imagens e marcas de **Bocchi The Rock!** pertencem a seus respectivos detentores de direitos (Aniplex, CloverWorks, Aki Hamaji).