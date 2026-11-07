export interface SizeQuestion {
  id: string;
  emoji: string;
  bigSide: 'KIRI' | 'KANAN';
  ask: 'BESAR' | 'KECIL';
}

const EMOJIS = ['🐘', '🐭', '🍎', '🍉', '🐶', '🐱', '🚗', '🚌', '⭐', '🌸', '🐟', '🦒'];

// Game baru v2.1.1: Besar & Kecil.
// Satu benda yang sama ditampilkan besar di satu sisi dan kecil di sisi lain;
// anak memilih sisi yang sesuai pertanyaan. Jawaban selalu posisi (Kiri/Kanan),
// bukan benda — jadi tidak bisa ditebak dari bendanya saja.
export const generateSizeQuestions = (count: number = 5): SizeQuestion[] => {
  const questions: SizeQuestion[] = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      id: `size-${Date.now()}-${i}`,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      bigSide: Math.random() < 0.5 ? 'KIRI' : 'KANAN',
      ask: Math.random() < 0.5 ? 'BESAR' : 'KECIL',
    });
  }
  return questions;
};

export const sizeAnswer = (q: SizeQuestion): 'KIRI' | 'KANAN' =>
  q.ask === 'BESAR' ? q.bigSide : q.bigSide === 'KIRI' ? 'KANAN' : 'KIRI';
