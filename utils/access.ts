// Pengaturan kenyamanan v2.2.0 — disimpan lokal di perangkat, bukan di server.
// - Teks besar: menaikkan ukuran dasar rem di <html> sehingga semua teks membesar.
// - Kurangi gerakan: mematikan animasi ambient (bukan animasi feedback jawaban).
const KEY = 'pintarcilik-access';

export interface AccessSettings {
  largeText: boolean;
  reduceMotion: boolean;
}

export function loadAccessSettings(): AccessSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { largeText: false, reduceMotion: false };
    const parsed = JSON.parse(raw) as Partial<AccessSettings>;
    return { largeText: !!parsed.largeText, reduceMotion: !!parsed.reduceMotion };
  } catch {
    return { largeText: false, reduceMotion: false };
  }
}

export function applyAccessSettings(s: AccessSettings): void {
  try {
    document.documentElement.classList.toggle('a11y-large', s.largeText);
    document.documentElement.classList.toggle('a11y-reduced', s.reduceMotion);
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // Pengaturan kenyamanan tidak boleh merusak aplikasi bila storage gagal.
  }
}
