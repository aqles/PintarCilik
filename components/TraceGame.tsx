import React, { useEffect, useRef, useState } from 'react';
import { DifficultyLevel } from '../types';
import { shuffle } from '../utils/random';
import { speakIndonesian, stopSpeaking } from '../utils/speak';
import { useAlert } from '../context/AlertContext';
import { Button } from './UI';

interface TraceGameProps {
  difficulty: DifficultyLevel;
  onFinish: (correct: number, total: number) => Promise<boolean> | boolean | void;
  onBack: () => void;
}

const PEMULA_LETTERS = ['A', 'B', 'C', 'D', 'E', 'I', 'O', 'U'];
const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MIN_POINTS = 25;

// Game baru v2.2.0: Menulis Huruf (telusur).
// Huruf ditampilkan sebagai panduan putus-putus di kanvas; anak menelusurinya
// dengan jari (HP/tablet) atau mouse. Ini permainan latihan, bukan tes:
// tombol Lanjut hanya aktif setelah anak benar-benar menggambar (minimal
// 25 titik), dan skor akhir adalah jumlah huruf yang selesai ditelusuri.
const pickLetters = (difficulty: DifficultyLevel): string[] => {
  const pool = difficulty === DifficultyLevel.MENENGAH ? ALL_LETTERS : PEMULA_LETTERS;
  return shuffle([...pool]).slice(0, 5);
};

const TraceGame: React.FC<TraceGameProps> = ({ difficulty, onFinish, onBack }) => {
  const [letters, setLetters] = useState<string[]>(() => pickLetters(difficulty));
  const [index, setIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const finishCalledRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const { showAlert, showConfirm } = useAlert();

  const letter = letters[index];

  const drawGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 260px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.setLineDash([14, 12]);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeText(letter, canvas.width / 2, canvas.height / 2 + 10);
    ctx.setLineDash([]);
  };

  useEffect(() => {
    drawGuide();
    setPoints(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, letters]);

  useEffect(() => () => stopSpeaking(), []);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    drawingRef.current = true;
    canvas.setPointerCapture(e.pointerId);
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2563eb';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setPoints((p) => p + 1);
  };

  const handlePointerUp = () => {
    drawingRef.current = false;
  };

  const handleClear = () => {
    drawGuide();
    setPoints(0);
  };

  const handleNext = () => {
    if (points < MIN_POINTS) {
      showAlert('Gambar dulu hurufnya, yuk! Telusuri garis putus-putusnya.', 'info');
      return;
    }
    if (index < letters.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  };

  const newRound = () => {
    setLetters(pickLetters(difficulty));
    setIndex(0);
    setPoints(0);
    setFinished(false);
    setSaved(false);
    finishCalledRef.current = false;
  };

  const handleExit = () => {
    if (finished && !saved) {
      showConfirm('Hasil latihan ini belum disimpan. Keluar tanpa menyimpan?', onBack);
      return;
    }
    if (!finished && (index > 0 || points > 0)) {
      showConfirm('Latihan belum selesai. Keluar sekarang akan menghilangkan progres latihan ini. Tetap keluar?', onBack);
      return;
    }
    onBack();
  };

  const handleSave = async () => {
    if (saving || finishCalledRef.current) return;
    setSaving(true);
    finishCalledRef.current = true;
    const result = await onFinish(letters.length, letters.length);
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
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Hebat, Semua Huruf Selesai!</h2>
          <div className="text-9xl mb-2" aria-hidden="true">✏️</div>
          <p className="text-2xl font-semibold text-gray-700">
            Kamu menelusuri {letters.length} huruf: {letters.join(' • ')}
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={handleSave} disabled={saving || saved} variant="success" className="w-full min-h-[44px]">
              {saved ? 'Sudah Disimpan' : saving ? 'Menyimpan...' : 'Simpan & Kembali'}
            </Button>
            <Button onClick={newRound} variant="secondary" className="w-full min-h-[44px]">
              Huruf Baru
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
          aria-label="Keluar dari latihan"
          className="min-h-[44px] px-3 text-gray-700 hover:text-gray-900 font-bold"
        >
          &larr; Keluar
        </button>
        <span className="font-bold text-gray-700 text-sm whitespace-nowrap">
          Huruf {index + 1}/{letters.length}
        </span>
      </div>
      <div className="bg-orange-50 rounded-3xl shadow-xl p-4 sm:p-6 border-2 border-opacity-10 border-black mb-6 text-center">
        <h2 className="text-lg font-bold text-orange-800 mb-1">Menulis Huruf</h2>
        <p className="text-xl font-bold text-orange-800 mb-4">
          Telusuri huruf {letter} dengan jarimu!
        </p>
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          aria-label={`Kanvas untuk menelusuri huruf ${letter}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full max-w-[360px] mx-auto bg-white rounded-2xl border-2 border-orange-200 touch-none select-none"
        />
        <div className="flex gap-3 mt-4">
          <Button
            onClick={() => speakIndonesian(`Huruf ${letter}. Telusuri hurufnya, yuk!`)}
            variant="primary"
            className="flex-1 min-h-[44px]"
          >
            🔊 Dengar
          </Button>
          <Button onClick={handleClear} variant="secondary" className="flex-1 min-h-[44px] bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-400">
            🧹 Hapus
          </Button>
        </div>
      </div>
      <Button onClick={handleNext} variant="success" className="w-full min-h-[52px] text-xl">
        {index < letters.length - 1 ? 'Huruf Berikutnya ➜' : 'Selesai 🎉'}
      </Button>
    </div>
  );
};

export default TraceGame;
