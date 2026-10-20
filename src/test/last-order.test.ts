import { describe, expect, it } from "vitest";
import { lastOrderToItems, snapshotOrder, orderTotal } from "@/lib/order";

describe("repetir último pedido", () => {
  it("guarda precio unitario y cantidad", () => {
    expect(snapshotOrder([{ nombre: "Pandequeso", cantidad: 2 }]).items).toEqual([{ nombre: "Pandequeso", precioUnitario: 1500, cantidad: 2 }]);
  });
  it("usa el precio actual del menú y omite productos que ya no existen", () => {
    const items = lastOrderToItems({ fechaEnvio: "", items: [{ nombre: "Pandequeso", precioUnitario: 999, cantidad: 2 }, { nombre: "Producto retirado", precioUnitario: 1, cantidad: 1 }] });
    expect(items).toEqual([{ nombre: "Pandequeso", cantidad: 2 }]);
    expect(orderTotal(items)).toBe(3000);
  });
});
