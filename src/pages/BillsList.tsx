import React from "react";
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel,
  IonCard,
  IonCardContent,
  IonBadge
} from "@ionic/react";

const BillsList: React.FC = () => {
  // Sample bills data
  const bills = [
    { id: 1, number: '001', items: 3, total: 420.00, date: '02 Dec 2024' },
    { id: 2, number: '002', items: 5, total: 780.50, date: '02 Dec 2024' },
    { id: 3, number: '003', items: 2, total: 340.00, date: '01 Dec 2024' },
  ];

  return (
    <IonPage>

      <IonContent fullscreen style={{ padding: 12 }}>
        {/* Summary Card */}
        <IonCard style={{ marginBottom: 16 }}>
          <IonCardContent>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: 'var(--ion-color-primary)' }}>
                ₹{bills.reduce((sum, b) => sum + b.total, 0).toFixed(2)}
              </h2>
              <p style={{ margin: '4px 0 0', color: 'var(--ion-color-medium)' }}>
                Total Sales ({bills.length} bills)
              </p>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Bills List */}
        <h3 style={{ marginTop: 6, marginBottom: 12, paddingLeft: 4 }}>Recent Bills</h3>
        <IonList>
          {bills.map(bill => (
            <IonItem key={bill.id} button detail style={{ marginBottom: 8, borderRadius: 12 }}>
              <IonLabel>
                <h2 style={{ fontWeight: 600 }}>Bill #{bill.number}</h2>
                <p>{bill.items} items • {bill.date}</p>
                <h3 style={{ color: 'var(--ion-color-primary)', marginTop: 4 }}>
                  ₹{bill.total.toFixed(2)}
                </h3>
              </IonLabel>
              <IonBadge slot="end" color="success">Paid</IonBadge>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default BillsList;