export const WHATSAPP_NUMBER = "573192441139";
export const ORDER_STORAGE_KEY = "delicias-order-v1";

export type Product = { nombre: string; precio: number; categoría: string };
export const MENU: Product[] = [
  { nombre: "Pastel de pollo con verduras", precio: 3500, categoría: "Pasteles hojaldrados salados" },
  { nombre: "Pastel ranchero (maicitos, salchicha y queso)", precio: 3500, categoría: "Pasteles hojaldrados salados" },
  { nombre: "Pastel hawaiano (piña, jamón y queso)", precio: 3500, categoría: "Pasteles hojaldrados salados" },
  { nombre: "Palito de queso", precio: 3000, categoría: "Pasteles hojaldrados salados" },
  { nombre: "Pastel de arequipe", precio: 1000, categoría: "Pasteles hojaldrados dulces" },
  { nombre: "Pastel de chocolate", precio: 1000, categoría: "Pasteles hojaldrados dulces" },
  { nombre: "Pastelito de guayaba", precio: 600, categoría: "Pasteles hojaldrados dulces" },
  { nombre: "Pastelito de guayaba promoción (6 unidades)", precio: 3000, categoría: "Pasteles hojaldrados dulces" },
  { nombre: "Chicharrón de guayaba", precio: 2000, categoría: "Pasteles hojaldrados dulces" },
  { nombre: "Pan artesanal (x 10 unidades)", precio: 5000, categoría: "Panes" },
  { nombre: "Pandequeso", precio: 1500, categoría: "Panes" },
  { nombre: "Pastel de pollo con verduras + Pony Malta mini 200 ml", precio: 5000, categoría: "Combos" },
  { nombre: "Pastel ranchero + Pony Malta mini 200 ml", precio: 5000, categoría: "Combos" },
  { nombre: "Pastel hawaiano + Pony Malta mini 200 ml", precio: 5000, categoría: "Combos" },
  { nombre: "Pastel de arequipe + vaso de leche de 7 onzas", precio: 2500, categoría: "Combos" },
  { nombre: "Pastel de chocolate + vaso de leche de 7 onzas", precio: 2500, categoría: "Combos" },
];
export type OrderItem = { nombre: string; cantidad: number };
export type Order = { nombre: string; items: OrderItem[]; fecha: string; notas: string };
export const EMPTY_ORDER: Order = { nombre: "", items: [], fecha: "", notas: "" };
export const formatPrice = (amount: number) => `$${amount.toLocaleString("es-CO")}`;
export function itemSubtotal(item: OrderItem): number {
  return (MENU.find(p => p.nombre === item.nombre)?.precio ?? 0) * item.cantidad;
}
export const orderTotal = (items: OrderItem[]) => items.reduce((sum, item) => sum + itemSubtotal(item), 0);
export function addProduct(items: OrderItem[], nombre: string): OrderItem[] {
  if (!MENU.some(p => p.nombre === nombre)) return items;
  return items.some(i => i.nombre === nombre)
    ? items.map(i => i.nombre === nombre ? { ...i, cantidad: i.cantidad + 1 } : i)
    : [...items, { nombre, cantidad: 1 }];
}
export function changeQuantity(items: OrderItem[], nombre: string, delta: number): OrderItem[] {
  return items.map(i => i.nombre === nombre ? { ...i, cantidad: Math.max(1, i.cantidad + delta) } : i);
}
export function removeProduct(items: OrderItem[], nombre: string): OrderItem[] {
  return items.filter(i => i.nombre !== nombre);
}
export function validateOrder(o: Order): { nombre: boolean; items: boolean; fecha: boolean } {
  return { nombre: !o.nombre.trim(), items: o.items.length === 0, fecha: !o.fecha.trim() };
}
export function restoreOrder(raw: string | null): Order {
  try {
    const parsed: unknown = JSON.parse(raw ?? "null");
    if (!parsed || typeof parsed !== "object") return EMPTY_ORDER;
    const value = parsed as Record<string, unknown>;
    const items: OrderItem[] = [];
    if (Array.isArray(value["items"])) {
      for (const item of value["items"]) {
        if (!item || typeof item !== "object" || typeof item.nombre !== "string" || !MENU.some(p => p.nombre === item.nombre) || !Number.isSafeInteger(item.cantidad) || item.cantidad < 1) continue;
        const existing = items.find(i => i.nombre === item.nombre);
        if (existing) existing.cantidad += item.cantidad;
        else items.push({ nombre: item.nombre, cantidad: item.cantidad });
      }
    }
    return { items, nombre: typeof value["nombre"] === "string" ? value["nombre"] : "", fecha: typeof value["fecha"] === "string" ? value["fecha"] : "", notas: typeof value["notas"] === "string" ? value["notas"] : "" };
  } catch { return EMPTY_ORDER; }
}
export function buildWhatsAppUrl(o: Order): string {
  const lines = [
    "Nuevo encargo — Delicias la casa del pastel",
    `Nombre: ${o.nombre.trim()}`,
    "Pedido:",
    ...o.items.map(i => `- ${i.cantidad} x ${i.nombre} — ${formatPrice(itemSubtotal(i))}`),
    `Total: ${formatPrice(orderTotal(o.items))}`,
    `Recoger el: ${o.fecha.trim()}`,
    `Notas: ${o.notas.trim()}`,
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
