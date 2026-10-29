<script>
	import Embed from './Embed.svelte';

	let { href, video = false, aspectRatio = '4 / 5', ...rest } = $props();

	let src = $derived.by(() => {
		const url = new URL(`https://www.facebook.com/plugins/${video ? 'video' : 'post'}.php`);
		url.searchParams.set('href', href);
		url.searchParams.set('show_text', video ? 'false' : 'true');
		return url.toString();
	});
</script>

<Embed {src} {aspectRatio} {...rest} />
