/** Shared iframe props. No Svelte runtime. */
export type Frame = {
	title?: string;
	aspectRatio?: string;
	loading?: 'lazy' | 'eager';
	allow?: string;
	referrerpolicy?: ReferrerPolicy;
	class?: string;
};

export type InstagramKind = 'p' | 'reel' | 'tv';
export type SpotifyType = 'track' | 'album' | 'playlist' | 'episode' | 'show';

export function youtubeEmbedUrl(id: string, opts: { privacyEnhanced?: boolean } = {}) {
	const privacyEnhanced = opts.privacyEnhanced !== false;
	return `https://www.${privacyEnhanced ? 'youtube-nocookie' : 'youtube'}.com/embed/${encodeURIComponent(id)}`;
}

export function vimeoEmbedUrl(id: string) {
	return `https://player.vimeo.com/video/${encodeURIComponent(id)}`;
}

export function instagramEmbedUrl(id: string, opts: { kind?: InstagramKind } = {}) {
	const kind = opts.kind === 'reel' || opts.kind === 'tv' ? opts.kind : 'p';
	return `https://www.instagram.com/${kind}/${encodeURIComponent(id)}/embed/`;
}

export function xEmbedUrl(id: string) {
	const url = new URL('https://platform.twitter.com/embed/Tweet.html');
	url.searchParams.set('id', id);
	url.searchParams.set('dnt', 'true');
	return url.toString();
}

export function facebookEmbedUrl(href: string, opts: { video?: boolean } = {}) {
	const url = new URL(`https://www.facebook.com/plugins/${opts.video ? 'video' : 'post'}.php`);
	url.searchParams.set('href', href);
	url.searchParams.set('show_text', opts.video ? 'false' : 'true');
	return url.toString();
}

export function tiktokEmbedUrl(id: string) {
	return `https://www.tiktok.com/player/v1/${encodeURIComponent(id)}`;
}

/** `id` is `did/app.bsky.feed.post/rkey`. */
export function blueskyEmbedUrl(id: string) {
	return `https://embed.bsky.app/embed/${encodeURI(id)}`;
}

export function spotifyEmbedUrl(id: string, opts: { type?: SpotifyType } = {}) {
	const type = opts.type ?? 'track';
	return `https://open.spotify.com/embed/${encodeURIComponent(type)}/${encodeURIComponent(id)}`;
}

export function soundcloudEmbedUrl(id: string) {
	const track = `https://api.soundcloud.com/tracks/${id}`;
	return `https://w.soundcloud.com/player/?url=${encodeURIComponent(track)}`;
}

/** Path or permalink, e.g. `r/pics/comments/abc`. */
export function redditEmbedUrl(path: string) {
	const clean = path
		.replace(/^https?:\/\/(www\.|old\.)?reddit\.com\//, '')
		.replace(/^\//, '')
		.replace(/\/$/, '');
	return `https://embed.reddit.com/${clean}`;
}

/** `id` is `user/pen`. */
export function codepenEmbedUrl(id: string) {
	const [user = '', pen = ''] = id.split('/');
	return `https://codepen.io/${encodeURIComponent(user)}/embed/${encodeURIComponent(pen)}`;
}

/** `id` is `user/gistId`. */
export function gistEmbedUrl(id: string) {
	const path = id.split('/').map(encodeURIComponent).join('/');
	return `https://gist.github.com/${path}.pibb`;
}

export const iframeDefaults = {
	aspectRatio: '16 / 9',
	loading: 'lazy' as const,
	referrerpolicy: 'strict-origin-when-cross-origin' as const,
	allow:
		'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
	allowVimeo: 'autoplay; fullscreen; picture-in-picture'
};
