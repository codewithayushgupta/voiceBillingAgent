import React from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonCard,
  IonCardContent,
  IonBadge,
  IonRippleEffect,
  IonIcon,
} from "@ionic/react";
import { receiptSharp } from "ionicons/icons";

const BillsList: React.FC = () => {
  const bills = [
    { id: 1, number: "001", items: 3, total: 420.0, date: "02 Dec 2024", status: "paid", customer: "Vinod Agarwal" },
    { id: 2, number: "002", items: 5, total: 780.5, date: "02 Dec 2024", status: "paid", customer: "Neha Sharma" },
    { id: 3, number: "003", items: 2, total: 340.0, date: "01 Dec 2024", status: "pending", customer: "Rahul Verma" },
  ];

  const totalAmount = bills.reduce((sum, b) => sum + b.total, 0).toFixed(2);

  const statusColor = (s?: string) => {
    switch (s) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "medium";
    }
  };

  return (
    <IonPage>
      <IonContent
        className="page-content"
        style={{
          paddingTop: "calc(var(--app-header-height) + 8px)",
          paddingLeft: 14,
          paddingRight: 14,
        }}
      >
        {/* SUMMARY CARD */}
        <IonCard
          className="app-surface"
          style={{
            borderRadius: 14,
            marginBottom: 16,
            marginTop: 60,
            padding: 12,
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          }}
        >
          <IonCardContent
            style={{
              padding: "12px 10px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "rgba(var(--ion-color-primary-rgb), 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IonIcon icon={receiptSharp} style={{ fontSize: 20, color: "var(--ion-color-primary)" }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "var(--app-muted)" }}>Total Sales</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>₹{totalAmount}</div>
              <div style={{ fontSize: 11, color: "var(--ion-color-medium)", marginTop: 2 }}>
                {bills.length} invoices this week
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* TITLE */}
        <div
          style={{
            marginBottom: 10,
            marginLeft: 10,
            fontSize: 15,
            fontWeight: 600,
            color: "var(--ion-text-color)",
          }}
        >
          Recent Bills
        </div>

        {/* BILL LIST */}
        <IonList style={{ background: "transparent", padding: 0, margin: 0 }}>
          {bills.map((bill) => (
            <IonCard
              key={bill.id}
              button
              className="app-surface ion-activatable"
              style={{
                borderRadius: 12,
                padding: 10,
                marginBottom: 10,
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
              }}
            >
              <IonRippleEffect />

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* LEFT ICON */}
                <div
                  style={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    borderRadius: 10,
                    background: "rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IonIcon icon={receiptSharp} style={{ fontSize: 18, color: "var(--ion-color-primary)" }} />
                </div>

                {/* CONTENT */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Bill #{bill.number}</div>

                  {/* ⭐ NEW — CUSTOMER NAME */}
                  <div
                    style={{
                      fontSize: 13,
                      marginTop: 2,
                      color: "var(--ion-text-color)",
                      fontWeight: 500,
                    }}
                  >
                    {bill.customer}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      marginTop: 2,
                      color: "var(--app-muted)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {bill.items} items • {bill.date}
                  </div>
                </div>

                {/* AMOUNT + STATUS */}
                <div style={{ textAlign: "right", minWidth: 70 }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--ion-color-primary)",
                    }}
                  >
                    ₹{bill.total.toFixed(2)}
                  </div>

                  <IonBadge
                    color={statusColor(bill.status)}
                    style={{ marginTop: 6, fontSize: 11, padding: "4px 8px", borderRadius: 8 }}
                  >
                    {bill.status?.toUpperCase()}
                  </IonBadge>
                </div>
              </div>
            </IonCard>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default BillsList;
