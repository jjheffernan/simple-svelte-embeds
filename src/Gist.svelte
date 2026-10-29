<script>
	import Embed from './Embed.svelte';

	let { id, ...rest } = $props();

	let src = $derived(
		`https://gist.github.com/${id.split('/').map(encodeURIComponent).join('/')}.pibb`
	);
</script>

<Embed {src} {...rest} />
