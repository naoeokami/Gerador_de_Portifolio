// ========================================
// MÓDULO DE AUTENTICAÇÃO COM SUPABASE
// O cliente Supabase é acessado via window.supabase
// ========================================

/**
 * Função para registrar um novo usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @param {string} name - Nome do usuário
 * @returns {Promise} - Retorna o resultado da operação
 */
async function signUp(email, password, name) {
    try {
        // Validar se as senhas coincidem
        const confirmPassword = document.getElementById('confirmar_senha')?.value;
        if (password !== confirmPassword) {
            throw new Error('As senhas não coincidem!');
        }

        // Criar o usuário no Supabase
        const { data, error } = await window.supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name
                }
            }
        });

        if (error) {
            throw error;
        }

        // Mostrar mensagem de sucesso
        showMessage('Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.', 'success');
        
        // Limpar o formulário
        document.querySelector('form').reset();
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);

        return data;
    } catch (error) {
        console.error('Erro ao cadastrar:', error.message);
        showMessage('Erro ao cadastrar: ' + error.message, 'error');
        throw error;
    }
}

/**
 * Função para fazer login
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise} - Retorna o resultado da operação
 */
async function signIn(email, password) {
    try {
        const { data, error } = await window.supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            throw error;
        }

        // Mostrar mensagem de sucesso
        showMessage('Login realizado com sucesso!', 'success');
        
        // Redirecionar para a página home após 1 segundo
        setTimeout(() => {
            window.location.href = 'pages/home.html';
        }, 1000);

        return data;
    } catch (error) {
        console.error('Erro ao fazer login:', error.message);
        showMessage('Erro ao fazer login: ' + error.message, 'error');
        throw error;
    }
}

/**
 * Função para fazer logout
 * @returns {Promise} - Retorna o resultado da operação
 */
async function signOut() {
    try {
        const { error } = await window.supabase.auth.signOut();

        if (error) {
            throw error;
        }

        // Redirecionar para login
        window.location.href = '../index.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error.message);
        showMessage('Erro ao fazer logout: ' + error.message, 'error');
    }
}

/**
 * Função para obter o usuário atual
 * @returns {Promise} - Retorna os dados do usuário
 */
async function getCurrentUser() {
    try {
        const { data: { user }, error } = await window.supabase.auth.getUser();

        if (error) {
            throw error;
        }

        return user;
    } catch (error) {
        console.error('Erro ao obter usuário atual:', error.message);
        return null;
    }
}

/**
 * Função para verificar se o usuário está autenticado
 * @returns {Promise} - Retorna true se autenticado, false caso contrário
 */
async function isAuthenticated() {
    const user = await getCurrentUser();
    return user !== null;
}

/**
 * Função para exibir mensagens ao usuário
 * @param {string} message - Mensagem a exibir
 * @param {string} type - Tipo de mensagem ('success', 'error', 'info')
 */
function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('mensagem');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `mensagem mensagem-${type}`;
        messageDiv.style.display = 'block';
        
        // Esconder a mensagem após 5 segundos
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

/**
 * Função para verificar autenticação ao carregar a página
 * Redireciona para login se o usuário não estiver autenticado
 */
async function checkAuth() {
    // Só verifica se o supabase está carregado
    if (typeof window.supabase === 'undefined' || !window.supabase.auth) {
        return; // Sai se o supabase não estiver pronto
    }
    
    const user = await getCurrentUser();
    
    // Se não estiver autenticado e não estiver na página de login/cadastro, redirecionar
    const currentPage = window.location.pathname;
    const isLoginPage = currentPage.includes('index.html') || currentPage.endsWith('/');
    const isCadastroPage = currentPage.includes('cadastro.html');
    
    if (!user && !isLoginPage && !isCadastroPage) {
        window.location.href = '../index.html';
    }
}

// Exportar funções para uso global
window.signUp = signUp;
window.signIn = signIn;
window.signOut = signOut;
window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;
window.checkAuth = checkAuth;

