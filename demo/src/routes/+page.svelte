<script lang="ts">
	import { page } from '$app/state';
	import Bluesky from '../../../src/Bluesky.svelte';
	import CodePen from '../../../src/CodePen.svelte';
	import Embed from '../../../src/Embed.svelte';
	import Facebook from '../../../src/Facebook.svelte';
	import Gist from '../../../src/Gist.svelte';
	import Instagram from '../../../src/Instagram.svelte';
	import Reddit from '../../../src/Reddit.svelte';
	import SoundCloud from '../../../src/SoundCloud.svelte';
	import Spotify from '../../../src/Spotify.svelte';
	import TikTok from '../../../src/TikTok.svelte';
	import Vimeo from '../../../src/Vimeo.svelte';
	import X from '../../../src/X.svelte';
	import YouTube from '../../../src/YouTube.svelte';

	const tabs = [
		{ id: 'youtube', label: 'YouTube', hint: 'Video id', wide: true, sample: 'dQw4w9WgXcQ' },
		{ id: 'vimeo', label: 'Vimeo', hint: 'Video id', wide: true, sample: '148751763' },
		{ id: 'instagram', label: 'Instagram', hint: 'Shortcode', wide: false, sample: 'CgdzCoMoUBJ' },
		{ id: 'x', label: 'X', hint: 'Status id', wide: false, sample: '20' },
		{
			id: 'facebook',
			label: 'Facebook',
			hint: 'Post URL',
			wide: false,
			sample: 'https://www.facebook.com/facebook/posts/10153231379946729'
		},
		{ id: 'tiktok', label: 'TikTok', hint: 'Video id', wide: false, sample: '6718335390845095173' },
		{ id: 'bluesky', label: 'Bluesky', hint: 'did/app.bsky.feed.post/rkey', wide: false, sample: '' },
		{ id: 'spotify', label: 'Spotify', hint: 'Track id', wide: true, sample: '4cOdK2wGLETKBW3PvgPWqT' },
		{ id: 'soundcloud', label: 'SoundCloud', hint: 'Track id', wide: true, sample: '' },
		{ id: 'reddit', label: 'Reddit', hint: 'Post path or permalink', wide: false, sample: '' },
		{ id: 'codepen', label: 'CodePen', hint: 'user/pen', wide: true, sample: '' },
		{ id: 'gist', label: 'Gist', hint: 'user/gist id', wide: true, sample: '' },
		{
			id: 'embed',
			label: 'Embed',
			hint: 'Embed URL',
			wide: true,
			sample: 'https://www.youtube-nocookie.com/embed/jNQXAC9IVRw'
		}
	] as const;

	type TabId = (typeof tabs)[number]['id'];

	let values = $state(
		Object.fromEntries(tabs.map((item) => [item.id, item.sample])) as Record<TabId, string>
	);

	let tab = $derived(page.url.searchParams.get('tab') ?? 'youtube');
	let current = $derived(tabs.find((item) => item.id === tab) ?? tabs[0]);
	let value = $derived(values[current.id].trim());
</script>

<svelte:head>
	<title>{current.label} — simple-svelte-embeds</title>
</svelte:head>

<main>
	<header>
		<h1>simple-svelte-embeds</h1>
		<p>One iframe per tab. Nothing loads until you open it.</p>
	</header>

	<nav aria-label="Embeds" data-sveltekit-reset="false">
		{#each tabs as item (item.id)}
			<a href="?tab={item.id}" aria-current={item.id === current.id ? 'page' : undefined}>
				{item.label}
			</a>
		{/each}
	</nav>

	<section class={{ narrow: !current.wide }}>
		<label>
			{current.hint}
			<input bind:value={values[current.id]} autocomplete="off" spellcheck="false" />
		</label>
		{#if value}
			{#if current.id === 'youtube'}
				<YouTube id={value} title="YouTube demo" />
			{:else if current.id === 'vimeo'}
				<Vimeo id={value} title="Vimeo demo" />
			{:else if current.id === 'instagram'}
				<Instagram id={value} title="Instagram demo" />
			{:else if current.id === 'x'}
				<X id={value} title="X demo" />
			{:else if current.id === 'facebook'}
				<Facebook href={value} title="Facebook demo" />
			{:else if current.id === 'tiktok'}
				<TikTok id={value} title="TikTok demo" />
			{:else if current.id === 'bluesky'}
				<Bluesky id={value} title="Bluesky demo" />
			{:else if current.id === 'spotify'}
				<Spotify id={value} title="Spotify demo" />
			{:else if current.id === 'soundcloud'}
				<SoundCloud id={value} title="SoundCloud demo" />
			{:else if current.id === 'reddit'}
				<Reddit path={value} title="Reddit demo" />
			{:else if current.id === 'codepen'}
				<CodePen id={value} title="CodePen demo" />
			{:else if current.id === 'gist'}
				<Gist id={value} title="Gist demo" />
			{:else}
				<Embed src={value} title="Custom embed" />
			{/if}
		{:else}
			<p class="empty">Enter an id to preview.</p>
		{/if}
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		background: light-dark(#f4f3ef, #111110);
		color: light-dark(#1c1b19, #f4f3ef);
	}

	main {
		max-width: 46rem;
		margin: 0 auto;
		padding: 2.5rem 1.25rem 4rem;
		font-family: system-ui, sans-serif;
	}

	header p {
		margin: 0.35rem 0 0;
		color: light-dark(#5e5c57, #a8a69f);
	}

	h1 {
		margin: 0;
		font-size: 1.35rem;
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin: 1.5rem 0 1rem;
	}

	a {
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		color: inherit;
		font-size: 0.875rem;
		text-decoration: none;
	}

	a[aria-current='page'] {
		background: light-dark(#1c1b19, #f4f3ef);
		color: light-dark(#f4f3ef, #1c1b19);
	}

	section {
		padding: 1rem;
		border: 1px solid light-dark(#e3e1da, #2c2b28);
		border-radius: 1rem;
		background: light-dark(#fff, #1a1917);
	}

	.narrow {
		width: min(100%, 22rem);
	}

	label {
		display: grid;
		gap: 0.4rem;
		margin-bottom: 1rem;
		font-size: 0.8rem;
	}

	input {
		width: 100%;
		box-sizing: border-box;
		padding: 0.55rem 0.65rem;
		border: 1px solid light-dark(#ddd9d0, #3a3935);
		border-radius: 0.6rem;
		background: transparent;
		color: inherit;
		font: inherit;
	}

	.empty {
		margin: 0;
		color: light-dark(#6b6964, #9c9a93);
	}
</style>
