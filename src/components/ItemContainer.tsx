import React, { useMemo, useState } from "react";
import {
    IonList,
    IonItem,
    IonBadge,
    IonCard,
    IonCardContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel as IonSegLabel,
    IonFab,
    IonFabButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonItemDivider,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonGrid,
    IonRow,
    IonCol,
    IonThumbnail,
    IonImg,
    IonToast,
    IonRippleEffect,
    IonIcon,
    IonLabel,
} from "@ionic/react";
import { add, receiptSharp } from "ionicons/icons";
import { useHistory } from "react-router-dom";

/** Types */
export type Item = {
    id: string;
    name: string;
    sku?: string;
    category: string;
    price: number;
    stock: number;
    unit?: string;
    notes?: string;
    image?: string;
};

/** Placeholder SVG data URL (visible even offline) */
const PLACEHOLDER_IMG =
    `data:image/svg+xml;utf8,` +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'>
      <rect width='100%' height='100%' fill='%23f3f4f6'/>
      <g transform='translate(80,60)' fill='%239ca3af'>
        <rect x='0' y='0' width='240' height='160' rx='12' fill='%23e6eef8'/>
        <text x='120' y='90' font-size='28' font-family='Arial' text-anchor='middle' fill='%23808b99'>IMAGE</text>
      </g>
    </svg>`
    );

const DUMMY_ITEMS: Item[] = [
    {
        id: "i1",
        name: "Premium Rice - 5kg",
        sku: "PR-5KG",
        category: "Groceries",
        price: 499,
        stock: 12,
        unit: "bag",
        notes: "Basmati long grain",
        image: "", // empty => placeholder will show
    },
    {
        id: "i2",
        name: "Organic Milk 1L",
        sku: "ML-1L",
        category: "Dairy",
        price: 58,
        stock: 36,
        unit: "bottle",
        notes: "Pasteurized",
        image: "", // empty => placeholder
    },
    {
        id: "i3",
        name: "LED Bulb 9W",
        sku: "LB-9W",
        category: "Electronics",
        price: 149,
        stock: 8,
        unit: "pcs",
        notes: "Cool white",
        image: "", // empty => placeholder
    },
    {
        id: "i4",
        name: "Fresh Apples (1kg)",
        sku: "AP-1KG",
        category: "Fruits",
        price: 120,
        stock: 20,
        unit: "kg",
        notes: "",
        image: "", // empty => placeholder
    },
];

type Props = {
    items?: Item[];
    onSave?: (item: Item) => void;
    onOpen?: (id: string) => void; // parent can handle navigation if preferred
};

const ItemContainer: React.FC<Props> = ({ items: externalItems, onSave, onOpen }) => {
    const history = useHistory();
    const [items, setItems] = useState<Item[]>(externalItems && externalItems.length ? externalItems : DUMMY_ITEMS);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<string>("all");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Item | null>(null);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const categories = useMemo(() => {
        const cats = Array.from(new Set(items.map((i) => i.category)));
        return ["all", ...cats];
    }, [items]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items.filter((it) => {
            if (category !== "all" && it.category !== category) return false;
            if (!q) return true;
            return (
                it.name.toLowerCase().includes(q) ||
                (it.sku || "").toLowerCase().includes(q) ||
                (it.category || "").toLowerCase().includes(q)
            );
        });
    }, [items, query, category]);

    const openNew = () => {
        setEditing({
            id: `i${Date.now()}`,
            name: "",
            sku: "",
            category: categories.length > 1 ? categories[1] : "General",
            price: 0,
            stock: 0,
            unit: "",
        });
        setShowModal(true);
    };

    const openItem = (id: string) => {
        if (onOpen) {
            onOpen(id);
            return;
        }
        history.push(`/tabs/items/${id}`);
    };

    const saveItem = (it: Item) => {
        setItems((prev) => {
            const existing = prev.find((p) => p.id === it.id);
            let next;
            if (existing) {
                next = prev.map((p) => (p.id === it.id ? it : p));
            } else {
                next = [it, ...prev];
            }
            onSave?.(it);
            return next;
        });
        setShowModal(false);
        setToastMsg("Item saved");
    };

    return (
        <>
            {/* Search + Filter */}
            <div style={{ marginBottom: 8 }}>
                <IonSearchbar
                    value={query}
                    onIonChange={(e) => setQuery(e.detail.value ?? "")}
                    placeholder="Search items, SKU or category"
                    showCancelButton="never"
                />
            </div>

            <div style={{ marginBottom: 10 }}>
                <IonSegment value={category} onIonChange={(e) => setCategory(e.detail.value ?? "all")}>
                    {categories.map((c) => (
                        <IonSegmentButton key={c} value={c}>
                            <IonSegLabel style={{ fontSize: 12, fontWeight: 600 }}>{c === "all" ? "All" : c}</IonSegLabel>
                        </IonSegmentButton>
                    ))}
                </IonSegment>
            </div>

            {/* Quick KPI row */}
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <IonCard style={{ flex: 1, borderRadius: 10, padding: 8 }}>
                    <IonCardContent style={{ padding: 6 }}>
                        <div style={{ fontSize: 11, color: "var(--app-muted)" }}>Total Items</div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{items.length}</div>
                    </IonCardContent>
                </IonCard>

                <IonCard style={{ flex: 1, borderRadius: 10, padding: 8 }}>
                    <IonCardContent style={{ padding: 6 }}>
                        <div style={{ fontSize: 11, color: "var(--app-muted)" }}>Low Stock</div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{items.filter((i) => i.stock <= 10).length}</div>
                    </IonCardContent>
                </IonCard>
            </div>

            {/* Item list */}
            <IonList style={{ padding: 0 }}>
                {filtered.map((it) => (
                    <IonItem
                        key={it.id}
                        lines="none"
                        style={{
                            marginBottom: 10,
                            borderRadius: 12,
                            overflow: "hidden",
                            padding: 0,
                        }}
                        button
                        onClick={() => openItem(it.id)}
                        className="ion-activatable item-card"
                    >
                        <IonRippleEffect />
                        <div style={{ display: "flex", gap: 10, alignItems: "center", width: "100%", padding: 8 }}>
                            <div className="item-thumb" style={{ flexShrink: 0 }}>
                                <IonThumbnail
                                    style={{
                                        width: "46px",
                                        height: "46px",
                                        borderRadius: "50%",   // <-- make it circular
                                        overflow: "hidden",
                                        flexShrink: 0,
                                    }}
                                >
                                    <IonImg
                                        src={it.image && it.image.trim() ? it.image : PLACEHOLDER_IMG}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </IonThumbnail>

                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ion-text-color)" }}>{it.name}</div>
                                        <div style={{ fontSize: 11, color: "var(--app-muted)", marginTop: 4 }}>
                                            {it.sku} • {it.category}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "right", minWidth: 70 }}>
                                        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ion-color-primary)" }}>
                                            ₹{it.price.toFixed(2)}
                                        </div>
                                        <div style={{ marginTop: 6 }}>
                                            <IonBadge color={it.stock > 10 ? "success" : it.stock > 0 ? "warning" : "danger"}>
                                                {it.stock} {it.unit || ""}
                                            </IonBadge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </IonItem>
                ))}
            </IonList>

            {/* Floating Add Button (fixed above bottom with margin) */}
            <IonFab style={{ position: "fixed", right: 16, bottom: 22, zIndex: 1100 }} slot="fixed">
                <IonFabButton onClick={openNew} color="primary" aria-label="Add item">
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>

            {/* Add / Edit Modal */}
            <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{editing?.id ? (items.some((i) => i.id === editing.id) ? "Edit Item" : "New Item") : "Item"}</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <div style={{ padding: 16 }}>
                        <IonItemDivider>
                            <strong>Details</strong>
                        </IonItemDivider>

                        <IonItem>
                            <IonLabel position="stacked">Name</IonLabel>
                            <IonInput
                                value={editing?.name}
                                placeholder="Item name"
                                onIonChange={(e) => setEditing((p) => (p ? { ...p, name: e.detail.value || "" } : p))}
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="stacked">SKU</IonLabel>
                            <IonInput
                                value={editing?.sku}
                                placeholder="SKU / code"
                                onIonChange={(e) => setEditing((p) => (p ? { ...p, sku: e.detail.value || "" } : p))}
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="stacked">Category</IonLabel>
                            <IonSelect
                                value={editing?.category}
                                onIonChange={(e) => setEditing((p) => (p ? { ...p, category: e.detail.value } : p))}
                            >
                                {categories.map((c) => (
                                    <IonSelectOption key={c} value={c}>
                                        {c}
                                    </IonSelectOption>
                                ))}
                                <IonSelectOption value="Other">Other</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonGrid>
                            <IonRow>
                                <IonCol size="6">
                                    <IonItem>
                                        <IonLabel position="stacked">Price</IonLabel>
                                        <IonInput
                                            type="number"
                                            value={editing?.price}
                                            onIonChange={(e) => setEditing((p) => (p ? { ...p, price: Number(e.detail.value) || 0 } : p))}
                                        />
                                    </IonItem>
                                </IonCol>
                                <IonCol size="6">
                                    <IonItem>
                                        <IonLabel position="stacked">Stock</IonLabel>
                                        <IonInput
                                            type="number"
                                            value={editing?.stock}
                                            onIonChange={(e) => setEditing((p) => (p ? { ...p, stock: Number(e.detail.value) || 0 } : p))}
                                        />
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                        </IonGrid>

                        <IonItem>
                            <IonLabel position="stacked">Notes</IonLabel>
                            <IonTextarea
                                value={editing?.notes}
                                placeholder="Optional notes (e.g. supplier, expiry)"
                                onIonChange={(e) => setEditing((p) => (p ? { ...p, notes: e.detail.value || "" } : p))}
                            />
                        </IonItem>

                        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                            <IonButton expand="block" color="medium" onClick={() => setShowModal(false)}>
                                Cancel
                            </IonButton>
                            <IonButton
                                expand="block"
                                color="primary"
                                onClick={() => {
                                    if (!editing?.name) {
                                        setToastMsg("Please enter item name");
                                        return;
                                    }
                                    saveItem(editing as Item);
                                }}
                            >
                                Save
                            </IonButton>
                        </div>
                    </div>
                </IonContent>
            </IonModal>

            <IonToast isOpen={!!toastMsg} onDidDismiss={() => setToastMsg(null)} message={toastMsg ?? ""} duration={1400} />
        </>
    );
};

export default ItemContainer;
