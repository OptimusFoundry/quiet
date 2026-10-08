import { expect, type Page, test } from "@playwright/test";

// Keyboard + ARIA behaviour for the forms pickers: Dropdown, MultiSelect, DatePicker, FileUpload.
const CATALOG = "/iframe.html?id=catalog--all-components&viewMode=story";
// Node's Buffer without pulling @types/node into the project's tsconfig.
const nodeBuffer = (s: string) =>
	(globalThis as unknown as { Buffer: { from(s: string): never } }).Buffer.from(s);

async function open(page: Page) {
	await page.goto(CATALOG);
	await page.waitForFunction(() => document.querySelectorAll("section").length > 50);
}

test.beforeEach(async ({ page }) => open(page));

test.describe("Dropdown", () => {
	test("select-only combobox: open, navigate, select, escape returns focus", async ({ page }) => {
		const section = page.locator("#dropdown");
		const combo = section.getByRole("combobox", { name: "Practice" });
		await expect(combo).toHaveAttribute("aria-expanded", "false");
		await combo.focus();
		await page.keyboard.press("ArrowDown");
		await expect(combo).toHaveAttribute("aria-expanded", "true");
		const list = section.getByRole("listbox");
		await expect(list).toBeVisible();
		await expect(combo).toHaveAttribute("aria-controls", (await list.getAttribute("id")) ?? "");

		const activeLabel = async () => {
			const id = await combo.getAttribute("aria-activedescendant");
			return id ? page.locator(`[id="${id}"]`).innerText() : null;
		};
		expect(await activeLabel()).toContain("Full-stack apps");
		await page.keyboard.press("ArrowDown");
		expect(await activeLabel()).toContain("iOS apps");
		await page.keyboard.press("End"); // skips the disabled last option
		expect(await activeLabel()).toContain("Agentic workflows");
		await page.keyboard.press("Home");
		expect(await activeLabel()).toContain("Full-stack apps");
		await page.keyboard.press("ArrowDown");
		await page.keyboard.press("Enter");
		await expect(combo).toHaveAttribute("aria-expanded", "false");
		await expect(combo).toContainText("iOS apps");
		await expect(combo).toBeFocused();

		await page.keyboard.press("Enter");
		await expect(section.getByRole("option", { name: /iOS apps/ })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		await page.keyboard.press("Escape");
		await expect(combo).toHaveAttribute("aria-expanded", "false");
		await expect(section.getByRole("listbox")).toHaveCount(0);
		await expect(combo).toBeFocused();
	});

	test("type-ahead, outside click, hint wiring", async ({ page }) => {
		const section = page.locator("#dropdown");
		const combo = section.getByRole("combobox", { name: "Small" });
		await combo.focus();
		await page.keyboard.press("t");
		await expect(combo).toHaveAttribute("aria-expanded", "true");
		const id = await combo.getAttribute("aria-activedescendant");
		await expect(page.locator(`[id="${id}"]`)).toHaveText(/Toronto/);
		await page.mouse.click(5, 5);
		await expect(combo).toHaveAttribute("aria-expanded", "false");

		const err = section.getByRole("combobox", { name: "Error" });
		await expect(err).toHaveAttribute("aria-invalid", "true");
		await expect(err).toHaveAccessibleDescription("Pick a region.");
	});
});

test.describe("MultiSelect", () => {
	test("multi-selectable listbox toggles with keyboard", async ({ page }) => {
		const section = page.locator("#multiselect");
		const combo = section.getByRole("combobox", { name: "Stack" });
		await combo.focus();
		await page.keyboard.press("Enter");
		const list = section.getByRole("listbox");
		await expect(list).toHaveAttribute("aria-multiselectable", "true");
		const kafka = section.getByRole("option", { name: /Kafka/ });
		await expect(kafka).toHaveAttribute("aria-selected", "false");
		await page.keyboard.press("ArrowDown"); // Go -> Postgres
		await page.keyboard.press("ArrowDown"); // -> Kafka
		await expect(combo).toHaveAttribute(
			"aria-activedescendant",
			(await kafka.getAttribute("id")) ?? "",
		);
		await page.keyboard.press("Enter");
		await expect(kafka).toHaveAttribute("aria-selected", "true");
		await expect(combo).toHaveAttribute("aria-expanded", "true"); // stays open
		await page.keyboard.press("Escape");
		await expect(combo).toHaveAttribute("aria-expanded", "false");
		await expect(combo).toBeFocused();
		await expect(section.getByRole("button", { name: "Remove Kafka" })).toBeVisible();
	});

	test("pills are removable by keyboard with named buttons", async ({ page }) => {
		const section = page.locator("#multiselect");
		const combo = section.getByRole("combobox", { name: "Stack" });
		const removeGo = section.getByRole("button", { name: "Remove Go" });
		await combo.focus();
		await page.keyboard.press("Tab");
		await expect(removeGo).toBeFocused();
		await page.keyboard.press("Enter");
		await expect(section.getByRole("button", { name: "Remove Go" })).toHaveCount(0);
		await expect(section.getByRole("button", { name: "Remove Postgres" })).toBeFocused();
		await expect(combo).toHaveAccessibleDescription("Postgres");
	});

	test("searchable: filter input drives the list, Backspace removes the last pill", async ({
		page,
	}) => {
		const section = page.locator("#multiselect");
		const combo = section.getByRole("combobox", { name: "Many items" });
		await combo.focus();
		await page.keyboard.press("ArrowDown");
		const filter = section.getByRole("combobox", { name: "Filter options" });
		await expect(filter).toBeFocused();
		await page.keyboard.type("van");
		await expect(section.getByRole("option")).toHaveCount(1);
		await page.keyboard.press("ArrowDown");
		await page.keyboard.press("Enter");
		await expect(section.getByRole("option", { name: "Vancouver" })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		await page.keyboard.press("Backspace");
		await page.keyboard.press("Backspace");
		await page.keyboard.press("Backspace");
		await expect(section.getByRole("option")).toHaveCount(10); // filter cleared
		await page.keyboard.press("Backspace"); // removes last chosen (Vancouver)
		await expect(section.getByRole("option", { name: "Vancouver" })).toHaveAttribute(
			"aria-selected",
			"false",
		);
		await page.keyboard.press("Escape");
		await expect(combo).toBeFocused();
		await expect(combo).toHaveAttribute("aria-expanded", "false");
	});
});

test.describe("DatePicker", () => {
	test("dialog grid: arrows, Home/End, PageUp/PageDown, Enter, Escape", async ({ page }) => {
		const section = page.locator("#datepicker");
		const trigger = section.getByRole("button", { name: /^With value/ });
		await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
		await trigger.click();
		const dialog = section.getByRole("dialog", { name: "Choose date" });
		await expect(dialog).toBeVisible();
		const grid = dialog.getByRole("grid", { name: "October 2026" });
		await expect(grid).toBeVisible();
		await expect(dialog.getByRole("button", { name: "Wednesday, October 21, 2026" })).toBeFocused();
		await expect(dialog.getByRole("gridcell", { selected: true })).toHaveCount(1);
		await expect(dialog.getByRole("button", { name: "Previous month" })).toBeVisible();
		await expect(dialog.getByRole("button", { name: "Next month" })).toBeVisible();

		await page.keyboard.press("ArrowRight");
		await expect(dialog.getByRole("button", { name: "Thursday, October 22, 2026" })).toBeFocused();
		await page.keyboard.press("ArrowDown");
		await expect(dialog.getByRole("button", { name: "Thursday, October 29, 2026" })).toBeFocused();
		await page.keyboard.press("Home");
		await expect(dialog.getByRole("button", { name: "Sunday, October 25, 2026" })).toBeFocused();
		await page.keyboard.press("End");
		await expect(dialog.getByRole("button", { name: "Saturday, October 31, 2026" })).toBeFocused();
		await page.keyboard.press("PageDown");
		await expect(dialog.getByRole("grid", { name: "November 2026" })).toBeVisible();
		await expect(dialog.getByRole("button", { name: "Monday, November 30, 2026" })).toBeFocused();
		await page.keyboard.press("PageUp");
		await expect(dialog.getByRole("button", { name: "Friday, October 30, 2026" })).toBeFocused();
		await page.keyboard.press("Enter");
		await expect(dialog).toHaveCount(0);
		await expect(trigger).toContainText("Oct 30, 2026");
		await expect(trigger).toBeFocused();

		await page.keyboard.press("Enter");
		await expect(section.getByRole("dialog")).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(section.getByRole("dialog")).toHaveCount(0);
		await expect(trigger).toHaveAttribute("aria-expanded", "false");
		await expect(trigger).toBeFocused();
	});

	test("Tab stays in the dialog; today is aria-current", async ({ page }) => {
		const section = page.locator("#datepicker");
		await section.getByRole("button", { name: /^Launch/ }).click();
		const dialog = section.getByRole("dialog");
		await expect(dialog.locator('[aria-current="date"]')).toBeFocused();
		for (let i = 0; i < 5; i++) {
			await page.keyboard.press("Tab");
			expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
		}
	});
});

test.describe("FileUpload", () => {
	test("dropzone is a named button that opens the file chooser", async ({ page }) => {
		const section = page.locator("#fileupload");
		const zones = section.getByRole("button", { name: "Choose files or drop them here" });
		await expect(zones.last()).toHaveAttribute("aria-disabled", "true");
		const zone = zones.first();
		await expect(zone).toHaveAccessibleDescription("pdf, png, jpg · up to 5.0 MB · max 4");
		// Locator.press focuses and presses in one step, so the key can't land before focus does.
		const chooser = page.waitForEvent("filechooser");
		await zone.press("Enter");
		await chooser;
		await expect(section.getByRole("button", { name: "Upload logo" })).toBeVisible();
	});

	test("adding and removing files is announced and keeps focus", async ({ page }) => {
		const section = page.locator("#fileupload");
		const group = section.getByRole("group", { name: "Attachments" });
		const live = group.locator('[aria-live="polite"]');
		const chooserP = page.waitForEvent("filechooser");
		await group.getByRole("button", { name: "Choose files or drop them here" }).press("Enter");
		const chooser = await chooserP;
		await chooser.setFiles({ name: "notes.txt", mimeType: "text/plain", buffer: nodeBuffer("hi") });
		await expect(live).toHaveText("Added notes.txt (Type not accepted).");
		const files = group.getByRole("list", { name: "Files" });
		await expect(files.getByRole("listitem")).toHaveCount(4);

		const remove = files.getByRole("button", { name: "Remove brief-v2.pdf" });
		await remove.focus();
		await page.keyboard.press("Enter");
		await expect(live).toHaveText("Removed brief-v2.pdf.");
		await expect(files.getByRole("listitem")).toHaveCount(3);
		await expect(files.getByRole("button", { name: "Remove wireframes.png" })).toBeFocused();
	});
});
