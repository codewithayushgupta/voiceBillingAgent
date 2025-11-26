// src/components/LeftMenu.tsx
import React from "react";
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonMenuToggle, IonIcon } from "@ionic/react";
import { refresh, documentText } from "ionicons/icons";
import { menuController } from "@ionic/core";

interface Props {
  onClear: () => void;
  onGenerate: () => Promise<void> | void;
}

const LeftMenu: React.FC<Props> = ({ onClear, onGenerate }) => {
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
      <IonHeader className="menu-header">
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonMenuToggle autoHide={false}>
            <IonItem button onClick={handleClear}>
              <IonIcon slot="start" icon={refresh} />
              <IonLabel>Clear items</IonLabel>
            </IonItem>

            <IonItem button onClick={handleGenerate}>
              <IonIcon slot="start" icon={documentText} />
              <IonLabel>Generate bill</IonLabel>
            </IonItem>

            <IonItem button onClick={() => menuController.close("main-menu")}>
              <IonLabel>Close</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default LeftMenu;
