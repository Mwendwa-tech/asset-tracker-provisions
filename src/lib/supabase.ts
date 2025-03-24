
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// These environment variables are provided by Lovable's Supabase integration
// They need to be set in the Lovable Supabase integration settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Supabase integration settings.');
}

// Fallback to empty strings to prevent runtime errors during development
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder-url.supabase.co', // Fallback URL
  supabaseAnonKey || 'placeholder-key' // Fallback key
);

// Add a helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
