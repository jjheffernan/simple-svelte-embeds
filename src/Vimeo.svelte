<script>
	import Embed from './Embed.svelte';

	let { id, allow = 'autoplay; fullscreen; picture-in-picture', ...rest } = $props();

	let src = $derived(`https://player.vimeo.com/video/${encodeURIComponent(id)}`);
</script>

<Embed {src} {allow} {...rest} />
