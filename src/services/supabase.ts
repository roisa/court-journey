import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client (docs/13). Optional online layer for cloud backup + sync.
 *
 * The app runs fully local-first with no config. When these two public env
 * vars are present at build time the cloud layer activates. The anon key is
 * safe to ship publicly — Row-Level Security protects each user's data.
 *
 *   EXPO_PUBLIC_SUPABASE_URL
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY
 */
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        // Completes the email magic-link sign-in when the page loads with the
        // token in the URL (web). Harmless on native.
        detectSessionInUrl: true,
      },
    })
  : null;

/** Where the magic-link should send the user back to (web). */
export function authRedirectUrl(): string | undefined {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.href.split('#')[0];
  }
  return undefined;
}
