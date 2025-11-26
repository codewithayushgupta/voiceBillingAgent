// src/hooks/useHomeLogic.ts
import { useEffect, useRef, useState } from "react";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { useBillFlow } from "../hooks/useBillFlow";
import { useItemManagement } from "../hooks/useItemManagement";
import { useItemEdit } from "../hooks/useItemEdit";
import { generateBillPDF } from "../utils/pdfGenerator";
import { handleItemSpeech } from "../services/speechHandlers";
import { menuController } from "@ionic/core";


export function useHomeLogic() {
  /** -----------------------------
   *  UI State
   * ------------------------------*/
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Idle");
  const [isPressing, setIsPressing] = useState(false);
  const [remountCounter, setRemountCounter] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const lastRemountRef = useRef<number>(0);

  const micBtnRef = useRef<HTMLButtonElement>(null!);

  /** -----------------------------
   *  Hooks
   * ------------------------------*/
  const { speak } = useSpeechSynthesis();
  const {
    speechBuffer,
    appendToRecognizedText,
    updateSpeechBuffer,
    resetFlow,
  } = useBillFlow();

  const {
    items,
    setItems,
    itemsRef,
    handleAddItems,
    handleDeleteItems,
    handleUpdateItems,
    clearItems,
  } = useItemManagement();

  const {
    editingIndex,
    editFormData,
    handleStartEdit,
    handleCancelEdit,
    handleEditChange,
    handleSaveEdit,
    handleDeleteItem,
  } = useItemEdit(items, setItems, speak);

  /** -----------------------------
   * Speech Recognition
   * ------------------------------*/
  const { listening, startListening, stopListening, abort, currentModeRef } =
    useSpeechRecognition({
      onResult: handleSpeechResult,
      onEnd: () => {
        if (!isProcessing) setStatusMessage("Ready");
        setIsPressing(false);
      },
    });

  /* inside useHomeLogic (near other useEffects) */
  useEffect(() => {
    // ensure menu with id 'main-menu' is enabled
    menuController.enable(true, "main-menu").catch(() => {});
    return () => {
      // optional: disable on unmount
      menuController.enable(false, "main-menu").catch(() => {});
    };
  }, []);

  async function handleSpeechResult(transcript: string) {
    if (!startTimeRef.current) startTimeRef.current = performance.now();

    appendToRecognizedText(transcript);

    updateSpeechBuffer(
      transcript,
      async (buffer) => {
        setIsProcessing(true);
        setStatusMessage("Processing speech…");

        const t0 = performance.now();
        await handleItemSpeech(buffer, itemsRef.current, {
          speak,
          setIsProcessing,
          setStatusMessage,
          handleGeneratePDF: handleGeneratePDFWrapper,
          itemHandlers: {
            handleAddItems,
            handleDeleteItems,
            handleUpdateItems,
          },
        });
        const t1 = performance.now();

        console.debug("Processed in:", t1 - t0);
        setIsProcessing(false);
        startTimeRef.current = null;
        setStatusMessage("Ready");
      },
      800
    );
  }

  /** -----------------------------
   * PDF Generation
   * ------------------------------*/
  const handleGeneratePDFWrapper = async () => {
    const currentItems = itemsRef.current;

    if (!currentItems.length) {
      speak("कोई आइटम नहीं है। पहले कुछ आइटम बोलें।");
      return;
    }

    setStatusMessage("Generating bill…");
    const total = await generateBillPDF(currentItems, "");

    if (total !== null) {
      speak(`बिल बन गया है। कुल रकम ₹${total} रुपये है।`);
    }
    setStatusMessage("Bill generated");
  };

  /** -----------------------------
   * Mic Pointer Events
   * ------------------------------*/
  function removeWindowPointerListeners() {
    window.removeEventListener("pointerup", onWindowPointerUp);
    window.removeEventListener("pointercancel", onWindowPointerUp);
  }

  function onWindowPointerUp(ev: PointerEvent) {
    if (pointerIdRef.current == null || ev.pointerId === pointerIdRef.current) {
      const btn = document.getElementById("mic-btn");
      try {
        (btn as any)?.releasePointerCapture?.(pointerIdRef.current!);
      } catch {}
      pointerIdRef.current = null;
      removeWindowPointerListeners();
      void handleMicRelease();
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    pointerIdRef.current = e.pointerId;

    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch {}

    removeWindowPointerListeners();
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerUp);

    handleMicPress();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();

    if (pointerIdRef.current === e.pointerId) {
      try {
        (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
      } catch {}
      pointerIdRef.current = null;
    }
    removeWindowPointerListeners();
    void handleMicRelease();
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    e.preventDefault();
    pointerIdRef.current = null;
    removeWindowPointerListeners();
    void handleMicRelease();
  };

  const handleMicPress = () => {
    setIsPressing(true);
    setStatusMessage("Listening…");
    startListening("items");
  };

  const handleMicRelease = async () => {
    setIsPressing(false);

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (listening) {
      setStatusMessage("Finalizing...");
      let stopCompleted = false;

      const stopPromise = (async () => {
        try {
          await stopListening();
          stopCompleted = true;
        } catch {}
      })();

      const timeout = new Promise((res) => setTimeout(res, 1500));
      await Promise.race([stopPromise, timeout]);

      if (!stopCompleted) {
        try {
          abort();
        } catch {}
      }

      setTimeout(() => {
        if (!isProcessing) setStatusMessage("Ready");
        setIsPressing(false);
      }, 300);
    }
  };

  /** -----------------------------
   * Clear Items
   * ------------------------------*/
  const handleClear = () => {
    clearItems();
    resetFlow();
    currentModeRef.current = "items";
    setIsProcessing(false);
    setStatusMessage("Cleared all items");
    speak("क्लियर कर दिया।");
  };

  return {
    // UI state -------------------------------
    isProcessing,
    statusMessage,
    isPressing,
    remountCounter,
    micBtnRef,

    // Hooks exposed --------------------------
    listening,
    speechBuffer,
    items,
    editingIndex,
    editFormData,

    // Actions exposed ------------------------
    handleStartEdit,
    handleCancelEdit,
    handleEditChange,
    handleSaveEdit,
    handleDeleteItem,
    handleGeneratePDFWrapper,
    handleClear,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
  };
}
