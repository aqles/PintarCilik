import React, { useMemo, useRef, useState } from 'react';
import { DifficultyLevel } from '../types';
import { READING_WORDS } from '../utils/readingGenerator';
import { shuffle } from '../utils/random';
import { speakIndonesian } from '../utils/speak';
import { useAlert } from '../context/AlertContext';
import { Button } from './UI';

interface ArrangeGameProps {
  difficulty: DifficultyLevel;
  onFinish: (correct: number, total: number) => Promise<boolean> | boolean | void;
  onBack: () => void;
}

interface WordItem {
  word: string;
  img: string;
}

// Game baru v2.2.0: Susun Kata.
// Gambar ditampilkan, huruf-hurufnya diacak; anak mengetuk huruf sesuai urutan.
// Huruf diperlakukan per tombol (bukan per huruf), jadi kata dengan huruf
// ganda seperti MATA tetap bisa disusun dengan benar.
const pickWords = (difficulty: DifficultyLevel): WordItem[] => {
  const pool = READING_WORDS.filter((w) =>
    difficulty === DifficultyLevel.MENENGAH
      ? w.word.length >= 4 && w.word.length <= 6
      : w.word.length >= 3 && w.word.length <= 4,
  );
  return shuffle([...pool]).slice(0, 5).map((w) => ({ word: w.word, img: w.img }));
};

const ArrangeGame: React.FC<ArrangeGameProps> = ({ difficulty, onFinish, onBack }) => {
  const [words, setWords] = useState<WordItem[]>(() => pickWords(difficulty));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<null | { correct: boolean }>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const finishCalledRef = useRef(false);
  const { showConfirm } = useAlert();

  const current = words[index];
  // Urutan tombol huruf diacak sekali per soal (bukan tiap render).
  const letterOrder = useMemo(
    () => shuffle(current.word.split('').map((_, i) => i)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, words],
  );

  const built = picked.map((i) => current.word[i]).join('');
  const complete = picked.length === current.word.length;

  const tapLetter = (btnIdx: number) => {
    if (feedback || picked.includes(btnIdx)) return;
    const next = [...picked, btnIdx];
    setPicked(next);
    if (next.length === current.word.length) {
      const isCorrect = next.map((i) => current.word[i]).join('') === current.word;
      if (isCorrect) setCorrect((c) => c + 1);
      setFeedback({ correct: isCorrect });
    }
  };

  const handleNext = () => {
    setPicked([]);
    setFeedback(null);
    if (index < words.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  };

  const newRound = () => {
    setWords(pickWords(difficulty));
    setIndex(0);
    setPicked([]);
    setFeedback(null);
    setCorrect(0);
    setFinished(false);
    setSaved(false);
    finishCalledRef.current = false;
  };

  const handleExit = () => {
    if (finished && !saved) {
      showConfirm('Hasil permainan ini belum disimpan. Keluar tanpa menyimpan?', onBack);
      return;
    }
    if (!finished && (index > 0 || picked.length > 0)) {
      showConfirm('Permainan belum selesai. Keluar sekarang akan menghilangkan progres permainan ini. Tetap keluar?', onBack);
      return;
    }
    onBack();
  };

  const handleSave = async () => {
    if (saving || finishCalledRef.current) return;
    setSaving(true);
    finishCalledRef.current = true;
    const result = await onFinish(correct, words.length);
    if (result === false) {
      finishCalledRef.current = false;
      setSaving(false);
      return;
    }
    setSaved(true);
    setSaving(false);
  };

  if (finished) {
    return (
      <div className="max-w-md sm:max-w-xl mx-auto w-full pb-8">
        <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in p-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Permainan Selesai!</h2>
          <div className="text-9xl mb-2" aria-hidden="true">🔤</div>
          <p className="text-2xl font-semibold text-gray-700">
            Kamu benar <span className="text-green-600 font-bold">{correct}</span> dari {words.length} kata
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={handleSave} disabled={saving || saved} variant="success" className="w-full min-h-[44px]">
              {saved ? 'Sudah Disimpan' : saving ? 'Menyimpan...' : 'Simpan & Kembali'}
            </Button>
            <Button onClick={newRound} variant="secondary" className="w-full min-h-[44px]">
              Kata Baru
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
          Kata {index + 1}/{words.length}
        </span>
      </div>
      <div className="bg-blue-50 rounded-3xl shadow-xl p-4 sm:p-6 border-2 border-opacity-10 border-black mb-6 text-center">
        <h2 className="text-lg font-bold text-blue-800 mb-1">Susun Kata</h2>
        <p className="text-xl font-bold text-blue-800 mb-2">Susun hurufnya jadi nama benda ini!</p>
        <div className="text-[5rem] leading-none mb-4" aria-hidden="true">
          {current.img.replace('emoji:', '')}
        </div>
        <div className="flex gap-2 justify-center flex-wrap mb-4" aria-label="Kata yang sedang disusun">
          {current.word.split('').map((_, i) => (
            <div
              key={i}
              className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl bg-white border-2 border-blue-200 flex items-center justify-center text-3xl font-bold text-blue-900"
            >
              {picked[i] !== undefined ? current.word[picked[i]] : ''}
            </div>
          ))}
        </div>
        {feedback ? (
          <div className={`rounded-2xl p-4 ${feedback.correct ? 'bg-green-100' : 'bg-red-50'}`} role="status">
            <p className={`text-2xl font-bold ${feedback.correct ? 'text-green-700' : 'text-red-700'}`}>
              {feedback.correct ? 'Betul! Hebat!' : `Belum tepat. Jawabannya: ${current.word}`}
            </p>
            <Button onClick={handleNext} variant="primary" className="mt-4 w-full min-h-[44px]">
              {index < words.length - 1 ? 'Kata Berikutnya' : 'Lihat Hasil'}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 justify-center flex-wrap">
              {letterOrder.map((letterIdx) => (
                <button
                  key={letterIdx}
                  onClick={() => tapLetter(letterIdx)}
                  disabled={picked.includes(letterIdx)}
                  aria-label={`Huruf ${current.word[letterIdx]}`}
                  className="min-w-[56px] min-h-[56px] sm:min-w-[64px] sm:min-h-[64px] px-2 rounded-2xl bg-blue-500 text-white text-3xl font-bold shadow-lg border-b-4 border-blue-700 active:scale-95 disabled:opacity-40"
                >
                  {current.word[letterIdx]}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => speakIndonesian('Susun huruf-huruf ini menjadi nama benda di gambar.')}
                variant="primary"
                className="flex-1 min-h-[44px]"
              >
                🔊 Dengar
              </Button>
              <Button
                onClick={() => setPicked([])}
                variant="secondary"
                className="flex-1 min-h-[44px] bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-400"
              >
                🧹 Ulangi
              </Button>
            </div>
          </>
        )}
      </div>
      <p className="text-center text-gray-500 font-medium">Kata yang sudah terpilih: {built || '—'}</p>
    </div>
  );
};

export default ArrangeGame;
