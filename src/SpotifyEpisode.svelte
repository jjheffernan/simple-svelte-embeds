<script>
	import Spotify from './Spotify.svelte';

	let { id, aspectRatio = '5 / 2', ...rest } = $props();
</script>

<Spotify {id} type="episode" {aspectRatio} {...rest} />
