<script>
	import Embed from './Embed.svelte';

	let { id, kind = 'p', aspectRatio = '4 / 5', ...rest } = $props();

	let shape = $derived(kind === 'reel' || kind === 'tv' ? kind : 'p');
	let src = $derived(`https://www.instagram.com/${shape}/${encodeURIComponent(id)}/embed/`);
</script>

<Embed {src} {aspectRatio} {...rest} />
