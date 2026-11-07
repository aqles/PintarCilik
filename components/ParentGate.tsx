import React, { useState } from 'react';
import { Button } from './UI';

interface ParentGateProps {
  onUnlock: () => void;
  onCancel: () => void;
}

// Gerbang Orang Tua v2.2.0: soal tambah sederhana untuk dewasa, supaya anak
// tidak nyasar ke Laporan/Profil atau mengubah level tanpa sengaja.
// Bukan keamanan sungguhan (tidak ada PIN rahasia) — hanya gesekan yang cukup
// untuk anak PAUD, dan sekali dibuka berlaku selama sesi login ini saja.
const ParentGate: React.FC<ParentGateProps> = ({ onUnlock, onCancel }) => {
  const [question] = useState(() => {
    const a = Math.floor(Math.random() * 10) + 6;
    const b = Math.floor(Math.random() * 10) + 6;
    const ans = a + b;
    const options = [ans, ans + 2, Math.max(0, ans - 2)].sort(() => Math.random() - 0.5);
    return { a, b, ans, options };
  });
  const [wrong, setWrong] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full text-center">
        <p className="text-5xl mb-3" aria-hidden="true">🔒</p>
        <h3 className="text-2xl font-bold text-indigo-700 mb-2">Area Orang Tua</h3>
        <p className="text-gray-600 mb-4 font-medium">
          Jawab soal ini untuk lanjut, supaya anak tidak nyasar ke sini.
        </p>
        <p className="text-4xl font-bold text-gray-800 mb-4">
          {question.a} + {question.b} = ?
        </p>
        {wrong && (
          <p className="text-red-600 font-bold mb-3" role="status">
            Belum tepat, coba lagi ya.
          </p>
        )}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {question.options.map((opt) => (
            <Button
              key={opt}
              onClick={() => (opt === question.ans ? onUnlock() : setWrong(true))}
              variant="primary"
              className="text-2xl min-h-[64px]"
            >
              {opt}
            </Button>
          ))}
        </div>
        <Button onClick={onCancel} variant="secondary" className="w-full min-h-[44px] bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-400">
          Batal
        </Button>
      </div>
    </div>
  );
};

export default ParentGate;
