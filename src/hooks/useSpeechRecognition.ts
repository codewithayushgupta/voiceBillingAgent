// useSpeechRecognition.ts
import { useCallback, useEffect, useRef, useState } from "react";

type HooksOptions = {
  onResult?: (text: string) => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
};

export function useSpeechRecognition(options: HooksOptions = {}) {
  const { onResult, onEnd, onError } = options;

  const recognitionRef = useRef<any | null>(null);
  const listeningRef = useRef(false);
  const [listening, setListening] = useState(false);

  // track current requested mode (optional)
  const currentModeRef = useRef<string | null>(null);

  // internal promise control so stopListening can await the actual stop
  const stopResolveRef = useRef<(() => void) | null>(null);
  const stopRejectRef = useRef<((err?: any) => void) | null>(null);
  const stopTimeoutRef = useRef<number | null>(null);

  // safety timeout (ms) to force stop if the browser doesn't fire events
  const STOP_SAFETY_TIMEOUT = 2000;

  const createRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("[useSpeechRecognition] SpeechRecognition not supported in this environment.");
      return null;
    }

    const rec = new SpeechRecognition();
    rec.lang = "hi-IN"; // set your desired language
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = false; // single shot per press

    // handlers
    rec.onstart = () => {
      console.debug("[useSpeechRecognition] onstart");
      listeningRef.current = true;
      setListening(true);
    };

    rec.onresult = (ev: any) => {
      try {
        // collect transcript (concatenate all results)
        let transcript = "";
        for (let i = ev.resultIndex; i < ev.results.length; ++i) {
          const r = ev.results[i];
          transcript += (r[0] && r[0].transcript) || "";
        }
        transcript = transcript.trim();
        if (transcript) {
          console.debug("[useSpeechRecognition] onresult:", transcript);
          onResult?.(transcript);
        }
      } catch (err) {
        console.warn("[useSpeechRecognition] onresult error:", err);
      }
    };

    rec.onerror = (ev: any) => {
      console.warn("[useSpeechRecognition] onerror:", ev);
      onError?.(ev);
      // try to ensure listening flag is cleared (some browsers may not call onend)
      listeningRef.current = false;
      setListening(false);
      // resolve stop promise if present
      if (stopResolveRef.current) {
        stopResolveRef.current();
      }
    };

    rec.onend = () => {
      console.debug("[useSpeechRecognition] onend");
      // mark not listening and call onEnd
      listeningRef.current = false;
      setListening(false);

      try { onEnd?.(); } catch (e) {}

      // signal anyone awaiting stopListening
      if (stopResolveRef.current) {
        stopResolveRef.current();
      }
    };

    return rec;
  }, [onResult, onEnd, onError]);

  // Ensure recognitionRef is reset if environment changes
  useEffect(() => {
    return () => {
      // cleanup on unmount
      try {
        if (recognitionRef.current) {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onstart = null;
          try { recognitionRef.current.stop?.(); } catch {}
          try { recognitionRef.current.abort?.(); } catch {}
          recognitionRef.current = null;
        }
      } catch (e) {}
    };
  }, []);

  const startListening = useCallback(async (mode?: string) => {
    currentModeRef.current = mode || null;

    // create if needed
    if (!recognitionRef.current) {
      recognitionRef.current = createRecognition();
      if (!recognitionRef.current) {
        console.warn("[useSpeechRecognition] cannot start; no SpeechRecognition available");
        return;
      }
    }

    // If already listening, ignore subsequent starts
    if (listeningRef.current) {
      console.debug("[useSpeechRecognition] startListening called but already listening");
      return;
    }

    try {
      listeningRef.current = true;
      setListening(true);
      console.debug("[useSpeechRecognition] start listening (mode)", mode);

      // start recognition (wrap in try to catch immediate exceptions)
      try {
        recognitionRef.current.start();
      } catch (startErr) {
        // Some WebView builds may throw when starting — fallback: recreate and try once
        console.warn("[useSpeechRecognition] start() threw, recreating recognition and retrying", startErr);
        try { recognitionRef.current = createRecognition(); recognitionRef.current?.start(); }
        catch (e2) { console.error("[useSpeechRecognition] second start attempt failed", e2); throw e2; }
      }
    } catch (err) {
      listeningRef.current = false;
      setListening(false);
      throw err;
    }
  }, [createRecognition]);

  // robust stopListening: call stop, await onend or use safety timeout, always set listening=false
  const stopListening = useCallback(async () => {
    // If not created or not listening, resolve immediately
    if (!recognitionRef.current && !listeningRef.current) {
      setListening(false);
      return;
    }

    // If not listening, make sure state is false
    if (!listeningRef.current) {
      setListening(false);
      return;
    }

    // create a promise that resolves when onend runs or safety timeout elapses
    const p = new Promise<void>((resolve, reject) => {
      // clear previous handlers
      stopResolveRef.current = () => { cleanup(); resolve(); };
      stopRejectRef.current = (err?: any) => { cleanup(); reject(err); };

      // safety timeout
      stopTimeoutRef.current = window.setTimeout(() => {
        console.warn("[useSpeechRecognition] stop safety timeout fired — forcing stop");
        try {
          // attempt to abort
          recognitionRef.current?.abort?.();
        } catch (e) { console.warn("[useSpeechRecognition] abort threw", e); }
        listeningRef.current = false;
        setListening(false);
        if (stopResolveRef.current) stopResolveRef.current();
      }, STOP_SAFETY_TIMEOUT);
    });

    // attempt to stop gracefully
    try {
      console.debug("[useSpeechRecognition] stopListening: calling recognition.stop()");
      try {
        recognitionRef.current?.stop?.();
      } catch (stopErr) {
        console.warn("[useSpeechRecognition] stop() threw; trying abort()", stopErr);
        try { recognitionRef.current?.abort?.(); } catch (abortErr) { console.warn("abort also threw", abortErr); }
      }
    } catch (err) {
      console.warn("[useSpeechRecognition] error while stopping recognition", err);
    }

    // await the promise (resolves when onend or safety timeout)
    try {
      await p;
    } catch (err) {
      console.warn("[useSpeechRecognition] stop promise rejected", err);
    } finally {
      cleanup();
      listeningRef.current = false;
      setListening(false);
    }

    function cleanup() {
      // clear stop handlers + timeout
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = null;
      }
      stopResolveRef.current = null;
      stopRejectRef.current = null;
    }
  }, []);

  // expose force abort in case caller needs it
  const abort = useCallback(() => {
    try {
      console.debug("[useSpeechRecognition] abort()");
      recognitionRef.current?.abort?.();
    } catch (e) {
      console.warn("[useSpeechRecognition] abort threw", e);
    }
    listeningRef.current = false;
    setListening(false);
    // cleanup any waiting stop promise
    if (stopResolveRef.current) {
      stopResolveRef.current();
      stopResolveRef.current = null;
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
  }, []);

  return {
    listening,
    startListening,
    stopListening,
    abort,
    currentModeRef,
    // optional: expose underlying recognition ref for advanced debugging
    _internal: { recognitionRef },
  };
}

export default useSpeechRecognition;
