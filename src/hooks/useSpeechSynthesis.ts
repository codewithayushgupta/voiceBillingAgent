import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

export function useSpeechSynthesis() {
  const speak = async (text: string, lang = 'hi-IN') => {
    try {
      if (Capacitor.isNativePlatform()) {
        await TextToSpeech.speak({
          text: text,
          lang: lang,
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
          category: 'ambient',
        });
      } else {
        // Web fallback
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (error) {
      console.error('TTS error:', error);
    }
  };

  const stop = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await TextToSpeech.stop();
      } else {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      }
    } catch (error) {
      console.error('TTS stop error:', error);
    }
  };

  return { speak, stop };
}