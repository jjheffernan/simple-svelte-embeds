<script lang="ts">
	import Embed from './Embed.svelte';
	import { facebookEmbedUrl, type Frame } from './urls.ts';

	let {
		href,
		video = false,
		aspectRatio = '4 / 5',
		...rest
	}: Frame & { href: string; video?: boolean } = $props();

	let src = $derived(facebookEmbedUrl(href, { video }));
</script>

<Embed {src} {aspectRatio} {...rest} />
