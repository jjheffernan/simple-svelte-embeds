# Platform tracking

Track embed providers we support or plan to support. Prefer thin iframe wrappers around `Embed` when the platform allows it; note when a platform requires scripts/widgets instead (may stay out of scope for zero-runtime-deps).

| Platform | Component | Status | Pattern | Notes |
|----------|-----------|--------|---------|-------|
| Generic | `Embed` | done | iframe `src` | Primitive for custom URLs |
| YouTube | `YouTube` | done | click-to-play iframe | nocookie by default |
| YouTube Shorts | `YouTubeShorts` | done | iframe, 9 / 16 | loops; poster until tap |
| YouTube podcasts | `YouTubePodcast` | done | playlist iframe | playlist id; optional `episode` |
| YouTube playlists | `YouTubePlaylist` | done | playlist iframe | |
| YouTube community posts | — | blocked | — | no public iframe |
| YouTube live chat | — | blocked | iframe | requires the embedding hostname |
| Vimeo | `Vimeo`, `VimeoShowcase` | done | iframe | video and showcase |
| Facebook | `Facebook`, `FacebookVideo`, `FacebookPage` | done | iframe plugin URL | post, video, page |
| Instagram | `Instagram`, `InstagramReel`, `InstagramTV` | done | iframe `/embed/` | post, reel, tv |
| X (Twitter) | `XPost`, `X` | done | iframe `Tweet.html` | post hides the thread; `dnt=true`; no widgets.js |
| TikTok | `TikTok`, `TikTokPost` | done | iframe | player v1 and embed card v2 |
| LinkedIn | `LinkedIn` | blocked | — | no public iframe |
| Bluesky | `Bluesky` | done | iframe `embed.bsky.app` | `did/app.bsky.feed.post/rkey` |
| Mastodon / Toot | `Toot` | later | iframe | instance-specific URL |
| Threads | `Threads` | later | — | confirm a stable iframe |
| Pinterest | `Pinterest` | later | — | official path is a script widget |
| Reddit | `Reddit`, `RedditComment` | done | iframe `embed.reddit.com` | post or comment permalink |
| Tumblr | `Tumblr` | later | — | |
| Spotify | `Spotify`, `SpotifyAlbum`, `SpotifyPlaylist`, `SpotifyEpisode`, `SpotifyShow` | done | iframe | |
| SoundCloud | `SoundCloud`, `SoundCloudPlaylist`, `SoundCloudProfile` | done | iframe | track, playlist, user |
| Twitch | `Twitch` | later | iframe | requires embedding `parent` hostname |
| CodePen | `CodePen`, `CodePenPreview` | done | iframe | editor embed and result preview |
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
