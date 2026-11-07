import React from 'react';
import { DifficultyLevel, ReadingQuestion } from '../types';
import { generateReadingQuestions } from '../utils/readingGenerator';
import { GameShell } from './GameShell';

interface ReadingGameProps {
  difficulty: DifficultyLevel;
  onFinish: (correct: number, total: number) => void;
  onBack: () => void;
}

function instructionFor(q: ReadingQuestion): string {
  if (q.type === 'MISSING_LETTER') return 'Lengkapi kata ini!';
  if (q.type === 'SCRAMBLE') return 'Susun menjadi kata yang benar!';
  if (q.type === 'MATCH_WORD') return 'Pilih gambar yang tepat!';
  if (q.type === 'FIRST_LETTER') return 'Huruf depannya apa?';
  if (q.type === 'OPPOSITE') return 'Apa lawan katanya?';
  if (q.type === 'SENTENCE') return 'Lengkapi kalimat ini!';
  return 'Pilih kata yang sesuai!';
}

function checkReading(q: ReadingQuestion, selected: string): boolean {
  if (q.type === 'MATCH_IMAGE' || q.type === 'SCRAMBLE') return selected === q.word;
  if (q.type === 'MATCH_WORD') return selected === q.image;
  if (q.type === 'FIRST_LETTER') return selected === q.word[0];
  return selected === q.missingLetter || selected === q.word;
}

function correctLabel(q: ReadingQuestion): string {
  if (q.type === 'MATCH_WORD') return q.image ? q.image.replace('emoji:', '') : q.word;
  if (q.type === 'FIRST_LETTER') return q.word[0];
  if (q.type === 'MISSING_LETTER' || q.type === 'OPPOSITE' || q.type === 'SENTENCE') return q.missingLetter ?? q.word;
  return q.word;
}

// Adapter tipis v2: logika permainan di GameShell; file ini hanya tampilan soal membaca.
const ReadingGame: React.FC<ReadingGameProps> = ({ difficulty, onFinish, onBack }) => {
  const effectiveDifficulty = difficulty === DifficultyLevel.MAHIR ? DifficultyLevel.MENENGAH : difficulty;

  return (
    <GameShell<ReadingQuestion>
      title="Membaca & Kata"
      color="blue"
      difficulty={effectiveDifficulty}
      generate={(d) => generateReadingQuestions(d, 5)}
      onFinish={onFinish}
      onBack={onBack}
      speakText={(q) => instructionFor(q)}
      correctAnswerLabel={correctLabel}
      checkAnswer={(q, selected) => checkReading(q, String(selected))}
      getOptions={(q) =>
        q.options.map((opt) => ({
          value: opt,
          label: opt.startsWith('emoji:') ? opt.replace('emoji:', '') : opt,
        }))
      }
      renderQuestion={(q) => (
        <div className="text-center w-full px-4">
          <h3 className="text-xl font-bold text-blue-800 mb-4">{instructionFor(q)}</h3>
          {q.type === 'MATCH_WORD' ? (
            <div className="text-5xl font-bold text-blue-900 mb-4 py-8">{q.word}</div>
          ) : q.type === 'SENTENCE' ? (
            <div className="text-2xl font-bold text-blue-900 mb-4 py-8 px-4 leading-relaxed">{q.word}</div>
          ) : q.type === 'OPPOSITE' ? (
            <div className="flex flex-col items-center">
              {q.image && <div className="text-[5rem] mb-2" aria-hidden="true">{q.image.replace('emoji:', '')}</div>}
              <div className="text-5xl font-bold text-blue-900 mb-4">{q.word}</div>
            </div>
          ) : (
            q.image && (
              q.image.startsWith('emoji:') ? (
                <div className="text-[6rem] leading-none mb-4" aria-hidden="true">{q.image.replace('emoji:', '')}</div>
              ) : (
                <img src={q.image} alt={q.word} className="w-32 h-32 object-cover rounded-xl shadow mb-4 mx-auto" />
              )
            )
          )}
          {q.type === 'MISSING_LETTER' && (
            <div className="text-5xl font-bold text-blue-900 mb-4">{q.word}</div>
          )}
          {q.type === 'SCRAMBLE' && (
            <div className="bg-white px-6 py-3 rounded-xl shadow-inner mb-4">
              <div className="text-3xl sm:text-4xl font-bold text-orange-600 tracking-wider">{q.scrambledWord}</div>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default ReadingGame;
