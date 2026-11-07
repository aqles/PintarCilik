import React, { useRef, useState } from 'react';
import { shuffle } from '../utils/random';
import { playAnswerSound } from '../utils/sound';
import { useAlert } from '../context/AlertContext';
import { Button } from './UI';

interface MemoryGameProps {
  onFinish: (correct: number, total: number) => Promise<boolean> | boolean | void;
  onBack: () => void;
}

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const POOL = ['🐶', '🐱', '🍎', '🍓', '🚗', '⭐', '🐟', '🌸', '🦁', '🍉', '🎈', '🐼'];

// Game baru v2.1.1: Kartu Memori — bukan GameShell, karena interaksinya
// membalik kartu, bukan sekali pilih. 4 pasang (8 kartu) per ronde.
// Skor simpan: pasangan ditemukan (maks 4) dari 4 — sama seperti game lain.
const buildDeck = (): Card[] => {
  const picked = shuffle([...POOL]).slice(0, 4);
  const deck = shuffle([...picked, ...picked]).map((emoji, idx) => ({
    id: idx,
    emoji,
    flipped: false,
    matched: false,
  }));
  return deck;
};

const MemoryGame: React.FC<MemoryGameProps> = ({ onFinish, onBack }) => {
  const [cards, setCards] = useState<Card[]>(() => buildDeck());
  const [firstPick, setFirstPick] = useState<number | null>(null);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const finishCalledRef = useRef(false);
  const { showConfirm } = useAlert();

  const pairsFound = cards.filter((c) => c.matched).length / 2;
  const finished = pairsFound === 4;

  const newRound = () => {
    setCards(buildDeck());
    setFirstPick(null);
    setLock(false);
    setMoves(0);
    setSaved(false);
    finishCalledRef.current = false;
  };

  const handleExit = () => {
    if (finished && !saved) {
      showConfirm('Hasil permainan ini belum disimpan. Keluar tanpa menyimpan?', onBack);
      return;
    }
    if (!finished && moves > 0) {
      showConfirm('Permainan belum selesai. Keluar sekarang akan menghilangkan progres permainan ini. Tetap keluar?', onBack);
      return;
    }
    onBack();
  };

  const handleNewRound = () => {
    if (finished && !saved) {
      showConfirm('Hasil permainan ini belum disimpan. Buat kartu baru tanpa menyimpan?', newRound);
      return;
    }
    if (!finished && moves > 0) {
      showConfirm('Mulai kartu baru akan mengulang permainan dari awal. Lanjutkan?', newRound);
      return;
    }
    newRound();
  };

  const handleSave = async () => {
    if (saving || finishCalledRef.current) return;
    setSaving(true);
    finishCalledRef.current = true;
    const result = await onFinish(4, 4);
    if (result === false) {
      finishCalledRef.current = false;
      setSaving(false);
      return;
    }
    setSaved(true);
    setSaving(false);
  };

  const flip = (idx: number) => {
    if (lock || finished) return;
    const card = cards[idx];
    if (card.flipped || card.matched) return;
    const next = cards.map((c, i) => (i === idx ? { ...c, flipped: true } : c));
    setCards(next);
    if (firstPick === null) {
      setFirstPick(idx);
      return;
    }
    setMoves((m) => m + 1);
    const first = cards[firstPick];
    if (first.emoji === card.emoji) {
      playAnswerSound(true);
      setCards(
        next.map((c, i) =>
          i === idx || i === firstPick ? { ...c, matched: true } : c,
        ),
      );
      setFirstPick(null);
    } else {
      playAnswerSound(false);
      setLock(true);
      window.setTimeout(() => {
        setCards((prev) =>
          prev.map((c, i) =>
            i === idx || i === firstPick ? { ...c, flipped: false } : c,
          ),
        );
        setFirstPick(null);
        setLock(false);
      }, 900);
    }
  };

  if (finished) {
    return (
      <div className="max-w-md sm:max-w-xl mx-auto w-full pb-8">
        <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in p-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Semua Pasangan Ketemu!</h2>
          <div className="text-9xl mb-2" aria-hidden="true">🧠</div>
          <p className="text-2xl font-semibold text-gray-700">
            Kamu menemukan 4 dari 4 pasangan dalam {moves} langkah
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={handleSave} disabled={saving || saved} variant="success" className="w-full min-h-[44px]">
              {saved ? 'Sudah Disimpan' : saving ? 'Menyimpan...' : 'Simpan & Kembali'}
            </Button>
            <Button onClick={handleNewRound} variant="secondary" className="w-full min-h-[44px]">
              Kartu Baru
            </Button>
            <Button onClick={onBack} variant="primary" className="w-full min-h-[44px]">
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md sm:max-w-xl mx-auto w-full pb-8">
      <div className="flex justify-between items-center mb-6 gap-2">
        <button
          onClick={handleExit}
          aria-label="Keluar dari permainan"
          className="min-h-[44px] px-3 text-gray-700 hover:text-gray-900 font-bold"
        >
          &larr; Keluar
        </button>
        <span className="font-bold text-gray-700 text-sm whitespace-nowrap">
          Pasangan: {pairsFound}/4 • Langkah: {moves}
        </span>
      </div>
      <div className="bg-purple-50 rounded-3xl shadow-xl p-4 sm:p-6 border-2 border-opacity-10 border-black mb-6">
        <h2 className="text-lg font-bold text-purple-800 mb-1">Kartu Memori</h2>
        <p className="text-xl font-bold text-purple-800 mb-4">
          Balik dua kartu, cari yang sama!
        </p>
        <div className="grid grid-cols-4 gap-3" role="group" aria-label="Kartu memori">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => flip(idx)}
              disabled={lock || card.matched}
              aria-label={card.flipped || card.matched ? `Kartu ${card.emoji}` : 'Kartu tertutup'}
              className={`min-h-[90px] sm:min-h-[110px] rounded-2xl shadow-lg flex items-center justify-center transition-all active:scale-95 ${
                card.flipped || card.matched
                  ? 'bg-white border-b-4 border-purple-200'
                  : 'bg-blue-500 border-b-4 border-blue-700 text-white'
              }`}
            >
              <span className="text-5xl sm:text-6xl">
                {card.flipped || card.matched ? card.emoji : '❓'}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={handleNewRound}
          aria-label="Mulai kartu baru"
          className="min-h-[44px] px-4 text-base font-bold text-indigo-700 hover:text-indigo-900 mx-auto"
        >
          Kartu Baru
        </button>
      </div>
    </div>
  );
};

export default MemoryGame;
