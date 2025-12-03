import React from "react";
import { IonPage, IonContent } from "@ionic/react";
import ItemContainer from "../components/ItemContainer";

const ItemsDetails: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="page-content" fullscreen>
        <div style={{ padding: "8px 14px 24px" }}>
          <ItemContainer />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ItemsDetails;
