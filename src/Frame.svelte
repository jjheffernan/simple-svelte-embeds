<script>
	let {
		children,
		width,
		height,
		maxWidth,
		maxHeight,
		aspectRatio,
		style,
		class: className,
		resizable = true,
		onresize
	} = $props();

	// ponytail: one corner, not eight handles. Split edges if an axis lock is needed.
	let stamp = $derived(`${width ?? ''}\0${height ?? ''}`);
	let dragStamp = $state('');
	let dragW = $state();
	let dragH = $state();
	let liveW = $derived(dragStamp === stamp ? dragW : width);
	let liveH = $derived(dragStamp === stamp ? dragH : height);

	function apply(nextW, nextH) {
		dragStamp = stamp;
		dragW = `${nextW}px`;
		dragH = `${nextH}px`;
		onresize?.({ width: nextW, height: nextH });
	}

	function drag(event) {
		if (event.button !== 0) return;
		const frame = event.currentTarget.parentElement;
		const rect = frame.getBoundingClientRect();
		const x0 = event.clientX;
		const y0 = event.clientY;
		const w0 = rect.width;
		const h0 = rect.height;
		const handle = event.currentTarget;
		handle.setPointerCapture(event.pointerId);

		const move = (e) => {
			apply(
				Math.max(128, Math.round(w0 + e.clientX - x0)),
				Math.max(72, Math.round(h0 + e.clientY - y0))
			);
		};
		const stop = () => {
			handle.removeEventListener('pointermove', move);
			handle.removeEventListener('pointerup', stop);
			handle.removeEventListener('pointercancel', stop);
		};
		handle.addEventListener('pointermove', move);
		handle.addEventListener('pointerup', stop);
		handle.addEventListener('pointercancel', stop);
	}

	function nudge(event) {
		const step = event.shiftKey ? 32 : 8;
		const frame = event.currentTarget.parentElement;
		const rect = frame.getBoundingClientRect();
		let nextW = rect.width;
		let nextH = rect.height;
		if (event.key === 'ArrowRight') nextW += step;
		else if (event.key === 'ArrowLeft') nextW -= step;
		else if (event.key === 'ArrowDown') nextH += step;
		else if (event.key === 'ArrowUp') nextH -= step;
		else return;
		event.preventDefault();
		apply(Math.max(128, Math.round(nextW)), Math.max(72, Math.round(nextH)));
	}
</script>

<div
	class={['embed', className]}
	{style}
	style:--embed-width={liveW}
	style:--embed-height={liveH}
	style:--embed-max-width={maxWidth}
	style:--embed-max-height={maxHeight}
	style:--embed-aspect={aspectRatio}
>
	{@render children?.()}
	{#if resizable}
		<button class="grip" type="button" aria-label="Resize" onpointerdown={drag} onkeydown={nudge}></button>
	{/if}
</div>

<style>
	.embed {
		position: relative;
		box-sizing: border-box;
		width: var(--embed-width, 100%);
		height: var(--embed-height, auto);
		max-width: var(--embed-max-width, none);
		max-height: var(--embed-max-height, none);
		aspect-ratio: var(--embed-aspect, 16 / 9);
		margin-inline: auto;
		min-width: 0;
	}

	.grip {
		position: absolute;
		z-index: 2;
		right: 0;
		bottom: 0;
		width: var(--embed-grip, 2.75rem);
		height: var(--embed-grip, 2.75rem);
		padding: 0;
		border: 0;
		color: #fff;
		background: linear-gradient(135deg, transparent 50%, rgb(0 0 0 / 45%) 50%);
		cursor: nwse-resize;
		touch-action: none;
	}

	.grip:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: -3px;
	}
</style>
