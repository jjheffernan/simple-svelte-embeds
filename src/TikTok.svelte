<script>
	import Embed from './Embed.svelte';

	let { id, aspectRatio = '9 / 16', ...rest } = $props();

	let src = $derived(`https://www.tiktok.com/player/v1/${encodeURIComponent(id)}`);
</script>

<Embed {src} {aspectRatio} {...rest} />
