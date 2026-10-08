import { expect, test } from "@playwright/test";

// Keyboard operation and ARIA state for the display + data components in the catalog.
const CATALOG = "/iframe.html?id=catalog--all-components&viewMode=story";

test.beforeEach(async ({ page }) => {
	await page.goto(CATALOG);
	await page.waitForFunction(() => document.querySelectorAll("section").length > 50);
});

test("Accordion: disclosure headers toggle with Enter/Space and move with arrows", async ({
	page,
}) => {
	const acc = page.locator("#accordion");
	const own = acc.getByRole("button", { name: "Who owns the code?" });
	const time = acc.getByRole("button", { name: /How long does a piece take/ });
	await expect(acc.getByRole("heading", { name: "Who owns the code?", level: 3 })).toBeVisible();
	await expect(own).toHaveAttribute("aria-expanded", "true");
	const panelId = await own.getAttribute("aria-controls");
	const panel = page.locator(`[id="${panelId}"]`);
	await expect(panel).toHaveAttribute("role", "region");
	await expect(acc.getByRole("region", { name: "Who owns the code?" })).toContainText("You do.");
	await expect(time).toHaveAttribute("aria-expanded", "false");

	await own.focus();
	await page.keyboard.press("ArrowDown");
	await expect(time).toBeFocused();
	await page.keyboard.press("Enter");
	await expect(time).toHaveAttribute("aria-expanded", "true");
	await expect(own).toHaveAttribute("aria-expanded", "false");
	await expect(panel).toHaveAttribute("inert", "");
	await page.keyboard.press(" ");
	await expect(time).toHaveAttribute("aria-expanded", "false");
	await page.keyboard.press("End");
	// The disabled last header is skipped.
	await expect(acc.getByRole("button", { name: "What do you build with?" })).toBeFocused();
	await page.keyboard.press("Home");
	await expect(own).toBeFocused();
});

test("Card: link card is one named link", async ({ page }) => {
	const link = page.locator("#card").getByRole("link", { name: /Anvil/ });
	await expect(link).toHaveCount(1);
	await link.focus();
	await expect(link).toBeFocused();
});

test("ProcessStep and EmptyState titles are headings", async ({ page }) => {
	await expect(page.locator("#processstep").getByRole("heading", { level: 3 })).toHaveCount(4);
	await expect(
		page.locator("#emptystate").getByRole("heading", { name: "Nothing matches" }),
	).toBeVisible();
});

test("StatCard: deltas are announced in words", async ({ page }) => {
	const sc = page.locator("#statcard");
	await expect(sc.getByText("Up", { exact: false }).first()).toBeAttached();
	await expect(sc.locator(".q-sr-only", { hasText: "Down" })).toHaveCount(1);
	await expect(sc.locator(".q-sr-only", { hasText: "Unchanged" })).toHaveCount(1);
	const open = sc.getByRole("button", { name: /Open invoices/ });
	await open.focus();
	await expect(open).toBeFocused();
});

test("FilterTabs: radio group with roving focus, arrows select, counts in the name", async ({
	page,
}) => {
	const group = page.locator("#filtertabs").getByRole("radiogroup").first();
	const all = group.getByRole("radio", { name: "All 14 items" });
	const live = group.getByRole("radio", { name: "Live 3 items" });
	await expect(all).toHaveAttribute("aria-checked", "true");
	await expect(all).toHaveAttribute("tabindex", "0");
	await expect(live).toHaveAttribute("tabindex", "-1");
	await all.focus();
	await page.keyboard.press("ArrowRight");
	await expect(live).toBeFocused();
	await expect(live).toHaveAttribute("aria-checked", "true");
	await expect(all).toHaveAttribute("aria-checked", "false");
	await page.keyboard.press("End");
	await expect(group.getByRole("radio", { name: /Archived/ })).toHaveAttribute(
		"aria-checked",
		"true",
	);
});

test("List: listitems wrap interactive rows; disabled row is not a live link", async ({ page }) => {
	const list = page.locator("#list");
	await expect(list.getByRole("listitem")).toHaveCount(9);
	await expect(list.getByRole("link", { name: "Profile" })).toBeVisible();
	await expect(list.getByRole("button", { name: "Danger zone" })).toBeDisabled();
	await expect(list.getByRole("list", { name: "Today" })).toBeVisible();
});

test("Table: named selection, sortable headers with aria-sort, expandable rows", async ({
	page,
}) => {
	const table = page.locator("#table").getByRole("table").first();
	const amount = table.getByRole("button", { name: /Amount/ });
	await expect(table.getByRole("columnheader", { name: /Amount/ })).toHaveAttribute(
		"aria-sort",
		"descending",
	);
	await amount.focus();
	// desc → unsorted → asc
	await page.keyboard.press("Enter");
	await expect(table.getByRole("columnheader", { name: /Amount/ })).not.toHaveAttribute(
		"aria-sort",
		/./,
	);
	await page.keyboard.press("Enter");
	await expect(table.getByRole("columnheader", { name: /Amount/ })).toHaveAttribute(
		"aria-sort",
		"ascending",
	);

	const box = table.getByRole("checkbox", { name: "Select Anvil" });
	await box.focus();
	await page.keyboard.press(" ");
	await expect(box).toHaveAttribute("aria-checked", "true");
	const all = table.getByRole("checkbox", { name: "Select all rows" });
	await expect(all).toHaveAttribute("aria-checked", "mixed");

	const expand = table.getByRole("button", { name: "Expand Anvil" });
	await expect(expand).toHaveAttribute("aria-expanded", "false");
	await expand.focus();
	await page.keyboard.press("Enter");
	const collapse = table.getByRole("button", { name: "Collapse Anvil" });
	await expect(collapse).toHaveAttribute("aria-expanded", "true");
	const id = await collapse.getAttribute("aria-controls");
	await expect(page.locator(`[id="${id}"]`)).toContainText("In-house · net 30");
	await expect(table.locator("caption")).toHaveText("Invoices · Q4");
});

test("DataGrid: labelled search, live result count, uniquely named pagination", async ({
	page,
}) => {
	const grid = page.locator("#datagrid");
	const search = grid.getByRole("textbox", { name: "Filter rows in Invoices" });
	const status = grid.getByRole("status").first();
	await expect(grid.getByRole("navigation", { name: "Invoices pages" })).toBeVisible();
	await expect(grid.getByRole("table", { name: "Invoices" })).toBeVisible();
	await search.fill("north");
	await expect(status).toHaveText("Showing 1–1 of 1 matching rows");
	await search.fill("zzz");
	await expect(status).toHaveText("No rows match");
	await search.fill("");
	await grid.getByRole("checkbox", { name: "Select Anvil" }).click();
	await expect(status).toHaveText("Showing 1–3 of 5 rows, 1 selected");
});
