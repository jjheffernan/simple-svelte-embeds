<script>
	import { iframeDefaults } from './urls.js';

	/**
	 * @typedef {Object} Props
	 * @property {string} src
	 * @property {string} [title]
	 * @property {string} [aspectRatio]
	 * @property {'lazy' | 'eager'} [loading]
	 * @property {string} [allow]
	 * @property {import('svelte/elements').HTMLIframeAttributes['referrerpolicy']} [referrerpolicy]
	 * @property {string} [class]
	 */

	/** @type {Props} */
	let {
		src,
		title,
		aspectRatio = iframeDefaults.aspectRatio,
		loading = iframeDefaults.loading,
		allow = iframeDefaults.allow,
		referrerpolicy = iframeDefaults.referrerpolicy,
		class: className
	} = $props();
</script>

<div class={className} style:aspect-ratio={aspectRatio}>
	<iframe
		{src}
		{title}
		{loading}
		{allow}
		{referrerpolicy}
		allowfullscreen
	></iframe>
</div>

<style>
	div {
		width: 100%;
	}

	iframe {
		width: 100%;
		height: 100%;
		border: 0;
	}
</style>
