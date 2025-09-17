document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA PARA ANIMAÇÃO DE SCROLL ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: para de observar o elemento uma vez que ele já apareceu
                // revealObserver.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1 // A animação começa quando 10% do elemento está visível
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // --- LÓGICA PARA O POP-UP DE COOKIES ---
    const cookiePopup = document.getElementById('cookie-popup');
    const acceptCookieButton = document.getElementById('accept-cookie');

    // Verifica no armazenamento do navegador se o cookie já foi aceito
    if (!localStorage.getItem('cookieConsent')) {
        // Se não foi aceito, mostra o pop-up depois de 2 segundos
        setTimeout(() => {
            cookiePopup.classList.add('show');
        }, 2000);
    }

    // Quando o botão de aceitar é clicado
    acceptCookieButton.addEventListener('click', () => {
        cookiePopup.classList.remove('show');
        // Salva a informação de que o cookie foi aceito
        localStorage.setItem('cookieConsent', 'true');
    });

});

const menuToggleButton = document.getElementById('menu-toggle');
const closeMenuButton = document.getElementById('close-menu');
const menuOverlay = document.getElementById('menu-overlay');

if (menuToggleButton && menuOverlay && closeMenuButton) {

    // Abre o menu
    menuToggleButton.addEventListener('click', () => {
        menuOverlay.classList.remove('hidden');
    });

    // Fecha o menu
    closeMenuButton.addEventListener('click', () => {
        menuOverlay.classList.add('hidden');
    });

    // Opcional: Fecha o menu se clicar fora dos links
    menuOverlay.addEventListener('click', (event) => {
        if (event.target === menuOverlay) {
            menuOverlay.classList.add('hidden');
        }
    });
}

// ===============================================
//   LÓGICA PARA O GERADOR DE CURRÍCULO
// ===============================================

// Verifica se estamos na página do currículo antes de rodar o código
if (document.querySelector('.curriculo-container')) {

    const inputs = document.querySelectorAll(".curriculo-container input, .curriculo-container textarea");
    const fotoInput = document.getElementById("foto");

    inputs.forEach((input) => {
        input.addEventListener("input", atualizarPreview);
    });

    if (fotoInput) {
        fotoInput.addEventListener("change", () => {
            const file = fotoInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById("previewFoto").src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
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
            return `${ddd} ${numero.substring(0, 5)}-${numero.substring(5)}`;
        } else if (numero.length === 8) {
            return `${ddd} ${numero.substring(0, 4)}-${numero.substring(4)}`;
        } else {
            return `${ddd} ${numero}`;
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
        toggleSection("objetivo", "secaoObjetivo", "previewObjetivo");
        toggleSection("formacao", "secaoFormacao", "previewFormacao");
        toggleSection("habilidades", "secaoHabilidades", "previewHabilidades");
        toggleSection("cursos", "secaoCursos", "previewCursos");
        toggleSection("experiencias", "secaoExperiencias", "previewExperiencias");
        toggleSection("info", "secaoInfo", "previewInfo");
    }

    function toggleSection(inputId, sectionId, previewId) {
        const value = document.getElementById(inputId).value;
        const section = document.getElementById(sectionId);
        if (value.trim() === "") {
            section.style.display = "none";
        } else {
            section.style.display = "block";
            document.getElementById(previewId).innerText = value;
        }
    }

    async function gerarPDF() {
    console.log("1. Função gerarPDF iniciada!");
    try {
        const { jsPDF } = window.jspdf;
        console.log("2. Biblioteca jsPDF carregada com sucesso.");

        const preview = document.getElementById("preview");
        console.log("3. Div de pré-visualização encontrada:", preview);

        const canvas = await html2canvas(preview, { scale: 2 });
        console.log("4. Captura da tela (canvas) criada com sucesso.");

        const imgData = canvas.toDataURL("image/png");
        console.log("5. Imagem convertida para dados (dataURL).");

        const pdf = new jsPDF("p", "mm", "a4");
        console.log("6. Novo documento PDF criado.");

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        console.log("7. Dimensões do PDF calculadas.");

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        console.log("8. Imagem adicionada ao PDF.");

        pdf.save("curriculo.pdf");
        console.log("9. Comando para salvar o PDF enviado! O download deve começar.");
        
    } catch (error) {
        console.error("ERRO DURANTE A GERAÇÃO DO PDF:", error);
    }
}
    // ===============================================
//   LÓGICA PARA O GERADOR DE CURRÍCULO
// ===============================================
if (document.querySelector('.curriculo-container')) {

    // ... todo o seu código do gerador já existe aqui ...
    
    async function gerarPDF() {
        // ... a função gerarPDF continua aqui ...
    }

    // ===============================================
    //   CÓDIGO NOVO PARA ADICIONAR
    // ===============================================
    const downloadButton = document.getElementById('baixar-pdf-btn');
    if (downloadButton) {
        downloadButton.addEventListener('click', gerarPDF);
    }
    // ===============================================

    // inicializa preview limpo
    atualizarPreview();
}
    // inicializa preview limpo
    atualizarPreview();
}
