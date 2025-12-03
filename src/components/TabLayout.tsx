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
import Reports from "../pages/Reports";
import Profile from "../pages/Profile";
import Home from "../pages/Home";

/* shared UI */
import AppHeader from "./AppHeader";
import LeftMenu from "./LeftMenu";

/* IMPORTANT: make sure the LeftMenu's contentId matches the id below ("main-content") */

const TabLayout: React.FC = () => {
  // You may need to pass props (onClear/onGenerate) to LeftMenu from a top-level store or lift handlers.
  // For a quick start, provide no-op handlers or import the same handlers used in Home.
  const noop = () => { };
  const noopAsync = async () => { };

  return (
    <>
      <IonTabs>
        {/* Global menu + header (visible on all tabs) */}
        <LeftMenu onClear={noop} onGenerate={noopAsync} />
        <AppHeader title="Vaani AI Billing" />

        {/* Give the router outlet the same id that the menu's contentId points to */}
        <IonRouterOutlet id="main-content" style={{
          marginTop: "50px",
          boxSizing: "border-box",
        }}>
          {/* Tab pages */}
          <Route exact path="/tabs/bills" component={BillsList} />
          <Route exact path="/tabs/items" component={ItemsDetails} />
          <Route exact path="/tabs/home" component={Home} />
          <Route exact path="/tabs/reports" component={Reports} />
          <Route exact path="/tabs/profile" component={Profile} />

          {/* Default redirect for /tabs -> /tabs/bills */}
          <Route exact path="/tabs">
            <Redirect to="/tabs/bills" />
          </Route>
        </IonRouterOutlet>

        {/* Use the CSS class for theming instead of inline light-only styles */}
        <IonTabBar slot="bottom" className="app-tabbar">
          <IonTabButton tab="bills" href="/tabs/bills">
            <IonIcon icon={list} />
            <IonLabel>Bills</IonLabel>
          </IonTabButton>

          <IonTabButton tab="items" href="/tabs/items">
            <IonIcon icon={layers} />
            <IonLabel>Items</IonLabel>
          </IonTabButton>

          <IonTabButton tab="voice" href="/tabs/home">
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
    </>
  );
};

export default TabLayout;
