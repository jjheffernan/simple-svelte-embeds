# react-lite-youtube-embed

Deep research for informing `simple-svelte-embeds`. Research date: 2026-08-10. License is MIT (permissive — patterns may be learned; do not paste large verbatim code).

## Snapshot

| Field | Value |
|-------|--------|
| Package | [`react-lite-youtube-embed@3.6.2`](https://www.npmjs.com/package/react-lite-youtube-embed) |
| Repo | [`ibrahimcesar/react-lite-youtube-embed`](https://github.com/ibrahimcesar/react-lite-youtube-embed) |
| License | MIT |
| Author | Ibrahim Cesar |
| Runtime deps | **none** (peers: `react` / `react-dom` `>=18.2.0`) |
| API shape | `<LiteYouTubeEmbed id title … />` + separate CSS import |
| npm downloads | ~200.8k/week (2026-08-03 → 2026-08-09) |
| Footprint | ~3.7 KB ESM gzip + ~1.5 KB CSS gzip (official size badges) |
| Positioning | React port of Paul Irish’s lite-youtube facade: poster + play button first; iframe only after click (or `alwaysLoadIframe` / `autoplay`) |
| vs us | Click-to-load React facade + large optional TS surface vs our SSR iframe Svelte components (`YouTube` → `Embed`) |

Docs/demos: https://ibrahimcesar.github.io/react-lite-youtube-embed  
Credits original [lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed) (Paul Irish) and adaptive-loading ideas (Addy Osmani).

## Architecture

Single React component in `src/lib/index.tsx`, exported as `forwardRef<HTMLIFrameElement, LiteYouTubeProps>`. Companion styles in `src/lib/LiteYouTubeEmbed.css`. Optional hook `useYoutubeThumbnail` probes `maxresdefault` availability client-side and falls back to `hqdefault`.

**Default path (facade):**

1. Render a wrapper (`article` by default) with YouTube poster as `background-image` (or `<img loading="lazy">` when `lazyLoad`).
2. Real `<button class="lty-playbtn">` with visually hidden “Watch” label + `aria-label` including `title`.
3. On `pointerover`, inject `preconnect` to the chosen YouTube host (+ Google; optionally DoubleClick if `adNetwork`).
4. On click (wrapper or button), set state → mount iframe with `autoplay=1` (user gesture) into the activated wrapper.
5. Always (by default) emit `<noscript>` with a watch-page link; optionally emit JSON-LD `VideoObject` when `seo` is set.

**Escape hatches:** `alwaysLoadIframe` / `autoplay` can mount the iframe immediately (with muted-autoplay policy when both apply). `enableJsApi` + postMessage listeners unlock a full player-event surface (`onPlay`, `onPause`, `onEnd`, …).

**URL host:**

```ts
props.cookie
  ? "https://www.youtube.com"
  : "https://www.youtube-nocookie.com"   // default
```

**Poster URL pattern:** `https://i.ytimg.com/{vi|vi_webp}/{id}/{poster}.{jpg|webp}` (`poster` defaults to `hqdefault`). Custom override via `thumbnail` string.

**CSS layout:** modern `aspect-ratio: 16 / 9` on `.yt-lite`, with a `--aspect-ratio` padding-bottom fallback for older browsers (`aspectHeight` / `aspectWidth` drive the CSS var). Absolute iframe; play SVG as button background.

## Public API surface

Required: **`id`**, **`title`**.

### Core / privacy / media

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `id` | `string` | — | Video id (or playlist id when `playlist`) |
| `title` | `string` | — | **Required**; iframe `title`, a11y labels, SEO fallback |
| `cookie` | `boolean` | `false` | `true` → `youtube.com`; else nocookie |
| `noCookie` | `boolean` | — | **Deprecated** in types; prefer `cookie`. Not wired in current render logic (dead API surface) |
| `poster` | `imgResolution` | `'hqdefault'` | `'default' \| 'mqdefault' \| 'hqdefault' \| 'sddefault' \| 'maxresdefault'` |
| `webp` | `boolean` | `false` | Switch `vi` → `vi_webp` and `.webp` |
| `thumbnail` | `string` | — | Full custom poster URL (skips built-in) |
| `lazyLoad` | `boolean` | `false` | Use `<img loading="lazy">` instead of CSS background + skip preload `<link>` |
| `noscriptFallback` | `boolean` | `true` | `<noscript><a href=watch?v=…>` |
| `params` | `string \| Record<string, string \| number>` | — | Extra player query params |
| `playlist` | `boolean` | `false` | Embed `videoseries?list=` + playlist icon overlay |
| `playlistCoverId` | `string` | — | Cover thumbnail id when `playlist` |
| `muted` / `autoplay` | `boolean` | `false` | Query flags; autoplay-on-immediate-load also requires mute for policy |
| `alwaysLoadIframe` | `boolean` | `false` | Skip facade; mount iframe on first render |
| `enableJsApi` | `boolean` | `false` | `enablejsapi=1` + `origin` + postMessage event bus |
| `stopOnEnd` | `boolean` | `false` | On `ENDED`, `postMessage` `stopVideo` (needs JS API) |
| `adNetwork` | `boolean` | `false` | Preconnect DoubleClick hosts only (docs sometimes overclaim “uses youtube.com”) |
| `referrerPolicy` | `HTMLAttributeReferrerPolicy` | `'strict-origin-when-cross-origin'` | Passed to iframe |
| `aspectWidth` / `aspectHeight` | `number` | `16` / `9` | Drive CSS `--aspect-ratio` % fallback |
| `announce` | `string` | `'Watch'` | Play-button accessible name prefix |
| `focusOnLoad` | `boolean` | `false` | Focus iframe after activate |
| `hideButtonOnActivate` | `boolean` | `false` | Remove play button DOM when iframe shown |
| `seo` | `VideoSEO` | — | JSON-LD VideoObject injection |
| `onIframeAdded` | `() => void` | — | Fires when iframe state flips on |
| Class / style hooks | `wrapperClass`, `playerClass`, `iframeClass`, `activatedClass`, `containerElement`, `style`, `rel` | various | Theming / markup escape hatches |

Exported types/enums: `LiteYouTubeProps`, `imgResolution`, `VideoSEO`, `PlayerState`, `PlayerError`, `PlayerReadyEvent`, `PlayerStateChangeEvent`, `YouTubeEvent`.

### Event surface (opt-in via `enableJsApi`)

`onReady`, `onStateChange`, `onError`, convenience `onPlay` / `onPause` / `onEnd` / `onBuffering`, plus `onPlaybackRateChange`, `onPlaybackQualityChange`. Implemented with `window` `message` listeners and retry “listening” posts into the iframe — substantial code for a “lite” embed.

### Consumer import pattern

```tsx
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
```

## Social / platform coverage

**YouTube only.** No Vimeo, no URL-in parser, no Shorts helper as a first-class API. Playlist mode exists (`playlist` + `playlistCoverId`). Player params are opaque via `params`. Related-video / branding knobs are not dedicated props.

Contrast `simple-svelte-embeds`: YouTube + Vimeo + generic `Embed` already in scope; still iframe-URL builders, not facades.

## SSR, hydration, lazy-load

| Concern | Behavior |
|---------|----------|
| SSR | Facade markup (wrapper + button + optional noscript/JSON-LD) is SSR-friendly React output; **no YouTube iframe** until activate (unless `alwaysLoadIframe` / `autoplay`) |
| Hydration | Standard React client state (`useState` for iframe / preconnect); hooks like `useYoutubeThumbnail` run in `useEffect` (client-only image probe) |
| `lazyLoad` | Native `loading="lazy"` on the **thumbnail `<img>`**, not on the iframe. Default path uses CSS `background-image` + optional `<link rel="preload|prefetch" as="image">` |
| Noscript | Default `noscriptFallback`: link to `youtube.com/watch?v=…` (not a full iframe — weaker than Paul Irish’s noscript iframe injection) |
| SEO | Optional `seo` → inline `<script type="application/ld+json">` VideoObject |
| Contrast us | We SSR a real `<iframe loading="lazy">` immediately — better crawler/iframe presence without facade/noscript tricks; worse first-load third-party cost |

## Privacy, a11y, iframe attrs

**Privacy**

- Default host is **nocookie** (`cookie={false}`). Affirmative-privacy naming on our side (`privacyEnhanced`) is clearer than an inverted `cookie` flag.
- No cookies until user activates (or always-load path). Preconnect warms YouTube/Google; `adNetwork` additionally warms DoubleClick.
- Facade is the privacy/performance product; JS API / events reintroduce YouTube script/postMessage coupling.

**A11y**

- Required `title` is the strongest lesson vs optional titles elsewhere.
- Play control is a real `<button type="button">` with `aria-label={`${announce} ${title}`}` and visually hidden text.
- Wrapper gets `aria-label` / `role="img"` while inactive (role dropped when `lazyLoad`).
- Optional `focusOnLoad` after iframe mount (good for keyboard users).
- Docs claim keyboard/screen-reader support; activation is click-driven on wrapper + button (Enter/Space on the focused button works via native button semantics).

**Iframe attrs (on activate)**

```html
allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
allowFullScreen
referrerPolicy="strict-origin-when-cross-origin"   <!-- default; Error 153 fix -->
title={videoTitle}
width="560" height="315"
```

Notes vs us:

- Our `allow` also includes `clipboard-write` and `web-share` — slightly broader; fine to keep.
- We already default the same `referrerpolicy`.
- Fixed 560×315 are overridden by CSS absolute fill; cosmetic for layout.

## Packaging & footprint

| Item | Detail |
|------|--------|
| Version researched | `3.6.2` |
| Runtime deps | none |
| Peers | `react`, `react-dom` `>=18.2.0` |
| Publish | `files: ["dist"]` — dual ESM (`index.es.js`) + CJS (`index.cjs`) + `index.d.ts` + CSS + source maps |
| Exports | `"."` (types/import/require) and `"./dist/LiteYouTubeEmbed.css"` |
| Size (gzip badges) | ES **3.7 KB**, CJS **3.3 KB**, CSS **1.5 KB** (~5.2 KB total typical) |
| size-limit | 10 KB JS / 2 KB CSS gzip caps in CI |
| Tarball / unpacked | ~34 KB packed · ~119 KB unpacked (maps inflate) |
| Supply chain | SLSA provenance / `npm audit signatures` documented (v3.0.6+) |
| CSS model | **Separate mandatory import** (easy to forget; not co-located) |

Vs shipping `.svelte` source: they win dual-format React consumers + provenance; we win co-located `<style>`, no second CSS import, and Svelte compiler integration with zero prebuild.

## Strengths

- **Mature facade** with strong defaults: nocookie, required `title`, `referrerPolicy`, real play button, preconnect-on-intent.
- **Excellent TypeScript surface** — exported props, poster union, SEO, player enums; good DX for React apps.
- **Tiny published JS+CSS** with size-limit CI and public badges; ~200k weekly downloads.
- **Poster quality enum** (`hqdefault` default; `maxresdefault` with runtime fallback probe) is a clear, documented knob.
- **`lazyLoad` / `noscriptFallback` / `seo`** are explicit progressive-enhancement levers (even if noscript is link-only).
- **`params` accepts string or record** — flexible without exploding into dozens of boolean props.
- Zero runtime deps; peers only. SLSA provenance is uncommon polish for a small UI lib.
- CSS uses modern `aspect-ratio` with a sensible fallback (better than pure padding-top maps).

## Weaknesses / anti-patterns

- **Kitchen-sink event / JS API surface** for a “lite” package — postMessage bus, retries, `stopOnEnd`, quality/rate handlers. Pulls maintenance and mental load toward a mini react-player.
- **Inverted `cookie` naming** (+ deprecated unused `noCookie`) is confusing vs affirmative privacy props.
- **Docs drift:** `adNetwork` docs imply host switch; source only preconnects ad CDNs. `rel` typed/docs as `'prefetch' \| 'preload'` but implemented as truthy → `"prefetch"` else `"preload"`.
- **`maxresdefault` probe** (`useYoutubeThumbnail`) always hits the network with `new Image()` — extra request, client-only, can flash/fallback.
- **Separate CSS import** is a footgun; no `sideEffects` field.
- **Noscript is a watch link**, not an iframe — weaker crawl/embed fallback than Paul Irish’s injected iframe.
- **YouTube-only**; playlist mode is bolted on. Source maps in the npm tarball bloat unpacked size.
- Facade-by-default means **no real iframe in HTML** until interaction — SEO/CLS tradeoffs vs immediate SSR iframe (our model).

## Steal for simple-svelte-embeds

- **Require or strongly enforce `title`** (TS/JSDoc required; document as non-optional). Auto-titles like `youTube-${id}` are weak.
- **Keep privacy host default** — our `privacyEnhanced` (default `true`) is better naming than `cookie={false}`.
- **Keep `referrerpolicy="strict-origin-when-cross-origin"`** — already aligned; don’t drop it.
- **Optional later `params`** as `string | Record<string, string | number>` (or query-string only) instead of many boolean player props.
- **If/when a facade ships** (separate component or `facade` prop — not v1 default):
  - Poster from `i.ytimg.com/vi/{id}/hqdefault.jpg`; optional quality enum (`hqdefault` / `maxresdefault`).
  - Real `<button>` + visually hidden label; encode id; activate → nocookie iframe + `autoplay=1`.
  - Preconnect on pointer/focus intent.
  - Prefer a **noscript iframe** (lite-youtube style) over a watch-link-only fallback.
  - Focus iframe after activate (`focusOnLoad` idea).
- **Modern `aspect-ratio`** (we already use CSS `aspect-ratio` string) — confirm we never regress to padding-top maps.
- **Size discipline / dual clarity** — size-limit mindset is good even if we ship source; document expected compiled weight.

## Avoid

- **Full player-event / `enableJsApi` / postMessage** surface — explicit DESIGN.md non-goal; belongs in a different package.
- **Making facade the default** — contradicts SSR iframe + zero-runtime goals; keep iframe-first for v1.
- **Poster enum / webp / SEO JSON-LD / class-hook soup on core `YouTube`** — facade/SEO wrappers only if ever needed.
- **Inverted `cookie` API** — keep affirmative `privacyEnhanced`.
- **Client thumbnail probing** (`new Image()` width checks) as a required path.
- **Mandatory separate global CSS** — prefer co-located Svelte `<style>`; if facade CSS grows, still ship with the component.
- **Always-load iframe + muted autoplay policy maze** as public defaults — keep activation semantics simple.
- **React-specific packaging patterns** (CJS dual build, forwardRef) as a template for our publish model — we ship `.svelte` source by design.

## Sources

- https://www.npmjs.com/package/react-lite-youtube-embed  
- https://github.com/ibrahimcesar/react-lite-youtube-embed  
- https://raw.githubusercontent.com/ibrahimcesar/react-lite-youtube-embed/main/package.json  
- https://raw.githubusercontent.com/ibrahimcesar/react-lite-youtube-embed/main/src/lib/index.tsx  
- https://raw.githubusercontent.com/ibrahimcesar/react-lite-youtube-embed/main/src/lib/useYoutubeThumbnail.tsx  
- https://raw.githubusercontent.com/ibrahimcesar/react-lite-youtube-embed/main/src/lib/LiteYouTubeEmbed.css  
- https://cdn.jsdelivr.net/npm/react-lite-youtube-embed@3.6.2/dist/index.d.ts  
- https://ibrahimcesar.github.io/react-lite-youtube-embed/docs/api-reference  
- https://raw.githubusercontent.com/ibrahimcesar/react-lite-youtube-embed/main/.github/badges/size-es.json  
- https://raw.githubusercontent.com/ibrahimcesar/react-lite-youtube-embed/main/.github/badges/size-css.json  
- https://api.npmjs.org/downloads/point/last-week/react-lite-youtube-embed  
- https://registry.npmjs.org/react-lite-youtube-embed/3.6.2  
- Upstream facade: https://github.com/paulirish/lite-youtube-embed  
- YouTube Error 153 / referrerpolicy context (via lite-youtube + this package defaults)  
- This repo: `src/YouTube.svelte`, `src/Embed.svelte`, `docs/API.md`, `docs/DESIGN.md`, `docs/COMPETITORS.md`
