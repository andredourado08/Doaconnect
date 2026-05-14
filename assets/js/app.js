(function() {
            'use strict';

            // Inicializa AOS
            if (window.AOS) {
            AOS.init({
                duration: 700,
                easing: 'ease-out-cubic',
                once: true,
                offset: 80,
                disable: false
            });
            }

            // ==================== DADOS ====================
            const categoryMeta = {
                geral: { label: 'Geral', icon: 'fa-hand-holding-heart' },
                roupas: { label: 'Roupas', icon: 'fa-shirt' },
                alimentos: { label: 'Alimentos', icon: 'fa-basket-shopping' },
                higiene: { label: 'Higiene', icon: 'fa-pump-soap' },
                brinquedos: { label: 'Brinquedos', icon: 'fa-puzzle-piece' },
                saude: { label: 'Sa\u00FAde', icon: 'fa-kit-medical' }
            };

            const donationsData = [
                {
                    type: 'geral',
                    categories: ['geral', 'roupas', 'alimentos', 'higiene'],
                    title: 'Fundo Social de Solidariedade',
                    desc: 'Ponto p\u00FAblico para campanhas e doa\u00E7\u00F5es solid\u00E1rias. Confirme por telefone quais itens est\u00E3o sendo recebidos no momento.',
                    location: 'Vila Erc\u00EDlia',
                    address: 'R. Pedro Amaral, 3578 - Vila Erc\u00EDlia',
                    hours: 'Segunda a sexta, 8h \u00E0s 17h',
                    contact: '(17) 3214-9010',
                    accepts: ['Itens de campanha', 'Roupas', 'Alimentos', 'Cobertores'],
                    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Fundo+Social+de+Solidariedade+Rua+Pedro+Amaral+3578+Sao+Jose+do+Rio+Preto',
                    sourceUrl: 'https://www.waze.com/live-map/directions/brazil/state-of-sao-paulo/sao-jose-do-rio-preto/fundo-social-de-solidariedade?to=place.ChIJhdCpOVetvZQRnt2DIIV6zME'
                },
                {
                    type: 'roupas',
                    categories: ['roupas', 'brinquedos', 'moveis'],
                    title: 'Bazar ARCD',
                    desc: 'Recebe itens para o bazar solid\u00E1rio da institui\u00E7\u00E3o, ajudando projetos ligados \u00E0 reabilita\u00E7\u00E3o e inclus\u00E3o.',
                    location: 'Jardim Maracan\u00E3',
                    address: 'Av. da Luz, 2525 - Jardim Maracan\u00E3',
                    hours: 'Dias \u00FAteis, 7h \u00E0s 17h',
                    contact: '(17) 3201-1510 / (17) 99602-6926',
                    accepts: ['Roupas', 'Cal\u00E7ados', 'Brinquedos', 'M\u00F3veis', 'Utens\u00EDlios'],
                    mapUrl: 'https://www.google.com/maps/search/?api=1&query=ARCD+Avenida+da+Luz+2525+Sao+Jose+do+Rio+Preto',
                    sourceUrl: 'https://arcd.org.br/bazar-arcd/'
                },
                {
                    type: 'saude',
                    categories: ['saude', 'alimentos', 'higiene'],
                    title: 'Santa Casa de Rio Preto',
                    desc: 'Recebe doa\u00E7\u00F5es ligadas a cuidado hospitalar e apoio aos atendimentos da institui\u00E7\u00E3o.',
                    location: 'Boa Vista',
                    address: 'R. Fritz Jacobs, 1236 - Boa Vista',
                    hours: 'Atendimento 24 horas',
                    contact: '(17) 2139-9200',
                    accepts: ['Fraldas', 'M\u00E1scaras', 'Alimentos n\u00E3o perec\u00EDveis', 'Doa\u00E7\u00E3o financeira'],
                    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Santa+Casa+de+Sao+Jose+do+Rio+Preto+Rua+Fritz+Jacobs+1236',
                    sourceUrl: 'https://www.santacasariopreto.com.br/doe-agora/'
                },
                {
                    type: 'roupas',
                    categories: ['roupas', 'higiene', 'brinquedos'],
                    title: 'Brech\u00F3 AMICC',
                    desc: 'Doa\u00E7\u00F5es ajudam fam\u00EDlias de crian\u00E7as em tratamento oncol\u00F3gico ou cardiol\u00F3gico.',
                    location: 'Jd. Francisco Fernandes',
                    address: 'Rua Dr. Lino Braille, 355 - Jd. Francisco Fernandes',
                    hours: 'Confirme hor\u00E1rio pelo telefone',
                    contact: '(17) 2137-0777 / (17) 99134-3863',
                    accepts: ['Roupas', 'Cal\u00E7ados', 'Livros', 'Higiene', 'Limpeza', 'Utens\u00EDlios'],
                    mapUrl: 'https://www.google.com/maps/search/?api=1&query=AMICC+Rua+Dr+Lino+Braille+355+Sao+Jose+do+Rio+Preto',
                    sourceUrl: 'https://www.amicc.com.br/brech%C3%B3'
                },
                {
                    type: 'geral',
                    categories: ['geral', 'alimentos', 'roupas'],
                    title: 'C\u00E1ritas Diocesana Rio Preto',
                    desc: 'Organiza\u00E7\u00E3o social que recebe apoio e direciona solidariedade para a\u00E7\u00F5es comunit\u00E1rias.',
                    location: 'Centro',
                    address: 'Rua Delegado Pinto de Toledo, 2143',
                    hours: 'Confirme pelo WhatsApp',
                    contact: '(17) 98195-1324',
                    accepts: ['Doa\u00E7\u00F5es solid\u00E1rias', 'Alimentos', 'Roupas', 'Apoio social'],
                    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Caritas+Diocesana+Rio+Preto+Rua+Delegado+Pinto+de+Toledo+2143',
                    sourceUrl: 'https://caritasriopreto.org.br/'
                }
            ];

            const testimonialsData = [
                { name: 'Maria', role: 'Doadora', text: 'Consegui encontrar um local pr\u00F3ximo para levar roupas que estavam paradas em casa.' },
                { name: 'Projeto escolar', role: 'Equipe Doaconnect', text: 'Mapear pontos confi\u00E1veis ajuda a transformar informa\u00E7\u00E3o em solidariedade.' },
                { name: 'Fam\u00EDlia atendida', role: 'Benefici\u00E1ria', text: 'Quando a doa\u00E7\u00E3o chega organizada, ela ajuda muito mais r\u00E1pido.' },
            ];

            // ==================== CARDS ====================
            function createCardElement(item) {
                const card = document.createElement('li');
                card.className = 'donation-card';
                card.setAttribute('data-type', item.type);
                const meta = categoryMeta[item.type] || categoryMeta.geral;
                const accepts = item.accepts.map(label => '<span>' + label + '</span>').join('');
                card.innerHTML =
                    '<div class="card-badge">' +
                        '<span class="badge-type offer"><i class="fas ' + meta.icon + '"></i> ' + meta.label + '</span>' +
                        '<span class="card-location"><i class="fas fa-location-dot location-icon"></i> ' + item.location + '</span>' +
                    '</div>' +
                    '<h3>' + item.title + '</h3>' +
                    '<p class="card-desc">' + item.desc + '</p>' +
                    '<div class="point-info-list">' +
                        '<span><i class="fas fa-map-pin"></i> ' + item.address + '</span>' +
                        '<span><i class="far fa-clock"></i> ' + item.hours + '</span>' +
                        '<span><i class="fas fa-phone"></i> ' + item.contact + '</span>' +
                    '</div>' +
                    '<div class="accepts-list">' + accepts + '</div>' +
                    '<div class="card-footer">' +
                        '<a href="' + item.mapUrl + '" target="_blank" rel="noopener" class="btn-card primary">Ver no mapa</a>' +
                        '<a href="' + item.sourceUrl + '" target="_blank" rel="noopener" class="btn-card">Fonte</a>' +
                    '</div>';
                return card;
            }

            function renderCards(containerId, filter = 'todas') {
                const container = document.getElementById(containerId);
                if (!container) return;
                container.innerHTML = '';
                donationsData.forEach(item => {
                    const categories = item.categories || [item.type];
                    if (filter === 'todas' || categories.includes(filter)) {
                        container.appendChild(createCardElement(item));
                    }
                });
            }

            function renderTestimonials() {
                const grid = document.getElementById('testimonialsGrid');
                if (!grid) return;
                grid.innerHTML = '';
                testimonialsData.forEach(t => {
                    const card = document.createElement('div');
                    card.className = 'testimonial-card';
                    card.setAttribute('data-aos', 'fade-up');
                    card.innerHTML =
                        '<div class="testimonial-avatar"><i class="fas fa-user"></i></div>' +
                        '<p>"' + t.text + '"</p>' +
                        '<strong>' + t.name + '</strong> - <span>' + t.role + '</span>';
                    grid.appendChild(card);
                });
                if (window.AOS) AOS.refresh();
            }

            // ==================== ESTAT\u00CDSTICAS ANIMADAS ====================
            function animateStats() {
                const stats = {
                    statDoacoes: { target: 12, current: 0 },
                    statUsuarios: { target: 6, current: 0 },
                    statItens: { target: 35, current: 0 },
                    statFamilias: { target: 1, current: 0 },
                };
                const duration = 1600;
                const startTime = performance.now();

                function update(timestamp) {
                    const elapsed = timestamp - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    for (const [id, data] of Object.entries(stats)) {
                        const el = document.getElementById(id);
                        if (el) {
                            data.current = Math.floor(data.target * eased);
                            el.textContent = data.current.toLocaleString('pt-BR');
                        }
                    }
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }
                requestAnimationFrame(update);
            }

            const statsSectionEl = document.querySelector('.stats-section');
            if (statsSectionEl) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animateStats();
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.3 });
                observer.observe(statsSectionEl);
            }

            // ==================== TOAST ====================
            function showToast(msg) {
                const container = document.getElementById('toastContainer');
                if (!container) return;
                const toast = document.createElement('div');
                toast.className = 'toast';
                toast.textContent = msg;
                container.appendChild(toast);
                setTimeout(() => {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateX(100px)';
                    toast.style.transition = 'all 0.3s ease';
                    setTimeout(() => toast.remove(), 300);
                }, 2500);
            }

            renderCards('cardsGrid', 'todas');
            renderCards('allCardsGrid', 'todas');
            renderTestimonials();

            function setupFilters(tabsSelector, gridId) {
                const tabs = document.querySelectorAll(tabsSelector);
                tabs.forEach(tab => {
                    tab.addEventListener('click', function() {
                        tabs.forEach(t => t.classList.remove('active'));
                        this.classList.add('active');
                        renderCards(gridId, this.dataset.filter);
                    });
                });
            }
            setupFilters('.donations-section .filter-tab', 'cardsGrid');
            setupFilters('#allFilterTabs .filter-tab', 'allCardsGrid');

            const menuToggle = document.getElementById('menuToggle');
            const navLinksEl = document.getElementById('navLinks');
            if (menuToggle && navLinksEl) {
                menuToggle.addEventListener('click', () => {
                    navLinksEl.classList.toggle('active');
                    const expanded = navLinksEl.classList.contains('active');
                    menuToggle.setAttribute('aria-expanded', expanded);
                });
            }

            const modalCadastro = document.getElementById('modalCadastro');
            const modalLogin = document.getElementById('modalLogin');
            const modalInteresse = document.getElementById('modalInteresse');
            const closeCadastro = document.getElementById('closeCadastroModal');
            const closeLogin = document.getElementById('closeLoginModal');
            const closeInteresse = document.getElementById('closeInteresseModal');
            const formCadastro = document.getElementById('formCadastro');
            const formLogin = document.getElementById('formLogin');
            const formInteresse = document.getElementById('formInteresse');

            function openModal(modal) {
                if (!modal) return;
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }

            function closeModal(modal) {
                if (!modal) return;
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }

            window.addEventListener('click', (e) => {
                if (e.target === modalCadastro) closeModal(modalCadastro);
                if (e.target === modalLogin) closeModal(modalLogin);
                if (e.target === modalInteresse) closeModal(modalInteresse);
            });

            if (closeCadastro) closeCadastro.addEventListener('click', () => closeModal(modalCadastro));
            if (closeLogin) closeLogin.addEventListener('click', () => closeModal(modalLogin));
            if (closeInteresse) closeInteresse.addEventListener('click', () => closeModal(modalInteresse));

            if (formCadastro) {
                formCadastro.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    showToast('Cadastro simulado para o teste do projeto.');
                    closeModal(modalCadastro);
                    formCadastro.reset();
                });
            }

            if (formLogin) {
                formLogin.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    showToast('Login simulado para o teste do projeto.');
                    closeModal(modalLogin);
                    formLogin.reset();
                });
            }

            if (formInteresse) {
                formInteresse.addEventListener('submit', (e) => {
                    e.preventDefault();
                    showToast('Sugest\u00E3o recebida para avalia\u00E7\u00E3o do projeto.');
                    closeModal(modalInteresse);
                    formInteresse.reset();
                });
            }

            function scrollToPoints() {
                document.getElementById('destaquesSection')?.scrollIntoView({ behavior: 'smooth' });
            }

            document.querySelectorAll('#queroDoarHeader, #queroDoarHero, #verNecessidadesBtn, #criarContaBtn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    scrollToPoints();
                });
            });

            document.getElementById('precisoHeader')?.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('#modalInteresse h2').innerText = 'Indicar ponto de doa\u00E7\u00E3o';
                openModal(modalInteresse);
            });

            document.getElementById('linkLogin')?.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal(modalCadastro);
                openModal(modalLogin);
            });

            document.getElementById('linkCadastroFromLogin')?.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal(modalLogin);
                openModal(modalCadastro);
            });

            document.getElementById('linkEsqueciSenha')?.addEventListener('click', (e) => {
                e.preventDefault();
                showToast('Recupera\u00E7\u00E3o de senha simulada para apresenta\u00E7\u00E3o.');
            });

            document.getElementById('btnLogout')?.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('navButtons')?.classList.remove('hidden');
                document.getElementById('navUser')?.classList.add('hidden');
                showToast('Voc\u00EA saiu da conta.');
            });

            const destaquesSection = document.getElementById('destaquesSection');
            const allSection = document.getElementById('allDonationsSection');
            const verTodasBtn = document.getElementById('verTodasDoacoesBtn');
            const backBtn = document.getElementById('backToDestaquesBtn');
            const navDoacoesLink = document.getElementById('navDoacoesLink');
            const footerDoacoesLink = document.getElementById('footerDoacoesLink');

            function showAllDonations() {
                if (!destaquesSection || !allSection) return;
                destaquesSection.style.display = 'none';
                allSection.style.display = 'block';
                const ctaParent = document.querySelector('.cta-section')?.parentElement;
                if (ctaParent) ctaParent.style.display = 'none';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            function showDestaques() {
                if (!destaquesSection || !allSection) return;
                destaquesSection.style.display = 'block';
                allSection.style.display = 'none';
                const ctaParent = document.querySelector('.cta-section')?.parentElement;
                if (ctaParent) ctaParent.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            verTodasBtn?.addEventListener('click', (e) => { e.preventDefault(); showAllDonations(); });
            backBtn?.addEventListener('click', showDestaques);
            navDoacoesLink?.addEventListener('click', (e) => { e.preventDefault(); showAllDonations(); });
            footerDoacoesLink?.addEventListener('click', (e) => { e.preventDefault(); showAllDonations(); });

            const darkToggle = document.getElementById('darkToggle');
            const darkToggle2 = document.getElementById('darkToggle2');
            const body = document.body;

            function toggleDarkMode() {
                body.classList.toggle('dark-mode');
                const isDark = body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isDark ? '1' : '0');
                const icon = isDark ? 'fa-sun' : 'fa-moon';
                [darkToggle, darkToggle2].forEach(btn => {
                    if (btn) btn.querySelector('i').className = 'fas ' + icon;
                });
                showToast(isDark ? 'Modo escuro ativado' : 'Modo claro ativado');
            }

            if (darkToggle) darkToggle.addEventListener('click', toggleDarkMode);
            if (darkToggle2) darkToggle2.addEventListener('click', toggleDarkMode);

            if (localStorage.getItem('darkMode') === '1') {
                body.classList.add('dark-mode');
                [darkToggle, darkToggle2].forEach(btn => {
                    if (btn) btn.querySelector('i').className = 'fas fa-sun';
                });
            }

            document.querySelectorAll('.social-icons i').forEach(icon => {
                icon.addEventListener('click', () => showToast('Redes sociais do Doaconnect - em breve!'));
            });

            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href === '#' || href === '#0') return;
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

            console.log('Doaconnect teste - pronto!');
        })();
