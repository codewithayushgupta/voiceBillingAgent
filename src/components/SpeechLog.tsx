import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonBadge,
} from '@ionic/react';

interface SpeechLogProps {
  recognizedText: string;
  customerName: string;
}

const SpeechLog: React.FC<SpeechLogProps> = ({
  recognizedText,
  customerName,
}) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>🗒️ Speech Log</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div style={{ minHeight: '60px', marginBottom: '12px' }}>
          <p style={{ fontSize: '14px', color: 'var(--ion-color-medium)' }}>
            {recognizedText || 'No speech yet.'}
          </p>
        </div>
        <IonItem lines="none">
          <IonLabel>Customer:</IonLabel>
          <IonBadge color="warning" slot="end">
            {customerName || '(not set)'}
          </IonBadge>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
};

export default SpeechLog;