import { DifficultyLevel } from '../types';
import { READING_WORDS } from './readingGenerator';

export interface LetterQuestion {
  id: string;
  letter: string;
  image: string;
  word: string;
  options: string[];
}

/**
 * Game baru v2.1: Huruf & Benda.
 * Soal: satu huruf besar ditampilkan, anak memilih gambar benda yang namanya
 * diawali huruf itu. Pengecoh dipilih dari kata yang huruf depannya BERBEDA,
 * jadi tidak pernah ada dua jawaban yang sama-sama benar.
 * Memakai bank kata yang sama dengan game Membaca (READING_WORDS), bukan salinan.
 */
// Gambar yang dipakai lebih dari satu kata (mis. 👨 untuk AYAH dan PAMAN)
// tidak boleh dipakai di game ini: gambar itu sendiri jadi ambigu, karena bisa
// dibaca sebagai kata lain yang huruf depannya berbeda (atau sama dengan target).
const IMAGE_COUNTS = new Map<string, number>();
for (const w of READING_WORDS) {
  IMAGE_COUNTS.set(w.img, (IMAGE_COUNTS.get(w.img) ?? 0) + 1);
}
const LETTER_POOL = READING_WORDS.filter(
  (w) => IMAGE_COUNTS.get(w.img) === 1,
);

export const generateLetterQuestions = (
  _level: DifficultyLevel,
  count: number = 5,
): LetterQuestion[] => {
  const questions: LetterQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const item = LETTER_POOL[Math.floor(Math.random() * LETTER_POOL.length)];
    const letter = item.word[0];
    const distractors = LETTER_POOL.filter(
      (w) => w.word[0] !== letter && w.img !== item.img,
    )
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    questions.push({
      id: `letter-${Date.now()}-${i}`,
      letter,
      image: item.img,
      word: item.word,
      options: [item.img, ...distractors.map((d) => d.img)].sort(
        () => Math.random() - 0.5,
      ),
    });
  }
  return questions;
};
