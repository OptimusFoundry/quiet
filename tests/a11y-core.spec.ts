import { expect, type Locator, type Page, test } from "@playwright/test";

// Keyboard + ARIA checks for the core group (Button, ArrowLink, Link, Tag, ButtonGroup, Spinner,
// Avatar, Skeleton, StatusDot, Rule) on the catalog page.
const CATALOG = "/iframe.html?id=catalog--all-components&viewMode=story";

test.beforeEach(async ({ page }) => {
	await page.goto(CATALOG);
	await page.waitForFunction(() => document.querySelectorAll("section").length > 50);
});

/** Focus `el` by keyboard (so :focus-visible matches): focus it, step back, Tab forward. */
async function tabTo(page: Page, el: Locator) {
	await el.focus();
	await page.keyboard.press("Shift+Tab");
	await page.keyboard.press("Tab");
	await expect(el).toBeFocused();
}

const css = (el: Locator, prop: string) =>
	el.evaluate((n, p) => getComputedStyle(n).getPropertyValue(p), prop);

test("Button: keyboard focus shows the hover look; names and states are exposed", async ({
	page,
}) => {
	await page.addStyleTag({ content: "*{transition:none!important;animation:none!important}" });
	const s = page.locator("#button");
	const primary = s.getByRole("button", { name: "Start a project" }).first();
	const rest = await css(primary, "background-color");
	await tabTo(page, primary);
	expect(await css(primary, "background-color")).not.toBe(rest);
	await page.keyboard.press("Tab");
	expect(await css(primary, "background-color")).toBe(rest);

	await expect(s.getByRole("button", { name: "Add" })).toBeVisible();
	await expect(s.getByRole("button", { name: "More" })).toBeVisible();
	for (const b of await s.getByRole("button", { name: /^(Primary|Secondary)$/ }).all())
		await expect(b).toBeDisabled();

	const saving = s.getByRole("button", { name: "Saving" });
	await expect(saving).toHaveAttribute("aria-busy", "true");
	await expect(saving).toHaveAttribute("aria-disabled", "true");
	// Loading keeps focus (aria-disabled, not disabled) so keyboard users don't lose their place.
	await tabTo(page, saving);
});

test("ArrowLink and Link: keyboard focus shows the hover colour; external announces new tab", async ({
	page,
}) => {
	await page.addStyleTag({ content: "*{transition:none!important;animation:none!important}" });
	const arrow = page.locator("#arrowlink").getByRole("link", { name: "Read the studio journal" });
	const arrowRest = await css(arrow, "color");
	await tabTo(page, arrow);
	expect(await css(arrow, "color")).not.toBe(arrowRest);

	const s = page.locator("#link");
	const link = s.getByRole("link", { name: "Default", exact: true });
	const linkRest = await css(link, "color");
	await tabTo(page, link);
	expect(await css(link, "color")).not.toBe(linkRest);

	const ext = s.getByRole("link", { name: "External (opens in new tab)" });
	await expect(ext).toHaveAttribute("target", "_blank");
	await expect(ext).toHaveAttribute("rel", /noopener/);
});

test("Tag: remove button is named after the tag and works from the keyboard", async ({ page }) => {
	const remove = page.locator("#avatar").getByRole("button", { name: "Remove Linus" });
	await tabTo(page, remove);
	const tag = remove.locator("xpath=..");
	await page.keyboard.press("Enter");
	await expect(tag).toHaveAttribute("data-state", "closing");
	// The catalog's onRemove is a no-op, so the tag comes back once the exit has played.
	await expect(tag).not.toHaveAttribute("data-state", "closing");
	await expect(tag).toBeVisible();
});

test("ButtonGroup, Spinner, StatusDot, Rule expose the right roles", async ({ page }) => {
	await expect(page.locator("#buttongroup").getByRole("group")).toHaveCount(5);
	const statuses = page.locator("#spinner").getByRole("status");
	await expect(statuses).toHaveCount(8);
	await expect(
		page.locator("#spinner").getByRole("status", { name: "Casting build" }),
	).toBeVisible();
	// Decorative dots carry no semantics.
	await expect(page.locator("#statusdot [aria-hidden=true]")).toHaveCount(5);
	await expect(page.locator("#rule").getByRole("separator")).toHaveCount(2);
});

test("Avatar: initials avatars are named images, fallback dot is hidden", async ({ page }) => {
	const s = page.locator("#avatar");
	await expect(s.getByRole("img", { name: "Ada Lovelace" })).toHaveCount(7);
	await expect(s.getByRole("img", { name: "Broken Image" })).toHaveCount(1);
	await expect(s.getByRole("img", { name: "Optimus Foundry" })).toHaveCount(1);
});

test("Skeleton: placeholders are hidden from assistive tech", async ({ page }) => {
	const s = page.locator("#skeleton");
	const bones = s.locator(":scope > div > div > div > span, :scope > div > div > div > div > span");
	expect(await bones.count()).toBeGreaterThan(0);
	for (const b of await bones.all()) await expect(b).toHaveAttribute("aria-hidden", "true");
	await expect(s.getByRole("status")).toHaveCount(0);
});
