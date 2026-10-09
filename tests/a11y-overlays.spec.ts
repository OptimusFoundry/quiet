import { expect, type Page, test } from "@playwright/test";

// Keyboard + ARIA behaviour of the feedback, overlay and layout components in the catalog.
const CATALOG = "/iframe.html?id=catalog--all-components&viewMode=story";

async function load(page: Page) {
	await page.goto(CATALOG);
	await page.waitForFunction(() => document.querySelectorAll("section").length > 50);
}

const focusedInside = (page: Page, selector: string) =>
	page.evaluate((s) => !!document.querySelector(s)?.contains(document.activeElement), selector);

// A click on the scrim that lands right after the modal is committed, before any later task runs:
// what happens on a loaded machine, where the first click can beat React's passive effects. The
// blur stands in for the scrim mousedown's default action (focus moves to <body>).
const clickScrimOnCommit = (page: Page, scrim: string) =>
	page.evaluate((sel) => {
		new MutationObserver((records, obs) => {
			const el = records
				.flatMap((r) => [...r.addedNodes])
				.find((n): n is HTMLElement => n instanceof HTMLElement && n.matches(sel));
			if (!el) return;
			obs.disconnect();
			(document.activeElement as HTMLElement | null)?.blur();
			el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		}).observe(document.body, { subtree: true, childList: true });
	}, scrim);

test.beforeEach(async ({ page }) => load(page));

test("Dialog traps focus, closes on Escape and returns focus", async ({ page }) => {
	const open = page.locator("#dialog").getByRole("button", { name: /Open dialog/ });
	await open.click();
	const dialog = page.getByRole("dialog", { name: /Commission a piece/ });
	await expect(dialog).toBeVisible();
	await expect(dialog).toHaveAttribute("aria-modal", "true");
	await expect(dialog.getByRole("button", { name: "Close dialog" })).toBeFocused();
	for (let i = 0; i < 8; i++) {
		await page.keyboard.press("Tab");
		expect(await focusedInside(page, '[role="dialog"]')).toBe(true);
	}
	await page.keyboard.press("Shift+Tab");
	expect(await focusedInside(page, '[role="dialog"]')).toBe(true);
	await expect(page.locator("main")).toHaveJSProperty("inert", true);
	await page.keyboard.press("Escape");
	await expect(dialog).toHaveCount(0);
	await expect(open).toBeFocused();
	await expect(page.locator("main")).toHaveJSProperty("inert", false);
});

test("Drawer is a labelled modal; Escape and scrim click close it", async ({ page }) => {
	const open = page.locator("#drawer").getByRole("button", { name: "Open filters" });
	await open.click();
	const drawer = page.getByRole("dialog", { name: /Filter the archive/ });
	await expect(drawer).toBeVisible();
	await expect(drawer).toHaveAccessibleDescription(/Narrow fourteen pieces/);
	expect(await focusedInside(page, '[role="dialog"]')).toBe(true);
	await page.keyboard.press("Escape");
	await expect(drawer).toHaveCount(0);
	await expect(open).toBeFocused();
	await open.click();
	await expect(drawer).toBeVisible();
	await page.mouse.click(40, 450);
	await expect(drawer).toHaveCount(0);
});

for (const [name, section, opener, scrim] of [
	["Dialog", "#dialog", /Open dialog/, ".q-dialog"],
	["Drawer", "#drawer", "Open filters", ".q-drawer"],
] as const)
	test(`${name}: a scrim click right after it opens still returns focus`, async ({ page }) => {
		const open = page.locator(section).getByRole("button", { name: opener });
		await clickScrimOnCommit(page, scrim);
		await open.click();
		await expect(page.getByRole("dialog")).toHaveCount(0);
		await expect(open).toBeFocused();
		await expect(page.locator("main")).toHaveJSProperty("inert", false);
	});

test("Popover trigger exposes state; Escape closes and returns focus", async ({ page }) => {
	const section = page.locator("#popover");
	const trigger = section.getByRole("button", { name: "bottom" });
	await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
	await expect(trigger).toHaveAttribute("aria-expanded", "false");
	await trigger.focus();
	await page.keyboard.press("Enter");
	await expect(trigger).toHaveAttribute("aria-expanded", "true");
	const panel = section.getByRole("dialog", { name: "Share this build" });
	await expect(panel).toBeVisible();
	await expect(trigger).toHaveAttribute("aria-controls", (await panel.getAttribute("id")) ?? "");
	await page.keyboard.press("Escape");
	await expect(panel).toHaveCount(0);
	await expect(trigger).toHaveAttribute("aria-expanded", "false");
	await expect(trigger).toBeFocused();

	// Interactive content receives focus; outside click closes.
	await section.getByRole("button", { name: "Help" }).click();
	await expect(section.getByRole("link", { name: /Read the manual/ })).toBeFocused();
	await page.mouse.click(1300, 200);
	await expect(section.getByRole("dialog")).toHaveCount(0);
});

test("DropdownMenu follows the menu button pattern", async ({ page }) => {
	const section = page.locator("#dropdownmenu");
	const file = section.getByRole("button", { name: "File" });
	await expect(file).toHaveAttribute("aria-haspopup", "menu");
	await file.focus();
	await page.keyboard.press("Enter");
	const menu = section.getByRole("menu", { name: "File" });
	await expect(menu).toBeVisible();
	await expect(file).toHaveAttribute("aria-expanded", "true");
	await expect(menu.getByRole("menuitem", { name: /New project/ })).toBeFocused();
	await page.keyboard.press("ArrowDown");
	await expect(menu.getByRole("menuitem", { name: /Open/ })).toBeFocused();
	await page.keyboard.press("End");
	await expect(menu.getByRole("menuitem", { name: /Delete/ })).toBeFocused();
	await page.keyboard.press("ArrowDown");
	await expect(menu.getByRole("menuitem", { name: /New project/ })).toBeFocused();
	await page.keyboard.press("m");
	await expect(menu.getByRole("menuitem", { name: /Markdown/ })).toBeFocused();
	await expect(menu.getByRole("group", { name: "Export" })).toBeVisible();
	await expect(menu.getByRole("separator")).toHaveCount(2);
	await page.keyboard.press("Escape");
	await expect(menu).toHaveCount(0);
	await expect(file).toBeFocused();
	await expect(file).toHaveAttribute("aria-expanded", "false");

	// ArrowUp opens on the last item; checkbox items expose their state.
	const view = section.getByRole("button", { name: "View" });
	await view.focus();
	await page.keyboard.press("ArrowUp");
	await expect(section.getByRole("menuitemcheckbox", { name: "Compact rows" })).toBeFocused();
	await expect(section.getByRole("menuitemcheckbox", { name: "Show rulers" })).toHaveAttribute(
		"aria-checked",
		"false",
	);
	await page.keyboard.press("Escape");

	// A non-interactive trigger (avatar) becomes the menu button itself.
	const avatar = section.getByRole("button", { name: "Ada Lovelace" });
	await expect(avatar).toHaveAttribute("aria-haspopup", "menu");
	await avatar.focus();
	await page.keyboard.press(" ");
	await expect(section.getByRole("menuitem", { name: "Profile" })).toBeFocused();
	await page.keyboard.press("Enter");
	await expect(section.getByRole("menu")).toHaveCount(0);
	await expect(avatar).toBeFocused();
});

test("Tooltip shows on keyboard focus, describes its trigger and dismisses on Escape", async ({
	page,
}) => {
	const trigger = page.locator("#tooltip").getByText("Top", { exact: true });
	const tip = page.locator("#tooltip").getByRole("tooltip", { name: "Ottawa · EST" });
	await expect(tip).toBeHidden();
	await trigger.focus();
	await expect(tip).toBeVisible();
	await expect(trigger).toHaveAccessibleDescription("Ottawa · EST");
	await page.keyboard.press("Escape");
	await expect(tip).toBeHidden();
	await trigger.hover();
	await expect(tip).toBeVisible();
});

test("Status components expose roles and names", async ({ page }) => {
	await expect(page.locator("#progress").getByRole("progressbar")).toHaveCount(9);
	await expect(
		page.locator("#progress").getByRole("progressbar", { name: "Importing contacts.csv" }),
	).toHaveAttribute("aria-valuenow", "64");
	const indeterminate = page
		.locator("#progress")
		.getByRole("progressbar", { name: "Casting build" });
	await expect(indeterminate).not.toHaveAttribute("aria-valuenow", /.*/);
	await expect(
		page.locator("#progress").getByRole("progressbar", { name: "Progress" }),
	).toHaveCount(3);

	await expect(page.locator("#toast").getByRole("alert")).toHaveCount(1);
	await expect(page.locator("#alert").getByRole("alert")).toHaveCount(1);
	await expect(
		page.locator("#banner").getByRole("region", { name: "Scheduled maintenance." }),
	).toBeVisible();

	const alert = page.locator("#alert").getByRole("alert");
	await alert.getByRole("button", { name: "Dismiss alert" }).click();
	await expect(page.locator("#alert").getByRole("alert")).toHaveCount(0);
});

test("PageTransition swaps the view after the tab changes", async ({ page }) => {
	const section = page.locator("#pagetransition");
	await section.getByRole("tab", { name: "Billing" }).click();
	await expect(section.getByText(/Invoices, card, and plan/)).toBeVisible();
	await expect(section.getByText(/Name, email/)).toHaveCount(0);
});
