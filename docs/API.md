# API (draft)

## Package exports

| Export | For | Contents |
|--------|-----|----------|
| `simple-svelte-embeds` | Svelte / Kit / Astro / any Svelte-capable bundler | `Embed`, `YouTube`, `Vimeo`, `Instagram`, `X`, `Facebook`, `TikTok`, `Bluesky`, `Spotify`, `SoundCloud`, `Reddit`, `CodePen`, `Gist` |
| `simple-svelte-embeds/urls` | **Any** framework (React, Vue, Solid, …) | matching `*EmbedUrl` helpers and `iframeDefaults` |

`svelte` is an optional peer — required only for the root (component) export.

Shared iframe ideas (components and `iframeDefaults`):

| Prop / field | Type | Default | Notes |
|------|------|---------|-------|
| `title` | `string` | — | Required for a11y in practice |
| `aspectRatio` | `string` | `'16 / 9'` | CSS `aspect-ratio` value |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Native iframe `loading` |
| `allow` | `string` | provider-sensible default | iframe `allow` |
| `referrerpolicy` | referrer policy | `'strict-origin-when-cross-origin'` | Avoids YouTube Error 153 |
| `class` | `string` | — | Forwarded to wrapper (components) |

---

## `YouTube`

```svelte
<YouTube id="dQw4w9WgXcQ" title="Demo" />
```

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `id` | `string` | yes | Video id (not full URL in v1) |
| `privacyEnhanced` | `boolean` | no | Default `true` → `youtube-nocookie.com` |

---

## `Vimeo`

```svelte
<Vimeo id="148751763" title="Demo" />
```

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `id` | `string` | yes | Vimeo video id |

---

## `Embed`

```svelte
<Embed src="https://example.com/embed" title="Custom" />
```

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `src` | `string` | yes | Full embed URL |

---

## Widgets

Same shared props as `Embed`. Each component only builds `src`.

| Component | Key prop | Default shape | URL helper |
|-----------|----------|---------------|------------|
| `Instagram` | `id` shortcode, `kind` `p` \| `reel` \| `tv` | `4 / 5` | `instagramEmbedUrl` |
| `X` | `id` status id | `4 / 5` | `xEmbedUrl` |
| `Facebook` | `href` post URL, `video` | `4 / 5` | `facebookEmbedUrl` |
| `TikTok` | `id` | `9 / 16` | `tiktokEmbedUrl` |
| `Bluesky` | `id` `did/app.bsky.feed.post/rkey` | `4 / 5` | `blueskyEmbedUrl` |
| `Spotify` | `id`, `type` `track` \| `album` \| `playlist` \| `episode` \| `show` | `5 / 2` | `spotifyEmbedUrl` |
| `SoundCloud` | `id` track id | `5 / 2` | `soundcloudEmbedUrl` |
| `Reddit` | `path` or permalink | `4 / 5` | `redditEmbedUrl` |
| `CodePen` | `id` `user/pen` | `16 / 9` | `codepenEmbedUrl` |
| `Gist` | `id` `user/gistId` | `16 / 9` | `gistEmbedUrl` |

```svelte
<Instagram id="CgdzCoMoUBJ" title="Instagram post" />
<X id="20" title="Post on X" />
<Facebook href="https://www.facebook.com/facebook/posts/10153231379946729" title="Facebook post" />
<TikTok id="6718335390845095173" title="TikTok" />
```

No third-party scripts. LinkedIn, Threads, Pinterest, Twitch, and Mastodon are not included: they need a host-specific parent, an instance URL, or a widget script.

---

## `simple-svelte-embeds/urls`

Pure JS — no Svelte compiler needed.

```js
import { youtubeEmbedUrl, vimeoEmbedUrl, iframeDefaults } from 'simple-svelte-embeds/urls';

youtubeEmbedUrl(id, { privacyEnhanced: true });
instagramEmbedUrl(id, { kind: 'reel' });
xEmbedUrl(id);
facebookEmbedUrl(href, { video: false });
tiktokEmbedUrl(id);
blueskyEmbedUrl(id);
spotifyEmbedUrl(id, { type: 'track' });
soundcloudEmbedUrl(id);
redditEmbedUrl(path);
codepenEmbedUrl(id);
gistEmbedUrl(id);
```

Use with a native `<iframe>` in React, Vue, Solid, Angular, vanilla, etc.
