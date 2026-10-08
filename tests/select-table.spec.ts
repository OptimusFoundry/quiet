import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// G11: Select field chrome and TextArea hideLabel. G12: Table footer, controlled expansion, colSpan.
const STORY = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

async function open(page: Page, id: string, root: string) {
	await page.goto(STORY(id));
	await page.waitForSelector(root);
	return page.locator(root);
}

test("select: placeholder starts selected, per-option disabled", async ({ page }) => {
	const s = await open(page, "extensions-forms--select-chrome", "#select-chrome");
	const region = s.getByRole("combobox", { name: "Region", exact: true });
	await expect(region).toHaveValue("");
	await expect(region.locator("option:checked")).toHaveText("Choose a region");
	await expect(region.locator("option", { hasText: "Choose a region" })).toHaveJSProperty(
		"disabled",
		true,
	);
	await expect(region.locator("option", { hasText: "Asia-Pacific" })).toHaveJSProperty(
		"disabled",
		true,
	);
	await expect(region.locator("option", { hasText: "Europe" })).toHaveJSProperty("disabled", false);
	await region.selectOption("us");
	await expect(region).toHaveValue("us");
});

test("select: helper text and errors describe the control without joining its name", async ({
	page,
}) => {
	const s = await open(page, "extensions-forms--select-chrome", "#select-chrome");
	const helped = s.getByRole("combobox", { name: "Region with help", exact: true });
	await expect(helped).toHaveAccessibleName("Region with help");
	await expect(helped).toHaveAccessibleDescription("Where your data is stored.");
	await expect(helped).not.toHaveAttribute("aria-invalid");

	const required = s.getByRole("combobox", { name: "Region required", exact: true });
	await expect(required).toHaveAttribute("aria-invalid", "true");
	await expect(required).toHaveAccessibleDescription("Pick a region.");

	const flagged = s.getByRole("combobox", { name: "Region flagged", exact: true });
	await expect(flagged).toHaveAttribute("aria-invalid", "true");
	await expect(flagged).not.toHaveAttribute("aria-describedby");
	const edge = await flagged.evaluate((el) => getComputedStyle(el).borderTopColor);
	const plain = await helped.evaluate((el) => getComputedStyle(el).borderTopColor);
	expect(edge).not.toBe(plain);
});

test("select: sizes step the font and padding, md matches the default", async ({ page }) => {
	const s = await open(page, "extensions-forms--select-chrome", "#select-chrome");
	const font = (name: string) =>
		s
			.getByRole("combobox", { name, exact: true })
			.evaluate((el) => Number.parseFloat(getComputedStyle(el).fontSize));
	const height = (name: string) =>
		s
			.getByRole("combobox", { name, exact: true })
			.evaluate((el) => el.getBoundingClientRect().height);
	expect(await font("Small")).toBeLessThan(await font("Medium"));
	expect(await font("Medium")).toBeLessThan(await font("Large"));
	expect(await font("Medium")).toBe(await font("Region with help"));
	expect(await height("Small")).toBeLessThan(await height("Medium"));
	expect(await height("Medium")).toBeLessThan(await height("Large"));
});

test("textarea: hideLabel keeps the name but hides the label", async ({ page }) => {
	const s = await open(page, "extensions-forms--select-chrome", "#select-chrome");
	await expect(s.getByRole("textbox", { name: "Notes" })).toBeVisible();
	const box = await s.locator(".q-label", { hasText: "Notes" }).boundingBox();
	expect(box?.width ?? 0).toBeLessThanOrEqual(1);
});

test("table: column footers total the rows, full-width footer spans every column", async ({
	page,
}) => {
	const s = await open(page, "extensions-table--footer", "#table-footer");
	const foot = s.locator("tfoot tr");
	await expect(foot).toHaveCount(2);
	await expect(foot.nth(0).locator("td")).toHaveText(["Total", "59", "€8,850"]);
	const note = foot.nth(1).locator("td");
	await expect(note).toHaveText("Figures exclude VAT.");
	await expect(note).toHaveAttribute("colspan", "3");
	// Footers stay put when the body sorts.
	await s.getByRole("button", { name: /Amount/ }).click();
	await expect(s.locator("tbody tr").first().locator("td").first()).toHaveText("Initech");
	await expect(foot.nth(0).locator("td")).toHaveText(["Total", "59", "€8,850"]);
});

test("table: a cell's colSpan drops the columns it covers", async ({ page }) => {
	const s = await open(page, "extensions-table--footer", "#table-footer");
	const paused = s.locator("tbody tr", { hasText: "Initech" });
	await expect(paused.locator("td")).toHaveCount(2);
	await expect(paused.locator("td").nth(1)).toHaveAttribute("colspan", "2");
	await expect(paused.locator("td").nth(1)).toHaveText("Retainer paused until November.");
	await expect(s.locator("tbody tr", { hasText: "Northwind" }).locator("td")).toHaveCount(3);
});

test("table: controlled expansion follows `expanded` and reports through onExpandedChange", async ({
	page,
}) => {
	const s = await open(page, "extensions-table--controlled-expansion", "#table-expansion");
	const state = s.getByRole("status", { name: "Expanded rows" });
	const rowToggles = s.getByRole("button", {
		name: /^Collapse (Northwind|Globex|Initech|Umbrella)$/,
	});
	const detail = (client: string, id: string) => s.getByText(`Invoice ${id} for ${client}.`);
	await expect(state).toHaveText("inv-2");
	await expect(detail("Globex", "inv-2")).toBeVisible();
	await expect(detail("Northwind", "inv-1")).toHaveCount(0);

	await s.getByRole("button", { name: "Expand Northwind" }).click();
	await expect(state).toHaveText("inv-2, inv-1");
	await expect(detail("Northwind", "inv-1")).toBeVisible();

	await s.getByRole("button", { name: "Collapse all" }).click();
	await expect(state).toHaveText("none");
	await expect(rowToggles).toHaveCount(0);

	await s.getByRole("button", { name: "Expand all" }).click();
	await expect(rowToggles).toHaveCount(4);
	await expect(s.getByRole("button", { name: "Collapse Umbrella" })).toHaveAttribute(
		"aria-expanded",
		"true",
	);
});

test("table: uncontrolled expansion honours defaultExpanded; footer pads control columns", async ({
	page,
}) => {
	const s = await open(page, "extensions-table--uncontrolled-expansion", "#table-uncontrolled");
	await expect(s.getByRole("button", { name: "Collapse Northwind" })).toHaveAttribute(
		"aria-expanded",
		"true",
	);
	await s.getByRole("button", { name: "Expand Globex" }).click();
	await expect(s.getByText("Invoice inv-2 for Globex.")).toBeVisible();
	await s.getByRole("button", { name: "Collapse Northwind" }).click();
	await expect(s.getByText("Invoice inv-1 for Northwind.")).toHaveCount(0);
	await expect(s.locator("tfoot tr td")).toHaveCount(5);
});

const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#6e6e76", "#f06a33"],
};

for (const theme of ["foundry", "foundry-dark"]) {
	for (const [id, root] of [
		["extensions-forms--select-chrome", "#select-chrome"],
		["extensions-table--footer", "#table-footer"],
		["extensions-table--controlled-expansion", "#table-expansion"],
	] as const) {
		test(`${id}: no axe violations beyond the accepted colours (${theme})`, async ({ page }) => {
			await page.goto(`${STORY(id)}&globals=theme:${theme}`);
			await page.waitForSelector(root);
			await page.addStyleTag({
				content: "*{animation:none!important;transition:none!important}",
			});
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
}
