<script>
	import YouTubePlayer from './YouTubePlayer.svelte';

	let { id, privacyEnhanced = true, ...rest } = $props();

	let host = $derived(privacyEnhanced ? 'youtube-nocookie' : 'youtube');
	let list = $derived(id.startsWith('UC') ? `UU${id.slice(2)}` : id);
	let src = $derived.by(() => {
		const base = `https://www.${host}.com/embed`;
		if (list.startsWith('UU')) {
			return `${base}/videoseries?list=${encodeURIComponent(list)}`;
		}
		return `${base}?listType=user_uploads&list=${encodeURIComponent(list)}`;
	});
	let href = $derived(
		list.startsWith('UU')
			? `https://www.youtube.com/playlist?list=${encodeURIComponent(list)}`
			: `https://www.youtube.com/@${encodeURIComponent(list)}`
	);
</script>

<YouTubePlayer {src} {href} {...rest} />
