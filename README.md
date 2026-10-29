# simple-svelte-embeds

Minimal Svelte iframe embeds. **Zero runtime dependencies.** Each widget is a `.svelte` file.

## Install

```bash
npm install simple-svelte-embeds
```

`svelte` is an **optional** peer: required only if you import the components.

## Use

SvelteKit, Vite, Astro (`@astrojs/svelte`), or any bundler that compiles Svelte:

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

```astro
---
import YouTube from 'simple-svelte-embeds/YouTube.svelte';
---
<YouTube client:visible id="dQw4w9WgXcQ" title="Demo" />
```

Size the frame with props (`width`, `height`, `maxWidth`, `maxHeight`, `aspectRatio`), the same names as CSS variables on a parent (`--embed-width`, `--embed-height`, `--embed-max-width`, `--embed-max-height`, `--embed-aspect`), or a `style` attribute. Details: [docs/API.md](docs/API.md).

## Demo

A SvelteKit page in `demo/` renders the Svelte components on Cloudflare Workers. It is not part of the published package.

```bash
npm install --prefix demo
npm run dev --prefix demo
npm run deploy --prefix demo
```

## Develop

```bash
npm install
npm run check
npm test
```

Published artifact is `src/` (no build step).

API: [docs/API.md](docs/API.md) · Design: [docs/DESIGN.md](docs/DESIGN.md)

## License

[MIT](LICENSE)
