<script>
	import Facebook from './Facebook.svelte';

	let { href, aspectRatio = '16 / 9', ...rest } = $props();
</script>

<Facebook {href} video {aspectRatio} {...rest} />
