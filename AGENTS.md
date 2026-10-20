<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the menu in one numeric-price product array shared by menu rendering, order totals, and WhatsApp formatting so prices cannot diverge.
- Store this explicitly requested device-local order draft in localStorage after hydration, validating restored items against the current menu; no server persistence is needed for a draft.
- Share and toast go through src/lib/share.ts (single compartirSitio + window event toast) so every share entry point behaves the same.
