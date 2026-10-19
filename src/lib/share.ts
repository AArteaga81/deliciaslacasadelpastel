export const TOAST_EVENT = "delicias-toast";

export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }));
}

/** Single share entry point: native share sheet when available, otherwise copy the link. */
export async function compartirSitio() {
  const url = window.location.href.split("#")[0];
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({
        title: "Delicias la casa del pastel",
        text: "Pasteles hojaldrados recién horneados, hechos en casa. Encarga y pasa a recoger.",
        url,
      });
    } catch { /* User cancelled: ignore silently. */ }
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    showToast("Enlace copiado");
  } catch { /* Clipboard unavailable. */ }
}
