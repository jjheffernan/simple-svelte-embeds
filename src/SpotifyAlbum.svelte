<script>
	import Spotify from './Spotify.svelte';

	let { id, aspectRatio = '1 / 1', ...rest } = $props();
</script>

<Spotify {id} type="album" {aspectRatio} {...rest} />
