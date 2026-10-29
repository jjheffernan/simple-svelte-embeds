<script>
	import SoundCloud from './SoundCloud.svelte';

	let { id, aspectRatio = '4 / 3', ...rest } = $props();
</script>

<SoundCloud {id} kind="playlist" {aspectRatio} {...rest} />
