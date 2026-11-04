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

	// Reset facade when the video changes — $effect.pre is the prop-reset escape hatch.
	$effect.pre(() => {
		src;
		poster;
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

<div>
	<Frame {width} {height} {maxWidth} {maxHeight} {aspectRatio} {style} class={className} {resizable} {onresize}>
		{#if active}
			<Embed
				class="fill"
				src={playSrc}
				{title}
				width="100%"
				height="100%"
				aspectRatio="auto"
				loading="eager"
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
	<a {href} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
</div>

<style>
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
		outline-offset: 3px;
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

	a {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		margin-top: 0.25rem;
		font: inherit;
		font-size: 0.9rem;
	}
</style>
