import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// Future/Inputs: HonestButton, ProbabilityToggle, ElasticSlider, ConsensusSlider.
const STORY = (theme: string) =>
	`/iframe.html?id=future-inputs--all&viewMode=story&globals=theme:${theme}`;

// Same accepted colours as tests/a11y.spec.ts (the reference's --muted-2 and small molten text).
const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#6e6e76", "#f06a33"],
};

async function open(page: Page, theme = "foundry") {
	await page.goto(STORY(theme));
	await page.waitForSelector("#consensus-slider");
}

for (const theme of ["foundry", "foundry-dark"]) {
	test(`future inputs: no axe violations beyond the accepted colours (${theme})`, async ({
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

test.describe("keyboard + ARIA", () => {
	test.beforeEach(async ({ page }) => open(page));

	test("honest button: Enter runs it, busy while running, then Done is announced", async ({
		page,
	}) => {
		const s = page.locator("#honest-button");
		const save = s.getByRole("button", { name: "Save" });
		await save.focus();
		await page.keyboard.press("Enter");
		await expect(s.getByRole("button", { name: "Done" })).toBeVisible();
		await expect(s.getByRole("status").first()).toHaveText("Done");
		await expect(s.getByRole("button", { name: "Save" })).toBeVisible({ timeout: 5000 });

		const verify = s.getByRole("button", { name: "Verify domain" });
		await verify.press("Space");
		await expect(verify).toHaveAttribute("aria-busy", "true");
		await expect(s.getByRole("status").nth(1)).toHaveText("Running, about 4s");
		await expect(s.getByRole("button", { name: "Disabled" })).toBeDisabled();
	});

	test("probability toggle: arrows/Home/End move it and the policy reads back", async ({
		page,
	}) => {
		const t = page.locator("#probability-toggle").getByRole("slider", {
			name: "Publish without asking",
		});
		await expect(t).toHaveAttribute("aria-valuetext", "Mostly, 80%");
		await expect(t).toHaveAccessibleDescription(/unless the draft mentions pricing/);
		await t.press("End");
		await expect(t).toHaveAttribute("aria-valuenow", "100");
		await expect(t).toHaveAttribute("aria-valuetext", "Always, 100%");
		await t.press("Home");
		await expect(t).toHaveAttribute("aria-valuetext", "Off, 0%");
		await t.press("PageUp");
		await t.press("ArrowRight");
		await expect(t).toHaveAttribute("aria-valuenow", "30");
		await expect(t).toHaveAttribute("aria-valuetext", "Rarely, 30%");
		await expect(t).toHaveAccessibleDescription("Posts alone only for routine release notes.");
	});

	test("elastic slider: keyboard stops at the safe line until the override is held", async ({
		page,
	}) => {
		const s = page.locator("#elastic-slider");
		const slider = s.getByRole("slider", { name: "Daily send limit" });
		await expect(slider).toHaveAccessibleDescription(/Safe up to 6,000/);
		await slider.press("End");
		await expect(slider).toHaveAttribute("aria-valuenow", "60");
		await slider.press("ArrowRight");
		await expect(slider).toHaveAttribute("aria-valuenow", "60");
		await expect(s.getByRole("status")).toHaveText(/Hold the override/);

		const hold = s.getByRole("button", { name: "Hold override" });
		await expect(hold).toHaveAttribute("aria-pressed", "false");
		await hold.press("Enter");
		await expect(s.getByRole("button", { name: "Override held" })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		await slider.press("ArrowRight");
		await expect(slider).toHaveAttribute("aria-valuenow", "61");
		await expect(slider).toHaveAttribute("aria-valuetext", "6,100 / day, past the safe line");
		await expect(s.getByRole("status")).toHaveText("Past the safe line");
		await slider.press("End");
		await expect(slider).toHaveAttribute("aria-valuenow", "100");
		// Releasing the override puts the value back on the line.
		await s.getByRole("button", { name: "Override held" }).click();
		await expect(slider).toHaveAttribute("aria-valuenow", "60");
	});

	test("elastic slider: a drag past the line springs back on release", async ({ page }) => {
		const s = page.locator("#elastic-slider");
		const slider = s.getByRole("slider", { name: "Daily send limit" });
		const track = s.locator(".q-elastic-slider__track");
		await track.scrollIntoViewIfNeeded();
		const box = await track.boundingBox();
		if (!box) throw new Error("no track");
		const y = box.y + box.height / 2;
		await page.mouse.move(box.x + box.width * 0.3, y);
		await page.mouse.down();
		await page.mouse.move(box.x + box.width, y, { steps: 5 });
		// Full travel past 60 only gains 35% of the remaining 40.
		await expect(slider).toHaveAttribute("aria-valuenow", "74");
		await page.mouse.up();
		await expect(slider).toHaveAttribute("aria-valuenow", "60");
	});

	test("consensus slider: others are described, meet in the middle moves to the mean", async ({
		page,
	}) => {
		const s = page.locator("#consensus-slider");
		const slider = s.getByRole("slider", { name: "Pro price" });
		await expect(slider).toHaveAttribute("aria-valuetext", "$29");
		await expect(slider).toHaveAccessibleDescription(
			"Ada Park $24, Leo Brandt $35, Meerkat (agent) $31 Spread $24–$35 · wide",
		);
		await slider.press("ArrowRight");
		await expect(slider).toHaveAttribute("aria-valuenow", "30");
		await slider.press("PageDown");
		await expect(slider).toHaveAttribute("aria-valuenow", "20");
		await expect(s.getByText("Spread $20–$35 · wide")).toBeVisible();
		await s.getByRole("button", { name: "Meet in the middle" }).click();
		await expect(slider).toHaveAttribute("aria-valuenow", "30");
		await expect(s.getByText("· at the mean")).toBeVisible();
		await expect(s.getByRole("button", { name: "Meet in the middle" })).toBeDisabled();
	});
});
