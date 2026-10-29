<script>
	import Embed from './Embed.svelte';

	let { id, preview = false, ...rest } = $props();

	let src = $derived.by(() => {
		const [user = '', pen = ''] = id.split('/');
		const mode = preview ? 'embed/preview' : 'embed';
		return `https://codepen.io/${encodeURIComponent(user)}/${mode}/${encodeURIComponent(pen)}`;
	});
</script>

<Embed {src} {...rest} />
