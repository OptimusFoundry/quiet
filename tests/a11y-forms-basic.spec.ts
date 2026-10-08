import { expect, type Page, test } from "@playwright/test";

// Keyboard operation and ARIA state for the basic form controls (Checkbox, Radio, Switch,
// Slider, Stepper, Label, FormHint, FormField, Input, TextField, TextArea, Select).
const CATALOG = "/iframe.html?id=catalog--all-components&viewMode=story";

async function open(page: Page) {
	await page.goto(CATALOG);
	await page.waitForFunction(() => document.querySelectorAll("section").length > 50);
}

test.beforeEach(async ({ page }) => open(page));

test("checkbox: named, Space toggles, mixed, invalid + described, disabled", async ({ page }) => {
	const s = page.locator("#checkbox");
	const box = s.getByRole("checkbox", { name: "Unchecked" });
	await expect(box).toHaveAttribute("aria-checked", "false");
	await box.focus();
	await page.keyboard.press("Space");
	await expect(box).toHaveAttribute("aria-checked", "true");
	await page.keyboard.press("Space");
	await expect(box).toHaveAttribute("aria-checked", "false");
	await expect(s.getByRole("checkbox", { name: "Indeterminate" })).toHaveAttribute(
		"aria-checked",
		"mixed",
	);
	const terms = s.getByRole("checkbox", { name: "Accept the terms" });
	await expect(terms).toHaveAttribute("aria-invalid", "true");
	await expect(terms).toHaveAccessibleDescription("Required.");
	await expect(s.getByRole("checkbox", { name: "Send the journal" })).toHaveAccessibleDescription(
		"One email a month.",
	);
	const off = s.getByRole("checkbox", { name: "Disabled" });
	await expect(off).toBeDisabled();
	await off.click({ force: true });
	await expect(off).toHaveAttribute("aria-checked", "false");
});

test("radio: one tab stop, arrows move and select", async ({ page }) => {
	const group = page.locator("#radio").getByRole("radiogroup").first();
	const web = group.getByRole("radio", { name: "Web" });
	const ios = group.getByRole("radio", { name: "iOS" });
	const both = group.getByRole("radio", { name: "Both" });
	await expect(web).toHaveAttribute("aria-checked", "true");
	await expect(web).toHaveAttribute("tabindex", "0");
	await expect(ios).toHaveAttribute("tabindex", "-1");
	await web.focus();
	await page.keyboard.press("ArrowRight");
	await expect(ios).toBeFocused();
	await expect(ios).toHaveAttribute("aria-checked", "true");
	await expect(web).toHaveAttribute("aria-checked", "false");
	await expect(ios).toHaveAttribute("tabindex", "0");
	await page.keyboard.press("ArrowDown");
	await expect(both).toBeFocused();
	await expect(both).toHaveAttribute("aria-checked", "true");
	await page.keyboard.press("ArrowRight");
	await expect(web).toBeFocused();
	await expect(web).toHaveAttribute("aria-checked", "true");
	await page.keyboard.press("ArrowLeft");
	await expect(both).toHaveAttribute("aria-checked", "true");
});

test("switch: named, Space and Enter toggle, disabled", async ({ page }) => {
	const s = page.locator("#switch");
	const sw = s.getByRole("switch", { name: "Off" });
	await sw.focus();
	await page.keyboard.press("Space");
	await expect(sw).toHaveAttribute("aria-checked", "true");
	await page.keyboard.press("Enter");
	await expect(sw).toHaveAttribute("aria-checked", "false");
	await expect(s.getByRole("switch", { name: "Weekly digest" })).toHaveAccessibleDescription(
		"One email, Fridays.",
	);
	await expect(s.getByRole("switch", { name: "Disabled" })).toBeDisabled();
});

test("slider: name, value text and keys", async ({ page }) => {
	const s = page.locator("#slider");
	const budget = s.getByRole("slider", { name: "Budget" });
	await expect(budget).toHaveAttribute("aria-valuenow", "40");
	await expect(budget).toHaveAttribute("aria-valuetext", "40k");
	await expect(budget).toHaveAttribute("aria-valuemin", "0");
	await expect(budget).toHaveAttribute("aria-valuemax", "100");
	await budget.focus();
	await page.keyboard.press("ArrowRight");
	await expect(budget).toHaveAttribute("aria-valuenow", "41");
	await page.keyboard.press("ArrowDown");
	await expect(budget).toHaveAttribute("aria-valuenow", "40");
	await page.keyboard.press("PageUp");
	await expect(budget).toHaveAttribute("aria-valuenow", "50");
	await page.keyboard.press("PageDown");
	await expect(budget).toHaveAttribute("aria-valuenow", "40");
	await page.keyboard.press("End");
	await expect(budget).toHaveAttribute("aria-valuenow", "100");
	await page.keyboard.press("Home");
	await expect(budget).toHaveAttribute("aria-valuenow", "0");
	const days = s.getByRole("slider", { name: "Retention" });
	await days.focus();
	await page.keyboard.press("ArrowRight");
	await expect(days).toHaveAttribute("aria-valuetext", "35 days");
	await expect(s.getByRole("slider", { name: "Disabled" })).toBeDisabled();
});

test("stepper: spinbutton keys, named buttons, bounds", async ({ page }) => {
	const s = page.locator("#stepper");
	const seats = s.getByRole("spinbutton", { name: "Seats" });
	await expect(seats).toHaveAttribute("aria-valuenow", "2");
	await expect(seats).toHaveAttribute("aria-valuemin", "1");
	await expect(seats).toHaveAttribute("aria-valuemax", "10");
	await seats.focus();
	await page.keyboard.press("ArrowUp");
	await expect(seats).toHaveValue("3");
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("ArrowDown");
	await expect(seats).toHaveValue("1");
	const dec = s.getByRole("button", { name: "Decrease Seats" });
	await expect(dec).toBeDisabled();
	await page.keyboard.press("End");
	await expect(seats).toHaveValue("10");
	await expect(s.getByRole("button", { name: "Increase Seats" })).toBeDisabled();
	await page.keyboard.press("Home");
	await expect(seats).toHaveValue("1");
	await s.getByRole("button", { name: "Increase Seats" }).click();
	await expect(seats).toHaveValue("2");
	await expect(s.getByRole("group", { name: "Seats" }).locator("[aria-live=polite]")).toHaveText(
		"2",
	);
	await expect(s.getByRole("spinbutton", { name: "Disabled" })).toBeDisabled();
});

test("label + hint + field wiring", async ({ page }) => {
	await expect(page.locator("#label").getByText("(required)")).toHaveCount(1);
	await expect(page.locator("#formhint").getByRole("alert")).toHaveText(/We start at 25k/);
	const seats = page.locator("#formfield").getByRole("spinbutton", { name: "Seats" });
	await expect(seats).toHaveAttribute("aria-invalid", "true");
	await expect(seats).toHaveAttribute("aria-required", "true");
	await expect(seats).toHaveAccessibleDescription(/At least one seat/);
	const notes = page.locator("#formfield").getByRole("textbox", { name: "Notes" });
	await expect(notes).toBeVisible();
});

test("text inputs: labels, invalid, described, required", async ({ page }) => {
	const input = page.locator("#input");
	await expect(input.getByRole("textbox", { name: "With hint" })).toHaveAccessibleDescription(
		"As it appears on the invoice",
	);
	const err = input.getByRole("textbox", { name: "Error" });
	await expect(err).toHaveAttribute("aria-invalid", "true");
	await expect(err).toHaveAccessibleDescription("We start at 25k.");

	const tf = page.locator("#textfield");
	const email = tf.getByRole("textbox", { name: /Email/ });
	await expect(email).toHaveAttribute("required", "");
	await expect(email).toHaveAccessibleDescription(/We reply within two days/);
	await expect(tf.getByRole("textbox", { name: "Budget" })).toHaveAttribute("aria-invalid", "true");
	await expect(tf.getByRole("textbox", { name: "Disabled" })).toBeDisabled();

	const ta = page.locator("#textarea");
	await expect(ta.getByRole("textbox", { name: /The piece/ })).toHaveAccessibleDescription(
		/Two or three sentences/,
	);
	const notes = ta.getByRole("textbox", { name: "Notes" });
	await expect(notes).toHaveAccessibleDescription(/\/ 280/);
	await expect(ta.getByRole("textbox", { name: "Error" })).toHaveAttribute("aria-invalid", "true");

	await expect(page.locator("#select").getByRole("combobox", { name: "Practice" })).toHaveValue(
		"Full-stack apps",
	);
});
