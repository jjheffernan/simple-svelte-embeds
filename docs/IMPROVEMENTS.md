# Design improvements vs competitors

Synthesis of competitor deep dives in [`docs/reports/`](reports/) against our current design ([`DESIGN.md`](DESIGN.md), [`API.md`](API.md), [`todo.md`](todo.md)) and `src/` (`Embed`, `YouTube`, `Vimeo`). Research date: 2026-08-10. Docs only — no library code changes implied by this file alone.

## Executive summary (what we already do better / worse)

**Already better**

- **Zero runtime deps + `svelte` peer only** — cleaner than svelte-youtube-embed (`svelte` as dependency), sveltinio (ts-utils → neverthrow), and opposite of react-player’s ~10 media packages.
- **SSR real iframe + `loading="lazy"`** — better SEO/CLS baseline than sveltekit-embed’s empty-until-IntersectionObserver default and facade-only libraries that never SSR an iframe.
- **Privacy defaults** — `privacyEnhanced` → nocookie by default; `referrerpolicy="strict-origin-when-cross-origin"` (Error 153); sensible `allow` strings. Ahead of sveltekit-embed (no referrerpolicy/loading), sveltinio (cookie host + `same-origin` referrer), and react-player (nocookie only if URL says so).
- **Composition** — `YouTube` / `Vimeo` → `Embed` matches the GenericEmbed / IFrame primitive lesson without padding-top hacks or `$effect` observers.
- **Modern sizing** — CSS `aspect-ratio` (`'16 / 9'`) vs padding-percentage maps still used by sveltekit-embed, classic lite-youtube CSS, and sveltinio.
- **Id encoding** — `encodeURIComponent(id)` already in place (lite-youtube / lite-vimeo hygiene).
- **Publish `src/`** — Astro/Svelte-friendly, same spirit as lite-youtube and astro-embed-youtube; opposite of dist-only kitchen-sink packs.

**Worse / gaps**

- **DX ergonomics** — no id-or-URL parsing (astro-embed / react-player win here); no query `params` / `settings` surface yet (sveltekit-embed, react-lite, sveltinio, lite-youtube).
- **`title` is optional** — react-lite and sveltinio require it; we only recommend it in docs.
- **No facade path** — competitors with huge adoption (lite-youtube ~96k/wk, react-lite ~200k/wk) sell click-to-load; we defer that (correct for v1, but a product gap later).
- **Provider breadth** — sveltekit-embed already has TikTok, Bluesky, Spotify, Gist, etc.; our social priority (Facebook / Instagram / X) is still open — and several of those need scripts, so “catch up” is not free.
- **CSS vars / Shorts aspect** — API.md mentions `--sse-width`; `Embed` today only sets width via plain CSS. No `short` / `9 / 16` helper yet (svelte-youtube-embed).
- **Playlist / start / mute knobs** — thin today; fine for v1, but power users will miss sveltekit-embed / sveltinio settings bags.

**Positioning verdict:** stay the best thin, privacy-default, SSR iframe library for Svelte 5. Steal facade/URL/settings ideas as *optional* layers. Do not become react-player or a widgets.js kitchen sink.

## Cross-cutting lessons (table: lesson | source reports | apply how)

| Lesson | Source reports | Apply how |
|--------|----------------|-----------|
| Privacy host by default + Error 153 `referrerpolicy` | lite-youtube, react-lite, sveltekit-embed (nocookie only), svelte-youtube-embed | Keep defaults; document page-level `no-referrer` / `same-origin` can still break YT |
| Affirmative privacy prop naming (`privacyEnhanced`) beats inverted `cookie` | react-lite, sveltinio (cookie-only) | Keep `privacyEnhanced`; never rename to `cookie` |
| Require strong `title` for a11y | react-lite, sveltinio; avoid auto-`youTube-${id}` (sveltekit-embed) | Make `title` required in API docs / JSDoc; soft enforce in components |
| Native lazy iframe > empty IO gate as default | sveltekit-embed (anti-pattern), our Embed | Keep SSR iframe + `loading="lazy"`; IO only if ever opt-in |
| Facade = optional later, not v1 default | lite-youtube, svelte-youtube-embed, react-lite, lite-vimeo, astro-embed, sveltinio | Separate `facade` prop/component; poster static URLs only |
| No required runtime HTTP (oEmbed / poster API) | svelte-youtube-embed, lite-vimeo, react-player light mode | Caller supplies `title` / `poster`; never mount-time fetch |
| `encodeURIComponent` on ids | lite-youtube, lite-vimeo | Already done; keep for all new providers |
| CSS `aspect-ratio` (+ optional vars / Shorts) | svelte-youtube-embed, lite-vimeo, react-lite; avoid padding maps (sveltekit-embed, sveltinio, lite-youtube CSS) | Keep string `aspectRatio`; add CSS vars; optional `short` helper |
| id-or-URL parsing as small pure helper | astro-embed-youtube, react-player patterns | Optional `parseYouTubeId` / `parseVimeoId`; component still prefers bare `id` |
| Query bag (`params` / `settings`) > dozens of booleans | lite-youtube, react-lite, sveltinio, sveltekit-embed | Add optional `params` (string \| record); snake_case / `0\|1` builder |
| Intent-only preconnect (no DoubleClick) | lite-youtube (steal host warmup; avoid ads), lite-vimeo, react-lite | Only when facade ships; warm player host (+ poster CDN) |
| PE / noscript when facade ships | lite-youtube, astro-embed; weaker: react-lite link-only noscript | Prefer noscript iframe or watch link in SSR markup |
| Thin iframe providers only; scripts = `blocked` | sveltekit-embed Tweet/Toot/Zencastr, sveltinio FB/Tweet, astro social oEmbed | Expand via iframe endpoints; mark widgets.js paths blocked in todo.md |
| `svelte` peer only; publish source | svelte-youtube-embed (avoid dep), lite-youtube / astro (src ship), sveltekit-embed dist contrast | Keep empty `dependencies`, `files: ["src"]`, peer `svelte` ^5 |
| Real `<button>` + focus iframe after activate | lite-youtube, lite-vimeo, react-lite; avoid onkeypress dual targets (svelte-youtube-embed) | Facade a11y checklist when built |
| Reject GPL / proprietary / unclear license sources | rejected-licenses | Ideas only from MIT/Apache reports; no code copy |

## Concrete improvements to our code design

1. **Composition (`Embed` primitive)**  
   - **Problem:** Providers must stay thin wrappers; shared attrs/defaults can drift if duplicated.  
   - **Competitor evidence:** sveltekit-embed `GenericEmbed`; sveltinio `IFrame` + `Thumbnail`; our tree already matches.  
   - **Proposed change:** Keep `YouTube` / `Vimeo` → `Embed` only. New providers build `src` (+ optional `allow`) and spread shared props. Do not add a second layout primitive unless a facade lands (`Thumbnail`-like). Document that `Embed` is the public escape hatch for arbitrary URLs.  
   - **Priority:** P0 (guardrail)  
   - **Fits zero-dep + Svelte-only?** yes  

2. **URL builders / id-or-URL parsing**  
   - **Problem:** Callers must strip watch/shorts URLs themselves; easy footgun.  
   - **Competitor evidence:** astro-embed-youtube `extractID` / matcher; react-player `patterns.ts`.  
   - **Proposed change:** Add pure helpers (e.g. `parseYouTubeId`, `parseVimeoId`) — optionally accept id-or-URL inside the component later, but prefer explicit helpers + docs so broken URLs fail loudly. Keep `encodeURIComponent` on the final path segment.  
   - **Priority:** P1  
   - **Fits zero-dep + Svelte-only?** yes  

3. **Privacy defaults & `referrerpolicy`**  
   - **Problem:** Easy to regress; docs under-explain Error 153 and page-level referrer policies.  
   - **Competitor evidence:** lite-youtube PR #203; react-lite default; sveltinio `same-origin` anti-pattern; sveltekit-embed missing attr.  
   - **Proposed change:** Freeze Embed defaults as API contract. Document that consumers must not override `referrerpolicy` to `no-referrer`/`same-origin` for YouTube. Keep `privacyEnhanced` default `true`; optional Vimeo `dnt` later via params.  
   - **Priority:** P0  
   - **Fits zero-dep + Svelte-only?** yes  

4. **Title / a11y requirements**  
   - **Problem:** `title` is optional; empty iframe names hurt screen readers. Auto-generated titles are weak.  
   - **Competitor evidence:** react-lite / sveltinio require `title`; sveltekit-embed uses `youTube-${id}`; Toot empty title.  
   - **Proposed change:** Treat `title` as required in public API (JSDoc `@required`, README examples always pass it). Do not invent titles from ids. When facade ships: real `<button>`, distinct `playlabel` vs media `title`, focus iframe after activate.  
   - **Priority:** P0  
   - **Fits zero-dep + Svelte-only?** yes  

5. **Aspect-ratio / CSS vars**  
   - **Problem:** API.md mentions `--sse-width`; implementation only uses `aspect-ratio` style + `width: 100%`. No Shorts helper.  
   - **Competitor evidence:** svelte-youtube-embed `--aspect-ratio` + `short`; react-lite modern ratio + fallback var; padding maps elsewhere to avoid.  
   - **Proposed change:** Align code with documented CSS vars (`--sse-width`, optionally `--sse-aspect-ratio`). Consider `short` boolean or documented `aspectRatio="9 / 16"` for Shorts. Never introduce padding-top maps.  
   - **Priority:** P1  
   - **Fits zero-dep + Svelte-only?** yes  

6. **Lazy vs facade vs IntersectionObserver**  
   - **Problem:** Competitors conflate three strategies; we need a clear ladder.  
   - **Competitor evidence:** sveltekit-embed IO-empty SSR (avoid as default); lite-* / react-lite / svelte-youtube-embed facades; our native `loading="lazy"`.  
   - **Proposed change:**  
     1. **Default (now):** SSR iframe + `loading="lazy"`.  
     2. **Later optional:** click-to-load facade (`facade` prop or `YouTubeFacade`) with static poster URLs, `autoplay=1` (+ mute as needed), intent preconnect, PE/noscript.  
     3. **Avoid as default:** IntersectionObserver empty shell; offer only if a rare opt-in ever justified.  
   - **Priority:** P0 (policy) / P2 (implement facade)  
   - **Fits zero-dep + Svelte-only?** yes (facade without oEmbed/API fetch)  

7. **Social platform expansion vs kitchen-sink**  
   - **Problem:** todo.md prioritizes Facebook / Instagram / X; closest Svelte competitor skips Meta and uses widgets.js for X.  
   - **Competitor evidence:** sveltekit-embed coverage map; sveltinio FB/Tweet SDKs; astro social oEmbed packages; react-player dropped Facebook in v3.  
   - **Proposed change:** Only ship providers with a **documented public iframe URL** and no required third-party script. Mark widgets.js / FB SDK / oEmbed-SSR as `blocked` in todo.md until an iframe path exists. Prefer TikTok / Bluesky / Spotify / Gist `.pibb` (iframe recipes from sveltekit-embed) when Meta/X stall. Stay thin: root-export only what we maintain.  
   - **Priority:** P1 (first social that fits) / P2 (later audio/dev)  
   - **Fits zero-dep + Svelte-only?** yes if iframe-only; **no** if SDK/widgets required  

8. **Packaging (`src` publish vs `dist`)**  
   - **Problem:** Dist-only + Kit branding confuses Astro consumers; listing `svelte` as a dependency duplicates the framework.  
   - **Competitor evidence:** our model aligns with lite-youtube / astro-embed source ship; avoid svelte-youtube-embed dep mistake; sveltekit-embed dist contrast is fine for them but not our wedge.  
   - **Proposed change:** Keep publishing `src/`, empty runtime `dependencies`, peer `svelte` ^5, single root export map. Optional later: `./parse` subpath for URL helpers; co-located smoke tests for URL construction. Do not add CJS dual builds or mandatory separate CSS imports.  
   - **Priority:** P0  
   - **Fits zero-dep + Svelte-only?** yes  

9. **Query params / settings objects**  
   - **Problem:** No escape hatch for `start`, `rel`, playlists, Vimeo `muted`/`dnt` without forking `src`.  
   - **Competitor evidence:** lite-youtube `params` string; react-lite `params` string\|record; sveltinio typed `settings` + `makeSettingsString`; sveltekit-embed boolean→`Number(boolean)`.  
   - **Proposed change:** Add optional `params` (`string | Record<string, string | number | boolean>`) on `YouTube` / `Vimeo`, merged into embed URL via a tiny pure builder (booleans → `0|1`, YouTube keys snake_case, special-case `loop` → `playlist=id` when needed). Prefer opaque `params` over exploding boolean props. Keep `Embed` as raw `src` (caller owns query).  
   - **Priority:** P1  
   - **Fits zero-dep + Svelte-only?** yes  

10. **Optional facade posters without network**  
    - **Problem:** When facade lands, competitors tempt API/oEmbed poster fetches.  
    - **Competitor evidence:** lite-vimeo API v2; svelte-youtube-embed oEmbed; sveltinio vumbnail; react-player noembed.  
    - **Proposed change:** YouTube: `i.ytimg.com/vi/{id}/hqdefault.jpg` (+ optional quality enum, maxres only with fallback or caller override). Vimeo: require `poster` prop or document author-time thumbnail URLs — no client `fetch`.  
    - **Priority:** P2  
    - **Fits zero-dep + Svelte-only?** yes  

11. **Provider-prefixed ids**  
    - **Problem:** Verbose APIs (`youTubeId`) fight “simple.”  
    - **Competitor evidence:** sveltekit-embed anti-pattern; our `id` is correct.  
    - **Proposed change:** Keep `id` on namespaced components; do not rename.  
    - **Priority:** P0 (already done — do not regress)  
    - **Fits zero-dep + Svelte-only?** yes  

12. **Allow-string / fullscreen consistency**  
    - **Problem:** Vimeo overrides `allow` but must keep `allowfullscreen` + referrerpolicy from Embed.  
    - **Competitor evidence:** lite-vimeo missing allowfullscreen/referrerpolicy; our Vimeo already inherits Embed attrs.  
    - **Proposed change:** Document provider-specific default `allow` tables; never strip Embed’s referrerpolicy/loading when wrapping.  
    - **Priority:** P1  
    - **Fits zero-dep + Svelte-only?** yes  

## What we should NOT copy

- **Player SDKs / multi-provider players** — react-player architecture, YT IFrame API UA-sniff paths (lite-youtube), unused Vimeo Player.js (sveltinio).
- **Required oEmbed / poster HTTP** — svelte-youtube-embed mount fetch, lite-vimeo API v2, noembed/vumbnail.
- **IntersectionObserver empty-until-visible as default** — sveltekit-embed.
- **Padding-top / padding-bottom aspect maps** — sveltekit-embed, classic lite-youtube CSS, sveltinio.
- **Kitchen-sink + script widgets** — Tweet `widgets.js`, Facebook SDK, Zencastr inject, CodePen `ei.js` as core exports.
- **`svelte` under `dependencies`** — svelte-youtube-embed.
- **Util runtime packages** — `@sveltinio/ts-utils` / neverthrow for string joins.
- **Custom elements + global CSS injection as public API** — lite-youtube / lite-vimeo packaging.
- **Inverted privacy APIs** — `cookie={false}`; default `youtube.com`.
- **Full postMessage player-event surfaces** — react-lite `enableJsApi` bus.
- **DoubleClick / ads preconnects** — lite-youtube / react-lite `adNetwork`.
- **GPL / proprietary / unclear-license code** — see [`reports/rejected-licenses.md`](reports/rejected-licenses.md).
- **Remark/MDX auto-embed integrations as product** — astro-embed-integration (document usage; don’t own the pipeline).

## Recommended roadmap (aligned with docs/todo.md)

Ordered to match [`todo.md`](todo.md) priorities while folding competitor lessons.

| Phase | Work | Priority | Notes |
|-------|------|----------|-------|
| **Now (v1 harden)** | Keep Embed composition; lock privacy/`referrerpolicy`/`loading` defaults; require `title` in API docs; document CSS vars vs implementation | P0 | No new platforms yet |
| **Next** | Optional `params` on YouTube/Vimeo; id-or-URL parse helpers; align CSS vars / Shorts aspect docs | P1 | Still YouTube + Vimeo + Embed only |
| **Social wave 1** | Facebook, Instagram, X — **only if** thin iframe URLs exist; else mark `blocked` and skip | P1 | Do not ship widgets.js to “check the box” |
| **Social wave 2** | TikTok, LinkedIn, Bluesky via iframe recipes (sveltekit-embed references) | P1–P2 | Prefer proven iframe endpoints |
| **Later** | Spotify, SoundCloud, Twitch, CodePen, Gist `.pibb`; optional facade + intent preconnect + PE/noscript | P2 | Facade never becomes the only path |
| **Out of band** | Mastodon/Threads/etc. when iframe-only; never react-player-style registry of SDKs | later / blocked | Update todo.md status when decided |

## Report index

| Report | License | One-line takeaway for us |
|--------|---------|--------------------------|
| [sveltekit-embed.md](reports/sveltekit-embed.md) | MIT | Closest Svelte multi-provider peer; steal iframe recipes + primitive split; avoid IO-empty SSR and kitchen-sink scripts |
| [lite-youtube-embed.md](reports/lite-youtube-embed.md) | Apache-2.0 | Facade + nocookie + Error 153 referrerpolicy reference; optional later, not v1 default |
| [svelte-youtube-embed.md](reports/svelte-youtube-embed.md) | MIT | Svelte 5 facade + CSS vars; avoid oEmbed and `svelte` as dependency |
| [lite-vimeo-embed.md](reports/lite-vimeo-embed.md) | MIT (no LICENSE file) | Vimeo facade + modern aspect-ratio; avoid API poster fetch and CE SSR breakage |
| [react-lite-youtube-embed.md](reports/react-lite-youtube-embed.md) | MIT | Require `title`, params bag, poster enum; avoid JS API event kitchen sink |
| [react-player.md](reports/react-player.md) | MIT | Contrast only — URL-in DX to steal lightly; never the dep/player architecture |
| [astro-embed-youtube.md](reports/astro-embed-youtube.md) | MIT | id-or-URL matcher + PE markup; don’t depend on lite-youtube CE |
| [sveltinio-media-content.md](reports/sveltinio-media-content.md) | MIT | settings→query builder + required title; avoid cookie host, util deps, SDKs |
| [rejected-licenses.md](reports/rejected-licenses.md) | — | GPL / proprietary / unclear — hygiene only, no pattern reuse from those trees |

Related: [`COMPETITORS.md`](COMPETITORS.md) (matrix), [`DESIGN.md`](DESIGN.md) (constraints), [`API.md`](API.md) (public surface), [`todo.md`](todo.md) (platform tracker).
