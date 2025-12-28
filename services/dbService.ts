import { supabase } from './supabaseClient';
import { GameResult, UserProfile } from '../types';

/**
 * Saves a completed game result to the database.
 * Assumes a table 'game_results' exists with columns:
 * user_id, category, score, total_questions, difficulty, created_at
 */
export const saveGameResult = async (userId: string, result: GameResult) => {
  if (!userId) return;

  const { error } = await supabase
    .from('calistung_game_results')
    .insert([
      {
        user_id: userId,
        category: result.category,
        score: result.score,
        total_questions: result.totalQuestions,
        difficulty: result.difficulty,
        created_at: result.date
      }
    ]);

  if (error) {
    console.error('Error saving game result:', error);
  } else {
    console.log('Progress saved via Supabase');
  }
};

/**
 * Fetches game history for a user.
 */
export const getUserHistory = async (userId: string): Promise<GameResult[]> => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('calistung_game_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching history:', error);
    return [];
  }

  // Map DB structure back to frontend type
  return data.map((item: any) => ({
    date: item.created_at,
    score: item.score,
    totalQuestions: item.total_questions,
    category: item.category,
    difficulty: item.difficulty
  }));
};

/**
 * Updates or creates the user profile.
 * Assumes a table 'profiles' exists.
 */
export const upsertUserProfile = async (userId: string, profile: UserProfile) => {
  if (!userId) return;

  const { error } = await supabase
    .from('calistung_profiles')
    .upsert({
      id: userId,
      name: profile.name,
      age: profile.age,
      level: profile.level,
      avatar: profile.avatar,
      updated_at: new Date()
    });

  if (error) {
    console.error("Error saving profile:", error);
  }
};