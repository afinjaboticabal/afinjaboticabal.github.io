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

        const telefonesContainer = document.getElementById('telefones-container');
if (telefonesContainer) {
    telefonesContainer.addEventListener('click', function(event) {
        // Lógica para ADICIONAR um campo de telefone
        if (event.target.classList.contains('add-telefone-btn')) {
            const newRow = document.createElement('div');
            newRow.className = 'telefone-row';
            newRow.style.display = 'flex';
            newRow.style.gap = '10px';
            newRow.style.alignItems = 'center';
            newRow.style.marginBottom = '10px';

            newRow.innerHTML = `
                <input type="number" class="ddd-input" placeholder="DDD" min="10" max="99" style="width: 80px;" />
                <input type="text" class="telefone-input" placeholder="Número" style="flex: 1;" />
                <button type="button" class="remove-telefone-btn">-</button>
            `;

            // Adiciona o novo campo ao container
            telefonesContainer.appendChild(newRow);
            
            // Adiciona o listener de input para os novos campos atualizarem o preview
            newRow.querySelectorAll('input').forEach(input => input.addEventListener('input', atualizarPreview));
        }

        // Lógica para REMOVER um campo de telefone
        if (event.target.classList.contains('remove-telefone-btn')) {
            const rowToRemove = event.target.closest('.telefone-row');
            rowToRemove.remove();
            atualizarPreview(); // Atualiza o preview após remover
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
                    const imageUrl = e.target.result;
                    
                    // Mantém a lógica para a imagem visível, que já funciona
                    document.getElementById("previewFoto-visivel").src = imageUrl;

                    // MUDANÇA AQUI: Altera a lógica para o container da versão de impressão
                    const fotoContainer = document.getElementById("previewFoto-container");
                    fotoContainer.style.backgroundImage = `url('${imageUrl}')`;
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
            if (dia && mes && ano) {
    // Formata o dia e o mês para garantir que tenham dois dígitos (ex: 05)
    const diaFormatado = String(dia).padStart(2, '0');
    const mesFormatado = String(mes).padStart(2, '0');

    // Adiciona a data formatada ao HTML com o novo rótulo
    dadosHtml += `<p><strong>Data de Nascimento:</strong> ${diaFormatado}/${mesFormatado}/${ano}</p>`;
}
            const nacionalidade = document.getElementById("nacionalidade").value;
            if (nacionalidade) { dadosHtml += `<p><strong>Nacionalidade:</strong> ${nacionalidade}</p>`; }
            const endereco = document.getElementById("endereco").value;
            if (endereco) { dadosHtml += `<p><strong>Endereço:</strong> ${endereco}</p>`; }
            // Coleta todos os números de telefone formatados primeiro
            const telefonesFormatados = [];
            document.querySelectorAll('.telefone-row').forEach(row => {
                const ddd = row.querySelector('.ddd-input').value;
                const tel = row.querySelector('.telefone-input').value;
                const telFmt = formatarTelefone(ddd, tel);
                if (telFmt) {
                    telefonesFormatados.push(telFmt);
    }
});

            // Se houver pelo menos um número, adiciona o título e a lista de números
            // Se houver pelo menos um número, adiciona o título e a lista de números
            if (telefonesFormatados.length > 0) {
                // Começa com o primeiro número na mesma linha do título
                let telefonesHtml = `<strong>Telefone para Contato:</strong> ${telefonesFormatados[0]}`;

                // Se houver mais de um número, adiciona os restantes em linhas separadas
                if (telefonesFormatados.length > 1) {
                // Pega os números a partir do segundo (índice 1)
                const outrosTelefones = telefonesFormatados.slice(1);
                // Junta os números restantes com uma quebra de linha entre eles
                telefonesHtml += `<br>${outrosTelefones.join('<br>')}`;
    }

                // Adiciona o resultado final ao HTML
                dadosHtml += `<p>${telefonesHtml}</p>`;
}
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
    /*if (window.innerWidth <= 768) {
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
*/
    // =================================================================
    //   Bloco 9: ANIMAÇÃO DE FUNDO (VERSÃO FINAL E AJUSTADA)
    // =================================================================
    const container = document.querySelector('.formas-fundo');
    if (container) {

        // Adiciona o fade-in de 2s após 4s de espera
        setTimeout(() => {
            container.style.opacity = '1';
        }, 1000);
        
        const NUMERO_DE_FORMAS = window.innerWidth <= 768 ? 60 : 120;
        const DURACAO_MOVIMENTO = 10000;
        const DURACAO_FADE = 1000;

    function animarForma(forma) {
    // ETAPA 1: Define o estado inicial da forma (invisível e fora da tela)
    const posTop = Math.random() * 90;
    const posLeft = Math.random() * 90;
    forma.style.top = posTop + '%';
    forma.style.left = posLeft + '%';
    forma.style.opacity = '0';
    // O transform inicial é zerado para garantir que não haja scale
    forma.style.transform = 'translate(0, 0)';

    // NOVO: A duração do movimento é recalculada a cada ciclo para evitar sincronização
    const duracaoMovimentoAleatoria = DURACAO_MOVIMENTO + (Math.random() - 0.5) * 4000; // Varia em +/- 2 segundos

    // ETAPA 2: Animação de APARECER (somente opacidade)
    const animacaoAparecer = forma.animate(
        [ { opacity: 0 }, { opacity: 0.4 } ], // Keyframes só de opacidade
        { duration: DURACAO_FADE, easing: 'ease-out' }
    );

    // ETAPA 3: Quando a forma TERMINA de aparecer, ela começa a se mover.
    animacaoAparecer.onfinish = () => {
        forma.style.opacity = '0.4'; // Garante o estado final

        const movimentoX = (Math.random() - 0.5) * 150;
        const movimentoY = (Math.random() - 0.5) * 150;

        // Animação de MOVER (somente translação, sem scale)
        const animacaoMover = forma.animate(
            [
                { transform: 'translate(0, 0)' },
                { transform: `translate(${movimentoX}px, ${movimentoY}px)` }
            ],
            { duration: duracaoMovimentoAleatoria, easing: 'linear' }
        );

        // ETAPA 4: Quando a forma TERMINA de se mover, ela começa a sumir.
        animacaoMover.onfinish = () => {
            forma.style.transform = `translate(${movimentoX}px, ${movimentoY}px)`; // Garante a posição final

            // Animação de SUMIR (somente opacidade)
            const animacaoSumir = forma.animate(
                [ { opacity: 0.4 }, { opacity: 0 } ],
                { duration: DURACAO_FADE, easing: 'ease-in' }
            );
            
            // ETAPA 5: Quando a forma TERMINA de sumir, reinicia todo o ciclo.
            animacaoSumir.onfinish = () => {
                animarForma(forma); // Loop
            };
        };
    };
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
            
            // GERA UM ATRASO INICIAL ALEATÓRIO PARA CADA FORMA
            // Um valor entre 0 e 10 segundos (10000ms) é ideal para espalhar bem as animações.
            const atrasoInicialAleatorio = Math.random() * 10000; 

            // Inicia a animação de cada forma após seu atraso aleatório único.
            setTimeout(() => {
                animarForma(forma);
            }, atrasoInicialAleatorio);
        }
    }
    // =================================================================
    //   Bloco 10: LÓGICA DO SLIDER DE TÓPICOS (GUIA INTERATIVO)
    // =================================================================
    if (document.querySelector('.topicos-slider-container')) {
        const sliderWindow = document.querySelector('.topicos-window');
        
        // Botões Desktop
        const btnPrev = document.getElementById('topicos-prev');
        const btnNext = document.getElementById('topicos-next');
        
        // Botões Mobile
        const btnPrevMobile = document.getElementById('topicos-prev-mobile');
        const btnNextMobile = document.getElementById('topicos-next-mobile');
    
        const cardWidth = 250; // Largura do card (.guia-square-item)
        const cardGap = 20; // Espaço entre os cards (gap)
    
        // Calcula o quanto rolar
        // Em desktop, rola 3 cards (um "slide" completo)
        // Em mobile, rola 1 card
        function getScrollAmount() {
            // Retorna o valor de 1 card + gap.
            // Isso agora se aplica tanto ao desktop quanto ao mobile.
            return cardWidth + cardGap;
        }
    
        function updateButtonState() {
            if (!sliderWindow) return;
    
            const scrollLeft = sliderWindow.scrollLeft;
            const maxScroll = sliderWindow.scrollWidth - sliderWindow.clientWidth;
            
            // Usamos uma pequena tolerância (ex: 5px) para evitar erros de arredondamento
            const isAtStart = scrollLeft < 5;
            const isAtEnd = scrollLeft > maxScroll - 5;
    
            // Botões Desktop
            if (btnPrev) btnPrev.disabled = isAtStart;
            if (btnNext) btnNext.disabled = isAtEnd;
    
            // Botões Mobile
            if (btnPrevMobile) btnPrevMobile.disabled = isAtStart;
            if (btnNextMobile) btnNextMobile.disabled = isAtEnd;
        }
    
        // --- Event Listeners para os botões ---
    
        function scrollNext() {
            sliderWindow.scrollLeft += getScrollAmount();
        }
    
        function scrollPrev() {
            sliderWindow.scrollLeft -= getScrollAmount();
        }
    
        if (btnNext) btnNext.addEventListener('click', scrollNext);
        if (btnPrev) btnPrev.addEventListener('click', scrollPrev);
        if (btnNextMobile) btnNextMobile.addEventListener('click', scrollNext);
        if (btnPrevMobile) btnPrevMobile.addEventListener('click', scrollPrev);
    
        // Atualiza os botões ao rolar (especialmente no mobile com swipe)
        if (sliderWindow) {
            sliderWindow.addEventListener('scroll', updateButtonState);
        }
        
        // Atualiza ao carregar a página e ao redimensionar
        window.addEventListener('resize', updateButtonState);
        // Espera um instante para o layout carregar e chama a atualização
        setTimeout(updateButtonState, 100); 
    }
    // =================================================================
    //   Bloco 11: LÓGICA DO MODAL (POP-UP) DE IMAGEM
    // =================================================================
    const modal = document.getElementById('meuModal');
    if (modal) {
        const btnFecharModal = document.getElementById('fechar-modal');
        const imagemModal = document.getElementById('imagem-do-modal');
        const cardsComPopup = document.querySelectorAll('.guia-square-item[data-imagem-popup]');

        function abrirModal(imagemSrc) {
            if (!imagemModal || !modal) return;
            imagemModal.src = imagemSrc; // Define a imagem
            modal.classList.add('modal-ativo'); // Mostra o modal
            document.body.style.overflow = 'hidden'; // Trava o scroll da página
        }

        function fecharModal() {
            if (!modal) return;
            modal.classList.remove('modal-ativo'); // Esconde o modal
            document.body.style.overflow = ''; // Libera o scroll
        }

        // Adiciona o "escutador" de clique em cada card
        cardsComPopup.forEach(card => {
            card.addEventListener('click', () => {
                const imagemSrc = card.dataset.imagemPopup;
                if (imagemSrc) {
                    abrirModal(imagemSrc);
                }
            });
        });

        // Adiciona os eventos para fechar
        if (btnFecharModal) {
            btnFecharModal.addEventListener('click', fecharModal);
        }
        
        // Fecha o modal se clicar fora da imagem (no fundo branco)
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                fecharModal();
            }
        });
    }
    // =================================================================
//   Bloco 12: LÓGICA DO GUIA DIÁRIO (GERAR PDF)
// =================================================================
if (document.getElementById('formulario-guia')) {

    // 1. Adiciona o listener no botão de salvar
    const salvarBtn = document.getElementById('salvar-guia-pdf-btn');
    if (salvarBtn) {
        salvarBtn.addEventListener('click', gerarPDFGuiaDiario);
    }

    // 2. Faz os textareas crescerem automaticamente
    const textareasGuia = document.querySelectorAll('#formulario-guia .auto-resize-textarea');
    textareasGuia.forEach(textarea => {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });

    // 3. Função principal para gerar o PDF (adaptada do Bloco 4)
    async function gerarPDFGuiaDiario() {
        const button = document.getElementById('salvar-guia-pdf-btn');
        button.disabled = true;
        button.innerText = 'Gerando PDF...';

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageHeight = pdf.internal.pageSize.getHeight();
            const pageWidth = pdf.internal.pageSize.getWidth();
            
            // Margens do documento
            const marginTop = 15;
            const marginBottom = 15;
            const marginHorizontal = 15;
            const usableWidth = pageWidth - (marginHorizontal * 2);

            let currentY = marginTop; // Onde começamos a desenhar

            // Pega o formulário principal
            const formulario = document.getElementById('formulario-guia');
            
            // Pega o cabeçalho (título) e as seções (blocos)
            const headerElement = formulario.querySelector('.header-guia');
            const sections = formulario.querySelectorAll('.section-guia');

            // --- FUNÇÃO AUXILIAR PARA ADICIONAR UM ELEMENTO AO PDF ---
            // Esta função desenha um elemento e verifica se precisa de uma nova página
            async function addElementToPdf(element, isHeader = false) {
                if (element.style.display === 'none') { return; }

                const canvas = await html2canvas(element, { scale: 2, useCORS: true });
                const imgHeight = canvas.height * usableWidth / canvas.width;

                // Verifica se o elemento (mesmo que seja o cabeçalho)
                // cabe na página atual.
                if (currentY + imgHeight > pageHeight - marginBottom) {
                    pdf.addPage();
                    currentY = marginTop;
                    
                    // Se for uma nova página E não for o próprio cabeçalho,
                    // redesenha o cabeçalho no topo.
                    if (!isHeader && headerElement) {
                        const headerCanvas = await html2canvas(headerElement, { scale: 2, useCORS: true });
                        const headerImgHeight = headerCanvas.height * usableWidth / headerCanvas.width;
                        pdf.addImage(headerCanvas.toDataURL('image/png'), 'PNG', marginHorizontal, currentY, usableWidth, headerImgHeight);
                        currentY += headerImgHeight + 5; // Adiciona espaço após o cabeçalho
                    }
                }

                // Adiciona o elemento atual
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', marginHorizontal, currentY, usableWidth, imgHeight);
                currentY += imgHeight + 5; // Adiciona um pequeno espaço após o elemento
            }

            // --- FIM DA FUNÇÃO AUXILIAR ---

            // 1. Adiciona o cabeçalho na primeira página
            if (headerElement) {
                await addElementToPdf(headerElement, true);
            }

            // 2. Itera sobre todas as outras seções e as adiciona
            for (let i = 0; i < sections.length; i++) {
                await addElementToPdf(sections[i], false);
            }

            // 3. Salva o arquivo
            pdf.save('guia-observacoes.pdf');

        } catch (error) {
            console.error("ERRO DURANTE A GERAÇÃO DO PDF (Guia):", error);
        
        } finally {
            button.disabled = false;
            button.innerText = 'Salvar Formulário';
        }
    }
}
});
