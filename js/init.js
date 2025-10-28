// ========================================
// INICIALIZAÇÃO DO SUPABASE
// ========================================

// Aguardar o carregamento do SDK do Supabase
document.addEventListener('DOMContentLoaded', async function() {
    // Aguardar um pouco para garantir que o SDK foi carregado
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verificar se o Supabase foi carregado
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase SDK não foi carregado. Verifique se a tag de script está correta.');
        return;
    }

    // Inicializar o cliente Supabase com as credenciais
    try {
        // O cliente já deve ter sido criado em supabase_config.js
        // Aqui apenas verificamos se está disponível
        if (!window.supabase || !window.supabase.auth) {
            console.error('Cliente Supabase não foi inicializado corretamente.');
            return;
        }
        
        console.log('Supabase inicializado com sucesso!');
        
        // Verificar autenticação
        const { data: { session } } = await window.supabase.auth.getSession();
        console.log('Sessão atual:', session ? 'Autenticado' : 'Não autenticado');
        
    } catch (error) {
        console.error('Erro ao inicializar Supabase:', error);
    }
});

