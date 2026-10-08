import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// Future/Data: AnomalyRibbon, StreamingTable, ThresholdHandles, UncertaintyCell — axe in both
// themes, plus keyboard and ARIA. Colour exceptions are the same accepted reference colours as
// tests/a11y.spec.ts.
const STORY = (theme = "foundry") =>
	`/iframe.html?id=future-data--all&viewMode=story&globals=theme:${theme}`;
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#6e6e76", "#f06a33"],
};

async function open(page: Page, theme?: string) {
	await page.goto(STORY(theme));
	await page.locator("#uncertainty-cells").waitFor();
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

	test("uncertainty cell: speaks its range, measured values set heavier, bands toggle", async ({
		page,
	}) => {
		const s = page.locator("#uncertainty-cells");
		const cells = s.locator(".q-uncertainty-cell");
		await expect(cells.nth(0)).toHaveClass(/q-uncertainty-cell--measured/);
		await expect(cells.nth(0).locator(".q-sr-only")).toHaveText("4,812");
		await expect(cells.nth(1)).toHaveClass(/q-uncertainty-cell--uncertain/);
		await expect(cells.nth(1).locator(".q-sr-only")).toHaveText(
			"5,400, likely between 4,780 and 6,020",
		);
		await expect(cells.nth(3).locator(".q-sr-only")).toHaveText("412, likely between 380 and 470");
		await expect(s.locator(".q-uncertainty-cell__track")).toHaveCount(3);
		await s.getByRole("switch", { name: "Show bands" }).click();
		await expect(s.locator(".q-uncertainty-cell__track")).toHaveCount(0);
		await expect(cells.nth(1).locator(".q-uncertainty-cell__range")).toHaveText("±620");
	});

	test("threshold handles: vertical sliders, keys move and stay ordered, count updates", async ({
		page,
	}) => {
		const band = page
			.locator("#threshold-handles")
			.getByRole("group", { name: "Bounce rate · alert band" });
		const high = band.getByRole("slider", { name: "High threshold" });
		const low = band.getByRole("slider", { name: "Low threshold" });
		await expect(high).toHaveAttribute("aria-orientation", "vertical");
		await expect(high).toHaveAttribute("aria-valuenow", "5.5");
		await expect(high).toHaveAttribute("aria-valuetext", "5.5%");
		const summary = band.getByRole("status");
		const before = await summary.textContent();
		await high.press("ArrowUp");
		await expect(high).toHaveAttribute("aria-valuenow", "5.6");
		await high.press("PageDown");
		await expect(high).toHaveAttribute("aria-valuenow", "4.6");
		await expect(summary).not.toHaveText(before ?? "");
		await high.press("End");
		await expect(high).toHaveAttribute("aria-valuenow", "8");
		// The low line can't pass the high one.
		await high.press("Home");
		await expect(high).toHaveAttribute("aria-valuenow", "1.9");
		await low.press("End");
		await expect(low).toHaveAttribute("aria-valuenow", "1.8");
		await low.press("Home");
		await expect(low).toHaveAttribute("aria-valuenow", "0");
		await expect(low).toHaveAttribute("aria-valuemax", "1.8");

		const only = page.locator("#threshold-handles").getByRole("group", { name: "Spend per day" });
		await expect(only.getByRole("slider")).toHaveCount(1);
	});

	test("threshold handles: dragging a line moves it", async ({ page }) => {
		const band = page
			.locator("#threshold-handles")
			.getByRole("group", { name: "Bounce rate · alert band" });
		const high = band.getByRole("slider", { name: "High threshold" });
		await high.scrollIntoViewIfNeeded();
		const box = await high.boundingBox();
		if (!box) throw new Error("no handle box");
		await page.mouse.move(box.x + 40, box.y + box.height / 2);
		await page.mouse.down();
		await page.mouse.move(box.x + 40, box.y + box.height / 2 - 40, { steps: 5 });
		await page.mouse.up();
		expect(Number(await high.getAttribute("aria-valuenow"))).toBeGreaterThan(6.5);
	});

	test("anomaly ribbon: one tab stop, arrows move, Enter selects and announces", async ({
		page,
	}) => {
		const ribbon = page.locator("#anomaly-ribbon").getByRole("group", { name: "Signup anomalies" });
		const marks = ribbon.getByRole("button");
		await expect(marks).toHaveCount(3);
		await expect(marks.nth(0)).toHaveAttribute("tabindex", "0");
		await expect(marks.nth(1)).toHaveAttribute("tabindex", "-1");
		await marks.nth(0).focus();
		await page.keyboard.press("ArrowRight");
		await expect(marks.nth(1)).toBeFocused();
		await expect(marks.nth(1)).toHaveAccessibleName("Sep 42: −26 signups vs expected");
		await page.keyboard.press("Enter");
		await expect(marks.nth(1)).toHaveAttribute("aria-pressed", "true");
		const status = page.locator("#anomaly-ribbon").getByRole("status");
		await expect(status).toHaveText("Sep 42 · −26 signups vs expected");
		await expect(
			page.locator('#anomaly-ribbon .q-anomaly-ribbon__bar[data-mark="selected"]'),
		).toHaveCount(1);
		await page.keyboard.press("End");
		await expect(marks.nth(2)).toBeFocused();
		await marks.nth(1).press("Enter");
		await expect(marks.nth(1)).toHaveAttribute("aria-pressed", "false");
		await expect(status).toHaveText("");
	});

	test("streaming table: rows arrive live; paused or focused, they wait behind 'Show N new'", async ({
		page,
	}) => {
		const s = page.locator("#streaming-table");
		const rows = s.locator("tbody tr");
		const arrive = s.getByRole("button", { name: "A signup arrives" });
		await expect(rows).toHaveCount(4);

		await arrive.click();
		await expect(rows).toHaveCount(5);
		await expect(rows.first()).toContainText("Kai Ito 5");
		await expect(s.getByRole("status")).toHaveText("1 new row", { timeout: 5000 });

		const pause = s.getByRole("button", { name: "Pause" });
		await pause.click();
		await expect(s.getByRole("button", { name: "Resume" })).toHaveAttribute("aria-pressed", "true");
		await arrive.click();
		await arrive.click();
		await expect(rows).toHaveCount(5);
		const waiting = s.getByRole("button", { name: "Show 2 new" });
		await expect(waiting).toBeVisible();
		await expect(s.getByRole("status")).toHaveText("2 waiting", { timeout: 5000 });
		await waiting.click();
		await expect(rows).toHaveCount(7);
		await expect(rows.first()).toContainText("Tove Berg 7");
		await expect(waiting).toHaveCount(0);

		// Resumed, but focus is in the table: still held, and it lets them in when focus leaves.
		await s.getByRole("button", { name: "Resume" }).click();
		await s.getByRole("region", { name: "Signups, newest first" }).focus();
		await arrive.evaluate((b: HTMLButtonElement) => b.click());
		await expect(s.getByRole("button", { name: "Show 1 new" })).toBeVisible();
		await expect(rows).toHaveCount(7);
		await arrive.focus();
		await expect(rows).toHaveCount(8);
		await expect(s.getByRole("button", { name: /Show \d+ new/ })).toHaveCount(0);
	});
});
