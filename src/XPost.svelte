<script>
	import X from './X.svelte';

	let { id, ...rest } = $props();
</script>

<X {id} conversation={false} {...rest} />
