// ========================================
// MÓDULO DE GERENCIAMENTO DE PORTFÓLIO
// O cliente Supabase é acessado via window.supabase
// ========================================

/**
 * Função para coletar dados do formulário de portfólio
 * @returns {Object} - Objeto com os dados do portfólio
 */
function collectPortfolioData() {
    const form = document.querySelector('.portfolio-form');
    
    if (!form) {
        console.error('Formulário de portfólio não encontrado');
        return null;
    }

    // Coletar a escolha do template
    const templateChoice = document.querySelector('input[name="template"]:checked')?.value || 'template1';

    // Coletar informações pessoais
    const portfolioData = {
        template: templateChoice,
        nome: document.getElementById('nome')?.value || '',
        profissao: document.getElementById('profissao')?.value || '',
        sobre: document.getElementById('sobre')?.value || '',
        email: document.getElementById('email')?.value || '',
        telefone: document.getElementById('telefone')?.value || '',
        linkedin: document.getElementById('linkedin')?.value || '',
        
        // Coletar conhecimentos (tags)
        conhecimentos: Array.from(document.querySelectorAll('#conhecimentos-list .tag')).map(tag => {
            return tag.textContent.replace('×', '').trim();
        }),
        
        // Coletar habilidades (tags)
        habilidades: Array.from(document.querySelectorAll('#habilidades-list .tag')).map(tag => {
            return tag.textContent.replace('×', '').trim();
        }),
        
        // Coletar experiências
        experiencias: Array.from(document.querySelectorAll('.experiencia-item')).map(item => {
            return {
                cargo: item.querySelector('input[name="cargo[]"]')?.value || '',
                empresa: item.querySelector('input[name="empresa[]"]')?.value || '',
                inicio: item.querySelector('input[name="inicio[]"]')?.value || '',
                fim: item.querySelector('input[name="fim[]"]')?.value || '',
                descricao: item.querySelector('textarea[name="descricao_exp[]"]')?.value || ''
            };
        }),
        
        // Coletar formações
        formacoes: Array.from(document.querySelectorAll('.formacao-item')).map(item => {
            return {
                curso: item.querySelector('input[name="curso[]"]')?.value || '',
                instituicao: item.querySelector('input[name="instituicao[]"]')?.value || '',
                inicio: item.querySelector('input[name="inicio_curso[]"]')?.value || '',
                fim: item.querySelector('input[name="fim_curso[]"]')?.value || ''
            };
        }),
        
        // Coletar trabalhos
        trabalhos: Array.from(document.querySelectorAll('.trabalho-item')).map(item => {
            return {
                titulo: item.querySelector('input[name="titulo_trabalho[]"]')?.value || '',
                url: item.querySelector('input[name="url_trabalho[]"]')?.value || '',
                descricao: item.querySelector('textarea[name="descricao_trabalho[]"]')?.value || ''
            };
        }),
        
        // Timestamp
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
    };

    return portfolioData;
}

/**
 * Função para salvar o portfólio no Supabase
 * @returns {Promise} - Retorna o resultado da operação
 */
async function savePortfolio() {
    try {
        // Verificar se o usuário está autenticado
        const user = await window.getCurrentUser();
        if (!user) {
            throw new Error('Você precisa estar autenticado para salvar um portfólio');
        }

        // Coletar dados do formulário
        const portfolioData = collectPortfolioData();
        if (!portfolioData) {
            throw new Error('Erro ao coletar dados do portfólio');
        }

        // Validar campos obrigatórios
        if (!portfolioData.nome || !portfolioData.profissao || !portfolioData.sobre) {
            throw new Error('Por favor, preencha todos os campos obrigatórios');
        }

        // Verificar se o usuário já tem um portfólio
        const { data: existingPortfolio, error: checkError } = await window.supabase
            .from('portfolios')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle(); // Usar maybeSingle para retornar null se não encontrar

        let result;

        if (existingPortfolio) {
            // Atualizar portfólio existente
            const { data, error } = await window.supabase
                .from('portfolios')
                .update({ data: portfolioData })
                .eq('user_id', user.id)
                .select();

            if (error) throw error;
            result = data;
            showMessage('Portfólio atualizado com sucesso!', 'success');
        } else {
            // Criar novo portfólio
            const { data, error } = await window.supabase
                .from('portfolios')
                .insert([
                    {
                        user_id: user.id,
                        data: portfolioData
                    }
                ])
                .select();

            if (error) throw error;
            result = data;
            showMessage('Portfólio criado com sucesso!', 'success');
        }

        // Redirecionar para home após 2 segundos
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 2000);

        return result;
    } catch (error) {
        console.error('Erro ao salvar portfólio:', error.message);
        showMessage('Erro ao salvar portfólio: ' + error.message, 'error');
        throw error;
    }
}

/**
 * Função para recuperar o portfólio do usuário atual
 * @returns {Promise} - Retorna os dados do portfólio
 */
async function getMyPortfolio() {
    try {
        const user = await window.getCurrentUser();
        if (!user) {
            throw new Error('Você precisa estar autenticado');
        }

        const { data, error } = await window.supabase
            .from('portfolios')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle(); // Usar maybeSingle para retornar null se não encontrar

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Erro ao recuperar portfólio:', error.message);
        return null;
    }
}

/**
 * Função para listar todos os portfólios (para a página "Explorar")
 * @param {Object} filters - Filtros opcionais (habilidade, ordenar, etc)
 * @returns {Promise} - Retorna lista de portfólios
 */
async function getAllPortfolios(filters = {}) {
    try {
        let query = window.supabase
            .from('portfolios')
            .select('*')
            .not('data', 'is', null); // Apenas portfólios com dados

        // Aplicar filtro de ordenação
        if (filters.ordenar === 'antigos') {
            query = query.order('created_at', { ascending: true });
        } else if (filters.ordenar === 'nome') {
            query = query.order('data->nome', { ascending: true });
        } else {
            query = query.order('created_at', { ascending: false }); // Padrão: recentes
        }

        const { data, error } = await query;

        if (error) throw error;

        // Filtrar por habilidade se fornecido
        if (filters.habilidade) {
            return data.filter(portfolio => {
                const habilidades = portfolio.data?.habilidades || [];
                return habilidades.some(h => 
                    h.toLowerCase().includes(filters.habilidade.toLowerCase())
                );
            });
        }

        return data || [];
    } catch (error) {
        console.error('Erro ao listar portfólios:', error.message);
        return [];
    }
}

/**
 * Função para obter um portfólio específico pelo ID
 * @param {string} portfolioId - ID do portfólio
 * @returns {Promise} - Retorna os dados do portfólio
 */
async function getPortfolioById(portfolioId) {
    try {
        const { data, error } = await window.supabase
            .from('portfolios')
            .select('*')
            .eq('id', portfolioId)
            .maybeSingle(); // Usar maybeSingle para retornar null se não encontrar

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Erro ao recuperar portfólio:', error.message);
        return null;
    }
}

/**
 * Função para deletar o portfólio do usuário
 * @returns {Promise} - Retorna o resultado da operação
 */
async function deletePortfolio() {
    try {
        const user = await window.getCurrentUser();
        if (!user) {
            throw new Error('Você precisa estar autenticado');
        }

        const { error } = await window.supabase
            .from('portfolios')
            .delete()
            .eq('user_id', user.id);

        if (error) throw error;

        showMessage('Portfólio deletado com sucesso!', 'success');
        return true;
    } catch (error) {
        console.error('Erro ao deletar portfólio:', error.message);
        showMessage('Erro ao deletar portfólio: ' + error.message, 'error');
        return false;
    }
}

/**
 * Função para exibir mensagens ao usuário
 * @param {string} message - Mensagem a exibir
 * @param {string} type - Tipo de mensagem ('success', 'error', 'info')
 */
function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('mensagem') || document.querySelector('.mensagem');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `mensagem mensagem-${type}`;
        messageDiv.style.display = 'block';
        
        // Esconder a mensagem após 5 segundos
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    } else {
        // Se não houver elemento de mensagem, usar alert
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

