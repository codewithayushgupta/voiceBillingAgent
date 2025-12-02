import React from "react";
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol
} from "@ionic/react";

const Reports: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>📊 Sales Reports</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ padding: 12 }}>
        <h3 style={{ marginTop: 6, marginBottom: 16 }}>Today's Summary</h3>

        {/* Main Stats Card */}
        <IonCard style={{ marginBottom: 16 }}>
          <IonCardContent>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: 'var(--ion-color-primary)' }}>
                ₹1,540.50
              </div>
              <div style={{ color: 'var(--ion-color-medium)', marginTop: 4 }}>
                Total Sales Today
              </div>
            </div>

            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <div style={{ 
                    padding: 16, 
                    background: 'var(--ion-color-light)', 
                    borderRadius: 12 
                  }}>
                    <div style={{ color: 'var(--ion-color-medium)', fontSize: 14 }}>
                      Total Bills
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>
                      8
                    </div>
                  </div>
                </IonCol>
                <IonCol size="6">
                  <div style={{ 
                    padding: 16, 
                    background: 'var(--ion-color-light)', 
                    borderRadius: 12 
                  }}>
                    <div style={{ color: 'var(--ion-color-medium)', fontSize: 14 }}>
                      Avg. Bill
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>
                      ₹193
                    </div>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Weekly Summary */}
        <h3 style={{ marginBottom: 12 }}>This Week</h3>
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <div style={{ fontSize: 14, color: 'var(--ion-color-medium)' }}>Total Sales</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ion-color-success)' }}>
                    ₹8,450.00
                  </div>
                </IonCol>
                <IonCol>
                  <div style={{ fontSize: 14, color: 'var(--ion-color-medium)' }}>Bills</div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>
                    42
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Reports;