import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// Future/Display: DecayingBadge, GhostFuture, BorderProgress — axe in both themes, plus ARIA and
// behaviour. Colour exceptions are the same accepted reference colours as tests/a11y.spec.ts.
// Ghost rows are excluded from axe: they are pure decoration (aria-hidden, explained by the
// visible caption) and deliberately faded — WCAG 1.4.3 exempts decorative text.
const STORY = (theme = "foundry") =>
	`/iframe.html?id=future-display--all&viewMode=story&globals=theme:${theme}`;
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#6e6e76", "#f06a33"],
};

async function open(page: Page, theme?: string) {
	await page.goto(STORY(theme));
	await page.locator("#border-progress").waitFor();
}

for (const theme of ["foundry", "foundry-dark"]) {
	test(`no axe violations beyond the accepted colours (${theme})`, async ({ page }) => {
		await open(page, theme);
		await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
		const { violations } = await new AxeBuilder({ page })
			.include("#storybook-root")
			.exclude(".q-ghost-future__ghosts")
			.analyze();
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

	test("decaying badge: names its age, strikes through when stale, re-check refreshes", async ({
		page,
	}) => {
		const states = page.locator("#decaying-badge .q-decaying-badge");
		await expect(states.nth(0)).toContainText("Verified, checked 1 hour ago");
		await expect(states.nth(0)).not.toHaveAttribute("data-stale");
		await expect(states.nth(3)).toHaveAttribute("data-stale", "true");
		await expect(states.nth(3)).toContainText("Unknown, Verified expired, checked 4 days ago");
		await expect(states.nth(4)).toContainText("never checked");

		const demo = page.locator("#decaying-badge");
		const oldest = demo.getByRole("button", { name: /Verified, checked 2 days ago\. Re-check/ });
		await expect(oldest).toBeVisible();
		// Let time pass with the keyboard: the oldest fact goes stale.
		const slider = demo.getByRole("slider", { name: "Time passes" });
		await slider.focus();
		await page.keyboard.press("PageUp");
		const stale = demo.getByRole("button", { name: /^Unknown, Verified expired/ });
		await expect(stale).toHaveCount(1);
		await expect(stale).toHaveAttribute("data-stale", "true");
		await stale.focus();
		await page.keyboard.press("Enter");
		await expect(demo.getByRole("button", { name: /^Unknown/ })).toHaveCount(0);
		await expect(
			demo.getByRole("button", { name: "Verified, checked just now. Re-check" }),
		).toHaveCount(1);
	});

	test("ghost future: ghosts are hidden from AT and fold away as real rows arrive", async ({
		page,
	}) => {
		const s = page.locator("#ghost-future");
		await expect(s.locator(".q-ghost-future__ghosts")).toHaveAttribute("aria-hidden", "true");
		const open = s.locator('.q-ghost-future__slot[data-state="open"]');
		await expect(open).toHaveCount(4);
		await expect(s.locator(".q-ghost-future__caption")).toBeVisible();
		const add = s.getByRole("button", { name: "Add a signup" });
		await add.click();
		await expect(open).toHaveCount(3);
		await expect(s.getByText("mira@hey.com")).toBeVisible();
		for (let i = 0; i < 3; i++) await add.click();
		await expect(open).toHaveCount(0);
		await expect(s.locator(".q-ghost-future__caption")).toHaveCount(0);
		await s.getByRole("button", { name: "Reset" }).click();
		await expect(open).toHaveCount(4);
	});

	test("border progress: progressbar with value, done state, indeterminate", async ({ page }) => {
		const s = page.locator("#border-progress");
		const bar = s.getByRole("progressbar", { name: "Rendering 3 clips" });
		await expect(bar).toHaveAttribute("aria-valuenow", "40");
		await expect(bar).toHaveAttribute("aria-valuetext", "40%, about 4 min left");
		const advance = s.getByRole("button", { name: "Advance" });
		for (let i = 0; i < 3; i++) await advance.click();
		await expect(bar).toHaveAttribute("aria-valuenow", "100");
		await expect(s.locator(".q-border-progress").first()).toHaveAttribute("data-state", "done");
		await expect(advance).toBeDisabled();
		const sync = s.getByRole("progressbar", { name: "Syncing contacts" });
		await expect(sync).not.toHaveAttribute("aria-valuenow");
		await expect(s.getByRole("progressbar", { name: "Queued export" })).toHaveAttribute(
			"aria-valuenow",
			"0",
		);
	});
});
