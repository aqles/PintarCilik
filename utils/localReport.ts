// Laporan orang tua v2 — dihitung dari data permainan di aplikasi.
// Menggantikan generateParentReport: tidak ada data anak yang keluar dari aplikasi.
import { GameResult } from '../types';

export function buildLocalReport(history: GameResult[], childName: string): string {
  if (history.length === 0) {
    return `${childName} belum memainkan permainan apa pun. Ajak ${childName} bermain dulu, lalu laporan ini akan terisi otomatis.`;
  }
  const avg = Math.round(history.reduce((a, b) => a + b.score, 0) / history.length);
  const best = history.reduce((a, b) => (b.score > a.score ? b : a));
  const byCategory = new Map<string, number[]>();
  for (const h of history) {
    const arr = byCategory.get(h.category) ?? [];
    arr.push(h.score);
    byCategory.set(h.category, arr);
  }
  const lines = byCategory.entries();
  const perCategory: string[] = [];
  for (const [cat, scores] of lines) {
    perCategory.push(`${cat}: rata-rata ${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)} dari ${scores.length} permainan`);
  }
  const suggestion = avg >= 80
    ? 'Coba naikkan tantangan sedikit demi sedikit dan variasikan kategori permainannya.'
    : avg >= 50
      ? 'Fokuskan latihan pada kategori dengan rata-rata terendah, dengan sesi pendek yang rutin.'
      : 'Mulai dari level termudah, sesi pendek, dan rayakan setiap jawaban benar agar anak tetap semangat.';
  return [
    `Ringkasan untuk ${childName}: ${history.length} permainan, rata-rata skor ${avg}.`,
    `Skor terbaik: ${best.score} (${best.category}).`,
    ...perCategory,
    `Saran berikutnya: ${suggestion}`,
  ].join('\n\n');
}
