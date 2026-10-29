<script lang="ts">
	import Embed from './Embed.svelte';
	import { redditEmbedUrl, type Frame } from './urls.ts';

	let { path, aspectRatio = '4 / 5', ...rest }: Frame & { path: string } = $props();

	let src = $derived(redditEmbedUrl(path));
</script>

<Embed {src} {aspectRatio} {...rest} />
