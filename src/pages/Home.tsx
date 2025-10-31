import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonBadge,
} from '@ionic/react';
import BillingControls from '../components/BillingControls';
import SpeechLog from '../components/SpeechLog';
import SpeechBuffer from '../components/SpeechBuffer';
import ItemsTable from '../components/ItemsTable';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useBillFlow } from '../hooks/useBillFlow';
import { useItemManagement } from '../hooks/useItemManagement';
import { useItemEdit } from '../hooks/useItemEdit';
import { generateBillPDF } from '../utils/pdfGenerator';
import { handleItemSpeech } from '../services/speechHandlers';
import './Home.css';

const Home: React.FC = () => {
  const [customerName, setCustomerName] = useState(''); // Keep for manual entry if needed
  const [isProcessing, setIsProcessing] = useState(false);

  const { speak } = useSpeechSynthesis();

  const {
    speechBuffer,
    recognizedText,
    appendToRecognizedText,
    updateSpeechBuffer,
    clearBuffer,
    resetFlow,
    parseTimerRef,
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
        console.log('Speech recognition ended');
      },
    });

  function handleSpeechResult(transcript: string, mode: string) {
    appendToRecognizedText(transcript);

    // Directly handle items speech (no name mode)
    updateSpeechBuffer(transcript, (buffer) => {
      handleItemSpeech(buffer, itemsRef.current, {
        speak,
        setIsProcessing,
        handleGeneratePDF: handleGeneratePDFWrapper,
        itemHandlers: {
          handleAddItems,
          handleDeleteItems,
          handleUpdateItems,
        },
      });
    });
  }

  const handleGeneratePDFWrapper = async () => {
    const currentItems = itemsRef.current;
    if (!currentItems || currentItems.length === 0) {
      speak('कोई आइटम नहीं है। पहले कुछ आइटम बोलें।');
      return;
    }

    const totalAmount = await generateBillPDF(currentItems, customerName);
    if (totalAmount !== null) {
      speak(`बिल बन गया है। कुल रकम ₹${totalAmount} रुपये है।`);
    }
  };

  const handleCreateBill = () => {
    // Directly start listening for items (no name step)
    speak('नमस्कार! कृपया अपने आइटम बताइए।');
    startListening('items');
  };

  const handleStopListening = () => {
    stopListening();
    clearBuffer();
    if (speechBuffer.length > 0) {
      handleItemSpeech(speechBuffer, itemsRef.current, {
        speak,
        setIsProcessing,
        handleGeneratePDF: handleGeneratePDFWrapper,
        itemHandlers: {
          handleAddItems,
          handleDeleteItems,
          handleUpdateItems,
        },
      });
    }
  };

  const handleClear = () => {
    clearItems();
    setCustomerName('');
    resetFlow();
    currentModeRef.current = 'items';
    setIsProcessing(false);
    speak('क्लियर कर दिया।');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>🗣️ Voice Billing Assistant</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {isProcessing && (
          <IonCard color="warning">
            <IonCardContent className="status-card">
              <IonSpinner name="crescent" />
              <span style={{ marginLeft: '12px' }}>Processing...</span>
            </IonCardContent>
          </IonCard>
        )}

        {listening && (
          <IonCard color="success">
            <IonCardContent className="status-card">
              <IonBadge color="light" className="pulse-badge">
                ●
              </IonBadge>
              <span style={{ marginLeft: '12px' }}>Listening... Speak now</span>
            </IonCardContent>
          </IonCard>
        )}

        <BillingControls
          listening={listening}
          onCreateBill={handleCreateBill}
          onStartListening={() => startListening('items')}
          onStopListening={handleStopListening}
          onGeneratePDF={handleGeneratePDFWrapper}
          onClear={handleClear}
        />

        <SpeechLog recognizedText={recognizedText} customerName={customerName} />
        <SpeechBuffer speechBuffer={speechBuffer} />

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
      </IonContent>
    </IonPage>
  );
};

export default Home;