<script lang="ts">
	import Embed from './Embed.svelte';
	import { tiktokEmbedUrl, type Frame } from './urls.ts';

	let { id, aspectRatio = '9 / 16', ...rest }: Frame & { id: string } = $props();

	let src = $derived(tiktokEmbedUrl(id));
</script>

<Embed {src} {aspectRatio} {...rest} />
