import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import portada from "@/assets/portada.png.asset.json";
import pasteles from "@/assets/pasteles.png.asset.json";
import menuImg from "@/assets/menu.webp.asset.json";
import whatsapp from "@/assets/whatsapp.jpg.asset.json";
import { MENU, buildWhatsAppUrl, EMPTY_ORDER, ORDER_STORAGE_KEY, addProduct, changeQuantity, removeProduct, itemSubtotal, orderTotal, formatPrice, restoreOrder, validateOrder, type Order } from "@/lib/order";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Delicias La Casa del Pastel | Pastelería artesanal" },
      {
        name: "description",
        content: "Descubre nuestros pasteles hojaldrados dulces y salados, hechos en casa. Haz tu encargo por WhatsApp y pasa a recoger."
      },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_CO" },
      { property: "og:site_name", content: "Delicias La Casa del Pastel" },
      {
        property: "og:title",
        content: "Delicias La Casa del Pastel | Pastelería artesanal"
      },
      {
        property: "og:description",
        content: "Pasteles hojaldrados dulces y salados. Encarga por WhatsApp y pasa a recoger."
      },
      {
        property: "og:url",
        content: "https://deliciaslacasadelpastel.lovable.app/"
      },
      {
        property: "og:image",
        content: "https://raw.githubusercontent.com/AArteaga81/deliciaslacasadelpastel-assets/main/delicias_og_1200x630_82kB.jpg"
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Delicias La Casa del Pastel | Pastelería artesanal"
      },
      {
        name: "twitter:description",
        content: "Pasteles hojaldrados dulces y salados, hechos en casa. Encarga por WhatsApp."
      },
      {
        name: "twitter:image",
        content: "https://raw.githubusercontent.com/AArteaga81/deliciaslacasadelpastel-assets/main/delicias_og_1200x630_82kB.jpg"
      }    
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
  const [o, setO] = useState<Order>(EMPTY_ORDER);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState("");
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    try { setO(restoreOrder(localStorage.getItem(ORDER_STORAGE_KEY))); } catch { /* Storage may be disabled. */ }
    setReady(true);
    return () => { clearTimeout(feedbackTimer.current); };
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      if (o.items.length) localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(o));
      else localStorage.removeItem(ORDER_STORAGE_KEY);
      setSaved(o.items.length > 0);
    } catch { setSaved(false); }
  }, [o, ready]);
  const add = (nombre: string) => {
    setO(current => ({ ...current, items: addProduct(current.items, nombre) }));
    setAdded(nombre);
    clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setAdded(""), 1400);
  };
  const categories = [...new Set(MENU.map(p => p.categoría))];
  const units = o.items.reduce((n, i) => n + i.cantidad, 0);
  return (
    <div className={`min-h-screen bg-background text-foreground ${o.items.length ? "pb-[calc(4.5rem+env(safe-area-inset-bottom))]" : ""}`}>
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
         
          <span className="truncate font-display text-lg font-bold sm:text-xl">Delicias
            <br>La Casa del Pastel
          </span>
                   
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
            {categories.map(categoria => (
              <div key={categoria} className="rounded-3xl bg-card p-5 shadow-warm sm:p-6">
                <h3 className="text-xl font-bold">{categoria}</h3>
                <ul className="mt-3 divide-y divide-border">
                  {MENU.filter(p => p.categoría === categoria).map(p => (
                    <li key={p.nombre} className="flex flex-wrap items-center justify-between gap-3 py-3 sm:flex-nowrap">
                      <span className="min-w-0 flex-1 basis-full sm:basis-auto">{p.nombre}</span>
                      <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">{formatPrice(p.precio)}</span>
                      <Button type="button" size="sm" onClick={() => add(p.nombre)} aria-label={`Agregar ${p.nombre}`} className="w-28 rounded-full font-bold">{added === p.nombre ? "Agregado ✓" : "Agregar"}</Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">Pedidos con 24 a 48 horas de anticipación. Los precios pueden variar según personalización.</p>
        </div>
      </section>

      <OrderForm o={o} setO={setO} saved={saved} />

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
      {o.items.length > 0 && (
        <Button asChild className="fixed inset-x-0 bottom-0 z-30 h-auto min-h-16 w-full whitespace-normal rounded-none bg-primary px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-base font-bold text-primary-foreground shadow-warm">
          <a href="#encargo">Tu pedido · {units} {units === 1 ? "producto" : "productos"} · {formatPrice(orderTotal(o.items))}</a>
        </Button>
      )}
    </div>
  );
}

function OrderForm({ o, setO, saved }: { o: Order; setO: React.Dispatch<React.SetStateAction<Order>>; saved: boolean }) {
  const [err, setErr] = useState<Record<string, boolean>>({});
  const set = (k: "nombre" | "fecha" | "notas") => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setO(current => ({ ...current, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = validateOrder(o);
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
            <div>
              <h3 className="font-sans text-base font-semibold">Tu pedido</h3>
              {o.items.length === 0 ? (
                <div className="mt-2 space-y-3">
                  <p className="text-muted-foreground">Aún no has agregado productos. Elige tus favoritos del menú.</p>
                  <Button asChild className={`${btnGold} h-auto`}><a href="#menu">Ver el menú</a></Button>
                </div>
              ) : (
                <>
                  <ul className="mt-2 divide-y divide-border">
                    {o.items.map(item => (
                      <li key={item.nombre} className="py-3">
                        <div className="flex items-start justify-between gap-3">
                          <span className="min-w-0 font-semibold">{item.nombre}</span>
                          <Button type="button" variant="ghost" size="icon" title={`Quitar ${item.nombre}`} aria-label={`Quitar ${item.nombre}`} className="shrink-0 text-xl text-accent" onClick={() => setO(current => ({ ...current, items: removeProduct(current.items, item.nombre) }))}>×</Button>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-full border border-border bg-card">
                            <Button type="button" variant="ghost" size="icon" className="rounded-full text-xl" disabled={item.cantidad === 1} aria-label={`Disminuir ${item.nombre}`} title="Disminuir cantidad" onClick={() => setO(current => ({ ...current, items: changeQuantity(current.items, item.nombre, -1) }))}>−</Button>
                            <span className="min-w-8 px-1 text-center font-bold tabular-nums" aria-label={`Cantidad de ${item.nombre}`}>{item.cantidad}</span>
                            <Button type="button" variant="ghost" size="icon" className="rounded-full text-xl" aria-label={`Aumentar ${item.nombre}`} title="Aumentar cantidad" onClick={() => setO(current => ({ ...current, items: changeQuantity(current.items, item.nombre, 1) }))}>+</Button>
                          </div>
                          <span className="font-bold tabular-nums">{formatPrice(itemSubtotal(item))}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="border-t border-border pt-3 text-right text-lg font-bold">Total: {formatPrice(orderTotal(o.items))}</p>
                  {saved && <p role="status" className="mt-2 text-sm text-muted-foreground">Tu pedido se guarda automáticamente en este dispositivo.</p>}
                </>
              )}
              {err["items"] && o.items.length === 0 && <p role="alert" className="mt-1 text-sm font-semibold text-accent">Agrega al menos un producto a tu pedido</p>}
            </div>
            <label className="block font-semibold">Fecha y hora para recoger
              <input className={`mt-1 ${field("fecha")}`} placeholder="Ej.: sábado 22, 9:00 am" value={o.fecha} onChange={set("fecha")} />
              <span className="mt-1 block text-sm font-normal text-muted-foreground">Ej.: sábado 22, 9:00 am</span>
              <Err k="fecha" />
            </label>
            <label className="block font-semibold">Notas <span className="font-normal text-muted-foreground">(opcional)</span>
              <textarea rows={3} className={`mt-1 ${field("notas")}`} value={o.notas} onChange={set("notas")} />
            </label>
            <Button type="submit" className={`${btnGold} h-auto w-full whitespace-normal py-4 text-lg`}>Enviar mi encargo por WhatsApp</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
