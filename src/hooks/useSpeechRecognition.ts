import { useState, useCallback, useRef } from "react";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { Capacitor } from "@capacitor/core";

interface UseSpeechRecognitionProps {
  onResult: (transcript: string, mode: string) => void;
  onError?: (error: any) => void;
  onEnd?: () => void;
}

export function useSpeechRecognition({
  onResult,
  onError,
  onEnd,
}: UseSpeechRecognitionProps) {
  const [listening, setListening] = useState(false);
  const [available, setAvailable] = useState(false);
  const currentModeRef = useRef("items");
  const recognitionRef = useRef<any>(null);
  const lastTranscriptRef = useRef("");
  const shouldRestartRef = useRef(false);

  const checkAvailability = useCallback(async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const { available } = await SpeechRecognition.available();
        setAvailable(available);

        if (!available) {
          console.warn("Speech recognition not available on this device");
          return false;
        }

        const permissionResult: any =
          await SpeechRecognition.requestPermissions();
        console.log("Speech permission result:", permissionResult);

        const granted =
          permissionResult?.speechRecognition === "granted" ||
          permissionResult?.permission === "granted" ||
          permissionResult?.granted === true;

        if (!granted) {
          alert(
            "Microphone permission denied. Please enable it manually from Settings → App Permissions."
          );
        }

        return granted;
      } else {
        const isAvailable =
          "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
        setAvailable(isAvailable);
        return isAvailable;
      }
    } catch (error) {
      console.error("Speech recognition permission check failed:", error);
      return false;
    }
  }, []);

  const startListening = useCallback(
    async (mode = "items") => {
      currentModeRef.current = mode;
      lastTranscriptRef.current = "";

      const hasPermission = await checkAvailability();
      if (!hasPermission) {
        alert("Microphone permission denied. Please enable it in settings.");
        return;
      }

      try {
        if (Capacitor.isNativePlatform()) {
          await SpeechRecognition.removeAllListeners();

          await SpeechRecognition.start({
            language: "hi-IN",
            maxResults: 1,
            popup: false,
            partialResults: true,
          });

          setListening(true);

          //  One combined result handler
          const handleResult = (data: any) => {
            if (data.matches && data.matches.length > 0) {
              const transcript = data.matches[0].trim();
              if (transcript && transcript !== lastTranscriptRef.current) {
                lastTranscriptRef.current = transcript;
                console.log("Recognized:", transcript);
                onResult(transcript, currentModeRef.current);
              }
            }
          };

          // Attach both possible native event names
          SpeechRecognition.addListener("partialResults", handleResult);
          (SpeechRecognition as any).addListener("result", handleResult);
        } else {
          // Web fallback
          const SpeechRecognitionAPI =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

          const recognition = new SpeechRecognitionAPI();
          recognition.lang = "hi-IN";
          recognition.continuous = true;
          recognition.interimResults = false;

          recognition.onresult = (event: any) => {
            const lastResultIndex = event.results.length - 1;
            const result = event.results[lastResultIndex];

            if (result.isFinal) {
              const transcript = result[0].transcript.trim();
              if (transcript && transcript !== lastTranscriptRef.current) {
                lastTranscriptRef.current = transcript;
                onResult(transcript, currentModeRef.current);
              }
            }
          };

          recognition.onerror = (e: any) => {
            console.error("Speech error:", e);
            if (e.error === "no-speech") {
              console.log("No speech detected, continuing...");
            } else if (onError) {
              onError(e);
            }
          };

          recognition.onend = () => {
            console.log("Recognition ended");
            if (shouldRestartRef.current) {
              try {
                recognition.start();
              } catch (err) {
                console.error("Restart failed:", err);
                shouldRestartRef.current = false;
                setListening(false);
                if (onEnd) onEnd();
              }
            } else {
              setListening(false);
              if (onEnd) onEnd();
            }
          };

          recognition.start();
          recognitionRef.current = recognition;
          setListening(true);
        }
      } catch (error) {
        console.error("Failed to start recognition:", error);
        if (onError) onError(error);
      }
    },
    [checkAvailability, onResult, onError, onEnd, listening]
  );

  const stopListening = useCallback(async () => {
    try {
      // Reset last transcript to avoid stale duplicates
      lastTranscriptRef.current = "";

      if (Capacitor.isNativePlatform()) {
        try {
          // Stop the native recognition (may throw if not started)
          await SpeechRecognition.stop();
        } catch (err) {
          // not fatal — log it and continue to cleanup
          console.warn("SpeechRecognition.stop() threw:", err);
        }

        try {
          // Remove any native listeners attached by the plugin
          // Some plugin versions return a promise for this
          await SpeechRecognition.removeAllListeners();
        } catch (err) {
          console.warn("removeAllListeners() threw:", err);
        }
      } else {
        // Web fallback: stop and detach recognition
        if (recognitionRef.current) {
          try {
            recognitionRef.current.onresult = null;
            recognitionRef.current.onend = null;
            recognitionRef.current.onerror = null;
            recognitionRef.current.stop();
          } catch (err) {
            console.warn("web recognition stop threw:", err);
          } finally {
            recognitionRef.current = null;
          }
        }
      }

      setListening(false);
      if (onEnd) onEnd();
    } catch (error) {
      console.error("Failed to stop recognition:", error);
    }
  }, [onEnd]);

  return {
    listening,
    available,
    startListening,
    stopListening,
    currentModeRef,
  };
}
