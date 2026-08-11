# @astro-community/astro-embed-youtube

## Snapshot

| Field | Value |
|--------|--------|
| **Package** | `@astro-community/astro-embed-youtube` |
| **Version** | `0.5.10` (published 2026-01-01) |
| **License** | MIT |
| **Monorepo** | [delucis/astro-embed](https://github.com/delucis/astro-embed) |
| **Weekly downloads** | ~53k (npm, week of 2026-08-03) |
| **Author** | delucis |
| **Runtime deps** | `lite-youtube-embed` `^0.3.4` (Apache-2.0) |
| **Peer deps** | none (Astro peer removed in 0.5.10) |
| **Also via** | umbrella `astro-embed` re-exports `YouTube` |
| **Homepage** | https://astro-embed.netlify.app/components/youtube/ |

Thin Astro wrapper around Paul Irish’s `lite-youtube-embed` custom element. SSRs progressive-enhancement markup (poster + play link); client script upgrades to click-to-load iframe. Closest Astro-native competitor for our YouTube story — and the strongest example of “id-or-URL + PE facade” packaging.

## Architecture

```
YouTube.astro
  ├─ matcher.ts          # URL → 11-char video id (eleventy-inspired regex)
  ├─ extractID()         # bare id passthrough OR matcher
  ├─ poster URL builder  # i.ytimg.com / custom poster / posterQuality map
  └─ SSR output:
       <lite-youtube videoid … style="background-image: …">
         <a href="https://youtube.com/watch?v=…" class="lyt-playbtn">
           <span class="lyt-visually-hidden">Play</span>
         </a>
       </lite-youtube>
       <script src="lite-youtube-embed"></script>
       + global CSS fix for iframe sizing inside Astro
```

- **Ship model:** source `.ts` / `.astro` exported directly (no compile step) — same idea as our `src/` publish model.
- **Facade ownership:** all click-to-load, nocookie iframe, preconnect warmup, noscript iframe, and Safari/mobile YT API branches live in `lite-youtube-embed`, not in this package.
- **Astro’s job:** id/URL normalization, poster selection, PE child `<a>`, CSS import, and client script tag.

## Public API surface

**Import:**

```js
import { YouTube } from '@astro-community/astro-embed-youtube';
// or: import { YouTube } from 'astro-embed';
```

**Props** (`YouTube.astro`):

| Prop | Type | Default | Notes |
|------|------|---------|--------|
| `id` | `string` (required) | — | Bare video id **or** URL (`youtube.com/watch`, `youtu.be`, `/embed/`, `/shorts/`) |
| `poster` | `string` | — | Overrides default YouTube thumbnail |
| `posterQuality` | `'max' \| 'high' \| 'default' \| 'low'` | `'default'` | Maps to `maxresdefault` / `sddefault` / `hqdefault` / `default` jpg |
| `params` | `string` | — | Passed through to `<lite-youtube params>` (player query string) |
| `playlabel` | `string` | `'Play'` | Accessible name for play control (via attrs + PE span) |
| `title` | `string` | — | Visible overlay title; also sets `data-title` |
| `style` | CSS | — | Merged with poster `background-image` |
| *(rest)* | HTML attrs | — | Spread onto `<lite-youtube>` |

**Matcher export** (`@astro-community/astro-embed-youtube/matcher`):

```ts
export default function matcher(url: string): string | undefined
```

Returns the 11-char id from group 3 of a regex adapted from [eleventy-plugin-youtube-embed](https://github.com/gfscott/eleventy-plugin-youtube-embed). Used by `astro-embed-integration` to auto-replace bare Markdown URL paragraphs with `<YouTube id={…} />`.

**Not exposed:** cookie/nocookie toggle, aspect-ratio prop, `loading`, `referrerpolicy`, iframe `allow` — those are hard-coded inside lite-youtube.

## Social / platform coverage

This package is YouTube-only. Sibling packages in the same monorepo:

| Package | npm | Role | Social? |
|---------|-----|------|---------|
| `astro-embed-twitter` | `@astro-community/astro-embed-twitter` | X/Twitter via SSR **oEmbed** (`publish.twitter.com`); optional `widgets.js` | **Yes** |
| `astro-embed-bluesky` | `@astro-community/astro-embed-bluesky` | Bluesky post via public API → static HTML | **Yes** |
| `astro-embed-mastodon` | `@astro-community/astro-embed-mastodon` | Mastodon status SSR fetch → shadow DOM | **Yes** |
| `astro-embed-vimeo` | `@astro-community/astro-embed-vimeo` | Lite Vimeo facade; **inlined** `<lite-vimeo>` CE (no npm `lite-vimeo*` dep); poster from Vimeo API | Video |
| `astro-embed-gist` | `@astro-community/astro-embed-gist` | GitHub Gist SSR | No |
| `astro-embed-link-preview` | `@astro-community/astro-embed-link-preview` | OG card catch-all | No |
| `astro-embed-baseline-status` | `@astro-community/astro-embed-baseline-status` | Web Platform Baseline badge | No |
| `astro-embed-integration` | `@astro-community/astro-embed-integration` | Remark plugin: bare MD URLs → components (Bluesky → Gist → Tweet → Vimeo → YouTube → Mastodon → LinkPreview) | Meta |
| `astro-embed` | `astro-embed` | Umbrella re-exports + `./integration` | Meta |

**Not present:** Instagram, TikTok, Facebook.

For simple-svelte-embeds: social siblings prove demand for Tweet/Bluesky/Mastodon, but they rely on **build-time HTTP + oEmbed/widget patterns** that conflict with our zero-runtime-deps / no-oEmbed goals. Note existence under Social coverage; do not expand v1 scope to match.

## SSR, hydration, lazy-load

| Stage | Behavior |
|-------|----------|
| **SSR / build** | Full PE markup: `<lite-youtube>` + poster background + `<a class="lyt-playbtn">` watch URL. No iframe yet. Crawlers/no-JS users get a real link to YouTube. |
| **Client script** | `<script src="lite-youtube-embed">` registers the CE; converts PE `<a>` → role=button; adds noscript iframe (client-side); warms connections on hover/focus. |
| **Activation** | Click → inject nocookie iframe (`autoplay=1&playsinline=1` + `params`). Apple/mobile/`js-api` may load full YT IFrame API (~165KB+). |
| **Hydration** | Not Astro “hydrate a framework island” — it’s a vanilla CE. Zero Svelte/React runtime. |
| **Lazy-load** | Facade is the lazy strategy (no IntersectionObserver). Thumbnail is always in HTML; YouTube player JS only after gesture. |

Contrast with our v1: we SSR a real `<iframe loading="lazy">` immediately. Their model is better for third-party weight; ours is simpler and zero-JS.

## Privacy, a11y, iframe attrs

**Privacy (via lite-youtube, not this package):**

- Embed host: `https://www.youtube-nocookie.com/embed/…`
- Poster still loads from `i.ytimg.com` (Google CDN) on every render — unavoidable with default posters
- Preconnect warmup hits `youtube-nocookie.com`, `google.com`, and DoubleClick origins on intent
- PE watch link uses `https://youtube.com/watch?v=…` (non-nocookie navigation if JS is off)

**A11y:**

- PE play control is a real `<a>` with visually-hidden label (`playlabel` / default `"Play"`)
- After CE upgrade: `role="button"`, `tabindex="0"`, Enter/Space activate
- Changelog 0.5.3 / 0.5.6 fixed missing accessible names
- Optional visible `title` overlay via lite-youtube’s `title` / `data-title`
- iframe `title` set from play label (not a separate descriptive video title)

**Iframe attrs (lite-youtube `createBasicIframe`):**

- `allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"`
- `allowFullscreen`
- `referrerPolicy="strict-origin-when-cross-origin"` (Error 153 fix)
- No `loading` / `clipboard-write` / `web-share` in the allow string

## Packaging & footprint

| Metric | Value |
|--------|--------|
| Package tarball | ~2.4 KB |
| Package unpacked | ~4.2 KB / 6 files (`index.ts`, `matcher.ts`, `YouTube.astro`, + meta) |
| Runtime dep | `lite-youtube-embed@0.3.4` ~20.6 KB unpacked (JS + CSS) |
| Exports | `"."` → component; `"./matcher"` → URL helper |
| Keywords | `astro`, `astro-component`, `ui`, `embeds`, `youtube` |

Tiny wrapper; real weight is the CE dependency (and, on Apple/mobile, YT API after click).

## Strengths

1. **Progressive enhancement done right** — SSR poster + watch link; JS upgrades in place. No empty SSR hole.
2. **id-or-URL ergonomics** — one `id` prop accepts bare ids and common URL shapes; matcher shared with MDX auto-embed.
3. **Poster quality knobs** — `poster` / `posterQuality` without any oEmbed fetch.
4. **Proven facade** — reuses battle-tested lite-youtube (nocookie, referrerpolicy, preconnect, a11y button).
5. **Astro-native packaging** — ships source, optional standalone install, umbrella + remark integration.
6. **High adoption** — ~53k weekly downloads; good signal that Astro users want click-to-load YouTube.

## Weaknesses / anti-patterns

1. **Hard dependency on another package** — cannot meet a zero-runtime-deps design; version coupling (0.5.8 had to chase lite-youtube play-button breakage).
2. **Inherits lite-youtube heavy paths** — Safari/mobile YT IFrame API load after click is outside consumer control.
3. **No cookie/nocookie or iframe attr surface** — privacy/allow/referrerpolicy not configurable at the Astro API.
4. **Aspect ratio locked to lite-youtube CSS** — padding-bottom 16:9 hack; no Shorts-oriented 9:16 prop despite `/shorts/` URL parsing.
5. **Global CSS override** — `is:global` iframe reset papers over CE/Astro style conflicts.
6. **Matcher fragility** — complex lookaround regex from eleventy; opaque failure if `extractID` returns `undefined` for weird URLs (still emits markup with bad videoid).
7. **Title vs playlabel confusion** — iframe `title` comes from play label, not the optional visible `title` prop.
8. **Client-only noscript iframe** — lite-youtube injects `<noscript>` in `connectedCallback`; Astro PE link covers no-JS navigation, but crawlers that don’t execute JS never see an embed iframe (only the watch link).

## Steal for simple-svelte-embeds

Aligned with [DESIGN.md](../DESIGN.md) and Astro (`@astrojs/svelte`) compatibility:

1. **Accept id-or-URL (optional helper)** — export a tiny `parseYouTubeId(idOrUrl)` / matcher for DX and docs; keep component `id` as the primary prop (bare id). Useful for Astro MD content pipelines without becoming an integration.
2. **Progressive-enhancement shape for a future facade** — if/when we add `facade`, SSR a real watch link (or noscript iframe) + poster, then swap to iframe on gesture — same pattern as their PE `<a class="lyt-playbtn">`, implemented in Svelte, not a CE.
3. **Poster quality enum** — `hqdefault` default with optional max/high/low mapping to known `i.ytimg.com` filenames; custom `poster` override. No fetch.
4. **`params` as opaque query string** — simple escape hatch for `start`/`end`/etc. without a kitchen-sink boolean props API.
5. **`playlabel` for facade a11y** — accessible name separate from optional visible title.
6. **Publish source + matcher-style subpath** — mirrors our `src/` ship model; optional `./parse` export later.
7. **Document Astro usage** — confirm `@astrojs/svelte` works with our peer `svelte`; we compete on “Svelte component that works in Astro,” not “Astro-only CE wrapper.”

## Avoid

1. **Depending on `lite-youtube-embed` (or any CE)** — violates zero runtime deps; wrong packaging for a Svelte library. Reimplement facade ideas in Svelte if needed.
2. **Kitchen-sink monorepo / social oEmbed** — Twitter/Bluesky/Mastodon SSR fetchers and `widgets.js` are out of scope.
3. **Remark/MDX auto-embed integration as a product** — useful for Astro content sites; not our job.
4. **Shipping YT IFrame API paths** — DESIGN non-goal; facade should stay basic iframe + `autoplay=1`.
5. **Padding-top / padding-bottom aspect hacks** — keep CSS `aspect-ratio`.
6. **Making facade the v1 default** — our simple SSR iframe + `loading="lazy"` stays primary; facade is optional later.
7. **Opaque regex as the only id path** — if we add URL parsing, keep it small/tested; don’t fail silently into broken embeds.

## Sources

- https://www.npmjs.com/package/@astro-community/astro-embed-youtube
- https://registry.npmjs.org/@astro-community/astro-embed-youtube
- https://api.npmjs.org/downloads/point/last-week/@astro-community/astro-embed-youtube
- https://github.com/delucis/astro-embed
- https://github.com/delucis/astro-embed/tree/main/packages/astro-embed-youtube
- https://raw.githubusercontent.com/delucis/astro-embed/main/packages/astro-embed-youtube/YouTube.astro
- https://raw.githubusercontent.com/delucis/astro-embed/main/packages/astro-embed-youtube/matcher.ts
- https://raw.githubusercontent.com/delucis/astro-embed/main/packages/astro-embed-youtube/package.json
- https://raw.githubusercontent.com/delucis/astro-embed/main/packages/astro-embed-youtube/CHANGELOG.md
- https://raw.githubusercontent.com/delucis/astro-embed/main/docs/src/content/docs/components/youtube.mdx
- https://raw.githubusercontent.com/delucis/astro-embed/main/tests/astro-embed-youtube.mjs
- https://astro-embed.netlify.app/components/youtube/
- https://www.npmjs.com/package/lite-youtube-embed
- https://github.com/paulirish/lite-youtube-embed
- https://raw.githubusercontent.com/paulirish/lite-youtube-embed/master/src/lite-yt-embed.js
- https://raw.githubusercontent.com/paulirish/lite-youtube-embed/master/readme.md
- Sibling survey: `packages/astro-embed-{twitter,bluesky,mastodon,vimeo,gist,link-preview,baseline-status,integration,astro-embed}`
- https://www.npmjs.com/package/@astro-community/astro-embed-twitter
- https://github.com/gfscott/eleventy-plugin-youtube-embed (matcher attribution)

_Research date: 2026-08-10._
