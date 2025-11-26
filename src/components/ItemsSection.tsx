// src/components/ItemsSection.tsx
import React from "react";
import { IonText } from "@ionic/react";
import ItemsTable from "../components/ItemsTable"; // keep your existing ItemsTable path

import type { Item } from "../types"; // optional: if you have a shared Item type

interface Props {
  items: any[]; // replace `any` with your Item type if available
  editingIndex: number | null;
  editFormData: any;
  onStartEdit: (index: number) => void;
  onCancelEdit: () => void;
  onEditChange: (field: keyof Item, value: any) => void
  onSaveEdit: () => void;
  onDeleteItem: (index: number) => void;
}

const ItemsSection: React.FC<Props> = ({
  items,
  editingIndex,
  editFormData,
  onStartEdit,
  onCancelEdit,
  onEditChange,
  onSaveEdit,
  onDeleteItem,
}) => {
  const total = items.reduce((s, it) => s + (it.total ?? 0), 0);

  return (
    <div className="items-section" style={{ paddingBottom: 12 }}>
      {items.length === 0 ? (
        <div className="empty-state" style={{ paddingTop: 20 }}>
          <IonText color="medium">🎙 Hold the mic button and speak to add items.</IonText>
        </div>
      ) : (
        <>
          <div className="items-count-badge" style={{ marginBottom: 8 }}>
            📦 {items.length} {items.length === 1 ? "Item" : "Items"} • Total: ₹{total.toFixed(2)}
          </div>

          <div className="items-list-container">
            <ItemsTable
              items={items}
              editingIndex={editingIndex}
              editFormData={editFormData}
              onStartEdit={onStartEdit}
              onCancelEdit={onCancelEdit}
              onEditChange={onEditChange}
              onSaveEdit={onSaveEdit}
              onDeleteItem={onDeleteItem}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ItemsSection;
