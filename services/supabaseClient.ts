import { createClient } from '@supabase/supabase-js';

// Ambil credential dari env vars.
// Catatan: Pas deploy production, pastiin keys ini udah masuk di environment settings ya.
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials are missing. Auth and DB features will not work.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin, // Balik lagi ke app ini abis login
    },
  });

  if (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  }
};