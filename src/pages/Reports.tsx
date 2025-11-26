import React from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent } from "@ionic/react";

const Reports: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Reports</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ padding: 12 }}>
        <h3 style={{ marginTop: 6 }}>Sales & Reports</h3>
        <IonCard>
          <IonCardContent>
            <p>Summary charts, daily/weekly totals and export options go here.</p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Reports;
