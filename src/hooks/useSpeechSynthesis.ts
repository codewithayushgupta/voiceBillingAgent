import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { Capacitor } from "@capacitor/core";

export function useSpeechSynthesis() {
  const speak = async (text: string, lang = "hi-IN") => {
    if (!text) return;

    try {
      if (Capacitor.isNativePlatform()) {
        // Stop any ongoing speech first
        try {
          await TextToSpeech.stop();
        } catch (e) {
          console.log("No speech to stop");
        }

        // Small delay to ensure stop completed
        await new Promise(resolve => setTimeout(resolve, 100));

        // Android-optimized settings
        await TextToSpeech.speak({
          text,
          lang,
          rate: 0.9, // Slightly slower for better clarity
          pitch: 1.0,
          volume: 1.0,
          category: "ambient",
        });

        console.log("✅ Speaking on Android/iOS:", text);
      } else {
        // Enhanced Web fallback
        if ("speechSynthesis" in window) {
          // Cancel any ongoing speech
          window.speechSynthesis.cancel();

          // Wait for synthesis to fully cancel
          await new Promise(resolve => setTimeout(resolve, 50));

          // Load voices if not already loaded
          let voices = window.speechSynthesis.getVoices();
          
          if (voices.length === 0) {
            // Wait for voices to load
            await new Promise<void>((resolve) => {
              const checkVoices = () => {
                voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                  resolve();
                } else {
                  window.speechSynthesis.addEventListener('voiceschanged', () => {
                    voices = window.speechSynthesis.getVoices();
                    resolve();
                  }, { once: true });
                }
              };
              checkVoices();
            });
          }

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang;
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;

          // Find best Hindi voice
          const hindiVoice = voices.find(
            (v) => v.lang === "hi-IN" || v.lang.startsWith("hi")
          );
          
          if (hindiVoice) {
            utterance.voice = hindiVoice;
            console.log("✅ Using Hindi voice:", hindiVoice.name);
          } else {
            console.log("⚠️ No Hindi voice found, using default");
          }

          // Error handling
          utterance.onerror = (event) => {
            console.error("TTS Error:", event);
          };

          utterance.onstart = () => {
            console.log("✅ Started speaking:", text);
          };

          utterance.onend = () => {
            console.log("✅ Finished speaking");
          };

          window.speechSynthesis.speak(utterance);
        } else {
          console.error("❌ Speech synthesis not supported");
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