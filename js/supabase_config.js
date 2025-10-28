// ESTE ARQUIVO DEVE SER PREENCHIDO COM AS SUAS CHAVES DO SUPABASE
// NUNCA COMPROMETA SUAS CHAVES!

const SUPABASE_URL = 'SUA_URL_DO_PROJETO_AQUI'; // Ex: https://abcd1234efg.supabase.co
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANON_PUBLIC_AQUI'; // Ex: eyJhbGciOi...

// Inicializa o cliente Supabase e anexa ao objeto global window
// O objeto 'supabase' é injetado globalmente pelo script do CDN
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// O cliente Supabase agora está acessível globalmente como window.supabase
// e pode ser usado nos outros scripts (auth.js, portfolio.js)

