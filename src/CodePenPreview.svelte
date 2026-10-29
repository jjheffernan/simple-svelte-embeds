<script>
	import CodePen from './CodePen.svelte';

	let { id, ...rest } = $props();
</script>

<CodePen {id} preview {...rest} />
