# 🎸 Bocchi The Rock! — Fan Website

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)

Site interativo dedicado ao anime **Bocchi The Rock!**, desenvolvido como um projeto de portfólio que combina engenharia de software com design de interfaces.

Originalmente criado em 2023 como exercício de um curso de Front-End (Prof. Paulo Borges), o projeto foi completamente refatorado em 2026 para demonstrar proficiência em desenvolvimento web moderno.

---

## ✨ Funcionalidades

- 🎬 **Hero Editorial** — Título em tipografia condensada e colagem de fotos impressas com fita adesiva, legenda escrita à mão e adesivos em japonês
- 🎸 **Cards de Personagens** — Cada integrante com cor própria (Rosa, Azul, Amarelo, Vermelho), nome em japonês na vertical e bio revelada no hover/foco (sempre visível em telas de toque); no celular viram um carrossel com scroll-snap
- 🎟️ **Simulador de Ingressos** — Datas geradas a partir do dia atual, resumo da sessão em tempo real e estado de confirmação sem recarregar a página
- 📸 **Galeria Interativa** — Lightbox acessível (foco preso no modal, teclado, swipe no celular e contador)
- 💬 **Mural de Comentários** — Sistema client-side com proteção contra XSS, avaliação por estrelas, avatares coloridos e timestamps relativos
- ✉️ **Contato** — FAQ em acordeão + formulário com validação inline e contador de caracteres
- 🎵 **Mini Player** — Toca as músicas da Kessoku Band pela API do YouTube (vídeos oficiais), só no áudio ou com o vídeo aberto; play/pausa, faixa anterior/próxima, tempo, barra de progresso e volume sempre visíveis; continua a música ao trocar de página
- 🌗 **Tema Claro/Escuro** — Aplicado antes da primeira pintura (sem "flash"), com preferência salva
- ♿ **Acessibilidade** — Navegação por teclado, `focus-visible`, ARIA nos componentes interativos e respeito a `prefers-reduced-motion`
- 📱 **Responsivo** — Menu lateral no mobile, layouts que reorganizam em colunas e nenhum overflow horizontal

---

## 🎨 Design System

| Token | Valor | Uso |
|-------|-------|-----|
| `--kb-pink` | `#ff6fa8` | Hitori · cor de destaque principal |
| `--kb-blue` | `#6b9bff` | Ryo |
| `--kb-yellow` | `#ffd23f` | Nijika · título do hero |
| `--kb-red` | `#ff6257` | Kita |
| `--kessoku` | `#ffb400` | Amarelo oficial da banda (ingresso, adesivos) |
| `--bg` | `#0d0c10` | Background (tema escuro) |
| `--font-display` / `--font-body` | Archivo (eixo de largura) | Títulos condensados e texto |
| `--font-mono` | IBM Plex Mono | Rótulos, metadados, contadores |
| `--font-jp` | Yusei Magic | Nomes e etiquetas em japonês |

**Estética:** Inspirada em flyers de casa de show — paleta tirada das quatro integrantes, cores chapadas, layout assimétrico e detalhes em japonês. O tema claro usa um fundo cor de papel.

---

## 🛠️ Stack Tecnológica

| Tecnologia | Uso |
|-----------|-----|
| **HTML5** | Estrutura semântica com ARIA labels |
| **CSS3** | Flexbox, Grid, Custom Properties, clamp(), animações |
| **JavaScript (Vanilla)** | DOM manipulation, IntersectionObserver, Lightbox, XSS sanitization |
| **Google Material Symbols** | Iconografia |
| **Google Fonts** | Archivo + IBM Plex Mono + Yusei Magic |

> Nenhuma dependência de framework. Zero jQuery. 100% Vanilla.

---

## 📁 Estrutura do Projeto

```
Bocchi_Site/
├── index.html          # Home — Hero + Sinopse/Trailer + Cards + Chamada do filme
├── filme.html          # O Filme + simulador de ingressos
├── fotos.html          # Galeria de fotos (anime + shows)
├── comentarios.html    # Mural de comentários dos fãs
├── contato.html        # FAQ + formulário de contato
├── 404.html            # Página de erro
├── global.css          # Design system + componentes globais
├── styles.css          # Estilos específicos da home
├── filme.css           # Estilos do filme
├── fotos.css           # Estilos da galeria
├── comentarios.css     # Estilos dos comentários
├── contato.css         # Estilos do contato
├── script.js           # JS global (tema, menu, reveal, validação)
├── player.js           # Mini player (YouTube IFrame API)
├── filme.js            # JS do simulador de ingressos
├── fotos.js            # JS da galeria / lightbox
├── comentarios.js      # JS do sistema de comentários
├── contato.js          # JS do FAQ e do formulário de contato
├── service-worker.js   # Cache offline (PWA)
├── manifest.json       # Manifesto do PWA
└── assets/
    └── images/         # Logos, fotos do anime, shows
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