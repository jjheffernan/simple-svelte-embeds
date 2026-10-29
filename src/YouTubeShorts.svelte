<script>
	import YouTubePlayer from './YouTubePlayer.svelte';

	let {
		id,
		privacyEnhanced = true,
		aspectRatio = '9 / 16',
		maxWidth = 'min(100%, 20rem, calc(46dvh * 9 / 16))',
		...rest
	} = $props();

	let host = $derived(privacyEnhanced ? 'youtube-nocookie' : 'youtube');
	let clip = $derived(encodeURIComponent(id));
	let src = $derived(`https://www.${host}.com/embed/${clip}?loop=1&playlist=${clip}`);
	let poster = $derived(`https://i.ytimg.com/vi/${clip}/oardefault.jpg`);
	let href = $derived(`https://www.youtube.com/shorts/${clip}`);
</script>

<YouTubePlayer {src} {poster} {href} {aspectRatio} {maxWidth} {...rest} />
