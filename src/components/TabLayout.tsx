// src/components/TabLayout.tsx
import React from "react";
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { Route, Redirect } from "react-router-dom";

import { list, layers, mic, barChart, person } from "ionicons/icons";

/* pages */
import BillsList from "../pages/BillsList";
import ItemsDetails from "../pages/ItemsDetails";
import VoiceInvoice from "../pages/VoiceInvoice";
import Reports from "../pages/Reports";
import Profile from "../pages/Profile";

const TabLayout: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        {/* Tab pages (these must live inside the same IonRouterOutlet for IonTabs to manage active tab state) */}
        <Route exact path="/tabs/bills" component={BillsList} />
        <Route exact path="/tabs/items" component={ItemsDetails} />
        <Route exact path="/tabs/invoice" component={VoiceInvoice} />
        <Route exact path="/tabs/reports" component={Reports} />
        <Route exact path="/tabs/profile" component={Profile} />

        {/* Default redirect for /tabs -> /tabs/bills */}
        <Route exact path="/tabs">
          <Redirect to="/tabs/bills" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="app-tabbar" style={{ borderTop: "1px solid var(--ion-color-step-150)" }}>
        <IonTabButton tab="bills" href="/tabs/bills">
          <IonIcon icon={list} />
          <IonLabel>Bills</IonLabel>
        </IonTabButton>

        <IonTabButton tab="items" href="/tabs/items">
          <IonIcon icon={layers} />
          <IonLabel>Items</IonLabel>
        </IonTabButton>

        <IonTabButton tab="invoice" href="/home">
          <IonIcon icon={mic} />
          <IonLabel>Voice</IonLabel>
        </IonTabButton>

        <IonTabButton tab="reports" href="/tabs/reports">
          <IonIcon icon={barChart} />
          <IonLabel>Reports</IonLabel>
        </IonTabButton>

        <IonTabButton tab="profile" href="/tabs/profile">
          <IonIcon icon={person} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabLayout;
