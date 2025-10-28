// ESTE ARQUIVO DEVE SER PREENCHIDO COM AS SUAS CHAVES DO SUPABASE
// NUNCA COMPROMETA SUAS CHAVES!

const SUPABASE_URL = 'https://zoinbuvldnernhapiqbx.supabase.co'; // Ex: https://abcd1234efg.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvaW5idXZsZG5lcm5oYXBpcWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjgxMzgsImV4cCI6MjA3NjEwNDEzOH0.x4DgYOS4QvZEMT45grHdflZCSBplT4qLACYmpWqHRfw'; // Ex: eyJhbGciOi...

// Inicializa o cliente Supabase e anexa ao objeto global window
// O objeto 'supabase' é injetado globalmente pelo script do CDN
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// O cliente Supabase agora está acessível globalmente como window.supabase
// e pode ser usado nos outros scripts (auth.js, portfolio.js)

