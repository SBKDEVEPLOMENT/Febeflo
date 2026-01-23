import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // No lanzamos error aquí para no romper el build si faltan vars, 
  // pero las funciones fallarán si se intentan usar.
  console.warn('Missing Supabase Service Role Key');
}

export const supabaseAdmin = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseServiceRoleKey || 'placeholder', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});