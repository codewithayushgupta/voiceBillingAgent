import { useState } from "react";
import { startEdit, cancelEdit } from "../services/itemEditService";
import { deleteItemByIndex } from "../services/itemOperations";

interface Item {
  name: string;
  qty: number;
  price: number;
  total: number;
}

export function useItemEdit(
  items: Item[],
  setItems: React.Dispatch<React.SetStateAction<Item[]>>,
  speak: (text: string) => void
) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    qty: 0,
    price: 0,
  });

  const handleStartEdit = (index: number) => {
    startEdit(index, items, setEditingIndex, setEditFormData);
  };

  const handleCancelEdit = () => {
    cancelEdit(setEditingIndex);
  };

  // ✅ FIXED — supports new signature
  const handleEditChange = (field: keyof Item, value: any) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;

    const updated = [...items];
    updated[editingIndex] = {
      ...updated[editingIndex],
      name: editFormData.name ?? updated[editingIndex].name,
      qty: editFormData.qty ?? updated[editingIndex].qty,
      price: editFormData.price ?? updated[editingIndex].price,
      total:
        (editFormData.qty ?? updated[editingIndex].qty) *
        (editFormData.price ?? updated[editingIndex].price),
    };

    setItems(updated);
    speak("आइटम अपडेट किया गया है।");
    handleCancelEdit();
  };

  const handleDeleteItem = (index: number) => {
    deleteItemByIndex(index, setItems, speak);
  };

  return {
    editingIndex,
    editFormData,
    handleStartEdit,
    handleCancelEdit,
    handleEditChange,
    handleSaveEdit,
    handleDeleteItem,
  };
}
