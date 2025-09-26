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

    // --- INICIALIZAÇÃO ---
    const formContainer = document.getElementById('form-container');
    const previewContainer = document.getElementById('preview');
    const allInputs = document.querySelectorAll(".curriculo-container input, .curriculo-container textarea");
    const sortableContainer = document.getElementById('sortable-sections');
    
    // --- LÓGICA PARA TEXTAREA AUTO-AJUSTÁVEL ---
    const textareas = document.querySelectorAll('.curriculo-container textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto'; // Reseta a altura para medir corretamente
            this.style.height = (this.scrollHeight) + 'px'; // Ajusta para a altura do conteúdo
        });
    });

    // --- LÓGICA DE ARRASTAR E SOLTAR ---
    if (sortableContainer) {
        new Sortable(sortableContainer, {
            animation: 150,
            handle: '.drag-handle',
            filter: '.static-section',
            onEnd: function (evt) {
                // Ao soltar, a única ação necessária é chamar a atualização do preview,
                // que já lê os elementos na nova ordem.
                atualizarPreview();
            }
        });
    }
    
    // --- LÓGICA DOS CONTROLES DE FONTE ---
    if (formContainer) {
        formContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('font-size-btn')) {
                const action = event.target.dataset.action;
                const targetBaseId = event.target.dataset.target; // Ex: "previewObjetivo"
                
                // Pega os dois elementos de parágrafo (o visível e o do PDF)
                const previewElement = document.getElementById(targetBaseId);
                const previewElementVisivel = document.getElementById(`${targetBaseId}-visivel`);
                
                // Pega o display numérico
                const displayElement = document.querySelector(`[data-size-display-for="${targetBaseId}"]`);

                if (previewElement && previewElementVisivel) {
                    let currentSize = parseFloat(window.getComputedStyle(previewElement, null).getPropertyValue('font-size'));
                    
                    if (action === 'increase') {
                        currentSize += 1;
                    } else if (action === 'decrease' && currentSize > 8) {
                        currentSize -= 1;
                    }
                    
                    // Aplica o novo tamanho em AMBOS os previews
                    const newSize = `${currentSize}px`;
                    previewElement.style.fontSize = newSize;
                    previewElementVisivel.style.fontSize = newSize;

                    // Atualiza o display numérico
                    if (displayElement) {
                        displayElement.innerText = Math.round(currentSize);
                    }
                }
            }
        });
    }

        // --- FUNÇÃO PARA INICIALIZAR OS VALORES DOS DISPLAYS ---
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
    // --- LÓGICA DE ATUALIZAÇÃO E PDF ---
    allInputs.forEach(input => input.addEventListener("input", atualizarPreview));
    document.getElementById("foto").addEventListener("change", atualizarFoto);
    document.getElementById('baixar-pdf-btn').addEventListener('click', gerarPDF);

    // --- FUNÇÕES AUXILIARES ---
    function atualizarFoto() {
    const file = document.getElementById("foto").files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Atualiza a foto em AMBAS as pré-visualizações
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
    // Primeiro, reseta o layout da paginação para uma lista simples
    desfazerPaginacao();
    // --- Atualiza dados pessoais em ambas as pré-visualizações ---
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
    
    // --- Reordena ambas as pré-visualizações ---
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

    // --- Atualiza conteúdo e visibilidade de ambas as pré-visualizações ---
    const allDraggableSections = document.querySelectorAll('.form-section[data-section-id]');
    allDraggableSections.forEach(section => {
        const sectionId = section.dataset.sectionId;
        const capSectionId = capitalizeFirstLetter(sectionId);
        const inputElement = document.getElementById(sectionId);
        
        // Elementos da fonte do PDF (#preview)
        const previewElement = document.getElementById(`preview${capSectionId}`);
        const sectionPreviewContainer = document.getElementById(`secao${capSectionId}`);

        // Elementos da pré-visualização visível (#preview-visivel)
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
        // Chama a nova função de paginação no final de cada atualização
    simularPaginacao();
}

// ===============================================
//   Bloco NOVO: FUNÇÃO PARA RESETAR A PAGINAÇÃO
// ===============================================
function desfazerPaginacao() {
    const previewContainer = document.getElementById('preview-visivel');
    const pages = previewContainer.querySelectorAll('.preview-page');

    // Se não houver páginas, não há nada para fazer
    if (pages.length === 0) return;

    // Pega todas as seções de dentro de todas as páginas
    const allSections = previewContainer.querySelectorAll('.preview-page .header, .preview-page .section');
    
    // Move as seções de volta para serem filhas diretas do container principal
    allSections.forEach(section => {
        previewContainer.appendChild(section);
    });
    
    // Remove as divs de página, que agora estão vazias
    pages.forEach(page => {
        page.remove();
    });
}
        
// ===============================================
//   Bloco NOVO: LÓGICA PARA SIMULAR PAGINAÇÃO
// ===============================================
function simularPaginacao() {
    const MAX_PAGE_HEIGHT_PX = 1050;
    const previewContainer = document.getElementById('preview-visivel');
    const sections = Array.from(previewContainer.querySelectorAll('.header, .section'));
    
    previewContainer.innerHTML = '';

    let currentPage = document.createElement('div');
    currentPage.className = 'preview-page';
    previewContainer.appendChild(currentPage);
    let currentPageHeight = 0;

    sections.forEach(section => {
        // A lógica de quebra de página precisa acontecer ANTES de adicionarmos a altura da seção atual.
        // Primeiro, verificamos se a seção está visível para podermos medir sua altura.
        if (section.style.display !== 'none') {
            
            // Mede a altura da seção atual.
            const sectionHeight = section.offsetHeight;

            // Se a seção for estourar a página (e não for a primeira coisa na página), criamos uma nova.
            if (currentPageHeight + sectionHeight > MAX_PAGE_HEIGHT_PX && currentPage.hasChildNodes()) {
                currentPage = document.createElement('div');
                currentPage.className = 'preview-page';
                previewContainer.appendChild(currentPage);
                currentPageHeight = 0;
            }

            // Adiciona a altura da seção visível à contagem da página atual.
            currentPageHeight += sectionHeight;
        }

        // Independentemente de ser visível ou não, SEMPRE adicionamos a seção à página atual.
        // Isso garante que nenhuma seção seja "perdida" no processo.
        currentPage.appendChild(section);
    });
}
        
    async function gerarPDF() {
    console.log("Iniciando geração de PDF a partir da fonte invisível...");
    const button = document.getElementById('baixar-pdf-btn');
    button.disabled = true;
    button.innerText = 'Gerando PDF...';

    try {
        // A função agora é simples: apenas aponta para #preview e funciona!
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
    
    // Chamar a atualização inicial do preview
    initializeFontDisplays();
    atualizarPreview();
}

// ===============================================
//   Bloco 5: LÓGICA PARA ANIMAÇÃO DOS GIFs SOCIAIS (VERSÃO CORRIGIDA)
// ===============================================
const socialGifs = document.querySelectorAll('.social-gif');

// IMPORTANTE: Ajuste este valor para a duração da sua animação em milissegundos.
// Exemplo: 1.5 segundos = 1500
const gifAnimationDuration = 1500; 

// NOVO: Salva a imagem estática original de cada GIF assim que a página carrega.
socialGifs.forEach(gif => {
    gif.dataset.staticSrc = gif.src;
});

// Função que toca a animação uma vez
const playAnimationOnce = (element) => {
    // ALTERADO: Agora ele pega a imagem estática do local seguro que salvamos.
    const staticSrc = element.dataset.staticSrc;
    const animatedSrc = element.dataset.animatedSrc;

    // Se não houver src animado, não faz nada
    if (!animatedSrc || !staticSrc) return;

    // Troca para o GIF animado
    element.src = animatedSrc;

    // Agenda a troca de volta para a imagem estática após a duração da animação
    setTimeout(() => {
        element.src = staticSrc;
    }, gifAnimationDuration);
};

// --- Lógica para tocar a animação no HOVER do mouse (sem alterações aqui) ---
socialGifs.forEach(gif => {
    gif.addEventListener('mouseenter', () => {
        playAnimationOnce(gif);
    });
});

// --- Lógica para tocar a animação a PRIMEIRA VEZ ao rolar a página (sem alterações aqui) ---
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

// Inicia a observação de cada GIF
socialGifs.forEach(gif => {
    gifObserver.observe(gif);
});
});

// ===============================================
//   Bloco 6: LÓGICA DO PLAYER DE VÍDEO INTERATIVO
// ===============================================
if (document.querySelector('.video-layout-container')) {

    const mainPlayer = document.getElementById('main-video-player');
    const playlistItems = document.querySelectorAll('.custom-playlist-item');

    playlistItems.forEach(item => {
        item.addEventListener('click', function(event) {
            // 1. Impede que o link navegue para outra página
            event.preventDefault();

            // 2. Pega o ID do vídeo do atributo 'data-video-id' do item clicado
            const videoId = this.dataset.videoId;
            
            // 3. Se não houver ID, não faz nada
            if (!videoId) return;

            // 4. Monta a nova URL de incorporação com autoplay
            const newSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

            // 5. Atualiza o 'src' do player principal, trocando o vídeo
            mainPlayer.src = newSrc;
            
            // 6. Atualiza qual item está com a classe 'active-video'
            // Remove de todos primeiro...
            playlistItems.forEach(el => el.classList.remove('active-video'));
            // ...e adiciona apenas no que foi clicado
            this.classList.add('active-video');
        });
    });
}

// ===============================================
//   Bloco 7: AJUSTE DE ALTURA DA PLAYLIST (VERSÃO FINALÍSSIMA)
// ===============================================
function ajustarAlturaPlaylist() {
    const videoElement = document.querySelector('.page-guia .video-player-column iframe');
    const playlistColumn = document.querySelector('.page-guia .playlist-column');

    if (videoElement && playlistColumn) {
        // Apenas a lógica para DESKTOP (> 768px) continua no JavaScript
        if (window.innerWidth > 768) {
            const alturaVideo = videoElement.offsetHeight;
            if (alturaVideo > 0) {
                playlistColumn.style.height = `${alturaVideo}px`;
            }
        } else {
            // A CORREÇÃO: Removemos a regra que definia a altura como 'auto'.
            // Agora o JS não interfere mais com o CSS no modo celular.
            // Definir como '' remove o estilo inline.
            playlistColumn.style.height = '';
        }
    }
}

// Roda a função
document.addEventListener('DOMContentLoaded', ajustarAlturaPlaylist);
window.addEventListener('resize', ajustarAlturaPlaylist);

// ===============================================
//   Bloco 8 (VERSÃO AVANÇADA): ANIMAÇÃO PROGRESSIVA DOS TÓPICOS (MOBILE)
// ===============================================
document.addEventListener('DOMContentLoaded', function() {

    // Só executa esta lógica complexa em telas de "celular"
    if (window.innerWidth <= 768) {
        
        const topicSquares = document.querySelectorAll('.guia-square-item');
        if (topicSquares.length === 0) return; // Sai se não houver tópicos

        // Função que calcula e aplica a animação
        function handleScrollAnimation() {
            const viewportHeight = window.innerHeight;

            topicSquares.forEach(square => {
                const rect = square.getBoundingClientRect();
                
                // Pega a posição do CENTRO do elemento na tela
                // Um valor de 0 significa que o centro do elemento está no topo da tela
                // Um valor igual a `viewportHeight` significa que o centro está na base da tela
                const elementCenterY = rect.top + (rect.height / 2);

                // Converte a posição para a "escala da régua" de 0 a 1 (0 = base, 1 = topo)
                const positionOnRuler = 1 - (elementCenterY / viewportHeight);

                let scale = 1.0; // Tamanho padrão (sem zoom)
                const maxScale = 1.1; // O zoom máximo que queremos (10%)

                // Lógica da sua régua de 20-40-60-80
                // Convertemos para a escala de 0 a 1 (0.2, 0.4, 0.6, 0.8)

                if (positionOnRuler > 0.2 && positionOnRuler < 0.8) {
                    if (positionOnRuler < 0.4) {
                        // Fase de "zoom in" (entre 20 e 40)
                        const progress = (positionOnRuler - 0.2) / (0.4 - 0.2);
                        scale = 1.0 + (maxScale - 1.0) * progress;
                    } else if (positionOnRuler >= 0.4 && positionOnRuler <= 0.6) {
                        // Fase de "zoom máximo" (entre 40 e 60)
                        scale = maxScale;
                    } else {
                        // Fase de "zoom out" (entre 60 e 80)
                        const progress = (positionOnRuler - 0.6) / (0.8 - 0.6);
                        scale = maxScale - (maxScale - 1.0) * progress;
                    }
                }
                
                // Garante que a escala nunca seja menor que 1 ou maior que o máximo
                scale = Math.max(1.0, Math.min(scale, maxScale));

                // Aplica a transformação de escala diretamente no estilo do elemento
                square.style.transform = `scale(${scale})`;
            });
        }

        // Otimização: Usa requestAnimationFrame para não sobrecarregar o navegador
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

        // Roda a função uma vez no carregamento da página para definir o estado inicial
        handleScrollAnimation();
    }
});
