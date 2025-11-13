import { useState, useRef, useCallback } from 'react';

export function useBillFlow() {
  const [speechBuffer, setSpeechBuffer] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const parseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const appendToRecognizedText = useCallback((text: string) => {
    setRecognizedText((prev) => {
      const newText = prev ? `${prev} ${text}` : text;
      return newText.trim();
    });
  }, []);

  const updateSpeechBuffer = useCallback(
    (text: string, callback: (buffer: string) => void, delay = 800) => {
      setSpeechBuffer((prevBuffer) => {
        const newBuffer = prevBuffer ? `${prevBuffer} ${text}` : text;

        // Clear any existing timer
        if (parseTimerRef.current) {
          clearTimeout(parseTimerRef.current);
        }

        // Set new timer to process buffer
        parseTimerRef.current = setTimeout(() => {
          const trimmedBuffer = newBuffer.trim();
          if (trimmedBuffer.length > 0) {
            console.log('🔄 Processing buffer:', trimmedBuffer);
            callback(trimmedBuffer);
            setSpeechBuffer(''); // Clear buffer after processing
          }
        }, delay);

        return newBuffer.trim();
      });
    },
    []
  );

  const clearBuffer = useCallback(() => {
    if (parseTimerRef.current) {
      clearTimeout(parseTimerRef.current);
      parseTimerRef.current = null;
    }
    setSpeechBuffer('');
  }, []);

  const resetFlow = useCallback(() => {
    setRecognizedText('');
    clearBuffer();
  }, [clearBuffer]);

  // Force process buffer immediately
  const forceProcessBuffer = useCallback((callback: (buffer: string) => void) => {
    setSpeechBuffer((currentBuffer) => {
      if (parseTimerRef.current) {
        clearTimeout(parseTimerRef.current);
        parseTimerRef.current = null;
      }
      
      const trimmedBuffer = currentBuffer.trim();
      if (trimmedBuffer.length > 0) {
        console.log('⚡ Force processing buffer:', trimmedBuffer);
        callback(trimmedBuffer);
      }
      
      return ''; // Clear buffer
    });
  }, []);

  return {
    speechBuffer,
    setSpeechBuffer,
    recognizedText,
    appendToRecognizedText,
    updateSpeechBuffer,
    clearBuffer,
    resetFlow,
    forceProcessBuffer,
    parseTimerRef,
  };
}