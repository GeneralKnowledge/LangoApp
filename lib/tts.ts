export function speak(text: string, lang: string, rate: number, voiceName?: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = Math.min(1.4, Math.max(0.6, rate));
  if (voiceName) {
    const voice = window.speechSynthesis.getVoices().find((v) => v.name === voiceName);
    if (voice) utter.voice = voice;
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

export function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices();
}
