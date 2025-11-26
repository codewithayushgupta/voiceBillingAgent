// src/hooks/useItemManagement.ts
import { useState, useRef, useEffect } from "react";
import { addItems, deleteItems, updateItems } from "../services/itemOperations";

interface Item {
  id?: string; // optional in type until we ensure it's assigned at runtime
  name: string;
  qty: number;
  price: number;
  total: number;
}

function makeId() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
}

export function useItemManagement() {
  const [items, setItems] = useState<Item[]>([]);
  const itemsRef = useRef<Item[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Ensure any items added by external callers have an id
  const handleAddItems = (aiItems: any[], speak: (text: string) => void) => {
    const prepared = (aiItems || []).map((it) => ({
      id: it.id ?? makeId(),
      name: it.name ?? String(it.item ?? it.label ?? "Unnamed"),
      qty: Number(it.qty ?? it.quantity ?? 1) || 1,
      price: Number(it.price ?? it.rate ?? 0) || 0,
      total:
        typeof it.total === "number"
          ? it.total
          : Number(it.qty ?? 1) * Number(it.price ?? 0),
      ...it,
    }));

    addItems(prepared, setItems, speak); // speak is now guaranteed
  };

  // For delete/update we forward through; they may operate on ids or names depending on implementation.
  // If your AI delete/update payloads rely on 'name' rather than 'id', keep current behaviour.
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
