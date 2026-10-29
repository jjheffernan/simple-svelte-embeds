<script>
	import { page } from '$app/state';
	import Bluesky from '../../../src/Bluesky.svelte';
	import CodePen from '../../../src/CodePen.svelte';
	import CodePenPreview from '../../../src/CodePenPreview.svelte';
	import Embed from '../../../src/Embed.svelte';
	import Facebook from '../../../src/Facebook.svelte';
	import FacebookPage from '../../../src/FacebookPage.svelte';
	import FacebookVideo from '../../../src/FacebookVideo.svelte';
	import Gist from '../../../src/Gist.svelte';
	import Instagram from '../../../src/Instagram.svelte';
	import InstagramReel from '../../../src/InstagramReel.svelte';
	import InstagramTV from '../../../src/InstagramTV.svelte';
	import Reddit from '../../../src/Reddit.svelte';
	import RedditComment from '../../../src/RedditComment.svelte';
	import SoundCloud from '../../../src/SoundCloud.svelte';
	import SoundCloudPlaylist from '../../../src/SoundCloudPlaylist.svelte';
	import SoundCloudProfile from '../../../src/SoundCloudProfile.svelte';
	import Spotify from '../../../src/Spotify.svelte';
	import SpotifyAlbum from '../../../src/SpotifyAlbum.svelte';
	import SpotifyEpisode from '../../../src/SpotifyEpisode.svelte';
	import SpotifyPlaylist from '../../../src/SpotifyPlaylist.svelte';
	import SpotifyShow from '../../../src/SpotifyShow.svelte';
	import TikTok from '../../../src/TikTok.svelte';
	import TikTokPost from '../../../src/TikTokPost.svelte';
	import Vimeo from '../../../src/Vimeo.svelte';
	import VimeoShowcase from '../../../src/VimeoShowcase.svelte';
	import X from '../../../src/X.svelte';
	import XPost from '../../../src/XPost.svelte';
	import YouTube from '../../../src/YouTube.svelte';
	import YouTubePlaylist from '../../../src/YouTubePlaylist.svelte';
	import YouTubePodcast from '../../../src/YouTubePodcast.svelte';
	import YouTubeShorts from '../../../src/YouTubeShorts.svelte';

	const platforms = [
		{
			id: 'youtube',
			label: 'YouTube',
			widgets: [
				{ id: 'video', label: 'Video', hint: 'Video id', wide: true, sample: 'dQw4w9WgXcQ', prop: 'id', title: 'YouTube demo', Widget: YouTube },
				{ id: 'shorts', label: 'Shorts', hint: 'Short id', wide: false, sample: 'pVRefGmQDJM', prop: 'id', title: 'YouTube Short', Widget: YouTubeShorts },
				{ id: 'podcast', label: 'Podcast', hint: 'Podcast playlist id', wide: true, sample: 'PLC77007E23FF423C6', prop: 'id', title: 'YouTube podcast', Widget: YouTubePodcast },
				{ id: 'playlist', label: 'Playlist', hint: 'Playlist id', wide: true, sample: 'PLC77007E23FF423C6', prop: 'id', title: 'YouTube playlist', Widget: YouTubePlaylist }
			]
		},
		{
			id: 'vimeo',
			label: 'Vimeo',
			widgets: [
				{ id: 'video', label: 'Video', hint: 'Video id', wide: true, sample: '148751763', prop: 'id', title: 'Vimeo demo', Widget: Vimeo },
				{ id: 'showcase', label: 'Showcase', hint: 'Showcase id', wide: true, sample: '', prop: 'id', title: 'Vimeo showcase', Widget: VimeoShowcase }
			]
		},
		{
			id: 'instagram',
			label: 'Instagram',
			widgets: [
				{ id: 'post', label: 'Post', hint: 'Shortcode', wide: false, sample: 'CgdzCoMoUBJ', prop: 'id', title: 'Instagram post', Widget: Instagram },
				{ id: 'reel', label: 'Reel', hint: 'Reel shortcode', wide: false, sample: '', prop: 'id', title: 'Instagram reel', Widget: InstagramReel },
				{ id: 'tv', label: 'TV', hint: 'TV shortcode', wide: false, sample: '', prop: 'id', title: 'Instagram TV', Widget: InstagramTV }
			]
		},
		{
			id: 'x',
			label: 'X',
			widgets: [
				{ id: 'post', label: 'Post', hint: 'Status id', wide: false, sample: '20', prop: 'id', title: 'Post on X', Widget: XPost },
				{ id: 'thread', label: 'Thread', hint: 'Status id', wide: false, sample: '20', prop: 'id', title: 'Thread on X', Widget: X }
			]
		},
		{
			id: 'facebook',
			label: 'Facebook',
			widgets: [
				{ id: 'post', label: 'Post', hint: 'Post URL', wide: false, sample: 'https://www.facebook.com/facebook/posts/10153231379946729', prop: 'href', title: 'Facebook post', Widget: Facebook },
				{ id: 'video', label: 'Video', hint: 'Video URL', wide: true, sample: '', prop: 'href', title: 'Facebook video', Widget: FacebookVideo },
				{ id: 'page', label: 'Page', hint: 'Page URL', wide: false, sample: 'https://www.facebook.com/facebook', prop: 'href', title: 'Facebook page', Widget: FacebookPage }
			]
		},
		{
			id: 'tiktok',
			label: 'TikTok',
			widgets: [
				{ id: 'player', label: 'Player', hint: 'Video id', wide: false, sample: '6718335390845095173', prop: 'id', title: 'TikTok player', Widget: TikTok },
				{ id: 'post', label: 'Post', hint: 'Video id', wide: false, sample: '6718335390845095173', prop: 'id', title: 'TikTok post', Widget: TikTokPost }
			]
		},
		{
			id: 'bluesky',
			label: 'Bluesky',
			widgets: [
				{ id: 'post', label: 'Post', hint: 'did/app.bsky.feed.post/rkey', wide: false, sample: '', prop: 'id', title: 'Bluesky post', Widget: Bluesky }
			]
		},
		{
			id: 'spotify',
			label: 'Spotify',
			widgets: [
				{ id: 'track', label: 'Track', hint: 'Track id', wide: true, sample: '4cOdK2wGLETKBW3PvgPWqT', prop: 'id', title: 'Spotify track', Widget: Spotify },
				{ id: 'album', label: 'Album', hint: 'Album id', wide: true, sample: '', prop: 'id', title: 'Spotify album', Widget: SpotifyAlbum },
				{ id: 'playlist', label: 'Playlist', hint: 'Playlist id', wide: true, sample: '37i9dQZF1DXcBWIGoYBM5M', prop: 'id', title: 'Spotify playlist', Widget: SpotifyPlaylist },
				{ id: 'episode', label: 'Episode', hint: 'Episode id', wide: true, sample: '', prop: 'id', title: 'Spotify episode', Widget: SpotifyEpisode },
				{ id: 'show', label: 'Show', hint: 'Show id', wide: true, sample: '', prop: 'id', title: 'Spotify show', Widget: SpotifyShow }
			]
		},
		{
			id: 'soundcloud',
			label: 'SoundCloud',
			widgets: [
				{ id: 'track', label: 'Track', hint: 'Track id', wide: true, sample: '', prop: 'id', title: 'SoundCloud track', Widget: SoundCloud },
				{ id: 'playlist', label: 'Playlist', hint: 'Playlist id', wide: true, sample: '', prop: 'id', title: 'SoundCloud playlist', Widget: SoundCloudPlaylist },
				{ id: 'profile', label: 'Profile', hint: 'User id', wide: true, sample: '', prop: 'id', title: 'SoundCloud profile', Widget: SoundCloudProfile }
			]
		},
		{
			id: 'reddit',
			label: 'Reddit',
			widgets: [
				{ id: 'post', label: 'Post', hint: 'Post path or permalink', wide: false, sample: '', prop: 'path', title: 'Reddit post', Widget: Reddit },
				{ id: 'comment', label: 'Comment', hint: 'Comment path or permalink', wide: false, sample: '', prop: 'path', title: 'Reddit comment', Widget: RedditComment }
			]
		},
		{
			id: 'codepen',
			label: 'CodePen',
			widgets: [
				{ id: 'pen', label: 'Pen', hint: 'user/pen', wide: true, sample: '', prop: 'id', title: 'CodePen', Widget: CodePen },
				{ id: 'preview', label: 'Preview', hint: 'user/pen', wide: true, sample: '', prop: 'id', title: 'CodePen preview', Widget: CodePenPreview }
			]
		},
		{
			id: 'gist',
			label: 'Gist',
			widgets: [
				{ id: 'gist', label: 'Gist', hint: 'user/gist id', wide: true, sample: '', prop: 'id', title: 'Gist', Widget: Gist }
			]
		},
		{
			id: 'embed',
			label: 'Embed',
			widgets: [
				{ id: 'url', label: 'URL', hint: 'Embed URL', wide: true, sample: 'https://www.youtube-nocookie.com/embed/jNQXAC9IVRw', prop: 'src', title: 'Custom embed', Widget: Embed }
			]
		}
	];

	let values = $state(
		Object.fromEntries(
			platforms.flatMap((item) => item.widgets.map((widget) => [`${item.id}:${widget.id}`, widget.sample]))
		)
	);

	let platform = $derived(
		platforms.find((item) => item.id === (page.url.searchParams.get('tab') ?? 'youtube')) ?? platforms[0]
	);
	let widget = $derived(
		platform.widgets.find((item) => item.id === page.url.searchParams.get('widget')) ?? platform.widgets[0]
	);
	let field = $derived(`${platform.id}:${widget.id}`);
	let value = $derived((values[field] ?? '').trim());
	let width = $state('');
	let height = $state('');
	let aspect = $state('');

	$effect(() => {
		document.getElementById(`tab-${platform.id}`)?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
		document.getElementById(`widget-${platform.id}-${widget.id}`)?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
	});
</script>

<svelte:head>
	<title>{widget.label} — {platform.label}</title>
</svelte:head>

<main>
	<header>
		<h1>simple-svelte-embeds</h1>
		<p>Pick a platform, then a widget. Nothing loads until that tab is open.</p>
	</header>

	<nav aria-label="Platforms" data-sveltekit-reset="false">
		{#each platforms as item (item.id)}
			<a id="tab-{item.id}" href="?tab={item.id}" aria-current={item.id === platform.id ? 'page' : undefined}>
				{item.label}
			</a>
		{/each}
	</nav>

	<nav aria-label="Widgets" data-sveltekit-reset="false">
		{#each platform.widgets as item (item.id)}
			<a
				id="widget-{platform.id}-{item.id}"
				href="?tab={platform.id}&widget={item.id}"
				aria-current={item.id === widget.id ? 'page' : undefined}
			>
				{item.label}
			</a>
		{/each}
	</nav>

	<section class={{ narrow: !widget.wide }}>
		<label>
			{widget.hint}
			<input bind:value={values[field]} autocomplete="off" spellcheck="false" />
		</label>
		<div class="size">
			<label>
				Width
				<input bind:value={width} placeholder="100%" autocomplete="off" spellcheck="false" />
			</label>
			<label>
				Height
				<input bind:value={height} placeholder="auto" autocomplete="off" spellcheck="false" />
			</label>
			<label>
				Aspect
				<input bind:value={aspect} placeholder="16 / 9" autocomplete="off" spellcheck="false" />
			</label>
		</div>
		{#if value}
			{@const Active = widget.Widget}
			<Active
				{...{ [widget.prop]: value }}
				title={widget.title}
				width={width.trim() || undefined}
				height={height.trim() || undefined}
				aspectRatio={aspect.trim() || undefined}
			/>
		{:else}
			<p class="empty">Enter an id to preview.</p>
		{/if}
	</section>
</main>

<style>
	:global(html) {
		color-scheme: light dark;
	}

	:global(html),
	:global(body) {
		margin: 0;
		overflow-x: clip;
	}

	:global(body) {
		background: light-dark(#f4f3ef, #111110);
		color: light-dark(#1c1b19, #f4f3ef);
	}

	main {
		max-width: 46rem;
		margin: 0 auto;
		padding: 1.25rem max(1rem, env(safe-area-inset-right)) 2.5rem
			max(1rem, env(safe-area-inset-left));
		font-family: system-ui, sans-serif;
	}

	@media (min-width: 40rem) {
		main {
			padding-top: 2.5rem;
		}
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
		gap: 0.35rem;
		margin: 1rem 0 0;
		padding: 0 0 0.35rem;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scrollbar-width: none;
		scroll-snap-type: x proximity;
	}

	nav + nav {
		margin-top: 0.15rem;
	}

	nav::-webkit-scrollbar {
		display: none;
	}

	@media (min-width: 40rem) {
		nav {
			flex-wrap: wrap;
			overflow: visible;
		}
	}

	a {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		min-height: 2.75rem;
		padding: 0 0.9rem;
		border-radius: 999px;
		color: inherit;
		font-size: 0.875rem;
		text-decoration: none;
		scroll-snap-align: start;
	}

	a[aria-current='page'] {
		background: light-dark(#1c1b19, #f4f3ef);
		color: light-dark(#f4f3ef, #1c1b19);
	}

	section {
		margin-top: 0.75rem;
		padding: 1rem;
		border: 1px solid light-dark(#e3e1da, #2c2b28);
		border-radius: 1rem;
		background: light-dark(#fff, #1a1917);
	}

	.narrow {
		width: min(100%, 22rem);
	}

	.size {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	label {
		display: grid;
		gap: 0.4rem;
		margin-bottom: 1rem;
		font-size: 0.8rem;
	}

	.size label {
		margin-bottom: 0;
	}

	input {
		width: 100%;
		box-sizing: border-box;
		min-height: 2.75rem;
		padding: 0.55rem 0.65rem;
		border: 1px solid light-dark(#ddd9d0, #3a3935);
		border-radius: 0.6rem;
		background: transparent;
		color: inherit;
		font-family: inherit;
		font-size: 1rem;
	}

	.empty {
		margin: 0;
		color: light-dark(#6b6964, #9c9a93);
	}
</style>
