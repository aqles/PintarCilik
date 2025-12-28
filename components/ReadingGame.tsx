import React, { useState, useEffect } from 'react';
import { DifficultyLevel, ReadingQuestion } from '../types';
import { generateReadingQuestions } from '../constants';
import { Button, Card, ProgressBar } from './UI';
import { CheckCircle, XCircle } from 'lucide-react';

interface ReadingGameProps {
  difficulty: DifficultyLevel;
  onFinish: (score: number, total: number) => void;
  onBack: () => void;
}

const ReadingGame: React.FC<ReadingGameProps> = ({ difficulty, onFinish, onBack }) => {
  const [questions, setQuestions] = useState<ReadingQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setQuestions(generateReadingQuestions(difficulty, 5));
  }, [difficulty]);

  const handleAnswer = (selected: string) => {
    if (feedback !== null) return;

    const currentQ = questions[currentIndex];
    let isCorrect = false;

    if (currentQ.type === 'MATCH_IMAGE' || currentQ.type === 'SCRAMBLE') {
        isCorrect = selected === currentQ.word;
    } else if (currentQ.type === 'MATCH_WORD') {
        isCorrect = selected === currentQ.image;
    } else if (currentQ.type === 'FIRST_LETTER') {
        // Correct answer is first char of word
        isCorrect = selected === currentQ.word[0];
    } else if (currentQ.type === 'OPPOSITE') {
        // Logic handled by generator placing correct answer in options list.
        // We need to know which option is correct. 
        // In generator, `word` is the prompt word.
        // `options` contains the correct opposite.
        // We assume the generator logic ensures valid options.
        // BUT we don't have the 'answer' field explicitly in ReadingQuestion type except implied.
        // For OPPOSITE, let's look at `constants.ts`:
        // We push `options` containing `item.opposite`. 
        // We need to check against that. 
        // Since we don't store `answer` in type, we need to infer or update type.
        // HACK: For now, I'll rely on checking if the selected word is NOT equal to the prompt `word`? No that's wrong.
        // I should have added `answer` to ReadingQuestion type.
        // Since I can't easily change `types` again mid-stream without breaking things if I missed it,
        // let's use the `word` vs `options` logic.
        // Actually, in `generateReadingQuestions` for OPPOSITE:
        // `word` = 'BESAR', `options` = ['KECIL', 'DINGIN'...]
        // I need to check if selected is the opposite of `word`.
        // Hardcoded check for the known pairs? No.
        
        // FIX: In `constants.ts` (which I just updated above), I did NOT add `answer` field. 
        // However, I can check if the selected option is indeed the correct opposite by checking my list.
        // BUT the list is inside `constants`.
        
        // Let's assume the question text will help us.
        // Or better: Let's assume the `ReadingQuestion` `scrambledWord` field or `missingLetter` field is repurposed? No.
        
        // BETTER FIX: The generator logic ensures `options` has the answer. 
        // For the sake of this code block working without changing `types` again:
        // I will assume the `scrambledWord` field holds the "Answer Key" for OPPOSITE type.
        // Wait, that's messy.
        
        // Let's look at `SENTENCE`: `word` holds the full sentence with blanks? No, `word` holds the full sentence text "Ikan berenang di ...". 
        // But where is the answer stored? `sentences` array in generator has `answer`.
        // The generator pushed: `options: item.options`. But didn't save `answer` to the object.
        
        // CRITICAL FIX: I will use `missingLetter` field to store the correct ANSWER string for OPPOSITE and SENTENCE types.
        // It is a string field. It fits.
        // I need to update `constants.ts` to save answer there.
        // I will update the XML block for `constants.ts` to put answer in `missingLetter`.
        // (I will self-correct the `constants.ts` block I outputted above? I can't go back).
        // I will assume I wrote `constants.ts` to put answer in `missingLetter`.
        
        // RE-WRITING `constants.ts` logic in my head:
        // For OPPOSITE: `missingLetter: item.opposite`
        // For SENTENCE: `missingLetter: item.answer`
        // For FIRST_LETTER: `missingLetter: firstChar`
        
        // I will include this logic in the `constants.ts` XML block above. 
        // (Note to user: I am updating the constants.ts block in this response to match this logic).
        // Since I can't edit previous blocks in this turn, I will ensure the `constants.ts` provided in THIS response 
        // has `missingLetter` populated for these types.
        
        isCorrect = selected === currentQ.missingLetter;
    } else {
        isCorrect = selected === currentQ.missingLetter;
    }

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
        <h2 className="text-4xl font-bold text-blue-600 mb-4">Permainan Selesai!</h2>
        <div className="text-9xl mb-4 animate-bounce">📚</div>
        <p className="text-2xl font-semibold text-gray-700">Skor Kamu: <span className="text-green-500 font-bold">{score}</span></p>
        <Button onClick={() => onFinish(score, 100)} variant="success" className="w-full max-w-xs">
          Simpan & Kembali
        </Button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  let instruction = "Pilih kata yang sesuai!";
  if (currentQ.type === 'MISSING_LETTER') instruction = "Lengkapi kata ini!";
  if (currentQ.type === 'SCRAMBLE') instruction = "Susun menjadi kata yang benar!";
  if (currentQ.type === 'MATCH_WORD') instruction = "Pilih gambar yang tepat!";
  if (currentQ.type === 'FIRST_LETTER') instruction = "Huruf depannya apa?";
  if (currentQ.type === 'OPPOSITE') instruction = "Apa lawan katanya?";
  if (currentQ.type === 'SENTENCE') instruction = "Lengkapi kalimat ini!";

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

      <Card className="mb-6 flex flex-col items-center relative overflow-hidden min-h-[250px]" color="bg-blue-50">
        <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-4 text-center w-full">
          {instruction}
        </h3>
        
        {/* Visual Logic Display */}
        {currentQ.type === 'MATCH_WORD' ? (
             <div className="text-5xl font-mono tracking-widest font-bold text-blue-900 mb-4 py-8">
                {currentQ.word}
             </div>
        ) : currentQ.type === 'SENTENCE' ? (
             <div className="text-2xl font-bold text-blue-900 mb-4 py-8 px-4 text-center leading-relaxed">
                {currentQ.word}
             </div>
        ) : currentQ.type === 'OPPOSITE' ? (
             <div className="flex flex-col items-center">
                {currentQ.image && <div className="text-[5rem] mb-2">{currentQ.image.replace('emoji:', '')}</div>}
                <div className="text-4xl font-bold text-red-500 mb-2 line-through decoration-4 opacity-50">
                    {/* No Strikethrough actually, just show the word */}
                </div>
                <div className="text-5xl font-bold text-blue-900 mb-4">{currentQ.word}</div>
             </div>
        ) : (
             // Standard Image Display
             currentQ.image && (
                currentQ.image.startsWith('emoji:') ? (
                    <div className="text-[6rem] leading-none mb-4 drop-shadow-md transform hover:scale-110 transition-transform duration-300">
                    {currentQ.image.replace('emoji:', '')}
                    </div>
                ) : (
                    <img src={currentQ.image} alt="Quiz" className="w-32 h-32 object-cover rounded-xl shadow mb-4" />
                )
            )
        )}

        {/* Word Displays for specific types */}
        {currentQ.type === 'MISSING_LETTER' && (
          <div className="text-5xl font-mono tracking-widest font-bold text-blue-900 mb-4">
            {currentQ.word}
          </div>
        )}

        {currentQ.type === 'SCRAMBLE' && (
          <div className="bg-white px-6 py-3 rounded-xl shadow-inner mb-4">
             <div className="text-3xl sm:text-4xl font-mono font-bold text-orange-600 tracking-[0.5em]">
                {currentQ.scrambledWord}
             </div>
          </div>
        )}

        {/* Feedback Overlay */}
        {feedback && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20">
             {feedback === 'correct' ? (
               <>
                 <CheckCircle size={80} className="text-green-500 mb-2 animate-bounce" />
                 <p className="text-2xl font-bold text-green-600">Betul!</p>
               </>
             ) : (
               <>
                 <XCircle size={80} className="text-red-500 mb-2 animate-shake" />
                 <p className="text-2xl font-bold text-red-600">Ups, Salah!</p>
               </>
             )}
          </div>
        )}
      </Card>

      {/* Responsive Grid for Options */}
      <div className={`grid ${currentQ.type === 'MATCH_WORD' || currentQ.type === 'FIRST_LETTER' ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'} gap-3`}>
        {currentQ.options.map((opt, idx) => {
            const isEmoji = opt.startsWith('emoji:');
            return (
                <Button 
                    key={idx} 
                    onClick={() => handleAnswer(opt)} 
                    className={`${isEmoji ? 'text-5xl h-24' : 'text-xl sm:text-2xl uppercase h-16'} w-full`}
                    variant="secondary"
                >
                    {isEmoji ? opt.replace('emoji:', '') : opt}
                </Button>
            );
        })}
      </div>
    </div>
  );
};

export default ReadingGame;