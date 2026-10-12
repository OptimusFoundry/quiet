import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";

// App/PageHeader — axe in both themes, plus the header's structure: heading level, back link,
// meta as a list with decorative separators, actions wrapping below the title when narrow.
// Colour exceptions are the same accepted reference colours as tests/a11y.spec.ts.
const STORY = (theme = "foundry") =>
	`/iframe.html?id=app-pageheader--all&viewMode=story&globals=theme:${theme}`;
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#75757b", "#ff7a3d"],
};

async function box(l: Locator) {
	const b = await l.boundingBox();
	if (!b) throw new Error("not rendered");
	return b;
}

async function open(page: Page, theme?: string) {
	await page.goto(STORY(theme));
	await page.locator("#narrow .q-page-header").waitFor();
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

test.describe("structure", () => {
	test.beforeEach(async ({ page }) => open(page));

	test("renders a banner-less header with the title as h1, or h2 when asked", async ({ page }) => {
		const list = page.locator("#list-page header.q-page-header");
		await expect(list.getByRole("heading", { level: 1, name: "Projects" })).toBeVisible();
		const h2 = page.locator("#title-only").getByRole("heading", { level: 2 });
		await expect(h2).toContainText("Summarise the weekly approvals backlog");
		await expect(page.locator("#title-only h1")).toHaveCount(0);
	});

	test("back link is a keyboard-reachable link named by its label, arrow hidden", async ({
		page,
	}) => {
		const detail = page.locator("#detail-page");
		const back = detail.getByRole("link", { name: "Runs", exact: true });
		await expect(back).toHaveAttribute("href", "/runs");
		await expect(back.locator('[aria-hidden="true"]')).toHaveText("← ");
		await back.focus();
		await expect(back).toBeFocused();
		// Tab order: back link, then the meta link, then the actions (secondary, then primary).
		await page.keyboard.press("Tab");
		await expect(detail.getByRole("link", { name: "Assistant" })).toBeFocused();
		await page.keyboard.press("Tab");
		await expect(detail.getByRole("button", { name: "Close run" })).toBeFocused();
		await page.keyboard.press("Tab");
		await expect(detail.getByRole("button", { name: "Restart run" })).toBeFocused();
	});

	test("status sits on the title's line; meta is a list spaced apart, with no separator marks", async ({
		page,
	}) => {
		const detail = page.locator("#detail-page");
		const title = detail.locator(".q-page-header__title");
		const badge = detail.locator(".q-page-header__status");
		await expect(badge).toContainText("Idle");
		const [t, b] = [await box(title), await box(badge)];
		expect(b.x).toBeGreaterThan(t.x + t.width - 1);
		expect(b.y).toBeLessThan(t.y + t.height);

		const items = detail.getByRole("list").getByRole("listitem");
		await expect(items).toHaveCount(5);
		await expect(items.nth(0)).toHaveText("Created 6 hours ago");
		const sep = await items.nth(1).evaluate((el) => getComputedStyle(el, "::before").content);
		expect(sep).toBe("none");
	});

	test("meta: every line starts flush with the title, also after wrapping", async ({ page }) => {
		for (const id of ["detail-page", "narrow"]) {
			const root = page.locator(`#${id}`);
			const titleX = (await box(root.locator(".q-page-header__title"))).x;
			const starts = await root.locator(".q-page-header__meta-item").evaluateAll((els) =>
				els.map((el) => {
					const li = el.getBoundingClientRect();
					return { x: li.x, y: Math.round(li.y) };
				}),
			);
			const lineStarts = starts.filter((s, i) => i === 0 || s.y > (starts[i - 1]?.y ?? 0));
			if (id === "narrow") expect(lineStarts.length).toBeGreaterThan(1);
			for (const s of lineStarts) expect(Math.abs(s.x - titleX)).toBeLessThan(1);
		}
	});

	test("actions sit right of the title when wide and wrap below it when narrow", async ({
		page,
	}) => {
		for (const [id, below] of [
			["detail-page", false],
			["narrow", true],
		] as const) {
			const root = page.locator(`#${id}`);
			const heading = await box(root.locator(".q-page-header__heading"));
			const actions = await box(root.locator(".q-page-header__actions"));
			if (below) expect(actions.y).toBeGreaterThanOrEqual(heading.y + heading.height);
			else expect(actions.x).toBeGreaterThanOrEqual(heading.x + heading.width);
		}
	});

	test("title is the page display size (24px, heading weight), with no rule or margin under the header", async ({
		page,
	}) => {
		const header = page.locator("#list-page .q-page-header");
		const title = header.locator(".q-page-header__title");
		await expect(title).toHaveCSS("font-size", "24px");
		await expect(title).toHaveCSS("font-weight", "650");
		await expect(header).toHaveCSS("border-bottom-style", "none");
		// The page's own gap spaces what follows; a component carries no outer margin.
		await expect(header).toHaveCSS("margin-block-end", "0px");
	});

	test("tabs slot spans the header's full width", async ({ page }) => {
		const header = page.locator("#with-tabs .q-page-header");
		await expect(header.getByRole("tablist", { name: "Artifact sections" })).toBeVisible();
		const [h, t] = [await box(header), await box(header.locator(".q-page-header__tabs"))];
		expect(Math.round(t.width)).toBe(Math.round(h.width));
	});
});
