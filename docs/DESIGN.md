# Design

## Goals

- **Simple API** — small set of components; props map closely to iframe attributes plus a few ergonomic helpers (`id`, `aspectRatio`).
- **Zero runtime dependencies** — only `svelte` as a peer. No oEmbed fetchers, no player SDKs, no framework adapters.
- **SSR-safe** — render a real `<iframe>` (or a deliberate placeholder) without `$app/*` or browser-only imports in `src/lib`.
- **Accessible** — require or strongly encourage `title`; use native `loading` where appropriate.
- **Sized predictably** — aspect ratio via CSS (`aspect-ratio` / custom properties), not fixed pixel hacks.
- **Privacy-friendly defaults** — prefer YouTube nocookie host when implementing real embeds.

## Initial scope

| Component | Role |
|-----------|------|
| `YouTube` | Build youtube(-nocookie) embed URL from `id` |
| `Vimeo` | Build player.vimeo.com embed URL from `id` |
| `Embed` | Generic iframe wrapper (`src` required) |

Provider set may grow after competitor research; keep the public surface root-exported only.

## Non-goals

- oEmbed HTTP client or server proxy
- Analytics / tracking SDKs
- React / Vue / web-component builds (Svelte components only for now)
- Full YouTube/Vimeo player APIs (play, pause, events via postMessage)
- Bundled CSS frameworks

## Technical constraints

- **Publish `src/` directly** — no build/dist step; consumers compile `.svelte` themselves.
- Component markup stays Svelte. Required script is TypeScript (`lang="ts"`, type-only). One `index.js` re-export barrel.
- **`src/urls.ts`** — zero-dep URL helpers for non-Svelte frameworks (React/Vue/etc.); no adapters, no custom-element build.
- Framework-agnostic: Svelte components via `svelte` export; any host via `simple-svelte-embeds/urls` + native iframe.
- Svelte 5 **runes only** — `$props`, `$derived`; avoid `$effect` for iframe URL/attrs.
- No `$app/*` or Kit-only APIs.
- Providers compose `Embed` and share URL logic with `urls.ts`.
- Runtime `dependencies` stay empty unless DESIGN.md is updated and reviewed.
- `svelte` peer is **optional** (needed only when importing components).

## Steal these ideas / avoid these

Synthesized from [COMPETITORS.md](COMPETITORS.md), deep dives in [reports/](reports/), and actionable follow-ups in [IMPROVEMENTS.md](IMPROVEMENTS.md). Prefer MIT/Apache patterns only.

### Steal

- **Privacy host by default** — YouTube via `youtube-nocookie.com`; keep affirmative `privacyEnhanced` (default `true`), not inverted `cookie` flags.
- **`referrerpolicy="strict-origin-when-cross-origin"`** — required to avoid YouTube Error 153; document that page-level `no-referrer` / `same-origin` can still break embeds.
- **Require `title`** — treat as required in the public API; never invent `youTube-${id}`-style titles.
- **Native lazy SSR iframes for v1** — real `<iframe loading="lazy">` beats empty IntersectionObserver shells and facade-only HTML.
- **CSS `aspect-ratio` + CSS vars** — modern ratio strings (`'16 / 9'`, optional Shorts `'9 / 16'`); no padding-top maps.
- **`encodeURIComponent(id)`** — on every provider URL builder.
- **Optional `params` bag** — string or record → query (`0|1`, snake_case), instead of dozens of boolean props.
- **Optional id-or-URL helpers** — tiny pure parsers (astro-embed style); keep bare `id` as the primary prop.
- **Generic `Embed` primitive** — providers only build `src` (+ allow) and compose `Embed`.
- **Optional later facade** — static poster URLs, real `<button>`, `autoplay=1` on gesture, intent preconnect (player host only), PE/noscript — never the default path.
- **Iframe-only social growth** — TikTok / Bluesky / Spotify / Gist `.pibb` recipes when thin; Meta/X only if iframe endpoints exist.
- **`svelte` peer only + publish `src/`** — empty runtime deps; consumers compile `.svelte`.

### Avoid

- **Player SDKs / YT IFrame API / react-player architecture** — out of scope (see Non-goals).
- **Required oEmbed or poster HTTP** — no mount-time YouTube oEmbed, Vimeo API v2, noembed, or vumbnail.
- **IntersectionObserver empty-until-visible as default** — CLS/SEO tax; native `loading="lazy"` is enough.
- **Padding-top aspect-ratio maps** and provider-prefixed ids (`youTubeId`).
- **Kitchen-sink + script widgets** — `widgets.js`, FB SDK, unused Player.js; mark `blocked` in todo.md.
- **Custom elements + global CSS injection** as the public API — reimplement ideas in Svelte.
- **DoubleClick / ads preconnects** and full postMessage player-event surfaces.
- **GPL / proprietary / unclear-license sources** — see [reports/rejected-licenses.md](reports/rejected-licenses.md).
