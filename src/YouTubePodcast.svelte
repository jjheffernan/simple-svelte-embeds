<script>
	import YouTubePlayer from './YouTubePlayer.svelte';

	let { id, episode, privacyEnhanced = true, ...rest } = $props();

	let host = $derived(privacyEnhanced ? 'youtube-nocookie' : 'youtube');
	let path = $derived(episode ? encodeURIComponent(episode) : 'videoseries');
	let src = $derived(`https://www.${host}.com/embed/${path}?list=${encodeURIComponent(id)}`);
	let poster = $derived(episode ? `https://i.ytimg.com/vi/${encodeURIComponent(episode)}/hqdefault.jpg` : undefined);
	let href = $derived(
		episode
			? `https://www.youtube.com/watch?v=${encodeURIComponent(episode)}&list=${encodeURIComponent(id)}`
			: `https://www.youtube.com/playlist?list=${encodeURIComponent(id)}`
	);
</script>

<YouTubePlayer {src} {poster} {href} {...rest} />
