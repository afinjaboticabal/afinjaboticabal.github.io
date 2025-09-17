document.addEventListener('DOMContentLoaded', function() {

    // ===============================================
    //   LÓGICA PARA O MENU RETRÁTIL
    // ===============================================
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
        // Fecha o menu se clicar fora dos links
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
    //   LÓGICA PARA O GERADOR DE CURRÍCULO
    // ===============================================
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

        // SUBSTITUA SUA FUNÇÃO ANTIGA POR ESTA

async function gerarPDF() {
    console.log("1. Função gerarPDF (versão auto-ajustável) iniciada!");
    try {
        const { jsPDF } = window.jspdf;
        const preview = document.getElementById("preview");

        // --- NOVA LÓGICA DE AJUSTE AUTOMÁTICO ---

        // 1. Medimos o tamanho real do preview na tela
        const previewWidth = preview.offsetWidth;
        const previewHeight = preview.offsetHeight;

        // 2. Definimos a proporção de uma folha A4 (largura / altura)
        const a4Ratio = 210 / 297;

        // 3. Calculamos a proporção atual do preview
        const previewRatio = previewWidth / previewHeight;

        let scale = 1; // Começamos com a escala normal (100%)

        // 4. Comparamos as proporções. Se o preview for "mais comprido" que uma folha A4...
        if (previewRatio < a4Ratio) {
            // ...calculamos o fator de "encolhimento" necessário.
            scale = previewRatio / a4Ratio;
            console.log(`Preview é muito comprido. Aplicando escala: ${scale}`);
            
            // 5. Aplicamos o "zoom out" no elemento ANTES de tirar a foto
            preview.style.transformOrigin = 'top left';
            preview.style.transform = `scale(${scale})`;
        }

        // 6. Tiramos a "foto" do elemento (agora já encolhido, se necessário)
        const canvas = await html2canvas(preview, {
            scale: 2, // Aumenta a resolução da captura
            useCORS: true
        });

        // 7. IMPORTANTE: Removemos o "zoom out" para a pré-visualização na tela voltar ao normal
        if (scale < 1) {
            preview.style.transformOrigin = '';
            preview.style.transform = '';
        }

        // --- FIM DA NOVA LÓGICA ---

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("curriculo.pdf");
        console.log("9. Comando para salvar o PDF enviado!");

    } catch (error) {
        console.error("ERRO DURANTE A GERAÇÃO DO PDF:", error);
    }
}

        const downloadButton = document.getElementById('baixar-pdf-btn');
        if (downloadButton) {
            downloadButton.addEventListener('click', gerarPDF);
        }

        // inicializa preview limpo
        atualizarPreview();
    }

}); // FIM DO DOMCONTENTLOADED
