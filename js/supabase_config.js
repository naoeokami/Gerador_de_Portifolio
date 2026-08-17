// Configuração de Mock para o modo de Demonstração Frontend (sem backend Supabase)
window.supabase = {
    auth: {
        signUp: async () => ({ data: null, error: null }),
        signInWithPassword: async () => ({ data: null, error: null }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        resetPasswordForEmail: async () => ({ data: null, error: null }),
        updateUser: async () => ({ data: null, error: null })
    },
    from: () => ({
        select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) })
    })
};
