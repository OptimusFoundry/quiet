import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// G10: the ARIA form widgets take part in native forms (name/value/required/disabled/form), and
// `ref` reaches the focusable control on every form component.
const STORY = (id: string, theme = "foundry") =>
	`/iframe.html?id=extensions-forms--${id}&viewMode=story&globals=theme:${theme}`;

const ACCEPTED_LOW_CONTRAST: Record<string, string[]> = {
	foundry: ["#95959c", "#e0531a"],
	"foundry-dark": ["#6e6e76", "#f06a33"],
};

const formData = (page: Page) =>
	page.evaluate(() => {
		const form = document.querySelector<HTMLFormElement>("#native-form");
		return form ? [...new FormData(form).entries()].map(([k, v]) => `${k}=${v}`) : [];
	});

async function openForm(page: Page) {
	await page.goto(STORY("native-form"));
	await page.waitForSelector("#native-form");
}

test("native form: FormData sees every named widget, skips unchecked and disabled", async ({
	page,
}) => {
	await openForm(page);
	expect(await formData(page)).toEqual([
		"news=on",
		"digest=on",
		"budget=40",
		"platform=Web",
		"practice=",
		"stack=go",
		"stack=react",
		"start=2026-10-12",
	]);
});

test("native form: values follow interaction and reach the submit handler", async ({ page }) => {
	await openForm(page);
	const form = page.locator("#native-form");
	await form.getByRole("checkbox", { name: "Accept the terms" }).click();
	await form.getByRole("switch", { name: "Weekly digest" }).click();
	await form.getByRole("slider", { name: "Budget" }).focus();
	await page.keyboard.press("ArrowRight");
	await form.getByRole("radio", { name: "iOS" }).click();
	await form.getByRole("combobox", { name: "Practice" }).click();
	await form.getByRole("option", { name: "Backends" }).click();
	await form.getByRole("button", { name: "Remove Go" }).click();
	await form.getByRole("button", { name: "Submit" }).click();
	const expected = [
		"terms=accepted",
		"news=on",
		"budget=41",
		"platform=iOS",
		"practice=Backends",
		"stack=react",
		"start=2026-10-12",
	];
	expect(await formData(page)).toEqual(expected);
	await expect(form.getByRole("status", { name: "Submitted data" })).toHaveText(
		expected.join("\n"),
	);
});

test("native form: required widgets block submission and focus the visible control", async ({
	page,
}) => {
	await openForm(page);
	const form = page.locator("#native-form");
	const output = form.getByRole("status", { name: "Submitted data" });
	const terms = form.getByRole("checkbox", { name: "Accept the terms" });
	await expect(terms).toHaveAttribute("aria-required", "true");
	await form.getByRole("button", { name: "Submit" }).click();
	await expect(output).toHaveText("Nothing submitted yet.");
	await expect(terms).toBeFocused();

	await terms.click();
	const practice = form.getByRole("combobox", { name: "Practice" });
	await expect(practice).toHaveAttribute("aria-required", "true");
	await form.getByRole("button", { name: "Submit" }).click();
	await expect(output).toHaveText("Nothing submitted yet.");
	await expect(practice).toBeFocused();

	await practice.click();
	await form.getByRole("option", { name: "iOS apps" }).click();
	await form.getByRole("button", { name: "Submit" }).click();
	await expect(output).toContainText("practice=iOS apps");
});

test("native form: the form attribute and FormData.getAll for multi-value", async ({ page }) => {
	await openForm(page);
	expect(
		await page.evaluate(() => {
			const form = document.querySelector<HTMLFormElement>("#native-form");
			return form ? new FormData(form).getAll("stack") : [];
		}),
	).toEqual(["go", "react"]);
	// Proxies are invisible to assistive tech and out of the tab order.
	const proxies = page.locator("#native-form input:not([type=hidden])");
	await expect(proxies).toHaveCount(2);
	for (const p of await proxies.all()) {
		await expect(p).toHaveAttribute("aria-hidden", "true");
		await expect(p).toHaveAttribute("tabindex", "-1");
	}
});

for (const theme of ["foundry", "foundry-dark"]) {
	test(`native form: no axe violations beyond the accepted colours (${theme})`, async ({
		page,
	}) => {
		await page.goto(STORY("native-form", theme));
		await page.waitForSelector("#native-form");
		await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
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

test("refs: ref.current.focus() lands on each form component's focusable control", async ({
	page,
}) => {
	await page.goto(STORY("refs"));
	await page.waitForSelector("#refs");
	const s = page.locator("#refs");
	const targets = [
		["textField", s.getByRole("textbox", { name: "Name" })],
		["textArea", s.getByRole("textbox", { name: "Brief" })],
		["select", s.getByRole("combobox", { name: "Region" })],
		["input", s.getByRole("textbox", { name: "Email" })],
		["checkbox", s.getByRole("checkbox", { name: "Terms" })],
		["switch", s.getByRole("switch", { name: "Digest" })],
		["slider", s.getByRole("slider", { name: "Budget" })],
		["radio", s.getByRole("radio", { name: "Web" })],
		["dropdown", s.getByRole("combobox", { name: "Practice" })],
		["multiSelect", s.getByRole("combobox", { name: "Stack" })],
		["datePicker", s.getByRole("button", { name: /^Start/ })],
	] as const;
	for (const [name, control] of targets) {
		await s.getByRole("button", { name: `Focus ${name}`, exact: true }).click();
		await expect(control, name).toBeFocused();
	}
});
