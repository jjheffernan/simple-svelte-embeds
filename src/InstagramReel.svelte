<script>
	import Instagram from './Instagram.svelte';

	let { id, aspectRatio = '4 / 5', ...rest } = $props();
</script>

<Instagram {id} kind="reel" {aspectRatio} {...rest} />
