<script>
	import Embed from './Embed.svelte';

	let { id, conversation = true, aspectRatio = 'auto', height, ...rest } = $props();

	let host = $state();
	let measured = $state();
	let seenId = $state.raw('');

	let src = $derived.by(() => {
		const url = new URL('https://platform.twitter.com/embed/Tweet.html');
		url.searchParams.set('id', id);
		url.searchParams.set('dnt', 'true');
		if (!conversation) url.searchParams.set('conversation', 'none');
		return url.toString();
	});

	// Autosize only when height/aspect aren't locked by the caller.
	let unlock = $derived(height == null && aspectRatio === 'auto');
	let liveHeight = $derived(height ?? (unlock ? (measured ?? '12rem') : undefined));
	let liveAspect = $derived(unlock ? 'auto' : aspectRatio);

	$effect.pre(() => {
		if (id === seenId) return;
		seenId = id;
		measured = undefined;
	});

	$effect(() => {
		const el = host;
		if (!el || !unlock) return;

		const onMessage = (event) => {
			if (event.origin !== 'https://platform.twitter.com') return;
			const iframe = el.querySelector('iframe');
			if (!iframe || event.source !== iframe.contentWindow) return;

			let data = event.data;
			if (typeof data === 'string') {
				try {
					data = JSON.parse(data);
				} catch {
					return;
				}
			}

			const call = data?.['twttr.embed'];
			const calls = Array.isArray(call) ? call : call ? [call] : [];
			for (const c of calls) {
				if (c?.method !== 'twttr.private.resize') continue;
				const next = c.params?.[0]?.height;
				if (typeof next === 'number' && next > 0) {
					// border-box frame includes 1px chrome border on each edge
					measured = `${Math.ceil(next) + 2}px`;
				}
			}
		};

		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	});
</script>

<div class="host" bind:this={host}>
	<Embed {src} height={liveHeight} aspectRatio={liveAspect} {...rest} />
</div>

<style>
	.host {
		display: contents;
	}
</style>
