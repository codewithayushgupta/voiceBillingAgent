import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { Capacitor } from "@capacitor/core";

export function useSpeechSynthesis() {
  const speak = async (text: string, lang = "en-IN") => {
    if (!text) return;

    try {
      if (Capacitor.isNativePlatform()) {
        // Ensure any current speech is stopped before starting
        await TextToSpeech.stop();

        await TextToSpeech.speak({
          text,
          lang,
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
          category: "ambient", // may vary based on Android version
        });

        console.log("Speaking on native device");
      } else {
        // Fallback for web
        if ("speechSynthesis" in window) {
          // Cancel any ongoing speech
          window.speechSynthesis.cancel();

          // Ensure voices are loaded
          const voicesReady = new Promise<void>((resolve) => {
            const v = window.speechSynthesis.getVoices();
            if (v.length) return resolve();
            window.speechSynthesis.onvoiceschanged = () => resolve();
          });
          await voicesReady;

          // Prime audio context (Chrome sometimes needs this)
          if (!window.__ttsPrimed) {
            const dummy = new SpeechSynthesisUtterance(" ");
            dummy.volume = 0;
            window.speechSynthesis.speak(dummy);
            window.__ttsPrimed = true;
          }

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang;
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;

          const voices = window.speechSynthesis.getVoices();
          const indianVoice = voices.find(
            (v) => v.lang === "en-IN" || v.name.toLowerCase().includes("india")
          );
          if (indianVoice) utterance.voice = indianVoice;

          window.speechSynthesis.speak(utterance);
          console.log("Speaking in browser");
        }
      }
    } catch (error) {
      console.error("TTS error:", error);
    }
  };

  const stop = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await TextToSpeech.stop();
      } else if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch (error) {
      console.error("TTS stop error:", error);
    }
  };

  return { speak, stop };
}
