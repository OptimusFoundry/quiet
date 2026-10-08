import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// Guidelines — measured specimens for docs/guidelines/{spacing,typography,grid,layouts,sections}.md.
// Each page: axe in both themes, no horizontal page scroll at 390px, and its live measurements.

const PAGES = ["spacing", "typography", "grid", "layouts", "sections"] as const;
const url = (id: string, theme = "foundry") =>
	`/iframe.html?id=guidelines-${id}--default&viewMode=story&globals=theme:${theme}`;

// Same accepted colours as tests/a11y.spec.ts (2026-10-08, "keep exact colours").
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#6e6e76", "#f06a33"],
};

async function open(page: Page, id: string, theme = "foundry") {
	await page.goto(url(id, theme));
	await expect(page.locator("#storybook-root h1")).toHaveCount(1);
}

for (const theme of ["foundry", "foundry-dark"]) {
	for (const id of PAGES) {
		test(`${id}: no axe violations beyond the accepted colours (${theme})`, async ({ page }) => {
			await open(page, id, theme);
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
}

test.describe("at 390px", () => {
	test.use({ viewport: { width: 390, height: 844 } });
	for (const id of PAGES) {
		test(`${id}: no horizontal page scroll`, async ({ page }) => {
			await open(page, id);
			const over = await page.evaluate(
				() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
			);
			expect(over).toBeLessThanOrEqual(0);
		});
	}
});

test("spacing: job tokens follow density", async ({ page }) => {
	await open(page, "spacing");
	const block = page.getByText("--q-space-block · 32").first();
	await expect(block).toBeVisible();
	await page.getByRole("radio", { name: "Compact" }).click();
	await expect(page.getByText("--q-space-block · 24").first()).toBeVisible();
	await page.getByRole("radio", { name: "Marketing" }).click();
	await expect(page.getByText("--q-space-block · 64").first()).toBeVisible();
});

test("typography: roles measure at their app sizes", async ({ page }) => {
	await open(page, "typography");
	for (const m of ["40 / 40 · 700", "17 / 26 · 600", "15 / 23 · 400", "13 / 20 · 400"]) {
		await expect(page.getByText(m, { exact: true }).first()).toBeVisible();
	}
});

test("grid: spans collapse by container width", async ({ page }) => {
	await open(page, "grid");
	// The 560px frame is under 720, so its spans are full width (one per row).
	const frame = page
		.getByText(/^grid 560px wide$/)
		.first()
		.locator("..");
	const cells = frame.locator(".q-col");
	const first = await cells.nth(0).boundingBox();
	const second = await cells.nth(1).boundingBox();
	expect(second?.y ?? 0).toBeGreaterThan(first?.y ?? 0);
});
