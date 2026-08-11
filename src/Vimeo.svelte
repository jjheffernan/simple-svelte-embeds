<script>
	import Embed from './Embed.svelte';
	import { iframeDefaults, vimeoEmbedUrl } from './urls.js';

	/**
	 * @typedef {Object} Props
	 * @property {string} id
	 * @property {string} [title]
	 * @property {string} [aspectRatio]
	 * @property {'lazy' | 'eager'} [loading]
	 * @property {string} [allow]
	 * @property {import('svelte/elements').HTMLIframeAttributes['referrerpolicy']} [referrerpolicy]
	 * @property {string} [class]
	 */

	/** @type {Props} */
	let { id, allow = iframeDefaults.allowVimeo, ...rest } = $props();

	let src = $derived(vimeoEmbedUrl(id));
</script>

<Embed {src} {allow} {...rest} />
