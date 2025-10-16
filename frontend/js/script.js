// Configurações da API - SUBSTITUA pela URL do seu backend no Render
const API_BASE_URL = 'https://seu-backend.onrender.com/api';

// Função para mostrar mensagens
function mostrarMensagem(texto, tipo) {
    const mensagemDiv = document.getElementById('mensagem');
    if (!mensagemDiv) return;
    
    mensagemDiv.textContent = texto;
    mensagemDiv.className = tipo === 'erro' ? 'mensagem-erro' : 'mensagem-sucesso';
    mensagemDiv.style.display = 'block';
    
    if (tipo === 'sucesso') {
        setTimeout(() => {
            mensagemDiv.style.display = 'none';
        }, 3000);
    }
}

// Função para cadastrar usuário
async function cadastrarUsuario(nome, email, senha) {
    try {
        const response = await fetch(`${API_BASE_URL}/cadastro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, email, senha })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error);
        }
        
        return data.usuario;
    } catch (error) {
        throw error;
    }
}

// Função para fazer login
async function fazerLogin(email, senha) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error);
        }
        
        return data.usuario;
    } catch (error) {
        throw error;
    }
}

// Salvar usuário no localStorage após login
function salvarUsuarioSessao(usuario) {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    localStorage.setItem('isLoggedIn', 'true');
}

// Verificar se usuário está logado
function verificarLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const usuario = localStorage.getItem('usuarioLogado');
    
    if (isLoggedIn === 'true' && usuario) {
        return JSON.parse(usuario);
    }
    return null;
}

// Fazer logout
function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '../index.html';
}

// Função para validar email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Event listeners quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada - Sistema FolioLabs');
    
    // Página de Cadastro
    const botaoCadastrar = document.getElementById('cadastrarUser');
    if (botaoCadastrar) {
        botaoCadastrar.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('name').value.trim();
            const email = document.getElementById('login').value.trim();
            const senha = document.getElementById('senha').value.trim();
            const confirmarSenha = document.querySelectorAll('#senha')[1].value.trim();
            
            // Validações
            if (!nome || !email || !senha || !confirmarSenha) {
                mostrarMensagem('Por favor, preencha todos os campos.', 'erro');
                return;
            }
            
            if (senha !== confirmarSenha) {
                mostrarMensagem('As senhas não coincidem.', 'erro');
                return;
            }
            
            if (senha.length < 6) {
                mostrarMensagem('A senha deve ter pelo menos 6 caracteres.', 'erro');
                return;
            }
            
            if (!validarEmail(email)) {
                mostrarMensagem('Por favor, insira um email válido.', 'erro');
                return;
            }
            
            try {
                botaoCadastrar.textContent = 'Cadastrando...';
                botaoCadastrar.disabled = true;
                
                const resultado = await cadastrarUsuario(nome, email, senha);
                
                mostrarMensagem('Cadastro realizado com sucesso! Redirecionando...', 'sucesso');
                
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);
                
            } catch (error) {
                console.error('Erro no cadastro:', error);
                mostrarMensagem('Erro ao cadastrar: ' + error.message, 'erro');
            } finally {
                botaoCadastrar.textContent = 'Cadastrar';
                botaoCadastrar.disabled = false;
            }
        });
    }
    
    // Página de Login
    const botaoAcessar = document.getElementById('acessar');
    if (botaoAcessar) {
        botaoAcessar.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login').value.trim();
            const senha = document.getElementById('senha').value.trim();
            
            if (!email || !senha) {
                mostrarMensagem('Por favor, preencha todos os campos.', 'erro');
                return;
            }
            
            if (!validarEmail(email)) {
                mostrarMensagem('Por favor, insira um email válido.', 'erro');
                return;
            }
            
            try {
                botaoAcessar.textContent = 'Acessando...';
                botaoAcessar.disabled = true;
                
                const usuario = await fazerLogin(email, senha);
                salvarUsuarioSessao(usuario);
                
                mostrarMensagem('Login realizado com sucesso! Redirecionando...', 'sucesso');
                
                setTimeout(() => {
                    window.location.href = 'pages/home.html';
                }, 2000);
                
            } catch (error) {
                console.error('Erro no login:', error);
                mostrarMensagem('Erro ao fazer login: ' + error.message, 'erro');
            } finally {
                botaoAcessar.textContent = 'Acessar';
                botaoAcessar.disabled = false;
            }
        });
    }
    
    // Verificar se usuário já está logado (redirecionar para home)
    const usuarioLogado = verificarLogin();
    if (usuarioLogado && window.location.pathname.includes('index.html')) {
        window.location.href = 'pages/home.html';
    }
    
    // Página Home - mostrar dados do usuário
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement && usuarioLogado) {
        userInfoElement.innerHTML = `
            <h3>Bem-vindo, ${usuarioLogado.nome}!</h3>
            <p>Email: ${usuarioLogado.email}</p>
            <p>Tipo de Usuário: ${usuarioLogado.type_user === 2 ? 'Usuário Comum' : 'Administrador'}</p>
            <button onclick="fazerLogout()" class="botao_login">Sair</button>
        `;
    }
});