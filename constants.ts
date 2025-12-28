import { DifficultyLevel, GameResult, MathQuestion, ReadingQuestion, LogicQuestion, UserProfile } from './types';

export const AVATAR_OPTIONS = [
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Nala",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=King",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Willow",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Ryan",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Easton",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Maria",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Nolan",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Priscilla"
];

export const MOCK_USER: UserProfile = {
  name: "Teman Baru",
  age: 4,
  level: DifficultyLevel.PEMULA,
  avatar: AVATAR_OPTIONS[0]
};

export const MOCK_HISTORY: GameResult[] = [];

// --- MATH GENERATOR ---
export const generateMathQuestions = (level: DifficultyLevel, count: number = 5): MathQuestion[] => {
  const questions: MathQuestion[] = [];
  
  for (let i = 0; i < count; i++) {
    let q: MathQuestion;
    const id = `m-${Date.now()}-${i}`;
    
    if (level === DifficultyLevel.PEMULA) {
      if (Math.random() > 0.4) {
        const num = Math.floor(Math.random() * 9) + 1;
        const options = [num, num + 1, Math.max(1, num - 1)].sort(() => Math.random() - 0.5);
        const visualType = Math.random() > 0.5 ? 'star' : 'apple';
        
        q = {
          id,
          question: "Ada berapa jumlah gambar ini?",
          answer: num,
          options: Array.from(new Set(options)),
          visualItems: [{ type: visualType, count: num }],
          type: 'COUNT'
        };
      } else {
        const start = Math.floor(Math.random() * 5) + 1;
        const missingIdx = Math.floor(Math.random() * 3); 
        const seq = [start, start + 1, start + 2];
        const ans = seq[missingIdx];
        seq[missingIdx] = -1; 
        
        const questionStr = seq.map(s => s === -1 ? '?' : s).join(' - ');
        const options = [ans, ans + 2, Math.max(1, ans - 1)].sort(() => Math.random() - 0.5);

        q = {
          id,
          question: `Lengkapi: ${questionStr}`,
          answer: ans,
          options: Array.from(new Set(options)),
          type: 'SEQUENCE'
        };
      }
    } else if (level === DifficultyLevel.MENENGAH) {
      const rand = Math.random();
      
      if (rand < 0.3) {
        const a = Math.floor(Math.random() * 10);
        const b = Math.floor(Math.random() * 10);
        const ans = a + b;
        const options = [ans, ans + 1, ans + 2, Math.max(0, ans - 1)].sort(() => Math.random() - 0.5).slice(0, 3);
        q = { id, question: `${a} + ${b} = ?`, answer: ans, options, type: 'ADD' };
      } else if (rand < 0.6) {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * a); 
        const ans = a - b;
        const options = [ans, ans + 1, Math.max(0, ans - 1)].sort(() => Math.random() - 0.5);
        q = { id, question: `${a} - ${b} = ?`, answer: ans, options, type: 'SUB' };
      } else if (rand < 0.8) {
        const a = Math.floor(Math.random() * 20);
        const b = Math.floor(Math.random() * 20);
        const ans = a > b ? '>' : (a < b ? '<' : '=');
        q = { id, question: `${a} ... ${b}`, answer: ans, options: ['>', '<', '='], type: 'COMPARE' };
      } else {
        const step = Math.floor(Math.random() * 2) + 2; 
        const start = step;
        const seq = [start, start + step, start + (step*2), start + (step*3)];
        const missingIdx = Math.floor(Math.random() * 4);
        const ans = seq[missingIdx];
        seq[missingIdx] = -1;
        
        q = {
          id,
          question: `Pola: ${seq.map(s => s === -1 ? '?' : s).join(', ')}`,
          answer: ans,
          options: [ans, ans + step, Math.abs(ans - step)].sort(() => Math.random() - 0.5),
          type: 'SEQUENCE'
        };
      }
    } else {
      const rand = Math.random();
      
      if (rand < 0.4) {
         const a = Math.floor(Math.random() * 9) + 2;
         const b = Math.floor(Math.random() * 5) + 1;
         const ans = a * b;
         q = { 
            id, 
            question: `${a} x ${b} = ?`, 
            answer: ans, 
            options: [ans, ans + a, ans - b].sort(() => Math.random() - 0.5), 
            type: 'MULT' 
         };
      } else if (rand < 0.7) {
         const b = Math.floor(Math.random() * 5) + 2;
         const ans = Math.floor(Math.random() * 5) + 1;
         const a = b * ans;
         q = {
            id,
            question: `${a} : ${b} = ?`,
            answer: ans,
            options: [ans, ans + 1, Math.max(1, ans - 1)].sort(() => Math.random() - 0.5),
            type: 'DIV'
         };
      } else {
         const a = Math.floor(Math.random() * 30) + 10;
         const b = Math.floor(Math.random() * 10) + 1;
         const ans = a - b;
         q = {
            id,
            question: `${a} - ${b} = ?`,
            answer: ans,
            options: [ans, ans + 2, ans - 2].sort(() => Math.random() - 0.5),
            type: 'SUB'
         };
      }
    }
    
    q.options = Array.from(new Set(q.options));
    while (q.options.length < 3 && typeof q.answer === 'number') {
        const r = Math.floor(Math.random() * 20) + 1;
        if (!q.options.includes(r) && r !== q.answer) q.options.push(r);
    }
    questions.push(q);
  }
  return questions;
};

// --- READING GENERATOR ---
export const generateReadingQuestions = (level: DifficultyLevel, count: number = 5): ReadingQuestion[] => {
   const questions: ReadingQuestion[] = [];
   
   const words = [
     { word: 'APEL', img: 'emoji:🍎' }, { word: 'PISANG', img: 'emoji:🍌' },
     { word: 'ANGGUR', img: 'emoji:🍇' }, { word: 'KUCING', img: 'emoji:🐱' },
     { word: 'ANJING', img: 'emoji:🐶' }, { word: 'MOBIL', img: 'emoji:🚗' },
     { word: 'BOLA', img: 'emoji:⚽' }, { word: 'BUKU', img: 'emoji:📚' },
     { word: 'RUMAH', img: 'emoji:🏠' }, { word: 'MATAHARI', img: 'emoji:☀️' }
   ];

   const opposites = [
     { word: 'BESAR', opposite: 'KECIL', img: 'emoji:🐘' },
     { word: 'PANAS', opposite: 'DINGIN', img: 'emoji:🔥' },
     { word: 'SIANG', opposite: 'MALAM', img: 'emoji:☀️' },
     { word: 'BUKA', opposite: 'TUTUP', img: 'emoji:📂' },
     { word: 'ATAS', opposite: 'BAWAH', img: 'emoji:⬆️' },
     { word: 'SENANG', opposite: 'SEDIH', img: 'emoji:😊' }
   ];

   const sentences = [
     { sentence: "Ikan berenang di ...", answer: "AIR", options: ["AIR", "TANAH", "API"] },
     { sentence: "Burung terbang di ...", answer: "LANGIT", options: ["LANGIT", "LAUT", "DALAM TANAH"] },
     { sentence: "Sapi makan ...", answer: "RUMPUT", options: ["RUMPUT", "BATU", "KAYU"] },
     { sentence: "Saya tidur di ...", answer: "KASUR", options: ["KASUR", "DAPUR", "KAMAR MANDI"] },
     { sentence: "Mobil punya empat ...", answer: "RODA", options: ["RODA", "KAKI", "SAYAP"] }
   ];

   for (let i = 0; i < count; i++) {
     const id = `r-${Date.now()}-${i}`;

     if (level === DifficultyLevel.PEMULA) {
        const rand = Math.random();
        const item = words[Math.floor(Math.random() * words.length)];
        
        if (rand < 0.4) {
           const distractors = words.filter(w => w.word !== item.word).sort(() => Math.random() - 0.5).slice(0, 2);
           const options = [item.word, ...distractors.map(d => d.word)].sort(() => Math.random() - 0.5);
           questions.push({ id, image: item.img, word: item.word, options, type: 'MATCH_IMAGE' });
        } else if (rand < 0.7) {
           const distractors = words.filter(w => w.word !== item.word).sort(() => Math.random() - 0.5).slice(0, 2);
           const options = [item.img, ...distractors.map(d => d.img)].sort(() => Math.random() - 0.5);
           questions.push({ id, word: item.word, image: item.img, options, type: 'MATCH_WORD' });
        } else {
           const firstChar = item.word[0];
           const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
           let opts = [firstChar];
           while(opts.length < 3) {
             const c = alphabet[Math.floor(Math.random() * 26)];
             if(!opts.includes(c)) opts.push(c);
           }
           questions.push({ 
             id, 
             image: item.img, 
             word: item.word, 
             options: opts.sort(() => Math.random() - 0.5), 
             type: 'FIRST_LETTER' 
           });
        }

     } else if (level === DifficultyLevel.MENENGAH) {
       const rand = Math.random();
       
       if (rand < 0.5) {
         const item = words[Math.floor(Math.random() * words.length)];
         const idx = Math.floor(Math.random() * item.word.length);
         const missingChar = item.word[idx];
         const display = item.word.substring(0, idx) + '_' + item.word.substring(idx+1);
         const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
         let opts = [missingChar];
         while(opts.length < 3) {
            const c = alphabet[Math.floor(Math.random() * 26)];
            if(!opts.includes(c)) opts.push(c);
         }
         questions.push({ id, word: display, missingLetter: missingChar, image: item.img, options: opts.sort(() => Math.random() - 0.5), type: 'MISSING_LETTER' });
       } else {
         const item = opposites[Math.floor(Math.random() * opposites.length)];
         const others = opposites.filter(o => o.opposite !== item.opposite).sort(() => Math.random() - 0.5).slice(0, 2);
         const options = [item.opposite, ...others.map(o => o.opposite)].sort(() => Math.random() - 0.5);
         
         questions.push({ 
            id, 
            word: item.word, 
            image: item.img, 
            options, 
            type: 'OPPOSITE',
            missingLetter: item.opposite // Store answer here to reuse validation logic
         });
       }
     } else {
       const rand = Math.random();
       if (rand < 0.5) {
          const item = words[Math.floor(Math.random() * words.length)];
          const scrambled = item.word.split('').sort(() => Math.random() - 0.5).join(' ');
          const distractor1 = item.word.split('').reverse().join('');
          const distractor2 = "SALAH"; 
          questions.push({ 
             id, 
             word: item.word, 
             scrambledWord: scrambled, 
             options: [item.word, distractor1, distractor2].sort(() => Math.random() - 0.5), 
             type: 'SCRAMBLE', 
             image: item.img 
          });
       } else {
          const item = sentences[Math.floor(Math.random() * sentences.length)];
          questions.push({
             id,
             word: item.sentence, 
             options: item.options.sort(() => Math.random() - 0.5),
             type: 'SENTENCE',
             image: 'emoji:📝',
             missingLetter: item.answer // Store answer here
          });
       }
     }
   }
   return questions;
};

export const generateLogicQuestions = (level: DifficultyLevel, count: number = 5): LogicQuestion[] => {
  const questions: LogicQuestion[] = [];
  const emojis = ['🍎', '🍌', '🍇', '🐶', '🐱', '🐭', '🚗', '✈️', '🚀', '⚽', '🏀', '🏈', '🏠', '🎈', '🎁'];

  for (let i = 0; i < count; i++) {
    const id = `l-${Date.now()}-${i}`;
    
    if (level === DifficultyLevel.PEMULA) {
      const mainEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      let diffEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      while(diffEmoji === mainEmoji) diffEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      const pos = Math.floor(Math.random() * 3); 
      const sequence = [mainEmoji, mainEmoji, mainEmoji];
      sequence[pos] = diffEmoji; 

      questions.push({
        id,
        question: "Mana yang berbeda?",
        sequence,
        answer: diffEmoji,
        options: [mainEmoji, diffEmoji].sort(() => Math.random() - 0.5),
        type: 'ODD_ONE_OUT'
      });
    } else {
      const a = emojis[Math.floor(Math.random() * emojis.length)];
      let b = emojis[Math.floor(Math.random() * emojis.length)];
      while(b === a) b = emojis[Math.floor(Math.random() * emojis.length)];
      
      let pattern: string[] = [];
      let answer = '';
      
      if (level === DifficultyLevel.MENENGAH) {
         pattern = [a, b, a, '?'];
         answer = b;
      } else {
         if (Math.random() > 0.5) {
            pattern = [a, a, b, a, a, '?'];
            answer = b;
         } else {
            let c = emojis[Math.floor(Math.random() * emojis.length)];
            while(c === a || c === b) c = emojis[Math.floor(Math.random() * emojis.length)];
            pattern = [a, b, c, a, b, '?'];
            answer = c;
         }
      }

      const wrongOption = emojis.find(e => e !== answer && e !== a && e !== b) || '❓';
      questions.push({
        id,
        question: "Apa urutan selanjutnya?",
        sequence: pattern,
        answer: answer,
        options: [answer, wrongOption, a === answer ? b : a].sort(() => Math.random() - 0.5),
        type: 'PATTERN'
      });
    }
  }
  return questions;
};