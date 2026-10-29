# API (draft)

## Package exports

Import the component file. There is no JavaScript entry.

```svelte
import YouTube from 'simple-svelte-embeds/YouTube.svelte';
import Embed from 'simple-svelte-embeds/Embed.svelte';
```

`svelte` is an optional peer — required only when a Svelte compiler loads these files.

## Size

The frame is one box. Any of these sets it:

| Method | Example |
|--------|---------|
| Props | `<YouTube width="640px" height="360px" />` or `aspectRatio="16 / 9"` |
| Parent CSS | `--embed-width`, `--embed-height`, `--embed-max-width`, `--embed-max-height`, `--embed-aspect` |
| `style` | `style="width: 640px; height: 360px"` |

```svelte
<YouTube id="dQw4w9WgXcQ" title="Demo" width="40rem" aspectRatio="16 / 9" />
```

```css
.player {
	--embed-width: min(100%, 40rem);
	--embed-aspect: 16 / 9;
}
```

```svelte
<YouTube id="dQw4w9WgXcQ" title="Demo" style="width: 640px; height: 360px" />
```

Props set the custom properties on the frame. Leave a prop unset when a parent variable should apply. `style` writes the box directly, so it wins over the variables.

Drag the corner handle, or focus it and use the arrow keys (Shift moves 32px). The handle calls `onresize` with `{ width, height }` in pixels and the frame element. `resizable={false}` removes it. `--embed-grip` sets the handle size (default `2.75rem`). A later `width` or `height` prop replaces the dragged size.

| Prop | Default | CSS |
|------|---------|-----|
| `width` | `100%` | `--embed-width` |
| `height` | `auto` | `--embed-height` |
| `maxWidth` | `none` | `--embed-max-width` |
| `maxHeight` | `none` | `--embed-max-height` |
| `aspectRatio` | `16 / 9` | `--embed-aspect` |

Portrait widgets pass their own `aspectRatio` (`9 / 16`, `4 / 5`, `1 / 1`, `5 / 2`, `4 / 3`). Shorts also default `maxWidth` to `min(100%, 20rem, calc(46dvh * 9 / 16))`.

Shared iframe props:

| Prop | Default | Notes |
|------|---------|-------|
| `title` | — | Required for a11y in practice |
| `loading` | `'lazy'` | Native iframe `loading` |
| `allow` | provider-sensible default | iframe `allow` |
| `referrerpolicy` | `'strict-origin-when-cross-origin'` | Avoids YouTube Error 153 |
| `class` | — | On the frame |
| `style` | — | On the frame |

---

## `YouTube`

```svelte
<YouTube id="dQw4w9WgXcQ" title="Demo" />
```

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `id` | `string` | yes | Video id (not full URL in v1) |
| `privacyEnhanced` | `boolean` | no | Default `true` → `youtube-nocookie.com` |

A poster button loads the player on tap (`autoplay=1`). “Watch on YouTube” opens the watch page. Same interaction on the widgets below.

| Component | File | Id | Shape |
|-----------|------|----|-------|
| `YouTubeShorts` | `YouTubeShorts.svelte` | short id | `9 / 16`, capped width, loops |
| `YouTubePodcast` | `YouTubePodcast.svelte` | playlist id, optional `episode` | `16 / 9` |
| `YouTubePlaylist` | `YouTubePlaylist.svelte` | playlist id | `16 / 9` |

YouTube community posts have no public iframe. A live video uses `YouTube` with the video id. Live chat needs the embedding hostname, so it is not included.

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

| Component | File | Key prop | Default shape |
|-----------|------|----------|---------------|
| `Vimeo` | `Vimeo.svelte` | `id` | `16 / 9` |
| `VimeoShowcase` | `VimeoShowcase.svelte` | `id` | `16 / 9` |
| `Instagram` | `Instagram.svelte` | `id` shortcode | `4 / 5` |
| `InstagramReel` | `InstagramReel.svelte` | `id` | `4 / 5` |
| `InstagramTV` | `InstagramTV.svelte` | `id` | `4 / 5` |
| `XPost` | `XPost.svelte` | `id` status id | `4 / 5`, single post |
| `X` | `X.svelte` | `id` status id | `4 / 5`, thread |
| `Facebook` | `Facebook.svelte` | `href` post URL | `4 / 5` |
| `FacebookVideo` | `FacebookVideo.svelte` | `href` video URL | `16 / 9` |
| `FacebookPage` | `FacebookPage.svelte` | `href` page URL | `4 / 5` |
| `TikTok` | `TikTok.svelte` | `id` | `9 / 16`, player |
| `TikTokPost` | `TikTokPost.svelte` | `id` | `9 / 16`, card |
| `Bluesky` | `Bluesky.svelte` | `id` `did/app.bsky.feed.post/rkey` | `4 / 5` |
| `Spotify` | `Spotify.svelte` | `id` track | `5 / 2` |
| `SpotifyAlbum` / `SpotifyPlaylist` / `SpotifyShow` | matching `.svelte` file | `id` | `1 / 1` |
| `SpotifyEpisode` | `SpotifyEpisode.svelte` | `id` | `5 / 2` |
| `SoundCloud` | `SoundCloud.svelte` | `id` track | `5 / 2` |
| `SoundCloudPlaylist` / `SoundCloudProfile` | matching `.svelte` file | `id` | `4 / 3` |
| `Reddit` | `Reddit.svelte` | `path` post permalink | `4 / 5` |
| `RedditComment` | `RedditComment.svelte` | `path` comment permalink | `4 / 5` |
| `CodePen` | `CodePen.svelte` | `id` `user/pen` | `16 / 9` |
| `CodePenPreview` | `CodePenPreview.svelte` | `id` `user/pen` | `16 / 9`, result only |
| `Gist` | `Gist.svelte` | `id` `user/gistId` | `16 / 9` |

Bluesky and Gist each publish one iframe, so they have one widget.

```svelte
<Instagram id="CgdzCoMoUBJ" title="Instagram post" />
<X id="20" title="Post on X" />
<Facebook href="https://www.facebook.com/facebook/posts/10153231379946729" title="Facebook post" />
<TikTok id="6718335390845095173" title="TikTok" />
```

No third-party scripts. LinkedIn, Threads, Pinterest, Twitch, and Mastodon are not included: they need a host-specific parent, an instance URL, or a widget script.
