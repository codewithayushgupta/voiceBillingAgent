import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { Capacitor } from "@capacitor/core";
import { useEffect, useRef, useState } from "react";

export function useSpeechSynthesis() {
  const [isReady, setIsReady] = useState(false);
  const queueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    // Initialize TTS for browser
    if (!Capacitor.isNativePlatform()) {
      if ("speechSynthesis" in window) {
        // Wait for voices to load
        const loadVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            console.log("TTS voices loaded:", voices.length);
            setIsReady(true);
          }
        };

        // Try immediately
        loadVoices();

        // Also listen for the event
        window.speechSynthesis.onvoiceschanged = loadVoices;

        // Fallback timeout
        setTimeout(() => setIsReady(true), 1000);
      } else {
        console.warn("speechSynthesis not supported");
      }
    } else {
      // Native platform is always ready
      setIsReady(true);
    }
  }, []);

  const processQueue = async () => {
    if (isSpeakingRef.current || queueRef.current.length === 0) {
      return;
    }

    isSpeakingRef.current = true;
    const text = queueRef.current.shift()!;

    try {
      await speakInternal(text);
    } catch (error) {
      console.error("TTS error:", error);
    } finally {
      isSpeakingRef.current = false;
      // Process next in queue after a small delay
      setTimeout(processQueue, 100);
    }
  };

  const speakInternal = async (text: string, lang = "hi-IN"): Promise<void> => {
    if (!text) return;

    try {
      if (Capacitor.isNativePlatform()) {
        await TextToSpeech.stop();
        await TextToSpeech.speak({
          text,
          lang,
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
          category: "ambient",
        });
        console.log("Speaking on native:", text);
      } else {
        // Browser fallback
        if ("speechSynthesis" in window) {
          // Cancel any ongoing speech
          window.speechSynthesis.cancel();

          // Detect if text is Hindi (contains Devanagari script)
          const isHindi = /[\u0900-\u097F]/.test(text);
          const targetLang = isHindi ? "hi-IN" : lang;

          // Create utterance
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = targetLang;
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;

          // Try to find appropriate voice
          const voices = window.speechSynthesis.getVoices();
          
          let selectedVoice = null;

          if (isHindi) {
            // Try to find Hindi voice
            selectedVoice = voices.find((v) =>
              v.lang === "hi-IN" || 
              v.lang.startsWith("hi") ||
              v.name.toLowerCase().includes("hindi")
            );
            
            if (!selectedVoice) {
              console.warn("No Hindi voice found. Available voices:", 
                voices.map(v => `${v.name} (${v.lang})`).join(", ")
              );
              // Fallback to Google voices if available
              selectedVoice = voices.find((v) => 
                v.name.toLowerCase().includes("google") && 
                (v.lang.startsWith("en") || v.lang.startsWith("hi"))
              );
            }
          } else {
            // Find English (India) voice
            selectedVoice = voices.find(
              (v) =>
                v.lang === "en-IN" ||
                v.name.toLowerCase().includes("india")
            ) || voices.find((v) => v.lang.startsWith("en"));
          }
          
          if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log(`Using voice: ${selectedVoice.name} (${selectedVoice.lang}) for ${isHindi ? 'Hindi' : 'English'} text`);
          } else {
            console.warn("No suitable voice found, using default");
          }

          // Return a promise that resolves when speech ends
          return new Promise((resolve, reject) => {
            utterance.onend = () => {
              console.log("Speech completed:", text.substring(0, 50));
              resolve();
            };
            utterance.onerror = (e) => {
              console.error("Speech error:", e);
              // Don't reject, just resolve to continue queue
              resolve();
            };

            window.speechSynthesis.speak(utterance);
            console.log("Speaking in browser:", text.substring(0, 50));
          });
        }
      }
    } catch (error) {
      console.error("TTS error:", error);
      throw error;
    }
  };

  const speak = async (text: string, lang = "hi-IN") => {
    if (!text || !isReady) {
      console.warn("TTS not ready or empty text");
      return;
    }

    // Add to queue
    queueRef.current.push(text);
    
    // Process queue
    processQueue();
  };

  const stop = async () => {
    try {
      // Clear queue
      queueRef.current = [];
      isSpeakingRef.current = false;

      if (Capacitor.isNativePlatform()) {
        await TextToSpeech.stop();
      } else if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch (error) {
      console.error("TTS stop error:", error);
    }
  };

  return { speak, stop, isReady };
}