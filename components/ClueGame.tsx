import React from 'react';
import { DifficultyLevel } from '../types';
import { generateClueQuestions, ClueQuestion } from '../utils/clueGenerator';
import { GameShell } from './GameShell';

interface ClueGameProps {
  difficulty: DifficultyLevel;
  onFinish: (correct: number, total: number) => void;
  onBack: () => void;
}

// Game baru v2.2.0: Tebak dari Ciri — lewat GameShell yang sama.
// Gambar sengaja tidak ditampilkan di soal; gambar baru muncul di feedback
// lewat label jawaban benar.
const ClueGame: React.FC<ClueGameProps> = ({ difficulty, onFinish, onBack }) => {
  return (
    <GameShell<ClueQuestion>
      title="Tebak dari Ciri"
      color="blue"
      difficulty={difficulty}
      generate={() => generateClueQuestions(5)}
      onFinish={onFinish}
      onBack={onBack}
      speakText={(q) => q.clue}
      correctAnswerLabel={(q) => `${q.answer} ${q.emoji}`}
      checkAnswer={(q, selected) => selected === q.answer}
      getOptions={(q) => q.options.map((opt) => ({ value: opt, label: opt }))}
      renderQuestion={(q) => (
        <div className="text-center w-full px-4">
          <h3 className="text-xl font-bold text-blue-800 mb-4">Siapakah aku?</h3>
          <p className="text-2xl font-semibold text-gray-800 leading-relaxed">{q.clue}</p>
          <p className="text-gray-500 mt-4">Tekan tombol Dengar untuk mendengar cirinya.</p>
        </div>
      )}
    />
  );
};

export default ClueGame;
