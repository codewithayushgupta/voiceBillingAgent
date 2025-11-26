// src/components/AppHeader.tsx
import React from "react";
import { IonHeader, IonToolbar, IonTitle, IonMenuButton, IonIcon } from "@ionic/react";
import { menu } from "ionicons/icons";

const AppHeader: React.FC<{ title?: string }> = ({ title = "Vaani AI Billing" }) => {
  return (
    <IonHeader className="app-header" style={{ paddingTop: 6 }}>
      <IonToolbar
        style={{
          display: "flex",
          alignItems: "center",
          background: "var(--ion-background-color)",
          color: "var(--ion-text-color)",
          borderBottom: "1px solid var(--ion-color-step-150)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
          {/* IonMenuButton integrates with IonMenu automatically */}
          <IonMenuButton autoHide={false} style={{ marginLeft: 6 }}>
            <IonIcon icon={menu} style={{ fontSize: 22, color: "var(--ion-text-color)" }} />
          </IonMenuButton>

          <IonTitle
            className="app-title"
            style={{
              fontSize: 18,
              marginLeft: 2,
              color: "var(--ion-text-color)",
            }}
          >
            <span className="logo" aria-hidden="true">🧾</span> {title}
          </IonTitle>

          <div style={{ flex: 1 }} />
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader;
