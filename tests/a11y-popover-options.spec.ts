import { expect, type Page, test } from "@playwright/test";

const STORY = "/iframe.html?id=overlays-popover-options--close-options&viewMode=story";

test.beforeEach(async ({ page }) => {
	await page.goto(STORY);
	await page.getByRole("button", { name: "Default" }).waitFor();
});

const open = async (page: Page, name: string) => {
	const trigger = page.getByRole("button", { name });
	await trigger.click();
	return trigger;
};

test("defaults: Escape and outside click close; no close button", async ({ page }) => {
	const trigger = await open(page, "Default");
	const panel = page.getByRole("dialog", { name: "Share this build" });
	await expect(panel).toBeVisible();
	await expect(panel.getByRole("button", { name: "Close" })).toHaveCount(0);
	await page.keyboard.press("Escape");
	await expect(panel).toHaveCount(0);
	await expect(trigger).toBeFocused();
	await open(page, "Default");
	await page.mouse.click(700, 300);
	await expect(panel).toHaveCount(0);
});

test("showClose renders a × that closes and returns focus to the trigger", async ({ page }) => {
	const trigger = await open(page, "With close");
	const panel = page.getByRole("dialog", { name: "Invite a teammate" });
	const close = panel.getByRole("button", { name: "Close" });
	await expect(close).toBeFocused();
	await close.click();
	await expect(panel).toHaveCount(0);
	await expect(trigger).toHaveAttribute("aria-expanded", "false");
	await expect(trigger).toBeFocused();
});

test("closeOnEscape and closeOnClickOutside off keep it open", async ({ page }) => {
	const trigger = await open(page, "Sticky");
	const panel = page.getByRole("dialog", { name: "Pinned note" });
	await page.keyboard.press("Escape");
	await expect(panel).toBeVisible();
	await page.mouse.click(700, 300);
	await expect(panel).toBeVisible();
	await expect(trigger).toHaveAttribute("aria-expanded", "true");
	await trigger.click();
	await expect(panel).toHaveCount(0);
	await open(page, "Sticky");
	await panel.getByRole("button", { name: "Close" }).click();
	await expect(panel).toHaveCount(0);
});
