// ========================================
// MÓDULO DE GERENCIAMENTO DE PORTFÓLIO (LOCAL / DEMONSTRAÇÃO)
// Armazena portfólios em localStorage ('foliolabs_portfolios')
// ========================================

/**
 * Função auxiliar para buscar os portfólios no localStorage
 */
function getPortfoliosFromStorage() {
    try {
        const json = localStorage.getItem('foliolabs_portfolios');
        return json ? JSON.parse(json) : [];
    } catch (e) {
        console.error('Erro ao ler portfólios do localStorage:', e);
        return [];
    }
}

/**
 * Função auxiliar para salvar os portfólios no localStorage
 */
function savePortfoliosToStorage(portfolios) {
    try {
        localStorage.setItem('foliolabs_portfolios', JSON.stringify(portfolios));
    } catch (e) {
        console.error('Erro ao salvar portfólios no localStorage:', e);
    }
}

/**
 * Função para converter um arquivo de imagem em Data URL (Base64)
 */
function convertFileToDataURL(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
}

/**
 * Função para coletar dados do formulário de portfólio
 */
function collectPortfolioData() {
    const form = document.querySelector('.portfolio-form');
    
    if (!form) {
        console.error('Formulário de portfólio não encontrado');
        return null;
    }

    const templateChoice = document.querySelector('input[name="template"]:checked')?.value || 'template1';
    const profileImageInput = document.getElementById('profile-image-upload');
    const profileImageFile = profileImageInput?.files[0];
    const existingImageUrl = document.getElementById('profile-image-url')?.value || '';

    const portfolioData = {
        template: templateChoice,
        nome: document.getElementById('nome')?.value || '',
        profissao: document.getElementById('profissao')?.value || '',
        sobre: document.getElementById('sobre')?.value || '',
        email: document.getElementById('email')?.value || '',
        telefone: document.getElementById('telefone')?.value || '',
        linkedin: document.getElementById('linkedin')?.value || '',
        
        profile_image_file: profileImageFile,
        profile_image_url: existingImageUrl,
        
        conhecimentos: Array.from(document.querySelectorAll('#conhecimentos-list .tag')).map(tag => {
            return tag.textContent.replace('×', '').trim();
        }),
        
        habilidades: Array.from(document.querySelectorAll('#habilidades-list .tag')).map(tag => {
            return tag.textContent.replace('×', '').trim();
        }),
        
        experiencias: Array.from(document.querySelectorAll('.experiencia-item')).map(item => {
            return {
                cargo: item.querySelector('input[name="cargo[]"]')?.value || '',
                empresa: item.querySelector('input[name="empresa[]"]')?.value || '',
                inicio: item.querySelector('input[name="inicio[]"]')?.value || '',
                fim: item.querySelector('input[name="fim[]"]')?.value || '',
                descricao: item.querySelector('textarea[name="descricao_exp[]"]')?.value || ''
            };
        }),
        
        formacoes: Array.from(document.querySelectorAll('.formacao-item')).map(item => {
            return {
                curso: item.querySelector('input[name="curso[]"]')?.value || '',
                instituicao: item.querySelector('input[name="instituicao[]"]')?.value || '',
                inicio: item.querySelector('input[name="inicio_curso[]"]')?.value || '',
                fim: item.querySelector('input[name="fim_curso[]"]')?.value || ''
            };
        }),
        
        trabalhos: Array.from(document.querySelectorAll('.trabalho-item')).map(item => {
            return {
                titulo: item.querySelector('input[name="titulo_trabalho[]"]')?.value || '',
                url: item.querySelector('input[name="url_trabalho[]"]')?.value || '',
                descricao: item.querySelector('textarea[name="descricao_trabalho[]"]')?.value || ''
            };
        }),
        
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
    };

    return portfolioData;
}

/**
 * Função para preencher o formulário com dados de portfólio
 */
function loadPortfolioDataToForm(portfolioData) {
    if (!portfolioData) return;

    const fillField = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.value = value || '';
        }
    };

    fillField('nome', portfolioData.nome);
    fillField('profissao', portfolioData.profissao);
    fillField('sobre', portfolioData.sobre);
    fillField('email', portfolioData.email);
    fillField('telefone', portfolioData.telefone);
    fillField('linkedin', portfolioData.linkedin);

    const imageUrlInput = document.getElementById('profile-image-url');
    if (imageUrlInput) {
        imageUrlInput.value = portfolioData.profile_image_url || '';
    }

    const currentImageDiv = document.getElementById('current-profile-image');
    if (currentImageDiv && portfolioData.profile_image_url) {
        currentImageDiv.innerHTML = `
            <p>Imagem Atual:</p>
            <img src="${portfolioData.profile_image_url}" alt="Foto de Perfil Atual" style="max-width: 150px; height: auto; border-radius: 50%; object-fit: cover;">
        `;
    } else if (currentImageDiv) {
        currentImageDiv.innerHTML = '';
    }

    const templateRadio = document.querySelector(`input[name="template"][value="${portfolioData.template}"]`);
    if (templateRadio) {
        templateRadio.checked = true;
    }

    const conocimientosList = document.getElementById('conhecimentos-list');
    const habilidadesList = document.getElementById('habilidades-list');
    if (conhecimentosList) conhecimentosList.innerHTML = '';
    if (habilidadesList) habilidadesList.innerHTML = '';

    (portfolioData.conhecimentos || []).forEach(c => {
        if (window.addTag) window.addTag('conhecimentos-list', c);
    });

    (portfolioData.habilidades || []).forEach(h => {
        if (window.addTag) window.addTag('habilidades-list', h);
    });
}

/**
 * Função para salvar o portfólio em localStorage
 */
async function savePortfolio() {
    try {
        const user = await window.getCurrentUser();
        if (!user) {
            throw new Error('Você precisa estar autenticado para salvar um portfólio');
        }

        const portfolioData = collectPortfolioData();
        if (!portfolioData) {
            throw new Error('Erro ao coletar dados do portfólio');
        }

        if (!portfolioData.nome || !portfolioData.profissao || !portfolioData.sobre) {
            throw new Error('Por favor, preencha todos os campos obrigatórios');
        }

        let imageUrl = portfolioData.profile_image_url;
        if (portfolioData.profile_image_file) {
            try {
                const dataUrl = await convertFileToDataURL(portfolioData.profile_image_file);
                if (dataUrl) imageUrl = dataUrl;
            } catch (err) {
                console.error('Erro ao converter foto em DataURL:', err);
            }
        }

        delete portfolioData.profile_image_file;
        portfolioData.profile_image_url = imageUrl;

        const portfolios = getPortfoliosFromStorage();
        const existingIndex = portfolios.findIndex(p => p.user_id === user.id);

        let savedPortfolio;
        if (existingIndex !== -1) {
            portfolios[existingIndex].data = portfolioData;
            portfolios[existingIndex].updated_at = new Date().toISOString();
            savedPortfolio = portfolios[existingIndex];
            showMessage('Portfólio atualizado com sucesso!', 'success');
        } else {
            savedPortfolio = {
                id: 'port_' + Date.now(),
                user_id: user.id,
                created_at: new Date().toISOString(),
                data: portfolioData
            };
            portfolios.push(savedPortfolio);
            showMessage('Portfólio criado com sucesso!', 'success');
        }

        savePortfoliosToStorage(portfolios);

        const homePath = window.location.pathname.includes('/pages/') ? 'home.html' : 'pages/home.html';
        setTimeout(() => {
            window.location.href = homePath;
        }, 1500);

        return savedPortfolio;
    } catch (error) {
        console.error('Erro ao salvar portfólio:', error.message);
        showMessage('Erro ao salvar portfólio: ' + error.message, 'error');
        throw error;
    }
}

/**
 * Função para recuperar o portfólio do usuário atual
 */
async function getMyPortfolio() {
    try {
        const user = await window.getCurrentUser();
        if (!user) return null;

        const portfolios = getPortfoliosFromStorage();
        return portfolios.find(p => p.user_id === user.id) || null;
    } catch (error) {
        console.error('Erro ao recuperar portfólio:', error.message);
        return null;
    }
}

/**
 * Função para listar todos os portfólios (para a página "Explorar")
 */
async function getAllPortfolios(filters = {}) {
    try {
        let portfolios = getPortfoliosFromStorage().filter(p => p && p.data);

        if (filters.nomePessoa) {
            const term = filters.nomePessoa.toLowerCase();
            portfolios = portfolios.filter(p => (p.data.nome || '').toLowerCase().includes(term));
        }

        if (filters.habilidade) {
            const hab = filters.habilidade.toLowerCase();
            portfolios = portfolios.filter(p => 
                (p.data.habilidades || []).some(h => h.toLowerCase().includes(hab)) ||
                (p.data.conhecimentos || []).some(c => c.toLowerCase().includes(hab))
            );
        }

        if (filters.ordenar === 'antigos') {
            portfolios.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else if (filters.ordenar === 'nome') {
            portfolios.sort((a, b) => (a.data.nome || '').localeCompare(b.data.nome || ''));
        } else {
            portfolios.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        return portfolios;
    } catch (error) {
        console.error('Erro ao listar portfólios:', error.message);
        return [];
    }
}

/**
 * Função para obter um portfólio específico pelo ID
 */
async function getPortfolioById(portfolioId) {
    try {
        const portfolios = getPortfoliosFromStorage();
        return portfolios.find(p => p.id === portfolioId) || null;
    } catch (error) {
        console.error('Erro ao recuperar portfólio por ID:', error.message);
        return null;
    }
}

/**
 * Função para deletar um portfólio
 */
async function deletePortfolio(portfolioId) {
    try {
        let portfolios = getPortfoliosFromStorage();
        portfolios = portfolios.filter(p => p.id !== portfolioId);
        savePortfoliosToStorage(portfolios);
        showMessage('Portfólio deletado com sucesso!', 'success');
        return true;
    } catch (e) {
        console.error('Exceção ao deletar o portfólio:', e);
        return false;
    }
}

/**
 * Exibir mensagem
 */
function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('mensagem') || document.querySelector('.mensagem');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `mensagem mensagem-${type}`;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

// Exportar funções para uso global
window.savePortfolio = savePortfolio;
window.getMyPortfolio = getMyPortfolio;
window.getAllPortfolios = getAllPortfolios;
window.getPortfolioById = getPortfolioById;
window.deletePortfolio = deletePortfolio;
window.collectPortfolioData = collectPortfolioData;
window.loadPortfolioDataToForm = loadPortfolioDataToForm;
