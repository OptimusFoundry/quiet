import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// Future/Trust: Checkpoints, DoubtMarker, Receipt, LineageChip — axe in both themes, plus keyboard
// and ARIA. Colour exceptions are the same accepted reference colours as tests/a11y.spec.ts.
const STORY = (theme = "foundry") =>
	`/iframe.html?id=future-trust--all&viewMode=story&globals=theme:${theme}`;
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#6e6e76", "#f06a33"],
};

async function open(page: Page, theme?: string) {
	await page.goto(STORY(theme));
	await page.locator("#lineage-chip").waitFor();
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

	test("checkpoints: one tab stop, arrows select, Enter restores as a new checkpoint", async ({
		page,
	}) => {
		const list = page.getByRole("listbox", { name: "Spring waitlist history" });
		const options = list.getByRole("option");
		await expect(options).toHaveCount(5);
		await expect(options.nth(4)).toHaveAttribute("aria-selected", "true");
		await expect(list.locator('[tabindex="0"]')).toHaveCount(1);
		await expect(page.locator("#checkpoints")).toContainText("current state");

		await options.nth(4).focus();
		await page.keyboard.press("ArrowLeft");
		await page.keyboard.press("ArrowLeft");
		await expect(options.nth(2)).toBeFocused();
		await expect(options.nth(2)).toHaveAttribute("aria-selected", "true");
		await expect(options.nth(2)).toHaveAccessibleName("Enabled referrals, You, 13:05");
		await expect(page.locator("#checkpoints")).toContainText(
			"restoring here reverts 4 later changes",
		);
		await page.keyboard.press("Home");
		await expect(options.nth(0)).toBeFocused();
		await page.keyboard.press("End");
		await expect(options.nth(4)).toBeFocused();

		await page.keyboard.press("ArrowLeft");
		await page.keyboard.press("Enter");
		await expect(options).toHaveCount(6);
		await expect(options.nth(5)).toHaveAttribute("aria-selected", "true");
		await expect(options.nth(5)).toHaveAccessibleName(/Restored to 14:02/);
	});

	test("doubt marker: focus explains why, Enter re-checks, then confirms or rewrites", async ({
		page,
	}) => {
		const s = page.locator("#doubt-marker");
		const claim = s.getByRole("button", { name: /Most came from the Product Hunt feature/ });
		await claim.focus();
		const tip = s.getByRole("tooltip").filter({ hasText: "4 in 10 signups" });
		await expect(tip).toBeVisible();
		await expect(tip).toContainText("58% sure");
		await expect(claim).toHaveAccessibleDescription(/4 in 10 signups arrived with none/);
		await page.keyboard.press("Escape");
		await expect(tip).toBeHidden();

		await page.keyboard.press("Enter");
		await expect(s.getByText("Re-checking").first()).toBeVisible();
		await expect(s.getByText("About 61% came from the Product Hunt feature")).toBeVisible();
		const revised = s.locator(".q-doubt-marker--revised").first();
		await expect(revised.locator(".q-doubt-marker__was")).toContainText(
			"Most came from the Product Hunt feature.",
		);

		const other = s.getByRole("button", { name: /Verification held at 91%/ });
		await other.press("Enter");
		await expect(s.locator(".q-doubt-marker--confirmed").first()).toContainText(
			"Verification held at 91%.",
		);
	});

	test("receipt: each line has its own undo; undone lines strike through and keep focus", async ({
		page,
	}) => {
		const r = page.getByRole("article", { name: /Meerkat/ });
		await expect(r.getByRole("list", { name: "Effects" }).getByRole("listitem")).toHaveCount(5);
		await expect(r.getByRole("button", { name: /^Undo:/ })).toHaveCount(3);
		const undo = r.getByRole("button", { name: "Undo: Paused Founding members" });
		await undo.focus();
		await page.keyboard.press("Enter");
		await expect(undo).toHaveCount(0);
		await expect(r.getByRole("button", { name: /^Undo:/ })).toHaveCount(2);
		const line = r.getByRole("listitem").nth(1);
		await expect(line).toHaveAttribute("data-undone", "true");
		await expect(line.locator(".q-receipt__effect")).toBeFocused();
		await expect(r.getByRole("status")).toHaveText("Undone: Paused Founding members");
	});

	test("lineage chip: a disclosure that names the stale step", async ({ page }) => {
		const s = page.locator("#lineage-chip");
		const fresh = s.getByRole("button", { name: /All sources fresh · 4 min, lineage of MRR/ });
		await expect(fresh).toHaveAttribute("aria-expanded", "false");
		const chain = s.locator(".q-lineage-chip").nth(0).getByRole("list", { includeHidden: true });
		await expect(chain).toBeHidden();
		await fresh.focus();
		await page.keyboard.press("Enter");
		await expect(fresh).toHaveAttribute("aria-expanded", "true");
		await expect(chain).toBeVisible();
		await expect(chain).toHaveAccessibleName("Lineage of MRR");
		await expect(chain.getByRole("listitem")).toHaveCount(5);
		await page.keyboard.press("Space");
		await expect(fresh).toHaveAttribute("aria-expanded", "false");

		const stale = s.getByRole("button", { name: /1 source stale · 40 min late/ });
		await expect(stale).toHaveAttribute("aria-expanded", "true");
		const staleChain = s.locator(".q-lineage-chip").nth(1).getByRole("list");
		await expect(staleChain.getByRole("listitem").nth(1)).toHaveAttribute("data-stale", "true");
		await expect(staleChain.getByRole("listitem").nth(1)).toContainText("40 min late, stale");
	});
});
