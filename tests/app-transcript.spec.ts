import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// App/Transcript — axe in both themes, plus the session disclosures (keyboard, aria-expanded,
// labelled regions), message grouping, rendered lists and the empty session.
// Colour exceptions are the same accepted reference colours as tests/a11y.spec.ts.
const STORY = (theme = "foundry") =>
	`/iframe.html?id=app-transcript--all&viewMode=story&globals=theme:${theme}`;
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#75757b", "#ff7a3d"],
};

async function open(page: Page, theme?: string) {
	await page.goto(STORY(theme));
	await page.locator("#all .q-transcript").waitFor();
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

	test("latest session open, earlier ones folded with a summary", async ({ page }) => {
		const t = page.locator("#latest");
		const toggles = t.getByRole("button", { name: /^Session/ });
		// Session 3 is empty: a heading with no toggle.
		await expect(toggles).toHaveCount(3);
		const s1 = t.getByRole("button", { name: /Session 1/ });
		await expect(s1).toHaveAttribute("aria-expanded", "false");
		await expect(s1).toContainText("2 messages · 1 tool call");
		await expect(t.getByRole("button", { name: /Session 2/ })).toContainText(
			"3 messages · 2 tool calls · 1 failed",
		);
		await expect(t.getByRole("button", { name: /Session 4/ })).toHaveAttribute(
			"aria-expanded",
			"true",
		);
		// Folded regions are inert, so their content is out of the accessibility tree.
		await expect(t.getByRole("region", { name: /Session 1/ })).toHaveAttribute("inert", "");
		await expect(t.getByRole("region", { name: /Session 4/ })).not.toHaveAttribute("inert");
	});

	test("keyboard: Enter/Space toggle, arrows move between session headers", async ({ page }) => {
		const t = page.locator("#latest");
		const s1 = t.getByRole("button", { name: /Session 1/ });
		const s2 = t.getByRole("button", { name: /Session 2/ });
		const s4 = t.getByRole("button", { name: /Session 4/ });

		await s1.focus();
		await expect(s1).toBeFocused();
		await page.keyboard.press("Enter");
		await expect(s1).toHaveAttribute("aria-expanded", "true");
		const region = t.getByRole("region", { name: /Session 1/ });
		await expect(region).toBeVisible();
		await expect(s1).toHaveAttribute("aria-controls", (await region.getAttribute("id")) ?? "");
		await expect(region.getByRole("listitem")).toHaveCount(4);

		await page.keyboard.press("ArrowDown");
		await expect(s2).toBeFocused();
		// The empty session has no toggle; ArrowDown skips straight to Session 4.
		await page.keyboard.press("ArrowDown");
		await expect(s4).toBeFocused();
		await page.keyboard.press("Space");
		await expect(s4).toHaveAttribute("aria-expanded", "false");
		await expect(t.getByRole("region", { name: /Session 4/ })).toHaveAttribute("inert", "");
		await page.keyboard.press("Home");
		await expect(s1).toBeFocused();
		await page.keyboard.press("End");
		await expect(s4).toBeFocused();
		await page.keyboard.press("Enter");
		await expect(s4).toHaveAttribute("aria-expanded", "true");
	});

	test("empty session says so instead of an empty heading", async ({ page }) => {
		const h = page.locator("#latest").getByRole("heading", { name: /Session 3/ });
		await expect(h).toContainText("No messages");
	});

	test("consecutive messages share one byline; tool calls and events render", async ({ page }) => {
		const region = page.locator("#all").getByRole("region", { name: /Attempt 2/ });
		const user = region.locator(".q-transcript__group--user");
		await expect(user).toHaveCount(1);
		await expect(user.locator(".q-transcript__byline")).toHaveText(
			/Shubhanshu Aarsay\s*chat\s*14:10/,
		);
		await expect(user.getByRole("article")).toHaveCount(2);
		await expect(region.getByRole("heading", { name: "Shubhanshu Aarsay said" })).toHaveCount(2);
		// The failed tool call names its state and opens to its error.
		const failed = region.getByRole("button", { name: /slack\.send_message.*failed/ });
		await failed.press("Enter");
		await expect(failed).toHaveAttribute("aria-expanded", "true");
		await expect(region.getByRole("region", { name: "slack.send_message details" })).toContainText(
			"not_in_channel",
		);
		await expect(region.getByRole("note")).toContainText("Run restarted");
		// Inline code renders as code, never as raw backticks.
		await expect(region.locator("code", { hasText: "/invite @agentworks" })).toHaveCount(1);
		await expect(region).not.toContainText("`");
	});
});
