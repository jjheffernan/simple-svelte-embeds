<script>
	import YouTubePlayer from './YouTubePlayer.svelte';

	let { id, privacyEnhanced = true, ...rest } = $props();

	let host = $derived(privacyEnhanced ? 'youtube-nocookie' : 'youtube');
	let src = $derived(`https://www.${host}.com/embed/${encodeURIComponent(id)}`);
	let poster = $derived(`https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`);
	let href = $derived(`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`);
</script>

<YouTubePlayer {src} {poster} {href} {...rest} />
