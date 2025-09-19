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
         const textareas = document.querySelectorAll('.curriculo-container textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto'; // Reseta a altura para medir corretamente
            this.style.height = (this.scrollHeight) + 'px'; // Ajusta para a altura do conteúdo
        const sortableContainer = document.getElementById('sortable-sections');

        // --- LÓGICA DE ARRASTAR E SOLTAR ---
        if (sortableContainer) {
            new Sortable(sortableContainer, {
                animation: 150,
                handle: '.drag-handle',
                filter: '.static-section',
                onEnd: function (evt) {
                    const formSectionsOrdered = sortableContainer.querySelectorAll('.form-section[data-section-id]');
                    formSectionsOrdered.forEach(formSection => {
                        const sectionId = formSection.dataset.sectionId;
                        const previewSectionToMove = document.getElementById(`secao${capitalizeFirstLetter(sectionId)}`);
                        if (previewSectionToMove) {
                            previewContainer.appendChild(previewSectionToMove);
                        }
                    });
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
                    if (previewElement) {
                        let currentSize = parseFloat(window.getComputedStyle(previewElement, null).getPropertyValue('font-size'));
                        if (action === 'increase') {
                            currentSize += 1;
                        } else if (action === 'decrease' && currentSize > 8) {
                            currentSize -= 1;
                        }
                        previewElement.style.fontSize = `${currentSize}px`;
                    }
                }
            });
        }

        // --- LÓGICA DE ATUALIZAÇÃO E PDF ---
        allInputs.forEach(input => input.addEventListener("input", atualizarPreview));
        document.getElementById("foto").addEventListener("change", atualizarFoto);
        document.getElementById('baixar-pdf-btn').addEventListener('click', gerarPDF);

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
        function atualizarPreview() {
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

            if (sortableContainer) {
                const formSections = sortableContainer.querySelectorAll('.form-section[data-section-id]');
                formSections.forEach(section => {
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
        }
        function capitalizeFirstLetter(string) {
            if (!string) return '';
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        async function gerarPDF() {
    console.log("Iniciando geração de PDF com fatiamento de página e margens personalizadas...");
    try {
        const { jsPDF } = window.jspdf;
        const preview = document.getElementById('preview');
        const pdf = new jsPDF('p', 'mm', 'a4');

        // CONTROLE INDIVIDUAL DAS MARGENS
        const marginTop = 15;        // Margem do topo em mm (ex: 1.5cm)
        const marginBottom = 10;     // << Margem do rodapé. Altere este valor! (ex: 1cm)
        const marginHorizontal = 15; // Margem das laterais (ex: 1.5cm)

        const pageWidth = pdf.internal.pageSize.getWidth();
        const usableWidth = pageWidth - (marginHorizontal * 2);
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        const sections = preview.querySelectorAll('.header, .section');
        let currentY = marginTop;

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            if (section.style.display === 'none') {
                continue;
            }

            const canvas = await html2canvas(section, { scale: 2, useCORS: true });
            const imgHeight = canvas.height * usableWidth / canvas.width;

            // Lógica da quebra de página usando a margem do rodapé
            if (currentY + imgHeight > pageHeight - marginBottom && i > 0) {
                pdf.addPage();
                currentY = marginTop;
            }

            // Adiciona a imagem usando a margem lateral
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', marginHorizontal, currentY, usableWidth, imgHeight);
            
            currentY += imgHeight + 5;
        }

        console.log("PDF criado com sucesso!");
        pdf.save('curriculo.pdf');

    } catch (error) {
        console.error("ERRO DURANTE A GERAÇÃO DO PDF:", error);
    }
}
        
        atualizarPreview();
    }
    
}); // FIM DO DOMCONTENTLOADED
