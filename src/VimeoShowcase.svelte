<script>
	import Embed from './Embed.svelte';

	let { id, allow = 'autoplay; fullscreen; picture-in-picture', ...rest } = $props();

	let src = $derived(`https://vimeo.com/showcase/${encodeURIComponent(id)}/embed`);
</script>

<Embed {src} {allow} {...rest} />
