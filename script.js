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
            handle: '.drag-handle', // Define o ícone como a "alça" para arrastar
            onEnd: function (evt) { // Função chamada ao final de um arraste
                const movedItemId = evt.item.dataset.sectionId;
                const previewSectionToMove = document.getElementById(`secao${capitalizeFirstLetter(movedItemId)}`);
                
                // Reordena o preview para bater com a nova ordem do formulário
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
                        currentSize += 1; // Aumenta em 1px
                    } else if (action === 'decrease' && currentSize > 8) { // Não deixa a fonte ficar muito pequena
                        currentSize -= 1; // Diminui em 1px
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
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        // --- NOVA FUNÇÃO DE GERAR PDF (MULTI-PÁGINA) ---
        function gerarPDF() {
            console.log("Gerando PDF multi-página...");
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const previewElement = document.getElementById('preview');
            
            // Usando o método .html() do jsPDF que lida com multi-página
            pdf.html(previewElement, {
                callback: function(pdf) {
                    pdf.save('curriculo.pdf');
                    console.log("PDF salvo!");
                },
                x: 15,
                y: 15,
                width: 180, // Largura do conteúdo no A4 (210mm - margens)
                windowWidth: 700 // Largura do elemento original
            });
        }

        // Chamar a atualização inicial do preview
        atualizarPreview();
    }
});
