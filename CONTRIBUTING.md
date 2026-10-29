# Contributing

1. Library only — publishable code is `src/*.svelte`, `src/urls.ts`, and `index.js`.
2. Prefer **Svelte for components**. Required script is TypeScript. Shared URL logic lives in `urls.ts` so non-Svelte apps need no adapters.
3. Zero runtime `dependencies`. `svelte` is an optional peer (components only).
4. Providers stay thin wrappers around `Embed`.

```bash
npm install
npm run check
```
