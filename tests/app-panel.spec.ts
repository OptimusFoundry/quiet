import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// App/Panel — axe in both themes, plus the landmark/heading wiring and the collapsed empty state.
// Colour exceptions are the same accepted reference colours as tests/a11y.spec.ts.
const STORY = (theme = "foundry") =>
	`/iframe.html?id=app-panel--all&viewMode=story&globals=theme:${theme}`;
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#75757b", "#ff7a3d"],
};

async function open(page: Page, theme?: string) {
	await page.goto(STORY(theme));
	await page.locator("#padding").waitFor();
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

	test("a titled panel is a region named by its title, without the count", async ({ page }) => {
		const rail = page.locator("#artifact-rail");
		for (const name of ["Lineage", "Inputs", "Consumed by"]) {
			const region = rail.getByRole("region", { name, exact: true });
			await expect(region).toHaveCount(1);
			await expect(region.getByRole("heading", { level: 2, name })).toBeVisible();
		}
		const runs = page.locator("#table").getByRole("region", { name: "Recent runs", exact: true });
		await expect(runs).toHaveCount(1);
		await expect(runs.locator(".q-panel__count")).toHaveText("4");
		await expect(runs.getByRole("heading", { level: 2 })).toHaveText("Recent runs4");
	});

	test("as='h3' sets the heading level", async ({ page }) => {
		await expect(
			page.locator("#outlined").getByRole("heading", { level: 3, name: "Runner" }),
		).toBeVisible();
	});

	test("an untitled panel is not a landmark", async ({ page }) => {
		const untitled = page.locator("#padding .q-panel").nth(1);
		expect(await untitled.evaluate((el) => el.tagName)).toBe("DIV");
		await expect(untitled).not.toHaveAttribute("aria-labelledby");
	});

	test("empty panels collapse to the header plus one muted line", async ({ page }) => {
		const rail = page.locator("#artifact-rail");
		const inputs = rail.getByRole("region", { name: "Inputs" });
		await expect(inputs).toHaveAttribute("data-empty", "true");
		await expect(inputs.locator(".q-panel__empty")).toHaveText("No inputs");
		await expect(inputs.locator(".q-panel__body")).toHaveCount(0);
		const lineage = rail.getByRole("region", { name: "Lineage" });
		await expect(lineage).not.toHaveAttribute("data-empty");
		// The collapsed panel is shorter than one with a body of the same single line.
		const [hEmpty, hFull] = await Promise.all([
			inputs.evaluate((el) => el.getBoundingClientRect().height),
			lineage.evaluate((el) => el.getBoundingClientRect().height),
		]);
		expect(hEmpty).toBeLessThan(hFull);
	});

	test("surface groups with a ground and radius, not a rule", async ({ page }) => {
		const panel = page.locator("#artifact-rail").getByRole("region", { name: "Lineage" });
		const s = await panel.evaluate((el) => {
			const cs = getComputedStyle(el);
			return {
				bg: cs.backgroundColor,
				border: cs.borderTopWidth,
				radius: cs.borderTopLeftRadius,
			};
		});
		expect(s.bg).not.toBe("rgba(0, 0, 0, 0)");
		expect(s.border).toBe("0px");
		expect(Number.parseFloat(s.radius)).toBeGreaterThan(0);
		const outlined = page.locator("#outlined .q-panel").first();
		expect(await outlined.evaluate((el) => getComputedStyle(el).borderTopWidth)).not.toBe("0px");
		const plain = page.locator("#plain .q-panel");
		expect(await plain.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
			"rgba(0, 0, 0, 0)",
		);
		expect(await plain.evaluate((el) => getComputedStyle(el).paddingTop)).toBe("0px");
	});

	test("a table sits on the page ground: plain panel, title and table flush", async ({ page }) => {
		const panel = page.locator("#table .q-panel");
		await expect(panel).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
		const box = await panel.boundingBox();
		const table = await panel.locator("table").boundingBox();
		const title = await panel.locator(".q-panel__title").boundingBox();
		expect(box && table && title).toBeTruthy();
		expect(Math.abs((table?.x ?? 0) - (box?.x ?? 0))).toBeLessThanOrEqual(1);
		expect(Math.abs((title?.x ?? 0) - (box?.x ?? 0))).toBeLessThanOrEqual(1);
	});

	test("actions and links in the header and footer are reachable by keyboard", async ({ page }) => {
		const panel = page.locator("#actions-count").getByRole("region", { name: "Approvals" });
		const approve = panel.getByRole("button", { name: "Approve all" });
		await approve.focus();
		await expect(approve).toBeFocused();
		await page.keyboard.press("Tab");
		await expect(panel.getByRole("link", { name: "Run 51c0d7f3" })).toBeFocused();
		await panel.getByRole("link", { name: "Show resolved approvals" }).focus();
		await expect(panel.getByRole("link", { name: "Show resolved approvals" })).toBeFocused();
	});
});
