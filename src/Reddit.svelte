<script>
	import Embed from './Embed.svelte';

	let { path, aspectRatio = '4 / 5', ...rest } = $props();

	let clean = $derived(
		path
			.replace(/^https?:\/\/(www\.|old\.)?reddit\.com\//, '')
			.replace(/^\//, '')
			.replace(/\/$/, '')
	);
	let src = $derived(`https://embed.reddit.com/${clean}`);
</script>

<Embed {src} {aspectRatio} {...rest} />
