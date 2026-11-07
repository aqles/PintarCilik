// Bunyi jawaban gratis v2.1: WebAudio, tanpa file audio, tanpa biaya.
// Nada benar = dua nada naik, nada salah = satu nada rendah yang lembut.
// Bisa dimatikan dari tombol di GameShell; pilihan disimpan di localStorage.
const STORAGE_KEY = 'pintarcilik-sound';

export function isSoundEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
  } catch {
    // Abaikan: bunyi tetap jalan sesuai default bila storage tidak tersedia.
  }
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.15, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration);
}

export function playAnswerSound(correct: boolean): void {
  if (!isSoundEnabled()) return;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    if (correct) {
      tone(ctx, 523.25, now, 0.18); // C5
      tone(ctx, 783.99, now + 0.15, 0.25); // G5
    } else {
      tone(ctx, 220, now, 0.3); // A3, lembut
    }
    window.setTimeout(() => void ctx.close(), 800);
  } catch {
    // Bunyi adalah pelengkap; kegagalan audio tidak boleh merusak permainan.
  }
}
