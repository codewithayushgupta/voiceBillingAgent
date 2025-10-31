import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';

interface SpeechBufferProps {
  speechBuffer: string;
}

const SpeechBuffer: React.FC<SpeechBufferProps> = ({ speechBuffer }) => {
  return (
    <IonCard color="light">
      <IonCardHeader>
        <IonCardTitle style={{ fontSize: '16px' }}>
          🧠 AI Buffer
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p
          style={{
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'var(--ion-color-medium)',
            minHeight: '20px',
          }}
        >
          {speechBuffer || 'Waiting for input...'}
        </p>
      </IonCardContent>
    </IonCard>
  );
};

export default SpeechBuffer;