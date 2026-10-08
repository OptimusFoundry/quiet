import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const catalog = (mode = "light") =>
	`/iframe.html?id=catalog--components&viewMode=story&globals=mode:${mode}`;

// Accepted exceptions (decided 2026-10-08: keep the Optimus Foundry values exactly):
// --q-muted-2 (2.98:1) for non-essential text, and the accent on small text. Any other
// contrast failure still fails the test.
const ACCEPTED_LOW_CONTRAST = {
	light: ["#95959c", "#e0531a"],
	dark: ["#6e6e76", "#f06a33"],
} as const;

for (const mode of ["light", "dark"] as const) {
	test(`catalog has no axe violations (${mode})`, async ({ page }) => {
		await page.goto(catalog(mode));
		await page.getByRole("switch", { name: /weekly digest/i }).waitFor();
		// Entrance fades would otherwise be measured mid-animation.
		await page.evaluate(() =>
			Promise.all(
				document
					.getAnimations()
					.filter((a) => a.effect?.getTiming().iterations !== Number.POSITIVE_INFINITY)
					.map((a) => a.finished),
			),
		);
		const { violations } = await new AxeBuilder({ page }).include("#storybook-root").analyze();
		const accepted: readonly string[] = ACCEPTED_LOW_CONTRAST[mode];
		const remaining = violations
			.map((v) => ({
				...v,
				nodes:
					v.id === "color-contrast"
						? v.nodes.filter(
								(n) => !accepted.includes(String(n.any[0]?.data?.fgColor ?? "").toLowerCase()),
							)
						: v.nodes,
			}))
			.filter((v) => v.nodes.length > 0);
		expect(
			remaining.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
		).toEqual([]);
	});
}

test("switch toggles with Space and keeps aria-checked in sync", async ({ page }) => {
	await page.goto(catalog());
	const sw = page.getByRole("switch", { name: "Off" });
	await expect(sw).toHaveAttribute("aria-checked", "false");
	await sw.focus();
	await page.keyboard.press("Space");
	await expect(sw).toHaveAttribute("aria-checked", "true");
	await expect(sw).toBeChecked();
});

test("segmented control moves with arrow keys", async ({ page }) => {
	await page.goto(catalog());
	const week = page.getByRole("radio", { name: "Week" });
	await week.focus();
	await page.keyboard.press("ArrowRight");
	await expect(page.getByRole("radio", { name: "Month" })).toBeChecked();
	await page.keyboard.press("ArrowLeft");
	await page.keyboard.press("ArrowLeft");
	await expect(page.getByRole("radio", { name: "Day" })).toBeChecked();
});

test("selectable tag toggles aria-pressed from the keyboard", async ({ page }) => {
	await page.goto(catalog());
	const web = page.getByRole("button", { name: "Web" });
	await expect(web).toHaveAttribute("aria-pressed", "false");
	await web.focus();
	await page.keyboard.press("Enter");
	await expect(web).toHaveAttribute("aria-pressed", "true");
	await page.keyboard.press("Space");
	await expect(web).toHaveAttribute("aria-pressed", "false");
});

test("removable tag exposes a named remove button", async ({ page }) => {
	await page.goto(catalog());
	await expect(page.getByRole("button", { name: "Remove Kafka" })).toBeVisible();
});
