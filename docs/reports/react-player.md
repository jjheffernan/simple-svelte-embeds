# react-player

Deep-dive competitor research for [simple-svelte-embeds](../../README.md). Contrast only — do not copy architecture. Research date: **2026-08-10**.

## Snapshot

| Field | Value |
|-------|--------|
| Package | [`react-player`](https://www.npmjs.com/package/react-player) `@3.4.0` |
| License | **MIT** |
| Repo | [cookpete/react-player](https://github.com/cookpete/react-player) |
| Role | Multi-provider **media player** (URL → playable media + imperative API) |
| Weekly downloads | ~2.25M |
| Dependents | ~1.5k |
| Peers | `react` / `react-dom` ^17–19 |
| Runtime deps | **10** Mux-style media packages (YouTube/Vimeo/… custom elements, HLS, DASH, Mux) |
| Maintenance | Taken over by [Mux](https://www.mux.com); README points to [next-video](https://github.com/muxinc/next-video) |
| vs us | Opposite product: player + SDKs vs zero-dep SSR iframe embeds |

Canonical DX:

```jsx
import ReactPlayer from 'react-player'
<ReactPlayer src="https://www.youtube.com/watch?v=LXb3EKWsInQ" />
```

## Architecture

v3 is a thin React shell over an ordered **provider registry** and Mux **media custom elements**. It is not an iframe-embed kit.

### Entry & shell

- `src/index.ts` — `"use client"`; `createReactPlayer(players, htmlFallback)`.
- `src/ReactPlayer.tsx` — factory: match URL → active player; wrap in `Suspense`.
- `src/Player.tsx` — syncs `playing` / `volume` / `pip` onto an HTMLMediaElement-shaped ref.
- `src/Preview.tsx` — optional `light` click-to-load facade.
- `src/HtmlPlayer.tsx` — native `<video>` / `<audio>` fallback (eager, not lazy).
- Published surface: `dist/` only (`exports`: `.` and `./*`). Package tarball ~40KB unpacked; install with deps is huge (see Packaging).

### Registry & URL → player

`src/players.ts` order (first `canPlay(src)` wins):

1. `hls` → `hls-video-element/react`
2. `dash` → `dash-video-element/react`
3. `mux` → `@mux/mux-player-react`
4. `youtube` → `youtube-video-element/react`
5. `vimeo` → `vimeo-video-element/react`
6. `wistia` → `wistia-video-element/react`
7. `spotify` → `spotify-audio-element/react`
8. `twitch` → `twitch-video-element/react`
9. `tiktok` → `tiktok-video-element/react`
10. `html` → local `HtmlPlayer`

Matchers live in `src/patterns.ts` (YouTube including `youtube-nocookie.com` / Shorts / Live, Vimeo, Mux, Spotify, Twitch, TikTok, Wistia, file extensions, `.m3u8`, `.mpd`). Unmatched URLs still render via HTML fallback when playing; `ReactPlayer.canPlay(src)` returns false if nothing matches.

Extensibility: `ReactPlayer.addCustomPlayer` / `removeCustomPlayers`.

### Dependency graph

| Layer | Packages |
|-------|----------|
| Peer | `react`, `react-dom`, `@types/react` |
| Direct | `@mux/mux-player-react`, `hls-video-element`, `dash-video-element`, `youtube-video-element`, `vimeo-video-element`, `wistia-video-element`, `spotify-audio-element`, `twitch-video-element`, `tiktok-video-element`, `cloudflare-video-element` |
| Transitive (notable) | `hls.js`, `dashjs`, `@vimeo/player`, YouTube IFrame API (runtime script), etc. |

**Orphan:** `cloudflare-video-element` is a hard dependency but **not** registered in `players.ts` / `patterns.ts`.

**v2 → v3:** v2 loaded provider SDKs more ad hoc (`load-script`, etc.) and offered selective imports (`react-player/youtube`, `react-player/lazy`). v3 hard-depends on Mux media-elements and lazy-loads them with `React.lazy` by default; **no** published per-provider entry points.

### iframe vs custom elements vs SDKs

| Provider | Mechanism |
|----------|-----------|
| YouTube, Vimeo, Twitch, TikTok, Spotify, Wistia | Custom elements wrapping **iframe** + often official JS API |
| HLS / DASH | Custom `<video>`-like elements + **hls.js** / **dash.js** |
| Mux | Official `<mux-player>` |
| File | Native `<video>` / `<audio>` |

So v3 is a **media-element facade + provider SDKs**, not thin static iframes.

### Lazy loading

- Every provider except `HtmlPlayer` uses `React.lazy(() => import(/* webpackChunkName: 'reactPlayer…' */ '…'))`.
- Shell uses `<Suspense fallback={fallback}>` (`fallback={false}` disables).
- Lazy = **bundle code-split**, not optional npm packages — all 10 deps still install.
- No `IntersectionObserver` in the package.
- Separate UX: `light` prop = click-to-load preview before mounting the real player.

## Public API surface

### Props (high signal)

| Prop | Role |
|------|------|
| `src` | Media URL (**v3 rename from `url`**) |
| `playing`, `controls`, `muted`, `loop`, `volume`, `playbackRate`, `pip` | Playback control |
| `preload`, `playsInline`, `crossOrigin`, `disableRemotePlayback` | Media attribute passthrough |
| `width` / `height` | Defaults `320px` / `180px` |
| `light` | `true` \| image URL \| React node — thumbnail until click |
| `fallback` | Suspense fallback |
| `wrapper` | Optional container (default: none) |
| `playIcon`, `previewTabIndex`, `previewAriaLabel`, `oEmbedUrl` | Light mode |
| `config` | Per-provider bag (`config.youtube`, `.vimeo`, `.hls`, …) |
| children | `<source>` / `<track>` like HTML media |

Callbacks align to HTMLMediaElement naming: `onReady`, `onStart`, `onPlay`, `onPlaying`, `onProgress`, `onTimeUpdate`, `onDurationChange`, `onPause`, `onWaiting`, `onSeeking`, `onSeeked`, `onRateChange`, `onEnded`, `onError`, PiP enter/leave, `onClickPreview`.

### Static / imperative

- `ReactPlayer.canPlay(src)`, `addCustomPlayer`, `removeCustomPlayers`
- Ref aims at **HTMLMediaElement**-compatible API (`play` / `pause` / volume / rate / PiP)

### URL-in multi-provider design

Single component + registry is the whole product thesis: paste any supported URL, get the right player. That convenience is what consumers love — and what pulls in the SDK graph.

## Social / platform coverage

react-player is a **media player**, not a social-post embed library. Compared to our [`docs/todo.md`](../todo.md) platforms:

| Our platform | react-player v3.4.0 | Notes |
|--------------|---------------------|-------|
| YouTube | **yes** | CE + YouTube IFrame API; nocookie if URL contains it |
| Vimeo | **yes** | CE + `@vimeo/player` |
| Facebook | **no** | v2 only; listed as not ported in `MIGRATING.md` |
| Instagram | **no** | Never |
| X / Twitter | **no** | Never |
| TikTok | **yes** | `tiktok-video-element` |
| LinkedIn | **no** | Never |
| Bluesky | **no** | Never |
| Mastodon | **no** | Never |
| Threads | **no** | Never |
| Pinterest | **no** | Never |
| Reddit | **no** | Never |
| Tumblr | **no** | Never |
| Spotify | **yes** | `spotify-audio-element` |
| SoundCloud | **no** | v2 only |
| Twitch | **yes** | In `players.ts` (note: `MIGRATING.md` still lists Twitch as missing — stale) |
| CodePen | **no** | Never |
| GitHub Gist | **no** | Never |

**Score vs our list:** 5 yes · 13 no.

### Extras we don’t track (player-centric)

- Wistia, Mux, HLS (`.m3u8`), DASH (`.mpd`), HTML5 file URLs
- **v2-only (dropped from v3):** SoundCloud, Facebook, Streamable, DailyMotion, Mixcloud, Vidyard, Kaltura

README “Supported media” under-documents Spotify / Twitch / TikTok; **source of truth** is `src/players.ts` + `src/patterns.ts`.

## SSR, hydration, lazy-load

| Topic | Behavior |
|-------|----------|
| SSR | Client-oriented (`"use client"`). Suspense typically renders `fallback` (default `null`), not a real iframe. |
| Hydration | Real player mounts client-side after lazy chunk + provider SDK/CE. |
| Light mode | Preview first; full player after click. Thumbnails via **noembed.com** `useEffect` fetch when `light={true}`. |
| Viewport lazy | **None** — no IO; only React.lazy + optional light facade. |
| Next.js | Common pattern: `dynamic(..., { ssr: false })` (community issues historically emphasize empty/meaningless SSR). |

Contrast with us: we SSR a real `<iframe>` with `loading="lazy"` ([`Embed.svelte`](../../src/Embed.svelte)).

## Privacy, a11y, iframe attrs

### Privacy

- YouTube **nocookie** only when `src` already uses a nocookie host / path — **not** the default for normal `youtube.com` watch URLs.
- Vimeo DNT exists as a player config flag, not a first-class ReactPlayer privacy prop.
- Light mode phones **third-party noembed.com** for thumbnails (network + privacy surface).

### a11y / iframe attrs

- Light preview: `tabIndex` (default 0), optional `previewAriaLabel`, Enter/Space — preview is a `<div>`, not a native `<button>`.
- Downstream YouTube CE sets `allow` (accelerometer, fullscreen, autoplay, encrypted-media, gyroscope, picture-in-picture); optional `config.referrerpolicy`.
- **No** library-level defaults for iframe `title`, `loading="lazy"`, or `referrerpolicy="strict-origin-when-cross-origin"` (we already ship all three on `Embed`).
- Vimeo `config.title` is player chrome, not an accessible iframe name.

## Packaging & footprint

| Metric | Value |
|--------|--------|
| Version researched | **3.4.0** (published 2025-11-13) |
| Unpacked package | ~40KB (`dist` only) |
| Install with deps | Very large in practice (hls.js + dash.js + Mux dominate disk) |
| Module format | ESM (`"type": "module"`) |
| Tree-shaking intent | `sideEffects` limited to tests; React.lazy chunks if bundler splits |
| Selective imports | **Gone in v3** (v2 had `react-player/youtube`, etc.) |
| Hard deps | All providers install even if you only play YouTube |

## Strengths

- Best-in-class **URL-in, one-component** DX and enormous adoption.
- Clean **registry + matcher + custom player** extension model.
- HTMLMediaElement-shaped **imperative API** and event names across providers.
- Default **code-split** providers + optional **`light`** click-to-load are good patterns *for a player library*.
- Mux media-elements + Media Chrome path for unified chrome.
- Broad **file / HLS / DASH / Mux** coverage beyond social embeds.

## Weaknesses / anti-patterns

- Enormous **transitive install** for “show a YouTube iframe.”
- Client/SDK-first → weak SSR, empty LCP without care, hydration friction.
- Hard deps on every provider; dead `cloudflare-video-element` dep.
- Privacy/a11y iframe defaults weaker than lite-youtube / our `Embed`.
- oEmbed (noembed) as light-mode path = required network + third party.
- Kitchen-sink multi-provider **player** scope fights “simple embed.”
- v3 dropped several social/media providers (Facebook, SoundCloud, …) pending rewrite — coverage is media-file oriented, not social-feed oriented.
- Stale docs: README vs `players.ts`; `MIGRATING.md` vs Twitch re-added.

## Steal for simple-svelte-embeds

Ideas only — keep zero runtime deps and no player SDKs ([DESIGN.md](../DESIGN.md)).

1. **URL → provider matching** — optional later helper that routes by host (`patterns.ts` style) into `YouTube` / `Vimeo` / `Embed`; never load SDKs.
2. **Ordered registry + generic fallback** — same shape as our “primitive + providers” split; fallback is plain iframe `src`, not HTML5 video.
3. **`light` / click-to-load facade** — optional later `facade` prop/component; prefer **caller-supplied or static poster URLs** over oEmbed.
4. **Accept nocookie hosts in matchers** — we already default `privacyEnhanced`; matchers should recognize both hosts if we add URL-in helpers.
5. **`config` as query-param bag** — map booleans to embed search params, not SDK option objects.
6. **HTML-ish prop naming** (`src`, `playsInline`) — stay lean; do not grow a full player event surface.
7. **TikTok / Spotify / Twitch as later iframe targets** — react-player proves demand; we only add them when a public embed iframe URL exists without scripts ([todo.md](../todo.md)).

## Avoid

- Shipping **player SDKs**, custom elements, Mux stack, hls.js, dash.js.
- Any **non-empty runtime `dependencies`** graph like react-player’s 10 media packages.
- Treating **React.lazy of SDKs** as “SSR-safe embeds.”
- **Required oEmbed** for titles/thumbnails.
- Single mega-component that is both embed and full imperative player API.
- Defaulting YouTube to cookie host; omitting `title` / `loading` / `referrerpolicy`.
- Chasing react-player’s social gaps with widgets.js / plugin scripts — those stay `blocked` until a thin iframe path exists.
- Copying v2 kitchen-sink providers (Facebook player, SoundCloud SDK, etc.) into v1.

**Verdict:** react-player is a best-in-class multi-provider *media player*. simple-svelte-embeds should stay a best-in-class *iframe embed* library — steal URL ergonomics and optional facade UX; do not steal the architecture, deps, or imperative player surface.

## Sources

- https://www.npmjs.com/package/react-player (v3.4.0 metadata, deps, downloads)
- https://github.com/cookpete/react-player
- https://raw.githubusercontent.com/cookpete/react-player/master/README.md
- https://raw.githubusercontent.com/cookpete/react-player/master/package.json
- https://raw.githubusercontent.com/cookpete/react-player/master/MIGRATING.md
- https://raw.githubusercontent.com/cookpete/react-player/master/src/index.ts
- https://raw.githubusercontent.com/cookpete/react-player/master/src/players.ts
- https://raw.githubusercontent.com/cookpete/react-player/master/src/patterns.ts
- https://raw.githubusercontent.com/cookpete/react-player/master/src/Preview.tsx
- https://github.com/muxinc/media-elements (underlying `*-video-element` packages)
- https://api.npmjs.org/downloads/point/last-week/react-player
- Local contrast: [`docs/todo.md`](../todo.md), [`docs/DESIGN.md`](../DESIGN.md), [`docs/COMPETITORS.md`](../COMPETITORS.md), [`src/Embed.svelte`](../../src/Embed.svelte)
