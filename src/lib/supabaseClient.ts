import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://jgpjktzghngpzxsxfurm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncGprdHpnaG5ncHp4c3hmdXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MTI3MjcsImV4cCI6MjA3NDQ4ODcyN30.H-22Vdy3czvZ1guas49IR4JFAs0E-mEdhHFIhkvwt7w";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});