const SUPABASE_URL = 'https://zoinbuvldnernhapiqbx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvaW5idXZsZG5lcm5oYXBpcWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjgxMzgsImV4cCI6MjA3NjEwNDEzOH0.x4DgYOS4QvZEMT45grHdflZCSBplT4qLACYmpWqHRfw'; // Ex: eyJhbGciOi...

window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


