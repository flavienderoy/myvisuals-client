import { createClient } from '@supabase/supabase-js';

const cleanEnvVar = (val) => {
    if (!val) return '';
    return String(val).replace(/["'\r\n]/g, '').trim();
};

const rawUrl = cleanEnvVar(import.meta.env.VITE_SUPABASE_URL);
const rawKey = cleanEnvVar(import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = rawUrl || 'https://uulzxqhnmojjsdkqekzo.supabase.co';
const supabaseAnonKey = rawKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bHp4cWhubW9qanNka3Fla3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMTEwNDgsImV4cCI6MjA4NzY4NzA0OH0.wP0cEyUJMi4C3NrE3RYyKZDTlLoXf4VKNVTZDXPV_Ho';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


