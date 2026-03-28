    $(document).ready(function(){
        var $animeSlider = $('.anime-slider');
        var $showsSlider = $('.shows-slider');
        var $sliders = $('.slider'); // Seleciona todos os sliders para inicialização

        var modal = document.getElementById("imageModal");
        var modalImg = document.getElementById("modalImage");
        var captionText = document.getElementById("caption");
        var closeButton = document.getElementsByClassName("close-button")[0];
        var modalPrevButton = document.querySelector('.modal-prev');
        var modalNextButton = document.querySelector('.modal-next');
        var currentSlider = null; // Para saber qual slider está ativo no modal
        var currentSlideIndex = -1; // Para rastrear o índice da imagem atual
        var slides = []; // Array para armazenar as URLs das imagens do slider ativo

        // Função para atualizar o array 'slides' e o 'currentSlideIndex'
        // O 'init' é chamado quando o Slick é inicializado
        // O 'reinit' é chamado se o Slick é reinicializado
        // O 'afterChange' é chamado após cada transição de slide
        $sliders.on('init reinit afterChange', function (event, slick, currentSlide) {
            // Certifica-se de que o slider está inicializado para evitar erros
            if (slick.$slider.hasClass('slick-initialized')) {
                slides = slick.$slides.map(function() {
                    return $(this).find('img').attr('src');
                }).get();
            }
        });

        // Função para abrir o modal
        function openModal(index, slider) {
            modal.style.display = "flex"; // Usa flexbox para centralizar
            // O caminho para a imagem precisa ser pego da array `slides` com base no `index`
            modalImg.src = slides[index];
            $('body').addClass('modal-open'); // Adiciona classe para desabilitar scroll
            modal.setAttribute('aria-hidden', 'false'); // Acessibilidade: modal visível
            currentSlider = slider;
            currentSlideIndex = index;

            // Esconde as setas se houver apenas uma imagem
            if (slides.length <= 1) {
                $(modalPrevButton).hide();
                $(modalNextButton).hide();
            } else {
                $(modalPrevButton).show();
                $(modalNextButton).show();
            }
        }

        // Event listener para abrir o modal quando uma imagem do slider de anime é clicada
        $animeSlider.on('click', '.slick-slide', function(e) {
            // Verifica se o clique não foi nas setas do próprio slick-carousel
            if (!e.target.classList.contains('slick-arrow') && $(this).find('img').length) {
                var index = $(this).data('slick-index');
                // Certifica-se de que slides foi populado corretamente antes de abrir
                var slickInstance = $animeSlider.slick('getSlick');
                slides = slickInstance.$slides.map(function() { return $(this).find('img').attr('src'); }).get();
                openModal(index, slickInstance);
            }
        });

        // Event listener para abrir o modal quando uma imagem do slider de shows é clicada
        $showsSlider.on('click', '.slick-slide', function(e) {
            // Verifica se o clique não foi nas setas do próprio slick-carousel
            if (!e.target.classList.contains('slick-arrow') && $(this).find('img').length) {
                var index = $(this).data('slick-index');
                // Certifica-se de que slides foi populado corretamente antes de abrir
                var slickInstance = $showsSlider.slick('getSlick');
                slides = slickInstance.$slides.map(function() { return $(this).find('img').attr('src'); }).get();
                openModal(index, slickInstance);
            }
        });

        // Navegação para a imagem anterior no modal
        $(modalPrevButton).on('click', function() {
            if (currentSlider && slides.length > 1) {
                currentSlideIndex = (currentSlideIndex > 0) ? currentSlideIndex - 1 : slides.length - 1;
                modalImg.src = slides[currentSlideIndex];
            }
        });

        // Navegação para a próxima imagem no modal
        $(modalNextButton).on('click', function() {
            if (currentSlider && slides.length > 1) {
                currentSlideIndex = (currentSlideIndex < slides.length - 1) ? currentSlideIndex + 1 : 0;
                modalImg.src = slides[currentSlideIndex];
            }
        });

        // Quando o usuário clica no 'x' (close-button), fecha o modal
        closeButton.onclick = function() {
            modal.style.display = "none";
            $('body').removeClass('modal-open'); // Remove classe para reabilitar scroll do body
            modal.setAttribute('aria-hidden', 'true'); // Acessibilidade: modal escondido
            currentSlider = null;
            currentSlideIndex = -1;
            slides = []; // Limpa o array de slides ao fechar
        }

        // Quando o usuário clica fora da imagem do modal, fecha o modal
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                $('body').removeClass('modal-open');
                modal.setAttribute('aria-hidden', 'true');
                currentSlider = null;
                currentSlideIndex = -1;
                slides = [];
            }
        }

        // Inicialização dos sliders (mantenha como estava, mas com as melhorias de acessibilidade e os autoplay/arrows que você adicionou)
        // Certifique-se que você tenha o '.anime-slider' e '.shows-slider' definidos para os seus carrosséis
        // Se você tiver apenas um carrossel, pode simplificar removendo um deles
        $animeSlider.slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            arrows: true,
            dots: false,
            centerMode: true,
            centerPadding: '0px',
            prevArrow: '<button type="button" class="slick-prev" aria-label="Anterior"><i class="fas fa-chevron-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next" aria-label="Próximo"><i class="fas fa-chevron-right"></i></button>',
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });

        $showsSlider.slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            arrows: true,
            dots: false,
            centerMode: true,
            centerPadding: '0px',
            prevArrow: '<button type="button" class="slick-prev" aria-label="Anterior"><i class="fas fa-chevron-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next" aria-label="Próximo"><i class="fas fa-chevron-right"></i></button>',
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    });