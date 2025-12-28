export enum DifficultyLevel {
  PEMULA = 'PEMULA', // Usia 3-4 (TK A)
  MENENGAH = 'MENENGAH', // Usia 5-6 (TK B)
  MAHIR = 'MAHIR' // Usia 7+ (SD 1)
}

export interface UserProfile {
  name: string;
  age: number;
  level: DifficultyLevel;
  avatar: string;
}

export interface GameResult {
  date: string;
  score: number;
  totalQuestions: number;
  category: 'MEMBACA' | 'BERHITUNG' | 'LOGIKA';
  difficulty: DifficultyLevel;
}

export interface MathQuestion {
  id: string;
  question: string;
  answer: number | string; 
  options: (number | string)[];
  visualItems?: { type: string; count: number }[];
  type?: 'COUNT' | 'ADD' | 'SUB' | 'COMPARE' | 'MULT' | 'DIV' | 'SEQUENCE';
}

export interface ReadingQuestion {
  id: string;
  image?: string;
  word: string;
  scrambledWord?: string;
  missingLetter?: string;
  options: string[]; 
  type: 'MATCH_IMAGE' | 'MATCH_WORD' | 'MISSING_LETTER' | 'SCRAMBLE' | 'FIRST_LETTER' | 'OPPOSITE' | 'SENTENCE';
}

export interface LogicQuestion {
  id: string;
  question: string;
  sequence: string[];
  answer: string;
  options: string[];
  type: 'ODD_ONE_OUT' | 'PATTERN';
}

export type ViewState = 'LANDING' | 'PROFILE_SETUP' | 'HOME' | 'GAME_MATH' | 'GAME_READING' | 'GAME_LOGIC' | 'REPORT';