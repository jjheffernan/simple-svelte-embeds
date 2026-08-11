# svelte-youtube-embed

Deep dive for **simple-svelte-embeds** competitor research.  
Research date: **2026-08-10**. License MIT (repo + npm). Version analyzed: **0.4.6** (published 2025-09-13).

## Snapshot

| Field | Value |
|-------|--------|
| npm | [`svelte-youtube-embed@0.4.6`](https://www.npmjs.com/package/svelte-youtube-embed) |
| Repo | [sharu725/youtube-embed](https://github.com/sharu725/youtube-embed) |
| Demo | https://embed.sveltethemes.dev/ |
| License | MIT (`LICENSE.md` in tarball; © 2022–2025 Webjeda) |
| Weekly downloads | **961** (2026-08-03 → 2026-08-09) |
| GitHub | **50★**, 12 forks, last push **2025-09-13** |
| Open tracker | 6 issues + 2 PRs (`open_issues_count` 8) |
| Footprint | Packed **~5.1 KB**; unpacked **~18.4 KB**; **13** files |
| Runtime deps | `svelte: ^5.15.0` as a **dependency** (no `peerDependencies`) |
| Scope | **YouTube only** (plus Shorts aspect via `short`) |
| Model | Click-to-load **facade**: thumbnail → gesture → nocookie iframe |

Closest Svelte peer to our “simple embed” niche, but productized as a **facade** (poster + play), not an SSR’d iframe wrapper. Our lib’s wedge is zero runtime deps, peer-only Svelte, multi-provider thin iframes, and no required network for metadata.

## Architecture

Published tree is `dist/` only (plus LICENSE/README/package.json). Four Svelte components; only `Youtube` is re-exported:

```
Youtube.svelte     ← public default export; orchestrator
├── Image.svelte   ← default poster or `thumbnail` snippet
├── .b__overlay    ← full-area click / keypress → play
├── .v__title      ← oEmbed title text overlay
├── Button.svelte  ← default SVG play or `play_button` snippet
└── Iframe.svelte  ← mounted only when play === true
```

**Facade flow**

1. `play = $state(false)` on mount.
2. SSR/client initially render: aspect-ratio box + thumb + overlay + title (empty until oEmbed) + play button.
3. Overlay click/`onkeypress` or play button → `play = true`.
4. Facade unmounts; `Iframe` mounts with `?autoplay=1&rel=0`.
5. Optional `in:scale` transition on the iframe (`animations` prop).

**State / Svelte 5**

| Mechanism | Use |
|-----------|-----|
| `$props()` | `id`, `altThumb`, `animations`, `short`, snippets |
| `$state` | `play`, `title` |
| `$bindable()` | `play` on `Button` |
| `onMount` | oEmbed fetch (client-only) |
| Snippets | `thumbnail`, `play_button` via `{@render}` |
| Transitions | `svelte/transition` `scale` on iframe |
| Events / stores / context | none |

Internal helpers (`Iframe`, `Image`, `Button`) ship in the tarball but are **not** public exports (`dist/index.js` default-exports `Youtube` only).

**oEmbed**

```js
onMount(async () => {
  const res = await fetch(
    `//www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
  );
  videoInfo = await res.json();
  title = videoInfo?.title;
});
```

- Protocol-relative `//www.youtube.com/oembed…`
- Uses **`title` only**
- No `res.ok`, try/catch, abort, or timeout
- Known Firefox CORS reports: [issue #12](https://github.com/sharu725/youtube-embed/issues/12)
- Contacts **cookie YouTube** even though the player uses **nocookie**

**Thumbnail strategy**

| Mode | URL / behavior |
|------|----------------|
| Default | `https://i.ytimg.com/vi/{id}/maxresdefault.jpg` |
| `altThumb={true}` | `…/hqdefault.jpg` |
| Custom | `{#snippet thumbnail()}…{/snippet}` |
| maxres → hq fallback | **None** (blank/broken if maxres missing) |
| Thumb `referrerpolicy` | `no-referrer` on default `<img>` |

## Public API surface

**Import**

```js
import Youtube from "svelte-youtube-embed";
```

**Props**

| Prop | Default | Role |
|------|---------|------|
| `id` | `null` | YouTube video id |
| `altThumb` | `false` | Prefer `hqdefault` over `maxresdefault` |
| `animations` | `true` | `in:scale` on iframe |
| `short` | `false` | `--aspect-ratio: 9/16` + cover crop |
| `thumbnail` | — | Snippet for custom poster |
| `play_button` | — | Snippet for custom play UI |

No caller-supplied `title` prop — title is always oEmbed-driven (or `""`). Open request to hide title: [issue #14](https://github.com/sharu725/youtube-embed/issues/14).

**Snippets (Svelte 5)** — not legacy slots in source. README/npm still mention `slot="thumbnail"` in places; live demo uses snippets. Custom `play_button` is rendered **inside** a `<button>`, so consumers who put a `<button>` in the snippet nest interactive elements.

**CSS custom properties**

| Variable | Default / notes |
|----------|-----------------|
| `--aspect-ratio` | Set inline to `16/9` or `9/16` |
| `--title-font-family` | `"Segoe UI", Geneva, Verdana, sans-serif` |
| `--title-color` | `#ffffff` |
| `--title-shadow-color` | `rgb(0, 0, 0, 0.2)` |
| `--overlay-transition` | `all 250ms ease-in-out` |
| `--overlay-bg-color` | `#00000030` (hover) |

**Callbacks / events** — none (`onplay`, activation hooks, etc. absent).

**`exports`**

```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "svelte": "./dist/index.js"
  }
}
```

Types exist but are soft (`id?: any`, snippets typed loosely). No `default`/`import` conditions beyond `svelte` + `types`.

## Social / platform coverage

| Surface | Supported? |
|---------|------------|
| YouTube watch id → embed | Yes |
| YouTube Shorts aspect (`short`) | Yes (layout only; still a normal embed id) |
| Playlists / `list=` | No |
| URL-in (parse watch/shorts URL) | No — id string only |
| Vimeo / other providers | No |
| Cookie vs nocookie toggle | No — always nocookie for iframe |
| Player API / postMessage | No |

Single-provider facade library. Not a multi-embed kit like `sveltekit-embed`.

## SSR, hydration, lazy-load

| Phase | Markup |
|-------|--------|
| SSR | Facade: aspect-ratio container, poster `<img>` (or snippet), overlay, empty title, play button. **No iframe.** |
| Hydration | Same facade |
| Client `onMount` | oEmbed → fills title |
| After click | Iframe injected |

| Technique | Present? |
|-----------|----------|
| IntersectionObserver | No |
| `loading="lazy"` on img | No |
| `loading="lazy"` on iframe | No (iframe only post-click) |
| Preconnect / dns-prefetch | No |
| `<noscript>` iframe / PE link | No |

SSR is LCP-friendly for the poster URL, but title is client-only, and crawlers never see an iframe without executing activation JS. Contrasts with our v1 design: real SSR iframe + native `loading="lazy"`.

## Privacy, a11y, iframe attrs

**Hosts**

| Surface | Host |
|---------|------|
| Player iframe | `https://www.youtube-nocookie.com/embed/{id}?autoplay=1&rel=0` |
| oEmbed | `www.youtube.com` (cookies domain) |
| Thumbnail | `i.ytimg.com` |

Privacy story is mixed: nocookie player, but every mount hits cookie YouTube for title.

**Iframe attributes (exact from `Iframe.svelte`)**

```html
<iframe
  src="https://www.youtube-nocookie.com/embed/{id}?autoplay=1&rel=0"
  {title}
  frameborder="0"
  allow="autoplay; picture-in-picture; clipboard-write"
  allowfullscreen
  in:scale={…}
></iframe>
```

| Attr | Status |
|------|--------|
| `allow` | Narrow vs current best practice (no accelerometer / encrypted-media / gyroscope / web-share) |
| `allowfullscreen` | Yes |
| `referrerpolicy` | **Missing** on iframe (lite-youtube uses `strict-origin-when-cross-origin` for Error 153) |
| `loading` | Missing |
| `frameborder="0"` | Present (obsolete; prefer CSS `border: 0`) |
| `id` encoding | **Not** `encodeURIComponent`’d in src |

**A11y**

| Control | Behavior |
|---------|----------|
| Overlay | `role="button"` `tabindex="0"` `aria-label="video overlay"`; activates on **any** `keypress` |
| Default play | Real `<button aria-label="Play YouTube video">` + SVG `aria-hidden` |
| Custom play | Same wrapper button + snippet (nested-button risk) |
| Thumb | `alt="Youtube video: {title}"` — empty title until oEmbed |
| Dual hit targets | Overlay + button both activate play |

Gaps vs lite-youtube norms: deprecated `onkeypress`, no Enter/Space filter, no `playlabel` prop, no focus management into iframe after load, no noscript fallback.

## Packaging & footprint

| Topic | Finding |
|-------|---------|
| Build | `@sveltejs/package` + `publint` (`svelte-kit sync && svelte-package && publint`) |
| Published | `dist/*.svelte` source (consumers compile); not a prebundled runtime |
| Packed / unpacked | **5065 B** / **18411 B**; ~half of unpacked is README |
| `dependencies` | `svelte: ^5.15.0` |
| `peerDependencies` | **Absent** |
| `sideEffects` | Absent |
| Svelte support | **5 only** (`$props` / `$state` / snippets); `^5.15.0` |
| Install docs | `npm i -D svelte-youtube-embed` |

**vs ideal zero-runtime Svelte library**

| Ideal | Their package |
|-------|---------------|
| `svelte` as peer only | Fail — hard dependency |
| Zero runtime deps | Fail |
| `exports["."].svelte` + types | Pass |
| MIT + LICENSE in package | Pass |
| Dist-only publish | Pass |
| `sideEffects` / `default` export condition | Minor gaps |

Our packaging (`peerDependencies.svelte`, empty `dependencies`, publish `src/`) is the cleaner story for Astro/SvelteKit consumers.

## Strengths

- Genuine **click-to-load facade** — avoids shipping YouTube JS until intent.
- **nocookie** embed host + `autoplay=1` on activate.
- Modern **CSS `aspect-ratio`** (and `short` → 9/16) instead of padding-top hacks.
- Small, readable surface (~4 Svelte files); no Player API.
- Snippet escape hatches for poster / play UI; CSS vars for theming.
- Live demo + `@sveltejs/package` / publint toolchain.
- MIT with LICENSE in the published tarball.

## Weaknesses / anti-patterns

- **`svelte` as a runtime dependency** — can nest a second framework copy; should be peer.
- **Required client oEmbed** for title — CORS (Firefox #12), privacy leak to `youtube.com`, empty SSR title, no error handling; cannot supply/hide title (#14).
- **`onkeypress`** on overlay (prefer `keydown` + Enter/Space).
- **No iframe `referrerpolicy`**; narrow `allow`; no `encodeURIComponent(id)`.
- **maxresdefault without fallback** — broken posters for videos lacking maxres.
- Dual overlay + button without a clear single a11y model; nested-button footgun for custom play.
- README/slot docs drift vs snippets-only source.
- Soft generated types; no activation events; YouTube-only.
- No preconnect, no noscript/PE fallback, no IntersectionObserver option (by design, but limits SEO vs always-iframe libs).

## Steal for simple-svelte-embeds

Aligned with [DESIGN.md](../DESIGN.md); prefer patterns, not code copy.

1. **Optional later facade mode** — poster from `i.ytimg.com/vi/{id}/hqdefault.jpg` (prefer hq over maxres-without-fallback), play control, swap to iframe with `autoplay=1` on gesture. Separate prop/component — not v1 default.
2. **CSS `aspect-ratio` + CSS vars** — already our direction; `short`/9:16 as optional aspect helper is a nice DX touch.
3. **nocookie + autoplay on activate** when/if facade ships.
4. **Snippet customization** for play control / poster if facade lands — but document “don’t nest buttons.”
5. **Keep surface tiny** — their 4-file split shows how small a facade can stay; don’t invent a player SDK.

## Avoid

1. Listing **`svelte` under `dependencies`** — peer only (already in DESIGN).
2. **Mount-time oEmbed** (or any required metadata HTTP) — caller-supplied `title` / poster.
3. **`onkeypress`** and dual unlabeled hit targets as the a11y model.
4. Shipping iframe **without** `referrerpolicy="strict-origin-when-cross-origin"` and a full modern `allow` string (we already default these on `Embed`).
5. **maxres-only** poster without fallback or explicit quality enum.
6. Making facade the **only** path — our v1 SSR iframe + `loading="lazy"` remains the simple default.
7. Stale docs that advertise slots while shipping snippets-only APIs.

## Sources

- npm: https://www.npmjs.com/package/svelte-youtube-embed  
- Registry metadata: https://registry.npmjs.org/svelte-youtube-embed/0.4.6  
- Published package (jsDelivr):  
  - https://cdn.jsdelivr.net/npm/svelte-youtube-embed@0.4.6/package.json  
  - https://cdn.jsdelivr.net/npm/svelte-youtube-embed@0.4.6/dist/Youtube.svelte  
  - https://cdn.jsdelivr.net/npm/svelte-youtube-embed@0.4.6/dist/Iframe.svelte  
  - https://cdn.jsdelivr.net/npm/svelte-youtube-embed@0.4.6/dist/Image.svelte  
  - https://cdn.jsdelivr.net/npm/svelte-youtube-embed@0.4.6/dist/Button.svelte  
  - https://cdn.jsdelivr.net/npm/svelte-youtube-embed@0.4.6/dist/index.js  
- Repo: https://github.com/sharu725/youtube-embed  
- Demo: https://embed.sveltethemes.dev/  
- Downloads API: https://api.npmjs.org/downloads/point/last-week/svelte-youtube-embed  
- GitHub API: https://api.github.com/repos/sharu725/youtube-embed  
- Open issues cited: [#12](https://github.com/sharu725/youtube-embed/issues/12), [#14](https://github.com/sharu725/youtube-embed/issues/14), [#25](https://github.com/sharu725/youtube-embed/issues/25)  
- Internal context: [docs/COMPETITORS.md](../COMPETITORS.md), [docs/DESIGN.md](../DESIGN.md), `src/YouTube.svelte`, `src/Embed.svelte`  
- Related facade reference (for contrast, not this package): [lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed), [web.dev third-party facades](https://web.dev/third-party-facades/)
