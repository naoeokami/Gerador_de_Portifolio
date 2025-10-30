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
        const confirmPasswordElement = document.getElementById('confirmar_senha');
        const confirmPassword = confirmPasswordElement ? confirmPasswordElement.value : '';
        if (password !== confirmPassword) {
            throw new Error('As senhas não coincidem!');
        }

        // Verificar se o email já está cadastrado
        console.log('Verificando se o email já está cadastrado...');
        const { data: existingUsers, error: checkError } = await window.supabase
            .from('auth.users')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        // Como não temos acesso direto à tabela auth.users, vamos tentar fazer login
        // Se o login funcionar, significa que o usuário já existe
        // Mas isso não é ideal. Vamos confiar no erro do Supabase ao tentar criar um usuário duplicado.

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

        // Verificar se o usuário já existe (Supabase retorna data mesmo para emails duplicados)
        // Precisamos verificar se o usuário foi realmente criado ou se já existia
        if (data && data.user) {
            // Verificar se o usuário já estava confirmado (indica que já existia)
            if (data.user.identities && data.user.identities.length === 0) {
                throw new Error('Este e-mail já está cadastrado. Tente fazer login.');
            }
        }

        // Mostrar mensagem de sucesso
        showMessage('Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.', 'success');
        
        // Limpar o formulário
        document.querySelector('form').reset();
        
        // Redirecionamento removido a pedido do usuário

        return data;
    } catch (error) {
        console.error('Erro ao cadastrar:', error.message);
        let errorMessage = 'Erro ao cadastrar: ' + error.message;

        // Tratar erro de e-mail já cadastrado
        if (error.message.includes('User already registered') || 
            error.message.includes('already registered') ||
            error.message.includes('User already exists') ||
            error.message.includes('já está cadastrado')) {
            errorMessage = 'Este e-mail já está cadastrado. Tente fazer login.';
        }
        
        showMessage(errorMessage, 'error');
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

        // Redirecionar para a página home imediatamente
        window.location.href = 'pages/home.html';

        return data;
    } catch (error) {
        console.error('Erro ao fazer login:', error.message);
        alert('Erro ao fazer login: ' + error.message);
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

        alert('Logout realizado com sucesso!');

        // Redirecionar para login
        window.location.href = '../index.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error.message);
        alert('Erro ao fazer logout: ' + error.message);
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
    // Verificar se estamos na página de cadastro
    const isCadastroPage = window.location.pathname.includes('cadastro');
    
    if (isCadastroPage) {
        // Na página de cadastro, logar no console e mostrar alert
        if (type === 'error') {
            console.error(message);
            alert(message); // Mostrar alert para erros também
        } else if (type === 'success') {
            alert(message);
        } else {
            console.log(message);
        }
    } else {
        // Em outras páginas, usar o comportamento padrão
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
}

/**
 * Função para recuperar senha
 * @param {string} email - Email do usuário
 * @returns {Promise} - Retorna o resultado da operação
 */
async function resetPassword(email) {
    try {
        const { data, error } = await window.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/index.html'
        });

        if (error) {
            // Lançar o erro para ser capturado pelo script.js e exibir no modal
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Erro ao recuperar senha:', error.message);
        // Lançar o erro para ser capturado pelo script.js e exibir no modal
        throw error;
    }
}

/**
 * Função para atualizar a senha do usuário
 * @param {string} newPassword - A nova senha
 * @returns {Promise} - Retorna o resultado da operação
 */
async function updatePassword(newPassword) {
    try {
        const { data, error } = await window.supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            throw error;
        }

        alert('Senha redefinida com sucesso! Você será redirecionado para o login.');
        window.location.href = 'index.html';

        return data;
    } catch (error) {
        console.error('Erro ao atualizar senha:', error.message);
        alert('Erro ao redefinir senha: ' + error.message);
        throw error;
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
window.resetPassword = resetPassword;

