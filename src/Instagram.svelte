<script lang="ts">
	import Embed from './Embed.svelte';
	import { instagramEmbedUrl, type Frame, type InstagramKind } from './urls.ts';

	let {
		id,
		kind = 'p',
		aspectRatio = '4 / 5',
		...rest
	}: Frame & { id: string; kind?: InstagramKind } = $props();

	let src = $derived(instagramEmbedUrl(id, { kind }));
</script>

<Embed {src} {aspectRatio} {...rest} />
