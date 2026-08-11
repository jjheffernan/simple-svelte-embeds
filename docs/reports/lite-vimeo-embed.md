# lite-vimeo-embed

Deep research for informing `simple-svelte-embeds`. Research date: 2026-08-10. License claimed MIT in `package.json` (permissive — patterns may be learned; do not paste large verbatim code). **No `LICENSE` file** in repo or npm tarball; GitHub `license` metadata is null ([issue #31](https://github.com/luwes/lite-vimeo-embed/issues/31)). Treat as MIT-declared but license-hygiene incomplete.

## Snapshot

| Field | Value |
|-------|--------|
| Package | [`lite-vimeo-embed@0.3.0`](https://www.npmjs.com/package/lite-vimeo-embed) |
| Repo | [`luwes/lite-vimeo-embed`](https://github.com/luwes/lite-vimeo-embed) |
| License | MIT in `package.json` only (no `LICENSE` file) |
| Author | Wesley Luyten (`luwes`) |
| Runtime deps | **none** |
| API shape | Custom element `<lite-vimeo videoid playlabel>` — single root JS with **inlined CSS** |
| Stars / forks | ~169 / ~28 (GitHub API, 2026-08-10) |
| npm downloads | ~1.0k/week · ~4.8k/month |
| Last release | **2023-11-23** (`0.3.0`) — effectively dormant |
| Positioning | Vimeo port of [lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed): poster facade + play control; real player only after click |
| vs us | Client CE + API poster fetch + click-to-iframe vs our SSR iframe Svelte `Vimeo` → `Embed` |

Claims ~224× faster first paint than a normal Vimeo iframe (`readme.md`). CDN usage: `https://cdn.jsdelivr.net/npm/lite-vimeo-embed/+esm`. Author upsell: [playerx](https://github.com/luwes/playerx) for a heavier multi-provider player (does **not** depend on this package).

## Architecture

Flat repo — **no `src/`**, **no separate CSS**, **no bundler**. One runtime module: `lite-vimeo-embed.js` (~223 lines).

**Module evaluation (top-level, before class):**

1. `document.head.appendChild(document.createElement('style'))` — injects global CSS for `lite-vimeo` / `.ltv-playbtn` / `.ltv-activated`.
2. Class `LiteVimeo extends (globalThis.HTMLElement ?? class {})`.
3. Side-effect `customElements.define('lite-vimeo', LiteVimeo)` if `customElements` exists and name is free.

**Lifecycle (`connectedCallback`):**

1. Read `videoid` → `this.videoId`.
2. Measure host via `getBoundingClientRect()`; scale by DPR (cap: if DPR ≥ 2, multiply by `0.75`); round via `getThumbnailDimensions`.
3. `fetch('https://vimeo.com/api/v2/video/${id}.json')` → take `data[0].thumbnail_large` → rewrite trailing `-d_*` size suffix → set `style.backgroundImage`.
4. Resolve play label: child `.ltv-playbtn` textContent → `playlabel` attr → `"Play video"`.
5. Ensure play control: create `<button type="button" aria-label=… class="ltv-playbtn">` if missing; strip `href` if PE used an `<a>`.
6. `pointerover` (once) → static `_warmConnections()`.
7. `click` → `addIframe`.

**Activate (`addIframe`):**

- Guard with class `ltv-activated` (CSS hides play button / leftover `::before`).
- Create iframe: fixed `640×360`, `title = playLabel`, `allow = accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture`.
- `src = https://player.vimeo.com/video/${encodeURIComponent(id)}?autoplay=1`.
- Append; on iframe `load`, call `iframeEl.focus` (a11y; changelog 0.2.2).

**CSS layout:** modern `aspect-ratio: 16 / 9` on host (improvement over lite-youtube’s padding hack); absolute iframe; CSS-triangle play icon; Vimeo-blue hover (`rgb(0,173,239)`); `contain: content`.

**Helpers:** `addPrefetch` (head `<link rel=preconnect crossorigin>`), `getThumbnailDimensions` (round width up to nearest 100px unless already multiple of 320, for CDN cacheability / native frame sizes).

## Public API surface

### HTML attributes / markup

| Surface | Role |
|---------|------|
| `videoid` | Required video id (read once on connect; **not** observed) |
| `playlabel` | Accessible name / iframe `title` fallback |
| Child `.ltv-playbtn` | Custom play control; PE demo uses `<a href="https://vimeo.com/…">` |
| Inline `style.background-image` | Progressive-enhancement poster before JS; successful API fetch **overwrites** it |

No `params`, `title` overlay, `js-api`, or observedAttributes. Changing `videoid` after connect does nothing.

### JS surface

| Item | Notes |
|------|--------|
| `addIframe()` | Instance method; click handler; idempotent via `ltv-activated` |
| `LiteVimeo._warmConnections()` | Static; preconnects four Vimeo CDN origins once |
| Named exports | **None** — side-effect ESM only |

### Consumer include

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/lite-vimeo-embed/+esm"></script>
<lite-vimeo videoid="357274789" playlabel="Play video"></lite-vimeo>
```

CSS ships inside the JS (unlike lite-youtube’s separate stylesheet). No TypeScript types.

## Social / platform coverage

**Vimeo only.** Embeds `player.vimeo.com/video/{id}`. No YouTube, playlists-as-API, privacy/nocookie host variant (Vimeo has no YT-style nocookie twin), or opaque `params` string for player flags (`muted`, `loop`, `title=0`, etc.).

Related (not this package): author’s [playerx](https://github.com/luwes/playerx); conceptual sibling [`@slightlyoff/lite-vimeo`](https://www.npmjs.com/package/@slightlyoff/lite-vimeo) (Shadow DOM take). npm reports ~1 dependent.

## SSR, hydration, lazy-load

| Concern | Behavior |
|---------|----------|
| Import-time CSS inject | **Unguarded `document.head`** at module top → throws in Node/SSR (`document is not defined`) before soft CE guards run |
| Soft SSR guards | `HTMLElement ?? class {}` and `if (customElements && !get('lite-vimeo'))` — insufficient; module still not SSR-importable |
| Progressive enhancement | Documented: inline poster + `<a class="ltv-playbtn" href="vimeo.com/…">` (`variants/pe.html`); non-JS users can follow the link |
| Noscript iframe | **None** (lite-youtube injects one; this port does not) |
| Lazy load | Facade **is** the lazy strategy — no `IntersectionObserver`, no `loading="lazy"` on the eventual iframe |
| Attribute reactivity | None — connect-once |

Contrast `simple-svelte-embeds`: real `<iframe>` in SSR HTML, `loading="lazy"` default (`src/Embed.svelte` / `src/Vimeo.svelte`); no client fetch required to paint.

## Privacy, a11y, iframe attrs

### Privacy

- **Always-on network before click:** every instance hits `https://vimeo.com/api/v2/video/{id}.json` on connect (unless PE poster is enough and you somehow skip JS — but JS always fetches when connected).
- **CORS:** v2 endpoint historically returns `Access-Control-Allow-Origin: *` (browser fetch OK from any origin); rate-limit headers observed by research agents (`x-ratelimit-limit: 3600`). Still a third-party request + failure mode for private/deleted videos.
- **Poster history:** early custom Now.sh thumb proxy → `api.playerx.io/oembed` → **0.3.0** switched to Vimeo API directly (“starting to cost me” — CHANGELOG). Shows poster-proxy cost is a recurring tax.
- **Preconnect on intent only:** `player.vimeo.com`, `i.vimeocdn.com`, `f.vimeocdn.com`, `fresnel.vimeocdn.com` — reasonable critical path; fresnel is metrics (milder privacy smell than lite-youtube’s DoubleClick preconnects).
- **No privacy-enhanced embed host** option (N/A for Vimeo the same way as YT nocookie).

### A11y

- Auto-created real `<button type="button">` with `aria-label` from play label.
- PE `<a>` loses `href` on connect (becomes non-link control); **no** Enter/Space remapping like current lite-youtube PE path — activation is host `click` only (button still gets native activation if clicked).
- iframe `title` = play label (not a distinct video title).
- Focus moved to iframe after `load`.
- Play button uses `outline: 0` in CSS — focus ring suppressed (regression risk).

### iframe attributes

| Attr | Value |
|------|--------|
| `width` / `height` | `640` / `360` (CSS fills) |
| `title` | play label |
| `allow` | `accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture` |
| `allowFullscreen` / `allowfullscreen` | **not set** |
| `referrerpolicy` | **not set** |
| `src` | `https://player.vimeo.com/video/{id}?autoplay=1` only |

Our `Vimeo.svelte` defaults `allow="autoplay; fullscreen; picture-in-picture"` and inherits Embed’s `referrerpolicy="strict-origin-when-cross-origin"` + `allowfullscreen`.

## Packaging & footprint

| Artifact | Size (approx.) |
|----------|----------------|
| `lite-vimeo-embed.js` | **7,445 B** raw · ~3.1 KB gzip (includes ~1.4 KB CSS string) |
| npm tarball | ~4.4 KB packed · **~10.3 KB** unpacked · **3 files** |
| Published files | `lite-vimeo-embed.js`, `package.json`, `readme.md` |

- `"type": "module"`, `"main": "lite-vimeo-embed.js"`, `"files": []` (npm still ships main + readme).
- No `exports`, no `sideEffects` field, no min build, **0** runtime deps / peer deps.
- No build step — publish raw JS (same spirit as our publish-`src/` plan, wrong shape for Svelte).
- Provenance / SLSA attestations present on npm for `0.3.0`.

Activation cost after click: full Vimeo player document from `player.vimeo.com` (not counted in package size). Pre-click cost: API JSON + thumbnail image from `i.vimeocdn.com`.

## Strengths

1. **Faithful lite-youtube port for Vimeo** — familiar facade UX, tiny zero-dep ESM, CDN-friendly.
2. **Modern CSS `aspect-ratio: 16 / 9`** — better than classic padding-bottom hacks (aligns with our DESIGN.md).
3. **Intent-only preconnect** to player/CDN origins — lowers click-to-play latency without always loading the player.
4. **DPR-aware thumbnail sizing** + CDN-friendly rounding (`getThumbnailDimensions`) — thoughtful poster engineering given Vimeo has no free `i.ytimg.com`-style pattern.
5. **A11y basics** — real button, aria-label, focus iframe on load.
6. **Progressive-enhancement demo** — inline poster + link-to-Vimeo before script runs.
7. **Id encoding** — `encodeURIComponent(videoId)` in iframe URL.
8. **Extremely small published surface** — one file, no toolchain.

## Weaknesses / anti-patterns

1. **Hard dependency on Vimeo API v2 for posters** — not zero-network; silent failure (no `.catch`); private/rate-limited/offline → black box; couples to an old public JSON API.
2. **Import-time `document.head` CSS injection** — breaks SSR imports despite soft `HTMLElement`/`customElements` guards (false sense of safety).
3. **Missing `allowfullscreen` and `referrerpolicy`** — weaker than lite-youtube / our Embed defaults.
4. **No `params` / player query surface** — only hard-coded `autoplay=1`; can’t mute, hide title, loop, etc. without forking.
5. **No noscript / crawler iframe path** — PE link helps humans without JS; SEO embed discoverability weaker than lite-youtube.
6. **No `focusin` warm** — only `pointerover` (keyboard users miss preconnect).
7. **Play `outline: 0`** and iframe title = play label — a11y polish incomplete.
8. **Dead CSS** — `.ltv-activated::before` referenced but no default `::before` gradient (leftover from YT port).
9. **Dormant package + license-file gap** — last release late 2023; MIT only in package.json; small adoption (~1k/wk vs lite-youtube ~96k/wk).
10. **CE + global CSS** — wrong packaging model for a Svelte component library.

## Steal for simple-svelte-embeds

Aligned with `docs/DESIGN.md` (facade is optional later, not v1 default):

| Idea | Why |
|------|-----|
| Keep CSS `aspect-ratio` (already) | Confirmed good by this port vs padding hacks |
| `encodeURIComponent(id)` in Vimeo URLs (already) | Same hygiene as lite-youtube/lite-vimeo |
| Keep SSR real iframe + `loading="lazy"` as v1 | Avoid their API poster + CE SSR gap |
| **Optional later:** click-to-load Vimeo facade | Poster + play → `player.vimeo.com/video/{id}?autoplay=1` |
| **Optional later:** caller-supplied `poster` prop | Prefer PE/author poster over runtime API fetch |
| **Optional later:** intent preconnect | Warm `player.vimeo.com` (+ maybe `i.vimeocdn.com` / `f.vimeocdn.com`) on hover/**focus** — skip or gate fresnel metrics |
| Focus iframe after facade activate | A11y polish |
| Real `<button>` play control + accessible name | Prefer over div/`role="button"` |
| PE link-to-vimeo.com when facade ships | Non-JS fallback without requiring API |

If a facade needs a default poster without caller input, prefer **documenting** Vimeo’s thumbnail URL patterns / oEmbed as an **author-time** concern (or optional server helper), not a required client `fetch` in the component.

## Avoid

| Pattern | Why |
|---------|-----|
| Client `fetch` to `vimeo.com/api/v2/video/{id}.json` as required path | Network, privacy, silent failures, private-video gaps; DESIGN.md forbids oEmbed/thumbnail HTTP as required runtime |
| Top-level / import-time CSS injection into `document.head` | Breaks SSR; global style leaks |
| Shipping `<lite-vimeo>` CE as our public API | Wrong model for Svelte publish-`src/` lib |
| Omitting `allowfullscreen` / sensible `referrerpolicy` | We already do better on Embed |
| Hard-coding only `?autoplay=1` with no escape hatch | If facade ships, allow optional query/`params` or props |
| Treating soft `HTMLElement ?? class {}` as “SSR-safe” | Their module still touches `document` at import |
| Making facade the v1 default | Our v1 is SSR iframe; facade is opt-in later |
| Depending on this package | Zero-dep goal; dormant; license file missing |

## Sources

### Primary (read for this report)

- https://github.com/luwes/lite-vimeo-embed — `lite-vimeo-embed.js`, `package.json`, `readme.md`, `CHANGELOG.md`, `variants/pe.html`, `index.html`
- https://raw.githubusercontent.com/luwes/lite-vimeo-embed/main/lite-vimeo-embed.js
- https://www.npmjs.com/package/lite-vimeo-embed (v0.3.0)
- https://registry.npmjs.org/lite-vimeo-embed
- https://registry.npmjs.org/lite-vimeo-embed/-/lite-vimeo-embed-0.3.0.tgz
- https://api.npmjs.org/downloads/point/last-week/lite-vimeo-embed
- https://api.npmjs.org/downloads/point/last-month/lite-vimeo-embed
- https://api.github.com/repos/luwes/lite-vimeo-embed
- https://github.com/luwes/lite-vimeo-embed/issues/31 (missing LICENSE file)
- https://github.com/luwes/lite-vimeo-embed/commit/1c033d24f57961da41d02aa95cd037b643e644a5 (switch to Vimeo API directly)

### External context

- https://github.com/paulirish/lite-youtube-embed (parent / inspiration)
- https://github.com/luwes/playerx (author “more power” upsell)
- https://developer.vimeo.com/api/oembed (official oEmbed; not used by this package)
- https://developer.vimeo.com/player/sdk/embed
- https://web.dev/third-party-facades/

### Local context

- `docs/COMPETITORS.md` (matrix + Candidate 4 summary)
- `docs/DESIGN.md` (goals / steal-avoid)
- `docs/reports/lite-youtube-embed.md` (sibling deep dive)
- `src/Vimeo.svelte`, `src/Embed.svelte` (our SSR iframe baseline)
