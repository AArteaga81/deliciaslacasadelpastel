export const WHATSAPP_NUMBER = "573192441139";

export type Order = { nombre: string; producto: string; cantidad: string; fecha: string; notas: string };

export function buildWhatsAppUrl(o: Order): string {
  const lines = [
    "Nuevo encargo — Delicias la casa del pastel",
    `Nombre: ${o.nombre.trim()}`,
    `Producto: ${o.producto}`,
    `Cantidad: ${o.cantidad}`,
    `Recoger el: ${o.fecha.trim()}`,
  ];
  if (o.notas.trim()) lines.push(`Notas: ${o.notas.trim()}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export const MENU: { categoria: string; items: [string, string][] }[] = [
  { categoria: "Pasteles hojaldrados salados", items: [
    ["Pastel de pollo con verduras", "$3.500"],
    ["Pastel ranchero (maicitos, salchicha y queso)", "$3.500"],
    ["Pastel hawaiano (piña, jamón y queso)", "$3.500"],
    ["Palito de queso", "$3.000"],
  ]},
  { categoria: "Pasteles hojaldrados dulces", items: [
    ["Pastel de arequipe", "$1.000"],
    ["Pastel de chocolate", "$1.000"],
    ["Pastelito de guayaba", "$600"],
    ["Pastelito de guayaba promoción (6 unidades)", "$3.000"],
    ["Chicharrón de guayaba", "$2.000"],
  ]},
  { categoria: "Panes", items: [
    ["Pan artesanal (x 10 unidades)", "$5.000"],
    ["Pandequeso", "$1.500"],
  ]},
  { categoria: "Combos", items: [
    ["Pastel de pollo con verduras + Pony Malta mini 200 ml", "$5.000"],
    ["Pastel ranchero + Pony Malta mini 200 ml", "$5.000"],
    ["Pastel hawaiano + Pony Malta mini 200 ml", "$5.000"],
    ["Pastel de arequipe + vaso de leche de 7 onzas", "$2.500"],
    ["Pastel de chocolate + vaso de leche de 7 onzas", "$2.500"],
  ]},
];
