// ===== FILE 3: src/services/itemEditService.ts =====

export function startEdit(
  index: number,
  items: any[],
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setEditFormData: React.Dispatch<React.SetStateAction<any>>
) {
  setEditingIndex(index);
  setEditFormData(items[index]);
}

export function cancelEdit(
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>
) {
  setEditingIndex(null);
}

export function saveEdit(
  index: number,
  editFormData: any,
  setItems: React.Dispatch<React.SetStateAction<any[]>>,
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>,
  speak: (text: string) => void
) {
  const { name, qty, price } = editFormData;
  const numQty = parseFloat(qty);
  const numPrice = parseFloat(price);

  if (
    !name ||
    isNaN(numQty) ||
    isNaN(numPrice) ||
    numQty <= 0 ||
    numPrice < 0
  ) {
    speak('अमान्य डेटा। कृपया दोबारा जांच लें।');
    return;
  }

  setItems((prevItems) => {
    const updatedItems = [...prevItems];
    updatedItems[index] = {
      name,
      qty: numQty,
      price: numPrice,
      total: numQty * numPrice,
    };
    return updatedItems;
  });
  setEditingIndex(null);
  speak('आइटम अपडेट हो गया।');
}
