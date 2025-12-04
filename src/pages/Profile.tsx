import React from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
} from "@ionic/react";
import { shareSocialOutline, pencilOutline, logOutOutline } from "ionicons/icons";

/**
 * Mobile-first Profile page (uses global AppHeader).
 * Uses .page-content so it doesn't hide under the fixed header/tabbar.
 */

const Profile: React.FC = () => {
  // Dummy/profile data
  const store = {
    name: "राजेश स्टोर",
    owner: "राजेश कुमार",
    phone: "+91 98765 43210",
    address: "Patna, Bihar, India",
    gst: "10AAAAA0000A1Z5",
    memberSince: "Dec 2024",
    totalSales: 15420.5,
    bills: 324,
    rating: 4.6,
    avatarColorStart: "var(--ion-color-primary)",
    avatarColorEnd: "var(--ion-color-secondary)",
  };

  return (
    <IonPage>
      <IonContent className="page-content">
        <div style={{ padding: "10px 14px 20px", marginTop:40 }}>
          {/* Profile header card */}
          <IonCard className="app-surface" style={{ borderRadius: 14, marginBottom: 14, padding: 12 }}>
            <IonCardContent style={{ padding: 8 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {/* Avatar */}
                <div
                  aria-hidden
                  style={{
                    width: 74,
                    height: 74,
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, ${store.avatarColorStart}, ${store.avatarColorEnd})`,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                    color: "white",
                    fontSize: 28,
                    flexShrink: 0,
                  }}
                >
                  🏪
                </div>

                {/* Name / Owner */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--ion-text-color)" }}>{store.name}</div>
                  <div style={{ fontSize: 13, color: "var(--app-muted)", marginTop: 4 }}>Owner: {store.owner}</div>

                  {/* quick stats (compact) */}
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <div style={{ background: "var(--app-surface)", borderRadius: 10, padding: "6px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "var(--app-muted)" }}>Sales</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ion-color-primary)" }}>₹{store.totalSales.toLocaleString()}</div>
                    </div>

                    <div style={{ background: "var(--app-surface)", borderRadius: 10, padding: "6px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "var(--app-muted)" }}>Bills</div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{store.bills}</div>
                    </div>

                    <div style={{ background: "var(--app-surface)", borderRadius: 10, padding: "6px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "var(--app-muted)" }}>Rating</div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{store.rating} ⭐</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* action row */}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <IonButton expand="block" fill="outline" color="primary" onClick={() => alert("Edit profile")}>
                  <IonIcon icon={pencilOutline} slot="start" />
                  Edit
                </IonButton>

                <IonButton expand="block" fill="outline" onClick={() => alert("Share profile")}>
                  <IonIcon icon={shareSocialOutline} slot="start" />
                  Share
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Store details */}
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Store Details</div>

          <IonList style={{ padding: 0, marginBottom: 12 }}>
            <IonItemCard label="Phone" value={store.phone} />
            <IonItemCard label="Address" value={store.address} />
            <IonItemCard label="GST Number" value={store.gst} />
            <IonItemCard label="Member Since" value={store.memberSince} />
          </IonList>

          {/* Security / actions */}
          <div style={{ marginTop: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Account</div>

            <IonCard style={{ borderRadius: 12 }}>
              <IonCardContent style={{ padding: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Change Password</div>
                    <div style={{ fontSize: 12, color: "var(--app-muted)" }}>Update your login credentials</div>
                  </div>
                  <IonButton fill="clear" onClick={() => alert("Open change password")}>Open</IonButton>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard style={{ borderRadius: 12, marginTop: 10 }}>
              <IonCardContent style={{ padding: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Logout</div>
                    <div style={{ fontSize: 12, color: "var(--app-muted)" }}>Sign out from this device</div>
                  </div>
                  <IonButton color="danger" fill="clear" onClick={() => alert("Logging out...")}>
                    <IonIcon icon={logOutOutline} slot="icon-only" />
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </div>

        {/* Floating Edit FAB (above tab bar) */}
        <IonFab
          vertical="bottom"
          horizontal="end"
          slot="fixed"
          style={{ right: 16, zIndex: 1100 }}
        >
          <IonFabButton color="primary" onClick={() => alert("Edit profile (FAB)")}>
            <IonIcon icon={pencilOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

/* small reusable item row rendered as a rounded card */
const IonItemCard: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ background: "var(--app-surface)", borderRadius: 12, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--app-muted)" }}>{label}</div>
          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 6 }}>{value}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
