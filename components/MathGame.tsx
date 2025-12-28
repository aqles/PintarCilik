import React, { useState, useEffect } from 'react';
import { DifficultyLevel, MathQuestion } from '../types';
import { generateMathQuestions } from '../constants';
import { Button, Card, ProgressBar } from './UI';
import { Star, CheckCircle, XCircle } from 'lucide-react';

interface MathGameProps {
  difficulty: DifficultyLevel;
  onFinish: (score: number, total: number) => void;
  onBack: () => void;
}

const MathGame: React.FC<MathGameProps> = ({ difficulty, onFinish, onBack }) => {
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setQuestions(generateMathQuestions(difficulty, 5));
  }, [difficulty]);

  const handleAnswer = (selected: number | string) => {
    if (feedback !== null) return;

    const currentQ = questions[currentIndex];
    const isCorrect = selected === currentQ.answer;

    if (isCorrect) {
      setScore(s => s + 20);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(c => c + 1);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  if (questions.length === 0) return <div>Loading...</div>;

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in p-4">
        <h2 className="text-4xl font-bold text-purple-600 mb-4">Permainan Selesai!</h2>
        <div className="text-9xl mb-4 animate-bounce">🎉</div>
        <p className="text-2xl font-semibold text-gray-700">Skor Kamu: <span className="text-green-500 font-bold">{score}</span></p>
        <Button onClick={() => onFinish(score, 100)} variant="success" className="w-full max-w-xs">
          Simpan & Kembali
        </Button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  
  // Dynamic instruction based on type
  let instruction = currentQ.question;
  if (currentQ.type === 'COMPARE') {
      instruction = "Bandingkan angka berikut:";
  } else if (currentQ.type === 'COUNT') {
      instruction = currentQ.question;
  } else if (currentQ.type === 'SEQUENCE') {
      instruction = "Lengkapi urutannya!";
  }

  // Determine label category
  let categoryLabel = 'Matematika';
  if (currentQ.type === 'COMPARE') categoryLabel = 'Lebih Besar / Kecil';
  if (currentQ.type === 'SEQUENCE') categoryLabel = 'Pola Angka';
  if (currentQ.type === 'DIV') categoryLabel = 'Pembagian';

  return (
    <div className="max-w-md mx-auto w-full pb-8">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 font-bold">
            &larr; Keluar
        </button>
        <div className="w-1/2 sm:w-2/3">
             <ProgressBar current={currentIndex} total={questions.length} />
        </div>
        <span className="font-bold text-gray-600 text-sm">{currentIndex + 1}/{questions.length}</span>
      </div>

      <Card className="mb-6 min-h-[250px] flex flex-col justify-center items-center relative overflow-hidden" color="bg-orange-50">
        <div className="text-center z-10 w-full px-4">
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">{categoryLabel}</p>
            
            {/* Question Text Display */}
            {currentQ.type !== 'COMPARE' && currentQ.type !== 'COUNT' ? (
                <div className="text-4xl sm:text-5xl font-bold text-orange-800 mb-6 font-mono">
                    {currentQ.question.replace('Lengkapi: ', '').replace('Pola: ', '')}
                </div>
            ) : (
                <h3 className="text-3xl sm:text-4xl font-bold text-orange-800 mb-6">{instruction}</h3>
            )}
            
            {/* Visual Aid for Counting */}
            {currentQ.visualItems && (
              <div className="flex gap-2 sm:gap-4 mb-2 flex-wrap justify-center max-w-[300px] mx-auto">
                {Array.from({ length: currentQ.visualItems[0].count }).map((_, i) => (
                  <Star key={i} size={42} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                ))}
              </div>
            )}
            
            {/* Display for Comparison Question Body */}
            {currentQ.type === 'COMPARE' && (
                <div className="text-5xl font-bold text-gray-800 tracking-wider bg-white/50 px-6 py-4 rounded-2xl inline-block">
                    {currentQ.question}
                </div>
            )}
        </div>

        {/* Feedback Overlay */}
        {feedback && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20">
             {feedback === 'correct' ? (
               <>
                 <CheckCircle size={80} className="text-green-500 mb-2 animate-bounce" />
                 <p className="text-2xl font-bold text-green-600">Hebat!</p>
               </>
             ) : (
               <>
                 <XCircle size={80} className="text-red-500 mb-2 animate-shake" />
                 <p className="text-2xl font-bold text-red-600">Coba Lagi Ya!</p>
               </>
             )}
          </div>
        )}
      </Card>

      <div className={`grid ${currentQ.options.length > 2 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'} gap-3 sm:gap-4`}>
        {currentQ.options.map((opt, idx) => (
          <Button 
            key={idx} 
            onClick={() => handleAnswer(opt)} 
            className={`text-3xl h-20 sm:h-24 ${currentQ.options.length === 3 && idx === 2 ? 'col-span-2 sm:col-span-1' : ''}`}
            variant="primary"
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MathGame;