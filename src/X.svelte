<script>
	import Embed from './Embed.svelte';

	let { id, conversation = true, aspectRatio = '4 / 5', ...rest } = $props();

	let src = $derived.by(() => {
		const url = new URL('https://platform.twitter.com/embed/Tweet.html');
		url.searchParams.set('id', id);
		url.searchParams.set('dnt', 'true');
		if (!conversation) url.searchParams.set('conversation', 'none');
		return url.toString();
	});
</script>

<Embed {src} {aspectRatio} {...rest} />
