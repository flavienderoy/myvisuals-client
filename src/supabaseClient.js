import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    console.error('⚠️ Supabase configuration error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing or invalid in your Vercel Environment Variables.');
}

export const supabase = createClient(
    supabaseUrl || 'https://uulzxqhnmojjsdkqekzo.supabase.co',
    supabaseAnonKey || 'placeholder'
);

