import { expect, test } from '@playwright/test';

const viewports = [
	{ name: 'phone', width: 390, height: 844 },
	{ name: 'desktop', width: 1280, height: 800 }
];

test('youtube waits for a click before autoplay', async ({ page }) => {
	await page.goto('/?tab=youtube&widget=video');
	await page.waitForFunction(() => window.__svelte);
	await expect(page.getByRole('button', { name: 'Play YouTube demo' })).toBeVisible();
	await expect(page.locator('iframe')).toHaveCount(0);

	await expect(async () => {
		await page.getByRole('button', { name: 'Play YouTube demo' }).click();
		await expect(page.locator('iframe')).toHaveCount(1);
	}).toPass();

	const src = await page.locator('iframe').getAttribute('src');
	expect(src).toContain('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
	expect(src).toContain('autoplay=1');
	expect(src).toContain('playsinline=1');
});

test('widget iframes point at the public embed url', async ({ page }) => {
	await page.goto('/?tab=spotify&widget=playlist');
	await expect(page.locator('iframe')).toHaveAttribute(
		'src',
		'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M'
	);

	await page.goto('/?tab=x&widget=post');
	await expect(page.locator('iframe')).toHaveAttribute(
		'src',
		'https://platform.twitter.com/embed/Tweet.html?id=20&dnt=true&conversation=none'
	);

	await page.goto('/?tab=x&widget=thread');
	const thread = await page.locator('iframe').getAttribute('src');
	expect(thread).toBe('https://platform.twitter.com/embed/Tweet.html?id=20&dnt=true');

	await page.goto('/?tab=tiktok&widget=player');
	await expect(page.locator('iframe')).toHaveAttribute(
		'src',
		'https://www.tiktok.com/player/v1/6718335390845095173'
	);

	await page.goto('/?tab=tiktok&widget=post');
	await expect(page.locator('iframe')).toHaveAttribute(
		'src',
		'https://www.tiktok.com/embed/v2/6718335390845095173'
	);

	await page.goto('/?tab=facebook&widget=page');
	const pageSrc = await page.locator('iframe').getAttribute('src');
	expect(pageSrc).toContain('https://www.facebook.com/plugins/page.php');
	expect(pageSrc).toContain('href=https%3A%2F%2Fwww.facebook.com%2Ffacebook');
});

for (const viewport of viewports) {
	test(`layout stays in bounds on ${viewport.name}`, async ({ page }) => {
		await page.setViewportSize({ width: viewport.width, height: viewport.height });
		await page.goto('/?tab=youtube&widget=video');

		const layout = await measure(page);
		expect(layout.doc.scrollWidth).toBeLessThanOrEqual(layout.doc.clientWidth + 1);
		expect(layout.section.x).toBeGreaterThanOrEqual(-1);
		expect(layout.section.right).toBeLessThanOrEqual(layout.doc.clientWidth + 1);
		expect(inside(layout.player, layout.section)).toBe(true);
		expect(overlaps(layout.heading, layout.platforms)).toBe(false);
		expect(overlaps(layout.platforms, layout.widgets)).toBe(false);
		expect(overlaps(layout.widgets, layout.section)).toBe(false);
		expect(overlaps(layout.input, layout.player)).toBe(false);

		const wide = layout.player.width / layout.player.height;
		expect(wide).toBeGreaterThan(1.6);
		expect(wide).toBeLessThan(1.95);

		await page.goto('/?tab=youtube&widget=shorts');
		const shorts = await measure(page);
		expect(shorts.doc.scrollWidth).toBeLessThanOrEqual(shorts.doc.clientWidth + 1);
		expect(inside(shorts.player, shorts.section)).toBe(true);
		const tall = shorts.player.width / shorts.player.height;
		expect(tall).toBeGreaterThan(0.5);
		expect(tall).toBeLessThan(0.7);
	});
}

test('frame size follows props, variables, and style', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/?tab=vimeo&widget=video');
	const frame = page.locator('section .embed');

	await page.getByLabel('Width').fill('320px');
	await page.getByLabel('Height').fill('180px');
	await expect.poll(async () => (await frame.boundingBox()).width).toBeLessThan(330);
	let box = await frame.boundingBox();
	expect(box.width).toBeGreaterThan(310);
	expect(box.height).toBeGreaterThan(170);
	expect(box.height).toBeLessThan(190);

	await page.getByLabel('Width').fill('');
	await page.getByLabel('Height').fill('');
	await expect.poll(async () => (await frame.boundingBox()).width).toBeGreaterThan(400);

	await frame.evaluate((el) => {
		el.style.setProperty('--embed-width', '300px');
		el.style.setProperty('--embed-height', 'auto');
		el.style.setProperty('--embed-aspect', '1 / 1');
	});
	box = await frame.boundingBox();
	expect(box.width).toBeGreaterThan(290);
	expect(box.width).toBeLessThan(310);
	expect(box.height).toBeGreaterThan(290);
	expect(box.height).toBeLessThan(310);

	await frame.evaluate((el) => {
		el.style.width = '420px';
		el.style.height = '200px';
	});
	box = await frame.boundingBox();
	expect(box.width).toBeGreaterThan(410);
	expect(box.width).toBeLessThan(430);
	expect(box.height).toBeGreaterThan(190);
	expect(box.height).toBeLessThan(210);
});

test('corner drag resizes the frame', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/?tab=vimeo&widget=video');
	await page.waitForFunction(() => window.__svelte);
	const frame = page.locator('section .embed');
	const before = await frame.boundingBox();
	const grip = page.getByRole('button', { name: 'Resize' });
	await grip.scrollIntoViewIfNeeded();
	const handle = await grip.boundingBox();
	const x = handle.x + handle.width / 2;
	const y = handle.y + handle.height / 2;
	await page.mouse.move(x, y);
	await page.mouse.down();
	await page.mouse.move(x + 120, y + 50);
	await page.mouse.up();
	const after = await frame.boundingBox();
	expect(after.width).toBeGreaterThan(before.width + 80);
	expect(after.height).toBeGreaterThan(before.height + 30);
});

test('light and dark schemes stay readable', async ({ page }) => {
	const light = await colors(page, 'light');
	const dark = await colors(page, 'dark');

	expect(light.background).not.toBe(dark.background);
	expect(contrast(light.text, light.background)).toBeGreaterThan(4.5);
	expect(contrast(dark.text, dark.background)).toBeGreaterThan(4.5);
	expect(luminance(light.background)).toBeGreaterThan(luminance(dark.background));
});

async function measure(page) {
	return page.evaluate(() => {
		const box = (selector) => {
			const el = document.querySelector(selector);
			const rect = el.getBoundingClientRect();
			return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom };
		};
		return {
			doc: {
				clientWidth: document.documentElement.clientWidth,
				scrollWidth: document.documentElement.scrollWidth
			},
			heading: box('h1'),
			platforms: box('nav[aria-label="Platforms"]'),
			widgets: box('nav[aria-label="Widgets"]'),
			section: box('section'),
			input: box('input'),
			player: box('button[aria-label^="Play"], iframe')
		};
	});
}

function overlaps(a, b) {
	return a.x < b.right - 1 && b.x < a.right - 1 && a.y < b.bottom - 1 && b.y < a.bottom - 1;
}

function inside(inner, outer) {
	return (
		inner.x >= outer.x - 1 &&
		inner.y >= outer.y - 1 &&
		inner.right <= outer.right + 1 &&
		inner.bottom <= outer.bottom + 1
	);
}

async function colors(page, scheme) {
	await page.emulateMedia({ colorScheme: scheme });
	await page.goto('/?tab=youtube&widget=video');
	return page.evaluate(() => {
		const body = getComputedStyle(document.body);
		const heading = getComputedStyle(document.querySelector('h1'));
		return { background: body.backgroundColor, text: heading.color };
	});
}

function luminance(color) {
	const [r, g, b] = color.match(/\d+/g).slice(0, 3).map((channel) => {
		const value = Number(channel) / 255;
		return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(text, background) {
	const lighter = Math.max(luminance(text), luminance(background));
	const darker = Math.min(luminance(text), luminance(background));
	return (lighter + 0.05) / (darker + 0.05);
}
