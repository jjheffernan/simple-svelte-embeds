<script lang="ts">
	import Embed from './Embed.svelte';
	import { codepenEmbedUrl, type Frame } from './urls.ts';

	let { id, ...rest }: Frame & { id: string } = $props();

	let src = $derived(codepenEmbedUrl(id));
</script>

<Embed {src} {...rest} />
