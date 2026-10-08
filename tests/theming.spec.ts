import { expect, type Locator, type Page, test } from "@playwright/test";

// Open theme registry (G2) and status tokens (G3): a product theme registered at runtime, with
// its CSS authored outside the package, must reach every status-coloured part.
const story = (id: string) => `/iframe.html?id=theming--${id}&viewMode=story`;

async function open(page: Page, id: string) {
	const errors: string[] = [];
	const warnings: string[] = [];
	page.on("pageerror", (e) => errors.push(e.message));
	page.on("console", (m) => {
		if (m.type() === "warning") warnings.push(m.text());
	});
	await page.goto(story(id));
	await page.locator("#storybook-root .quiet").first().waitFor();
	return { errors, warnings };
}

const css = (el: Locator, prop: string) =>
	el.evaluate((node, p) => getComputedStyle(node).getPropertyValue(p).trim(), prop);

test("an external theme registered at runtime renders with its palette and status hues", async ({
	page,
}) => {
	const { errors } = await open(page, "external-theme");
	const acme = page.getByTestId("acme");
	await expect(acme).toHaveAttribute("data-theme", "acme");
	expect(await css(acme, "color-scheme")).toBe("light");
	expect(await css(acme, "background-color")).toBe("rgb(255, 255, 255)");

	const success = acme.locator(".q-alert--success");
	expect(await css(success, "border-top-color")).toBe("rgb(187, 247, 208)");
	expect(await css(success, "background-color")).toBe("rgb(240, 253, 244)");
	expect(await css(success.locator(".q-alert__glyph"), "color")).toBe("rgb(21, 128, 61)");
	// A tier-2 identity override from the theme reaches the component's tier-3 token.
	expect(await css(success, "border-top-left-radius")).toBe("8px");
	expect(await css(acme.locator(".q-alert--info .q-alert__glyph"), "color")).toBe(
		"rgb(29, 78, 216)",
	);

	expect(await css(acme.locator(".q-banner--success .q-banner__glyph"), "color")).toBe(
		"rgb(21, 128, 61)",
	);
	expect(await css(acme.locator(".q-banner--error .q-banner__glyph"), "color")).toBe(
		"rgb(185, 28, 28)",
	);
	expect(await css(acme.locator(".q-toast--success .q-toast__glyph"), "color")).toBe(
		"rgb(21, 128, 61)",
	);
	expect(await css(acme.locator(".q-toast--error"), "border-top-color")).toBe("rgb(254, 202, 202)");

	// foundry keeps grey success/warning badges; that must not leak into a product theme.
	const badge = acme.locator(".q-badge--success");
	expect(await css(badge, "background-color")).toBe("rgb(240, 253, 244)");
	expect(await css(badge, "border-top-color")).toBe("rgb(187, 247, 208)");
	expect(await css(badge.locator(".q-badge__dot"), "background-color")).toBe("rgb(21, 128, 61)");
	expect(await css(acme.locator(".q-badge--warning .q-badge__dot"), "border-top-color")).toBe(
		"rgb(180, 83, 9)",
	);

	const tag = acme.locator(".q-tag--warning");
	expect(await css(tag, "color")).toBe("rgb(180, 83, 9)");
	expect(await css(tag, "border-top-color")).toBe("rgb(253, 230, 138)");
	expect(await css(tag, "background-color")).toBe("rgb(255, 251, 235)");

	expect(await css(acme.locator(".q-progress--error .q-progress__fill"), "background-color")).toBe(
		"rgb(185, 28, 28)",
	);
	expect(await css(acme.locator(".q-progress--error .q-progress__value"), "color")).toBe(
		"rgb(185, 28, 28)",
	);
	expect(await css(acme.locator(".q-icon--success"), "color")).toBe("rgb(21, 128, 61)");

	const dark = page.getByTestId("acme-dark");
	await expect(dark).toHaveAttribute("data-theme", "acme-dark");
	expect(await css(dark, "color-scheme")).toBe("dark");
	expect(await css(dark, "background-color")).toBe("rgb(15, 20, 27)");
	expect(await css(dark.locator(".q-alert--error"), "border-top-color")).toBe("rgb(153, 27, 27)");
	expect(errors).toEqual([]);
});

test("a theme that sets durations keeps reduced motion working", async ({ page }) => {
	await open(page, "external-theme");
	expect(await css(page.getByTestId("acme"), "--q-dur-hover")).toBe("0.18s");
	await page.emulateMedia({ reducedMotion: "reduce" });
	expect(await css(page.getByTestId("acme"), "--q-dur-hover")).toBe("0s");
});

test("an unregistered theme falls back to the default and warns once", async ({ page }) => {
	const { errors, warnings } = await open(page, "unregistered-theme");
	for (const id of ["unregistered-1", "unregistered-2"]) {
		const root = page.getByTestId(id);
		await expect(root).toHaveAttribute("data-theme", "foundry");
		expect(await css(root, "color-scheme")).toBe("light");
	}
	expect(
		await css(page.getByTestId("unregistered-1").locator(".q-alert--success"), "border-top-color"),
	).toBe("rgb(27, 27, 31)");
	expect(errors).toEqual([]);
	expect(warnings.filter((w) => w.includes('"not-registered"'))).toHaveLength(1);
});

test("ThemeProvider and useTheme work with registered external themes", async ({ page }) => {
	const { errors } = await open(page, "with-theme-provider");
	const html = page.locator("html");
	const current = page.getByTestId("current-theme");
	await expect(html).toHaveAttribute("data-theme", "acme");
	await expect(current).toHaveText("acme");
	expect(await css(html, "--q-status-success-fg")).toBe("#15803d");

	await page.getByRole("button", { name: "Acme dark" }).click();
	await expect(html).toHaveAttribute("data-theme", "acme-dark");
	await expect(current).toHaveText("acme-dark");
	expect(await css(html, "color-scheme")).toBe("dark");
	expect(await page.evaluate(() => localStorage.getItem("quiet-theme"))).toBe("acme-dark");

	await page.reload();
	await expect(page.locator("html")).toHaveAttribute("data-theme", "acme-dark");

	await page.getByRole("button", { name: "Unregistered" }).click();
	await expect(page.locator("html")).toHaveAttribute("data-theme", "foundry");
	await expect(page.getByTestId("current-theme")).toHaveText("foundry");
	expect(errors).toEqual([]);
});
