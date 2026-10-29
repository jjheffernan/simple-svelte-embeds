<script>
	import Embed from './Embed.svelte';

	let { href, aspectRatio = '4 / 5', ...rest } = $props();

	let src = $derived.by(() => {
		const url = new URL('https://www.facebook.com/plugins/page.php');
		url.searchParams.set('href', href);
		url.searchParams.set('tabs', 'timeline');
		url.searchParams.set('small_header', 'true');
		url.searchParams.set('adapt_container_width', 'true');
		url.searchParams.set('hide_cover', 'false');
		url.searchParams.set('show_facepile', 'false');
		return url.toString();
	});
</script>

<Embed {src} {aspectRatio} {...rest} />
