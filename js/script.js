// Controle do menu lateral
const hamburgerBtn = document.getElementById('hamburgerBtn');
const closeBtn = document.getElementById('closeBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileNav = document.getElementById('mobileNav');

function openMobileMenu() {
    mobileNav.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileNav.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

hamburgerBtn.addEventListener('click', openMobileMenu);
closeBtn.addEventListener('click', closeMobileMenu);
mobileMenuOverlay.addEventListener('click', closeMobileMenu);

// Fechar menu ao clicar em um link
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Animação de entrada dos cards
document.addEventListener('DOMContentLoaded', function () {
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
});

// Tags System
function setupTags(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
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

    addBtn.addEventListener('click', addTag);
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

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Setup tags
    setupTags('conhecimento-input', 'conhecimentos-list');
    setupTags('habilidade-input', 'habilidades-list');

    // Setup dynamic fields
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
});

// Filtros
document.querySelector('.btn-filtrar').addEventListener('click', function () {
    // Lógica de filtro seria implementada aqui
    alert('Filtros aplicados!');
});

// Visualizar Portfólio
document.querySelectorAll('.btn-visualizar').forEach(btn => {
    btn.addEventListener('click', function () {
        // Lógica para visualizar portfólio
        alert('Abrindo portfólio...');
    });
});