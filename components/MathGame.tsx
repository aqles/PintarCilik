import React from 'react';
import { DifficultyLevel, MathQuestion } from '../types';
import { generateMathQuestions } from '../utils/mathGenerator';
import { GameShell } from './GameShell';
import { Star } from 'lucide-react';

interface MathGameProps {
  difficulty: DifficultyLevel;
  onFinish: (correct: number, total: number) => void;
  onBack: () => void;
}

// Adapter tipis v2: semua logika permainan tinggal di GameShell.
// File ini hanya tahu cara menampilkan soal matematika dan memeriksa jawaban.
const MathGame: React.FC<MathGameProps> = ({ difficulty, onFinish, onBack }) => {
  const effectiveDifficulty = difficulty === DifficultyLevel.MAHIR ? DifficultyLevel.MENENGAH : difficulty;

  return (
    <GameShell<MathQuestion>
      title="Berhitung & Angka"
      color="orange"
      difficulty={effectiveDifficulty}
      generate={(d) => generateMathQuestions(d, 5)}
      onFinish={onFinish}
      onBack={onBack}
      speakText={(q) => {
        if (q.type === 'COMPARE') return 'Bandingkan angka berikut. Mana yang lebih besar, lebih kecil, atau sama?';
        if (q.type === 'COUNT') return 'Ada berapa jumlah gambar ini? Hitung satu per satu ya.';
        if (q.type === 'SEQUENCE') return 'Lengkapi urutannya!';
        return q.question;
      }}
      correctAnswerLabel={(q) => String(q.answer)}
      checkAnswer={(q, selected) => selected === q.answer}
      getOptions={(q) => q.options.map((opt) => ({ value: opt, label: String(opt) }))}
      renderQuestion={(q) => {
        let categoryLabel = 'Matematika';
        if (q.type === 'COMPARE') categoryLabel = 'Lebih Besar / Kecil';
        if (q.type === 'SEQUENCE') categoryLabel = 'Pola Angka';
        if (q.type === 'DIV') categoryLabel = 'Pembagian';
        return (
          <div className="text-center w-full px-4">
            <p className="text-gray-700 text-sm font-semibold uppercase tracking-wider mb-2">{categoryLabel}</p>
            {q.type !== 'COMPARE' && q.type !== 'COUNT' ? (
              <div className="text-4xl sm:text-5xl font-bold text-orange-800 mb-6">
                {q.question.replace('Lengkapi: ', '').replace('Pola: ', '')}
              </div>
            ) : (
              <h3 className="text-3xl sm:text-4xl font-bold text-orange-800 mb-6">{q.question}</h3>
            )}
            {q.visualItems && q.visualItems.length > 0 && (
              <div className="flex gap-2 sm:gap-4 mb-2 flex-wrap justify-center max-w-[360px] sm:max-w-[440px] mx-auto" aria-label={`${q.visualItems[0].count} gambar untuk dihitung`}>
                {Array.from({ length: q.visualItems[0].count }).map((_, i) => {
                  const t = q.visualItems![0].type;
                  if (t.startsWith('emoji:')) return <span key={i} className="text-5xl sm:text-6xl">{t.replace('emoji:', '')}</span>;
                  if (t === 'apple') return <span key={i} className="text-5xl sm:text-6xl">🍎</span>;
                  if (t === 'ball') return <span key={i} className="text-5xl sm:text-6xl">⚽</span>;
                  if (t === 'flower') return <span key={i} className="text-5xl sm:text-6xl">🌸</span>;
                  return <Star key={i} size={42} className="text-yellow-400 fill-yellow-400" />;
                })}
              </div>
            )}
            {q.type === 'COMPARE' && (
              <div className="text-5xl font-bold text-gray-800 tracking-wider bg-white/50 px-6 py-4 rounded-2xl inline-block">
                {q.question}
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default MathGame;
