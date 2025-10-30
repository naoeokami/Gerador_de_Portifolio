// ========================================
// LÓGICA DA PÁGINA DE EDIÇÃO DE PORTFÓLIO
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    const portfolioForm = document.querySelector('.portfolio-form');
    if (!portfolioForm) return;

    // 1. Carregar os dados do portfólio do usuário
    const portfolio = await window.getMyPortfolio();

    if (!portfolio) {
        // Se não houver portfólio, redirecionar para a criação
        window.location.href = 'criar-portfolio.html';
        return;
    }

    // 2. Preencher o formulário com os dados
    if (window.loadPortfolioDataToForm) {
        // A função loadPortfolioDataToForm em portfolio.js preenche os campos simples e tags.
        // A lógica para campos repetitivos (Experiências, Formações, Trabalhos) será tratada aqui.
        window.loadPortfolioDataToForm(portfolio.data);
    }

    // 3. Lógica para preencher campos repetitivos (Experiências, Formações, Trabalhos)
    const fillRepeater = (containerId, items, itemClassName) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        // 3.1. Remover todos os itens existentes (incluindo o placeholder)
        // Isso garante que apenas os dados do DB serão exibidos.
        container.innerHTML = '';
        
        if (!items || items.length === 0) {
            // Se não houver itens, adiciona um item vazio para o usuário começar a preencher
            if (window.addItem) {
                window.addItem(containerId, {});
            }
            return;
        }

        // 3.2. Adicionar os itens do banco de dados
        items.forEach((itemData) => {
            // Usar a função addItem do script.js para criar e preencher o item
            if (window.addItem) {
                window.addItem(containerId, itemData);
            }
        });
    };

    // Preencher as experiências
    fillRepeater('experiencias-container', portfolio.data.experiencias, 'experiencia-item');

    // Preencher as formações
    fillRepeater('formacao-container', portfolio.data.formacoes, 'formacao-item');

    // Preencher os trabalhos
    fillRepeater('trabalhos-container', portfolio.data.trabalhos, 'trabalho-item');
    
    // 4. Lidar com o submit do formulário (que já usa savePortfolio para update ou insert)
    portfolioForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // O savePortfolio já lida com a atualização se o portfólio existir
        if (window.savePortfolio) {
            await window.savePortfolio();
        } else {
            alert('Erro: Módulo de portfólio não carregado');
        }
    });

    // Adicionar evento ao botão Cancelar
    const btnCancelar = document.querySelector('.form-actions .btn-secondary');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', function() {
            window.location.href = 'home.html';
        });
    }
});
