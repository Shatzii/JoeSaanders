import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate URL format
const isValidUrl = (url: string | undefined): boolean => {
  if (!url || url.includes('your-supabase-url') || url.includes('placeholder')) {
    return false;
  }
  try {
    new URL(url);
    return url.startsWith('https://') && url.includes('.supabase.co');
  } catch {
    return false;
  }
}

// Validate API key format
const isValidKey = (key: string | undefined): boolean => {
  return !!(key && 
    key.length > 10 && 
    !key.includes('your-') && 
    !key.includes('placeholder') &&
    !key.includes('example'));
}

export const supabase = isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey)
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

// For server-side usage (API routes)
export const supabaseServer = isValidUrl(supabaseUrl) && isValidKey(supabaseServiceKey)
  ? createClient(supabaseUrl!, supabaseServiceKey!)
  : null
