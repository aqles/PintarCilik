import React from 'react';
import { DifficultyLevel } from '../types';
import { generateSizeQuestions, sizeAnswer, SizeQuestion } from '../utils/sizeGenerator';
import { GameShell } from './GameShell';

interface SizeGameProps {
  difficulty: DifficultyLevel;
  onFinish: (correct: number, total: number) => void;
  onBack: () => void;
}

// Game baru v2.1.1: Besar & Kecil — lewat GameShell yang sama.
// Opsi selalu Kiri/Kanan; jawaban benar dihitung dari sisi benda besar/kecil.
const SizeGame: React.FC<SizeGameProps> = ({ difficulty, onFinish, onBack }) => {
  return (
    <GameShell<SizeQuestion>
      title="Besar & Kecil"
      color="orange"
      difficulty={difficulty}
      generate={() => generateSizeQuestions(5)}
      onFinish={onFinish}
      onBack={onBack}
      speakText={(q) => (q.ask === 'BESAR' ? 'Mana yang lebih besar?' : 'Mana yang lebih kecil?')}
      correctAnswerLabel={(q) => (sizeAnswer(q) === 'KIRI' ? 'Kiri' : 'Kanan')}
      checkAnswer={(q, selected) => selected === sizeAnswer(q)}
      getOptions={() => [
        { value: 'KIRI', label: 'Kiri' },
        { value: 'KANAN', label: 'Kanan' },
      ]}
      renderQuestion={(q) => {
        const leftBig = q.bigSide === 'KIRI';
        return (
          <div className="text-center w-full px-4">
            <h3 className="text-xl font-bold text-orange-800 mb-6">
              {q.ask === 'BESAR' ? 'Mana yang lebih BESAR?' : 'Mana yang lebih KECIL?'}
            </h3>
            <div className="flex items-center justify-center gap-10 sm:gap-16 mb-2">
              <div className="text-center">
                <div className={leftBig ? 'text-8xl sm:text-9xl' : 'text-3xl sm:text-4xl'} aria-hidden="true">
                  {q.emoji}
                </div>
                <p className="text-base font-bold text-gray-600 mt-3">◀ Kiri</p>
              </div>
              <div className="text-center">
                <div className={!leftBig ? 'text-8xl sm:text-9xl' : 'text-3xl sm:text-4xl'} aria-hidden="true">
                  {q.emoji}
                </div>
                <p className="text-base font-bold text-gray-600 mt-3">Kanan ▶</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};

export default SizeGame;
