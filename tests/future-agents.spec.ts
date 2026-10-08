import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// Future/Agents: AgentRun, Approval + HoldButton, DraftDiff, CostMeter — axe in both themes,
// then keyboard operation and ARIA state.
const STORY = (theme = "foundry") =>
	`/iframe.html?id=future-agents--all&viewMode=story&globals=theme:${theme}`;

// Same accepted colours as tests/a11y.spec.ts ("keep exact colours", 2026-10-08).
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#6e6e76", "#f06a33"],
};

async function open(page: Page, theme?: string) {
	await page.goto(STORY(theme));
	await page.waitForSelector("#cost-meter");
}

for (const theme of ["foundry", "foundry-dark"]) {
	test(`agents story has no axe violations beyond the accepted colours (${theme})`, async ({
		page,
	}) => {
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

test.describe("interactions", () => {
	test.beforeEach(async ({ page }) => open(page));

	test("agent run: current step marked, pause/resume by keyboard, reaches the human step", async ({
		page,
	}) => {
		const run = page.locator("#agent-run section").first();
		await expect(run.getByRole("heading", { name: "Pausing bouncing campaigns" })).toBeVisible();
		const steps = run.getByRole("listitem");
		await expect(steps).toHaveCount(5);
		await expect(run.locator('[aria-current="step"]')).toHaveCount(1);
		const pause = run.getByRole("button", { name: "Pause" });
		await pause.focus();
		await page.keyboard.press("Enter");
		const resume = run.getByRole("button", { name: "Resume" });
		await expect(resume).toBeVisible();
		const paused = await run.locator('[aria-current="step"]').textContent();
		await expect(run.getByRole("status")).toContainText("paused");
		await page.waitForTimeout(1600);
		await expect(run.locator('[aria-current="step"]')).toHaveText(paused ?? "");
		await resume.focus();
		await page.keyboard.press("Enter");
		await expect(run.locator('[aria-current="step"]')).toContainText("Waiting for your approval", {
			timeout: 10_000,
		});
		await expect(run.getByRole("status")).toContainText("waiting for you");
		await expect(run.getByRole("button", { name: "Review 3 notices" })).toBeVisible();
		await expect(run.getByRole("group", { name: "Run controls" })).toHaveCount(0);
	});

	test("agent run: stopped run announces itself", async ({ page }) => {
		const run = page.locator("#agent-run section").nth(2);
		await expect(run.getByRole("status")).toHaveText("Run stopped");
		await expect(run.locator('[aria-current="step"]')).toContainText("stopped");
	});

	test("approval: changes are listed as before → after; hold Space to confirm, early release resets", async ({
		page,
	}) => {
		const s = page.locator("#approval");
		const approval = s.getByRole("region", { name: "Pause 3 campaigns on Sjocamp" });
		await expect(approval).toHaveAccessibleDescription(/Nothing is deleted/);
		const rows = approval.getByRole("list", { name: "Changes" }).getByRole("listitem");
		await expect(rows).toHaveCount(3);
		await expect(rows.first()).toHaveText(/Live.*to.*Paused/);
		const hold = approval.getByRole("button", { name: /Pause 3 campaigns/ });
		await expect(hold).toHaveAccessibleDescription("Press and hold to confirm");
		await hold.focus();
		// A tap does nothing.
		await page.keyboard.down("Space");
		await expect(approval.getByRole("progressbar", { name: "Hold progress" })).toBeAttached();
		await page.keyboard.up("Space");
		await expect(approval.getByRole("progressbar")).toHaveCount(0);
		await expect(hold).toHaveText(/Pause 3 campaigns/);
		// A full hold confirms.
		await page.keyboard.down("Space");
		await page.waitForTimeout(1100);
		await page.keyboard.up("Space");
		await expect(approval.getByRole("button", { name: /Paused · undo for 24h/ })).toBeVisible();
		await expect(approval.getByRole("status")).toHaveText("Paused · undo for 24h");
		await expect(approval.getByRole("button", { name: "Edit plan" })).toHaveCount(0);
	});

	test("hold button: Enter works too, and a pointer hold confirms", async ({ page }) => {
		const s = page.locator("#approval");
		const del = s.getByRole("button", { name: /Delete workspace/ });
		await del.focus();
		await page.keyboard.down("Enter");
		await page.waitForTimeout(1100);
		await page.keyboard.up("Enter");
		await expect(s.getByRole("button", { name: /Deleted/ })).toBeVisible();
		const revoke = s.getByRole("button", { name: /Revoke all keys/ });
		const box = await revoke.boundingBox();
		if (!box) throw new Error("no box");
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down();
		await page.waitForTimeout(1700);
		await page.mouse.up();
		await expect(s.getByRole("button", { name: /Revoked/ })).toBeVisible();
	});

	test("draft diff: accept/keep per hunk, focus follows, shipping blocked while pending", async ({
		page,
	}) => {
		const d = page.locator("#draft-diff").getByRole("region", { name: "Meerkat suggests 3 edits" });
		const ship = d.getByRole("button", { name: "Schedule post" });
		await expect(ship).toBeDisabled();
		await expect(d.getByRole("status")).toHaveText("0 accepted · 3 pending · 0 kept");
		const accept = d.getByRole("button", { name: "Accept “waitlist”" });
		await accept.focus();
		await page.keyboard.press("Enter");
		const resolved = d.getByRole("button", { name: "Accepted “waitlist”. Reconsider" });
		await expect(resolved).toBeFocused();
		await page.keyboard.press("Enter");
		await expect(d.getByRole("button", { name: "Accept “waitlist”" })).toBeFocused();
		await page.keyboard.press("Enter");
		await d.getByRole("button", { name: "Keep “lifetime Pro.”" }).click();
		await expect(d.getByRole("button", { name: "Kept “lifetime Pro.”. Reconsider" })).toBeVisible();
		await expect(ship).toBeDisabled();
		await d.getByRole("button", { name: "Accept all" }).click();
		await expect(d.getByRole("status")).toHaveText("2 accepted · 0 pending · 1 kept");
		await expect(ship).toBeEnabled();
		await ship.click();
		await expect(d.getByRole("button", { name: "Scheduled" })).toBeVisible();
		await d.getByRole("button", { name: "Reset" }).click();
		await expect(d.getByRole("status")).toHaveText("0 accepted · 3 pending · 0 kept");
	});

	test("cost meter: named bars, a line near its cap warns", async ({ page }) => {
		const m = page.locator("#cost-meter").getByRole("region", { name: "Agents · today" });
		const bars = m.getByRole("progressbar");
		await expect(bars).toHaveCount(3);
		await expect(bars.first()).toHaveAccessibleName(
			/^Replying to signups: \$\d+\.\d\d of \$4\.00$/,
		);
		await expect(m.locator(".q-cost-meter__item--warn")).toContainText("Rendering clips", {
			timeout: 5_000,
		});
		await expect(m.locator(".q-cost-meter__item--warn .q-progress--warning")).toHaveCount(1);
	});
});
