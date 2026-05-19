(function() {
    'use strict';

    if (window.AOS) {
        AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 80, disable: false });
    }

    const categoryMeta = {
        geral: { label: 'Geral', icon: 'fa-hand-holding-heart' },
        roupas: { label: 'Roupas', icon: 'fa-shirt' },
        alimentos: { label: 'Alimentos', icon: 'fa-basket-shopping' },
        higiene: { label: 'Higiene', icon: 'fa-pump-soap' },
        brinquedos: { label: 'Brinquedos', icon: 'fa-puzzle-piece' },
        saude: { label: 'Saúde', icon: 'fa-kit-medical' },
        moveis: { label: 'Móveis', icon: 'fa-couch' }
    };

    const testimonialsData = [
        { name: 'Maria', role: 'Doadora', text: 'Consegui encontrar um local próximo para levar roupas que estavam paradas em casa.' },
        { name: 'Projeto escolar', role: 'Equipe Doaconnect', text: 'Mapear pontos confiáveis ajuda a transformar informação em solidariedade.' },
        { name: 'Família atendida', role: 'Beneficiária', text: 'Quando a doação chega organizada, ela ajuda muito mais rápido.' }
    ];

    let donationsData = [];
    const gridState = {
        cardsGrid: { filter: 'todas', search: '' },
        allCardsGrid: { filter: 'todas', search: '' }
    };

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>'"]/g, char => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[char]));
    }

    function normalizeText(value) {
        return String(value ?? '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }

    async function loadDonationPoints() {
        donationsData = Array.isArray(window.DOACONNECT_DONATION_POINTS)
            ? window.DOACONNECT_DONATION_POINTS
            : [];
    }

    function getFilteredItems(filter = 'todas', query = '') {
        const normalizedQuery = normalizeText(query).trim();
        return donationsData.filter(item => {
            const categories = item.categories || [item.type];
            if (filter !== 'todas' && !categories.includes(filter)) return false;
            if (!normalizedQuery) return true;
            const searchable = [
                item.title, item.desc, item.location, item.address, item.hours, item.contact,
                ...(item.accepts || []),
                ...categories.map(category => categoryMeta[category]?.label || category)
            ].join(' ');
            return normalizeText(searchable).includes(normalizedQuery);
        });
    }

    function updateResultCount(containerId, total) {
        const countId = containerId === 'cardsGrid' ? 'cardsResultCount' : 'allCardsResultCount';
        const countEl = document.getElementById(countId);
        if (countEl) countEl.textContent = total === 1 ? '1 ponto encontrado' : total + ' pontos encontrados';
    }

    function createCardElement(item) {
        const card = document.createElement('li');
        card.className = 'donation-card';
        card.setAttribute('data-type', item.type || 'geral');
        const meta = categoryMeta[item.type] || categoryMeta.geral;
        const accepts = (item.accepts || []).map(label => '<span>' + escapeHtml(label) + '</span>').join('');
        const lastChecked = item.lastChecked
            ? '<span><i class="fas fa-circle-check"></i> Atualizado: ' + escapeHtml(item.lastChecked) + '</span>'
            : '';

        card.innerHTML =
            '<div class="card-badge">' +
                '<span class="badge-type offer"><i class="fas ' + escapeHtml(meta.icon) + '"></i> ' + escapeHtml(meta.label) + '</span>' +
                '<span class="card-location"><i class="fas fa-location-dot location-icon"></i> ' + escapeHtml(item.location) + '</span>' +
            '</div>' +
            '<h3>' + escapeHtml(item.title) + '</h3>' +
            '<p class="card-desc">' + escapeHtml(item.desc) + '</p>' +
            '<div class="point-info-list">' +
                '<span><i class="fas fa-map-pin"></i> ' + escapeHtml(item.address) + '</span>' +
                '<span><i class="far fa-clock"></i> ' + escapeHtml(item.hours) + '</span>' +
                '<span><i class="fas fa-phone"></i> ' + escapeHtml(item.contact) + '</span>' +
                lastChecked +
            '</div>' +
            '<div class="accepts-list">' + accepts + '</div>' +
            '<div class="card-footer">' +
                '<a href="' + escapeHtml(item.mapUrl) + '" target="_blank" rel="noopener" class="btn-card primary">Abrir rota</a>' +
                '<a href="' + escapeHtml(item.sourceUrl) + '" target="_blank" rel="noopener" class="btn-card">Fonte</a>' +
            '</div>';
        return card;
    }

    function renderCards(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const state = gridState[containerId] || { filter: 'todas', search: '' };
        const items = getFilteredItems(state.filter, state.search);
        container.innerHTML = '';
        updateResultCount(containerId, items.length);

        if (items.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'empty-state';
            empty.innerHTML = '<i class="fas fa-magnifying-glass"></i><strong>Nenhum ponto encontrado</strong><span>Tente outro bairro, item ou categoria.</span>';
            container.appendChild(empty);
            return;
        }

        items.forEach(item => container.appendChild(createCardElement(item)));
        if (window.AOS) AOS.refresh();
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
                '<p>"' + escapeHtml(t.text) + '"</p>' +
                '<strong>' + escapeHtml(t.name) + '</strong> - <span>' + escapeHtml(t.role) + '</span>';
            grid.appendChild(card);
        });
        if (window.AOS) AOS.refresh();
    }

    function getStatsTargets() {
        const categorySet = new Set();
        const itemSet = new Set();
        donationsData.forEach(point => {
            (point.categories || [point.type]).forEach(category => {
                if (category !== 'geral') categorySet.add(category);
            });
            (point.accepts || []).forEach(item => itemSet.add(normalizeText(item)));
        });
        return {
            statDoacoes: donationsData.length,
            statUsuarios: categorySet.size,
            statItens: itemSet.size,
            statFamilias: 1
        };
    }

    function updateStats() {
        const targets = getStatsTargets();
        Object.entries(targets).forEach(([id, target]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = target.toLocaleString('pt-BR');
        });
    }

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

    function setupFilters(tabsSelector, gridId) {
        const tabs = document.querySelectorAll(tabsSelector);
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                gridState[gridId].filter = this.dataset.filter || 'todas';
                renderCards(gridId);
            });
        });
    }

    function setupSearch(inputId, gridId) {
        const input = document.getElementById(inputId);
        if (!input) return;
        input.addEventListener('input', () => {
            gridState[gridId].search = input.value;
            renderCards(gridId);
        });
    }

    function setupMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navLinksEl = document.getElementById('navLinks');
        if (!menuToggle || !navLinksEl) return;

        function closeMenu() {
            navLinksEl.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }

        menuToggle.addEventListener('click', () => {
            navLinksEl.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', String(navLinksEl.classList.contains('active')));
        });

        navLinksEl.addEventListener('click', event => {
            if (event.target.closest('a')) closeMenu();
        });
    }

    function setupModals() {
        const modalCadastro = document.getElementById('modalCadastro');
        const modalLogin = document.getElementById('modalLogin');
        const modalInteresse = document.getElementById('modalInteresse');
        const formCadastro = document.getElementById('formCadastro');
        const formLogin = document.getElementById('formLogin');
        const formInteresse = document.getElementById('formInteresse');

        function openModal(modal) {
            if (!modal) return;
            if (typeof modal.showModal === 'function' && !modal.open) modal.showModal();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modal) {
            if (!modal) return;
            if (typeof modal.close === 'function' && modal.open) modal.close();
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }

        window.addEventListener('click', event => {
            if (event.target === modalCadastro) closeModal(modalCadastro);
            if (event.target === modalLogin) closeModal(modalLogin);
            if (event.target === modalInteresse) closeModal(modalInteresse);
        });

        document.getElementById('closeCadastroModal')?.addEventListener('click', () => closeModal(modalCadastro));
        document.getElementById('closeLoginModal')?.addEventListener('click', () => closeModal(modalLogin));
        document.getElementById('closeInteresseModal')?.addEventListener('click', () => closeModal(modalInteresse));

        formCadastro?.addEventListener('submit', event => {
            event.preventDefault();
            showToast('Cadastro simulado para o teste do projeto.');
            closeModal(modalCadastro);
            formCadastro.reset();
        });

        formLogin?.addEventListener('submit', event => {
            event.preventDefault();
            showToast('Login simulado para o teste do projeto.');
            closeModal(modalLogin);
            formLogin.reset();
        });

        formInteresse?.addEventListener('submit', event => {
            event.preventDefault();
            showToast('Sugestão recebida para avaliação do projeto.');
            closeModal(modalInteresse);
            formInteresse.reset();
        });

        document.querySelectorAll('#precisoHeader, #precisoMenu').forEach(btn => {
            btn.addEventListener('click', event => {
                event.preventDefault();
                const title = document.querySelector('#modalInteresse h2');
                if (title) title.innerText = 'Indicar ponto de doação';
                openModal(modalInteresse);
            });
        });

        document.getElementById('linkLogin')?.addEventListener('click', event => {
            event.preventDefault();
            closeModal(modalCadastro);
            openModal(modalLogin);
        });

        document.getElementById('linkCadastroFromLogin')?.addEventListener('click', event => {
            event.preventDefault();
            closeModal(modalLogin);
            openModal(modalCadastro);
        });

        document.getElementById('linkEsqueciSenha')?.addEventListener('click', event => {
            event.preventDefault();
            showToast('Recuperação de senha simulada para apresentação.');
        });
    }

    function setupNavigation() {
        const destaquesSection = document.getElementById('destaquesSection');
        const allSection = document.getElementById('allDonationsSection');

        function scrollToPoints() {
            destaquesSection?.scrollIntoView({ behavior: 'smooth' });
        }

        function showAllDonations() {
            if (!destaquesSection || !allSection) return;
            destaquesSection.style.display = 'none';
            allSection.style.display = 'block';
            const ctaParent = document.querySelector('.cta-section')?.parentElement;
            if (ctaParent) ctaParent.style.display = 'none';
            allSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function showDestaques() {
            if (!destaquesSection || !allSection) return;
            destaquesSection.style.display = 'block';
            allSection.style.display = 'none';
            const ctaParent = document.querySelector('.cta-section')?.parentElement;
            if (ctaParent) ctaParent.style.display = 'block';
            destaquesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        document.querySelectorAll('#queroDoarHeader, #queroDoarMenu, #queroDoarHero, #verNecessidadesBtn, #criarContaBtn').forEach(btn => {
            btn.addEventListener('click', event => {
                event.preventDefault();
                scrollToPoints();
            });
        });

        document.getElementById('verTodasDoacoesBtn')?.addEventListener('click', event => { event.preventDefault(); showAllDonations(); });
        document.getElementById('backToDestaquesBtn')?.addEventListener('click', event => { event.preventDefault(); showDestaques(); });
        document.getElementById('navDoacoesLink')?.addEventListener('click', event => { event.preventDefault(); showAllDonations(); });
        document.getElementById('footerDoacoesLink')?.addEventListener('click', event => { event.preventDefault(); showAllDonations(); });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(event) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#0') return;
                const target = document.querySelector(href);
                if (target) {
                    event.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    function setupDarkMode() {
        const darkToggle = document.getElementById('darkToggle');
        const darkToggle2 = document.getElementById('darkToggle2');
        const body = document.body;

        function setIcons(isDark) {
            const icon = isDark ? 'fa-sun' : 'fa-moon';
            [darkToggle, darkToggle2].forEach(btn => {
                if (btn) btn.querySelector('i').className = 'fas ' + icon;
            });
        }

        function toggleDarkMode() {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark ? '1' : '0');
            setIcons(isDark);
            showToast(isDark ? 'Modo escuro ativado' : 'Modo claro ativado');
        }

        darkToggle?.addEventListener('click', toggleDarkMode);
        darkToggle2?.addEventListener('click', toggleDarkMode);

        if (localStorage.getItem('darkMode') === '1') {
            body.classList.add('dark-mode');
            setIcons(true);
        }
    }

    function setupSmallInteractions() {
        document.getElementById('btnLogout')?.addEventListener('click', event => {
            event.preventDefault();
            document.getElementById('navButtons')?.classList.remove('hidden');
            document.getElementById('navUser')?.classList.add('hidden');
            showToast('Você saiu da conta.');
        });
    }

    async function init() {
        await loadDonationPoints();
        renderCards('cardsGrid');
        renderCards('allCardsGrid');
        renderTestimonials();
        setupFilters('.donations-section .filter-tab', 'cardsGrid');
        setupFilters('#allFilterTabs .filter-tab', 'allCardsGrid');
        setupSearch('quickPointSearch', 'cardsGrid');
        setupSearch('allPointSearch', 'allCardsGrid');
        updateStats();
        setupMenu();
        setupModals();
        setupNavigation();
        setupDarkMode();
        setupSmallInteractions();
        console.log('Doaconnect - pontos carregados e interface pronta.');
    }

    init();
})();