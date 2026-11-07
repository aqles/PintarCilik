import React from 'react';
import { DifficultyLevel, LogicQuestion } from '../types';
import { generateLogicQuestions } from '../utils/logicGenerator';
import { GameShell } from './GameShell';
import { Lightbulb } from 'lucide-react';

interface LogicGameProps {
  difficulty: DifficultyLevel;
  onFinish: (correct: number, total: number) => void;
  onBack: () => void;
}

// Adapter tipis v2: logika permainan di GameShell; file ini hanya tampilan pola.
const LogicGame: React.FC<LogicGameProps> = ({ difficulty, onFinish, onBack }) => {
  const effectiveDifficulty = difficulty === DifficultyLevel.MAHIR ? DifficultyLevel.MENENGAH : difficulty;

  return (
    <GameShell<LogicQuestion>
      title="Logika & Pola"
      color="purple"
      difficulty={effectiveDifficulty}
      generate={(d) => generateLogicQuestions(d, 5)}
      onFinish={onFinish}
      onBack={onBack}
      speakText={(q) => q.question}
      correctAnswerLabel={(q) => q.answer}
      checkAnswer={(q, selected) => selected === q.answer}
      getOptions={(q) => q.options.map((opt) => ({ value: opt, label: opt }))}
      renderQuestion={(q) => (
        <div className="text-center w-full px-4">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Lightbulb className="text-yellow-500" />
            <h3 className="text-xl font-bold text-purple-800">{q.question}</h3>
          </div>
          <div className="flex gap-2 sm:gap-4 mb-4 flex-wrap justify-center" aria-label={`Urutan: ${q.sequence.join(', ')}`}>
            {q.sequence.map((item, idx) => (
              <div key={idx} className={`text-5xl sm:text-6xl ${item === '?' ? 'text-purple-700 font-bold' : ''}`}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
};

export default LogicGame;
