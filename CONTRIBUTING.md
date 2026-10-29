# Contributing

1. Library only — publishable code is `src/*.svelte`.
2. Components are Svelte. No JavaScript or TypeScript modules in `src/`.
3. Zero runtime `dependencies`. `svelte` is an optional peer (components only).
4. Providers stay thin wrappers around `Embed`.

```bash
npm install
npm run check
```
