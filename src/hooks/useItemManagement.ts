import { useState, useRef, useEffect } from 'react';
import { addItems, deleteItems, updateItems } from '../services/itemOperations';

interface Item {
  name: string;
  qty: number;
  price: number;
  total: number;
}

export function useItemManagement() {
  const [items, setItems] = useState<Item[]>([]);
  const itemsRef = useRef<Item[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const handleAddItems = (aiItems: any[], speak: (text: string) => void) => {
    addItems(aiItems, setItems, speak);
  };

  const handleDeleteItems = (aiItems: any[], speak: (text: string) => void) => {
    deleteItems(aiItems, setItems, speak);
  };

  const handleUpdateItems = (aiItems: any[], speak: (text: string) => void) => {
    updateItems(aiItems, setItems, speak);
  };

  const clearItems = () => {
    setItems([]);
  };

  return {
    items,
    setItems,
    itemsRef,
    handleAddItems,
    handleDeleteItems,
    handleUpdateItems,
    clearItems,
  };
}
