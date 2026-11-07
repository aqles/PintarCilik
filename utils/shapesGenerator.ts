import { DifficultyLevel } from '../types';

export interface ShapeQuestion {
  id: string;
  kind: 'COLOR' | 'SHAPE';
  image: string;
  word: string;
  options: string[];
}

const COLORS = [
  { word: 'MERAH', img: 'emoji:❤️' },
  { word: 'BIRU', img: 'emoji:💙' },
  { word: 'HIJAU', img: 'emoji:💚' },
  { word: 'KUNING', img: 'emoji:💛' },
  { word: 'HITAM', img: 'emoji:🖤' },
  { word: 'PUTIH', img: 'emoji:🤍' },
  { word: 'UNGU', img: 'emoji:💜' },
  { word: 'ORANYE', img: 'emoji:🧡' },
];

const SHAPES = [
  { word: 'LINGKARAN', img: 'emoji:🔴' },
  { word: 'SEGITIGA', img: 'emoji:🔺' },
  { word: 'PERSEGI', img: 'emoji:🟥' },
  { word: 'BINTANG', img: 'emoji:⭐' },
  { word: 'HATI', img: 'emoji:❤️' },
  { word: 'BULAN', img: 'emoji:🌙' },
];

// Game baru v2.1.1: Warna & Bentuk.
// Pemula: lihat gambar (warna/bentuk), pilih namanya.
// Menengah: bolak-balik — kadang lihat nama, pilih gambarnya.
export const generateShapeQuestions = (
  level: DifficultyLevel,
  count: number = 5,
): ShapeQuestion[] => {
  const questions: ShapeQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const kind: 'COLOR' | 'SHAPE' = Math.random() < 0.5 ? 'COLOR' : 'SHAPE';
    const pool = kind === 'COLOR' ? COLORS : SHAPES;
    const item = pool[Math.floor(Math.random() * pool.length)];
    const others = pool
      .filter((p) => p.word !== item.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    const wordMode = level === DifficultyLevel.MENENGAH && Math.random() < 0.5;
    questions.push({
      id: `shape-${Date.now()}-${i}`,
      kind,
      image: item.img,
      word: item.word,
      options: wordMode
        ? [item.img, ...others.map((o) => o.img)].sort(() => Math.random() - 0.5)
        : [item.word, ...others.map((o) => o.word)].sort(() => Math.random() - 0.5),
    });
  }
  return questions;
};

export const isImageOption = (q: ShapeQuestion): boolean =>
  q.options[0]?.startsWith('emoji:') ?? false;
