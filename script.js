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
