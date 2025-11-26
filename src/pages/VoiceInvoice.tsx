import React from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent } from "@ionic/react";
import TranscriptFooter from "../components/TranscriptFooter"; // optional reuse

const VoiceInvoice: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Voice Invoice</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ padding: 12 }}>
        <h3 style={{ marginTop: 6 }}>Create Invoice by Voice</h3>

        <IonCard>
          <IonCardContent>
            <p>Press and hold the mic at the bottom to speak items. This screen focuses voice actions and shows larger transcript & controls.</p>
          </IonCardContent>
        </IonCard>

        {/* Optionally render big mic & transcript here — or reuse TranscriptFooter */}
      </IonContent>
    </IonPage>
  );
};

export default VoiceInvoice;
