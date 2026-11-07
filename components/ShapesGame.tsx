import React from 'react';
import { DifficultyLevel } from '../types';
import { generateShapeQuestions, ShapeQuestion } from '../utils/shapesGenerator';
import { GameShell } from './GameShell';

interface ShapesGameProps {
  difficulty: DifficultyLevel;
  onFinish: (correct: number, total: number) => void;
  onBack: () => void;
}

// Game baru v2.1.1: Warna & Bentuk — lewat GameShell yang sama.
const ShapesGame: React.FC<ShapesGameProps> = ({ difficulty, onFinish, onBack }) => {
  return (
    <GameShell<ShapeQuestion>
      title="Warna & Bentuk"
      color="purple"
      difficulty={difficulty}
      generate={(d) => generateShapeQuestions(d, 5)}
      onFinish={onFinish}
      onBack={onBack}
      speakText={(q) =>
        q.options[0]?.startsWith('emoji:')
          ? `Warna atau bentuk apa yang bernama ${q.word}?`
          : `Warna atau bentuk apa ini?`
      }
      correctAnswerLabel={(q) =>
        q.options[0]?.startsWith('emoji:') ? q.image.replace('emoji:', '') : q.word
      }
      checkAnswer={(q, selected) =>
        q.options[0]?.startsWith('emoji:') ? selected === q.image : selected === q.word
      }
      getOptions={(q) =>
        q.options.map((opt) => ({
          value: opt,
          label: opt.startsWith('emoji:') ? opt.replace('emoji:', '') : opt,
        }))
      }
      renderQuestion={(q) => (
        <div className="text-center w-full px-4">
          <h3 className="text-xl font-bold text-purple-800 mb-4">
            {q.options[0]?.startsWith('emoji:')
              ? `Cari gambar: ${q.word}`
              : q.kind === 'COLOR'
                ? 'Warna apa ini?'
                : 'Bentuk apa ini?'}
          </h3>
          {!q.options[0]?.startsWith('emoji:') && (
            <div className="text-[6rem] leading-none mb-2" aria-hidden="true">
              {q.image.replace('emoji:', '')}
            </div>
          )}
          {q.options[0]?.startsWith('emoji:') && (
            <p className="text-5xl font-bold text-purple-900 mb-2">{q.word}</p>
          )}
        </div>
      )}
    />
  );
};

export default ShapesGame;
