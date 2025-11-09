import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { Capacitor } from "@capacitor/core";
import { useRef, useCallback } from "react";

declare global {
  interface Window {
    __ttsPrimed?: boolean;
  }
}

export function useSpeechSynthesis() {
  const isSpeakingRef = useRef(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await TextToSpeech.stop();
      } else if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        if (currentUtteranceRef.current) {
          currentUtteranceRef.current = null;
        }
      }
      isSpeakingRef.current = false;
    } catch (error) {
      console.error("TTS stop error:", error);
    }
  }, []);

  const speak = useCallback(async (text: string, lang = "en-IN") => {
    if (!text) return;

    // Prevent duplicate speech calls
    if (isSpeakingRef.current) {
      console.log("Already speaking, skipping duplicate call");
      return;
    }

    try {
      isSpeakingRef.current = true;

      if (Capacitor.isNativePlatform()) {
        // Ensure any current speech is stopped before starting
        await TextToSpeech.stop();

        await TextToSpeech.speak({
          text,
          lang,
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
          category: "ambient",
        });

        console.log("Speaking on native device");
        // Native doesn't have reliable end callback, use timeout
        setTimeout(() => {
          isSpeakingRef.current = false;
        }, text.length * 100); // Rough estimate
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

          // Prime audio context
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

          // Track completion
          utterance.onend = () => {
            isSpeakingRef.current = false;
            currentUtteranceRef.current = null;
          };

          utterance.onerror = () => {
            isSpeakingRef.current = false;
            currentUtteranceRef.current = null;
          };

          currentUtteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
          console.log("Speaking in browser");
        }
      }
    } catch (error) {
      console.error("TTS error:", error);
      isSpeakingRef.current = false;
    }
  }, []);

  return { speak, stop, isSpeakingRef };
}
