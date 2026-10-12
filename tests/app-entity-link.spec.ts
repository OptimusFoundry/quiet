import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// App/EntityLink — axe in both themes, plus names, external/state semantics and the resting
// underline. Colour exceptions are the same accepted reference colours as tests/a11y.spec.ts.
const STORY = (theme = "foundry") =>
	`/iframe.html?id=app-entitylink--all&viewMode=story&globals=theme:${theme}`;
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#75757b", "#ff7a3d"],
};

async function open(page: Page, theme?: string) {
	await page.goto(STORY(theme));
	await page.locator("#external").waitFor();
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

	test("names include the kind, the name and the id", async ({ page }) => {
		const prose = page.locator("#in-prose");
		await expect(prose.getByRole("link", { name: "Run 233f76c2", exact: true })).toHaveAttribute(
			"href",
			"/runs/233f76c2",
		);
		// With an icon, the kind is read but not shown.
		const project = prose.getByRole("link", {
			name: "Project Meerkat onboarding and activation",
		});
		await expect(project).toBeVisible();
		await expect(project.locator(".q-entity-link__kind")).toHaveCount(0);
		await expect(project.locator(".q-entity-link__icon")).toHaveAttribute("aria-hidden", "true");
		await expect(
			page.locator("#variants").getByRole("link", { name: "Nightly digest 233f76c2" }),
		).toBeVisible();
	});

	test("done and blocked are announced, not only drawn", async ({ page }) => {
		const refs = page.locator("#ticket-refs");
		const done = refs.getByRole("link", { name: "Ticket B1 (done)" });
		await expect(done).toHaveClass(/q-entity-link--done/);
		await expect(done).toHaveCSS("text-decoration-line", "line-through");
		const blocked = refs.getByRole("link", { name: "Ticket B3 (blocked)" });
		await expect(blocked.locator(".q-entity-link__dot")).toHaveAttribute("aria-hidden", "true");
		await expect(refs.getByRole("link", { name: "Ticket B2", exact: true })).toBeVisible();
	});

	test("external opens a new tab safely and says so", async ({ page }) => {
		const link = page
			.locator("#external")
			.getByRole("link", { name: "OptimusFoundry/quiet (opens in new tab)" });
		await expect(link).toHaveAttribute("target", "_blank");
		await expect(link).toHaveAttribute("rel", "noopener noreferrer");
		await expect(link.locator(".q-entity-link__external")).toHaveAttribute("aria-hidden", "true");
	});

	test("underlined at rest; the underline fills in on keyboard focus", async ({ page }) => {
		await page.addStyleTag({ content: "*{transition:none!important}" });
		const link = page.locator("#in-table").getByRole("link", { name: "weekly-digest.md" });
		await expect(link).toHaveCSS("text-decoration-line", "underline");
		const rest = await link.evaluate((el) => getComputedStyle(el).textDecorationColor);
		const color = await link.evaluate((el) => getComputedStyle(el).color);
		expect(rest).not.toBe(color);
		await link.focus();
		await page.keyboard.press("Shift+Tab");
		await page.keyboard.press("Tab");
		await expect(link).toBeFocused();
		const focused = await link.evaluate((el) => getComputedStyle(el).textDecorationColor);
		expect(focused).toBe(color);
	});

	test("links are reachable with Tab in reading order", async ({ page }) => {
		const first = page.locator("#in-prose").getByRole("link").first();
		await first.focus();
		await expect(first).toBeFocused();
		await page.keyboard.press("Tab");
		await expect(
			page.locator("#in-prose").getByRole("link", { name: "Agent Assistant" }),
		).toBeFocused();
	});
});
