<script>
	import FacebookPage from './FacebookPage.svelte';

	let { ...rest } = $props();
</script>

<FacebookPage {...rest} />
