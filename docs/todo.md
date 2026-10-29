# Platform tracking

Track embed providers we support or plan to support. Prefer thin iframe wrappers around `Embed` when the platform allows it; note when a platform requires scripts/widgets instead (may stay out of scope for zero-runtime-deps).

| Platform | Component | Status | Pattern | Notes |
|----------|-----------|--------|---------|-------|
| Generic | `Embed` | done | iframe `src` | Primitive for custom URLs |
| YouTube | `YouTube` | done | iframe | nocookie by default |
| Vimeo | `Vimeo` | done | iframe | |
| Facebook | `Facebook` | done | iframe plugin URL | `href` is the post or video URL |
| Instagram | `Instagram` | done | iframe `/embed/` | `kind`: `p`, `reel`, `tv` |
| X (Twitter) | `X` | done | iframe `Tweet.html` | status id; `dnt=true`; no widgets.js |
| TikTok | `TikTok` | done | iframe player v1 | official player, not embed.js |
| LinkedIn | `LinkedIn` | blocked | — | no public iframe |
| Bluesky | `Bluesky` | done | iframe `embed.bsky.app` | `did/app.bsky.feed.post/rkey` |
| Mastodon / Toot | `Toot` | later | iframe | instance-specific URL |
| Threads | `Threads` | later | — | confirm a stable iframe |
| Pinterest | `Pinterest` | later | — | official path is a script widget |
| Reddit | `Reddit` | done | iframe `embed.reddit.com` | path or permalink |
| Tumblr | `Tumblr` | later | — | |
| Spotify | `Spotify` | done | iframe | `type` + id |
| SoundCloud | `SoundCloud` | done | iframe | track id |
| Twitch | `Twitch` | later | iframe | requires embedding `parent` hostname |
| CodePen | `CodePen` | done | iframe | `user/pen` |
| GitHub Gist | `Gist` | done | iframe `.pibb` | `user/gistId`; no gist.js |

## Status legend

| Status | Meaning |
|--------|---------|
| `done` | Shipped in `src/` |
| `todo` | Planned next (social priority) |
| `later` | Wanted; after core social set |
| `blocked` | Needs design change (e.g. required third-party JS) |

## Priority

1. Done: Facebook, Instagram, X, TikTok, Bluesky, plus Spotify, SoundCloud, Reddit, CodePen, Gist  
2. Later: Mastodon, Threads, Pinterest, Twitch — only with a stable iframe and no widget script  
3. LinkedIn stays `blocked` until a public iframe exists  

See [API.md](API.md) and [IMPROVEMENTS.md](IMPROVEMENTS.md).

Update this table when a component lands or a platform is deferred/`blocked`.
