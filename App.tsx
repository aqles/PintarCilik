import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile, DifficultyLevel, GameResult } from './types';
import { MOCK_USER, MOCK_HISTORY } from './constants';
import { Button, Card } from './components/UI';
import MathGame from './components/MathGame';
import ReadingGame from './components/ReadingGame';
import LogicGame from './components/LogicGame';
import ReportView from './components/ReportView';
import LandingPage from './components/LandingPage';
import ProfileSetup from './components/ProfileSetup';
import { BookOpen, Calculator, Trophy, Brain, GraduationCap, Star, LogOut, Loader2 } from 'lucide-react';

// Auth & DB
import { supabase, signOut } from './services/supabaseClient';
import { saveGameResult, upsertUserProfile, getUserHistory, getUserProfile } from './services/dbService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [user, setUser] = useState<UserProfile | null>(null); // Start null to force setup
  const [history, setHistory] = useState<GameResult[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Kalo login sukses, load data user dari DB.
        // Kalo belum setting profile di local, kita lanjut ke setup.
        loadUserData(session.user.id);
      } else {
        setLoading(false);
        setView('LANDING');
      }
    });

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadUserData(session.user.id);
      } else {
        setView('LANDING');
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    // 1. Ambil history game
    const dbHistory = await getUserHistory(userId);
    setHistory(dbHistory);

    // 2. Ambil profile user
    const dbProfile = await getUserProfile(userId);

    setLoading(false);

    // Logika Routing:
    if (dbProfile) {
      // User lama -> langsung ke Dashboard
      setUser(dbProfile);
      setView('HOME');
    } else {
      // User baru (atau belum set profile) -> ke Setup
      setView('PROFILE_SETUP');
    }
  };

  const handleLogout = async () => {
    await signOut();
    setView('LANDING');
    setUser(null);
  };

  // Set Level
  const setLevel = (level: DifficultyLevel) => {
    if (!user) return; // Eh, user-nya mana?
    const updatedUser = { ...user, level };
    setUser(updatedUser);
    if (session) {
      upsertUserProfile(session.user.id, updatedUser);
    }
  };

  const handleProfileComplete = (newUser: UserProfile) => {
    setUser(newUser);
    if (session) {
      upsertUserProfile(session.user.id, newUser);
    }
    setView('HOME');
  };

  const handleFinishGame = async (score: number, total: number, category: 'BERHITUNG' | 'MEMBACA' | 'LOGIKA') => {
    if (!user) return;

    const result: GameResult = {
      date: new Date().toISOString(),
      score: (score / total) * 100,
      totalQuestions: 100, // kita normalisasi jadi skala 100
      category,
      difficulty: user.level
    };

    setHistory(prev => [...prev, result]);

    // Save to DB
    if (session) {
      await saveGameResult(session.user.id, result);
    }

    setView('HOME');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  // Main Home View (Dashboard)
  const renderHome = () => {
    if (!user) return null;

    return (
      <div className="max-w-md mx-auto w-full animate-fade-in pb-10">
        {/* Header Profile */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt="Avatar" className="w-14 h-14 rounded-full border-4 border-yellow-400 shadow-md bg-white" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Halo, {user.name}!</h1>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span>Level: <span className="font-bold text-indigo-600">{user.level}</span></span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setView('REPORT')} className="bg-white p-2.5 rounded-2xl shadow-sm text-purple-500 hover:bg-purple-50 transition border border-purple-100" title="Laporan">
              <Trophy size={24} />
            </button>
            <button onClick={handleLogout} className="bg-red-50 p-2.5 rounded-2xl shadow-sm text-red-500 hover:bg-red-100 transition border border-red-100" title="Keluar">
              <LogOut size={24} />
            </button>
          </div>
        </div>

        {/* Level Selector */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6 flex justify-between gap-2">
          {[DifficultyLevel.PEMULA, DifficultyLevel.MENENGAH, DifficultyLevel.MAHIR].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all ${user.level === lvl
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Hero Card */}
        <Card color="bg-gradient-to-r from-blue-500 to-indigo-500" className="text-white mb-8 border-none shadow-indigo-200 shadow-lg transform transition-transform hover:scale-[1.02] duration-300">
          <h2 className="text-2xl font-bold mb-1">Mulai Belajar Yuk!</h2>
          <p className="opacity-90 mb-0 text-sm">Pilih permainan favoritmu di bawah ini.</p>
        </Card>

        {/* Game Menu */}
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => setView('GAME_READING')}
            className="bg-white hover:bg-orange-50 p-5 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-orange-200 flex items-center gap-4 transition-all active:scale-95 group animate-fade-in-up delay-100"
          >
            <div className="bg-orange-100 p-3 rounded-2xl group-hover:bg-orange-200 transition-colors">
              <BookOpen size={32} className="text-orange-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Membaca & Kata</h3>
              <p className="text-gray-400 text-xs">Kenali huruf, benda & kata</p>
            </div>
          </button>

          <button
            onClick={() => setView('GAME_MATH')}
            className="bg-white hover:bg-green-50 p-5 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-green-200 flex items-center gap-4 transition-all active:scale-95 group animate-fade-in-up delay-200"
          >
            <div className="bg-green-100 p-3 rounded-2xl group-hover:bg-green-200 transition-colors">
              <Calculator size={32} className="text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Berhitung & Angka</h3>
              <p className="text-gray-400 text-xs">Penjumlahan & matematika</p>
            </div>
          </button>

          <button
            onClick={() => setView('GAME_LOGIC')}
            className="bg-white hover:bg-purple-50 p-5 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-purple-200 flex items-center gap-4 transition-all active:scale-95 group animate-fade-in-up delay-300"
          >
            <div className="bg-purple-100 p-3 rounded-2xl group-hover:bg-purple-200 transition-colors">
              <Brain size={32} className="text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Logika & Pola</h3>
              <p className="text-gray-400 text-xs">Asah otak & ketelitian</p>
            </div>
          </button>
        </div>

        {/* Footer Decoration */}
        <div className="mt-12 text-center opacity-30 animate-fade-in delay-300">
          <GraduationCap size={32} className="mx-auto mb-2" />
          <p className="text-xs font-semibold">PintarCilik v2.1</p>
        </div>
      </div>
    )
  };

  return (
    <div className={`min-h-screen font-fredoka text-gray-800 selection:bg-yellow-200 ${view !== 'LANDING' ? 'bg-[#f8fafc] px-4 py-6' : ''}`}>
      {view === 'LANDING' && (
        <LandingPage onStart={() => { }} />
      )}

      {view === 'PROFILE_SETUP' && (
        <ProfileSetup onComplete={handleProfileComplete} />
      )}

      {view === 'HOME' && renderHome()}

      {view === 'GAME_MATH' && user && (
        <MathGame
          difficulty={user.level}
          onFinish={(s, t) => handleFinishGame(s, t, 'BERHITUNG')}
          onBack={() => setView('HOME')}
        />
      )}

      {view === 'GAME_READING' && user && (
        <ReadingGame
          difficulty={user.level}
          onFinish={(s, t) => handleFinishGame(s, t, 'MEMBACA')}
          onBack={() => setView('HOME')}
        />
      )}

      {view === 'GAME_LOGIC' && user && (
        <LogicGame
          difficulty={user.level}
          onFinish={(s, t) => handleFinishGame(s, t, 'LOGIKA')}
          onBack={() => setView('HOME')}
        />
      )}

      {view === 'REPORT' && user && (
        <ReportView
          history={history}
          user={user}
          onBack={() => setView('HOME')}
        />
      )}
    </div>
  );
};

export default App;