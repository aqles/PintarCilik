import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DifficultyLevel } from '../types';
import { Button, Card, ProgressBar } from './UI';
import { Bell, BellOff, CheckCircle, Volume2, XCircle } from 'lucide-react';
import { useAlert } from '../context/AlertContext';
import { scorePercent } from '../utils/validate';
import { speakIndonesian, stopSpeaking } from '../utils/speak';
import { isSoundEnabled, playAnswerSound, setSoundEnabled } from '../utils/sound';

export interface GameOption {
  value: string | number;
  label: string;
}

export interface GameShellProps<Q> {
  title: string;
  /** Warna kartu soal: 'orange' | 'blue' | 'purple' */
  color: 'orange' | 'blue' | 'purple';
  difficulty: DifficultyLevel;
  generate: (difficulty: DifficultyLevel) => Q[];
  renderQuestion: (question: Q) => React.ReactNode;
  getOptions: (question: Q) => GameOption[];
  checkAnswer: (question: Q, selected: string | number) => boolean;
  correctAnswerLabel: (question: Q) => string;
  /** Teks yang dibacakan TTS — instruksi saja, BUKAN jawaban. */
  speakText: (question: Q) => string;
  /** Mengembalikan false bila penyimpanan gagal, agar tombol Simpan bisa dicoba lagi. */
  onFinish: (correct: number, total: number) => boolean | Promise<boolean> | void;
  onBack: () => void;
}

const CARD_COLORS = {
  orange: 'bg-orange-50',
  blue: 'bg-blue-50',
  purple: 'bg-purple-50',
} as const;

const TITLE_COLORS = {
  orange: 'text-orange-800',
  blue: 'text-blue-800',
  purple: 'text-purple-800',
} as const;

/**
 * GameShell v2 — satu-satunya tempat logika permainan tinggal.
 * Aturan yang dijaga di sini (bukan di tiap game):
 * - Skor = jumlah jawaban benar pada percobaan pertama / jumlah soal.
 *   Tidak ada lagi +20 dan tidak ada total hardcode 100.
 * - Tidak ada auto-lanjut pakai timer. Jawaban salah menampilkan jawaban
 *   benar dan tombol Lanjut; anak belajar, bukan sekadar dinilai.
 * - Tombol jawaban dinonaktifkan selama feedback, jadi tap ganda tidak hilang.
 * - Keluar / soal baru di tengah permainan harus dikonfirmasi.
 * - Tombol Simpan hanya bisa diklik sekali; hasil yang belum disimpan
 *   tidak boleh dibuang diam-diam oleh tombol soal baru.
 * - TTS gratis (browser) bersifat opt-in per tap, dan dihentikan saat
 *   soal berganti atau komponen dilepas.
 */
export function GameShell<Q extends { id: string }>(props: GameShellProps<Q>) {
  const { difficulty, generate, onFinish, onBack } = props;
  const [questions, setQuestions] = useState<Q[]>(() => generate(difficulty));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; selected: string | number } | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const { showConfirm } = useAlert();
  const finishCalledRef = useRef(false);

  useEffect(() => {
    stopSpeaking();
    setQuestions(generate(difficulty));
    setCurrentIndex(0);
    setCorrect(0);
    setFeedback(null);
    setIsFinished(false);
    setSaved(false);
    finishCalledRef.current = false;
    // generate sengaja tidak dimasukkan ke deps: ia stabil per game.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  useEffect(() => () => stopSpeaking(), []);

  const startNewRound = useCallback(() => {
    stopSpeaking();
    setQuestions(generate(difficulty));
    setCurrentIndex(0);
    setCorrect(0);
    setFeedback(null);
    setIsFinished(false);
    setSaved(false);
    finishCalledRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const handleExit = () => {
    const inProgress = !isFinished && (currentIndex > 0 || correct > 0);
    if (inProgress) {
      showConfirm('Permainan belum selesai. Keluar sekarang akan menghilangkan progres permainan ini. Tetap keluar?', onBack);
    } else {
      onBack();
    }
  };

  const handleNewQuestions = () => {
    if (isFinished && !saved) {
      showConfirm('Hasil permainan ini belum disimpan. Buat soal baru tanpa menyimpan?', startNewRound);
      return;
    }
    if (!isFinished && (currentIndex > 0 || correct > 0)) {
      showConfirm('Mulai soal baru akan mengulang permainan dari awal. Lanjutkan?', startNewRound);
      return;
    }
    startNewRound();
  };

  const handleAnswer = (selected: string | number) => {
    if (feedback !== null) return;
    const currentQ = questions[currentIndex];
    const isCorrect = props.checkAnswer(currentQ, selected);
    if (isCorrect) setCorrect((c) => c + 1);
    playAnswerSound(isCorrect);
    setFeedback({ correct: isCorrect, selected });
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((c) => c + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleSave = async () => {
    if (saving || finishCalledRef.current) return;
    setSaving(true);
    finishCalledRef.current = true;
    const result = await onFinish(correct, questions.length);
    if (result === false) {
      // Penyimpanan gagal: biarkan anak/orang tua mencoba lagi, jangan
      // menandai sudah tersimpan dan jangan menavigasi pergi.
      finishCalledRef.current = false;
      setSaving(false);
      return;
    }
    setSaved(true);
    setSaving(false);
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-md sm:max-w-xl mx-auto w-full pb-8 text-center" role="status">
        <p className="text-xl font-bold text-gray-700 mb-4">Memuat soal...</p>
        <Button onClick={startNewRound} variant="primary">Coba Lagi</Button>
      </div>
    );
  }

  if (isFinished) {
    const percent = scorePercent(correct, questions.length);
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in p-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Permainan Selesai!</h2>
        <img src="/perayaan.webp" alt="Maskot PintarCilik merayakan keberhasilanmu" className="w-48 h-48 rounded-3xl object-cover mb-2 shadow-md" />
        <p className="text-2xl font-semibold text-gray-700">
          Kamu benar <span className="text-green-600 font-bold">{correct}</span> dari {questions.length} soal
        </p>
        <p className="text-xl font-bold text-indigo-600">Skor: {percent}</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button onClick={handleSave} disabled={saving || saved} variant="success" className="w-full min-h-[44px]">
            {saved ? 'Sudah Disimpan' : saving ? 'Menyimpan...' : 'Simpan & Kembali'}
          </Button>
          <Button onClick={handleNewQuestions} variant="secondary" className="w-full min-h-[44px]">
            Soal Baru
          </Button>
          <Button onClick={onBack} variant="primary" className="w-full min-h-[44px]">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const options = props.getOptions(currentQ);

  return (
    <div className="max-w-md sm:max-w-xl mx-auto w-full pb-8">
      <div className="flex justify-between items-center mb-6 gap-2">
        <button
          onClick={handleExit}
          aria-label="Keluar dari permainan"
          className="min-h-[44px] min-w-[44px] px-3 text-gray-700 hover:text-gray-900 font-bold"
        >
          &larr; Keluar
        </button>
        <div className="flex-1">
          <ProgressBar current={currentIndex} total={questions.length} />
        </div>
        <span className="font-bold text-gray-700 text-sm whitespace-nowrap">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      <Card className="mb-6 min-h-[250px] flex flex-col justify-center items-center relative overflow-hidden" color={CARD_COLORS[props.color]}>
        <div className="w-full mb-2">
          <h2 className={`text-lg font-bold ${TITLE_COLORS[props.color]}`}>{props.title}</h2>
          <div className="flex gap-2 justify-end mt-1">
            <button
              onClick={() => {
                const next = !soundOn;
                setSoundOn(next);
                setSoundEnabled(next);
              }}
              aria-label={soundOn ? 'Matikan bunyi jawaban' : 'Nyalakan bunyi jawaban'}
              aria-pressed={soundOn}
              title={soundOn ? 'Bunyi jawaban: nyala' : 'Bunyi jawaban: mati'}
              className="min-h-[44px] px-3 flex items-center gap-1.5 rounded-full bg-white shadow text-indigo-600 hover:bg-indigo-50"
            >
              {soundOn ? <Bell size={22} /> : <BellOff size={22} />}
              <span className="text-sm font-bold">Bunyi</span>
            </button>
            <button
              onClick={() => speakIndonesian(props.speakText(currentQ))}
              aria-label="Dengarkan instruksi soal"
              title="Dengarkan instruksi soal"
              className="min-h-[44px] px-3 flex items-center gap-1.5 rounded-full bg-white shadow text-indigo-600 hover:bg-indigo-50"
            >
              <Volume2 size={22} />
              <span className="text-sm font-bold">Dengar</span>
            </button>
          </div>
        </div>

        {props.renderQuestion(currentQ)}

        {feedback && (
          <div className="mt-4 w-full" role="status" aria-live="polite">
            <div className={`rounded-2xl p-4 text-center ${feedback.correct ? 'bg-green-100' : 'bg-red-50'}`}>
              {feedback.correct ? (
                <>
                  <CheckCircle size={48} className="text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-700">Betul! Hebat!</p>
                </>
              ) : (
                <>
                  <XCircle size={48} className="text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-700">Belum tepat.</p>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    Jawaban yang benar: {props.correctAnswerLabel(currentQ)}
                  </p>
                </>
              )}
              <Button onClick={handleNext} variant="primary" className="mt-4 w-full min-h-[44px]">
                {currentIndex < questions.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil'}
              </Button>
            </div>
          </div>
        )}
      </Card>

      <div className={`grid ${options.every((o) => typeof o.label === 'string' && (/^[\p{Extended_Pictographic}\uFE0F]+$/u.test(o.label) || o.label.length <= 2)) ? 'grid-cols-3' : (options.length > 2 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2')} gap-3 sm:gap-4`}>
        {options.map((opt, idx) => {
          const label = String(opt.label);
          // Ikon/emoji dan jawaban pendek (angka, huruf, >, <, =) dibuat BESAR agar
          // mudah ditekan anak di HP/tablet; kata panjang tetap ukuran baca yang aman.
          const sizeClass = /^[\p{Extended_Pictographic}\uFE0F]+$/u.test(label)
            ? 'text-6xl sm:text-7xl'
            : label.length <= 2
              ? 'text-5xl sm:text-6xl'
              : label.length <= 4
                ? 'text-3xl sm:text-4xl'
                : 'text-2xl sm:text-3xl leading-snug break-words';
          return (
            <Button
              key={`${currentQ.id}-${idx}`}
              onClick={() => handleAnswer(opt.value)}
              disabled={feedback !== null}
              aria-label={`Jawaban: ${opt.label}`}
              className={`${sizeClass} min-h-[110px] sm:min-h-[130px] px-2 disabled:opacity-50`}
              variant="primary"
            >
              {opt.label}
            </Button>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleNewQuestions}
          aria-label="Mulai soal baru"
          className="min-h-[44px] px-4 text-base font-bold text-indigo-700 hover:text-indigo-900 mx-auto"
        >
          Soal Baru
        </button>
      </div>
    </div>
  );
}

export default GameShell;
