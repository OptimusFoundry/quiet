import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// Future/Effects: ProgressiveBlur, ThinkingOrb, MorphingTooltip — axe in both themes, plus ARIA,
// behaviour and reduced motion. Colour exceptions are the accepted reference colours from
// tests/a11y.spec.ts.
const STORY = (theme = "foundry") =>
	`/iframe.html?id=future-effects--all&viewMode=story&globals=theme:${theme}`;
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#6e6e76", "#f06a33"],
};

async function open(page: Page, theme?: string) {
	await page.goto(STORY(theme));
	await page.locator("#morphing-tooltip").waitFor();
}

// The canvas bitmap, to tell whether the orb is turning.
const pixels = (page: Page, name: string) =>
	page
		.getByRole("img", { name, exact: true })
		.evaluate((c) => (c as HTMLCanvasElement).toDataURL());

for (const theme of ["foundry", "foundry-dark"]) {
	test(`no axe violations beyond the accepted colours (${theme})`, async ({ page }) => {
		await open(page, theme);
		await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
		const { violations } = await new AxeBuilder({ page }).include("#storybook-root").analyze();
		const accepted = ACCEPTED_LOW_CONTRAST[theme] ?? [];
		const remaining = violations
			.map((v) => ({
				id: v.id,
				nodes: v.nodes.filter(
					(n) =>
						v.id !== "color-contrast" ||
						!accepted.includes(String(n.any[0]?.data?.fgColor ?? "").toLowerCase()),
				),
			}))
			.filter((v) => v.nodes.length > 0);
		expect(
			remaining.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`),
		).toEqual([]);
	});
}

test.describe("behaviour", () => {
	test.beforeEach(async ({ page }) => open(page));

	test("progressive blur: decorative bands whose blur ramps toward the edge", async ({ page }) => {
		const progressive = page.getByTestId("progressive");
		await expect(progressive.locator(".q-progressive-blur__stack")).toHaveAttribute(
			"aria-hidden",
			"true",
		);
		const bands = progressive.locator(".q-progressive-blur__band");
		await expect(bands).toHaveCount(8);
		const blurs = await bands.evaluateAll((els) =>
			els.map((el) =>
				Number.parseFloat(getComputedStyle(el).backdropFilter.match(/[\d.]+/)?.[0] ?? "0"),
			),
		);
		for (let i = 1; i < blurs.length; i++) expect(blurs[i]).toBeGreaterThan(blurs[i - 1] ?? 0);
		expect(blurs.at(-1)).toBeCloseTo(28);
		expect(
			await progressive
				.locator(".q-progressive-blur__stack")
				.evaluate((el) => getComputedStyle(el).pointerEvents),
		).toBe("none");

		const masked = page.getByTestId("masked").locator(".q-progressive-blur__band");
		await expect(masked).toHaveCount(1);
		expect(await masked.evaluate((el) => getComputedStyle(el).backdropFilter)).toBe("blur(28px)");
	});

	test("progressive blur: maxBlur follows the slider", async ({ page }) => {
		const slider = page.getByRole("slider", { name: "Blur at the edge" });
		await slider.focus();
		await page.keyboard.press("End");
		const last = page.getByTestId("strength").locator(".q-progressive-blur__band").last();
		await expect
			.poll(() => last.evaluate((el) => getComputedStyle(el).backdropFilter))
			.toBe("blur(64px)");
	});

	test("thinking orb: named canvas, pinned CSS size, sharp bitmap, turning", async ({ page }) => {
		const orb = page.getByRole("img", { name: "Planning", exact: true });
		const box = await orb.boundingBox();
		expect(box?.width).toBe(96);
		expect(box?.height).toBe(96);
		const { w, dpr } = await orb.evaluate((c) => ({
			w: (c as HTMLCanvasElement).width,
			dpr: window.devicePixelRatio,
		}));
		expect(w).toBe(Math.round(96 * dpr));
		await expect(orb).toHaveAttribute("data-motion", "running");
		const before = await pixels(page, "Planning");
		await expect.poll(() => pixels(page, "Planning")).not.toBe(before);

		const paused = page.getByRole("img", { name: "Paused", exact: true });
		await expect(paused).toHaveAttribute("data-motion", "still");
		const still = await pixels(page, "Paused");
		await page.waitForTimeout(300);
		expect(await pixels(page, "Paused")).toBe(still);

		// Unnamed beside a visible status: decorative.
		const pill = page.locator("#thinking-orb").getByRole("status");
		await expect(pill).toContainText(/Expanding|Tracing|Trimming|Planning/);
		await expect(page.locator('#thinking-orb canvas[aria-hidden="true"]')).toHaveCount(1);
	});

	test("morphing tooltip: one shared tooltip that follows the pointer between headers", async ({
		page,
	}) => {
		const group = page.getByTestId("breakdown");
		const tip = group.getByRole("tooltip");
		await expect(tip).toBeHidden();
		const spotify = group.locator(".q-morphing-tooltip__trigger", { hasText: "Spotify" });
		const youtube = group.locator(".q-morphing-tooltip__trigger", { hasText: "YouTube" });
		await spotify.hover();
		await expect(tip).toBeVisible();
		await expect(tip).toContainText("Streams on Spotify");
		const id = await tip.getAttribute("id");
		await expect(spotify).toHaveAttribute("aria-describedby", id ?? "");
		const x1 = (await tip.boundingBox())?.x ?? 0;

		await youtube.hover();
		await expect(tip).toContainText("Views on YouTube");
		await expect(spotify).not.toHaveAttribute("aria-describedby");
		await expect(youtube).toHaveAttribute("aria-describedby", id ?? "");
		await expect(group.getByRole("tooltip")).toHaveCount(1);
		await expect.poll(async () => (await tip.boundingBox())?.x ?? 0).toBeGreaterThan(x1);
		// Settles with only the new content left.
		await expect(tip.locator(".q-morphing-tooltip__content")).toHaveCount(1);

		// Hoverable (WCAG 1.4.13): the pointer can cross onto it.
		await tip.hover();
		await page.waitForTimeout(300);
		await expect(tip).toBeVisible();
		await page.mouse.move(0, 0);
		await expect(tip).toBeHidden();
	});

	test("morphing tooltip: keyboard focus opens, Tab moves it, Escape closes", async ({ page }) => {
		const group = page.getByTestId("breakdown");
		const tip = group.getByRole("tooltip");
		const triggers = group.locator(".q-morphing-tooltip__trigger");
		await expect(triggers.first()).toHaveAttribute("tabindex", "0");
		await triggers.first().focus();
		await expect(tip).toBeVisible();
		await expect(tip).toContainText("Streams on Spotify");
		await page.keyboard.press("Tab");
		await expect(triggers.nth(1)).toBeFocused();
		await expect(tip).toContainText("Views on YouTube");
		await page.keyboard.press("Escape");
		await expect(tip).toBeHidden();
		await expect(triggers.nth(1)).toBeFocused();
		await expect(triggers.nth(1)).not.toHaveAttribute("aria-describedby");
	});

	test("morphing tooltip: a button trigger is described itself, with no extra tab stop", async ({
		page,
	}) => {
		const group = page.getByTestId("actions");
		const tip = group.getByRole("tooltip");
		const schedule = group.getByRole("button", { name: "Schedule" });
		await expect(group.locator(".q-morphing-tooltip__trigger[tabindex]")).toHaveCount(0);
		await schedule.focus();
		await expect(tip).toBeVisible();
		await expect(schedule).toHaveAttribute(
			"aria-describedby",
			(await tip.getAttribute("id")) ?? "",
		);
		await expect(schedule).toHaveAccessibleDescription(/each subscriber's own time zone/);
		// placement="top": the tooltip sits above its trigger.
		const t = await tip.boundingBox();
		const b = await schedule.boundingBox();
		expect((t?.y ?? 0) + (t?.height ?? 0)).toBeLessThanOrEqual(b?.y ?? 0);
	});
});

test.describe("reduced motion", () => {
	test.use({ reducedMotion: "reduce" });
	test.beforeEach(async ({ page }) => open(page));

	test("thinking orb holds one still frame", async ({ page }) => {
		const orb = page.getByRole("img", { name: "Planning", exact: true });
		await expect(orb).toHaveAttribute("data-motion", "still");
		const still = await pixels(page, "Planning");
		await page.waitForTimeout(300);
		expect(await pixels(page, "Planning")).toBe(still);
	});

	test("morphing tooltip jumps between headers instead of gliding and sliding", async ({
		page,
	}) => {
		const group = page.getByTestId("breakdown");
		const tip = group.getByRole("tooltip");
		await group.locator(".q-morphing-tooltip__trigger", { hasText: "Spotify" }).hover();
		await expect(tip).toBeVisible();
		await group.locator(".q-morphing-tooltip__trigger", { hasText: "Total" }).hover();
		// No glide: the very next frame already has the new position and only the new content.
		await expect(tip).toContainText("All platforms combined");
		const content = tip.locator(".q-morphing-tooltip__content");
		await expect(content).toHaveCount(1);
		expect(await content.evaluate((el) => getComputedStyle(el).transform)).toMatch(
			/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/,
		);
	});
});
