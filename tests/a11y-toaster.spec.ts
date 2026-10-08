import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const story = (id: string, args = "") =>
	`/iframe.html?id=feedback-toaster--${id}&viewMode=story${args ? `&args=${args}` : ""}`;

async function load(page: Page, id = "default", args = "") {
	await page.goto(story(id, args));
	await page.getByRole("button", { name: "Info toast" }).waitFor();
}

const region = (page: Page) => page.getByRole("region", { name: "Notifications" });

test("the region is portalled, themed and a polite live region before any toast", async ({
	page,
}) => {
	await load(page);
	await expect(region(page)).toHaveCount(1);
	expect(await region(page).evaluate((el) => el.parentElement === document.body)).toBe(true);
	await expect(region(page)).toHaveAttribute("data-theme", "foundry");
	await expect(region(page).locator("ol")).toHaveAttribute("aria-live", "polite");
	await expect(region(page).getByRole("listitem")).toHaveCount(0);
});

test("the portal carries the surrounding theme", async ({ page }) => {
	await page.goto(`${story("default")}&globals=theme:foundry-dark`);
	await expect(region(page)).toHaveAttribute("data-theme", "foundry-dark");
	await expect(region(page)).toHaveCSS("color-scheme", "dark");
});

test("toasts stack in order; info is role=status, error is role=alert", async ({ page }) => {
	await load(page);
	await page.getByRole("button", { name: "Info toast" }).click();
	await page.getByRole("button", { name: "Success toast" }).click();
	await page.getByRole("button", { name: "Error toast" }).click();
	const items = region(page).getByRole("listitem");
	await expect(items).toHaveCount(3);
	await expect(items.nth(0)).toContainText("Draft saved");
	await expect(items.nth(2)).toContainText("Delivery failed");
	await expect(region(page).getByRole("status")).toHaveCount(2);
	await expect(region(page).getByRole("status").first()).toContainText("Draft saved");
	const alert = region(page).getByRole("alert");
	await expect(alert).toContainText("The endpoint returned 500.");
	await expect(alert.getByRole("button", { name: "Retry" })).toBeVisible();
});

test("the dismiss button and toast.dismiss(id) remove toasts", async ({ page }) => {
	await load(page);
	await page.getByRole("button", { name: "Info toast" }).click();
	await page.getByRole("button", { name: "Error toast" }).click();
	await page.getByRole("button", { name: "Dismiss last" }).click();
	await expect(region(page).getByRole("alert")).toHaveCount(0);
	await expect(region(page).getByRole("status")).toHaveCount(1);
	await region(page).getByRole("button", { name: "Dismiss notification" }).click();
	await expect(region(page).getByRole("listitem")).toHaveCount(0);
	await page.getByRole("button", { name: "Info toast" }).click();
	await page.getByRole("button", { name: "Success toast" }).click();
	await page.getByRole("button", { name: "Dismiss all" }).click();
	await expect(region(page).getByRole("listitem")).toHaveCount(0);
});

test("duration auto-dismisses, paused while hovered and while focused", async ({ page }) => {
	await load(page, "default", "duration:600");
	await page.getByRole("button", { name: "Info toast" }).click();
	await expect(region(page).getByRole("status")).toHaveCount(0, { timeout: 3000 });

	await page.getByRole("button", { name: "Info toast" }).click();
	await region(page).getByRole("status").hover();
	await page.waitForTimeout(1200);
	await expect(region(page).getByRole("status")).toBeVisible();
	await page.mouse.move(0, 0);
	await expect(region(page).getByRole("status")).toHaveCount(0, { timeout: 3000 });

	await page.getByRole("button", { name: "Info toast" }).click();
	await region(page).getByRole("button", { name: "Dismiss notification" }).focus();
	await page.waitForTimeout(1200);
	await expect(region(page).getByRole("status")).toBeVisible();
});

test("max keeps only the newest toasts", async ({ page }) => {
	await load(page, "default", "max:2");
	for (const name of ["Info toast", "Success toast", "Error toast"])
		await page.getByRole("button", { name }).click();
	const items = region(page).getByRole("listitem");
	await expect(items).toHaveCount(2);
	await expect(items.nth(0)).toContainText("Webhook created");
});

test("position places the stack at that edge", async ({ page }) => {
	await page.setViewportSize({ width: 1200, height: 800 });
	const toastBox = async () => {
		const box = await region(page).getByRole("status").boundingBox();
		if (!box) throw new Error("toast not rendered");
		return box;
	};
	await load(page);
	await page.getByRole("button", { name: "Info toast" }).click();
	let box = await toastBox();
	expect(box.x + box.width).toBeGreaterThan(1100);
	expect(box.y + box.height).toBeGreaterThan(700);

	await load(page, "top-center");
	await page.getByRole("button", { name: "Info toast" }).click();
	box = await toastBox();
	expect(box.y).toBeLessThan(100);
	expect(Math.abs(box.x + box.width / 2 - 600)).toBeLessThan(4);
});

test("a second Toaster does not render toasts twice", async ({ page }) => {
	await load(page, "two-toasters");
	await expect(region(page)).toHaveCount(1);
	await page.getByRole("button", { name: "Info toast" }).click();
	await expect(page.getByRole("status")).toHaveCount(1);
});

test("toasts have no axe violations", async ({ page }) => {
	await load(page);
	await page.getByRole("button", { name: "Info toast" }).click();
	await page.getByRole("button", { name: "Error toast" }).click();
	await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
	const { violations } = await new AxeBuilder({ page })
		.include("#storybook-root")
		.include(".q-toaster")
		.analyze();
	expect(violations.map((v) => v.id)).toEqual([]);
});
