import React from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import ItemsSection from "../components/ItemsSection";

const ItemsDetails: React.FC = () => {
  // If you want to reuse ItemsSection props, you can lift state to a parent or use a context.
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Items</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ padding: 12 }}>
        <h3 style={{ marginTop: 6 }}>Inventory / Current Items</h3>
        {/* Use the ItemsSection component or a dedicated item management UI */}
        <ItemsSection
          items={[]} editingIndex={null} editFormData={{}} 
          onStartEdit={() => {}} onCancelEdit={() => {}} 
          onEditChange={() => {}} onSaveEdit={() => {}} onDeleteItem={() => {}}
        />
      </IonContent>
    </IonPage>
  );
};

export default ItemsDetails;
