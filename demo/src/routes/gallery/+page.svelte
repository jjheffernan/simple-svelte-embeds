<script>
	import SpotifyPlaylist from '../../../../src/SpotifyPlaylist.svelte';
	import XPost from '../../../../src/XPost.svelte';
	import YouTube from '../../../../src/YouTube.svelte';
	import YouTubeShorts from '../../../../src/YouTubeShorts.svelte';
</script>

<svelte:head>
	<title>Widget gallery — simple-svelte-embeds</title>
</svelte:head>

<main>
	<header>
		<p class="brand">simple-svelte-embeds</p>
		<h1>What you get</h1>
		<p>Framed Svelte 5 widgets — rounded shell, clipped media, YouTube footer link.</p>
		<p class="nav"><a href="/">Open the interactive demo</a></p>
	</header>

	<div class="grid">
		<figure>
			<figcaption>YouTube</figcaption>
			<YouTube id="dQw4w9WgXcQ" title="YouTube video" resizable={false} />
		</figure>
		<figure class="narrow">
			<figcaption>YouTube Shorts</figcaption>
			<YouTubeShorts id="pVRefGmQDJM" title="YouTube Short" resizable={false} />
		</figure>
		<figure class="narrow">
			<figcaption>X</figcaption>
			<XPost id="20" title="Post on X" resizable={false} />
		</figure>
		<figure>
			<figcaption>Spotify Playlist</figcaption>
			<SpotifyPlaylist id="37i9dQZF1DXcBWIGoYBM5M" title="Spotify playlist" resizable={false} />
		</figure>
	</div>
</main>

<style>
	:global(html) {
		color-scheme: light dark;
	}

	:global(html),
	:global(body) {
		margin: 0;
		background: light-dark(#f4f3ef, #111110);
		color: light-dark(#1c1b19, #f4f3ef);
	}

	main {
		max-width: 56rem;
		margin: 0 auto;
		padding: 2rem 1.25rem 2.5rem;
		font-family: system-ui, sans-serif;
	}

	.brand {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	h1 {
		margin: 0.35rem 0 0;
		font-size: 1.75rem;
		font-weight: 600;
		letter-spacing: -0.03em;
	}

	header > p:nth-of-type(2) {
		margin: 0.5rem 0 0;
		color: light-dark(#5e5c57, #a8a69f);
	}

	.nav {
		margin: 0.75rem 0 0;
	}

	.nav a {
		color: inherit;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.25rem 1.5rem;
		margin-top: 1.75rem;
		align-items: start;
	}

	figure {
		margin: 0;
		min-width: 0;
	}

	.narrow {
		justify-self: center;
		width: min(100%, 18rem);
	}

	figcaption {
		margin-bottom: 0.45rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: light-dark(#5e5c57, #a8a69f);
	}

	@media (max-width: 40rem) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
