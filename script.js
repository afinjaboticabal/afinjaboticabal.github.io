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
            const targetId = event.target.dataset.target;
            const previewElement = document.getElementById(targetId);
            
            // Encontra o display numérico correspondente
            const displayElement = document.querySelector(`[data-size-display-for="${targetId}"]`);

            if (previewElement) {
                let currentSize = parseFloat(window.getComputedStyle(previewElement, null).getPropertyValue('font-size'));
                if (action === 'increase') {
                    currentSize += 1;
                } else if (action === 'decrease' && currentSize > 8) {
                    currentSize -= 1;
                }
                previewElement.style.fontSize = `${currentSize}px`;

                // ATUALIZA O NÚMERO NO DISPLAY
                if (displayElement) {
                    displayElement.innerText = currentSize;
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
            reader.onload = (e) => { document.getElementById("previewFoto").src = e.target.result; };
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
        // Atualiza dados pessoais
        document.getElementById("previewNome").innerText = document.getElementById("nome").value || "Seu Nome Aqui";
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
        
        // Reordena o preview para bater com a ordem ATUAL do formulário
        if (sortableContainer) {
            const formSectionsOrdered = sortableContainer.querySelectorAll('.form-section[data-section-id]');
            formSectionsOrdered.forEach(formSection => {
                const sectionId = formSection.dataset.sectionId;
                const previewSectionToMove = document.getElementById(`secao${capitalizeFirstLetter(sectionId)}`);
                if(previewSectionToMove) {
                    previewContainer.appendChild(previewSectionToMove);
                }
            });
        }

        // Atualiza conteúdo e visibilidade
        const allDraggableSections = document.querySelectorAll('.form-section[data-section-id]');
        allDraggableSections.forEach(section => {
            const sectionId = section.dataset.sectionId;
            const inputElement = document.getElementById(sectionId);
            const previewElement = document.getElementById(`preview${capitalizeFirstLetter(sectionId)}`);
            const sectionPreviewContainer = document.getElementById(`secao${capitalizeFirstLetter(sectionId)}`);
            if (inputElement && previewElement && sectionPreviewContainer) {
                if (inputElement.value.trim() === "") {
                    sectionPreviewContainer.style.display = "none";
                } else {
                    sectionPreviewContainer.style.display = "block";
                    previewElement.innerText = inputElement.value;
                }
            }
        });
    }

    async function gerarPDF() {
        console.log("Iniciando geração de PDF com fatiamento de página e margens personalizadas...");
        try {
            const { jsPDF } = window.jspdf;
            const preview = document.getElementById('preview');
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
                const canvas = await html2canvas(section, { scale: 2, useCORS: true });
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
//   Bloco 7: AJUSTE DE ALTURA DA PLAYLIST (COM DEBUG PARA CELULAR)
// ===============================================
function ajustarAlturaPlaylist() {
    console.log("1. Função 'ajustarAlturaPlaylist' foi chamada.");

    // A versão anterior que media o IFRAME estava correta para o desktop
    const videoElement = document.querySelector('.page-guia .video-player-column iframe');
    const playlistColumn = document.querySelector('.page-guia .playlist-column');

    if (videoElement && playlistColumn) {
        console.log("2. Elemento de vídeo e coluna da playlist ENCONTRADOS.");
        
        // Verifica se a tela é larga (desktop) ou estreita (celular)
        if (window.innerWidth > 768) {
            console.log("3. MODO DESKTOP ATIVADO.");
            const alturaVideo = videoElement.offsetHeight;
            playlistColumn.style.height = `${alturaVideo}px`;
            console.log(`4. Altura DESKTOP de ${alturaVideo}px APLICADA.`);
        } else {
            // --- LÓGICA PARA CELULAR ---
            console.log("3. MODO CELULAR ATIVADO.");
            // ESTA LINHA É A NOSSA PRINCIPAL SUSPEITA
            playlistColumn.style.height = 'auto'; 
            console.log("4. Altura 'auto' FOI APLICADA via JS. Isso pode estar anulando a altura de 400px do CSS.");
            console.log("--> PRÓXIMO PASSO: Inspecione o elemento '.playlist-column' na aba 'Elements' para confirmar.");
        }
    } else {
        console.error("ERRO: Não foi possível encontrar os elementos.");
    }
}

// Roda a função
document.addEventListener('DOMContentLoaded', ajustarAlturaPlaylist);
window.addEventListener('resize', ajustarAlturaPlaylist);
