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
        <div className="bg-white p-6 rounded-3xl inline-block shadow-xl mb-6 ring-8 ring-blue-50 animate-bounce-slow">
          <img src="/logo.svg" alt="PintarCilik Logo" className="w-24 h-24" />
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
          className="w-full text-lg py-4 group relative overflow-hidden"
          variant="google"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Masuk...</span>
          ) : (
            <span className="relative z-10 flex items-center justify-center gap-3 font-bold font-fredoka">
              {/* Google G Logo SVG */}
              <svg className="w-6 h-6" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              Masuk dengan Google
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