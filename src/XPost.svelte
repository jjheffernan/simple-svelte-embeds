<script>
	import X from './X.svelte';

	let { id, aspectRatio = '4 / 5', ...rest } = $props();
</script>

<X {id} conversation={false} {aspectRatio} {...rest} />
