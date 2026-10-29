<script lang="ts">
	import Embed from './Embed.svelte';
	import { iframeDefaults, vimeoEmbedUrl, type Frame } from './urls.ts';

	let { id, allow = iframeDefaults.allowVimeo, ...rest }: Frame & { id: string } = $props();

	let src = $derived(vimeoEmbedUrl(id));
</script>

<Embed {src} {allow} {...rest} />
