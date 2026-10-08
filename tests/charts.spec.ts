import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// Charts: Sparkline, LineChart, BarChart, DonutChart, NarratedChart — axe in both themes, plus
// keyboard + ARIA. Colour exceptions are the same accepted reference colours as tests/a11y.spec.ts.
const STORY = (theme = "foundry") =>
	`/iframe.html?id=charts--all&viewMode=story&globals=theme:${theme}`;
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#6e6e76", "#f06a33"],
};

async function open(page: Page, theme?: string) {
	await page.goto(STORY(theme));
	await page.locator("#narrated-chart").waitFor();
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

test.describe("keyboard + ARIA", () => {
	test.beforeEach(async ({ page }) => open(page));

	test("sparkline: one spoken sentence", async ({ page }) => {
		const spark = page.locator("#sparkline").getByRole("img", { name: /Verified signups/ });
		await expect(spark).toHaveAccessibleName(
			"Verified signups, last 24 days: from 42 to 204, low 38, high 204",
		);
	});

	test("line chart: arrows move the crosshair and announce the values", async ({ page }) => {
		const plot = page
			.locator("#line-chart")
			.getByRole("slider", { name: "Verified signups · September" });
		await plot.focus();
		await expect(plot).toHaveAttribute("aria-valuenow", "23");
		await expect(plot).toHaveAttribute("aria-valuetext", "Sep 24: This month 204, Last month 88");
		await expect(page.locator("#line-chart .q-line-chart__crosshair")).toHaveCount(1);
		await plot.press("Home");
		await expect(plot).toHaveAttribute("aria-valuetext", "Sep 1: This month 42, Last month 40");
		await plot.press("ArrowRight");
		await expect(plot).toHaveAttribute("aria-valuenow", "1");
		await expect(page.locator("#line-chart .q-chart__tooltip").first()).toContainText("Sep 2");
		await plot.blur();
		await expect(page.locator("#line-chart .q-line-chart__crosshair")).toHaveCount(0);
	});

	test("line chart: the data is also a table", async ({ page }) => {
		const table = page.locator("#line-chart table").first();
		await expect(table.locator("caption")).toHaveText("Verified signups · September");
		await expect(table.locator("tbody tr")).toHaveCount(24);
	});

	test("bar chart: one tab stop, arrows move between named bars", async ({ page }) => {
		const chart = page.locator("#bar-chart").getByRole("group", { name: "Signups by channel" });
		const bars = chart.getByRole("img");
		await expect(bars).toHaveCount(12);
		await expect(chart.locator('[tabindex="0"]')).toHaveCount(1);
		const first = chart.getByRole("img", { name: "Q1, Organic: 420" });
		await first.focus();
		await expect(first).toHaveAttribute("data-active", "true");
		await page.keyboard.press("ArrowRight");
		await expect(chart.getByRole("img", { name: "Q1, Referral: 180" })).toBeFocused();
		await page.keyboard.press("End");
		await expect(chart.getByRole("img", { name: "Q4, Paid: 140" })).toBeFocused();
		await expect(page.locator("#bar-chart .q-chart__tooltip").first()).toContainText("Q4");
	});

	test("donut: segments focusable, centre shows the share", async ({ page }) => {
		const chart = page.locator("#donut-chart").getByRole("group", { name: "MRR by plan" });
		const pro = chart.getByRole("img", { name: "Pro: $9.4k, 71%" });
		await pro.focus();
		await expect(page.locator("#donut-chart .q-donut-chart__center")).toContainText("Pro");
		await page.keyboard.press("ArrowDown");
		await expect(chart.getByRole("img", { name: "Team: $2.6k, 20%" })).toBeFocused();
		await expect(page.locator("#donut-chart .q-donut-chart__center")).toContainText("20%");
	});

	test("narrated chart: each sentence marks its point or range", async ({ page }) => {
		const s = page.locator("#narrated-chart");
		const first = s.getByRole("button", { name: /Quiet first week/ });
		await expect(first).toHaveAttribute("aria-pressed", "true");
		await expect(s.locator(".q-line-chart__highlight")).toHaveCount(1);
		await expect(s.locator(".q-line-chart__mark")).toHaveCount(0);
		await first.focus();
		await page.keyboard.press("ArrowDown");
		const ph = s.getByRole("button", { name: /Product Hunt/ });
		await expect(ph).toBeFocused();
		await expect(ph).toHaveAttribute("aria-pressed", "true");
		await expect(first).toHaveAttribute("aria-pressed", "false");
		await expect(s.locator(".q-line-chart__mark")).toHaveCount(1);
		await expect(s.locator(".q-line-chart__highlight")).toHaveCount(0);
		await s.getByRole("button", { name: /Best day/ }).click();
		await expect(s.getByRole("button", { name: /Best day/ })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
	});
});
