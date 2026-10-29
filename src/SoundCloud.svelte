<script lang="ts">
	import Embed from './Embed.svelte';
	import { soundcloudEmbedUrl, type Frame } from './urls.ts';

	let { id, aspectRatio = '5 / 2', ...rest }: Frame & { id: string } = $props();

	let src = $derived(soundcloudEmbedUrl(id));
</script>

<Embed {src} {aspectRatio} {...rest} />
