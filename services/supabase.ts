import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isPlaceholder = !supabaseUrl || supabaseUrl.includes('YOUR_SUPABASE_URL') || !supabaseAnonKey || supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY');

if (isPlaceholder) {
    console.warn('Supabase not configured. Leaderboard will be disabled.');
}

export const supabase = isPlaceholder
    ? null
    : createClient(supabaseUrl, supabaseAnonKey);
