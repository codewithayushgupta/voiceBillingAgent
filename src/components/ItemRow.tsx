import React from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { checkmarkOutline, closeOutline, pencilOutline, trashOutline } from 'ionicons/icons';

interface ItemRowProps {
  item: {
    name: string;
    qty: number;
    price: number;
    total: number;
  };
  index: number;
  isEditing: boolean;
  editFormData: {
    name: string;
    qty: number;
    price: number;
  };
  onStartEdit: (index: number) => void;
  onCancelEdit: () => void;
  onEditChange: (e: any) => void;
  onSaveEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({
  item,
  index,
  isEditing,
  editFormData,
  onStartEdit,
  onCancelEdit,
  onEditChange,
  onSaveEdit,
  onDelete,
}) => {
  if (isEditing) {
    return (
      <IonItem>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <IonInput
                value={editFormData.name}
                placeholder="Item Name"
                onIonChange={(e) =>
                  onEditChange({
                    target: { name: 'name', value: e.detail.value },
                  })
                }
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <IonInput
                type="number"
                value={editFormData.qty}
                placeholder="Qty"
                onIonChange={(e) =>
                  onEditChange({
                    target: { name: 'qty', value: e.detail.value },
                  })
                }
              />
            </IonCol>
            <IonCol size="6">
              <IonInput
                type="number"
                value={editFormData.price}
                placeholder="Price"
                onIonChange={(e) =>
                  onEditChange({
                    target: { name: 'price', value: e.detail.value },
                  })
                }
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <IonButton
                expand="block"
                color="success"
                onClick={() => onSaveEdit(index)}
              >
                <IonIcon icon={checkmarkOutline} />
              </IonButton>
            </IonCol>
            <IonCol size="6">
              <IonButton
                expand="block"
                color="medium"
                onClick={onCancelEdit}
              >
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    );
  }

  return (
    <IonItem>
      <IonLabel>
        <h2>{item.name}</h2>
        <p>Qty: {item.qty} | Price: ₹{item.price}</p>
        <h3 style={{ color: 'var(--ion-color-primary)' }}>
          Total: ₹{item.total}
        </h3>
      </IonLabel>
      <IonButton
        fill="clear"
        color="warning"
        onClick={() => onStartEdit(index)}
      >
        <IonIcon slot="icon-only" icon={pencilOutline} />
      </IonButton>
      <IonButton
        fill="clear"
        color="danger"
        onClick={() => onDelete(index)}
      >
        <IonIcon slot="icon-only" icon={trashOutline} />
      </IonButton>
    </IonItem>
  );
};

export default ItemRow;