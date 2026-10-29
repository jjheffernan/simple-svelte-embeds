<script lang="ts">
	import { iframeDefaults, type Frame } from './urls.ts';

	let {
		src,
		title,
		aspectRatio = iframeDefaults.aspectRatio,
		loading = iframeDefaults.loading,
		allow = iframeDefaults.allow,
		referrerpolicy = iframeDefaults.referrerpolicy,
		class: className
	}: Frame & { src: string } = $props();
</script>

<div class={className} style:aspect-ratio={aspectRatio}>
	<iframe {src} {title} {loading} {allow} {referrerpolicy} allowfullscreen></iframe>
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
