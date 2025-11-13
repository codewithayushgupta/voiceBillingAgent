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

  const handleMicRelease = async () => {
    setIsPressing(false);
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Wait a bit to ensure final speech is captured before stopping
    if (listening) {
      setStatusMessage("Finalizing...");
      
      // Wait 500ms to ensure speech recognition captures the final words
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        await stopListening();
        setStatusMessage("Processing...");
        // Don't clear buffer here - let the speech result handler process it
      } catch (err) {
        console.error("Error while stopping recognition:", err);
        setStatusMessage("Error");
      }
    }
  };

  // Handle touch/mouse events
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    handleMicPress();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    handleMicRelease();
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    e.preventDefault();
    handleMicRelease();
  };

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
                📦 {items.length} {items.length === 1 ? 'Item' : 'Items'} • Total: ₹
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
                  (listening
                    ? "Listening..."
                    : "Press & hold the mic to start billing...")}
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
                <IonProgressBar
                  type="indeterminate"
                  color="primary"
                ></IonProgressBar>
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
          <button
            className={`mic-button ${isPressing || listening ? "active" : ""}`}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerUp}
            style={{
              background: isPressing || listening 
                ? "var(--ion-color-danger)" 
                : "var(--ion-color-success)",
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
            }}
          >
            <IonIcon
              icon={isPressing || listening ? stopCircle : mic}
              style={{ fontSize: "32px", color: "white" }}
            />
          </button>

          <IonButton
            fill="outline"
            color="light"
            onClick={handleGeneratePDFWrapper}
            className="footer-action-btn"
          >
            <IonIcon icon={documentText} slot="start" />
            Bill
          </IonButton>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Home;