import React from 'react';
import {
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import {
  micOutline,
  stopCircleOutline,
  documentTextOutline,
  trashOutline,
  addCircleOutline,
} from 'ionicons/icons';

interface BillingControlsProps {
  listening: boolean;
  onCreateBill: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onGeneratePDF: () => void;
  onClear: () => void;
}

const BillingControls: React.FC<BillingControlsProps> = ({
  listening,
  onCreateBill,
  onStartListening,
  onStopListening,
  onGeneratePDF,
  onClear,
}) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12">
          <IonButton expand="block" color="primary" onClick={onCreateBill}>
            <IonIcon slot="start" icon={addCircleOutline} />
            Create Bill
          </IonButton>
        </IonCol>
      </IonRow>
      
      <IonRow>
        <IonCol size="12">
          {!listening ? (
            <IonButton
              expand="block"
              color="success"
              onClick={onStartListening}
            >
              <IonIcon slot="start" icon={micOutline} />
              Start Talking
            </IonButton>
          ) : (
            <IonButton
              expand="block"
              color="danger"
              onClick={onStopListening}
            >
              <IonIcon slot="start" icon={stopCircleOutline} />
              Stop Listening
            </IonButton>
          )}
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="6">
          <IonButton expand="block" color="tertiary" onClick={onGeneratePDF}>
            <IonIcon slot="start" icon={documentTextOutline} />
            PDF
          </IonButton>
        </IonCol>
        <IonCol size="6">
          <IonButton expand="block" color="medium" onClick={onClear}>
            <IonIcon slot="start" icon={trashOutline} />
            Clear
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default BillingControls;