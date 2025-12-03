// src/components/AppHeader.tsx
import React, { useState, useEffect } from "react";
import { IonHeader, IonToolbar, IonTitle, IonMenuButton, IonIcon, IonItem, IonToggle } from "@ionic/react";
import { menu } from "ionicons/icons";

const AppHeader: React.FC<{ title?: string }> = ({ title = "Vaani AI Billing" }) => {
  const [dark, setDark] = useState<boolean>(() => {
    // initial guess from body class or system
    const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return document?.body?.classList?.contains("dark") || prefersDark;
  });

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <IonHeader
      className="app-header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "var(--app-header-height)",
        zIndex: 1000,
        background: "var(--ion-background-color)",
        borderBottom: "var(--app-border)",
        // keep hardware compositing smooth on mobile
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {/* Keep toolbar height equal to toolbar-only token so content inside centers correctly */}
      <IonToolbar style={{ height: "var(--app-header-toolbar-height)", alignItems: "center", paddingLeft: 8, paddingRight: 8 }}>
        <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 8 }}>
          <IonMenuButton autoHide={false} style={{ marginLeft: 2 }}>
            <IonIcon icon={menu} style={{ fontSize: 22, color: "var(--ion-text-color)" }} />
          </IonMenuButton>

          <IonTitle style={{ fontSize: 18, color: "var(--ion-text-color)", marginLeft: 4 }}>
            <span aria-hidden="true" style={{ marginRight: 8 }}>🧾</span>
            {title}
          </IonTitle>

          <div style={{ flex: 1 }} />

          {/* small dark toggle so users can switch easily */}
          <IonItem lines="none" slot="end" style={{ width: 80, minWidth: 80, background: "transparent" }}>
            <IonToggle checked={dark} onIonChange={(e) => setDark(e.detail.checked)} aria-label="Toggle dark mode" />
          </IonItem>
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader;
