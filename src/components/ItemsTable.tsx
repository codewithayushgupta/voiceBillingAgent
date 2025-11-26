// src/components/ItemsTable.tsx
import React from "react";
import type { Item } from "../types";
import { IonIcon } from "@ionic/react";
import { pencil, trashBin, checkmark, close } from "ionicons/icons";

export type ItemsTableProps = {
  items: Item[];
  editingIndex: number | null;
  editFormData: Partial<Item>;
  onStartEdit: (index: number) => void;
  onCancelEdit: () => void;
  onEditChange: (field: keyof Item, value: any) => void;
  onSaveEdit: () => void;
  onDeleteItem: (index: number) => void;
};

// Input style that auto adapts to dark/light mode
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: "8px",
  border: "1px solid var(--ion-color-medium)",
  fontSize: "14px",
  background: "var(--ion-background-color)",
  color: "var(--ion-text-color)",
};

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
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        borderRadius: "14px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        background: "var(--ion-background-color)",
        color: "var(--ion-text-color)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr
            style={{
              background: "var(--ion-color-step-150)",   // auto dark/light
              color: "var(--ion-text-color)",
              fontWeight: 600,
              borderBottom: "1px solid var(--ion-color-step-250)",
            }}
          >
            <th style={{ padding: "12px" }}>Item</th>
            <th style={{ padding: "12px", width: 90 }}>Qty</th>
            <th style={{ padding: "12px", width: 100 }}>Price</th>
            <th style={{ padding: "12px", width: 100 }}>Total</th>
            <th style={{ padding: "12px", width: 90, textAlign: "center" }}>Actions</th>
          </tr>
        </thead>


        <tbody>
          {items.map((it, i) => (
            <tr
              key={it.id ?? `item-${i}-${it.name ?? ""}`}
              style={{
                borderBottom: "1px solid var(--ion-color-step-150)",
                background:
                  i % 2 === 0
                    ? "var(--ion-background-color)"
                    : "var(--ion-color-light-shade)",
              }}
            >
              {/* ITEM NAME */}
              <td style={{ padding: "10px" }}>
                {editingIndex === i ? (
                  <input
                    style={inputStyle}
                    value={editFormData.name ?? ""}
                    onChange={(e) => onEditChange("name", e.target.value)}
                  />
                ) : (
                  <span style={{ fontWeight: 500 }}>{it.name}</span>
                )}
              </td>

              {/* QTY */}
              <td style={{ padding: "10px" }}>
                {editingIndex === i ? (
                  <input
                    type="number"
                    style={inputStyle}
                    value={editFormData.qty ?? it.qty}
                    onChange={(e) => onEditChange("qty", Number(e.target.value))}
                  />
                ) : (
                  <span>{it.qty}</span>
                )}
              </td>

              {/* PRICE */}
              <td style={{ padding: "10px" }}>
                {editingIndex === i ? (
                  <input
                    type="number"
                    style={inputStyle}
                    value={editFormData.price ?? it.price}
                    onChange={(e) => onEditChange("price", Number(e.target.value))}
                  />
                ) : (
                  <span>₹{it.price}</span>
                )}
              </td>

              {/* TOTAL */}
              <td style={{ padding: "10px", fontWeight: 600 }}>
                ₹{it.total?.toFixed?.(2) ?? (it.qty * it.price).toFixed(2)}
              </td>

              {/* ACTION BUTTONS */}
              <td style={{ padding: "10px", textAlign: "center" }}>
                {editingIndex === i ? (
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    {/* SAVE */}
                    <button
                      onClick={onSaveEdit}
                      style={{
                        background: "var(--ion-color-success)",
                        border: "none",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      <IonIcon icon={checkmark} />
                    </button>

                    {/* CANCEL */}
                    <button
                      onClick={onCancelEdit}
                      style={{
                        background: "var(--ion-color-danger)",
                        border: "none",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      <IonIcon icon={close} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    {/* EDIT */}
                    {/* <button
                      onClick={() => onStartEdit(i)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--ion-color-primary)",
                        padding: 6,
                      }}
                    >
                      <IonIcon icon={pencil} style={{ fontSize: 18 }} />
                    </button> */}

                    {/* DELETE */}
                    <button
                      onClick={() => onDeleteItem(i)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--ion-color-danger)",
                        padding: 6,
                      }}
                    >
                      <IonIcon icon={trashBin} style={{ fontSize: 18 }} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsTable;
