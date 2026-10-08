import { expect, type Page, test } from "@playwright/test";

// Keyboard operation and ARIA state for the navigation group (Tabs, Breadcrumb, Pagination,
// StepIndicator, Sidebar, NavBar, CommandPalette), exercised on the catalog page.
const CATALOG = "/iframe.html?id=catalog--all-components&viewMode=story";

async function open(page: Page) {
	await page.goto(CATALOG);
	await page.waitForFunction(() => document.querySelectorAll("section").length > 50);
}

test.beforeEach(async ({ page }) => open(page));

test("Tabs: roving tabindex, arrows/Home/End with automatic activation, disabled skipped", async ({
	page,
}) => {
	const line = page.locator("#tabs").getByRole("tablist").nth(0);
	const all = line.getByRole("tab", { name: "All" });
	await expect(all).toHaveAttribute("aria-selected", "true");
	await expect(all).toHaveAttribute("tabindex", "0");
	await expect(line.getByRole("tab", { name: "Product" })).toHaveAttribute("tabindex", "-1");

	await all.focus();
	await page.keyboard.press("ArrowRight");
	const product = line.getByRole("tab", { name: "Product" });
	await expect(product).toBeFocused();
	await expect(product).toHaveAttribute("aria-selected", "true");
	await expect(product).toHaveAttribute("tabindex", "0");
	await expect(all).toHaveAttribute("tabindex", "-1");
	await expect(page.locator("#tabs")).toContainText("Selected: Product");

	await page.keyboard.press("End");
	await expect(line.getByRole("tab", { name: "Editorial" })).toBeFocused();
	await expect(line.getByRole("tab", { name: "Editorial" })).toHaveAttribute(
		"aria-selected",
		"true",
	);
	await page.keyboard.press("Home");
	await expect(all).toBeFocused();
	await page.keyboard.press("ArrowLeft");
	await expect(line.getByRole("tab", { name: "Editorial" })).toBeFocused();

	// Pill variant: "Archived" is disabled and skipped (wraps back to Live).
	const pill = page.locator("#tabs").getByRole("tablist").nth(1);
	await pill.getByRole("tab", { name: /Live/ }).focus();
	await page.keyboard.press("ArrowRight");
	await expect(pill.getByRole("tab", { name: /Prototypes/ })).toBeFocused();
	await page.keyboard.press("ArrowRight");
	await expect(pill.getByRole("tab", { name: /Live/ })).toBeFocused();
	await expect(pill.getByRole("tab", { name: /Archived/ })).toBeDisabled();
});

test("Breadcrumb: named nav, ordered list, current page, keyboard expand of …", async ({
	page,
}) => {
	const s = page.locator("#breadcrumb");
	const first = s.getByRole("navigation", { name: "Breadcrumb: Anvil" });
	await expect(first.getByRole("list")).toHaveCount(1);
	await expect(first.getByRole("listitem")).toHaveCount(3);
	await expect(first.locator('[aria-current="page"]')).toHaveText("Anvil");

	const collapsed = s.getByRole("navigation", { name: "Breadcrumb: Build 14" });
	await expect(collapsed.getByRole("listitem")).toHaveCount(4);
	const more = collapsed.getByRole("button", { name: "Show 2 more items" });
	await more.focus();
	await page.keyboard.press("Enter");
	await expect(collapsed.getByRole("listitem")).toHaveCount(5);
	await expect(collapsed.getByRole("link", { name: "Work" })).toBeFocused();
});

test("Pagination: named buttons, aria-current, disabled at the ends", async ({ page }) => {
	const s = page.locator("#pagination");
	const nav = s.getByRole("navigation").nth(0);
	await expect(nav).toHaveAccessibleName("Pagination, page 6 of 20");
	await expect(nav.getByRole("button", { name: "Page 6", exact: true })).toHaveAttribute(
		"aria-current",
		"page",
	);
	await nav.getByRole("button", { name: "Next page" }).focus();
	await page.keyboard.press("Enter");
	await expect(nav.getByRole("button", { name: "Page 7", exact: true })).toHaveAttribute(
		"aria-current",
		"page",
	);
	await expect(nav.getByRole("button", { name: "Page 6", exact: true })).not.toHaveAttribute(
		"aria-current",
		/.*/,
	);

	const small = s.getByRole("navigation").nth(3);
	await expect(small.getByRole("button", { name: "First page" })).toBeDisabled();
	await expect(small.getByRole("button", { name: "Previous page" })).toBeDisabled();
	await expect(small.getByRole("button", { name: "Next page" })).toBeEnabled();
});

test("StepIndicator: list, aria-current=step, state in text, completed steps operable", async ({
	page,
}) => {
	const list = page.locator("#stepindicator").getByRole("list").nth(0);
	await expect(list.getByRole("listitem")).toHaveCount(4);
	await expect(list.locator('[aria-current="step"]')).toContainText("Cast");
	await expect(list.getByRole("listitem").nth(0)).toContainText("Brief, completed");
	await expect(list.getByRole("listitem").nth(2)).toContainText("Temper, not started");

	const back = list.getByRole("button", { name: "Go back to Brief" });
	await back.focus();
	await page.keyboard.press("Enter");
	await expect(list.locator('[aria-current="step"]')).toContainText("Brief");

	const err = page.locator("#stepindicator").getByRole("list").nth(1);
	await expect(err.getByRole("listitem").nth(1)).toContainText("Billing, has an error");
});

test("Sidebar: named nav with lists, aria-current, badges announced, collapse toggle", async ({
	page,
}) => {
	const nav = page
		.locator("#sidebar")
		.getByRole("navigation", { name: "Sidebar: Workspace, Account" });
	await expect(nav.getByRole("list", { name: "Workspace" })).toBeVisible();
	await expect(nav.getByRole("list", { name: "Account" })).toBeVisible();
	await expect(nav.getByRole("button", { name: "Overview" })).toHaveAttribute(
		"aria-current",
		"page",
	);
	await expect(nav.getByRole("button", { name: "Projects (14)" })).toBeVisible();

	await nav.getByRole("button", { name: "Projects (14)" }).focus();
	await page.keyboard.press("Enter");
	await expect(nav.getByRole("button", { name: "Projects (14)" })).toHaveAttribute(
		"aria-current",
		"page",
	);
	await expect(nav.getByRole("button", { name: "Overview" })).not.toHaveAttribute(
		"aria-current",
		/.*/,
	);

	const toggle = nav.getByRole("button", { name: "Collapse sidebar" });
	await toggle.focus();
	await page.keyboard.press("Enter");
	await expect(nav.getByRole("button", { name: "Expand sidebar" })).toBeFocused();
	// In the rail, items keep their names (label + badge) for screen readers.
	await expect(nav.getByRole("button", { name: "Team (7)" })).toBeVisible();
});

test("NavBar: named nav landmark with links", async ({ page }) => {
	const nav = page.locator("#navbar").getByRole("navigation", { name: "Main" });
	await expect(nav.getByRole("link", { name: "Capabilities" })).toBeVisible();
});

test("CommandPalette: dialog, combobox + listbox, focus trap, Escape and focus return", async ({
	page,
}) => {
	const opener = page.locator("#commandpalette").getByRole("button", { name: "Open palette" });
	await opener.click();
	const dialog = page.getByRole("dialog", { name: "Command palette" });
	await expect(dialog).toBeVisible();
	const input = dialog.getByRole("combobox", { name: "Search commands" });
	await expect(input).toBeFocused();
	await expect(input).toHaveAttribute("aria-expanded", "true");
	const listbox = dialog.getByRole("listbox");
	await expect(input).toHaveAttribute("aria-controls", (await listbox.getAttribute("id")) ?? "");
	await expect(dialog.getByRole("group", { name: "Projects" })).toBeVisible();

	const first = dialog.getByRole("option", { name: "New project" });
	await expect(input).toHaveAttribute(
		"aria-activedescendant",
		(await first.getAttribute("id")) ?? "",
	);
	await page.keyboard.press("ArrowDown");
	const second = dialog.getByRole("option", { name: "Invite teammate" });
	await expect(second).toHaveAttribute("aria-selected", "true");
	await expect(input).toHaveAttribute(
		"aria-activedescendant",
		(await second.getAttribute("id")) ?? "",
	);

	await input.fill("anv");
	await expect(dialog.getByRole("status")).toHaveText("1 result");
	await expect(dialog.getByRole("option")).toHaveCount(1);

	// Focus stays inside the dialog.
	await page.keyboard.press("Tab");
	await expect(input).toBeFocused();
	await page.keyboard.press("Shift+Tab");
	await expect(input).toBeFocused();

	await page.keyboard.press("Escape");
	await expect(dialog).toBeHidden();
	await expect(opener).toBeFocused();

	// Enter runs the active option, closes and also returns focus.
	await opener.click();
	await expect(page.getByRole("dialog")).toBeVisible();
	// Focus moves into the palette in an effect; pressing earlier would hit the opener instead.
	await expect(page.getByRole("dialog").getByRole("combobox")).toBeFocused();
	await page.keyboard.press("Enter");
	await expect(page.getByRole("dialog")).toBeHidden();
	await expect(opener).toBeFocused();
});
