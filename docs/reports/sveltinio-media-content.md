# @sveltinio/media-content

Deep dive vs **simple-svelte-embeds** (Svelte 5 runes, zero runtime deps).  
Research date: 2026-08-10. License MIT — patterns OK to learn from; do not copy non-permissive code.

## Snapshot

| Field | Value |
|--------|--------|
| **npm** | [`@sveltinio/media-content@0.4.3`](https://www.npmjs.com/package/@sveltinio/media-content) |
| **Published** | 2023-10-01 (last publish; package created 2022-04-06) |
| **Repo** | [`sveltinio/components-library`](https://github.com/sveltinio/components-library) → `packages/media-content` |
| **License** | MIT |
| **Homepage** | https://components.sveltin.io |
| **Peer** | `svelte: ^3.59.2 \|\| ^4.0.0` — **no Svelte 5** |
| **Runtime dep** | `@sveltinio/ts-utils@^0.8.0` → transitive `neverthrow@^6` |
| **Unpacked** | ~57 KB (47 files); util package alone ~149 KB unpacked |
| **Adoption** | Very low (~20 weekly downloads via npm API, week of 2026-08-03) |
| **Positioning** | Broad “type-safe media embeds” kit (YT/Vimeo + Tweet/FB/CodePen/…) with click-to-play facades |

**Vs us:** They optimize for typed player `settings` + kitchen-sink providers on Svelte 3/4. We optimize for a tiny Svelte 5 surface (`YouTube` / `Vimeo` / `Embed`), privacy-default iframe, and zero deps.

## Architecture

Monorepo package built with `@sveltejs/package` → publishes `dist/`. Components use classic Svelte 3/4 APIs (`export let`, `$:`, `onMount`, `createEventDispatcher`, `svelte:component`, `$$restProps`).

**Layering:**

1. **Provider components** (`YouTube`, `Vimeo`, …) — build base embed URL + `settings` → query string; choose Thumbnail vs IFrame.
2. **Primitives** — shared `Thumbnail` (poster + play button) and `IFrame` (aspect-ratio wrapper + iframe attrs).
3. **`makeSettingsString(opts, callback?)`** — generic object→`key=value&…` builder; providers pass a `matchersCallback` for rename/validate/special cases.
4. **`@sveltinio/ts-utils`** — string/is/url/color/collection helpers (Result-style via neverthrow), not media-specific.

**YouTube / Vimeo control flow (facade):**

- Default (video, no `settings.autoplay`): render `Thumbnail`.
- On play event → set `play=true`, force `autoplay=1&mute=1` onto URL, swap to `IFrame`.
- Playlist / `user_uploads` (YouTube) or `settings.autoplay` → skip facade, iframe immediately.

**Vimeo extras:** attribution links under the player; `onMount` injects `player.vimeo.com/api/player.js` even though the Player API is never used afterward (dead network cost).

## Public API surface

**Root exports** (`src/lib/index.ts`):  
`CodePen`, `CodeSandbox`, `Facebook`, `SlideShare`, `StackBlitz`, `IFrame`, `Thumbnail`, `Tweet`, `Vimeo`, `YouTube`.

**Subpath exports:** `./youtube`, `./vimeo`, `./basic`, … plus direct `./components/*.svelte`. Types live at `./types` (not re-exported from main index).

### YouTube

| Prop | Notes |
|------|--------|
| `type` | `'video' \| 'playlist' \| 'user_uploads'` (default `video`) |
| `id` | required |
| `title` | required (no default) |
| `username` | for `user_uploads` |
| `settings` | `IYouTubeSettings` (autoplay, controls, loop, modestbranding, playlist, start, …) |

Base hosts: always `https://www.youtube.com/embed/...` — **no nocookie option**.

### Vimeo

| Prop | Notes |
|------|--------|
| `id` | required |
| `user`, `title`, `description` | attribution / copy |
| `settings` | `IVimeoSettings` (autoplay, muted, dnt, color, quality, …) |

Base: `https://player.vimeo.com/video/${id}`.

### Primitives

- **`Thumbnail`:** `id`, `provider`, `iframeURL`, `title`, `buttonColor` (parents don’t wire `buttonColor`).
- **`IFrame`:** `id`, `iframeURL`, `title`, `...$$restProps`.

### Settings → query builder

```ts
makeSettingsString(opts, callback?) // Object.keys → joined "&"
```

YouTube `matchersCallback` highlights:

- Booleans → `key=0|1` (**raw camelCase key** for bools — does not snake_case `ccLoadPolicy` etc.).
- Strings → `camelToSnake(key)=value` via ts-utils.
- `loop` special-case: `playlist=${id}&loop=1` for single-video loop.
- `playlist` string normalized with comma helpers.

Vimeo callback validates `quality` whitelist and hex `color` (strips `#`).

**Type bug:** `IYouTubeSettings.start` is typed `boolean` but docs/YouTube API say seconds (`number`).

## Social / platform coverage

| Component | Mechanism |
|-----------|-----------|
| **YouTube** | iframe + thumbnail facade |
| **Vimeo** | iframe + facade + unused Player.js + attribution |
| **Tweet** | `widgets.js` + `twttr.widgets.createTweet` (client-only) |
| **Facebook** | FB SDK + `fb-post` / `fb-video` divs |
| **CodePen** | official embed markup + `ei.js` |
| **CodeSandbox** | own iframe |
| **StackBlitz** | own iframe + sandbox attrs |
| **SlideShare** | own iframe + attribution |

Far broader than our v1 (YouTube / Vimeo / generic Embed only). Most non-video providers require third-party scripts — fights a zero-dep iframe lib.

## SSR, hydration, lazy-load

- **YT/Vimeo facade:** Thumbnail (img + button) is SSR-friendly static markup; iframe appears only after click (or when autoplay / non-video type).
- **No IntersectionObserver** — lazy = click-to-load, not viewport-gated.
- **Script-backed embeds** (Tweet, Facebook, CodePen, Vimeo Player.js): `onMount` only → empty/placeholder until hydrate.
- No Kit-only APIs / `ssr = false` exports; ordinary library components.
- Aspect box uses **padding-bottom** hack (`--aspect-ratio` default `0.5625`), not CSS `aspect-ratio`.

## Privacy, a11y, iframe attrs

**Privacy**

- YouTube: **`youtube.com` only** — no privacy-enhanced / nocookie host.
- Vimeo: optional `settings.dnt` → `dnt=1`.
- Thumbnails: `i.ytimg.com` (YouTube) and **third-party** `vumbnail.com` (Vimeo) — extra privacy/CDN dependency.
- Thumbnail `img` uses `referrerpolicy="no-referrer"`.

**a11y**

- `title` required on YouTube; used as img `alt` (fallback: iframe URL string).
- Play control is a real `<button>` with SVG; **no `aria-label`** (relies on `font-size: 0` + visible SVG — weak name).
- SlideShare copy-paste bug: aria-labels say “Vimeo website”.

**IFrame defaults**

```
allow="layout-animations 'none'; unoptimized-images 'none'; …; autoplay; fullscreen; picture-in-picture"
referrerpolicy="same-origin"
```

Unusual Permissions-Policy-style tokens mixed with feature allowlist. `same-origin` referrer differs from the lite-youtube / our default `strict-origin-when-cross-origin` (Error 153 mitigation). No `loading="lazy"` (iframe only post-click in facade path). No `allowfullscreen` attribute separate from allow string.

**Facade activate quirks**

- Forces `mute=1` on click-to-play (YouTube-correct for autoplay policies).
- Vimeo path also appends `mute=1`, but Vimeo’s documented param is typically `muted` — settings path uses `muted` correctly; facade path may mismatch.

## Packaging & footprint

| Item | Detail |
|------|--------|
| Publish | `dist/` via svelte-package; strips component README md from tarball |
| `sideEffects` | not declared |
| Package size | ~15 KB packed / ~57 KB unpacked |
| Effective deps | + `@sveltinio/ts-utils` (~149 KB) + `neverthrow` (~112 KB) before tree-shaking |
| Source size | ~1.5k LOC under `src/lib`; `types.ts` alone ~444 lines of JSDoc interfaces |
| Maintenance | Last publish Oct 2023; peer stuck on Svelte 3/4 |

**ts-utils usage (actual imports):**  
`is` (`isDefined`, `isEmpty`, `isBool`), `strings` (`camelToSnake`, `camelToKebab`, comma helpers, `removeFirstOccurrence`), `urls` (`isUrl`), `colors` (`isHex`, `getHexValue`), `collections` (`contains`). For YouTube/Vimeo alone this is replaceable with a few lines of stdlib — the util dep is justified mainly by the wider provider pack and Result-typed helpers.

## Strengths

- **Required `title`** on YouTube — good a11y default.
- **Click-to-play facade** since 0.3.0 — real third-party deferral (stronger than `loading="lazy"` alone).
- **Typed `settings` objects** mirroring official player params — solid DX for power users.
- **Shared `makeSettingsString` + matcher callbacks** — clean settings→query pattern.
- **Primitives split** (`Thumbnail` / `IFrame`) — reusable composition.
- **Playlist / user_uploads** YouTube modes beyond single-video embeds.
- **Vimeo `dnt`** exposed as a first-class settings flag.
- MIT, tests (vitest + testing-library) around URL build and click→iframe.

## Weaknesses / anti-patterns

- **No Svelte 5** — `export let` / `$:` / event dispatcher era; blocked for modern apps without forking.
- **Hard dep on ts-utils → neverthrow** for string/is helpers — footprint and coupling vs zero-dep goal.
- **Default `youtube.com`** — privacy-hostile vs nocookie competitors and our `privacyEnhanced` default.
- **Kitchen-sink providers** + third-party SDKs (Tweet/FB/CodePen/Vimeo Player.js) — bloat and script injection.
- **Dead Vimeo Player.js load** — network cost with no API usage.
- **Vumbnail.com** for Vimeo posters — third-party dependency / failure mode.
- **Padding-top aspect ratio** — obsolete vs CSS `aspect-ratio`.
- **Boolean query keys stay camelCase** for YouTube — can emit invalid params (`ccLoadPolicy=1` vs `cc_load_policy=1`).
- **`start?: boolean` type error**; SlideShare a11y string bug; Vimeo facade `mute` vs `muted`.
- **`referrerpolicy="same-origin"`** — not aligned with current YouTube embed best practice.
- **Near-zero adoption / stale publish** — not a moving target, but also not battle-tested at scale.

## Steal for simple-svelte-embeds

Aligned with DESIGN.md; keep implementations zero-dep and Svelte 5:

1. **Settings → query string builder** — small pure function: booleans as `0|1`, always snake_case keys for YouTube, special-case `loop` → `playlist=id`. Optional later `params` / `settings` prop — not v1 required.
2. **Click-to-load facade (later)** — `Thumbnail` + play button → iframe with `autoplay=1` (+ mute as needed); poster `i.ytimg.com/vi/{id}/hqdefault.jpg` (or maxres with fallback). Prefer optional `facade` prop / separate component, not the default.
3. **Require / strongly encourage `title`** — they make it required; we should keep pushing callers to pass it.
4. **Shared Embed primitive** — same idea as their `IFrame` + our existing `Embed` composition.
5. **Vimeo `dnt` as an optional boolean** if/when we add Vimeo query params — privacy-friendly without a util package.
6. **Mute on gesture-activated autoplay** — matches browser autoplay policies when a facade ships.

## Avoid

1. **Svelte 3/4 APIs** — stay on `$props` / `$derived`; no `createEventDispatcher` (use callback props).
2. **`@sveltinio/ts-utils` / neverthrow / any util runtime dep** — inline the few string helpers if needed.
3. **Defaulting to `youtube.com`** — keep `privacyEnhanced = true` / nocookie.
4. **Kitchen-sink social embeds** (Tweet, Facebook, CodePen, …) — out of v1 scope; script SDKs violate zero-deps.
5. **Injecting unused Player APIs** (Vimeo Player.js pattern).
6. **Third-party thumbnail CDNs** (vumbnail) or required oEmbed/API poster fetches — caller-supplied poster or first-party CDN only.
7. **Padding-bottom aspect hacks** — use CSS `aspect-ratio`.
8. **Odd `allow` / `referrerpolicy="same-origin"` defaults** — keep our `strict-origin-when-cross-origin` and sensible allow lists.
9. **Making facade the only/default path in v1** — DESIGN already chooses SSR iframe + `loading="lazy"` first.
10. **Copying their type bugs / camelCase bool query emission** — if we add settings, snake_case consistently and type `start` as number.

## Sources

- npm: https://www.npmjs.com/package/@sveltinio/media-content (`0.4.3`, registry metadata 2026-08-10)
- npm: https://www.npmjs.com/package/@sveltinio/ts-utils (`0.8.0`, dep `neverthrow@^6`)
- Repo: https://github.com/sveltinio/components-library (`packages/media-content`)
- Local clone reviewed (HEAD of main at research time):  
  `packages/media-content/package.json`, `src/lib/index.ts`, `types.ts`, `utils.ts`,  
  `components/youtube/YouTube.svelte`, `components/vimeo/Vimeo.svelte`,  
  `components/basic/IFrame.svelte`, `components/basic/Thumbnail.svelte`
- Our lib: `docs/DESIGN.md`, `docs/COMPETITORS.md`, `src/YouTube.svelte`
- YouTube player params: https://developers.google.com/youtube/player_parameters  
- Vimeo embed params: https://developer.vimeo.com/player/sdk/embed  
- Facade guidance: https://web.dev/third-party-facades/
