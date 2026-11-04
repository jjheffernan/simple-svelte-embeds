# simple-svelte-embeds

Drop-in iframe embeds for **Svelte 5**. One import, one component, real iframe — no SDKs, no adapters, no runtime deps.

```svelte
<script>
	import YouTube from 'simple-svelte-embeds/YouTube.svelte';
</script>

<YouTube id="dQw4w9WgXcQ" title="Never Gonna Give You Up" />
```

Poster first. Tap to play. Drag the corner to resize. Ship it.

## Why Svelte people like it

- **Svelte 5 only** — `$props`, `$derived`, published `.svelte` source. You compile it; nothing else does.
- **Zero runtime deps** — no player SDKs, no oEmbed fetchers, no “framework adapters.”
- **Import what you use** — tree-shake by path. `YouTube.svelte` does not pull in TikTok.
- **Privacy-first YouTube** — `youtube-nocookie.com` by default, click-to-load facade, “Watch on YouTube” link.
- **Sized like CSS** — props, parent custom properties, `style`, or a corner drag handle. Same box everywhere.

Works anywhere a Svelte compiler does: SvelteKit, Vite + Svelte, Astro (`@astrojs/svelte`).

## Install

```bash
npm install simple-svelte-embeds
```

`svelte` `^5` is an optional peer — required only when you import the components.

## Quick start

```svelte
<script>
	import Embed from 'simple-svelte-embeds/Embed.svelte';
	import InstagramReel from 'simple-svelte-embeds/InstagramReel.svelte';
	import SpotifyPlaylist from 'simple-svelte-embeds/SpotifyPlaylist.svelte';
	import Vimeo from 'simple-svelte-embeds/Vimeo.svelte';
	import X from 'simple-svelte-embeds/X.svelte';
	import YouTube from 'simple-svelte-embeds/YouTube.svelte';
	import YouTubeShorts from 'simple-svelte-embeds/YouTubeShorts.svelte';
</script>

<YouTube id="dQw4w9WgXcQ" title="Demo video" width="40rem" />
<YouTubeShorts id="pVRefGmQDJM" title="Short" />
<InstagramReel id="CgdzCoMoUBJ" title="Reel" />
<SpotifyPlaylist id="37i9dQZF1DXcBWIGoYBM5M" title="Playlist" />
<Vimeo id="148751763" title="Demo video" />
<X id="20" title="Post on X" style="width: 24rem; aspect-ratio: 4 / 5" />
<Embed src="https://example.com/embed" title="Custom embed" />
```

Astro:

```astro
---
import YouTube from 'simple-svelte-embeds/YouTube.svelte';
---
<YouTube client:visible id="dQw4w9WgXcQ" title="Demo" />
```

## Size it your way

One frame. Pick a method:

| Method | Example |
|--------|---------|
| Props | `<YouTube width="40rem" aspectRatio="16 / 9" />` |
| Parent CSS | `--embed-width`, `--embed-height`, `--embed-aspect`, … |
| `style` | `style="width: 640px; height: 360px"` |
| Drag | corner handle · arrow keys · `onresize` · `resizable={false}` |

```css
.player {
	--embed-width: min(100%, 40rem);
	--embed-aspect: 16 / 9;
}
```

Full sizing notes: [docs/API.md](docs/API.md).

## Widgets

| Platform | Components |
|----------|------------|
| YouTube | `YouTube`, `YouTubeShorts`, `YouTubePodcast`, `YouTubePlaylist` |
| Vimeo | `Vimeo`, `VimeoShowcase` |
| Instagram | `Instagram`, `InstagramReel`, `InstagramTV` |
| X | `X`, `XPost` |
| Facebook | `Facebook`, `FacebookVideo`, `FacebookPage` |
| TikTok | `TikTok`, `TikTokPost` |
| Spotify | `Spotify`, `SpotifyAlbum`, `SpotifyPlaylist`, `SpotifyEpisode`, `SpotifyShow` |
| SoundCloud | `SoundCloud`, `SoundCloudPlaylist`, `SoundCloudProfile` |
| Reddit | `Reddit`, `RedditComment` |
| CodePen | `CodePen`, `CodePenPreview` |
| Bluesky · Gist · anything | `Bluesky`, `Gist`, `Embed` |

Import the file: `simple-svelte-embeds/YouTubeShorts.svelte`.

## Demo

Try every widget in the SvelteKit demo (Cloudflare Workers ready):

```bash
npm install --prefix demo
npm run demo
```

## Develop

```bash
npm install
npm run check
npm test
```

Published artifact is `src/` — no build step, no `dist/`.

CI runs `svelte-check` and Playwright against `svelte@latest` on every PR, and Dependabot opens weekly Svelte bumps.

API · [docs/API.md](docs/API.md) · Design · [docs/DESIGN.md](docs/DESIGN.md)

## License

[MIT](LICENSE)
