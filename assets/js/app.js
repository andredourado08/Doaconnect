(function () {
    'use strict';

    const categoryMeta = {
        geral: { label: 'Geral', icon: 'fa-hand-holding-heart' },
        roupas: { label: 'Roupas', icon: 'fa-shirt' },
        alimentos: { label: 'Alimentos', icon: 'fa-basket-shopping' },
        higiene: { label: 'Higiene', icon: 'fa-pump-soap' },
        brinquedos: { label: 'Brinquedos', icon: 'fa-puzzle-piece' },
        saude: { label: 'Saúde', icon: 'fa-kit-medical' },
        moveis: { label: 'Móveis', icon: 'fa-couch' }
    };

    const donationsData = Array.isArray(window.DOACONNECT_DONATION_POINTS)
        ? window.DOACONNECT_DONATION_POINTS
        : [];

    const state = { filter: 'todas', search: '' };

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>'"]/g, (character) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        })[character]);
    }

    function normalizeText(value) {
        return String(value ?? '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }

    function getFilteredItems() {
        const query = normalizeText(state.search).trim();
        return donationsData.filter((item) => {
            const categories = item.categories || [item.type];
            if (state.filter !== 'todas' && !categories.includes(state.filter)) return false;
            if (!query) return true;

            const searchable = [
                item.title,
                item.desc,
                item.location,
                item.address,
                item.hours,
                item.contact,
                ...(item.accepts || []),
                ...categories.map((category) => categoryMeta[category]?.label || category)
            ].join(' ');

            return normalizeText(searchable).includes(query);
        });
    }

    function extractPhones(contact) {
        return String(contact || '').match(/\(?\d{2}\)?\s?\d{4,5}-?\d{4}/g) || [];
    }

    function phoneDigits(phone) {
        return phone.replace(/\D/g, '');
    }

    function phoneActions(item) {
        const phones = extractPhones(item.contact);
        if (!phones.length) return '';

        const firstDigits = phoneDigits(phones[0]);
        const mobile = phones.find((phone) => {
            const digits = phoneDigits(phone);
            return digits.length === 11 && digits.charAt(2) === '9';
        });

        let actions = '<a class="btn-card contact" href="tel:+55' + firstDigits + '" aria-label="Ligar para ' + escapeHtml(item.title) + '"><i class="fas fa-phone" aria-hidden="true"></i> Ligar</a>';
        if (mobile) {
            const mobileDigits = phoneDigits(mobile);
            const message = encodeURIComponent('Olá! Encontrei o contato no Doaconnect e gostaria de confirmar os itens aceitos e o horário para doação.');
            actions += '<a class="btn-card whatsapp" href="https://wa.me/55' + mobileDigits + '?text=' + message + '" target="_blank" rel="noopener noreferrer" aria-label="Confirmar doação com ' + escapeHtml(item.title) + ' pelo WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i> WhatsApp</a>';
        }
        return actions;
    }

    function createCardElement(item) {
        const card = document.createElement('li');
        card.className = 'donation-card';
        const meta = categoryMeta[item.type] || categoryMeta.geral;
        const accepts = (item.accepts || []).map((label) => '<span>' + escapeHtml(label) + '</span>').join('');

        card.innerHTML =
            '<div class="card-badge">' +
                '<span class="badge-type offer"><i class="fas ' + escapeHtml(meta.icon) + '" aria-hidden="true"></i> ' + escapeHtml(meta.label) + '</span>' +
                '<span class="card-location"><i class="fas fa-location-dot" aria-hidden="true"></i> ' + escapeHtml(item.location) + '</span>' +
            '</div>' +
            '<h3>' + escapeHtml(item.title) + '</h3>' +
            '<p class="card-desc">' + escapeHtml(item.desc) + '</p>' +
            '<div class="point-info-list">' +
                '<span><i class="fas fa-map-pin" aria-hidden="true"></i> ' + escapeHtml(item.address) + '</span>' +
                '<span><i class="far fa-clock" aria-hidden="true"></i> ' + escapeHtml(item.hours) + '</span>' +
                '<span><i class="fas fa-phone" aria-hidden="true"></i> ' + escapeHtml(item.contact) + '</span>' +
                '<span><i class="fas fa-circle-check" aria-hidden="true"></i> Última verificação informada: ' + escapeHtml(item.lastChecked || 'não informada') + '</span>' +
            '</div>' +
            '<div class="accepts-list" aria-label="Itens aceitos">' + accepts + '</div>' +
            '<div class="card-contact-actions">' + phoneActions(item) + '</div>' +
            '<div class="card-footer">' +
                '<a href="' + escapeHtml(item.mapUrl) + '" target="_blank" rel="noopener noreferrer" class="btn-card primary"><i class="fas fa-route" aria-hidden="true"></i> Abrir rota</a>' +
                '<a href="' + escapeHtml(item.sourceUrl) + '" target="_blank" rel="noopener noreferrer" class="btn-card"><i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i> Fonte</a>' +
                '<button type="button" class="report-button" data-report-point="' + escapeHtml(item.id) + '"><i class="fas fa-flag" aria-hidden="true"></i> Reportar dados</button>' +
            '</div>';

        return card;
    }

    function updateFilterStatus(itemsCount) {
        const categoryLabel = state.filter === 'todas' ? '' : categoryMeta[state.filter]?.label || state.filter;
        const parts = [];
        if (categoryLabel) parts.push('categoria “' + categoryLabel + '”');
        if (state.search.trim()) parts.push('busca “' + state.search.trim() + '”');

        const activeFilterText = document.getElementById('activeFilterText');
        const clearButton = document.getElementById('clearFilters');
        const count = document.getElementById('cardsResultCount');

        if (activeFilterText) {
            activeFilterText.textContent = parts.length
                ? 'Filtros ativos: ' + parts.join(' + ') + '.'
                : 'Exibindo todos os pontos.';
        }
        if (clearButton) clearButton.hidden = parts.length === 0;
        if (count) count.textContent = itemsCount === 1 ? '1 ponto encontrado' : itemsCount + ' pontos encontrados';
    }

    function renderCards() {
        const grid = document.getElementById('cardsGrid');
        if (!grid) return;

        const items = getFilteredItems();
        grid.replaceChildren();
        updateFilterStatus(items.length);

        if (!items.length) {
            const empty = document.createElement('li');
            empty.className = 'empty-state';
            empty.innerHTML = '<i class="fas fa-magnifying-glass" aria-hidden="true"></i><strong>Nenhum ponto encontrado</strong><span>A busca está combinada com a categoria selecionada.</span><button type="button" class="btn btn-primary" data-clear-from-empty>Limpar filtros</button>';
            grid.appendChild(empty);
            return;
        }

        items.forEach((item) => grid.appendChild(createCardElement(item)));
    }

    function clearFilters() {
        state.filter = 'todas';
        state.search = '';

        const search = document.getElementById('pointSearch');
        if (search) search.value = '';
        document.querySelectorAll('.filter-tab').forEach((tab) => {
            const active = tab.dataset.filter === 'todas';
            tab.classList.toggle('active', active);
            tab.setAttribute('aria-pressed', String(active));
        });
        renderCards();
    }

    function setupFilters() {
        document.querySelectorAll('.filter-tab').forEach((tab) => {
            tab.addEventListener('click', () => {
                state.filter = tab.dataset.filter || 'todas';
                document.querySelectorAll('.filter-tab').forEach((button) => {
                    const active = button === tab;
                    button.classList.toggle('active', active);
                    button.setAttribute('aria-pressed', String(active));
                });
                renderCards();
            });
        });

        document.getElementById('pointSearch')?.addEventListener('input', (event) => {
            state.search = event.target.value;
            renderCards();
        });

        document.getElementById('clearFilters')?.addEventListener('click', clearFilters);
        document.getElementById('cardsGrid')?.addEventListener('click', (event) => {
            if (event.target.closest('[data-clear-from-empty]')) clearFilters();
        });
    }

    function updateStats() {
        const categories = new Set();
        const acceptedItems = new Set();

        donationsData.forEach((point) => {
            (point.categories || [point.type]).forEach((category) => {
                if (category !== 'geral') categories.add(category);
            });
            (point.accepts || []).forEach((item) => acceptedItems.add(normalizeText(item)));
        });

        const targets = {
            statDoacoes: donationsData.length,
            statCategorias: categories.size,
            statItens: acceptedItems.size
        };

        Object.entries(targets).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value.toLocaleString('pt-BR');
        });
    }

    function showToast(message) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        container.textContent = '';
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        window.setTimeout(() => toast.remove(), 3600);
    }

    function setupMenu() {
        const toggle = document.getElementById('menuToggle');
        const nav = document.getElementById('navLinks');
        if (!toggle || !nav) return;

        function closeMenu() {
            nav.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Abrir menu');
        }

        toggle.addEventListener('click', () => {
            const open = nav.classList.toggle('active');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        });
        nav.addEventListener('click', (event) => {
            if (event.target.closest('a, button')) closeMenu();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMenu();
        });
    }

    function setupDarkMode() {
        const toggle = document.getElementById('darkToggle');
        if (!toggle) return;

        function applyMode(isDark, announce) {
            document.body.classList.toggle('dark-mode', isDark);
            toggle.setAttribute('aria-pressed', String(isDark));
            toggle.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
            const icon = toggle.querySelector('i');
            if (icon) icon.className = 'fas ' + (isDark ? 'fa-sun' : 'fa-moon');
            if (announce) showToast(isDark ? 'Modo escuro ativado' : 'Modo claro ativado');
        }

        // Cada nova visita começa no modo claro.
        applyMode(false, false);

        toggle.addEventListener('click', () => {
            const isDark = !document.body.classList.contains('dark-mode');
            applyMode(isDark, true);
        });
    }

    function suggestionText(form) {
        const data = new FormData(form);
        return [
            'INDICAÇÃO PARA O DOACONNECT',
            '============================',
            'Tipo: ' + (data.get('tipo') === 'correcao' ? 'Correção de informação' : 'Novo ponto'),
            'Nome do local: ' + data.get('nome'),
            'Endereço e bairro: ' + data.get('endereco'),
            'Contato: ' + (data.get('contato') || 'Não informado'),
            'Fonte oficial: ' + (data.get('fonte') || 'Não informada'),
            'Itens aceitos: ' + data.get('itens'),
            'Observações: ' + (data.get('observacoes') || 'Nenhuma'),
            '',
            'Gerado localmente pelo formulário do Doaconnect em ' + new Date().toLocaleString('pt-BR') + '.',
            'Revise as informações antes de encaminhar à equipe do projeto.'
        ].join('\r\n');
    }

    function downloadSuggestion(form) {
        const blob = new Blob([suggestionText(form)], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const pointName = normalizeText(new FormData(form).get('nome')).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        link.href = url;
        link.download = 'indicacao-doaconnect-' + (pointName || 'ponto') + '.txt';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function setupSuggestionDialog() {
        const dialog = document.getElementById('suggestionDialog');
        const form = document.getElementById('suggestionForm');
        const title = document.getElementById('suggestionTitle');
        const type = document.getElementById('suggestionType');
        const pointName = document.getElementById('suggestionPointName');
        if (!dialog || !form) return;

        function openDialog(point) {
            form.reset();
            if (point) {
                type.value = 'correcao';
                pointName.value = point.title;
                title.textContent = 'Reportar informação desatualizada';
            } else {
                type.value = 'novo';
                title.textContent = 'Indicar ponto de doação';
            }
            dialog.showModal();
            window.setTimeout(() => pointName.focus(), 50);
        }

        document.querySelectorAll('[data-open-suggestion]').forEach((button) => {
            button.addEventListener('click', () => openDialog());
        });
        document.querySelectorAll('[data-close-dialog]').forEach((button) => {
            button.addEventListener('click', () => dialog.close());
        });
        document.getElementById('cardsGrid')?.addEventListener('click', (event) => {
            const report = event.target.closest('[data-report-point]');
            if (!report) return;
            const point = donationsData.find((item) => item.id === report.dataset.reportPoint);
            openDialog(point);
        });
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) dialog.close();
        });
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!form.reportValidity()) return;
            downloadSuggestion(form);
            dialog.close();
            showToast('Arquivo criado. Revise e encaminhe a indicação à equipe do projeto.');
        });
    }

    function addDonationPointsStructuredData() {
        if (!donationsData.length) return;
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Pontos de doação em São José do Rio Preto',
            numberOfItems: donationsData.length,
            itemListElement: donationsData.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Organization',
                    name: item.title,
                    description: item.desc,
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: item.address,
                        addressLocality: 'São José do Rio Preto',
                        addressRegion: 'SP',
                        addressCountry: 'BR'
                    },
                    telephone: item.contact,
                    url: item.sourceUrl
                }
            }))
        });
        document.head.appendChild(script);
    }

    function init() {
        renderCards();
        updateStats();
        setupFilters();
        setupMenu();
        setupDarkMode();
        setupSuggestionDialog();
        addDonationPointsStructuredData();
    }

    init();
})();
