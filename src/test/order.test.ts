import { describe, expect, it } from "vitest";
import { MENU, EMPTY_ORDER, addProduct, changeQuantity, removeProduct, orderTotal, itemSubtotal, formatPrice, buildWhatsAppUrl, restoreOrder, validateOrder } from "@/lib/order";

describe("Multi-product orders", () => {
  it("uses all 16 menu products and their numeric prices", () => {
    expect(MENU).toHaveLength(16);
    expect(MENU.find(p => p.nombre === "Pastel de pollo con verduras")?.precio).toBe(3500);
    expect(MENU.find(p => p.nombre === "Pastelito de guayaba")?.precio).toBe(600);
  });
  it("adds one unit and merges repeated additions", () => {
    const first = addProduct([], "Pastel de arequipe");
    expect(first).toEqual([{ nombre: "Pastel de arequipe", cantidad: 1 }]);
    expect(addProduct(first, "Pastel de arequipe")).toEqual([{ nombre: "Pastel de arequipe", cantidad: 2 }]);
  });
  it("supports multiple different products", () => {
    expect(addProduct(addProduct([], "Pastel de arequipe"), "Palito de queso")).toHaveLength(2);
  });
  it("keeps the minimum quantity at 1", () => {
    const items = [{ nombre: "Palito de queso", cantidad: 1 }];
    expect(changeQuantity(items, "Palito de queso", -1)[0]?.cantidad).toBe(1);
    expect(changeQuantity(items, "Palito de queso", 1)[0]?.cantidad).toBe(2);
  });
  it("removes the chosen item without changing others", () => {
    const items = [{ nombre: "Palito de queso", cantidad: 1 }, { nombre: "Pastel de arequipe", cantidad: 2 }];
    expect(removeProduct(items, "Palito de queso")).toEqual([items[1]]);
  });
  it("calculates subtotals and total with dotted thousands", () => {
    const items = [{ nombre: "Palito de queso", cantidad: 3 }, { nombre: "Pastel de arequipe", cantidad: 2 }];
    expect(itemSubtotal({ nombre: "Palito de queso", cantidad: 3 })).toBe(9000);
    expect(orderTotal(items)).toBe(11000);
    expect(formatPrice(orderTotal(items))).toBe("$11.000");
  });
  it("rejects an empty order", () => {
    expect(validateOrder({ ...EMPTY_ORDER, nombre: "Aleja", fecha: "sábado 22, 9 am" }).items).toBe(true);
    expect(validateOrder({ ...EMPTY_ORDER, items: [{ nombre: "Palito de queso", cantidad: 1 }] }).items).toBe(false);
  });
  it("requires a nonblank name", () => {
    expect(validateOrder({ ...EMPTY_ORDER, nombre: "  " }).nombre).toBe(true);
    expect(validateOrder({ ...EMPTY_ORDER, nombre: "Aleja" }).nombre).toBe(false);
  });
  it("requires a nonblank pickup date", () => {
    expect(validateOrder({ ...EMPTY_ORDER, fecha: "  " }).fecha).toBe(true);
    expect(validateOrder({ ...EMPTY_ORDER, fecha: "sábado 22, 9 am" }).fecha).toBe(false);
  });
  it("encodes a single WhatsApp URL with all items, totals and separate lines", () => {
    const url = buildWhatsAppUrl({ nombre: " Aleja & familia ", items: [{ nombre: "Palito de queso", cantidad: 2 }, { nombre: "Pastel de arequipe", cantidad: 1 }], fecha: " sábado 22, 9:00 am ", notas: " Sin bolsa " });
    expect(url).toBe(`https://wa.me/573192441139?text=${encodeURIComponent("Nuevo encargo — Delicias la casa del pastel\nNombre: Aleja & familia\nPedido:\n- 2 x Palito de queso — $6.000\n- 1 x Pastel de arequipe — $1.000\nTotal: $7.000\nRecoger el: sábado 22, 9:00 am\nNotas: Sin bolsa")}`);
  });
  it("restores the draft including quantities and customer fields", () => {
    const order = { nombre: "Aleja", items: [{ nombre: "Palito de queso", cantidad: 2 }], fecha: "sábado 22", notas: "Sin bolsa" };
    expect(restoreOrder(JSON.stringify(order))).toEqual(order);
  });
  it("ignores damaged drafts and unavailable products", () => {
    expect(restoreOrder("invalid")).toEqual(EMPTY_ORDER);
    expect(restoreOrder(JSON.stringify({ items: [{ nombre: "Unknown", cantidad: 1 }, { nombre: "Palito de queso", cantidad: 0 }] })).items).toEqual([]);
  });
});