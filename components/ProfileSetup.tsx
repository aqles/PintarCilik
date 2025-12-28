import React, { useState } from 'react';
import { UserProfile, DifficultyLevel } from '../types';
import { AVATAR_OPTIONS } from '../constants';
import { Button, Card } from './UI';
import { Check } from 'lucide-react';

interface ProfileSetupProps {
  onComplete: (user: UserProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(5);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    // Auto-determine difficulty based on age, user can change later
    let initialLevel = DifficultyLevel.PEMULA;
    if (age >= 5 && age <= 6) initialLevel = DifficultyLevel.MENENGAH;
    if (age >= 7) initialLevel = DifficultyLevel.MAHIR;

    const newUser: UserProfile = {
      name: name.trim(),
      age: age,
      level: initialLevel,
      avatar: selectedAvatar
    };

    onComplete(newUser);
  };

  return (
    <div className="max-w-md mx-auto w-full p-4 animate-fade-in-up">
      <Card className="text-center">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">Kenalan Yuk! 👋</h2>

        {/* Name Input */}
        <div className="mb-6 text-left">
          <label className="block text-gray-600 font-bold mb-2 ml-1">Siapa Namamu?</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tulis namamu disini..."
            className="w-full text-lg p-4 rounded-2xl border-2 border-indigo-100 focus:border-indigo-400 focus:outline-none bg-indigo-50 transition-colors placeholder:text-gray-300"
          />
        </div>

        {/* Age Selection */}
        <div className="mb-6 text-left">
           <label className="block text-gray-600 font-bold mb-2 ml-1">Berapa Umurmu?</label>
           <div className="flex justify-between items-center bg-indigo-50 p-2 rounded-2xl">
              <button 
                onClick={() => setAge(Math.max(3, age - 1))}
                className="w-12 h-12 bg-white rounded-xl shadow-sm text-2xl font-bold text-indigo-500 hover:bg-indigo-100 active:scale-95 transition-transform"
              >-</button>
              <span className="text-3xl font-bold text-indigo-700">{age} Tahun</span>
              <button 
                onClick={() => setAge(Math.min(10, age + 1))}
                className="w-12 h-12 bg-white rounded-xl shadow-sm text-2xl font-bold text-indigo-500 hover:bg-indigo-100 active:scale-95 transition-transform"
              >+</button>
           </div>
        </div>

        {/* Avatar Selection */}
        <div className="mb-8">
           <label className="block text-left text-gray-600 font-bold mb-3 ml-1">Pilih Fotomu:</label>
           <div className="grid grid-cols-3 gap-3">
              {AVATAR_OPTIONS.map((url, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedAvatar(url)}
                  className={`relative rounded-full p-1 transition-all transform hover:scale-105 ${selectedAvatar === url ? 'ring-4 ring-indigo-400 scale-105' : 'opacity-70 hover:opacity-100'}`}
                >
                  <img src={url} alt="Avatar" className="w-full rounded-full bg-gray-100" />
                  {selectedAvatar === url && (
                    <div className="absolute bottom-0 right-0 bg-indigo-500 text-white rounded-full p-1 border-2 border-white">
                        <Check size={12} strokeWidth={4} />
                    </div>
                  )}
                </button>
              ))}
           </div>
        </div>

        <Button 
          onClick={handleSubmit} 
          variant="success" 
          className="w-full text-xl py-4 shadow-green-200"
          disabled={!name.trim()}
        >
          Masuk & Main! 🚀
        </Button>

      </Card>
    </div>
  );
};

export default ProfileSetup;