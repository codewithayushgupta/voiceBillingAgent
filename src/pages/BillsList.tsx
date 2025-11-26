import React from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from "@ionic/react";

const BillsList: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Bills</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ padding: 12 }}>
        <h3 style={{ marginTop: 6 }}>Generated Bills</h3>
        <IonList>
          {/* Replace with your bills */}
          <IonItem>
            <IonLabel>
              <h3>Bill #001</h3>
              <p>3 items • ₹ 420.00 • 02 Mar 2025</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h3>Bill #002</h3>
              <p>5 items • ₹ 780.50 • 03 Mar 2025</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default BillsList;
