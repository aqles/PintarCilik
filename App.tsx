import React, { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { ViewState, UserProfile, DifficultyLevel, GameResult } from './types';
import { Button, Card } from './components/UI';
import MathGame from './components/MathGame';
import ReadingGame from './components/ReadingGame';
import LogicGame from './components/LogicGame';
import LetterGame from './components/LetterGame';
import ProfilePage from './components/ProfilePage';
import ParentGate from './components/ParentGate';
import { applyAccessSettings, loadAccessSettings } from './utils/access';
import ShapesGame from './components/ShapesGame';
import SizeGame from './components/SizeGame';
import MemoryGame from './components/MemoryGame';
import TraceGame from './components/TraceGame';
import ArrangeGame from './components/ArrangeGame';
import ClueGame from './components/ClueGame';
import StoriesView from './components/StoriesView';
const ReportView = lazy(() => import('./components/ReportView'));
import LandingPage from './components/LandingPage';
import ProfileSetup from './components/ProfileSetup';
import PrivacyPolicy from './components/PrivacyPolicy';
import AboutUs from './components/AboutUs';
import { BookOpen, Calculator, Trophy, Brain, GraduationCap, Star, LogOut, Loader2, Type, Pencil, Palette, Ruler, LayoutGrid, Flame, PenLine, SpellCheck, Search, BookOpenText } from 'lucide-react';
import { useAlert } from './context/AlertContext';
import { scorePercent, validateLevel } from './utils/validate';

import { supabase, signOut } from './services/supabaseClient';
import { saveGameResult, upsertUserProfile, getUserHistory, getUserProfile } from './services/dbService';

/** v2, usia 4–6: MAHIR (7+) tidak ditawarkan; profil lama MAHIR dipetakan ke MENENGAH. */
function normalizeLevel(level: unknown): DifficultyLevel {
  const valid = validateLevel(level);
  return valid === DifficultyLevel.MAHIR ? DifficultyLevel.MENENGAH : valid;
}

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);
  const [session, setSession] = useState<any>(null);
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [gatePending, setGatePending] = useState<'REPORT' | 'PROFILE' | 'LEVEL' | null>(null);
  const [pendingLevel, setPendingLevel] = useState<DifficultyLevel | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { showAlert } = useAlert();
  const loadInFlightRef = useRef<string | null>(null);
  const loadTokenRef = useRef(0);
  const viewRef = useRef<ViewState>('LANDING');
  const userRef = useRef<UserProfile | null>(null);
  useEffect(() => { viewRef.current = view; }, [view]);
  useEffect(() => { userRef.current = user; }, [user]);

  useEffect(() => {
    applyAccessSettings(loadAccessSettings());
  }, []);

  useEffect(() => {
    let cancelled = false;
    // Guard: load yang sama tidak boleh jalan dua kali (getSession + onAuthStateChange
    // sama-sama memicu load pada awalnya di v1).
    const loadOnce = (userId: string) => {
      if (loadInFlightRef.current === userId) return;
      loadInFlightRef.current = userId;
      loadUserData(userId, loadTokenRef.current).finally(() => {
        if (loadInFlightRef.current === userId) loadInFlightRef.current = null;
      });
    };

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (cancelled) return;
        setSession(session);
        if (session) {
          loadOnce(session.user.id);
        } else {
          setLoading(false);
          setView('LANDING');
        }
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
        setLoadError(true);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        if (userRef.current) {
          // Sudah login: ini kemungkinan refresh token / kembali dari background.
          // JANGAN pindah ke HOME — anak sedang main game. Muat ulang data saja.
          loadUserData(session.user.id, loadTokenRef.current, { silent: true });
        } else {
          loadOnce(session.user.id);
        }
      } else {
        loadTokenRef.current += 1; // Batalkan load lama yang mungkin masih berjalan.
        setView('LANDING');
        setUser(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
    // loadUserData didefinisikan di bawah; pemanggilan awal hanya sekali di sini.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserData = async (userId: string, token?: number, opts?: { silent?: boolean }) => {
    const myToken = token ?? loadTokenRef.current;
    setLoadError(false);
    try {
      const [dbHistory, profileResult] = await Promise.all([
        getUserHistory(userId),
        getUserProfile(userId),
      ]);
      if (myToken !== loadTokenRef.current) return; // Sudah logout / sesi berganti.
      setHistory(dbHistory);
      setLoading(false);
      if (opts?.silent) {
        // Muat ulang latar: perbarui user bila ada, tapi jangan pindah layar apa pun.
        if (profileResult.kind === 'ok') {
          setUser({ ...profileResult.profile, level: normalizeLevel(profileResult.profile.level) });
        }
        return;
      }
      if (profileResult.kind === 'error') {
        // JANGAN arahkan ke PROFILE_SETUP: itu bisa menimpa profil lama.
        setLoadError(true);
        return;
      }
      if (profileResult.kind === 'ok') {
        setUser({ ...profileResult.profile, level: normalizeLevel(profileResult.profile.level) });
        // Hanya pindah ke HOME dari layar awal/setup. Kalau user sedang main game
        // (atau di laporan), layar itu dipertahankan — load ini bukan navigasi.
        if (viewRef.current === 'LANDING' || viewRef.current === 'PROFILE_SETUP') {
          setView('HOME');
        }
      } else {
        setView('PROFILE_SETUP');
      }
    } catch {
      if (myToken !== loadTokenRef.current) return;
      setLoading(false);
      setLoadError(true);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setView('LANDING');
    setUser(null);
    setParentUnlocked(false);
    setGatePending(null);
    setPendingLevel(null);
  };

  const openParentArea = (area: 'REPORT' | 'PROFILE') => {
    if (parentUnlocked) {
      setView(area);
    } else {
      setGatePending(area);
    }
  };

  const handleLevelTap = (lvl: DifficultyLevel) => {
    if (parentUnlocked) {
      setLevel(lvl);
    } else {
      setPendingLevel(lvl);
      setGatePending('LEVEL');
    }
  };

  const handleGateUnlock = () => {
    const pending = gatePending;
    setGatePending(null);
    setParentUnlocked(true);
    if (pending === 'REPORT' || pending === 'PROFILE') {
      setView(pending);
    } else if (pending === 'LEVEL' && pendingLevel) {
      setLevel(pendingLevel);
      setPendingLevel(null);
    }
  };

  const setLevel = async (level: DifficultyLevel) => {
    if (!user) return;
    const previous = user;
    const updatedUser = { ...user, level };
    setUser(updatedUser);
    if (session) {
      const ok = await upsertUserProfile(session.user.id, updatedUser);
      if (!ok) {
        setUser(previous);
        showAlert('Gagal menyimpan level. Coba lagi.', 'error');
      }
    }
  };

  const handleProfileUpdate = async (updated: UserProfile): Promise<boolean> => {
    if (!user) return false;
    const previous = user;
    setUser(updated);
    if (session) {
      const ok = await upsertUserProfile(session.user.id, updated);
      if (!ok) {
        setUser(previous);
        showAlert('Gagal menyimpan profil. Periksa koneksi, lalu coba lagi.', 'error');
        return false;
      }
    }
    return true;
  };

  const handleProfileComplete = async (newUser: UserProfile) => {
    const normalized = { ...newUser, level: normalizeLevel(newUser.level) };
    setUser(normalized);
    if (session) {
      const ok = await upsertUserProfile(session.user.id, normalized);
      if (!ok) {
        showAlert('Gagal menyimpan profil. Profil belum tersimpan, coba lagi.', 'error');
        return;
      }
    }
    setView('HOME');
  };

  const handleFinishGame = async (
    correct: number,
    total: number,
    category: 'BERHITUNG' | 'MEMBACA' | 'LOGIKA',
  ): Promise<boolean> => {
    if (!user) return false;
    const result: GameResult = {
      date: new Date().toISOString(),
      score: scorePercent(correct, total),
      totalQuestions: total,
      category,
      difficulty: user.level,
    };
    if (session) {
      const ok = await saveGameResult(session.user.id, result);
      if (!ok) {
        showAlert('Gagal menyimpan hasil permainan. Periksa koneksi, lalu tekan Simpan lagi.', 'error');
        return false;
      }
    }
    setHistory((prev) => [...prev, result]);
    setView('HOME');
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 gap-4" role="status">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="text-lg font-bold text-gray-700">Memuat...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Gagal memuat data</h1>
        <p className="text-gray-700 max-w-sm">
          Koneksi atau data bermasalah. Profilmu tidak diubah — coba muat ulang, jangan membuat profil baru dulu.
        </p>
        <Button
          onClick={() => {
            if (session) {
              setLoading(true);
              loadUserData(session.user.id);
            } else {
              setView('LANDING');
            }
          }}
          variant="primary"
        >
          Coba Lagi
        </Button>
      </div>
    );
  }

  const renderHome = () => {
    if (!user) return null;
    const stars = history.filter((h) => h.score >= 80).length;
    const avgScore = history.length > 0
      ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length)
      : 0;
    const todayKey = new Date().toLocaleDateString('en-CA');
    const todayCount = history.filter((h) => new Date(h.date).toLocaleDateString('en-CA') === todayKey).length;
    const missionTarget = 3;
    const missionDone = todayCount >= missionTarget;
    // Streak: hitung mundur hari berturut-turut ada permainan, mulai hari ini
    // (atau kemarin bila hari ini belum main — streak belum putus).
    const daySet = new Set(history.map((h) => new Date(h.date).toLocaleDateString('en-CA')));
    let streak = 0;
    const cursor = new Date();
    if (!daySet.has(todayKey)) cursor.setDate(cursor.getDate() - 1);
    while (daySet.has(cursor.toLocaleDateString('en-CA'))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return (
      <div className="max-w-md sm:max-w-xl mx-auto w-full animate-fade-in pb-10">
        <div className="flex items-center justify-between mb-6 pt-4">
          <button onClick={() => openParentArea('PROFILE')} aria-label="Ubah profil" className="flex items-center gap-3 text-left rounded-2xl active:scale-95 transition-transform">
            <img src={user.avatar} alt={`Avatar ${user.name}`} className="w-14 h-14 rounded-full border-4 border-yellow-400 shadow-md bg-white" />
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-1.5">
                Halo, {user.name}!
                <Pencil size={16} className="text-indigo-400" aria-hidden="true" />
              </h1>
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span>
                  Level: <span className="font-bold text-indigo-600">{user.level}</span>
                </span>
              </div>
              <p className="text-xs text-indigo-500 font-bold mt-0.5">Ketuk untuk ubah profil</p>
            </div>
          </button>
          <div className="flex gap-2">
            <button onClick={() => openParentArea('REPORT')} aria-label="Lihat laporan" className="min-h-[44px] min-w-[44px] bg-white p-2.5 rounded-2xl shadow-sm text-purple-500 hover:bg-purple-50 transition border border-purple-100">
              <Trophy size={24} />
            </button>
            <button onClick={handleLogout} aria-label="Keluar dari akun" className="min-h-[44px] min-w-[44px] bg-red-50 p-2.5 rounded-2xl shadow-sm text-red-500 hover:bg-red-100 transition border border-red-100">
              <LogOut size={24} />
            </button>
          </div>
        </div>

        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6 flex justify-between gap-2" role="group" aria-label="Pilih level">
          {[DifficultyLevel.PEMULA, DifficultyLevel.MENENGAH].map((lvl) => (
            <button
              key={lvl}
              onClick={() => handleLevelTap(lvl)}
              aria-pressed={user.level === lvl}
              className={`flex-1 min-h-[44px] px-1 rounded-xl text-sm font-bold transition-all ${
                user.level === lvl ? 'bg-indigo-500 text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {user.level === lvl ? `✓ ${lvl}` : lvl}
            </button>
          ))}
        </div>

        <Card color="bg-gradient-to-r from-blue-500 to-indigo-500" className="text-white mb-8 border-none shadow-indigo-200 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">Mulai Belajar Yuk!</h2>
              <p className="opacity-90 mb-0 text-base">Pilih permainan favoritmu di bawah ini.</p>
            </div>
            <img src="/maskot-pintarcilik.webp" alt="Maskot PintarCilik, burung hantu yang ramah" className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 shadow-md" />
          </div>
          {stars > 0 && (
            <p className="mt-2 text-base font-bold">⭐ {stars} bintang dari permainan dengan skor 80+</p>
          )}
        </Card>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Perjalananku 🏅</h3>
          <div className="grid grid-cols-3 gap-2 text-center mb-4">
            <div>
              <p className="text-2xl font-bold text-indigo-600">{history.length}</p>
              <p className="text-xs font-bold text-gray-500">Permainan</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">{history.length > 0 ? `${avgScore}` : '—'}</p>
              <p className="text-xs font-bold text-gray-500">Rata-rata Skor</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
                <Flame size={20} className="text-orange-500" />{streak}
              </p>
              <p className="text-xs font-bold text-gray-500">Hari Beruntun</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">
              {missionDone
                ? '🎉 Misi hari ini selesai! Hebat!'
                : `🎯 Misi hari ini: main ${todayCount}/${missionTarget} permainan`}
            </p>
            <div className="flex flex-wrap gap-2 mt-4" aria-label="Lencana">
              {[
                { emoji: '👣', name: 'Langkah Pertama', desc: 'Main 1 permainan', earned: history.length >= 1 },
                { emoji: '⭐', name: 'Pemburu Bintang', desc: '5 permainan skor 80+', earned: stars >= 5 },
                { emoji: '💯', name: 'Nilai Sempurna', desc: 'Pernah skor 100', earned: history.some((h) => h.score >= 100) },
                { emoji: '🔥', name: 'Rajin 3 Hari', desc: 'Streak 3 hari', earned: streak >= 3 },
                { emoji: '🏆', name: 'Seminggu Penuh', desc: 'Streak 7 hari', earned: streak >= 7 },
              ].map((b) => (
                <span
                  key={b.name}
                  title={b.desc}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold ${
                    b.earned ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <span aria-hidden="true">{b.emoji}</span> {b.name}
                </span>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mt-4" role="progressbar" aria-valuemin={0} aria-valuemax={missionTarget} aria-valuenow={Math.min(todayCount, missionTarget)} aria-label={`Misi hari ini: ${todayCount} dari ${missionTarget} permainan`}>
              <div
                className="bg-yellow-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (todayCount / missionTarget) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-3">Permainan 🎮</h3>
        <h4 className="text-lg font-bold text-gray-800 mt-4 mb-3 flex items-center gap-3">
          <img src="/area-membaca.webp" alt="" aria-hidden="true" className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
          Membaca 📖
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={() => setView('GAME_READING')} className="min-h-[44px] bg-white hover:bg-orange-50 p-5 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-orange-200 flex items-center gap-4 transition-all active:scale-95">
            <div className="bg-orange-100 p-3 rounded-2xl">
              <BookOpen size={32} className="text-orange-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Membaca & Kata</h3>
              <p className="text-gray-600 text-sm">Kenali huruf, benda & kata</p>
            </div>
          </button>
          <button onClick={() => setView('GAME_LETTER')} className="min-h-[44px] bg-white hover:bg-cyan-50 p-5 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-cyan-200 flex items-center gap-4 transition-all active:scale-95">
            <div className="bg-cyan-100 p-3 rounded-2xl">
              <Type size={32} className="text-cyan-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Huruf & Benda</h3>
              <p className="text-gray-600 text-sm">Cari benda dari huruf depannya</p>
            </div>
          </button>
          <button onClick={() => setView('GAME_TRACE')} className="min-h-[44px] bg-white hover:bg-orange-50 p-5 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-orange-200 flex items-center gap-4 transition-all active:scale-95">
            <div className="bg-orange-100 p-3 rounded-2xl">
              <PenLine size={32} className="text-orange-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Menulis Huruf</h3>
              <p className="text-gray-600 text-sm">Telusuri huruf dengan jarimu</p>
            </div>
          </button>
          <button onClick={() => setView('GAME_ARRANGE')} className="min-h-[44px] bg-white hover:bg-sky-50 p-5 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-sky-200 flex items-center gap-4 transition-all active:scale-95">
            <div className="bg-sky-100 p-3 rounded-2xl">
              <SpellCheck size={32} className="text-sky-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Susun Kata</h3>
              <p className="text-gray-600 text-sm">Urutkan huruf jadi kata</p>
            </div>
          </button>
          <button onClick={() => setView('GAME_CLUE')} className="min-h-[44px] bg-white hover:bg-lime-50 p-5 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-lime-200 flex items-center gap-4 transition-all active:scale-95">
            <div className="bg-lime-100 p-3 rounded-2xl">
              <Search size={32} className="text-lime-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Tebak dari Ciri</h3>
              <p className="text-gray-600 text-sm">Siapakah aku? Tebak dari cirinya</p>
            </div>
          </button>
        </div>
        <h4 className="text-lg font-bold text-gray-800 mt-8 mb-3 flex items-center gap-3">
          <img src="/area-berhitung.webp" alt="" aria-hidden="true" className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
          Berhitung & Ukuran 🔢
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={() => setView('GAME_MATH')} className="min-h-[44px] bg-white hover:bg-green-50 p-5 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-green-200 flex items-center gap-4 transition-all active:scale-95">
            <div className="bg-green-100 p-3 rounded-2xl">
              <Calculator size={32} className="text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Berhitung & Angka</h3>
              <p className="text-gray-600 text-sm">Menghitung, tambah, dan kurang</p>
            </div>
          </button>
          <button onClick={() => setView('GAME_SIZE')} className="min-h-[44px] bg-white hover:bg-amber-50 p-5 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-amber-200 flex items-center gap-4 transition-all active:scale-95">
            <div className="bg-amber-100 p-3 rounded-2xl">
              <Ruler size={32} className="text-amber-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Besar & Kecil</h3>
              <p className="text-gray-600 text-sm">Mana yang lebih besar?</p>
            </div>
          </button>
        </div>
        <h4 className="text-lg font-bold text-gray-800 mt-8 mb-3 flex items-center gap-3">
          <img src="/area-logika.webp" alt="" aria-hidden="true" className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
          Logika & Bentuk 🧩
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={() => setView('GAME_LOGIC')} className="min-h-[44px] bg-white hover:bg-purple-50 p-5 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-purple-200 flex items-center gap-4 transition-all active:scale-95">
            <div className="bg-purple-100 p-3 rounded-2xl">
              <Brain size={32} className="text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Logika & Pola</h3>
              <p className="text-gray-600 text-sm">Asah otak & ketelitian</p>
            </div>
          </button>
          <button onClick={() => setView('GAME_SHAPES')} className="min-h-[44px] bg-white hover:bg-pink-50 p-5 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-pink-200 flex items-center gap-4 transition-all active:scale-95">
            <div className="bg-pink-100 p-3 rounded-2xl">
              <Palette size={32} className="text-pink-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Warna & Bentuk</h3>
              <p className="text-gray-600 text-sm">Kenali warna dan bentuk</p>
            </div>
          </button>
          <button onClick={() => setView('GAME_MEMORY')} className="min-h-[44px] bg-white hover:bg-teal-50 p-5 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-teal-200 flex items-center gap-4 transition-all active:scale-95">
            <div className="bg-teal-100 p-3 rounded-2xl">
              <LayoutGrid size={32} className="text-teal-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Kartu Memori</h3>
              <p className="text-gray-600 text-sm">Balik kartu, cari pasangan</p>
            </div>
          </button>
        </div>
        <h4 className="text-lg font-bold text-gray-800 mt-8 mb-3 flex items-center gap-3">
          <img src="/area-cerita.webp" alt="" aria-hidden="true" className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
          Cerita 📖
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={() => setView('STORIES')} className="min-h-[44px] bg-white hover:bg-rose-50 p-5 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-rose-200 flex items-center gap-4 transition-all active:scale-95">
            <div className="bg-rose-100 p-3 rounded-2xl">
              <BookOpenText size={32} className="text-rose-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Cerita</h3>
              <p className="text-gray-600 text-sm">Dengarkan cerita pendek</p>
            </div>
          </button>
        </div>

        <div className="mt-12 text-center opacity-60">
          <GraduationCap size={32} className="mx-auto mb-2" />
          <p className="text-sm font-semibold">PintarCilik v2.2.1</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen font-fredoka text-gray-800 selection:bg-yellow-200 ${view !== 'LANDING' ? 'bg-[#f8fafc] px-4 py-6' : ''}`}>
      {view === 'LANDING' && <LandingPage onStart={() => {}} onPrivacy={() => setView('PRIVACY')} onAbout={() => setView('ABOUT')} />}
      {view === 'PRIVACY' && <PrivacyPolicy onBack={() => setView('LANDING')} />}
      {view === 'ABOUT' && <AboutUs onBack={() => setView('LANDING')} />}
      {view === 'PROFILE_SETUP' && <ProfileSetup onComplete={handleProfileComplete} />}
      {view === 'HOME' && renderHome()}
      {view === 'GAME_MATH' && user && (
        <MathGame difficulty={user.level} onFinish={(c, t) => handleFinishGame(c, t, 'BERHITUNG')} onBack={() => setView('HOME')} />
      )}
      {view === 'GAME_READING' && user && (
        <ReadingGame difficulty={user.level} onFinish={(c, t) => handleFinishGame(c, t, 'MEMBACA')} onBack={() => setView('HOME')} />
      )}
      {view === 'GAME_LOGIC' && user && (
        <LogicGame difficulty={user.level} onFinish={(c, t) => handleFinishGame(c, t, 'LOGIKA')} onBack={() => setView('HOME')} />
      )}
      {view === 'GAME_LETTER' && user && (
        <LetterGame difficulty={user.level} onFinish={(c, t) => handleFinishGame(c, t, 'MEMBACA')} onBack={() => setView('HOME')} />
      )}
      {view === 'PROFILE' && user && (
        <ProfilePage user={user} onSave={handleProfileUpdate} onBack={() => setView('HOME')} />
      )}
      {view === 'GAME_SHAPES' && user && (
        <ShapesGame difficulty={user.level} onFinish={(c, t) => handleFinishGame(c, t, 'MEMBACA')} onBack={() => setView('HOME')} />
      )}
      {view === 'GAME_SIZE' && user && (
        <SizeGame difficulty={user.level} onFinish={(c, t) => handleFinishGame(c, t, 'LOGIKA')} onBack={() => setView('HOME')} />
      )}
      {view === 'GAME_MEMORY' && user && (
        <MemoryGame onFinish={(c, t) => handleFinishGame(c, t, 'LOGIKA')} onBack={() => setView('HOME')} />
      )}
      {view === 'GAME_TRACE' && user && (
        <TraceGame difficulty={user.level} onFinish={(c, t) => handleFinishGame(c, t, 'MEMBACA')} onBack={() => setView('HOME')} />
      )}
      {view === 'GAME_ARRANGE' && user && (
        <ArrangeGame difficulty={user.level} onFinish={(c, t) => handleFinishGame(c, t, 'MEMBACA')} onBack={() => setView('HOME')} />
      )}
      {view === 'GAME_CLUE' && user && (
        <ClueGame difficulty={user.level} onFinish={(c, t) => handleFinishGame(c, t, 'MEMBACA')} onBack={() => setView('HOME')} />
      )}
      {view === 'STORIES' && (
        <StoriesView onBack={() => setView('HOME')} />
      )}
      {gatePending && (
        <ParentGate
          onUnlock={handleGateUnlock}
          onCancel={() => { setGatePending(null); setPendingLevel(null); }}
        />
      )}
      {view === 'REPORT' && user && (
        <Suspense fallback={<p className="text-center text-lg font-bold text-gray-700">Memuat laporan...</p>}>
          <ReportView history={history} user={user} onBack={() => setView('HOME')} />
        </Suspense>
      )}
    </div>
  );
};

export default App;
