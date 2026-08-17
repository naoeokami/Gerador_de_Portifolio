// ========================================
// MÓDULO DE AUTENTICAÇÃO LOCAL (DEMONSTRAÇÃO / FRONTEND)
// Armazena usuários em localStorage ('foliolabs_users')
// e sessão atual em localStorage ('foliolabs_session')
// ========================================

/**
 * Função auxiliar para buscar a lista de usuários cadastrados
 */
function getUsersFromStorage() {
    try {
        const usersJson = localStorage.getItem('foliolabs_users');
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (e) {
        console.error('Erro ao ler usuários do localStorage:', e);
        return [];
    }
}

/**
 * Função auxiliar para salvar a lista de usuários
 */
function saveUsersToStorage(users) {
    try {
        localStorage.setItem('foliolabs_users', JSON.stringify(users));
    } catch (e) {
        console.error('Erro ao salvar usuários no localStorage:', e);
    }
}

/**
 * Função auxiliar para obter o caminho relativo correto para páginas
 */
function getPath(target) {
    const isInsidePages = window.location.pathname.includes('/pages/');
    if (target === 'home') {
        return isInsidePages ? 'home.html' : 'pages/home.html';
    }
    if (target === 'login') {
        return isInsidePages ? '../index.html' : 'index.html';
    }
    return target;
}

/**
 * Função para registrar um novo usuário
 */
async function signUp(email, password, name) {
    try {
        const confirmPasswordElement = document.getElementById('confirmar_senha');
        const confirmPassword = confirmPasswordElement ? confirmPasswordElement.value : '';
        if (password !== confirmPassword) {
            throw new Error('As senhas não coincidem!');
        }

        const users = getUsersFromStorage();
        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (existingUser) {
            throw new Error('Este e-mail já está cadastrado. Tente fazer login.');
        }

        const newUser = {
            id: 'user_' + Date.now(),
            email: email,
            password: password,
            name: name,
            user_metadata: {
                name: name
            }
        };

        users.push(newUser);
        saveUsersToStorage(users);

        // Fazer auto-login
        localStorage.setItem('foliolabs_session', JSON.stringify(newUser));

        showMessage('Cadastro realizado com sucesso! Redirecionando...', 'success');
        
        const form = document.querySelector('form');
        if (form) form.reset();

        setTimeout(() => {
            window.location.href = getPath('home');
        }, 1200);

        return { user: newUser };
    } catch (error) {
        console.error('Erro ao cadastrar:', error.message);
        showMessage(error.message, 'error');
        throw error;
    }
}

/**
 * Função para fazer login
 */
async function signIn(email, password) {
    try {
        const users = getUsersFromStorage();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (!user) {
            throw new Error('E-mail ou senha incorretos.');
        }

        // Salvar sessão no localStorage
        localStorage.setItem('foliolabs_session', JSON.stringify(user));

        // Redirecionar para home
        window.location.href = getPath('home');

        return { user };
    } catch (error) {
        console.error('Erro ao fazer login:', error.message);
        alert('Erro ao fazer login: ' + error.message);
        throw error;
    }
}

/**
 * Função para fazer logout
 */
async function signOut() {
    try {
        localStorage.removeItem('foliolabs_session');
        alert('Logout realizado com sucesso!');
        window.location.href = getPath('login');
    } catch (error) {
        console.error('Erro ao fazer logout:', error.message);
        alert('Erro ao fazer logout: ' + error.message);
    }
}

/**
 * Função para obter o usuário atual
 */
async function getCurrentUser() {
    try {
        const sessionJson = localStorage.getItem('foliolabs_session');
        if (!sessionJson) return null;
        const user = JSON.parse(sessionJson);
        if (!user.user_metadata) {
            user.user_metadata = { name: user.name };
        }
        return user;
    } catch (error) {
        console.error('Erro ao obter usuário atual:', error.message);
        return null;
    }
}

/**
 * Função para verificar se o usuário está autenticado
 */
async function isAuthenticated() {
    const user = await getCurrentUser();
    return user !== null;
}

/**
 * Exibir mensagens
 */
function showMessage(message, type = 'info') {
    const isCadastroPage = window.location.pathname.includes('cadastro');
    if (isCadastroPage) {
        alert(message);
    } else {
        const messageDiv = document.getElementById('mensagem');
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
}

/**
 * Recuperar senha (Mock)
 */
async function resetPassword(email) {
    try {
        const users = getUsersFromStorage();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            throw new Error('E-mail não encontrado.');
        }

        return { data: true };
    } catch (error) {
        console.error('Erro ao recuperar senha:', error.message);
        throw error;
    }
}

/**
 * Atualizar senha (Mock)
 */
async function updatePassword(newPassword) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            throw new Error('Usuário não autenticado.');
        }

        const users = getUsersFromStorage();
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            saveUsersToStorage(users);
            currentUser.password = newPassword;
            localStorage.setItem('foliolabs_session', JSON.stringify(currentUser));
        }

        alert('Senha redefinida com sucesso! Redirecionando para o login.');
        window.location.href = getPath('login');

        return { user: currentUser };
    } catch (error) {
        console.error('Erro ao atualizar senha:', error.message);
        alert('Erro ao redefinir senha: ' + error.message);
        throw error;
    }
}

/**
 * Verificar autenticação nas páginas protegidas
 */
async function checkAuth() {
    const user = await getCurrentUser();
    const currentPage = window.location.pathname;
    const isLoginPage = currentPage.includes('index.html') || currentPage.endsWith('/');
    const isCadastroPage = currentPage.includes('cadastro.html');
    const isEsqueceuSenhaPage = currentPage.includes('esqueceu-senha.html');
    const isUpdatePasswordPage = currentPage.includes('update-password.html');

    if (!user && !isLoginPage && !isCadastroPage && !isEsqueceuSenhaPage && !isUpdatePasswordPage) {
        window.location.href = getPath('login');
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
window.updatePassword = updatePassword;

