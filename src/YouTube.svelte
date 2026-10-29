<script lang="ts">
	import Embed from './Embed.svelte';
	import { youtubeEmbedUrl, type Frame } from './urls.ts';

	let {
		id,
		privacyEnhanced = true,
		...rest
	}: Frame & { id: string; privacyEnhanced?: boolean } = $props();

	let src = $derived(youtubeEmbedUrl(id, { privacyEnhanced }));
</script>

<Embed {src} {...rest} />
