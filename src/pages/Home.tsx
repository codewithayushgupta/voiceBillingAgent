import React, { useState, useRef } from "react";
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
  const { speak, stop: stopSpeech, isSpeakingRef } = useSpeechSynthesis();
  const startTimeRef = useRef<number | null>(null);

  const {
    speechBuffer,
    appendToRecognizedText,
    updateSpeechBuffer,
    clearBuffer,
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

  const { listening, startListening, stopListening, currentModeRef } =
    useSpeechRecognition({
      onResult: handleSpeechResult,
      onEnd: () => {
        console.log("Speech recognition ended");
        setStatusMessage("Stopped listening");
      },
      onStart: () => {
        // User started speaking - interrupt any ongoing TTS immediately
        if (isSpeakingRef.current) {
          console.log("User started speaking - interrupting TTS");
          stopSpeech();
        }
      },
    });

  async function handleSpeechResult(transcript: string) {
    // Priority: Stop TTS immediately when user speaks
    if (isSpeakingRef.current) {
      await stopSpeech();
    }

    if (!startTimeRef.current) startTimeRef.current = performance.now();

    appendToRecognizedText(transcript);
    setStatusMessage("Processing speech…");

    console.log("Processing...");

    setIsProcessing(true);

    // Run background process async
    setTimeout(() => {
      updateSpeechBuffer(transcript, async (buffer) => {
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
        console.log(`Item processed in ${(t1 - t0).toFixed(2)} ms`);

        setIsProcessing(false);
        startTimeRef.current = null;
        setStatusMessage("Ready");
      });
    }, 10);
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

  const handleStartBilling = async () => {
    // Stop any ongoing speech before starting to listen
    if (isSpeakingRef.current) {
      await stopSpeech();
    }

    speak("कृपया अपने आइटम बोलिए।");
    setStatusMessage("Listening…");

    // Wait for speech to complete before starting recognition
    setTimeout(() => {
      startListening("items");
    }, 2000); // Adjust based on typical speech duration
  };

  const handleStopListening = async () => {
    try {
      await stopListening();
    } catch (err) {
      console.error("Error while stopping recognition:", err);
    } finally {
      clearBuffer();
      setStatusMessage("Stopped listening");
    }
  };

  const handleClear = async () => {
    // Stop speech and recognition before clearing
    if (isSpeakingRef.current) {
      await stopSpeech();
    }
    if (listening) {
      await stopListening();
    }

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
        <div className="items-section">
          {items.length === 0 ? (
            <div className="empty-state">
              <IonText color="medium">
                🎙 Start speaking to add items to your bill.
              </IonText>
            </div>
          ) : (
            <div className="scrollable-items">
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
          )}
        </div>

      </IonContent>

      <IonFooter className="home-footer">
        <div className="transcript-area">
          <IonCard className="transcript-card">
            <IonCardContent className="transcript-box-content">
              <IonText
                color={speechBuffer || listening ? "dark" : "medium"}
                className="transcript-text"
              >
                {speechBuffer ||
                  (listening
                    ? "Listening..."
                    : "Press the mic to start billing...")}
              </IonText>
            </IonCardContent>
          </IonCard>

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

          <IonButton
            color={listening ? "danger" : "success"}
            shape="round"
            size="large"
            className={`mic-btn ${listening ? "active" : ""}`}
            onClick={listening ? handleStopListening : handleStartBilling}
          >
            <IonIcon icon={listening ? stopCircle : mic} slot="icon-only" />
          </IonButton>

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