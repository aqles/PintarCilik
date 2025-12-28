import React, { useState } from 'react';
import { Button } from './UI';
import { Rocket, BookOpen, Star, Sparkles, Brain, LogIn, Loader2 } from 'lucide-react';
import { signInWithGoogle } from '../services/supabaseClient';

interface LandingPageProps {
  onStart: () => void; // Disimpen buat jaga-jaga kompatibilitas, meskipun sekarang udah pake auth.
}

const LandingPage: React.FC<LandingPageProps> = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // Abis login sukses, biasanya redirect otomatis kok.
    } catch (error) {
      alert("Gagal masuk. Coba lagi ya!");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-indigo-50 to-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Hiasan background biar makin kece (Floating) */}
      <div className="absolute top-10 left-10 text-yellow-400 opacity-60 animate-float pointer-events-none">
        <Star size={48} fill="currentColor" />
      </div>
      <div className="absolute bottom-20 right-10 text-purple-300 opacity-60 animate-float-delayed pointer-events-none">
        <Rocket size={64} />
      </div>
      <div className="absolute top-1/4 right-5 text-blue-200 opacity-50 animate-float pointer-events-none">
        <div className="text-6xl font-bold">123</div>
      </div>
      <div className="absolute bottom-1/3 left-5 text-green-200 opacity-50 animate-float-delayed pointer-events-none">
        <div className="text-6xl font-bold">ABC</div>
      </div>

      {/* Main Content */}
      <div className="max-w-md w-full text-center z-10 animate-fade-in-up">

        {/* Logo / Icon */}
        <div className="bg-white p-6 rounded-full inline-block shadow-xl mb-6 ring-8 ring-blue-50">
          <span className="text-6xl">🎓</span>
        </div>

        <h1 className="text-5xl font-bold text-indigo-900 mb-2 tracking-tight">
          Pintar<span className="text-blue-500">Cilik</span>
        </h1>
        <p className="text-gray-600 text-lg mb-8 font-medium">
          Belajar jadi petualangan seru! 🚀
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-3 gap-4 mb-10 px-2">
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm flex flex-col items-center">
            <BookOpen className="text-orange-500 mb-2" size={28} />
            <span className="text-xs font-bold text-gray-700">Membaca</span>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm flex flex-col items-center">
            <span className="text-green-500 mb-2 font-bold text-2xl leading-none font-mono">123</span>
            <span className="text-xs font-bold text-gray-700">Berhitung</span>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm flex flex-col items-center">
            <Brain className="text-purple-500 mb-2" size={28} />
            <span className="text-xs font-bold text-gray-700">Logika</span>
          </div>
        </div>

        <Button
          onClick={handleLogin}
          className="w-full text-xl py-4 shadow-blue-300 shadow-xl group relative overflow-hidden"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Masuk...</span>
          ) : (
            <span className="relative z-10 flex items-center justify-center gap-2">
              <LogIn size={20} /> Masuk dengan Google
            </span>
          )}
        </Button>

        <p className="mt-6 text-sm text-gray-400">
          Wajib login untuk menyimpan progress belajar
        </p>
      </div>
    </div>
  );
};

export default LandingPage;