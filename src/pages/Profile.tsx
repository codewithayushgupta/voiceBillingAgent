import React from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonList } from "@ionic/react";

const Profile: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ padding: 12 }}>
        <h3 style={{ marginTop: 6 }}>User</h3>
        <IonList>
          <IonItem>
            <IonLabel>
              <h3>Store Name</h3>
              <p>Owner: Rahul</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
