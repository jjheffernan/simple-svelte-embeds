# API (draft)

## Package exports

| Export | For | Contents |
|--------|-----|----------|
| `simple-svelte-embeds` | Svelte / Kit / Astro / any Svelte-capable bundler | `YouTube`, `Vimeo`, `Embed` |
| `simple-svelte-embeds/urls` | **Any** framework (React, Vue, Solid, …) | `youtubeEmbedUrl`, `vimeoEmbedUrl`, `iframeDefaults` |

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

## `simple-svelte-embeds/urls`

Pure JS — no Svelte compiler needed.

```js
import { youtubeEmbedUrl, vimeoEmbedUrl, iframeDefaults } from 'simple-svelte-embeds/urls';

youtubeEmbedUrl(id, { privacyEnhanced: true });
vimeoEmbedUrl(id);
// iframeDefaults: { aspectRatio, loading, referrerpolicy, allow, allowVimeo }
```

Use with a native `<iframe>` in React, Vue, Solid, Angular, vanilla, etc.
