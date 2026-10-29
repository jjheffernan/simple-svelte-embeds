<script>
	import Embed from './Embed.svelte';

	let { id, kind = 'track', aspectRatio = '5 / 2', ...rest } = $props();

	let collection = $derived(kind === 'playlist' ? 'playlists' : kind === 'user' ? 'users' : 'tracks');
	let src = $derived(
		`https://w.soundcloud.com/player/?url=${encodeURIComponent(`https://api.soundcloud.com/${collection}/${id}`)}`
	);
</script>

<Embed {src} {aspectRatio} {...rest} />
