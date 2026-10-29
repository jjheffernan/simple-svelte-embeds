<script>
	import YouTubePlayer from './YouTubePlayer.svelte';

	let { id, privacyEnhanced = true, ...rest } = $props();

	let host = $derived(privacyEnhanced ? 'youtube-nocookie' : 'youtube');
	let src = $derived(`https://www.${host}.com/embed/videoseries?list=${encodeURIComponent(id)}`);
	let href = $derived(`https://www.youtube.com/playlist?list=${encodeURIComponent(id)}`);
</script>

<YouTubePlayer {src} {href} {...rest} />
