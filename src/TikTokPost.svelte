<script>
	import Embed from './Embed.svelte';

	let { id, aspectRatio = '9 / 16', ...rest } = $props();

	let src = $derived(`https://www.tiktok.com/embed/v2/${encodeURIComponent(id)}`);
</script>

<Embed {src} {aspectRatio} {...rest} />
