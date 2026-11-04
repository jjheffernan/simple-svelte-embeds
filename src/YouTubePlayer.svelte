<script>
	import Embed from './Embed.svelte';
	import Frame from './Frame.svelte';

	let {
		src,
		href,
		poster,
		title,
		width,
		height,
		maxWidth,
		maxHeight,
		aspectRatio,
		style,
		class: className,
		resizable = true,
		onresize,
		...rest
	} = $props();

	let active = $state(false);
	let failedPoster = $state('');

	// Reset facade only when the video identity changes.
	let mediaKey = $derived(`${src}\0${poster ?? ''}`);
	let seenKey = $state.raw('');
	$effect.pre(() => {
		if (mediaKey === seenKey) return;
		seenKey = mediaKey;
		active = false;
		failedPoster = '';
	});

	let playSrc = $derived.by(() => {
		const url = new URL(src);
		url.searchParams.set('autoplay', '1');
		url.searchParams.set('playsinline', '1');
		return url.toString();
	});
</script>

<div
	class={['shell', className]}
	{style}
	style:--embed-width={width}
	style:--embed-height={height}
	style:--embed-max-width={maxWidth}
	style:--embed-max-height={maxHeight}
	style:--embed-aspect={aspectRatio}
>
	<Frame
		width="100%"
		height={height}
		maxWidth="none"
		maxHeight={maxHeight}
		{aspectRatio}
		class="media"
		chrome={false}
		{resizable}
		{onresize}
	>
		{#if active}
			<Embed
				class="fill"
				src={playSrc}
				{title}
				width="100%"
				height="100%"
				aspectRatio="auto"
				loading="eager"
				chrome={false}
				resizable={false}
				{...rest}
			/>
		{:else}
			<button class="fill" type="button" aria-label={title ? `Play ${title}` : 'Play'} onclick={() => (active = true)}>
				{#if poster && failedPoster !== poster}
					<img src={poster} alt="" onerror={() => (failedPoster = poster)} />
				{/if}
				<span aria-hidden="true"></span>
			</button>
		{/if}
	</Frame>
	<a class="watch" {href} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
</div>

<style>
	.shell {
		box-sizing: border-box;
		width: var(--embed-width, 100%);
		max-width: var(--embed-max-width, none);
		margin-inline: auto;
		min-width: 0;
		overflow: hidden;
		border: var(--embed-border, 1px solid color-mix(in srgb, CanvasText 14%, transparent));
		border-radius: var(--embed-radius, 0.75rem);
		background: var(--embed-bg, Canvas);
		color: var(--embed-fg, inherit);
	}

	.shell :global(.media.embed) {
		width: 100%;
		max-width: none;
		margin: 0;
		border: 0;
		border-radius: 0;
		background: #111;
	}

	.fill,
	:global(.fill) {
		position: absolute;
		inset: 0;
	}

	button {
		display: block;
		padding: 0;
		border: 0;
		overflow: hidden;
		background: #111;
		color: #fff;
		cursor: pointer;
	}

	button:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: -3px;
	}

	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	span {
		position: absolute;
		inset: 0;
		z-index: 1;
		width: 4.25rem;
		height: 4.25rem;
		margin: auto;
		border-radius: 999px;
		background: color-mix(in srgb, #000 55%, transparent);
	}

	span::before {
		content: '';
		display: block;
		width: 0;
		height: 0;
		margin: 1.4rem 0 0 1.65rem;
		border-style: solid;
		border-width: 0.7rem 0 0.7rem 1.15rem;
		border-color: transparent transparent transparent #fff;
	}

	.watch {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		box-sizing: border-box;
		min-height: 2.75rem;
		padding: 0.55rem 0.9rem;
		border-top: var(--embed-border, 1px solid color-mix(in srgb, CanvasText 14%, transparent));
		color: inherit;
		font: inherit;
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		background: color-mix(in srgb, CanvasText 4%, transparent);
	}

	.watch::after {
		content: '↗';
		opacity: 0.55;
		font-weight: 400;
	}

	.watch:hover,
	.watch:focus-visible {
		background: color-mix(in srgb, CanvasText 8%, transparent);
	}

	.watch:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: -3px;
	}
</style>
