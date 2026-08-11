# lite-youtube-embed

Deep research for informing `simple-svelte-embeds`. Research date: 2026-08-10. License is Apache-2.0 (permissive — patterns may be learned; do not paste large verbatim code).

## Snapshot

| Field | Value |
|-------|--------|
| Package | [`lite-youtube-embed@0.3.4`](https://www.npmjs.com/package/lite-youtube-embed) |
| Repo | [`paulirish/lite-youtube-embed`](https://github.com/paulirish/lite-youtube-embed) |
| License | Apache-2.0 (`LICENSE`) |
| Author | Paul Irish |
| Runtime deps | **none** |
| API shape | Custom element `<lite-youtube>` + companion CSS |
| Stars / forks | ~6.3k / ~295 (GitHub API, 2026-08-10) |
| npm downloads | ~96.5k/week · ~390k/month |
| Positioning | Third-party **facade**: poster + play control first; real YouTube player only after user intent |
| vs us | Client CE + click-to-load vs our SSR iframe Svelte components (`YouTube` → `Embed`) |

Claims ~224× faster first paint than a normal YouTube iframe embed (`readme.md`). Demo: https://paulirish.github.io/lite-youtube-embed/

## Architecture

Single class `LiteYTEmbed extends HTMLElement` registered as `lite-youtube` in `src/lite-yt-embed.js`. Styles live in `src/lite-yt-embed.css` (light DOM; no Shadow DOM — contrast `justinribeiro/lite-youtube`).

**Lifecycle (`connectedCallback`):**

1. Read `videoid`; resolve play label from child `.lyt-playbtn` text, else `playlabel`, else `"Play"`.
2. Optional visible overlay title via `title` → `dataset.title` (CSS `::before { content: attr(data-title) }`).
3. Poster: if no inline `background-image`, set `hqdefault.jpg` from `i.ytimg.com`, then deferred WebP upgrade (`upgradePosterImage`).
4. Ensure a play control (`button` or PE `<a class="lyt-playbtn">`); add visually hidden label span if needed.
5. Inject `<noscript>` with a basic iframe string (`addNoscriptIframe`) for crawler discoverability.
6. PE: if play control is an `<a>`, strip `href`, set `role="button"` / `tabindex="0"`, Enter/Space → `activate()`.
7. Warm connections once on `pointerover` / `focusin`.
8. Click → `activate()`.
9. Decide iframe vs YT IFrame API path (`needsYTApi`).

**Activate (`activate`):**

- Guard with class `lyt-activated` (CSS hides poster chrome / play button).
- If `needsYTApi`: load `https://www.youtube.com/iframe_api`, `new YT.Player(...)`, `playVideo()` on `onReady`.
- Else: `createBasicIframe()` → append → `iframe.focus()`.

**Basic iframe URL:** always `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?…` with `autoplay=1` and `playsinline=1` merged into `params` (`getParams`).

**CSS layout:** padding-bottom aspect box `calc(100% / (16 / 9))` on `::after`; absolute-positioned iframe; play SVG as `background-image` on `.lyt-playbtn`; `contain: content`; `max-width: 720px`.

## Public API surface

### HTML attributes / markup

| Surface | Role |
|---------|------|
| `videoid` | Required video id |
| `playlabel` | Accessible name for play control / iframe `title` fallback |
| `title` | Optional visible title overlay (`data-title`) |
| `params` | Query string of YouTube player parameters (e.g. `controls=0&start=10`) |
| `js-api` | Force YT IFrame API path; enables `getYTPlayer()` |
| Child `.lyt-playbtn` / `.lty-playbtn` | Custom play control; PE uses `<a href="https://youtube.com/watch?v=…">` |
| Inline `style.background-image` | Custom poster; skips default + upgrade |

Mis-spelling `lty-playbtn` still supported (issue #65).

### JS methods

| Method | Notes |
|--------|------|
| `activate()` | Swap facade → player (idempotent via `lyt-activated`) |
| `getYTPlayer()` | Public; awaits activate, returns YT Player instance (opt-in / API path) |
| `LiteYTEmbed.warmConnections()` | Static; preconnect helper |
| `LiteYTEmbed.addPrefetch()` | Static; appends `<link rel=…>` |

No TypeScript types shipped. No framework bindings in-package (ecosystem ports listed in `readme.md`).

### Consumed CSS / JS (consumer must include both)

```html
<link rel="stylesheet" href="…/lite-yt-embed.css" />
<script src="…/lite-yt-embed.js"></script>
<lite-youtube videoid="…" playlabel="…"></lite-youtube>
```

## Social / platform coverage

**YouTube only.** No Vimeo, playlists-as-first-class API, Shorts helper, or multi-provider router. Playlist / start / modestbranding etc. only via opaque `params` string. Always embeds via privacy-enhanced host `youtube-nocookie.com` (basic path); API path loads scripts from `youtube.com`.

Related ecosystem (not this package): React ports, Astro community embed (depends on this CE), Vue lazy wrappers — see `readme.md` “Other fast YouTube embeds”.

## SSR, hydration, lazy-load

| Concern | Behavior |
|---------|----------|
| Custom element | Client-only upgrade; without JS you get unstyled/`unknown` element unless PE markup is used |
| Progressive enhancement | Recommended pattern: poster as `background-image` + `<a class="lyt-playbtn" href="watch?v=…">` so non-JS users navigate to YouTube (`readme.md`, `variants/pe.html`) |
| Noscript iframe | Always injected in `connectedCallback` via `noscript.innerHTML = iframe.outerHTML` (not `appendChild`) so crawlers see an embed without activating the facade ([#105](https://github.com/paulirish/lite-youtube-embed/issues/105); WHATWG `noscript` quirk) |
| Lazy load | Facade itself is the lazy strategy — **no** `IntersectionObserver`, no native `loading="lazy"` on the eventual iframe |
| SSR frameworks | Not designed as an SSR component; Astro wrappers SSR PE markup then hydrate the CE |

Contrast `simple-svelte-embeds`: real `<iframe>` in HTML for SSR/crawlers, `loading="lazy"` default (`src/Embed.svelte`).

## Privacy, a11y, iframe attrs

### Privacy

- **Default host:** `youtube-nocookie.com` (`createBasicIframe`, `readme.md` privacy note).
- **Poster:** `i.ytimg.com` (and optional `vi_webp`) — network before click, but not the full player.
- **Error 153 / Referer:** iframe sets `referrerPolicy = 'strict-origin-when-cross-origin'` with explicit comment “Required by Youtube to fix Error 153” (`createBasicIframe`; shipped in [v0.3.4](https://github.com/paulirish/lite-youtube-embed/releases/tag/v0.3.4) via [PR #203](https://github.com/paulirish/lite-youtube-embed/pull/203)). YouTube requires embedders to identify via HTTP `Referer`; overly strict page policies (`same-origin`, `no-referrer`) suppress it and break playback. Nocookie does **not** replace this requirement.
- **Preconnect tension:** on intent, also preconnects `www.google.com`, `googleads.g.doubleclick.net`, `static.doubleclick.net` — source admits ad hosts may not be critical path; undercuts “privacy until click.”
- **API path privacy regression:** loads `youtube.com/iframe_api` (~1KB + ~165KB un-br sequential scripts per in-file comment).

### A11y

- Real `<button type="button">` when auto-created; visually hidden label (`.lyt-visually-hidden`).
- PE `<a>` remapped to keyboard-activatable button semantics.
- iframe `title` set from play label (not a separate video title attr).
- Focus moved to iframe after basic-path activate.
- Visible `title` attribute is cosmetic overlay, not the iframe accessible name.

### iframe attributes (basic path)

| Attr | Value |
|------|--------|
| `width` / `height` | `560` / `315` (CSS overrides to fill) |
| `allow` | `accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture` (no `clipboard-write` / `web-share`) |
| `allowFullscreen` | `true` |
| `referrerPolicy` | `strict-origin-when-cross-origin` |
| `src` | nocookie embed + `autoplay=1&playsinline=1` (+ `params`) |

Our `Embed.svelte` already defaults the same referrer policy and a slightly richer `allow` string (adds `clipboard-write; web-share`).

## Packaging & footprint

| Artifact | Size (approx.) |
|----------|----------------|
| `src/lite-yt-embed.js` | ~10.6 KB raw · ~4.0 KB gzip |
| `src/lite-yt-embed.css` | ~2.8 KB raw · ~1.3 KB gzip |
| Combined (gzip of both) | ~5.2 KB |
| npm tarball unpacked | ~20.6 KB, 5 files, **0 deps** |

- `package.json`: `"main": "src/lite-yt-embed.js"`, `"style": "src/lite-yt-embed.css"` — ships **source**, no build step (same spirit as our publish-`src/` plan).
- No ESM/CJS dual package; classic script + global `customElements.define`.
- No peer deps (framework-agnostic CE).

Activation cost on Apple/`Mobi`/`js-api`: additional YouTube IFrame API payload (~166 KB class, sequential) — not counted in package size.

## Strengths

1. **De-facto facade reference** — widely adopted, tiny zero-dep surface, cited by web.dev third-party facades guidance.
2. **Fast first paint** — poster + SVG play chrome; defers heavy YT player until gesture.
3. **Privacy-enhanced embed host by default** + documented Error 153 `referrerpolicy` fix.
4. **Thoughtful PE story** — link-to-YouTube markup, noscript iframe for indexability, deferred script OK.
5. **Poster engineering** — reliable `hqdefault` first, low-priority WebP upgrade with 120×90 fake-404 detection (`youtube-thumbnail-urls.md`).
6. **Connection warmup on intent** — reduces click-to-play latency without always-on player.
7. **A11y basics** — real button / remapped PE control, focus management, play labels.
8. **Opt-in player API** via `js-api` + `getYTPlayer()` for apps that need seek/state.

## Weaknesses / anti-patterns

1. **Auto-sniffed YT API path** — `needsYTApi` true for all Apple vendor and `Mobi` UAs, not only `js-api`. Heavy, hits `youtube.com`, incomplete iOS double-tap fix historically ([#6](https://github.com/paulirish/lite-youtube-embed/issues/6), [#109](https://github.com/paulirish/lite-youtube-embed/pull/109)); open reports that forcing API on modern mobile can **break** playback while plain iframe works ([#200](https://github.com/paulirish/lite-youtube-embed/issues/200)).
2. **DoubleClick / googleads preconnects** — privacy smell for a “lite / privacy-friendly” facade.
3. **Hard-coded 16:9 padding hack** — no Shorts/`9/16`, no CSS `aspect-ratio`.
4. **CE + global CSS packaging** — awkward for Svelte/SSR component libraries; consumers must remember both assets.
5. **No Shadow DOM** — styles leak; class typos (`lyt`/`lty`) forever.
6. **iframe `title` = play label** — conflates control name with media title; weak vs requiring a real video title.
7. **Always-on noscript iframe construction in JS** — only helps after CE connects; true no-JS SEO still depends on author PE markup.
8. **YouTube-only** — not a multi-provider embed primitive.

## Steal for simple-svelte-embeds

Aligned with `docs/DESIGN.md` (many already adopted):

| Idea | Why |
|------|-----|
| Keep `privacyEnhanced` → `youtube-nocookie.com` | Matches their default host |
| Keep `referrerpolicy="strict-origin-when-cross-origin"` | Error 153 / YT Referer identity ([PR #203](https://github.com/paulirish/lite-youtube-embed/pull/203)); document that page-level `same-origin`/`no-referrer` can still break embeds |
| `encodeURIComponent(id)` in embed URLs | XSS/URL hygiene |
| **Optional later:** click-to-load facade | Poster `i.ytimg.com/vi/{id}/hqdefault.jpg`, play control, swap to nocookie iframe with `autoplay=1&playsinline=1` |
| **Optional later:** intent-only preconnect | Warm **`youtube-nocookie.com` only** (and maybe `i.ytimg.com`) on hover/focus — not DoubleClick |
| **Optional later:** PE / noscript when facade ships | Real watch link or `<noscript>` iframe for crawlers/no-JS |
| Poster upgrade heuristics | hqdefault first; optional webp with naturalWidth 120×90 rejection (`youtube-thumbnail-urls.md`) |
| Focus iframe after facade activate | A11y polish |
| Play control as real `<button>` + accessible name | Prefer over `role="button"` on divs |

## Avoid

| Pattern | Why |
|---------|-----|
| YouTube IFrame API / `getYTPlayer` as default or UA-sniffed path | Conflicts with zero-dep, privacy defaults, and DESIGN.md non-goals; flaky sniff ([#200](https://github.com/paulirish/lite-youtube-embed/issues/200)) |
| Shipping a custom element + injected/global CSS as our public API | Wrong packaging for a Svelte component library |
| DoubleClick / ads preconnects | Undercuts privacy-until-intent story |
| Padding-bottom 16:9-only box | Prefer CSS `aspect-ratio` (we already do) |
| Making facade the v1 default | Our v1 is SSR iframe + `loading="lazy"`; facade is optional later |
| Relying on client-only CE for SEO | We SSR a real iframe; don’t copy their SSR gap |
| Using play-label as the only iframe `title` | Encourage caller-supplied video `title` |

## Sources

### Primary (read for this report)

- https://github.com/paulirish/lite-youtube-embed — `src/lite-yt-embed.js`, `src/lite-yt-embed.css`, `readme.md`, `LICENSE`, `package.json`, `youtube-thumbnail-urls.md`
- https://www.npmjs.com/package/lite-youtube-embed (v0.3.4, downloads)
- https://github.com/paulirish/lite-youtube-embed/releases/tag/v0.3.4
- https://github.com/paulirish/lite-youtube-embed/pull/203 (Error 153 referrerPolicy)
- https://github.com/paulirish/lite-youtube-embed/issues/105 (noscript discoverability)
- https://github.com/paulirish/lite-youtube-embed/issues/6 · https://github.com/paulirish/lite-youtube-embed/pull/109 · https://github.com/paulirish/lite-youtube-embed/issues/200 (API / mobile gesture path)
- https://github.com/paulirish/lite-youtube-embed/pull/164 (`getYTPlayer` / js-api)

### External context

- https://web.dev/third-party-facades/
- https://developers.google.com/youtube/iframe_api_reference
- https://developers.google.com/youtube/player_parameters
- https://developers.google.com/youtube/terms/required-minimum-functionality#embedded-player-api-client-identity
- https://support.google.com/youtube/answer/171780 (Privacy Enhanced Mode / embed help)
- https://simonwillison.net/2025/Dec/1/youtube-embed-153-error/
- https://html.spec.whatwg.org/multipage/scripting.html#the-noscript-element

### Local context

- `docs/COMPETITORS.md` (matrix + Candidate 2 summary)
- `docs/DESIGN.md` (goals / steal-avoid)
- `src/YouTube.svelte`, `src/Embed.svelte` (our SSR iframe baseline)
