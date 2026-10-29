<script lang="ts">
	import Embed from './Embed.svelte';
	import { gistEmbedUrl, type Frame } from './urls.ts';

	let { id, ...rest }: Frame & { id: string } = $props();

	let src = $derived(gistEmbedUrl(id));
</script>

<Embed {src} {...rest} />
