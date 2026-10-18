import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import portada from "@/assets/portada.png.asset.json";
import pasteles from "@/assets/pasteles.png.asset.json";
import menuImg from "@/assets/menu.webp.asset.json";
import whatsapp from "@/assets/whatsapp.jpg.asset.json";
import { MENU, buildWhatsAppUrl, type Order } from "@/lib/order";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Delicias la casa del pastel — Pasteles hojaldrados caseros" },
      { name: "description", content: "Pasteles hojaldrados dulces y salados hechos en casa. Encarga por WhatsApp y pasa a recoger." },
      { property: "og:title", content: "Delicias la casa del pastel" },
      { property: "og:description", content: "Pasteles hojaldrados recién horneados. Encarga por WhatsApp y pasa a recoger." },
    ],
  }),
  component: Index,
});

const btnGold = "inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-warm transition hover:brightness-105 active:scale-[0.98]";
const btnOutline = "inline-flex items-center justify-center rounded-full border-2 border-accent bg-card/80 px-6 py-3 font-bold text-accent transition hover:bg-accent hover:text-accent-foreground";
const PASOS = [
  "Elige tu favorito del menú.",
  "Llena el cuestionario y tu encargo nos llega por WhatsApp.",
  "Confirmamos con 50% de anticipo por Nequi. Pasa y recoge.",
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <span className="truncate font-display text-lg font-bold sm:text-xl">Delicias la casa del pastel</span>
          <a href="#encargo" className={`${btnGold} px-4 py-2 text-sm`}>Encargar ahora</a>
        </div>
      </header>

      <section className="relative">
        <img src={portada.url} alt="Mesa con pasteles hojaldrados" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/40 sm:bg-transparent" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-xl flex-col items-center justify-center px-6 py-20 text-center">
          <div className="rounded-3xl bg-background/80 p-6 backdrop-blur-sm sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Pasteles hojaldrados recién horneados, hechos en casa</h1>
            <p className="mt-4 text-lg text-muted-foreground">Dulces y salados para llevar a tu mesa. Encarga por WhatsApp y pasa a recoger.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="#encargo" className={btnGold}>Encarga el tuyo</a>
              <a href="#menu" className={btnOutline}>Ver el menú</a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">Cómo funciona</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {PASOS.map((p, i) => (
            <div key={i} className="rounded-3xl border border-border bg-card p-6 shadow-warm">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary font-display text-xl font-bold text-primary-foreground">{i + 1}</span>
              <p className="mt-4 text-lg font-semibold">{p}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="menu" className="scroll-mt-20 bg-secondary/60 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <img src={menuImg.url} alt="Pasteles hojaldrados" className="h-40 w-full rounded-3xl object-cover shadow-warm sm:h-56" />
          <h2 className="mt-8 text-center text-3xl font-bold">Nuestro menú</h2>
          <div className="mt-8 space-y-8">
            {MENU.map((c) => (
              <div key={c.categoria} className="rounded-3xl bg-card p-5 shadow-warm sm:p-6">
                <h3 className="text-xl font-bold">{c.categoria}</h3>
                <ul className="mt-3 divide-y divide-border">
                  {c.items.map(([n, p]) => (
                    <li key={n} className="flex items-center justify-between gap-4 py-3">
                      <span className="min-w-0">{n}</span>
                      <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">Pedidos con 24 a 48 horas de anticipación. Los precios pueden variar según personalización.</p>
        </div>
      </section>

      <OrderForm />

      <footer className="bg-primary px-4 py-10 text-center text-primary-foreground">
        <div className="mx-auto max-w-2xl space-y-1 text-sm leading-relaxed">
          <p className="font-display text-lg font-bold">Delicias la casa del pastel — hecho en casa, recién horneado.</p>
          <p>Encarga por WhatsApp: +57 319 244 1139 · Pasa y recoge.</p>
          <p>Pedidos con 24 a 48 horas de anticipación.</p>
          <p>Para confirmar tu encargo: 50% de anticipo por Nequi al mismo número.</p>
          <p>Los precios pueden variar según personalización.</p>
          <p>Contacto: <a className="underline" href="mailto:deliciaslacasadelpastel@gmail.com">deliciaslacasadelpastel@gmail.com</a></p>
          <p>©2026</p>
        </div>
      </footer>
    </div>
  );
}

const EMPTY: Order = { nombre: "", producto: "", cantidad: "1", fecha: "", notas: "" };

function OrderForm() {
  const [o, setO] = useState<Order>(EMPTY);
  const [err, setErr] = useState<Record<string, boolean>>({});
  const set = (k: keyof Order) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setO({ ...o, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n: Record<string, boolean> = {
      nombre: !o.nombre.trim(),
      producto: !o.producto,
      cantidad: !(Number(o.cantidad) >= 1),
      fecha: !o.fecha.trim(),
    };
    setErr(n);
    if (Object.values(n).some(Boolean)) return;
    window.open(buildWhatsAppUrl(o), "_blank", "noopener");
  };

  const field = (k: string) => `w-full rounded-2xl border-2 bg-card px-4 py-3 outline-none focus:border-primary ${err[k] ? "border-accent" : "border-input"}`;
  const Err = ({ k }: { k: string }) => err[k] ? <p className="mt-1 text-sm font-semibold text-accent">Este dato es necesario</p> : null;

  return (
    <section id="encargo" className="scroll-mt-20 mx-auto max-w-5xl px-4 py-16">
      <div className="grid items-start gap-8 md:grid-cols-[2fr_3fr]">
        <div className="space-y-4">
          <img src={whatsapp.url} alt="Encarga por WhatsApp" className="w-full rounded-3xl shadow-warm" />
          <img src={pasteles.url} alt="Pasteles hojaldrados caseros" className="hidden w-full rounded-3xl object-cover shadow-warm md:block" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Encarga el tuyo</h2>
          <p className="mt-2 text-muted-foreground">Llena los datos y tu pedido nos llega directo al WhatsApp. Te confirmamos en seguida.</p>
          <form onSubmit={submit} noValidate className="mt-6 space-y-4 rounded-3xl bg-secondary/60 p-5 sm:p-6">
            <label className="block font-semibold">Nombre
              <input className={`mt-1 ${field("nombre")}`} value={o.nombre} onChange={set("nombre")} />
              <Err k="nombre" />
            </label>
            <label className="block font-semibold">Producto
              <select className={`mt-1 ${field("producto")}`} value={o.producto} onChange={set("producto")}>
                <option value="">Elige un producto…</option>
                {MENU.map((c) => (
                  <optgroup key={c.categoria} label={c.categoria}>
                    {c.items.map(([n, p]) => <option key={n} value={n}>{n} — {p}</option>)}
                  </optgroup>
                ))}
              </select>
              <Err k="producto" />
            </label>
            <label className="block font-semibold">Cantidad
              <input type="number" min={1} inputMode="numeric" className={`mt-1 ${field("cantidad")}`} value={o.cantidad} onChange={set("cantidad")} />
              <Err k="cantidad" />
            </label>
            <label className="block font-semibold">Fecha y hora para recoger
              <input className={`mt-1 ${field("fecha")}`} placeholder="Ej.: sábado 22, 9:00 am" value={o.fecha} onChange={set("fecha")} />
              <span className="mt-1 block text-sm font-normal text-muted-foreground">Ej.: sábado 22, 9:00 am</span>
              <Err k="fecha" />
            </label>
            <label className="block font-semibold">Notas <span className="font-normal text-muted-foreground">(opcional)</span>
              <textarea rows={3} className={`mt-1 ${field("notas")}`} value={o.notas} onChange={set("notas")} />
            </label>
            <button type="submit" className={`${btnGold} w-full py-4 text-lg`}>Enviar mi encargo por WhatsApp</button>
          </form>
        </div>
      </div>
    </section>
  );
}
