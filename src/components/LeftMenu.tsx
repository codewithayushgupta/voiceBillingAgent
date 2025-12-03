import React from "react";
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonMenuToggle,
  IonIcon,
  IonAvatar,
  IonNote,
  IonBadge,
  IonItemDivider,
  IonToggle,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import {
  refresh,
  documentText,
  settingsSharp,
  personCircle,
  wallet,
  statsChart,
  helpCircle,
  logOut,
  addCircle,
  scan,
  cloudUpload,
} from "ionicons/icons";
import { menuController } from "@ionic/core";

interface Props {
  onClear: () => void;
  onGenerate: () => Promise<void> | void;
  onNavigate?: (route: string) => void; // optional navigation handler
}

// Dummy data used inside the menu to demonstrate layout & styling
const DUMMY_USER = {
  name: "Priya Sharma",
  email: "priya.sharma@example.com",
  balance: 1245.5,
  initials: "PS",
};

const QUICK_ACTIONS = [
  { id: "new", label: "New bill", icon: addCircle },
  { id: "scan", label: "Scan receipt", icon: scan },
  { id: "sync", label: "Sync data", icon: cloudUpload },
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: personCircle, route: "/dashboard" },
  { id: "bills", label: "Bills", icon: wallet, route: "/bills" },
  { id: "reports", label: "Reports", icon: statsChart, route: "/reports" },
  { id: "settings", label: "Settings", icon: settingsSharp, route: "/settings" },
  { id: "help", label: "Help & feedback", icon: helpCircle, route: "/help" },
];

const RECENT_BILLS = [
  { id: "b1", title: "Office Supplies", amount: 42.15, date: "2025-11-28" },
  { id: "b2", title: "Catering - Client Lunch", amount: 120.0, date: "2025-11-25" },
  { id: "b3", title: "Taxi Reimbursement", amount: 18.5, date: "2025-11-23" },
];

const LeftMenu: React.FC<Props> = ({ onClear, onGenerate, onNavigate }) => {
  const handleClose = async (route?: string) => {
    // close the menu first, then call navigation if provided
    await menuController.close("main-menu");
    if (route && onNavigate) onNavigate(route);
  };

  const handleClear = () => {
    onClear();
    menuController.close("main-menu");
  };

  const handleGenerate = async () => {
    await onGenerate();
    menuController.close("main-menu");
  };

  return (
    <IonMenu side="start" menuId="main-menu" contentId="main-content" type="overlay">
      <IonHeader className="menu-header bg-white border-b" style={{marginTop: 30}}>
        <IonToolbar className="ion-padding-start ion-padding-end">
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1">
              <div className="font-semibold text-base">{DUMMY_USER.name}</div>
              <IonNote className="text-sm">{DUMMY_USER.email}</IonNote>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList className="ion-no-padding" style={{marginTop: 12}}>

          <IonMenuToggle autoHide={false}>
            {NAV_ITEMS.map((item) => (
              <IonItem key={item.id} button onClick={() => handleClose(item.route)} lines="full">
                <IonIcon slot="start" icon={item.icon} />
                <IonLabel>{item.label}</IonLabel>
                {item.id === "bills" && <IonBadge slot="end">3</IonBadge>}
              </IonItem>
            ))}

            <IonItem button onClick={handleGenerate}>
              <IonIcon slot="start" icon={documentText} />
              <IonLabel>Generate bill</IonLabel>
            </IonItem>

            <IonItem button onClick={handleClear}>
              <IonIcon slot="start" icon={refresh} />
              <IonLabel>Clear items</IonLabel>
            </IonItem>
          </IonMenuToggle>


          <IonItemDivider className="ion-padding-start ion-padding-end">
            <IonLabel>Preferences</IonLabel>
          </IonItemDivider>

          <IonItem>
            <IonLabel>Dark mode</IonLabel>
            <IonToggle slot="end" />
          </IonItem>

          <IonItem lines="none">
            <IonLabel>App version</IonLabel>
            <IonNote slot="end">v1.2.3</IonNote>
          </IonItem>

          <IonItem button onClick={() => handleClose("/logout")}>
            <IonIcon slot="start" icon={logOut} />
            <IonLabel>Sign out</IonLabel>
          </IonItem>

        </IonList>

        <div className="ion-padding text-center text-xs text-medium mt-4">
          © {new Date().getFullYear()} MyCompany • Privacy & Terms
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default LeftMenu;
