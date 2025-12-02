// src/pages/Home.tsx
import React from "react";
import { IonPage, IonContent } from "@ionic/react";

import ItemsSection from "../components/ItemsSection";
import TranscriptFooter from "../components/TranscriptFooter";

import { useHomeLogic } from "../hooks/useHomeLogic";
import "./Home.css";

const Home: React.FC = () => {
  const logic = useHomeLogic();

  return (
    <IonPage
      style={{
        background: "var(--ion-background-color)",
        color: "var(--ion-text-color)",
      }}
    >
      


      {/* Main Content */}
      <IonContent
        id="main-content"
        fullscreen
        className="ion-padding home-content"
        style={{
          paddingTop: 12,
          background: "var(--ion-background-color)",
          color: "var(--ion-text-color)",
          transition: "background 0.25s ease, color 0.25s ease",
        }}
      >
        <ItemsSection
          items={logic.items}
          editingIndex={logic.editingIndex}
          editFormData={logic.editFormData}
          onStartEdit={logic.handleStartEdit}
          onCancelEdit={logic.handleCancelEdit}
          onEditChange={logic.handleEditChange}
          onSaveEdit={logic.handleSaveEdit}
          onDeleteItem={logic.handleDeleteItem}
        />
      </IonContent>

      {/* Footer */}
      <TranscriptFooter
        speechBuffer={logic.speechBuffer}
        listening={logic.listening}
        isProcessing={logic.isProcessing}
        statusMessage={logic.statusMessage}
        onClear={logic.handleClear}
        onGenerate={logic.handleGeneratePDFWrapper}
        onMicPointerDown={logic.handlePointerDown}
        onMicPointerUp={logic.handlePointerUp}
        onMicPointerCancel={logic.handlePointerCancel}
        micBtnRef={logic.micBtnRef}
        remountKey={`mic-${logic.listening}-${logic.remountCounter}`}
        isPressing={logic.isPressing}
      />
    </IonPage>
  );
};

export default Home;
