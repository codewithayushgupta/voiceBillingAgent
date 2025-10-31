import { useState } from 'react';
import {
  startEdit,
  cancelEdit,
  saveEdit,
} from '../services/itemEditService';
import { deleteItemByIndex } from '../services/itemOperations';

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
    name: '',
    qty: 0,
    price: 0,
  });

  const handleStartEdit = (index: number) => {
    startEdit(index, items, setEditingIndex, setEditFormData);
  };

  const handleCancelEdit = () => {
    cancelEdit(setEditingIndex);
  };

  const handleEditChange = (e: any) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = (index: number) => {
    saveEdit(index, editFormData, setItems, setEditingIndex, speak);
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
