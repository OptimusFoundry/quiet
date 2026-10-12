import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";

// App/DescriptionList: axe in both themes, plus the dl semantics, empty values, copy buttons and the
// column collapse. Colour exceptions are the same accepted reference colours as tests/a11y.spec.ts.
const STORY = (theme = "foundry") =>
	`/iframe.html?id=app-descriptionlist--all&viewMode=story&globals=theme:${theme}`;
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#75757b", "#ff7a3d"],
};

async function box(locator: Locator) {
	const b = await locator.boundingBox();
	if (!b) throw new Error("not rendered");
	return b;
}

async function open(page: Page, theme?: string) {
	await page.goto(STORY(theme));
	await page.locator("#small").waitFor();
}

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

	test("pairs are a dl of term/definition groups, values beside their labels", async ({ page }) => {
		const list = page.locator("#artifact dl");
		await expect(list.locator(":scope > div")).toHaveCount(6);
		await expect(list.locator(":scope > div > dt")).toHaveCount(6);
		await expect(list.locator(":scope > div > dd")).toHaveCount(6);
		await expect(list.getByRole("link", { name: "Assistant" })).toBeVisible();
		// Inline: the value starts within the 160px label column + gap, not at the far right.
		const pair = list.locator(":scope > div").nth(1);
		const dt = await box(pair.locator("dt"));
		const dd = await box(pair.locator("dd"));
		expect(dd.x - dt.x).toBeLessThanOrEqual(200);
		expect(Math.abs(dd.y - dt.y)).toBeLessThan(8);
		// Mono values use the mono font.
		const mono = list.locator(".q-description-list__value--mono").first();
		expect(await mono.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/mono/i);
	});

	test("stacked: label sits above its value", async ({ page }) => {
		const pair = page.locator("#stacked dl > div").first();
		const dt = await box(pair.locator("dt"));
		const dd = await box(pair.locator("dd"));
		expect(dd.y).toBeGreaterThanOrEqual(dt.y + dt.height - 1);
		expect(Math.abs(dd.x - dt.x)).toBeLessThan(2);
	});

	test("empty values show a muted dash read as Not set", async ({ page }) => {
		const empty = page.locator("#empty .q-description-list__value--empty");
		await expect(empty).toHaveCount(3);
		await expect(empty.first().locator('[aria-hidden="true"]')).toHaveText("—");
		await expect(empty.first()).toContainText("Not set");
	});

	test("copy: named by its label, copies, announces Copied", async ({ page, context }) => {
		await context.grantPermissions(["clipboard-read", "clipboard-write"]);
		const section = page.locator("#artifact");
		const copy = section.getByRole("button", { name: "Copy ID" });
		await expect(copy).toHaveCount(1);
		await expect(section.getByRole("button", { name: /^Copy/ })).toHaveCount(1);
		await copy.focus();
		await expect(copy).toBeFocused();
		await page.keyboard.press("Enter");
		await expect(section.getByRole("status").filter({ hasText: "Copied" })).toHaveCount(1);
		await expect(copy).toHaveAttribute("data-state", "copied");
		expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("art_7f3c91d2e4a8");
	});

	test("columns: two per row when wide, one under 720px", async ({ page }) => {
		const pairs = page.locator("#columns dl > div");
		const a = await box(pairs.nth(0));
		const b = await box(pairs.nth(1));
		expect(Math.abs(a.y - b.y)).toBeLessThan(2);
		expect(b.x).toBeGreaterThan(a.x + a.width);
		await page.setViewportSize({ width: 600, height: 900 });
		const a2 = await box(pairs.nth(0));
		const b2 = await box(pairs.nth(1));
		expect(b2.y).toBeGreaterThan(a2.y + a2.height - 1);
		expect(Math.abs(b2.x - a2.x)).toBeLessThan(2);
	});
});
