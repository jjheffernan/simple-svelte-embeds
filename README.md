# simple-svelte-embeds

Minimal iframe embeds (YouTube, Vimeo, generic). **Zero runtime dependencies.**

- **Svelte hosts** — components (`YouTube`, `Vimeo`, `Embed`)
- **Any other framework** — tiny URL helpers + a plain `<iframe>` (no React/Vue wrappers, no web-component build)

## Install

```bash
npm install simple-svelte-embeds
```

`svelte` is an **optional** peer: required only if you import the Svelte components.

## Framework support

| Host | How to use | Bloat |
|------|------------|-------|
| SvelteKit / Vite+Svelte | `import { YouTube } from 'simple-svelte-embeds'` | none |
| Astro | `@astrojs/svelte` + same import (e.g. `client:visible`) | none |
| Webpack / Rollup / Parcel + svelte plugin | same as Vite+Svelte | none |
| React / Next / Remix | `simple-svelte-embeds/urls` + `<iframe>` | none |
| Vue / Nuxt | `simple-svelte-embeds/urls` + `<iframe>` | none |
| Solid / Qwik / Angular / vanilla | `simple-svelte-embeds/urls` + `<iframe>` | none |

No framework adapters are published. Do not import `.svelte` entries from a bundler that cannot compile Svelte.

### Svelte / SvelteKit / Astro

```svelte
<script>
	import { YouTube, Vimeo, Embed } from 'simple-svelte-embeds';
</script>

<YouTube id="dQw4w9WgXcQ" title="Demo video" />
<Vimeo id="148751763" title="Demo video" />
<Embed src="https://example.com/embed" title="Custom embed" />
```

```astro
---
import { YouTube } from 'simple-svelte-embeds';
---
<YouTube client:visible id="dQw4w9WgXcQ" title="Demo" />
```

### React / Next (and other non-Svelte)

```js
import { youtubeEmbedUrl, vimeoEmbedUrl, iframeDefaults } from 'simple-svelte-embeds/urls';
```

```jsx
<iframe
  src={youtubeEmbedUrl('dQw4w9WgXcQ')}
  title="Demo video"
  loading={iframeDefaults.loading}
  allow={iframeDefaults.allow}
  referrerPolicy={iframeDefaults.referrerpolicy}
  allowFullScreen
  style={{ aspectRatio: iframeDefaults.aspectRatio, width: '100%', border: 0 }}
/>
```

Same helpers work in Vue, Solid, etc. — only the JSX/template syntax changes.

## Develop

```bash
npm install
npm run check
```

Published artifact is `src/` (no build step).

API: [docs/API.md](docs/API.md) · Design: [docs/DESIGN.md](docs/DESIGN.md)

## License

[MIT](LICENSE)
