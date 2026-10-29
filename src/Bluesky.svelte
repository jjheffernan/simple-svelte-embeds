<script>
	import Embed from './Embed.svelte';

	let { id, aspectRatio = '4 / 5', ...rest } = $props();

	let src = $derived(`https://embed.bsky.app/embed/${encodeURI(id)}`);
</script>

<Embed {src} {aspectRatio} {...rest} />
