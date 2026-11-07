import { shuffle } from './random';

export interface ClueQuestion {
  id: string;
  emoji: string;
  clue: string;
  answer: string;
  options: string[];
}

// Game baru v2.2.0: Tebak dari Ciri — anak membaca/mendengar ciri-ciri,
// lalu memilih benda/hewan/tempatnya. Gambar TIDAK ditampilkan saat soal,
// karena gambar akan langsung membocorkan jawaban.
const CLUES = [
  { emoji: '🐰', clue: 'Aku berkaki empat, suka makan wortel, telingaku panjang.', answer: 'KELINCI' },
  { emoji: '🐶', clue: 'Aku setia pada manusia, suka menggonggong dan bermain bola.', answer: 'ANJING' },
  { emoji: '🐱', clue: 'Aku suka tidur di tempat hangat dan mengejar tikus.', answer: 'KUCING' },
  { emoji: '🐟', clue: 'Aku berenang di air dan bernapas dengan insang.', answer: 'IKAN' },
  { emoji: '🐘', clue: 'Aku hewan terbesar di darat, hidungku panjang seperti belalai.', answer: 'GAJAH' },
  { emoji: '🦒', clue: 'Leherku sangat panjang, aku makan daun dari pohon tinggi.', answer: 'JERAPAH' },
  { emoji: '🐝', clue: 'Aku terbang dari bunga ke bunga dan membuat madu.', answer: 'LEBAH' },
  { emoji: '🦋', clue: 'Dulu aku ulat, sekarang sayapku indah dan berwarna.', answer: 'KUPU-KUPU' },
  { emoji: '🌙', clue: 'Aku muncul di malam hari dan bersinar di langit.', answer: 'BULAN' },
  { emoji: '☀️', clue: 'Aku terbit di pagi hari dan membuat hari menjadi terang.', answer: 'MATAHARI' },
  { emoji: '🌧️', clue: 'Aku jatuh dari awan dan membuat tanah menjadi basah.', answer: 'HUJAN' },
  { emoji: '🍎', clue: 'Aku buah berwarna merah, rasanya manis dan renyah.', answer: 'APEL' },
  { emoji: '🍌', clue: 'Aku buah berwarna kuning, bentukku melengkung.', answer: 'PISANG' },
  { emoji: '🥕', clue: 'Aku sayur berwarna oranye, kelinci suka memakanku.', answer: 'WORTEL' },
  { emoji: '🚗', clue: 'Aku kendaraan beroda empat, berjalan di jalan raya.', answer: 'MOBIL' },
  { emoji: '✈️', clue: 'Aku terbang tinggi di langit, membawa penumpang jauh.', answer: 'PESAWAT' },
  { emoji: '🚲', clue: 'Aku kendaraan beroda dua, dikayuh dengan kaki.', answer: 'SEPEDA' },
  { emoji: '📖', clue: 'Aku berisi cerita dan gambar, dibaca dari halaman ke halaman.', answer: 'BUKU' },
  { emoji: '✏️', clue: 'Aku dipakai untuk menulis dan menggambar di kertas.', answer: 'PENSIL' },
  { emoji: '🏫', clue: 'Tempat anak-anak belajar bersama guru dan teman.', answer: 'SEKOLAH' },
  { emoji: '🏠', clue: 'Tempat kita tinggal bersama keluarga.', answer: 'RUMAH' },
  { emoji: '🌳', clue: 'Aku tumbuh dari tanah, batangnya kuat dan daunnya hijau.', answer: 'POHON' },
  { emoji: '🐄', clue: 'Aku hewan ternak, susuku diminum anak-anak.', answer: 'SAPI' },
  { emoji: '🐔', clue: 'Aku hewan ternak, telorku dimakan untuk sarapan.', answer: 'AYAM' },
];

export const generateClueQuestions = (count: number = 5): ClueQuestion[] => {
  const picked = shuffle([...CLUES]).slice(0, count);
  return picked.map((item, i) => {
    const others = shuffle(CLUES.filter((c) => c.answer !== item.answer)).slice(0, 2);
    return {
      id: `clue-${Date.now()}-${i}`,
      emoji: item.emoji,
      clue: item.clue,
      answer: item.answer,
      options: shuffle([item.answer, ...others.map((o) => o.answer)]),
    };
  });
};
