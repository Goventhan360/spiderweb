import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables! Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file."
  );
  // We don't throw an error at the top level to avoid completely crashing the UI before React renders,
  // but any attempt to use the client will fail appropriately.
}

export const supabase = createClient(
  supabaseUrl || 'https://missing-supabase-url.supabase.co', 
  supabaseAnonKey || 'missing-anon-key', 
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

export const isSupabaseConfigured = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};

export default supabase;
