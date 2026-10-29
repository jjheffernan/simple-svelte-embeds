<script>
	import Reddit from './Reddit.svelte';

	let { path, aspectRatio = '4 / 5', ...rest } = $props();
</script>

<Reddit {path} {aspectRatio} {...rest} />
