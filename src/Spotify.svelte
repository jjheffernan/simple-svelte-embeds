<script lang="ts">
	import Embed from './Embed.svelte';
	import { spotifyEmbedUrl, type Frame, type SpotifyType } from './urls.ts';

	let {
		id,
		type = 'track',
		aspectRatio = '5 / 2',
		...rest
	}: Frame & { id: string; type?: SpotifyType } = $props();

	let src = $derived(spotifyEmbedUrl(id, { type }));
</script>

<Embed {src} {aspectRatio} {...rest} />
