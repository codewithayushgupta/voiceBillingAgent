import React from "react";
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonList,
  IonCard,
  IonCardContent,
  IonAvatar
} from "@ionic/react";

const Profile: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>👤 Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ padding: 12 }}>
        {/* Profile Header Card */}
        <IonCard style={{ marginBottom: 16 }}>
          <IonCardContent>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--ion-color-primary), var(--ion-color-secondary))',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}>
                🏪
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>
                राजेश स्टोर
              </h2>
              <p style={{ color: 'var(--ion-color-medium)', margin: 0 }}>
                Owner: राजेश कुमार
              </p>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Details List */}
        <h3 style={{ marginBottom: 12, paddingLeft: 4 }}>Store Details</h3>
        <IonList>
          <IonItem style={{ marginBottom: 8, borderRadius: 12 }}>
            <IonLabel>
              <p style={{ fontSize: 12, color: 'var(--ion-color-medium)' }}>Phone</p>
              <h3 style={{ fontWeight: 600 }}>+91 98765 43210</h3>
            </IonLabel>
          </IonItem>
          
          <IonItem style={{ marginBottom: 8, borderRadius: 12 }}>
            <IonLabel>
              <p style={{ fontSize: 12, color: 'var(--ion-color-medium)' }}>Address</p>
              <h3 style={{ fontWeight: 600 }}>Patna, Bihar, India</h3>
            </IonLabel>
          </IonItem>
          
          <IonItem style={{ marginBottom: 8, borderRadius: 12 }}>
            <IonLabel>
              <p style={{ fontSize: 12, color: 'var(--ion-color-medium)' }}>GST Number</p>
              <h3 style={{ fontWeight: 600 }}>10AAAAA0000A1Z5</h3>
            </IonLabel>
          </IonItem>
          
          <IonItem style={{ marginBottom: 8, borderRadius: 12 }}>
            <IonLabel>
              <p style={{ fontSize: 12, color: 'var(--ion-color-medium)' }}>Member Since</p>
              <h3 style={{ fontWeight: 600 }}>December 2024</h3>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Profile;