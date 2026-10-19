import { useEffect, useRef, useState } from "react";
import { TOAST_EVENT } from "@/lib/share";

/** Material Design "share" glyph, inline to avoid loading an icon font. */
export function ShareIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
    </svg>
  );
}

export function Toast({ raised }: { raised: boolean }) {
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMsg(""), 2500);
    };
    window.addEventListener(TOAST_EVENT, on);
    return () => { window.removeEventListener(TOAST_EVENT, on); clearTimeout(timer.current); };
  }, []);
  if (!msg) return null;
  return (
    <div role="status" className={`fixed left-1/2 z-40 -translate-x-1/2 rounded-full border border-border bg-card px-5 py-2.5 text-center text-sm font-bold text-foreground shadow-warm ${raised ? "bottom-[calc(5.5rem+env(safe-area-inset-bottom))]" : "bottom-6"}`}>
      {msg}
    </div>
  );
}

const VISITS_KEY = "delicias_visitas";
const DISMISS_KEY = "delicias_inicio_cerrado";
type InstallEvent = Event & { prompt: () => Promise<void> };

/** Discreet "add to home screen" hint shown from the second visit on. */
export function InstallBanner() {
  const [mode, setMode] = useState<"" | "android" | "ios">("");
  const deferred = useRef<InstallEvent | null>(null);
  useEffect(() => {
    let returning = false;
    try {
      const visits = Number(localStorage.getItem(VISITS_KEY) ?? "0") + 1;
      localStorage.setItem(VISITS_KEY, String(visits));
      returning = visits > 1 && !localStorage.getItem(DISMISS_KEY);
    } catch { /* Storage disabled. */ }
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    if (!returning || standalone) return;
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIos) { setMode("ios"); return; }
    const onPrompt = (e: Event) => { e.preventDefault(); deferred.current = e as InstallEvent; setMode("android"); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);
  if (!mode) return null;
  const close = () => { try { localStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ } setMode(""); };
  return (
    <div className="border-b border-border bg-secondary/80 px-4 py-2 text-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        {mode === "ios" ? (
          <p>Tócalo en <b>Compartir → Añadir a inicio</b> para tener Delicias a la mano.</p>
        ) : (
          <button type="button" className="text-left font-bold text-accent underline" onClick={async () => { await deferred.current?.prompt(); close(); }}>
            Agregar Delicias a tu pantalla de inicio
          </button>
        )}
        <button type="button" aria-label="Cerrar aviso" className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-lg" onClick={close}>×</button>
      </div>
    </div>
  );
}
