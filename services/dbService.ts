import { supabase } from './supabaseClient';
import { GameResult, UserProfile } from '../types';

/**
 * v2: fungsi-fungsi ini mengembalikan hasil yang bisa dibedakan pemanggilnya.
 * - save/upsert mengembalikan boolean (bukan hanya console.error).
 * - getUserProfile membedakan 'tidak ada profil' dari 'gagal mengambil profil',
 *   karena v1 menyamakan keduanya dan bisa menimpa profil lama secara diam-diam.
 * Tabel yang benar: calistung_game_results dan calistung_profiles
 * (komentar v1 yang menyebut game_results/profiles adalah salah).
 */

export type ProfileResult =
  | { kind: 'ok'; profile: UserProfile }
  | { kind: 'not-found' }
  | { kind: 'error' };

export const saveGameResult = async (userId: string, result: GameResult): Promise<boolean> => {
  if (!userId) return false;
  const { error } = await supabase.from('calistung_game_results').insert([
    {
      user_id: userId,
      category: result.category,
      score: result.score,
      total_questions: result.totalQuestions,
      difficulty: result.difficulty,
      created_at: result.date,
    },
  ]);
  if (error) {
    console.error('Error saving game result:', error);
    return false;
  }
  return true;
};

export const getUserHistory = async (userId: string): Promise<GameResult[]> => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('calistung_game_results')
    .select('created_at,score,total_questions,category,difficulty')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) {
    console.error('Error fetching history:', error);
    return [];
  }
  if (!data) return [];
  // Urutan kronologis untuk grafik/laporan, setelah mengambil 100 terbaru.
  return [...data].reverse().map((item: any) => ({
    date: item.created_at,
    score: item.score,
    totalQuestions: item.total_questions,
    category: item.category,
    difficulty: item.difficulty,
  }));
};

export const getUserProfile = async (userId: string): Promise<ProfileResult> => {
  if (!userId) return { kind: 'not-found' };
  const { data, error } = await supabase.from('calistung_profiles').select('*').eq('id', userId).single();
  if (error) {
    if (error.code === 'PGRST116') return { kind: 'not-found' };
    console.error('Error fetching profile:', error);
    return { kind: 'error' };
  }
  if (!data) return { kind: 'not-found' };
  return {
    kind: 'ok',
    profile: {
      name: data.name,
      age: data.age,
      level: data.level,
      avatar: data.avatar,
    },
  };
};

export const upsertUserProfile = async (userId: string, profile: UserProfile): Promise<boolean> => {
  if (!userId) return false;
  const { error } = await supabase.from('calistung_profiles').upsert({
    id: userId,
    name: profile.name,
    age: profile.age,
    level: profile.level,
    avatar: profile.avatar,
    updated_at: new Date(),
  });
  if (error) {
    console.error('Error saving profile:', error);
    return false;
  }
  return true;
};
