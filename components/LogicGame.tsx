import React, { useState, useEffect } from 'react';
import { DifficultyLevel, LogicQuestion } from '../types';
import { generateLogicQuestions } from '../constants';
import { Button, Card, ProgressBar } from './UI';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface LogicGameProps {
  difficulty: DifficultyLevel;
  onFinish: (score: number, total: number) => void;
  onBack: () => void;
}

const LogicGame: React.FC<LogicGameProps> = ({ difficulty, onFinish, onBack }) => {
  const [questions, setQuestions] = useState<LogicQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setQuestions(generateLogicQuestions(difficulty, 5));
  }, [difficulty]);

  const handleAnswer = (selected: string) => {
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
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in">
        <h2 className="text-4xl font-bold text-purple-600 mb-4">Permainan Selesai!</h2>
        <div className="text-9xl mb-4">🧩</div>
        <p className="text-2xl font-semibold text-gray-700">Skor Kamu: <span className="text-green-500 font-bold">{score}</span></p>
        <Button onClick={() => onFinish(score, 100)} variant="success">
          Simpan & Kembali
        </Button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 font-bold">
            &larr; Keluar
        </button>
        <div className="w-2/3">
             <ProgressBar current={currentIndex} total={questions.length} />
        </div>
        <span className="font-bold text-gray-600">{currentIndex + 1}/{questions.length}</span>
      </div>

      <Card className="mb-8 min-h-[300px] flex flex-col justify-center items-center" color="bg-purple-50">
        <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="text-yellow-500" />
            <h3 className="text-xl font-bold text-purple-800">{currentQ.question}</h3>
        </div>
        
        {/* Logic Sequence Display */}
        <div className="flex gap-2 sm:gap-4 mb-8 flex-wrap justify-center">
            {currentQ.sequence.map((item, idx) => (
                <div key={idx} className={`text-5xl sm:text-6xl ${item === '?' ? 'text-gray-300 font-bold' : ''} transition-transform hover:scale-110`}>
                    {item}
                </div>
            ))}
        </div>

        {/* Feedback Overlay */}
        {feedback && (
          <div className="absolute inset-0 bg-white/80 rounded-3xl flex items-center justify-center z-10 backdrop-blur-sm">
             {feedback === 'correct' ? (
               <div className="text-center animate-bounce">
                 <CheckCircle size={80} className="text-green-500 mx-auto" />
                 <p className="text-3xl font-bold text-green-600 mt-2">Pintar!</p>
               </div>
             ) : (
               <div className="text-center animate-shake">
                 <XCircle size={80} className="text-red-500 mx-auto" />
                 <p className="text-3xl font-bold text-red-600 mt-2">Hampir Benar!</p>
               </div>
             )}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {currentQ.options.map((opt, idx) => (
          <Button 
            key={idx} 
            onClick={() => handleAnswer(opt)} 
            className="text-4xl h-24"
            variant="secondary"
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LogicGame;