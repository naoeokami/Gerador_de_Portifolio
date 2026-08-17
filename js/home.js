// ========================================
// LÓGICA DA PÁGINA HOME
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar se o usuário está logado (assumindo que window.getCurrentUser() existe e funciona)
    const user = await window.getCurrentUser();
    if (!user) {
        // Se não estiver logado, redirecionar para o login (index.html)
        window.location.href = '../index.html';
        return;
    }

    // 1. Verificar se o usuário já tem um portfólio
    const portfolio = await window.getMyPortfolio();
    
    const criarPortfolioLink = document.querySelector('.botoes_acao .botoes_container a:nth-child(1)');
    const excluirPortfolioLink = document.getElementById('excluir_portfolio_link');
    const excluirPortfolioBtn = document.getElementById('excluir_portfolio');
    const editarPortfolioLink = document.querySelector('.botoes_acao .botoes_container a:nth-child(2)');
    const criarPortfolioBtn = document.getElementById('criar_portfolio');
    const editarPortfolioBtn = document.getElementById('editar_portfolio');
    const descricao = document.querySelector('.botoes_acao .descricao');

    if (portfolio) {
        // d) Botão "Excluir Portfólio" fica visível e funcional
        excluirPortfolioLink.style.display = 'block';
        excluirPortfolioBtn.addEventListener('click', handleDeletePortfolio);
        // O usuário TEM um portfólio
        
        // a) Botão "Criar Portfólio" vira "Visualizar Portfólio"
        criarPortfolioBtn.textContent = 'Visualizar Portfólio';
        criarPortfolioLink.href = `visualizar-portfolio.html?id=${portfolio.id}`;
        
        // b) Botão "Editar Portfólio" fica ativo
        editarPortfolioBtn.textContent = 'Editar Portfólio';
        editarPortfolioLink.href = 'editar-portfolio.html';
        editarPortfolioLink.classList.remove('inativo');
        editarPortfolioBtn.disabled = false;
        
        // c) Atualizar descrição
        descricao.textContent = 'Você já tem um portfólio criado. Visualize ou edite ele agora!';

    } else {
        // O usuário NÃO TEM um portfólio
        
        // a) Botão "Criar Portfólio" fica ativo
        criarPortfolioBtn.textContent = 'Criar Portfólio';
        criarPortfolioLink.href = 'criar-portfolio.html';
        
        // b) Botão "Editar Portfólio" fica inativo
        editarPortfolioBtn.textContent = 'Editar Portfólio';
        editarPortfolioLink.href = '#'; // Desativar o link
        // d) Botão "Excluir Portfólio" fica oculto
        excluirPortfolioLink.style.display = 'none';
        editarPortfolioLink.classList.add('inativo'); // Adicionar classe para estilo de inativo (cinza)
        editarPortfolioBtn.disabled = true; // Desabilitar o botão
        
        // c) Atualizar descrição
        descricao.textContent = 'Bem vindo ao FolioLabs, clique no botão abaixo para criar seu portfólio!';
    }

    // 2. Exibir nome do usuário
    const nomeUserElement = document.getElementById('nome_user');
    if (nomeUserElement && user && user.name) {
        nomeUserElement.textContent = user.name;
    } else if (nomeUserElement && user && user.user_metadata && user.user_metadata.name) {
        nomeUserElement.textContent = user.user_metadata.name;
    } else if (nomeUserElement && user && user.email) {
        const nome = user.email.split('@')[0];
        nomeUserElement.textContent = nome.charAt(0).toUpperCase() + nome.slice(1);
    } else if (nomeUserElement) {
        nomeUserElement.textContent = 'Usuário';
    }
});

// Função para excluir o portfólio
async function handleDeletePortfolio() {
    if (!confirm('Tem certeza que deseja excluir seu portfólio? Esta ação é irreversível.')) {
        return;
    }

    const user = await window.getCurrentUser();
    if (!user) {
        alert('Usuário não autenticado.');
        window.location.href = '../index.html';
        return;
    }

    const portfolio = await window.getMyPortfolio();
    if (!portfolio) {
        alert('Nenhum portfólio encontrado para exclusão.');
        return;
    }

    // Chama a função global de exclusão de portfólio (a ser implementada em portfolio.js)
    const success = await window.deletePortfolio(portfolio.id);

    if (success) {
        alert('Portfólio excluído com sucesso.');
        // Recarrega a página para atualizar o estado dos botões
        window.location.reload();
    } else {
        alert('Erro ao excluir o portfólio. Tente novamente.');
    }
}
