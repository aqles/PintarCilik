import React from 'react';
import { DifficultyLevel } from '../types';
import { generateLetterQuestions, LetterQuestion } from '../utils/letterGenerator';
import { GameShell } from './GameShell';

interface LetterGameProps {
  difficulty: DifficultyLevel;
  onFinish: (correct: number, total: number) => void;
  onBack: () => void;
}

// Game baru v2.1: Huruf & Benda — huruf besar ditampilkan, anak memilih gambar
// benda yang namanya diawali huruf itu. Logika permainan tetap di GameShell.
const LetterGame: React.FC<LetterGameProps> = ({ difficulty, onFinish, onBack }) => {
  return (
    <GameShell<LetterQuestion>
      title="Huruf & Benda"
      color="blue"
      difficulty={difficulty}
      generate={(d) => generateLetterQuestions(d, 5)}
      onFinish={onFinish}
      onBack={onBack}
      speakText={(q) => `Huruf ${q.letter}. Benda apa yang diawali huruf ${q.letter}?`}
      correctAnswerLabel={(q) => q.image.replace('emoji:', '')}
      checkAnswer={(q, selected) => selected === q.image}
      getOptions={(q) =>
        q.options.map((opt) => ({
          value: opt,
          label: opt.startsWith('emoji:') ? opt.replace('emoji:', '') : opt,
        }))
      }
      renderQuestion={(q) => (
        <div className="text-center w-full px-4">
          <h3 className="text-xl font-bold text-blue-800 mb-4">
            Benda apa yang diawali huruf ini?
          </h3>
          <div className="text-[6rem] leading-none font-bold text-blue-900 mb-4">
            {q.letter}
          </div>
          <p className="text-gray-700 font-semibold">
            Tekan tombol speaker untuk mendengar hurufnya.
          </p>
        </div>
      )}
    />
  );
};

export default LetterGame;
