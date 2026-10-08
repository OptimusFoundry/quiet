import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// Future/Delegation: IntentBar, ScopeGrant, UndoRiver, BudgetLeash, RunScrubber — axe in both
// themes, then keyboard operation and ARIA state.
const STORY = (theme = "foundry") =>
	`/iframe.html?id=future-delegation--all&viewMode=story&globals=theme:${theme}`;

// Same accepted colours as tests/a11y.spec.ts ("keep exact colours", 2026-10-08).
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#6e6e76", "#f06a33"],
};

async function open(page: Page, theme?: string) {
	await page.goto(STORY(theme));
	await page.waitForSelector("#run-scrubber");
}

for (const theme of ["foundry", "foundry-dark"]) {
	test(`delegation story has no axe violations beyond the accepted colours (${theme})`, async ({
		page,
	}) => {
		await open(page, theme);
		await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
		// Read the intent too, so the chips and footer are checked.
		await page.locator("#intent-bar").getByRole("button", { name: "Read" }).click();
		await expect(
			page.locator("#intent-bar").getByRole("list", { name: "How it was read" }),
		).toBeVisible();
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

test.describe("interactions", () => {
	test.beforeEach(async ({ page }) => open(page));

	test("intent bar: Enter reads, chips announce, a chip menu changes the reading", async ({
		page,
	}) => {
		const s = page.locator("#intent-bar");
		const field = s.getByRole("textbox", { name: "What do you want done?" });
		await field.focus();
		await page.keyboard.press("Enter");
		await expect(s.getByRole("status")).toHaveText(
			/Read as: Action Pause, Target Campaigns · Sjocamp/,
		);
		const action = s.getByRole("button", { name: "Action Pause" });
		await expect(action).toHaveAttribute("aria-haspopup", "menu");
		await action.focus();
		await page.keyboard.press("Enter");
		const menu = page.getByRole("menu");
		await expect(menu).toBeVisible();
		await page.keyboard.press("ArrowDown");
		await page.keyboard.press("Enter");
		await expect(s.getByRole("button", { name: "Action Archive" })).toBeVisible();
		await expect(s.getByRole("button", { name: /Archive 3 campaigns/ })).toBeVisible();
		// Typing again returns to idle; a suggestion fills the field.
		await field.fill("");
		await s.getByRole("button", { name: "what bounced this week" }).click();
		await expect(field).toHaveValue("what bounced this week");
	});

	test("scope grant: switches toggle, footer names what it can't do, grant + revoke announce", async ({
		page,
	}) => {
		const s = page.locator("#scope-grant");
		await expect(s.getByText(/can't publish, billing · expires at midnight/)).toBeVisible();
		const publish = s.getByRole("switch", { name: "Publish to Bluesky, X, Threads" });
		await expect(publish).toHaveAttribute("aria-checked", "false");
		await expect(publish).toHaveAccessibleDescription("Asks first");
		await publish.focus();
		await page.keyboard.press("Space");
		await expect(publish).toHaveAttribute("aria-checked", "true");
		await expect(s.getByText(/can't billing/)).toBeVisible();
		const dur = s.getByRole("radiogroup", { name: "How long" });
		await dur.getByRole("radio", { name: "Today" }).focus();
		await page.keyboard.press("ArrowRight");
		await expect(dur.getByRole("radio", { name: "Until revoked" })).toHaveAttribute(
			"aria-checked",
			"true",
		);
		await s.getByRole("button", { name: "Grant" }).click();
		await expect(s.getByRole("status")).toHaveText(
			/Granted: can 4, can't billing, until you revoke it/,
		);
		await s.getByRole("button", { name: "Revoke all" }).click();
		await expect(s.getByRole("button", { name: "Grant" })).toBeVisible();
	});

	test("undo river: one tab stop, arrows move newest → oldest, undo announces and keeps focus", async ({
		page,
	}) => {
		const s = page.locator("#undo-river");
		const list = s.getByRole("list", { name: "Recent actions" });
		const items = list.getByRole("button");
		await expect(items).toHaveCount(5);
		await expect(items.first()).toHaveAccessibleName(
			/Paused Founding members, by Meerkat, 2 hours ago\. Undo/,
		);
		await expect(items.nth(2)).toHaveAccessibleName(/Deleted 2 drafts, by you/);
		await expect(list.locator('button[tabindex="0"]')).toHaveCount(1);
		await items.first().focus();
		await page.keyboard.press("ArrowRight");
		await expect(items.nth(1)).toBeFocused();
		await page.keyboard.press("Enter");
		await expect(s.getByRole("status")).toHaveText("Undid: Changed domain");
		await expect(items).toHaveCount(4);
		await expect(list.getByRole("button", { name: /Deleted 2 drafts/ })).toBeFocused();
	});

	test("budget leash: a named meter; presets and slack lengthen it; taut near the cap", async ({
		page,
	}) => {
		const s = page.locator("#budget-leash");
		const meter = s.getByRole("meter", { name: "Meerkat · research run" });
		await expect(meter).toHaveAttribute("aria-valuemax", "40");
		await expect(meter).toHaveAttribute("aria-valuetext", "$8.40 of $40, full speed");
		const leash = s.getByRole("radiogroup", { name: "Leash length" });
		await leash.getByRole("radio", { name: "$40" }).focus();
		await page.keyboard.press("ArrowLeft");
		await expect(meter).toHaveAttribute("aria-valuemax", "20");
		await expect(meter).toHaveAttribute("aria-valuetext", "$8.40 of $20, full speed");
		await s.getByRole("button", { name: /Give slack/ }).click();
		await expect(meter).toHaveAttribute("aria-valuemax", "30");
		await s.getByRole("button", { name: "Let it spend" }).click();
		await expect(meter).toHaveAttribute("aria-valuetext", /of \$30, stopped at the leash/, {
			timeout: 15_000,
		});
		await expect(s.getByRole("status")).toHaveText(
			/stopped at the leash, asks before spending more/,
		);
		await expect(s.locator(".q-budget-leash")).toHaveClass(/q-budget-leash--taut/);
	});

	test("run scrubber: slider over steps, keys move, the panel follows", async ({ page }) => {
		const s = page.locator("#run-scrubber");
		const slider = s.getByRole("slider", { name: "Meerkat's run" });
		await expect(slider).toHaveAttribute("aria-valuenow", "3");
		await expect(slider).toHaveAttribute("aria-valuetext", "Step 3 of 5: Look at Beta · EU");
		await expect(s.getByText(/212 of 268 bounces/)).toBeVisible();
		await slider.focus();
		await page.keyboard.press("ArrowRight");
		await expect(slider).toHaveAttribute("aria-valuetext", "Step 4 of 5: Decide");
		await expect(s.getByText(/might just need a filter/)).toBeVisible();
		await expect(s.getByRole("button", { name: "Branch from step 4" })).toBeVisible();
		await page.keyboard.press("Home");
		await expect(slider).toHaveAttribute("aria-valuenow", "1");
		await page.keyboard.press("End");
		await expect(slider).toHaveAttribute("aria-valuenow", "5");
		// Pointer: click near the left of the track lands on the first step.
		const box = await s.locator(".q-run-scrubber__track").boundingBox();
		if (!box) throw new Error("no track");
		await page.mouse.click(box.x + 2, box.y + box.height / 2);
		await expect(slider).toHaveAttribute("aria-valuenow", "1");
	});
});
