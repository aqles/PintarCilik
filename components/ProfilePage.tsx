import React, { useState } from 'react';
import { UserProfile } from '../types';
import { AVATAR_OPTIONS } from '../constants';
import { Button, Card } from './UI';
import { applyAccessSettings, loadAccessSettings } from '../utils/access';
import { Check } from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  onSave: (updated: UserProfile) => Promise<boolean>;
  onBack: () => void;
}

// Halaman Profil v2.1.1: ubah nama, umur, dan avatar setelah akun jadi.
// Level sengaja TIDAK diubah di sini — level dipilih dari Beranda — supaya
// mengubah nama/avatar tidak pernah menggeser level anak secara diam-diam.
const ProfilePage: React.FC<ProfilePageProps> = ({ user, onSave, onBack }) => {
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const [customSeed, setCustomSeed] = useState('');
  const [access, setAccess] = useState(loadAccessSettings);
  const [saving, setSaving] = useState(false);

  const changed =
    name.trim() !== user.name || age !== user.age || selectedAvatar !== user.avatar;
  const customAvatarUrl = customSeed.trim()
    ? `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(customSeed.trim())}`
    : '';

  const handleSave = async () => {
    if (!name.trim() || !changed || saving) return;
    setSaving(true);
    const ok = await onSave({
      ...user,
      name: name.trim(),
      age,
      avatar: selectedAvatar,
    });
    setSaving(false);
    if (ok) onBack();
  };

  return (
    <div className="max-w-md sm:max-w-lg mx-auto w-full p-4 animate-fade-in-up pb-10">
      <button
        onClick={onBack}
        aria-label="Kembali ke beranda"
        className="min-h-[44px] px-3 mb-4 text-gray-700 hover:text-gray-900 font-bold"
      >
        &larr; Kembali
      </button>
      <Card className="text-center">
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">Profilku 👤</h2>
        <p className="text-gray-600 mb-6">Ubah nama, umur, atau fotomu di sini.</p>

        <img
          src={selectedAvatar}
          alt="Avatar yang dipilih"
          className="w-28 h-28 rounded-full border-4 border-yellow-400 shadow-md bg-white mx-auto mb-6"
        />

        <div className="mb-6 text-left">
          <label className="block text-gray-600 font-bold mb-2 ml-1">Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tulis namamu di sini..."
            maxLength={40}
            className="w-full text-lg p-4 rounded-2xl border-2 border-indigo-100 focus:border-indigo-400 focus:outline-none bg-indigo-50 transition-colors placeholder:text-gray-300"
          />
        </div>

        <div className="mb-6 text-left">
          <label className="block text-gray-600 font-bold mb-2 ml-1">Umur</label>
          <div className="flex justify-between items-center bg-indigo-50 p-2 rounded-2xl">
            <button
              onClick={() => setAge(Math.max(3, age - 1))}
              aria-label="Kurangi umur"
              className="min-w-[48px] min-h-[48px] bg-white rounded-xl shadow-sm text-2xl font-bold text-indigo-500 hover:bg-indigo-100 active:scale-95 transition-transform"
            >
              -
            </button>
            <span className="text-3xl font-bold text-indigo-700">{age} Tahun</span>
            <button
              onClick={() => setAge(Math.min(10, age + 1))}
              aria-label="Tambah umur"
              className="min-w-[48px] min-h-[48px] bg-white rounded-xl shadow-sm text-2xl font-bold text-indigo-500 hover:bg-indigo-100 active:scale-95 transition-transform"
            >
              +
            </button>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-left text-gray-600 font-bold mb-3 ml-1">
            Pilih Fotomu:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {AVATAR_OPTIONS.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedAvatar(url)}
                aria-label={`Pilih avatar ${idx + 1}`}
                aria-pressed={selectedAvatar === url}
                className={`relative rounded-full p-1 transition-all transform hover:scale-105 ${
                  selectedAvatar === url
                    ? 'ring-4 ring-indigo-400 scale-105'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img src={url} alt="Pilihan avatar" className="w-full rounded-full bg-gray-100" />
                {selectedAvatar === url && (
                  <div className="absolute bottom-0 right-0 bg-indigo-500 text-white rounded-full p-1 border-2 border-white">
                    <Check size={12} strokeWidth={4} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 text-left">
          <label className="block text-gray-600 font-bold mb-2 ml-1">
            Atau buat avatar sendiri:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customSeed}
              onChange={(e) => setCustomSeed(e.target.value)}
              placeholder="Tulis satu kata, mis. Bintang"
              maxLength={20}
              className="flex-1 text-lg p-4 rounded-2xl border-2 border-indigo-100 focus:border-indigo-400 focus:outline-none bg-indigo-50 transition-colors placeholder:text-gray-300"
            />
            <Button
              onClick={() => customAvatarUrl && setSelectedAvatar(customAvatarUrl)}
              variant="primary"
              className="min-h-[44px] px-4"
              disabled={!customSeed.trim()}
            >
              Pakai
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Avatar dibuat dari kata itu (gambar ilustrasi, bukan foto). Foto asli belum didukung — itu butuh penyimpanan khusus.
          </p>
        </div>

        <div className="mb-8 text-left">
          <label className="block text-gray-600 font-bold mb-3 ml-1">Kenyamanan:</label>
          <div className="flex flex-col gap-3">
            {([
              ['largeText', 'Teks lebih besar', 'Semua tulisan di aplikasi jadi lebih besar.'],
              ['reduceMotion', 'Kurangi gerakan', 'Mematikan animasi melayang/bergerak di latar.'],
            ] as const).map(([key, label, desc]) => (
              <label key={key} className="flex items-center gap-3 bg-indigo-50 p-4 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={access[key]}
                  onChange={(e) => {
                    const next = { ...access, [key]: e.target.checked };
                    setAccess(next);
                    applyAccessSettings(next);
                  }}
                  className="w-6 h-6 accent-indigo-500"
                />
                <span>
                  <span className="block font-bold text-gray-800">{label}</span>
                  <span className="block text-sm text-gray-500">{desc}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSave}
          variant="success"
          className="w-full text-xl py-4 shadow-green-200"
          disabled={!name.trim() || !changed || saving}
        >
          {saving ? 'Menyimpan...' : 'Simpan Profil ✅'}
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          Level (Pemula/Menengah) diatur dari Beranda, bukan dari sini.
        </p>
      </Card>
    </div>
  );
};

export default ProfilePage;
