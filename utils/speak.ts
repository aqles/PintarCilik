// Audio gratis v2: Web Speech API (TTS browser), opt-in per tap, tanpa autoplay.
// Tidak ada biaya, tidak ada data yang dikirim ke server TTS pihak ketiga oleh kode ini
// selain apa yang dilakukan browser itu sendiri; suara dipilih yang berbahasa Indonesia bila tersedia.
export function speakIndonesian(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find((v) => v.lang.toLowerCase().startsWith('id'));
  if (idVoice) utterance.voice = idVoice;
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
