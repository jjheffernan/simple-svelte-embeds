<script lang="ts">
	import Embed from './Embed.svelte';
	import { xEmbedUrl, type Frame } from './urls.ts';

	let { id, aspectRatio = '4 / 5', ...rest }: Frame & { id: string } = $props();

	let src = $derived(xEmbedUrl(id));
</script>

<Embed {src} {aspectRatio} {...rest} />
