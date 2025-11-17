// Home.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonText,
  IonFooter,
  IonCard,
  IonCardContent,
  IonProgressBar,
} from "@ionic/react";
import { mic, documentText, stopCircle, refresh } from "ionicons/icons";
import ItemsTable from "../components/ItemsTable";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useBillFlow } from "../hooks/useBillFlow";
import { useItemManagement } from "../hooks/useItemManagement";
import { useItemEdit } from "../hooks/useItemEdit";
import { generateBillPDF } from "../utils/pdfGenerator";
import { handleItemSpeech } from "../services/speechHandlers";
import "./Home.css";

const Home: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Idle");
  const [isPressing, setIsPressing] = useState(false);
  const { speak } = useSpeechSynthesis();
  const startTimeRef = useRef<number | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    speechBuffer,
    appendToRecognizedText,
    updateSpeechBuffer,
    clearBuffer,
    resetFlow,
    forceProcessBuffer,
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

  // add near your other refs / states
  const micBtnRef = useRef<HTMLButtonElement | null>(null);
  const [remountCounter, setRemountCounter] = useState(0);


  const { listening, startListening, stopListening, currentModeRef } =
    useSpeechRecognition({
      onResult: handleSpeechResult,
      onEnd: () => {
        console.log("🎤 Speech recognition ended");
        // Don't update status here if processing
        if (!isProcessing) {
          setStatusMessage("Ready");
        }
        setIsPressing(false);
      },
    });

  async function handleSpeechResult(transcript: string) {
    if (!startTimeRef.current) startTimeRef.current = performance.now();

    appendToRecognizedText(transcript);

    // Continue processing even if button is released
    console.log("📝 Received transcript:", transcript);

    // Process immediately in background without blocking
    updateSpeechBuffer(transcript, async (buffer) => {
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
      console.log(`✅ Item processed in ${(t1 - t0).toFixed(2)} ms`);

      setIsProcessing(false);
      startTimeRef.current = null;
      setStatusMessage("Ready");
    }, 800); // Reduced to 800ms for faster response after speech ends
  }

  const handleGeneratePDFWrapper = async () => {
    const currentItems = itemsRef.current;
    if (!currentItems || currentItems.length === 0) {
      speak("कोई आइटम नहीं है। पहले कुछ आइटम बोलें।");
      return;
    }
    setStatusMessage("Generating bill…");
    const totalAmount = await generateBillPDF(currentItems, "");
    if (totalAmount !== null) {
      speak(`बिल बन गया है। कुल रकम ₹${totalAmount} रुपये है।`);
    }
    setStatusMessage("Bill generated");
  };

  // Push-to-talk handlers
  const handleMicPress = () => {
    setIsPressing(true);

    // Start listening immediately without speaking
    setStatusMessage("Listening…");
    startListening("items");
  };

  // --- Replace handleMicRelease with this ---
  const handleMicRelease = async () => {
    // Immediately reflect UI
    setIsPressing(false);

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // If we think we're listening, attempt a proper stop
    if (listening) {
      setStatusMessage("Finalizing...");

      // Make best-effort attempts to stop recognition:
      // 1) Call stopListening() from the hook (preferred)
      // 2) After short delay, force-clear UI state if stop didn't finish
      console.debug("[Mic] Attempting to stopListening() (start)");
      let stopCompleted = false;
      const stopPromise = (async () => {
        try {
          await stopListening(); // your hook implementation
          stopCompleted = true;
          console.debug("[Mic] stopListening() resolved");
        } catch (err) {
          console.warn("[Mic] stopListening() threw:", err);
        }
      })();

      // Wait up to 1500ms for recognition to finish
      const raceTimeout = new Promise<void>((resolve) =>
        setTimeout(resolve, 1500)
      );

      await Promise.race([stopPromise, raceTimeout]);

      // If stop didn't complete, still try to force UI cleanup and call any abort exposed by the hook
      if (!stopCompleted) {
        console.warn("[Mic] stopListening() did not complete in time — forcing UI cleanup");
        // If your hook exposes an 'abort' method or ref to SpeechRecognition, call it here
        try {
          // If your hook exposes a global ref like currentRecognitionRef, call currentRecognitionRef.current?.abort()
          // Example (uncomment if you have such a ref):
          // currentRecognitionRef.current?.abort?.();
        } catch (err) {
          console.warn("[Mic] abort attempt failed:", err);
        }
      }

      // Always ensure listening UI state is cleared in the app
      // If your hook manages `listening`, we cannot directly set it here — but we can force the local UI that depends on it.
      // The safest approach: set a small delay and if listening still true, flip local UI and log.
      setTimeout(() => {
        // If after stop attempt the `listening` prop still reports true, log and force UI flags
        if ((window as any).__DEV__) {
          console.debug("[Mic] Post-stop check - listening:", listening);
        }
        // Force local UI cleanup
        setIsPressing(false);
        if (!isProcessing) setStatusMessage("Ready");
      }, 300);

      return;
    } else {
      // Not listening — ensure UI is reset
      setStatusMessage("Ready");
    }
  };

  // --- Replace onWindowPointerUp with this ---
  const onWindowPointerUp = (ev: PointerEvent) => {
    if (pointerIdRef.current == null || ev.pointerId === pointerIdRef.current) {
      const btn = document.getElementById("mic-btn");
      try {
        if (pointerIdRef.current != null) {
          (btn as any)?.releasePointerCapture?.(pointerIdRef.current);
        }
      } catch (err) {
        // ignore
      }
      pointerIdRef.current = null;
      removeWindowPointerListeners();
      // Call release handler but don't await it (UI should update immediately)
      handleMicRelease().catch((err) => console.warn("[Mic] handleMicRelease failed:", err));
    }
  };

  // --- New: robust pointer handling to catch releases on mobile ----
  // Keep track of active pointer id so global listeners only respond to that pointer
  const pointerIdRef = useRef<number | null>(null);

  // Function to remove window listeners (safe to call multiple times)
  const removeWindowPointerListeners = () => {
    window.removeEventListener("pointerup", onWindowPointerUp);
    window.removeEventListener("pointercancel", onWindowPointerUp);
  };


  const handlePointerDown = (e: React.PointerEvent) => {
    // prevent default to avoid synthetic mouse events as well as mostly-needed mobile behavior
    e.preventDefault();

    // record pointer id and set pointer capture so we reliably get the release
    pointerIdRef.current = e.pointerId;
    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch (err) {
      // some environments may not support pointer capture; that's ok
    }

    // Add global listeners so release is detected even if pointer leaves the button or is released outside
    removeWindowPointerListeners();
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerUp);

    handleMicPress();
  };

  // We no longer rely solely on onPointerUp of the element; but keep it to handle same-element ups
  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    // release pointer capture if this is the active pointer
    if (pointerIdRef.current != null && pointerIdRef.current === e.pointerId) {
      try {
        (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
      } catch (err) {
        // ignore
      }
      pointerIdRef.current = null;
    }
    removeWindowPointerListeners();
    void handleMicRelease();
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    e.preventDefault();
    removeWindowPointerListeners();
    pointerIdRef.current = null;
    void handleMicRelease();
  };

  // Clean up on unmount just in case
  useEffect(() => {
    return () => {
      removeWindowPointerListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Safety fallback: if UI thinks press ended but the hook still says "listening" after a bit, force UI cleanup
  useEffect(() => {
    if (!isPressing && listening) {
      const t = setTimeout(() => {
        console.warn("[Mic] Safety fallback triggered: clearing listening UI after release.");
        // Attempt to stop and force UI updates
        stopListening().catch((e) => console.warn("[Mic] fallback stopListening threw:", e)).finally(() => {
          setIsPressing(false);
          if (!isProcessing) setStatusMessage("Ready");
        });
      }, 2000);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPressing, listening]);

  useEffect(() => {
    console.debug("[Mic UI] listening:", listening, "isPressing:", isPressing, "isProcessing:", isProcessing);
  }, [listening, isPressing, isProcessing]);

  // 2) Keep UI in sync: when recognition stops, force UI cleanup immediately
  useEffect(() => {
    if (!listening) {
      // If recognition has ended, ensure the press-state is cleared and status updated.
      // Use a microtask to avoid race conditions with onend handlers.
      Promise.resolve().then(() => {
        if (isPressing) {
          console.debug("[Mic UI] Syncing: clearing isPressing because listening is false");
          setIsPressing(false);
        }
        if (!isProcessing) {
          setStatusMessage("Ready");
        }
      });
    } else {
      // When listening becomes true, ensure UI reflects that
      setIsPressing(true);
      setStatusMessage("Listening…");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  function forceRepaint(el?: HTMLElement | null) {
    if (!el) return;

    try {
      // 1) quick visibility toggle using two RAFs — minimal visual flicker
      el.style.willChange = 'transform, opacity';
      el.style.backfaceVisibility = 'hidden';
      el.style.transform = 'translateZ(0)'; // hint to create a composited layer

      // Hide then show over two rAFs to force re-layout/repaint
      el.style.visibility = 'hidden';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.visibility = '';
          // cleanup hints after a short delay
          setTimeout(() => {
            try {
              el.style.willChange = '';
              el.style.backfaceVisibility = '';
              el.style.transform = '';
            } catch { }
          }, 200);
        });
      });
    } catch (err) {
      // As a slightly stronger fallback, toggle display none briefly
      try {
        const prev = el.style.display;
        el.style.display = 'none';
        setTimeout(() => {
          el.style.display = prev || '';
        }, 50);
      } catch (e) {
        // nothing else we can do
        console.warn('[Mic] forceRepaint fallback failed', e);
      }
    }
  }

  // force repaint & remount when listening toggles off (most important)
  useEffect(() => {
    // show a debug console entry
    console.debug('[Mic UI] effect listening changed ->', listening, 'isPressing ->', isPressing);

    // If we just STOPPED listening, remount + repaint the button to ensure visual updates
    if (!listening) {
      // small delay to let the hook finish its cleanup, then repaint
      setTimeout(() => {
        // force a repaint of the mic button element
        forceRepaint(micBtnRef.current);

        // increment remountCounter to force React to recreate the node (stronger guarantee)
        setRemountCounter((c) => c + 1);

        // also force repaint for status indicator (optional)
        const statusNode = document.querySelector('.listening-indicator') as HTMLElement | null;
        forceRepaint(statusNode);
      }, 80); // 80ms gives recognition stack small time to finish, tweak if needed
    } else {
      // If we began listening, ensure the mic button shows active immediately
      // For safety do a quick repaint too
      forceRepaint(micBtnRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);





  const handleClear = () => {
    clearItems();
    resetFlow();
    currentModeRef.current = "items";
    setIsProcessing(false);
    setStatusMessage("Cleared all items");
    speak("क्लियर कर दिया।");
  };

  return (
    <IonPage>
      <IonHeader className="app-header">
        <IonToolbar color="dark">
          <IonTitle className="app-title">
            <span className="logo">🧾</span> Vaani AI Billing
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding home-content">
        {/* Items Section */}
        <div className="items-section">
          {items.length === 0 ? (
            <div className="empty-state">
              <IonText color="medium">
                🎙 Hold the mic button and speak to add items.
              </IonText>
            </div>
          ) : (
            <>
              {/* Item Count Badge */}
              <div className="items-count-badge">
                📦 {items.length} {items.length === 1 ? "Item" : "Items"} • Total: ₹
                {items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
              </div>

              {/* Scrollable Items List */}
              <div className="items-list-container">
                <ItemsTable
                  items={items}
                  editingIndex={editingIndex}
                  editFormData={editFormData}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onEditChange={handleEditChange}
                  onSaveEdit={handleSaveEdit}
                  onDeleteItem={handleDeleteItem}
                />
              </div>
            </>
          )}
        </div>
      </IonContent>

      {/* Professional Footer Area */}
      <IonFooter className="home-footer">
        {/* 1. Transcript and Status Area */}
        <div className="transcript-area">
          {/* Transcript Box */}
          <IonCard className="transcript-card">
            <IonCardContent className="transcript-box-content">
              <IonText
                color={speechBuffer || listening ? "dark" : "medium"}
                className="transcript-text"
              >
                {speechBuffer ||
                  (listening ? "Listening..." : "Press & hold the mic to start billing...")}
              </IonText>
            </IonCardContent>
          </IonCard>

          {/* Processing/Listening Indicator */}
          <div className="status-indicator">
            {isProcessing ? (
              <div className="processing-indicator">
                <IonText color="medium" className="processing-text">
                  Processing...
                </IonText>
                <IonProgressBar type="indeterminate" color="primary"></IonProgressBar>
              </div>
            ) : listening ? (
              <div className="listening-indicator">
                <IonIcon icon={mic} color="danger" className="pulse-icon" />
                <IonText color="medium">Listening...</IonText>
              </div>
            ) : (
              <div className="status-placeholder">&nbsp;</div>
            )}
          </div>
        </div>

        {/* 2. Bottom Action Bar */}
        <div className="bottom-action-bar">
          <IonButton
            fill="outline"
            color="medium"
            onClick={handleClear}
            className="footer-action-btn"
          >
            <IonIcon icon={refresh} slot="start" />
            Clear
          </IonButton>

          {/* Push-to-Talk Mic Button */}
          {/* Push-to-Talk Mic Button (emoji icon fallback + remount + ref) */}
          <button
            id="mic-btn"
            ref={micBtnRef}                                      // <-- ref added
            key={`${listening ? "mic-listening" : "mic-idle"}-${remountCounter}`} // force remount on counter change
            className={`mic-button ${isPressing || listening ? "active" : ""}`}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerUp}
            onTouchStart={(e) => { e.preventDefault(); handlePointerDown(e as any); }} // fallback
            onTouchEnd={(e) => { e.preventDefault(); handlePointerUp(e as any); }}      // fallback
            style={{
              background: isPressing || listening ? "var(--ion-color-danger)" : "var(--ion-color-success)",
              border: "none",
              borderRadius: "50%",
              width: "64px",
              height: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "all 0.2s ease",
              touchAction: "none",
              fontSize: 32,
              color: "white",
              lineHeight: 1,
            }}
            aria-pressed={isPressing || listening}
            aria-label={isPressing || listening ? "Stop listening" : "Start listening"}
          >
            <span role="img" aria-hidden="false" style={{ fontSize: 32 }}>
              {isPressing || listening ? "⏺️" : "🎤"}
            </span>
          </button>


          <IonButton fill="outline" color="light" onClick={handleGeneratePDFWrapper} className="footer-action-btn">
            <IonIcon icon={documentText} slot="start" />
            Bill
          </IonButton>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
