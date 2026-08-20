const read = (key: string): string => (import.meta.env[key] ?? '').toString().trim();

export const SUPABASE_URL = read('VITE_SUPABASE_URL');
export const SUPABASE_ANON_KEY = read('VITE_SUPABASE_ANON_KEY');
export const N8N_WEBHOOK_BASE_URL = read('VITE_N8N_WEBHOOK_BASE_URL').replace(/\/+$/, '');
export const BUSINESS_ID = read('VITE_BUSINESS_ID');
// Optional: the app stays usable without it, so it is not part of missingEnvKeys().
export const GOOGLE_MAPS_EMBED_API_KEY = read('VITE_GOOGLE_MAPS_EMBED_API_KEY');

export function missingEnvKeys(): string[] {
  const missing: string[] = [];
  if (!SUPABASE_URL) missing.push('VITE_SUPABASE_URL');
  if (!SUPABASE_ANON_KEY) missing.push('VITE_SUPABASE_ANON_KEY');
  if (!N8N_WEBHOOK_BASE_URL) missing.push('VITE_N8N_WEBHOOK_BASE_URL');
  if (!BUSINESS_ID) missing.push('VITE_BUSINESS_ID');
  return missing;
}
