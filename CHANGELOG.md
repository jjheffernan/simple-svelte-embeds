# Changelog

## Unreleased

First public npm release will be **0.1.0**. Until then, install from git:

```bash
npm install github:jjheffernan/simple-svelte-embeds
```

### Added

- `Embed` + `Frame` primitive with CSS vars, chrome, and corner resize
- YouTube (video, Shorts, playlist, podcast, profile) with click-to-play facade
- Vimeo, Instagram, Facebook, X, TikTok, Bluesky, Spotify, SoundCloud, Reddit, CodePen, Gist
- Profile widgets where platforms expose iframes (`YouTubeProfile`, `InstagramProfile`, `FacebookProfile`, `SpotifyProfile`, `SoundCloudProfile`)
- X / `XPost` auto-height via `twttr.private.resize`
- Demo app + `/gallery`, Playwright layout/embed tests, CI on `svelte@latest`

### Notes

- Svelte 5 only; publish `src/*.svelte` with no runtime dependencies
- X/TikTok/Bluesky/Vimeo/Reddit/CodePen/Gist profile embeds stay out — no public iframe
