<script>
	import Embed from './Embed.svelte';
	import { youtubeEmbedUrl } from './urls.js';

	/**
	 * @typedef {Object} Props
	 * @property {string} id
	 * @property {boolean} [privacyEnhanced]
	 * @property {string} [title]
	 * @property {string} [aspectRatio]
	 * @property {'lazy' | 'eager'} [loading]
	 * @property {string} [allow]
	 * @property {import('svelte/elements').HTMLIframeAttributes['referrerpolicy']} [referrerpolicy]
	 * @property {string} [class]
	 */

	/** @type {Props} */
	let { id, privacyEnhanced = true, ...rest } = $props();

	let src = $derived(youtubeEmbedUrl(id, { privacyEnhanced }));
</script>

<Embed {src} {...rest} />
