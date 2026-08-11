/**
 * Framework-agnostic embed URL helpers (no Svelte runtime).
 * Use with a plain <iframe> in React, Vue, Solid, etc.
 */

/** @param {string} id @param {{ privacyEnhanced?: boolean }} [opts] */
export function youtubeEmbedUrl(id, opts = {}) {
	const privacyEnhanced = opts.privacyEnhanced !== false;
	return `https://www.${privacyEnhanced ? 'youtube-nocookie' : 'youtube'}.com/embed/${encodeURIComponent(id)}`;
}

/** @param {string} id */
export function vimeoEmbedUrl(id) {
	return `https://player.vimeo.com/video/${encodeURIComponent(id)}`;
}

/** Shared iframe attribute defaults (match Embed.svelte). */
export const iframeDefaults = {
	aspectRatio: '16 / 9',
	loading: /** @type {'lazy'} */ ('lazy'),
	referrerpolicy: /** @type {'strict-origin-when-cross-origin'} */ ('strict-origin-when-cross-origin'),
	allow:
		'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
	allowVimeo: 'autoplay; fullscreen; picture-in-picture'
};
