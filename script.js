document.addEventListener('DOMContentLoaded', function() {

    // ===============================================
    //   LÓGICA PARA O MENU RETRÁTIL
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
    //   LÓGICA PARA O POP-UP DE COOKIES
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
    //   LÓGICA PARA O GERADOR DE CURRÍCULO (VERSÃO AVANÇADA)
    // ===============================================
    if (document.querySelector('.curriculo-container')) {

        // --- INICIALIZAÇÃO ---
        const formContainer = document.getElementById('form-container');
        const previewContainer = document.getElementById('preview');
        const allInputs = document.querySelectorAll(".curriculo-container input, .curriculo-container textarea");

        // --- LÓGICA DE ARRASTAR E SOLTAR (DRAG-AND-DROP) ---
        new Sortable(formContainer, {
            animation: 150,
            handle: '.drag-handle',
            onEnd: function (evt) {
                const movedItemId = evt.item.dataset.sectionId;
                const previewSectionToMove = document.getElementById(`secao${capitalizeFirstLetter(movedItemId)}`);
                const targetSectionId = evt.nextSibling ? evt.nextSibling.dataset.sectionId : null;
                if (targetSectionId) {
                    const targetPreviewElement = document.getElementById(`secao${capitalizeFirstLetter(targetSectionId)}`);
                    previewContainer.insertBefore(previewSectionToMove, targetPreviewElement);
                } else {
                    previewContainer.appendChild(previewSectionToMove);
                }
            }
        });

        // --- LÓGICA DOS CONTROLES DE FONTE ---
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

        // --- LÓGICA DE ATUALIZAÇÃO DO PREVIEW E PDF ---
        allInputs.forEach(input => input.addEventListener("input", atualizarPreview));
        document.getElementById("foto").addEventListener("change", atualizarFoto);
        document.getElementById('baixar-pdf-btn').addEventListener('click', gerarPDF);

        function atualizarFoto() {
            const file = document.getElementById("foto").files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById("previewFoto").src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
        function calcularIdade(dia, mes, ano) {
            const hoje = new Date();
            const nascimento = new Date(ano, mes - 1, dia);
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const m = hoje.getMonth() - nascimento.getMonth();
            if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
                idade--;
            }
            return idade;
        }
        function formatarTelefone(ddd, numero) {
            numero = (numero || '').replace(/\D/g, "");
            ddd = (ddd || '').toString().replace(/\D/g, "");
            if (!ddd && !numero) return "";
            if (!ddd) return numero;
            if (!numero) return ddd;
            if (numero.length === 9) {
                return `(${ddd}) ${numero.substring(0, 5)}-${numero.substring(5)}`;
            } else if (numero.length === 8) {
                return `(${ddd}) ${numero.substring(0, 4)}-${numero.substring(4)}`;
            } else {
                return `(${ddd}) ${numero}`;
            }
        }
        function atualizarPreview() {
            document.getElementById("previewNome").innerText = document.getElementById("nome").value;
            const dia = document.getElementById("dia").value;
            const mes = document.getElementById("mes").value;
            const ano = document.getElementById("ano").value;
            let dadosHtml = "";
            if (dia && mes && ano) {
                const idade = calcularIdade(dia, mes, ano);
                if (!Number.isNaN(idade)) {
                    dadosHtml += `<p><strong>Idade:</strong> ${idade} anos</p>`;
                }
            }
            const nacionalidade = document.getElementById("nacionalidade").value;
            if (nacionalidade) {
                dadosHtml += `<p><strong>Nacionalidade:</strong> ${nacionalidade}</p>`;
            }
            const endereco = document.getElementById("endereco").value;
            if (endereco) {
                dadosHtml += `<p><strong>Endereço:</strong> ${endereco}</p>`;
            }
            const ddd = document.getElementById("ddd").value;
            const tel = document.getElementById("telefone").value;
            const telFmt = formatarTelefone(ddd, tel);
            if (telFmt) {
                dadosHtml += `<p><strong>Telefone:</strong> ${telFmt}</p>`;
            }
            const email = document.getElementById("email").value;
            if (email) {
                dadosHtml += `<p><strong>Email:</strong> ${email}</p>`;
            }
            document.getElementById("previewDados").innerHTML = dadosHtml;
            const formSections = formContainer.querySelectorAll('.form-section[data-section-id]');
            formSections.forEach(section => {
                const sectionId = section.dataset.sectionId;
                const inputElement = document.getElementById(sectionId);
                const previewElement = document.getElementById(`preview${capitalizeFirstLetter(sectionId)}`);
                const sectionPreviewContainer = document.getElementById(`secao${capitalizeFirstLetter(sectionId)}`);
                if (inputElement.value.trim() === "") {
                    sectionPreviewContainer.style.display = "none";
                } else {
                    sectionPreviewContainer.style.display = "block";
                    previewElement.innerText = inputElement.value;
                }
            });
        }
        function capitalizeFirstLetter(string) {
            if (!string) return '';
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        // --- FUNÇÃO FINAL DE GERAR PDF (VISUAL PERFEITO + MÚLTIPLAS PÁGINAS) ---
        async function gerarPDF() {
            console.log("Iniciando geração de PDF com fatiamento de página...");
            try {
                const { jsPDF } = window.jspdf;
                const preview = document.getElementById('preview');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const margin = 15;
                const pageWidth = pdf.internal.pageSize.getWidth();
                const usableWidth = pageWidth - (margin * 2);
                const pageHeight = pdf.internal.pageSize.getHeight();
                const usableHeight = pageHeight - (margin * 2);
                const sections = preview.querySelectorAll('.header, .section');
                let currentY = margin;

                for (let i = 0; i < sections.length; i++) {
                    const section = sections[i];
                    if (section.style.display === 'none') {
                        continue;
                    }

                    console.log(`Processando seção ${i + 1}...`);
                    const canvas = await html2canvas(section, { scale: 2, useCORS: true });
                    const imgHeight = canvas.height * usableWidth / canvas.width;

                    if (currentY + imgHeight > usableHeight && i > 0) {
                        pdf.addPage();
                        currentY = margin;
                        console.log("Espaço insuficiente. Criando nova página.");
                    }

                    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, currentY, usableWidth, imgHeight);
                    currentY += imgHeight + 5;
                }

                console.log("PDF criado com sucesso!");
                pdf.save('curriculo.pdf');

            } catch (error) {
                console.error("ERRO DURANTE A GERAÇÃO DO PDF:", error);
            }
        }
        
        // Chamar a atualização inicial do preview
        atualizarPreview();
    }
});
