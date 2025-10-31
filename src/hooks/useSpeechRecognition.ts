import { useState, useCallback, useRef } from 'react';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { Capacitor } from '@capacitor/core';

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
  const currentModeRef = useRef('items');
  const recognitionRef = useRef<any>(null);
  const lastTranscriptRef = useRef(''); // Track last transcript to avoid duplicates

  const checkAvailability = useCallback(async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const { available } = await SpeechRecognition.available();
        setAvailable(available);

        if (available) {
          const { granted } = await SpeechRecognition.requestPermissions();
          return granted;
        }
        return false;
      } else {
        // Web fallback
        const isAvailable =
          'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        setAvailable(isAvailable);
        return isAvailable;
      }
    } catch (error) {
      console.error('Speech recognition check failed:', error);
      return false;
    }
  }, []);

  const startListening = useCallback(
    async (mode = 'items') => {
      currentModeRef.current = mode;
      lastTranscriptRef.current = ''; // Reset on start
      
      const hasPermission = await checkAvailability();

      if (!hasPermission) {
        alert('Microphone permission denied. Please enable it in settings.');
        return;
      }

      try {
        if (Capacitor.isNativePlatform()) {
          // Native platform
          await SpeechRecognition.start({
            language: 'hi-IN',
            maxResults: 1,
            popup: false,
            partialResults: false, // Changed to false to avoid duplicates
          });

          setListening(true);

          // Only listen for final results
          SpeechRecognition.addListener('partialResults', (data: any) => {
            if (data.matches && data.matches.length > 0) {
              const transcript = data.matches[0].trim();
              
              // Only process if it's different from last transcript
              if (transcript && transcript !== lastTranscriptRef.current) {
                lastTranscriptRef.current = transcript;
                onResult(transcript, currentModeRef.current);
              }
            }
          });
        } else {
          // Web fallback - FIXED
          const SpeechRecognitionAPI =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRecognitionAPI();
          recognition.lang = 'hi-IN';
          recognition.continuous = true;
          recognition.interimResults = false; // Changed to false to get only final results

          recognition.onresult = (event: any) => {
            // Only process the latest final result
            const lastResultIndex = event.results.length - 1;
            const result = event.results[lastResultIndex];
            
            if (result.isFinal) {
              const transcript = result[0].transcript.trim();
              
              // Avoid duplicate processing
              if (transcript && transcript !== lastTranscriptRef.current) {
                lastTranscriptRef.current = transcript;
                onResult(transcript, currentModeRef.current);
              }
            }
          };

          recognition.onerror = (e: any) => {
            console.error('Speech error:', e);
            if (e.error === 'no-speech') {
              // Don't treat no-speech as error, just restart
              console.log('No speech detected, continuing...');
            } else if (onError) {
              onError(e);
            }
          };

          recognition.onend = () => {
            console.log('Recognition ended, auto-restarting...');
            // Auto-restart if still supposed to be listening
            if (listening) {
              setTimeout(() => {
                try {
                  recognition.start();
                } catch (err) {
                  console.error('Failed to restart:', err);
                  setListening(false);
                  if (onEnd) onEnd();
                }
              }, 100);
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
        console.error('Failed to start recognition:', error);
        if (onError) onError(error);
      }
    },
    [checkAvailability, onResult, onError, onEnd, listening]
  );

  const stopListening = useCallback(async () => {
    try {
      lastTranscriptRef.current = ''; // Reset on stop
      
      if (Capacitor.isNativePlatform()) {
        await SpeechRecognition.stop();
        SpeechRecognition.removeAllListeners();
      } else {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        }
      }
      setListening(false);
      if (onEnd) onEnd();
    } catch (error) {
      console.error('Failed to stop recognition:', error);
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

