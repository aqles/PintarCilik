import { DifficultyLevel, UserProfile, GameResult } from './types';

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