# Platform tracking

Track embed providers we support or plan to support. Prefer thin iframe wrappers around `Embed` when the platform allows it; note when a platform requires scripts/widgets instead (may stay out of scope for zero-runtime-deps).

| Platform | Component | Status | Pattern | Notes |
|----------|-----------|--------|---------|-------|
| Generic | `Embed` | done | iframe `src` | Primitive for custom URLs |
| YouTube | `YouTube` | done | iframe | nocookie by default |
| Vimeo | `Vimeo` | done | iframe | |
| Facebook | `Facebook` | todo | iframe / plugin URL | Posts, videos, reels — confirm embed URL shape |
| Instagram | `Instagram` | todo | iframe / embed URL | Post / reel embeds; watch for script-only APIs |
| X (Twitter) | `X` | todo | iframe / embed | Prefer iframe; avoid widgets.js if possible |
| TikTok | `TikTok` | todo | iframe | Popular short-form |
| LinkedIn | `LinkedIn` | todo | iframe | Posts / embeds |
| Bluesky | `Bluesky` | todo | iframe / oEmbed-like | Competitor has this; keep zero-dep |
| Mastodon / Toot | `Toot` | later | iframe | Federated; instance-specific URLs |
| Threads | `Threads` | later | iframe | Meta; confirm public embed |
| Pinterest | `Pinterest` | later | iframe | Pins / boards |
| Reddit | `Reddit` | later | iframe | Post embeds |
| Tumblr | `Tumblr` | later | iframe | |
| Spotify | `Spotify` | later | iframe | Audio (not social feed, but popular) |
| SoundCloud | `SoundCloud` | later | iframe | |
| Twitch | `Twitch` | later | iframe | Live / clips |
| CodePen | `CodePen` | later | iframe | Dev embeds |
| GitHub Gist | `Gist` | later | iframe / script | Script path may be out of scope |

## Status legend

| Status | Meaning |
|--------|---------|
| `done` | Shipped in `src/` |
| `todo` | Planned next (social priority) |
| `later` | Wanted; after core social set |
| `blocked` | Needs design change (e.g. required third-party JS) |

## Priority

1. Facebook, Instagram, X — **only if** a documented public iframe URL exists (no widgets.js / FB SDK); else mark `blocked` and skip  
2. TikTok, LinkedIn, Bluesky — prefer iframe recipes proven by competitors (e.g. sveltekit-embed)  
3. Remaining `later` rows when the thin-iframe pattern still holds  

See [IMPROVEMENTS.md](IMPROVEMENTS.md) § social expansion and [reports/](reports/) for evidence.

Update this table when a component lands or a platform is deferred/`blocked`.
