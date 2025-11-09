import React from 'react';
import { IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import ItemRow from './ItemRow';

interface ItemsTableProps {
  items: Array<{
    name: string;
    qty: number;
    price: number;
    total: number;
  }>;
  editingIndex: number | null;
  editFormData: {
    name: string;
    qty: number;
    price: number;
  };
  onStartEdit: (index: number) => void;
  onCancelEdit: () => void;
  onEditChange: (e: any) => void;
  onSaveEdit: (index: number) => void;
  onDeleteItem: (index: number) => void;
}

const ItemsTable: React.FC<ItemsTableProps> = ({
  items,
  editingIndex,
  editFormData,
  onStartEdit,
  onCancelEdit,
  onEditChange,
  onSaveEdit,
  onDeleteItem,
}) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>🧾 Detected Items</IonCardTitle>
      </IonCardHeader>
      <IonCardContent style={{
        height: "232px"
      }}
      >
        {items.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--ion-color-medium)' }}>
            No items yet. Speak your bill details.
          </p>
        ) : (
          <IonList>
            {items.map((item, idx) => (
              <ItemRow
                key={idx}
                item={item}
                index={idx}
                isEditing={editingIndex === idx}
                editFormData={editFormData}
                onStartEdit={onStartEdit}
                onCancelEdit={onCancelEdit}
                onEditChange={onEditChange}
                onSaveEdit={onSaveEdit}
                onDelete={onDeleteItem}
              />
            ))}
          </IonList>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default ItemsTable;