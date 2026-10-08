import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// Patterns — full SaaS screens composed from quiet components (src/stories/patterns).
// Each screen: axe in both themes, no horizontal page scroll at 390px, and one smoke interaction.

const SCREENS = [
	"app-shell",
	"dashboard",
	"records",
	"settings",
	"billing",
	"assistant",
	"states",
] as const;
const url = (id: string, theme = "foundry") =>
	`/iframe.html?id=patterns-${id}--default&viewMode=story&globals=theme:${theme}`;

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
	for (const id of SCREENS) {
		test(`${id}: no axe violations beyond the accepted colours (${theme})`, async ({ page }) => {
			await open(page, id, theme);
			await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
			// Let first-load timers (skeletons, chart draw-in) settle.
			await page.waitForTimeout(1800);
			const { violations } = await new AxeBuilder({ page })
				.include("#storybook-root")
				// GhostFuture rows are faint on purpose, aria-hidden, and explained by a caption (as in future-display.spec.ts).
				.exclude(".q-ghost-future__ghost")
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
}

test.describe("at 390px", () => {
	test.use({ viewport: { width: 390, height: 844 } });
	for (const id of SCREENS) {
		test(`${id}: no horizontal page scroll`, async ({ page }) => {
			await open(page, id);
			await page.waitForTimeout(600);
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - window.innerWidth,
			);
			expect(overflow).toBeLessThanOrEqual(0);
		});
	}
	test("the sidebar opens from Menu in a drawer", async ({ page }) => {
		await open(page, "dashboard");
		await page.getByRole("button", { name: "Menu", exact: true }).click();
		const drawer = page.getByRole("dialog");
		await expect(drawer.getByRole("navigation", { name: "Main" })).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(drawer).toBeHidden();
	});
});

test.describe("smoke", () => {
	test("app shell: Search opens the command palette, Escape closes it", async ({ page }) => {
		await open(page, "app-shell");
		await page.getByRole("button", { name: /^Search/ }).click();
		const palette = page.getByRole("dialog");
		await expect(palette).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(palette).toBeHidden();
	});

	test("dashboard: the agent run pauses and resumes", async ({ page }) => {
		await open(page, "dashboard");
		await page.getByRole("button", { name: "Pause", exact: true }).click();
		const resume = page.getByRole("button", { name: "Resume", exact: true });
		await expect(resume).toBeVisible();
		await resume.click();
		await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
	});

	test("records: selecting a row asks for approval before removing it", async ({ page }) => {
		await open(page, "records");
		await page.getByRole("checkbox", { name: /Select Mira Osei/ }).check();
		await expect(
			page.getByRole("heading", { name: /Remove 1 signup from Beta · EU/ }),
		).toBeVisible();
		await page.getByRole("button", { name: "Clear selection" }).click();
		await expect(page.getByRole("heading", { name: /Remove 1 signup/ })).toBeHidden();
	});

	test("settings: a notification switch toggles", async ({ page }) => {
		await open(page, "settings");
		const sw = page.getByRole("switch", { name: /Meerkat's posts/ });
		await expect(sw).toHaveAttribute("aria-checked", "false");
		await sw.click();
		await expect(sw).toHaveAttribute("aria-checked", "true");
	});

	test("billing: a leash preset changes the cap and says so", async ({ page }) => {
		await open(page, "billing");
		await page.getByRole("radio", { name: /80/ }).click();
		await expect(page.getByRole("status").filter({ hasText: "Cap set to $80." })).toBeVisible();
	});

	test("assistant: a message sends and Claude replies", async ({ page }) => {
		await open(page, "assistant");
		const box = page.getByRole("textbox", { name: "Message Claude" });
		await box.fill("Pause it, please.");
		await box.press("Enter");
		const log = page.getByRole("log", { name: "Conversation with Claude" });
		await expect(log.getByText("Pause it, please.")).toBeVisible();
		await expect(log.getByText(/Beta · EU is the only campaign over the line/)).toBeVisible({
			timeout: 15_000,
		});
	});

	test("states: Try again loads the campaigns", async ({ page }) => {
		await open(page, "states");
		await page.getByRole("button", { name: "Try again" }).click();
		await expect(page.getByRole("table", { name: "Campaigns, loaded" })).toBeVisible({
			timeout: 5000,
		});
	});
});
