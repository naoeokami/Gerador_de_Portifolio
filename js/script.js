// ========================================
// SCRIPT PRINCIPAL DO PROJETO
// ========================================

// Controle do menu lateral
const hamburgerBtn = document.getElementById('hamburgerBtn');
const closeBtn = document.getElementById('closeBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileNav = document.getElementById('mobileNav');

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openMobileMenu);
}
if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileMenu);
}
if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

function openMobileMenu() {
    if (mobileNav) mobileNav.classList.add('active');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    if (mobileNav) mobileNav.classList.remove('active');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Fechar menu ao clicar em um link
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// ========================================
// AUTENTICAÇÃO - LOGIN
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    // Verificar se estamos na página de login
    const loginForm = document.querySelector('.login_main form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email')?.value;
            const senha = document.getElementById('senha')?.value;
            
            if (!email || !senha) {
                alert('Por favor, preencha todos os campos');
                return;
            }
            
            // Chamar a função de login do módulo auth.js
            if (window.signIn) {
                await window.signIn(email, senha);
            } else {
                alert('Erro: Módulo de autenticação não carregado');
            }
        });
    }

    // Verificar se estamos na página de cadastro
    const cadastroForm = document.querySelector('.login_main form');
    if (cadastroForm && window.location.pathname.includes('cadastro')) {
        cadastroForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name')?.value;
            const email = document.getElementById('email')?.value;
            const senha = document.getElementById('senha')?.value;
            
            if (!name || !email || !senha) {
                alert('Por favor, preencha todos os campos');
                return;
            }
            
            // Chamar a função de cadastro do módulo auth.js
            if (window.signUp) {
                await window.signUp(email, senha, name);
            } else {
                alert('Erro: Módulo de autenticação não carregado');
            }
        });
    }

    // ========================================
    // PORTFÓLIO - CRIAR/EDITAR
    // ========================================

    // Verificar se estamos na página de criar portfólio
    const portfolioForm = document.getElementById('portfolio-form');
    if (portfolioForm) {
        // Configurar tags
        setupTags('conhecimento-input', 'conhecimentos-list');
        setupTags('habilidade-input', 'habilidades-list');

        // Configurar campos dinâmicos
        setupDynamicFields('experiencias-container', 'add-experiencia-btn', {
            className: 'experiencia-item',
            html: `
                <div class="form-row">
                    <div class="form-group">
                        <label>Cargo *</label>
                        <input type="text" name="cargo[]" required class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Empresa *</label>
                        <input type="text" name="empresa[]" required class="form-input">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Data de Início</label>
                        <input type="month" name="inicio[]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Data de Término</label>
                        <input type="month" name="fim[]" class="form-input">
                    </div>
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea name="descricao_exp[]" rows="3" class="form-textarea" placeholder="Descreva suas responsabilidades e conquistas..."></textarea>
                </div>
                <button type="button" class="remove-item btn-remove">Remover</button>
            `
        });

        setupDynamicFields('formacao-container', 'add-formacao-btn', {
            className: 'formacao-item',
            html: `
                <div class="form-row">
                    <div class="form-group">
                        <label>Curso *</label>
                        <input type="text" name="curso[]" required class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Instituição *</label>
                        <input type="text" name="instituicao[]" required class="form-input">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Data de Início</label>
                        <input type="month" name="inicio_curso[]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Data de Conclusão</label>
                        <input type="month" name="fim_curso[]" class="form-input">
                    </div>
                </div>
                <button type="button" class="remove-item btn-remove">Remover</button>
            `
        });

        setupDynamicFields('trabalhos-container', 'add-trabalho-btn', {
            className: 'trabalho-item',
            html: `
                <div class="form-row">
                    <div class="form-group">
                        <label>Título do Trabalho *</label>
                        <input type="text" name="titulo_trabalho[]" required class="form-input">
                    </div>
                    <div class="form-group">
                        <label>URL *</label>
                        <input type="url" name="url_trabalho[]" required class="form-input" placeholder="https://...">
                    </div>
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea name="descricao_trabalho[]" rows="2" class="form-textarea" placeholder="Breve descrição do trabalho..."></textarea>
                </div>
                <button type="button" class="remove-item btn-remove">Remover</button>
            `
        });

        // Adicionar evento de submit ao formulário
        portfolioForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (window.savePortfolio) {
                await window.savePortfolio();
            } else {
                alert('Erro: Módulo de portfólio não carregado');
            }
        });

        // Adicionar evento ao botão Cancelar
        const btnCancelar = document.querySelector('.btn-secondary');
        if (btnCancelar) {
            btnCancelar.addEventListener('click', function() {
                window.location.href = 'home.html';
            });
        }
    }

    // ========================================
    // PÁGINA EXPLORAR - LISTAR PORTFÓLIOS
    // ========================================

    const portfolioGrid = document.getElementById('portfolio-grid');
    if (portfolioGrid) {
        // Limpar os cards de exemplo
        portfolioGrid.innerHTML = '';
        
        // Carregar portfólios do banco de dados
        loadPortfolios();
    }

    // ========================================
    // ANIMAÇÃO DE ENTRADA DOS CARDS
    // ========================================

    const cards = document.querySelectorAll('.portfolio-card');
    if (cards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
});

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

// Tags System
function setupTags(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    
    if (!input || !list) return;
    
    const addBtn = input.nextElementSibling;

    function addTag() {
        const value = input.value.trim();
        if (value) {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.innerHTML = `
                ${value}
                <span class="remove-tag">&times;</span>
                <input type="hidden" name="${inputId.replace('-input', '')}[]" value="${value}">
            `;
            list.appendChild(tag);
            input.value = '';

            tag.querySelector('.remove-tag').addEventListener('click', () => {
                tag.remove();
            });
        }
    }

    if (addBtn) {
        addBtn.addEventListener('click', addTag);
    }
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    });
}

// Dynamic Fields
function setupDynamicFields(containerId, addBtnClass, itemTemplate) {
    const container = document.getElementById(containerId);
    const addBtn = document.querySelector(`.${addBtnClass}`);

    if (!container || !addBtn) return;

    addBtn.addEventListener('click', () => {
        const newItem = document.createElement('div');
        newItem.className = itemTemplate.className;
        newItem.innerHTML = itemTemplate.html;
        container.appendChild(newItem);

        // Add remove functionality
        const removeBtn = newItem.querySelector('.remove-item');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                newItem.remove();
            });
        }
    });

    // Add remove to first item
    const firstRemoveBtn = container.querySelector('.remove-item');
    if (firstRemoveBtn) {
        firstRemoveBtn.addEventListener('click', function () {
            if (container.children.length > 1) {
                this.closest(`.${itemTemplate.className}`).remove();
            }
        });
    }
}

// ========================================
// CARREGAR E EXIBIR PORTFÓLIOS NA PÁGINA EXPLORAR
// ========================================

async function loadPortfolios() {
    try {
        const portfolios = await window.getAllPortfolios();
        const portfolioGrid = document.getElementById('portfolio-grid');
        
        if (!portfolioGrid) return;

        if (portfolios.length === 0) {
            portfolioGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px;">Nenhum portfólio encontrado.</p>';
            return;
        }

        // Limpar grid
        portfolioGrid.innerHTML = '';

        // Criar cards para cada portfólio
        portfolios.forEach(portfolio => {
            const data = portfolio.data;
            if (!data) return;

            const card = document.createElement('div');
            card.className = 'portfolio-card';
            
            // Limitar tags a 3
            const tags = (data.habilidades || []).slice(0, 3);
            const tagsHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');

            card.innerHTML = `
                <div class="portfolio-header">
                    <div class="portfolio-avatar"></div>
                    <div class="portfolio-info">
                        <h3>${data.nome || 'Sem nome'}</h3>
                        <p>${data.profissao || 'Profissão não informada'}</p>
                    </div>
                </div>
                <div class="portfolio-tags">
                    ${tagsHTML}
                </div>
                <p class="portfolio-desc">${(data.sobre || '').substring(0, 100)}...</p>
                <button class="btn-visualizar" onclick="visualizarPortfolio('${portfolio.id}')">Visualizar Portfólio</button>
            `;

            portfolioGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Erro ao carregar portfólios:', error);
        const portfolioGrid = document.getElementById('portfolio-grid');
        if (portfolioGrid) {
            portfolioGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: red;">Erro ao carregar portfólios.</p>';
        }
    }
}

// Função para visualizar um portfólio específíco
function visualizarPortfolio(portfolioId) {
    // Redirecionar para a página de visualização com o ID do portfólio
    window.location.href = `visualizar-portfolio.html?id=${portfolioId}`;
}

// Filtros
const btnFiltrar = document.querySelector('.btn-filtrar');
if (btnFiltrar) {
    btnFiltrar.addEventListener('click', function () {
        const habilidade = document.getElementById('habilidade')?.value || '';
        const ordenar = document.getElementById('ordenar')?.value || 'recentes';
        
        // Recarregar portfólios com filtros
        if (window.getAllPortfolios) {
            (async () => {
                const portfolios = await window.getAllPortfolios({ habilidade, ordenar });
                const portfolioGrid = document.getElementById('portfolio-grid');
                
                if (portfolioGrid) {
                    portfolioGrid.innerHTML = '';
                    portfolios.forEach(portfolio => {
                        const data = portfolio.data;
                        if (!data) return;

                        const card = document.createElement('div');
                        card.className = 'portfolio-card';
                        
                        const tags = (data.habilidades || []).slice(0, 3);
                        const tagsHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');

                        card.innerHTML = `
                            <div class="portfolio-header">
                                <div class="portfolio-avatar"></div>
                                <div class="portfolio-info">
                                    <h3>${data.nome || 'Sem nome'}</h3>
                                    <p>${data.profissao || 'Profissão não informada'}</p>
                                </div>
                            </div>
                            <div class="portfolio-tags">
                                ${tagsHTML}
                            </div>
                            <p class="portfolio-desc">${(data.sobre || '').substring(0, 100)}...</p>
                            <button class="btn-visualizar" onclick="visualizarPortfolio('${portfolio.id}')">Visualizar Portfólio</button>
                        `;

                        portfolioGrid.appendChild(card);
                    });
                }
            })();
        }
    });
}

// Visualizar Portfólio
document.querySelectorAll('.btn-visualizar').forEach(btn => {
    btn.addEventListener('click', function () {
        alert('Abrindo portfólio...');
    });
});

