<script>
	import Embed from './Embed.svelte';

	let { id, aspectRatio = '4 / 5', ...rest } = $props();

	let src = $derived(`https://www.instagram.com/${encodeURIComponent(id)}/embed/`);
</script>

<Embed {src} {aspectRatio} {...rest} />
