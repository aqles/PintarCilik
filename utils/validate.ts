// Validasi & skor v2 — dipakai sebelum soal apa pun dirender atau skor disimpan.
// Aturan kunci: skor selalu 0-100 dan totalQuestions = jumlah soal sebenarnya,
// bukan hardcode 100 dan bukan +20 per soal.
import { DifficultyLevel } from '../types';

export function scorePercent(correct: number, totalQuestions: number): number {
  if (totalQuestions <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((correct / totalQuestions) * 100)));
}

export function validateLevel(level: unknown): DifficultyLevel {
  if (level === DifficultyLevel.PEMULA || level === DifficultyLevel.MENENGAH || level === DifficultyLevel.MAHIR) {
    return level;
  }
  return DifficultyLevel.PEMULA;
}

export function isValidQuestion(q: unknown): boolean {
  if (!q || typeof q !== 'object') return false;
  const o = q as Record<string, unknown>;
  if (typeof o.id !== 'string' || !o.id) return false;
  if (!Array.isArray(o.options) || o.options.length === 0) return false;
  // Jawaban harus ada di opsi (perbandingan longgar untuk angka vs string dari data lama).
  return o.options.some((opt) => String(opt) === String(o.answer) || opt === o.word || opt === o.missingLetter);
}
