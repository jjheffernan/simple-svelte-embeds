<script>
	import Embed from './Embed.svelte';

	let { id, type = 'track', aspectRatio = '5 / 2', ...rest } = $props();

	let src = $derived(
		`https://open.spotify.com/embed/${encodeURIComponent(type)}/${encodeURIComponent(id)}`
	);
</script>

<Embed {src} {aspectRatio} {...rest} />
