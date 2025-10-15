document.addEventListener('DOMContentLoaded', function() {

    // ===============================================
    //   Bloco 1: LÓGICA PARA O MENU RETRÁTIL
    // ===============================================
    const menuToggleButton = document.getElementById('menu-toggle');
    const closeMenuButton = document.getElementById('close-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuToggleButton && menuOverlay && closeMenuButton) {
        menuToggleButton.addEventListener('click', () => {
            menuOverlay.classList.remove('hidden');
        });
        closeMenuButton.addEventListener('click', () => {
            menuOverlay.classList.add('hidden');
        });
        menuOverlay.addEventListener('click', (event) => {
            if (event.target === menuOverlay) {
                menuOverlay.classList.add('hidden');
            }
        });
    }

    // ===============================================
    //   Bloco 2: LÓGICA PARA O POP-UP DE COOKIES
    // ===============================================
    const cookiePopup = document.getElementById('cookie-popup');
    const acceptCookieButton = document.getElementById('accept-cookie');

    if (cookiePopup && acceptCookieButton) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookiePopup.classList.add('show');
            }, 2000);
        }
        acceptCookieButton.addEventListener('click', () => {
            cookiePopup.classList.remove('show');
            localStorage.setItem('cookieConsent', 'true');
        });
    }

    // ===============================================
    //   Bloco 3: LÓGICA PARA ANIMAÇÃO DE SCROLL (PÁGINA INICIAL)
    // ===============================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    // ===============================================
    //   Bloco 4: LÓGICA PARA O GERADOR DE CURRÍCULO
    // ===============================================
    if (document.querySelector('.curriculo-container')) {

        const formContainer = document.getElementById('form-container');
        const allInputs = document.querySelectorAll(".curriculo-container input, .curriculo-container textarea");
        const sortableContainer = document.getElementById('sortable-sections');
        
        const textareas = document.querySelectorAll('.curriculo-container textarea');
        textareas.forEach(textarea => {
            textarea.addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
        });

        if (sortableContainer) {
            new Sortable(sortableContainer, {
                animation: 150,
                handle: '.drag-handle',
                filter: '.static-section',
                onEnd: function (evt) {
                    atualizarPreview();
                }
            });
        }
        
        if (formContainer) {
            formContainer.addEventListener('click', function(event) {
                if (event.target.classList.contains('font-size-btn')) {
                    const action = event.target.dataset.action;
                    const targetBaseId = event.target.dataset.target;
                    const previewElement = document.getElementById(targetBaseId);
                    const previewElementVisivel = document.getElementById(`${targetBaseId}-visivel`);
                    const displayElement = document.querySelector(`[data-size-display-for="${targetBaseId}"]`);
                    if (previewElement && previewElementVisivel) {
                        let currentSize = parseFloat(window.getComputedStyle(previewElement, null).getPropertyValue('font-size'));
                        if (action === 'increase') {
                            currentSize += 1;
                        } else if (action === 'decrease' && currentSize > 8) {
                            currentSize -= 1;
                        }
                        const newSize = `${currentSize}px`;
                        previewElement.style.fontSize = newSize;
                        previewElementVisivel.style.fontSize = newSize;
                        if (displayElement) {
                            displayElement.innerText = Math.round(currentSize);
                        }
                    }
                }
            });
        }

        function initializeFontDisplays() {
            const displays = document.querySelectorAll('.font-size-display');
            displays.forEach(display => {
                const targetId = display.dataset.sizeDisplayFor;
                const previewElement = document.getElementById(targetId);
                if (previewElement) {
                    const currentSize = Math.round(parseFloat(window.getComputedStyle(previewElement, null).getPropertyValue('font-size')));
                    display.innerText = currentSize;
                }
            });
        }
        
        allInputs.forEach(input => input.addEventListener("input", atualizarPreview));
        document.getElementById("foto").addEventListener("change", atualizarFoto);
        document.getElementById('baixar-pdf-btn').addEventListener('click', gerarPDF);

        function atualizarFoto() {
            const file = document.getElementById("foto").files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById("previewFoto").src = e.target.result;
                    document.getElementById("previewFoto-visivel").src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
        function calcularIdade(dia, mes, ano) {
            const hoje = new Date();
            const nascimento = new Date(ano, mes - 1, dia);
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const m = hoje.getMonth() - nascimento.getMonth();
            if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) { idade--; }
            return idade;
        }
        function formatarTelefone(ddd, numero) {
            numero = (numero || '').replace(/\D/g, "");
            ddd = (ddd || '').toString().replace(/\D/g, "");
            if (!ddd && !numero) return "";
            if (!ddd) return numero;
            if (!numero) return ddd;
            if (numero.length === 9) { return `(${ddd}) ${numero.substring(0, 5)}-${numero.substring(5)}`; }
            else if (numero.length === 8) { return `(${ddd}) ${numero.substring(0, 4)}-${numero.substring(4)}`; }
            else { return `(${ddd}) ${numero}`; }
        }
        function capitalizeFirstLetter(string) {
            if (!string) return '';
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function atualizarPreview() {
            desfazerPaginacao();
            const nome = document.getElementById("nome").value || "Seu Nome Aqui";
            document.getElementById("previewNome").innerText = nome;
            document.getElementById("previewNome-visivel").innerText = nome;
            let dadosHtml = "";
            const dia = document.getElementById("dia").value, mes = document.getElementById("mes").value, ano = document.getElementById("ano").value;
            if (dia && mes && ano) { const idade = calcularIdade(dia, mes, ano); if (!Number.isNaN(idade)) { dadosHtml += `<p><strong>Idade:</strong> ${idade} anos</p>`; } }
            const nacionalidade = document.getElementById("nacionalidade").value;
            if (nacionalidade) { dadosHtml += `<p><strong>Nacionalidade:</strong> ${nacionalidade}</p>`; }
            const endereco = document.getElementById("endereco").value;
            if (endereco) { dadosHtml += `<p><strong>Endereço:</strong> ${endereco}</p>`; }
            const ddd = document.getElementById("ddd").value, tel = document.getElementById("telefone").value;
            const telFmt = formatarTelefone(ddd, tel);
            if (telFmt) { dadosHtml += `<p><strong>Telefone:</strong> ${telFmt}</p>`; }
            const email = document.getElementById("email").value;
            if (email) { dadosHtml += `<p><strong>Email:</strong> ${email}</p>`; }
            document.getElementById("previewDados").innerHTML = dadosHtml;
            document.getElementById("previewDados-visivel").innerHTML = dadosHtml;
            if (sortableContainer) {
                const previewContainer = document.getElementById('preview');
                const previewContainerVisivel = document.getElementById('preview-visivel');
                const formSectionsOrdered = sortableContainer.querySelectorAll('.form-section[data-section-id]');
                formSectionsOrdered.forEach(formSection => {
                    const sectionId = formSection.dataset.sectionId;
                    const capSectionId = capitalizeFirstLetter(sectionId);
                    const previewSectionToMove = document.getElementById(`secao${capSectionId}`);
                    const previewSectionToMoveVisivel = document.getElementById(`secao${capSectionId}-visivel`);
                    if(previewSectionToMove) previewContainer.appendChild(previewSectionToMove);
                    if(previewSectionToMoveVisivel) previewContainerVisivel.appendChild(previewSectionToMoveVisivel);
                });
            }
            const allDraggableSections = document.querySelectorAll('.form-section[data-section-id]');
            allDraggableSections.forEach(section => {
                const sectionId = section.dataset.sectionId;
                const capSectionId = capitalizeFirstLetter(sectionId);
                const inputElement = document.getElementById(sectionId);
                const previewElement = document.getElementById(`preview${capSectionId}`);
                const sectionPreviewContainer = document.getElementById(`secao${capSectionId}`);
                const previewElementVisivel = document.getElementById(`preview${capSectionId}-visivel`);
                const sectionPreviewContainerVisivel = document.getElementById(`secao${capSectionId}-visivel`);
                if (inputElement && previewElement && sectionPreviewContainer && previewElementVisivel && sectionPreviewContainerVisivel) {
                    const valor = inputElement.value;
                    const displayValue = valor.trim() === "" ? "none" : "block";
                    sectionPreviewContainer.style.display = displayValue;
                    sectionPreviewContainerVisivel.style.display = displayValue;
                    if(displayValue === "block"){
                        previewElement.innerText = valor;
                        previewElementVisivel.innerText = valor;
                    }
                }
            });
            setTimeout(simularPaginacao, 0);
        }

        function desfazerPaginacao() {
            const previewContainer = document.getElementById('preview-visivel');
            const pages = previewContainer.querySelectorAll('.preview-page');
            if (pages.length === 0) return;
            const allSections = previewContainer.querySelectorAll('.preview-page .header, .preview-page .section');
            allSections.forEach(section => {
                previewContainer.appendChild(section);
            });
            pages.forEach(page => {
                page.remove();
            });
        }
                
        function simularPaginacao() {
            const MAX_PAGE_HEIGHT_PX = 1050;
            const previewContainer = document.getElementById('preview-visivel');
            const zoomFactor = parseFloat(window.getComputedStyle(previewContainer).zoom) || 1;
            const sections = Array.from(previewContainer.querySelectorAll('.header, .section'));
            previewContainer.innerHTML = '';
            let currentPage = document.createElement('div');
            currentPage.className = 'preview-page';
            previewContainer.appendChild(currentPage);
            let currentPageHeight = 0;
            sections.forEach(section => {
                currentPage.appendChild(section);
                if (section.style.display !== 'none') {
                    const style = window.getComputedStyle(section);
                    const marginTop = parseInt(style.marginTop) || 0;
                    const marginBottom = parseInt(style.marginBottom) || 0;
                    const measuredHeight = section.offsetHeight + marginTop + marginBottom;
                    const realHeight = measuredHeight / zoomFactor;
                    if (currentPageHeight + realHeight > MAX_PAGE_HEIGHT_PX && currentPage.children.length > 1) {
                        currentPage = document.createElement('div');
                        currentPage.className = 'preview-page';
                        previewContainer.appendChild(currentPage);
                        currentPage.appendChild(section);
                        currentPageHeight = realHeight;
                    } else {
                        currentPageHeight += realHeight;
                    }
                }
            });
        }
                
        async function gerarPDF() {
            const button = document.getElementById('baixar-pdf-btn');
            button.disabled = true;
            button.innerText = 'Gerando PDF...';
            try {
                const preview = document.getElementById('preview'); 
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const marginTop = 15;
                const marginBottom = 10;
                const marginHorizontal = 15;
                const pageWidth = pdf.internal.pageSize.getWidth();
                const usableWidth = pageWidth - (marginHorizontal * 2);
                const pageHeight = pdf.internal.pageSize.getHeight();
                const sections = preview.querySelectorAll('.header, .section');
                let currentY = marginTop;
                for (let i = 0; i < sections.length; i++) {
                    const section = sections[i];
                    if (section.style.display === 'none') { continue; }
                    const canvas = await html2canvas(section, { scale: 2, useCORS: true, scrollY: -window.scrollY });
                    const imgHeight = canvas.height * usableWidth / canvas.width;
                    if (currentY + imgHeight > pageHeight - marginBottom && i > 0) {
                        pdf.addPage();
                        currentY = marginTop;
                    }
                    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', marginHorizontal, currentY, usableWidth, imgHeight);
                    currentY += imgHeight + 5;
                }
                pdf.save('curriculo.pdf');
            } catch (error) {
                console.error("ERRO DURANTE A GERAÇÃO DO PDF:", error);
            } finally {
                button.disabled = false;
                button.innerText = 'Baixar Currículo';
            }
        }
        
        initializeFontDisplays();
        atualizarPreview();
    }

    // ===============================================
    //   Bloco 5: LÓGICA PARA ANIMAÇÃO DOS GIFs SOCIAIS
    // ===============================================
    const socialGifs = document.querySelectorAll('.social-gif');
    const gifAnimationDuration = 1500; 
    socialGifs.forEach(gif => {
        gif.dataset.staticSrc = gif.src;
    });

    const playAnimationOnce = (element) => {
        const staticSrc = element.dataset.staticSrc;
        const animatedSrc = element.dataset.animatedSrc;
        if (!animatedSrc || !staticSrc) return;
        element.src = animatedSrc;
        setTimeout(() => {
            element.src = staticSrc;
        }, gifAnimationDuration);
    };

    socialGifs.forEach(gif => {
        gif.addEventListener('mouseenter', () => {
            playAnimationOnce(gif);
        });
    });

    const gifObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const gifElement = entry.target;
                playAnimationOnce(gifElement);
                gifObserver.unobserve(gifElement);
            }
        });
    }, {
        threshold: 0.5
    });
    socialGifs.forEach(gif => {
        gifObserver.observe(gif);
    });

    // ===============================================
    //   Bloco 6: LÓGICA DO PLAYER DE VÍDEO INTERATIVO
    // ===============================================
    if (document.querySelector('.video-layout-container')) {
        const mainPlayer = document.getElementById('main-video-player');
        const playlistItems = document.querySelectorAll('.custom-playlist-item');
        playlistItems.forEach(item => {
            item.addEventListener('click', function(event) {
                event.preventDefault();
                const videoId = this.dataset.videoId;
                if (!videoId) return;
                const newSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                mainPlayer.src = newSrc;
                playlistItems.forEach(el => el.classList.remove('active-video'));
                this.classList.add('active-video');
            });
        });
    }

    // ===============================================
    //   Bloco 7: AJUSTE DE ALTURA DA PLAYLIST
    // ===============================================
    function ajustarAlturaPlaylist() {
        const videoElement = document.querySelector('.page-guia .video-player-column iframe');
        const playlistColumn = document.querySelector('.page-guia .playlist-column');
        if (videoElement && playlistColumn) {
            if (window.innerWidth > 768) {
                const alturaVideo = videoElement.offsetHeight;
                if (alturaVideo > 0) {
                    playlistColumn.style.height = `${alturaVideo}px`;
                }
            } else {
                playlistColumn.style.height = '';
            }
        }
    }
    ajustarAlturaPlaylist();
    window.addEventListener('resize', ajustarAlturaPlaylist);

    // ===============================================
    //   Bloco 8: ANIMAÇÃO PROGRESSIVA DOS TÓPICOS (MOBILE)
    // ===============================================
    if (window.innerWidth <= 768) {
        const topicSquares = document.querySelectorAll('.guia-square-item');
        if (topicSquares.length === 0) return;

        function handleScrollAnimation() {
            const viewportHeight = window.innerHeight;
            topicSquares.forEach(square => {
                const rect = square.getBoundingClientRect();
                const elementCenterY = rect.top + (rect.height / 2);
                const positionOnRuler = 1 - (elementCenterY / viewportHeight);
                let scale = 1.0;
                const maxScale = 1.1;
                if (positionOnRuler > 0.2 && positionOnRuler < 0.8) {
                    if (positionOnRuler < 0.4) {
                        const progress = (positionOnRuler - 0.2) / (0.4 - 0.2);
                        scale = 1.0 + (maxScale - 1.0) * progress;
                    } else if (positionOnRuler >= 0.4 && positionOnRuler <= 0.6) {
                        scale = maxScale;
                    } else {
                        const progress = (positionOnRuler - 0.6) / (0.8 - 0.6);
                        scale = maxScale - (maxScale - 1.0) * progress;
                    }
                }
                scale = Math.max(1.0, Math.min(scale, maxScale));
                square.style.transform = `scale(${scale})`;
            });
        }

        let isTicking = false;
        window.addEventListener('scroll', function() {
            if (!isTicking) {
                window.requestAnimationFrame(function() {
                    handleScrollAnimation();
                    isTicking = false;
                });
                isTicking = true;
            }
        });
        handleScrollAnimation();
    }

    // =================================================================
    //   Bloco 9: ANIMAÇÃO DE FUNDO (VERSÃO FINAL E AJUSTADA)
    // =================================================================
    const container = document.querySelector('.formas-fundo');
    if (container) {

        // Adiciona o fade-in de 2s após 4s de espera
        setTimeout(() => {
            container.style.opacity = '1';
        }, 4000);
        
        const NUMERO_DE_FORMAS = window.innerWidth <= 768 ? 60 : 120;
        const DURACAO_MOVIMENTO = 10000;
        const DURACAO_FADE = 1000;

       // A VERSÃO FINAL E CORRIGIDA com duplo requestAnimationFrame
        function animarForma(forma) {
            // ETAPA 1: Define o estado inicial da forma
            const posTop = Math.random() * 90;
            const posLeft = Math.random() * 90;
            forma.style.top = posTop + '%';
            forma.style.left = posLeft + '%';
            forma.style.transform = 'scale(0.5)';
            forma.style.opacity = '0';

            // ETAPA 2: Pede ao navegador para, no próximo frame, se preparar para animar.
            requestAnimationFrame(() => {
                // ETAPA 3: Pede novamente para, no frame SEGUINTE, executar a animação.
                // Isso garante 100% que o estado da ETAPA 1 foi renderizado primeiro.
                requestAnimationFrame(() => {
                    // ETAPA 4: Inicia a animação de "aparecer".
                    forma.style.transform = 'scale(1)';
                    forma.style.opacity = '0.4';

                    // O resto da lógica de tempo continua normalmente.
                    setTimeout(() => {
                        const movimentoX = (Math.random() - 0.5) * 150;
                        const movimentoY = (Math.random() - 0.5) * 150;
                        forma.style.transform = `scale(1.2) translate(${movimentoX}px, ${movimentoY}px)`;
                    }, DURACAO_FADE);

                    setTimeout(() => {
                         // Pequena correção para manter a posição final ao sumir
                         const currentTransform = window.getComputedStyle(forma).transform;
                         const matrix = new DOMMatrix(currentTransform);
                         forma.style.transform = `translate(${matrix.e}px, ${matrix.f}px) scale(0.5)`;
                         forma.style.opacity = '0';
                    }, DURACAO_FADE + DURACAO_MOVIMENTO);

                    setTimeout(() => {
                        animarForma(forma); // Loop para recomeçar
                    }, DURACAO_FADE + DURACAO_MOVIMENTO + DURACAO_FADE);
                });
            });
        }

        // O loop que cria e inicia a animação para cada forma
        for (let i = 0; i < NUMERO_DE_FORMAS; i++) {
            const forma = document.createElement('div');
            forma.classList.add('forma-animada');

            const tamanho = Math.random() * 100 + 20;
            forma.style.width = `${tamanho}px`;
            forma.style.height = `${tamanho}px`;
            const cores = ['rgba(241, 196, 15, 0.4)', 'rgba(230, 126, 34, 0.4)', 'rgba(243, 156, 18, 0.4)'];
            forma.style.backgroundColor = cores[i % cores.length];

            container.appendChild(forma);
            
            // O atraso interno continua funcionando, garantindo o aparecimento gradual
            setTimeout(() => {
                animarForma(forma);
            }, i * 200);
        }
    }
});
