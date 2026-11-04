<script>
	import Frame from './Frame.svelte';

	let {
		src,
		title,
		width,
		height,
		maxWidth,
		maxHeight,
		aspectRatio,
		style,
		loading = 'lazy',
		allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
		referrerpolicy = 'strict-origin-when-cross-origin',
		class: className,
		chrome = true,
		resizable = true,
		onresize
	} = $props();
</script>

<Frame {width} {height} {maxWidth} {maxHeight} {aspectRatio} {style} class={className} {chrome} {resizable} {onresize}>
	<iframe {src} {title} {loading} {allow} {referrerpolicy} allowfullscreen></iframe>
</Frame>

<style>
	iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
		background: inherit;
	}
</style>
