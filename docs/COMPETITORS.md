# Competitors

Research notes for permissive-license embed libraries. Use this to inform API and implementation — do not copy non-permissive code.

**Deep dives:** [docs/reports/](reports/) · **Design synthesis:** [IMPROVEMENTS.md](IMPROVEMENTS.md) · **Steal/avoid summary:** [DESIGN.md](DESIGN.md)

**Include for learning:** MIT, Apache-2.0, BSD-2/3-Clause, ISC, Unlicense, 0BSD  
**Out of scope for copying patterns:** GPL, AGPL, proprietary, unclear license

_Research date: 2026-08-10. Licenses and APIs verified via npm registry metadata and published/source files._

## Matrix

| Name | License | npm / repo | Runtime deps | API shape | SSR notes | Patterns to learn / avoid | Reports |
|------|---------|------------|--------------|-----------|-----------|---------------------------|---------|
| **sveltekit-embed** | MIT | [`sveltekit-embed`](https://www.npmjs.com/package/sveltekit-embed) · [spences10/sveltekit-embed](https://github.com/spences10/sveltekit-embed) | none (peer: `svelte` ^4 \|\| ^5) | Named provider components (`YouTube`, `Vimeo`, `GenericEmbed`, …); props like `youTubeId`, `aspectRatio: '16:9'`, `disable_observer` | IO-gated: iframe not rendered until `IntersectionObserver` fires (empty on SSR unless `disable_observer`) | **Learn:** nocookie default, shared observer wrapper, `allow` strings. **Avoid:** padding-top ratio hack; `youTubeId` naming; many providers bloating surface; `$effect` for observer | [sveltekit-embed.md](reports/sveltekit-embed.md) |
| **lite-youtube-embed** | Apache-2.0 | [`lite-youtube-embed`](https://www.npmjs.com/package/lite-youtube-embed) · [paulirish/lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed) | none | Custom element `<lite-youtube videoid playlabel params title>` | CE is client-only; progressive-enhancement HTML + `<noscript>` iframe for crawlers | **Learn:** click-to-load facade, nocookie URL, `referrerpolicy`, preconnect warmup, play-button a11y, noscript fallback. **Avoid:** shipping YT Player API path for v1 | [lite-youtube-embed.md](reports/lite-youtube-embed.md) |
| **svelte-youtube-embed** | MIT | [`svelte-youtube-embed`](https://www.npmjs.com/package/svelte-youtube-embed) · [sharu725/youtube-embed](https://github.com/sharu725/youtube-embed) | `svelte` listed as **dependency** (should be peer) | `<Youtube id />` facade; slots for play button / thumbnail; CSS vars for overlay/title | Thumbnail SSR-friendly; iframe only after click; fetches oEmbed on `onMount` for title | **Learn:** CSS `aspect-ratio`, nocookie + `autoplay=1` on activate, overlay a11y. **Avoid:** client oEmbed fetch as required path; bundling `svelte` as dep | [svelte-youtube-embed.md](reports/svelte-youtube-embed.md) |
| **lite-vimeo-embed** | MIT | [`lite-vimeo-embed`](https://www.npmjs.com/package/lite-vimeo-embed) · [luwes/lite-vimeo-embed](https://github.com/luwes/lite-vimeo-embed) | none | `<lite-vimeo videoid playlabel>` custom element | Client-only CE; injects CSS at runtime; thumbnail via Vimeo JSON API | **Learn:** modern `aspect-ratio: 16 / 9`, preconnect to Vimeo CDNs, focus iframe after load. **Avoid:** hard dependency on Vimeo API for poster (CORS/offline) | [lite-vimeo-embed.md](reports/lite-vimeo-embed.md) |
| **react-lite-youtube-embed** | MIT | [`react-lite-youtube-embed`](https://www.npmjs.com/package/react-lite-youtube-embed) · [ibrahimcesar/react-lite-youtube-embed](https://github.com/ibrahimcesar/react-lite-youtube-embed) | none (peer: React 18+) | `<LiteYouTubeEmbed id title cookie? poster? params lazyLoad? … />`; strong TS types | Facade: thumbnail first; optional always-load iframe; `noscriptFallback` | **Learn:** require `title`, cookie/nocookie toggle, `referrerPolicy`, poster quality enum, lazy thumbnail. **Avoid:** full player-event surface for a “simple embed” lib | [react-lite-youtube-embed.md](reports/react-lite-youtube-embed.md) |
| **react-player** | MIT | [`react-player`](https://www.npmjs.com/package/react-player) · [cookpete/react-player](https://github.com/cookpete/react-player) | ~10 media custom-elements (`youtube-video-element`, `vimeo-video-element`, …) | Single `<ReactPlayer src|url controls … />` multi-provider player | Client-heavy; provider SDKs / media elements | **Learn:** URL-in API convenience. **Avoid:** runtime dep graph, player APIs, out of scope for zero-dep iframe wrappers | [react-player.md](reports/react-player.md) |
| **@astro-community/astro-embed-youtube** | MIT | [`@astro-community/astro-embed-youtube`](https://www.npmjs.com/package/@astro-community/astro-embed-youtube) · [delucis/astro-embed](https://github.com/delucis/astro-embed) | `lite-youtube-embed` | Astro component: `id` (id or URL), `poster`, `posterQuality`, `playlabel` | SSRs PE markup (`<a class="lyt-playbtn">` + poster); hydrates CE | **Learn:** accept id-or-URL via matcher; progressive-enhancement markup around lite-youtube. **Avoid:** depending on another package if we want zero runtime deps | [astro-embed-youtube.md](reports/astro-embed-youtube.md) |
| **@sveltinio/media-content** | MIT | [`@sveltinio/media-content`](https://www.npmjs.com/package/@sveltinio/media-content) · [sveltinio/components-library](https://github.com/sveltinio/components-library) | `@sveltinio/ts-utils`; peer Svelte 3/4 only | `YouTube` with `id`, `title`, `settings` object, thumbnail→iframe swap | Thumbnail facade until play; uses Svelte 3 `export let` / `$:` | **Learn:** settings→query-string builder; title required. **Avoid:** Svelte 3 APIs; runtime util package; default `youtube.com` (not nocookie) | [sveltinio-media-content.md](reports/sveltinio-media-content.md) |

## Deep dives

### Candidate 1 — sveltekit-embed

- Repo: https://github.com/spences10/sveltekit-embed  
- License: MIT (confirmed in repo `LICENSE` and npm)  
- npm: `sveltekit-embed@0.0.22`  
- Summary: Closest Svelte competitor — large set of lazy provider components (YouTube, Vimeo, Spotify, Tweet, …) with a shared `GeneralObserver` and Svelte 5 `$props`. Zero published runtime deps; `svelte` is a peer.

- Useful patterns:
  - **Privacy host by default:** YouTube builds `https://www.youtube-nocookie.com/embed/…`.
  - **URL builder:** query flags as `Number(boolean)` (`autoplay`, `mute`, `controls`, `loop`, `modestbranding`, `rel`); playlist via `videoseries&list=`.
  - **iframe attrs:** `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"`, `allowfullscreen`, generated `title={`youTube-${id}`}`.
  - **Lazy mount:** `IntersectionObserver` (threshold 0.5) before rendering children; `disable_observer` for immediate load; SSR-safe check `typeof IntersectionObserver !== 'undefined'`.
  - **GenericEmbed:** thin `src` + `title` + dimensions + rest spread — validates the “primitive + providers” split.

- Avoid:
  - **Aspect ratio via `padding-top` map** (`'16:9' → padding-top: 56.25%`) instead of CSS `aspect-ratio` (our API already uses `'16 / 9'`).
  - **Verbose prop names** (`youTubeId`, `vimeoId`) vs short `id` on a namespaced component.
  - **Empty SSR** when observer is on — no iframe/markup until client intersection (SEO/CLS tradeoff).
  - **Kitchen-sink providers** and stringly `iframe_styles` — fights the “simple” positioning.
  - Observer setup uses `$effect` — fine for IO, but not needed if we stick to native `loading="lazy"` iframes.

### Candidate 2 — lite-youtube-embed

- Repo: https://github.com/paulirish/lite-youtube-embed  
- License: Apache-2.0  
- npm: `lite-youtube-embed@0.3.4`  
- Summary: De-facto “facade” reference. Custom element paints a poster + play control; real iframe (or YT API on Safari/mobile) only after click. ~89k weekly downloads; zero deps.

- Useful patterns:
  - **Poster:** `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, optional webp upgrade; custom poster if `background-image` already set.
  - **Activate iframe:** `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&playsinline=1&…`
  - **iframe attrs:** `allow`, `allowFullscreen`, **`referrerPolicy = 'strict-origin-when-cross-origin'`** (fixes YT Error 153), `title` from play label, focus iframe after insert.
  - **A11y:** real `<button>` with visually-hidden label; PE mode turns `<a class="lyt-playbtn">` into keyboard-activatable control.
  - **Warmup:** `pointerover`/`focusin` → `preconnect` to `youtube-nocookie.com` / Google origins.
  - **Noscript:** basic iframe inside `<noscript>` for indexability.
  - **CSS:** padding-bottom 16:9 box; absolute iframe; play SVG as background-image.

- Avoid:
  - **Full YT IFrame API** branch (`js-api` / Apple / mobile) — heavy and out of v1 non-goals.
  - **Custom element + injected global CSS** — wrong packaging model for a Svelte component library (reimplement ideas, don’t ship the CE).
  - Hard-coded 16:9 only in CSS (`::after { padding-bottom: calc(100% / (16/9)) }`).

### Candidate 3 — svelte-youtube-embed

- Repo: https://github.com/sharu725/youtube-embed  
- License: MIT  
- npm: `svelte-youtube-embed@0.4.6`  
- Summary: Svelte 5 facade component: thumbnail + overlay until click, then nocookie iframe with `autoplay=1`. Uses modern `aspect-ratio`. Optionally fetches title via YouTube oEmbed on mount.

- Useful patterns:
  - **Prop: `id`** (simple) + optional `short` flipping `--aspect-ratio` to `9/16`.
  - **Activate:** swap to iframe `youtube-nocookie.com/embed/{id}?autoplay=1&rel=0`.
  - **CSS `aspect-ratio: var(--aspect-ratio, 16/9)`** on wrapper — aligns with our design.
  - **Overlay:** `role="button"`, `tabindex="0"`, `aria-label`; custom play button / thumbnail via snippets/slots.
  - **Theming hooks:** CSS custom properties for overlay and title styling.

- Avoid:
  - **Required network oEmbed** (`youtube.com/oembed` in `onMount`) for title — fragile offline/CORS/privacy; prefer caller-supplied `title`.
  - **`svelte` as a runtime dependency** instead of peer — duplicates framework in consumers.
  - Keyboard handler on `onkeypress` (prefer `keydown` + Enter/Space like lite-youtube).
  - No `referrerpolicy` / limited `allow` vs current best practice.

### Candidate 4 — lite-vimeo-embed

- Repo: https://github.com/luwes/lite-vimeo-embed  
- License: MIT  
- npm: `lite-vimeo-embed@0.3.0`  
- Summary: Vimeo counterpart to lite-youtube. Facade CE; fetches poster from `https://vimeo.com/api/v2/video/{id}.json`; embeds `player.vimeo.com/video/{id}?autoplay=1` on click.

- Useful patterns:
  - **CSS `aspect-ratio: 16 / 9`** (modern; better than padding hack).
  - **URL:** `https://player.vimeo.com/video/${encodeURIComponent(videoId)}?autoplay=1`.
  - **Preconnect** on hover: `player.vimeo.com`, `i.vimeocdn.com`, `f.vimeocdn.com`.
  - **A11y:** play `button` with `aria-label`; focus iframe on `load`.
  - **SSR-ish guard:** `HTMLElement ?? class {}` so import doesn’t explode in non-DOM contexts.

- Avoid:
  - **Poster fetch always hits Vimeo API** — not zero-network; fails without network; couples to API v2.
  - Runtime CSS injection into `document.head`.
  - Same CE packaging mismatch as lite-youtube for a Svelte lib.

## Rejected / non-permissive

Do **not** copy code from these. Listed only for awareness / license hygiene. Deep dive: [reports/rejected-licenses.md](reports/rejected-licenses.md).

| Name | License | Why listed |
|------|---------|------------|
| [svelte-youtube-lite](https://github.com/radiofrance/svelte-youtube-lite) (`svelte-youtube-lite`) | **Unclear / missing** — no `license` field on npm; no `LICENSE` in published tarball (v1.3.0) | Strong GDPR/facade ideas, but cannot treat as safely reusable without a clear permissive grant |
| [Embed Plus for YouTube](https://wordpress.org/plugins/youtube-embed-plus/) / historical [wp-plugins/youtube-embed-plus](https://github.com/wp-plugins/youtube-embed-plus) | **GPL-3.0** | WordPress plugin; copyleft |
| [YouTube Embed](https://github.com/squaredcode/youtube-embed) (WordPress) | **GPL-2.0** | WordPress plugin; copyleft |
| [`@ckeditor/ckeditor5-media-embed`](https://www.npmjs.com/package/@ckeditor/ckeditor5-media-embed) | **SEE LICENSE IN LICENSE.md** (proprietary / dual commercial) | Not OSS-permissive; editor plugin, not a reusable embed primitive |

## Sources

- https://www.npmjs.com/package/sveltekit-embed · https://github.com/spences10/sveltekit-embed  
- https://www.npmjs.com/package/lite-youtube-embed · https://github.com/paulirish/lite-youtube-embed (source: `src/lite-yt-embed.js`, `src/lite-yt-embed.css`)  
- https://www.npmjs.com/package/svelte-youtube-embed · https://github.com/sharu725/youtube-embed (published `dist/Youtube.svelte`, `dist/Iframe.svelte`)  
- https://www.npmjs.com/package/lite-vimeo-embed · https://github.com/luwes/lite-vimeo-embed (published `lite-vimeo-embed.js`)  
- https://www.npmjs.com/package/react-lite-youtube-embed · https://github.com/ibrahimcesar/react-lite-youtube-embed  
- https://www.npmjs.com/package/react-player · https://github.com/cookpete/react-player  
- https://www.npmjs.com/package/@astro-community/astro-embed-youtube · https://github.com/delucis/astro-embed  
- https://www.npmjs.com/package/@sveltinio/media-content · https://github.com/sveltinio/components-library  
- https://www.npmjs.com/package/svelte-youtube-lite · https://github.com/radiofrance/svelte-youtube-lite  
- https://wordpress.org/plugins/youtube-embed-plus/ · https://github.com/squaredcode/youtube-embed  
- https://www.npmjs.com/package/@ckeditor/ckeditor5-media-embed  
- YouTube embed params: https://developers.google.com/youtube/player_parameters  
- Vimeo embed: https://developer.vimeo.com/player/sdk/embed  
- Facade guidance: https://web.dev/third-party-facades/
