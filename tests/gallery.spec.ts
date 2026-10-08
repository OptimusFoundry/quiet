import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const story = (id: string, mode = "light") =>
	`/iframe.html?id=${id}&viewMode=story&globals=mode:${mode}`;

for (const mode of ["light", "dark"]) {
	test(`gallery has no axe violations (${mode})`, async ({ page }) => {
		await page.goto(story("components-gallery--gallery", mode));
		await page.getByRole("switch", { name: /weekly digest/i }).waitFor();
		const { violations } = await new AxeBuilder({ page }).include("#storybook-root").analyze();
		expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
	});
}

test("switch toggles with Space and keeps aria-checked in sync", async ({ page }) => {
	await page.goto(story("components-gallery--gallery"));
	const sw = page.getByRole("switch", { name: /auto-publish/i });
	await expect(sw).toHaveAttribute("aria-checked", "false");
	await sw.focus();
	await page.keyboard.press("Space");
	await expect(sw).toHaveAttribute("aria-checked", "true");
	await expect(sw).toBeChecked();
});

test("segmented control moves with arrow keys", async ({ page }) => {
	await page.goto(story("components-gallery--gallery"));
	const week = page.getByRole("radio", { name: "Week" });
	await week.focus();
	await page.keyboard.press("ArrowRight");
	await expect(page.getByRole("radio", { name: "Month" })).toBeChecked();
	await page.keyboard.press("ArrowLeft");
	await page.keyboard.press("ArrowLeft");
	await expect(page.getByRole("radio", { name: "Day" })).toBeChecked();
});
