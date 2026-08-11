# sveltekit-embed

Deep research for informing `simple-svelte-embeds`. Research date: 2026-08-10. License is MIT (permissive — patterns may be learned; do not paste large verbatim code). Closest Svelte multi-provider competitor.

Package lives in a monorepo under `packages/sveltekit-embed/`. Inspired by [MDX Embed](https://github.com/pauliescanlon/mdx-embed) (credited in README).

## Snapshot (license, version, weekly downloads if known, peers/deps, package size)

| Field | Value |
|-------|--------|
| Package | [`sveltekit-embed@0.0.22`](https://www.npmjs.com/package/sveltekit-embed) |
| Repo | [`spences10/sveltekit-embed`](https://github.com/spences10/sveltekit-embed) · package path `packages/sveltekit-embed/` |
| License | MIT (`LICENSE`, copyright Scott Spence 2024) |
| Author | Scott Spence |
| Published | 2025-05-26 (npm `0.0.22`); first publish 2022-05-02 |
| Runtime deps | **none** |
| Peer deps | `svelte: ^4.0.0 \|\| ^5.0.0` |
| Engines | `node >= 18` |
| npm downloads | ~1.6k/week (npm package page badge / stats, 2026-08-10) |
| Unpacked size | **45 044 bytes** (~44 KB), **49 files** (`npm view … dist`) |
| Publish model | `files: ["dist"]` via `@sveltejs/package` (`svelte-package` + `publint`) |
| Exports | `"."` → `types: ./dist/index.d.ts`, `svelte: ./dist/index.js` |
| Positioning | Kitchen-sink SvelteKit-branded embed collection with IntersectionObserver lazy-load |
| vs us | Many providers + IO gate + `dist/` publish vs our thin `Embed` + YouTube/Vimeo, SSR iframes, `src/` publish, privacy/`referrerpolicy` defaults |

## Architecture

**Layout** (`packages/sveltekit-embed/src/lib/`):

| Path | Role |
|------|------|
| `index.ts` | Public barrel — default-exports every component |
| `components/*.svelte` | Provider components (+ co-located Vitest files) |
| `utils/index.ts` | Sole helper: `getPadding(aspectRatio)` → `padding-top` CSS |

**Typical video/audio embed tree:**

```
YouTube | Vimeo | Spotify | TikTok | …
  └─ GeneralObserver          ← IntersectionObserver gate
       └─ size / padding wrapper
            └─ <iframe>
```

**Shared primitives**

- **`GeneralObserver`** (`components/general-observer.svelte`) — lazy gate. Props: `threshold` (default `0.5`), `disable_observer` (default `false`), `children` snippet. Uses Svelte 5 `$props` / `$state` / `$effect`, `fade` transition on load. SSR guard: `typeof IntersectionObserver !== 'undefined'`. Until `loaded`, children are **not** rendered (empty `<div>` shell). When `disable_observer`, children render immediately.
- **`GenericEmbed`** (`components/generic-embed.svelte`) — thin `src` + `title` + `width`/`height` + `...rest` iframe inside `GeneralObserver`. Validates the “primitive + providers” split (same idea as our `Embed`).
- **Provider components** — build provider-specific URLs/query flags, wrap most of them with `GeneralObserver`.

**Who wraps `GeneralObserver`**

- **Yes:** AnchorFm, Buzzsprout, CodePen, Deezer, GenericEmbed, Gist, Guild, Relive, SimpleCast, Slides, SoundCloud, Spotify, StackBlitz, TikTok, Vimeo, YouTube.
- **No:** Tweet (`platform.twitter.com/widgets.js`), Toot (`{instance}/embed.js` + iframe), Bluesky (iframe + `postMessage` resize), Zencastr (injects `embed-player.js` on mount).

README claims only Toot/Tweet skip the observer — **incomplete**; Bluesky and Zencastr also skip it. Bluesky/TikTok are exported from `index.ts` but omitted from the README platform table.

**Utils** (`utils/index.ts`): maps `'1:1' | '16:9' | '4:3' | '3:2' | '8.5'` → `padding-top` percentages. Key `'8.5'` looks like a typo for `'8:5'`. Used only by YouTube and Vimeo. No URL builders, ID parsers, or `encodeURIComponent` helpers.

**Stack:** Svelte 5 runes in source; peer range still includes Svelte 4. No `$app/*` imports in library components — Kit branding is packaging/docs, not a hard Kit dependency. Astro + `@astrojs/svelte` is therefore plausible despite the name.

## Public API surface (list components + notable props)

Barrel exports from `src/lib/index.ts` (21 components):

| Component | File | Notable props / notes |
|-----------|------|------------------------|
| `AnchorFm` | `anchor-fm.svelte` | Podcast episode URL path |
| `Bluesky` | `bluesky.svelte` | `post_id`, `width`, `iframe_styles`; no observer |
| `Buzzsprout` | `buzzsprout.svelte` | Podcast embed |
| `CodePen` | `code-pen.svelte` | `codePenId`, `height`, `tabs`/`defaultTab`, `clickToLoad`, `editable`, `theme`, `disable_observer` |
| `Deezer` | `deezer.svelte` | Music embed |
| `GeneralObserver` | `general-observer.svelte` | `threshold`, `disable_observer`, children |
| `GenericEmbed` | `generic-embed.svelte` | `src`, `title`, `height`=`152px`, `width`=`100%`, `disable_observer`, `...rest` |
| `Gist` | `gist.svelte` | `gistUri` → `gist.github.com/{uri}.pibb` iframe |
| `Guild` | `guild.svelte` | Guild.xyz |
| `Relive` | `relive.svelte` | Activity summaries |
| `SimpleCast` | `simple-cast.svelte` | Podcast |
| `Slides` | `slides.svelte` | Slide decks |
| `SoundCloud` | `sound-cloud.svelte` | `soundcloudLink`, `showVisual`, sizes |
| `Spotify` | `spotify.svelte` | `spotifyLink` (`track/…`, `album/…`, `playlist/…`) |
| `StackBlitz` | `stackblitz.svelte` | Live coding IDE |
| `TikTok` | `tiktok.svelte` | `tiktokId` + many UI/query flags; height default `600px` |
| `Toot` | `toot.svelte` | `instance`, `username`, `tootId`; no observer |
| `Tweet` | `tweet.svelte` | `tweetLink`, `theme` `'light'\|'dark'`; widgets.js |
| `Vimeo` | `vimeo.svelte` | `vimeoId`, `autoPlay`, `aspectRatio`=`'16:9'`, `skipTo`, `disable_observer` |
| `YouTube` | `you-tube.svelte` | `youTubeId`, `listId`, `index`, `autoPlay`, `aspectRatio`, `skipTo`, mute/controls/loop/modestBranding/rel, `disable_observer`, `iframe_styles` |
| `Zencastr` | `zencastr.svelte` | Podcast; client script inject |

**YouTube query pattern:** host always `https://www.youtube-nocookie.com/embed/…`; booleans passed as `Number(boolean)`; playlist via `?videoseries&list=…` when `youTubeId` empty.

**Vimeo:** `https://player.vimeo.com/video/{id}?autoplay=…#t=…`.

**Types:** README shows `import type { YouTubeProps }` — barrel does **not** re-export named prop types; consumers rely on generated `.svelte.d.ts` from `svelte-package`.

## Social / platform coverage (map to our todo.md platforms)

| Our todo platform | sveltekit-embed? | Component / pattern |
|-------------------|------------------|---------------------|
| Generic | Yes | `GenericEmbed` — iframe + observer |
| YouTube | Yes | `YouTube` — nocookie iframe + observer |
| Vimeo | Yes | `Vimeo` — iframe + observer |
| Facebook | **No** | — |
| Instagram | **No** | — |
| X (Twitter) | **Yes** | `Tweet` — blockquote + `widgets.js` (not iframe-first) |
| TikTok | **Yes** | `TikTok` — `tiktok.com/player/v1/{id}` iframe + observer |
| LinkedIn | **No** | — |
| Bluesky | **Yes** | `Bluesky` — `embed.bsky.app/embed/{post_id}` iframe, no observer, `postMessage` height |
| Mastodon / Toot | **Yes** | `Toot` — iframe + `{instance}/embed.js` |
| Threads | **No** | — |
| Pinterest | **No** | — |
| Reddit | **No** | — |
| Tumblr | **No** | — |
| Spotify | **Yes** | `Spotify` — `open.spotify.com/embed/…` |
| SoundCloud | **Yes** | `SoundCloud` — `w.soundcloud.com/player/` |
| Twitch | **No** | — |
| CodePen | **Yes** | `CodePen` |
| GitHub Gist | **Yes** | `Gist` — `.pibb` iframe (avoids gist.js) |

**Also present (outside our priority table):** AnchorFm, Buzzsprout, Deezer, SimpleCast, Zencastr, Guild, Relive, Slides, StackBlitz.

**Gap vs our social priority (Facebook, Instagram, X):** they have X only, and via widgets.js — not a thin iframe. Meta platforms and LinkedIn/Threads are open white space for us if iframe endpoints exist.

## SSR, hydration, lazy-load

| Topic | Behavior |
|-------|----------|
| Default SSR HTML | Empty `general-observer` shell — **no iframe** when observer enabled |
| Hydration | Client creates `IntersectionObserver` in `$effect`; iframe appears after `intersectionRatio >= threshold` |
| `disable_observer={true}` | Children (iframe + ratio box) present in SSR path |
| Threshold / rootMargin | Default `0.5`, `rootMargin: '0px'` |
| Pre-intersect layout | Ratio/height wrappers live **inside** children → no reserved space until load → **CLS risk** |
| IO missing | If `IntersectionObserver` undefined and observer enabled → children never render |
| Native `loading="lazy"` | **Not used** on iframes |
| Noscript / crawler fallback | **None** |
| Tweet | Blockquote + “Loading Tweet…” link can SSR; script via `$effect.root` is client-only |
| Toot | Iframe `src` can SSR; instance `embed.js` loads in `$effect` |
| Bluesky | Iframe present without observer (loads immediately); height updated client-side |

**Implication for us:** Their “performant lazy-load” is an empty-until-IO pattern. Our approach (SSR iframe + `loading="lazy"` + CSS `aspect-ratio`) is the clearer SSR-safe / Astro-friendly default. Offer optional facade/observer later if needed — do not make empty SSR the default.

## Privacy, a11y, iframe attrs

**Privacy wins**

- YouTube always uses **`youtube-nocookie.com`** (no cookie-host toggle in their API).
- Most providers defer third-party network until viewport intersection.
- Gist uses `.pibb` iframe instead of `gist.js`.

**Privacy / tracker concerns**

- **Tweet** injects full `platform.twitter.com/widgets.js` — highest tracker surface; no observer.
- **Toot** loads instance `embed.js` in addition to iframe.
- **Zencastr** injects third-party player script.
- Bluesky/TikTok/Spotify/etc. are still third-party iframes (expected), but no privacy-enhanced alternate hosts beyond YouTube.

**iframe attrs (YouTube)** — `title={`youTube-${id}`}`, `frameborder="0"`, `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"`, `allowfullscreen`. Absolute positioning over padding-top box; stringly `iframe_styles` (default border-radius).

**iframe attrs (Vimeo)** — `title={`vimeo-${id}`}`, `allow="autoplay; fullscreen; picture-in-picture"`, `allowFullScreen`.

**Common gaps vs our `Embed` defaults**

| Attribute | sveltekit-embed | simple-svelte-embeds |
|-----------|-----------------|----------------------|
| `loading` | absent | default `'lazy'` |
| `referrerpolicy` | absent | default `'strict-origin-when-cross-origin'` |
| `sandbox` | absent | absent (same) |
| `title` | generated from id, or empty (`Toot` uses `title=""`) | caller-supplied preferred |
| ID encoding | no `encodeURIComponent` | YouTube uses `encodeURIComponent(id)` |
| Aspect ratio | `padding-top` map (`'16:9'`) | CSS `aspect-ratio` (`'16 / 9'`) |

## Packaging & footprint

| Field | Value |
|-------|--------|
| Publish | `dist/` only — compiled by `svelte-package`; tests stripped |
| Source in tarball | No `src/` (opposite of our `files: ["src"]`) |
| Size | ~44 KB unpacked / 49 files — small despite many providers |
| Peer | Svelte 4 **or** 5 (broader than our `^5` only) |
| Runtime deps | none (aligned with us) |
| Entry | Single barrel only — no per-component `exports` map |
| Types | Generated `.d.ts` beside `.svelte` in `dist/` |
| Tooling | Vite + SvelteKit demo app, Vitest unit tests, Playwright integration, publint |
| Branding | Name/docs say “SvelteKit”; lib code itself is framework-agnostic Svelte |

**Footprint note:** Kitchen-sink surface still lands small on npm because each component is a thin `.svelte` file. Cost is API surface and maintenance, not tarball weight. Our `src/` publish strategy is better for Astro/Svelte consumers who want to compile with their own toolchain and tree-shake by file import.

## Strengths

- Zero runtime deps; `svelte` as peer only; Svelte 4+5 range.
- Clear **primitive + providers** split (`GeneralObserver`, `GenericEmbed`) matching our `Embed` model.
- YouTube **nocookie** default and a solid default `allow` / `allowfullscreen` set.
- `disable_observer` escape hatch when SSR-visible iframes are required.
- Small published footprint (~44 KB) despite ~20 providers.
- Simple URL flag pattern (`Number(boolean)` / `URLSearchParams` 0/1).
- TikTok / Bluesky / Spotify / SoundCloud / CodePen / Gist iframe recipes are useful references for our `todo.md` “later” rows.
- Gist via `.pibb` iframe keeps script out of the path — aligned with zero-runtime-deps.
- Co-located unit tests for most components (Vitest) — quality bar we can match selectively.
- No `$app` coupling — works outside SvelteKit despite branding.

## Weaknesses / anti-patterns

- **Empty-until-IO default** — not SSR-safe for SEO; CLS; zero-height observer + `threshold: 0.5` is fragile.
- **`$effect` IntersectionObserver as the only lazy strategy** — heavier and less predictable than native `loading="lazy"` on an SSR’d iframe.
- **Padding-top aspect-ratio map** — obsolete vs CSS `aspect-ratio`; typo key `'8.5'`; unknown ratios yield broken layout.
- **Kitchen-sink providers** including script widgets (Tweet, Toot, Zencastr) — fights “minimal iframe wrappers” and zero-tracker defaults.
- **Prefixed ID props** (`youTubeId`, `vimeoId`, `tiktokId`) — noisier than `id` on a namespaced component.
- **Missing `referrerpolicy` / `loading` / ID encoding** — weaker privacy and robustness than lite-youtube-class best practice (and than our current `Embed`).
- **README drift** — observer exceptions incomplete; Bluesky/TikTok missing from platform table; prop-type imports oversold.
- **Stringly `iframe_styles`** — encourages inline style soup over CSS vars / class props.
- **Publish `dist/` + Kit branding** — opposite of our Astro-friendly `src/` positioning.
- **Toot empty `title=""`** — a11y miss.
- **Tweet widgets.js** — acceptable for full fidelity, but wrong default for a privacy-first thin lib.

## Steal for simple-svelte-embeds

Ideas only — reimplement, do not copy code.

- Keep **primitive + thin provider** split (`Embed` / `GenericEmbed` pattern) as the core API.
- Keep **YouTube nocookie as default**; optionally expose a cookie-host toggle (we already have `privacyEnhanced`).
- When adding Spotify / SoundCloud / CodePen / TikTok / Gist: prefer **documented iframe endpoints** (including Gist `.pibb`) over platform scripts.
- For TikTok: study `player/v1/{id}` + boolean query flags as a thin wrapper on `Embed`.
- For Bluesky: study `embed.bsky.app/embed/{post_id}` + optional `postMessage` height protocol; still SSR the iframe.
- For Mastodon: instance-scoped `/embed` URL shape; prefer iframe-only if possible; treat `embed.js` as optional/`blocked` for zero-deps.
- Offer an **escape hatch** analogous to `disable_observer` if we ever add IO/facade — but default to SSR iframe.
- Boolean → query (`0`/`1` or `Number(boolean)`) is a fine, tiny URL builder convention.
- Consider **playlist / list** support on YouTube later (`list` / `videoseries`) without bloating v1.
- Ship co-located smoke tests for URL construction (id → `src`) as providers grow.
- Peer-range decision: they support Svelte 4+5; we can stay Svelte 5-only intentionally, or widen later.

## Avoid

- Making **IntersectionObserver-gated empty markup** the default for “SSR-safe” embeds.
- **Padding-top ratio hacks** and string ratio maps with typo-prone keys.
- **Kitchen-sink** podcast/niche providers before core social (Facebook, Instagram, X).
- Shipping **widgets.js / embed.js** paths in a zero-runtime-deps, privacy-default library (mark `blocked` or optional facade package later).
- Prefixed props like `youTubeId` when the component is already `YouTube`.
- Stringly `iframe_styles` as the primary customization API — prefer `class`, CSS vars, and standard iframe attrs.
- Relying on README marketing (“improves CWV”) without reserving layout space or providing noscript/SSR fallbacks.
- Assuming “SvelteKit” in the name implies Kit-only APIs — and conversely, don’t brand ourselves as Kit-only if we want Astro.

## Sources (URLs)

- https://www.npmjs.com/package/sveltekit-embed
- https://github.com/spences10/sveltekit-embed
- https://raw.githubusercontent.com/spences10/sveltekit-embed/main/LICENSE
- https://raw.githubusercontent.com/spences10/sveltekit-embed/main/packages/sveltekit-embed/package.json
- https://raw.githubusercontent.com/spences10/sveltekit-embed/main/packages/sveltekit-embed/README.md
- https://raw.githubusercontent.com/spences10/sveltekit-embed/main/packages/sveltekit-embed/src/lib/index.ts
- https://raw.githubusercontent.com/spences10/sveltekit-embed/main/packages/sveltekit-embed/src/lib/utils/index.ts
- https://raw.githubusercontent.com/spences10/sveltekit-embed/main/packages/sveltekit-embed/src/lib/components/general-observer.svelte
- https://raw.githubusercontent.com/spences10/sveltekit-embed/main/packages/sveltekit-embed/src/lib/components/generic-embed.svelte
- https://raw.githubusercontent.com/spences10/sveltekit-embed/main/packages/sveltekit-embed/src/lib/components/you-tube.svelte
- https://raw.githubusercontent.com/spences10/sveltekit-embed/main/packages/sveltekit-embed/src/lib/components/vimeo.svelte
- https://raw.githubusercontent.com/spences10/sveltekit-embed/main/packages/sveltekit-embed/src/lib/components/tweet.svelte
- https://raw.githubusercontent.com/spences10/sveltekit-embed/main/packages/sveltekit-embed/src/lib/components/toot.svelte
- https://raw.githubusercontent.com/spences10/sveltekit-embed/main/packages/sveltekit-embed/src/lib/components/bluesky.svelte
- https://raw.githubusercontent.com/spences10/sveltekit-embed/main/packages/sveltekit-embed/src/lib/components/tiktok.svelte
- https://api.github.com/repos/spences10/sveltekit-embed/contents/packages/sveltekit-embed/src/lib/components
- Our platform tracker: `docs/todo.md`
- Matrix summary: `docs/COMPETITORS.md`
