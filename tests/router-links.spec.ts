import { expect, test } from "@playwright/test";

// <QuietRoot linkComponent> routes every in-app href through the router link; links a router
// can't handle (external, absolute, other schemes, in-page hashes) stay native anchors.
const STORY = "/iframe.html?id=integration-router-links--default&viewMode=story";

test.beforeEach(async ({ page }) => {
	await page.goto(STORY);
	await page.getByText("Docs", { exact: true }).waitFor();
});

const ROUTED: [component: string, name: string | RegExp][] = [
	["Link", "Docs"],
	["ArrowLink", "Changelog"],
	["Button href", "New project"],
	["Breadcrumb item", "Home"],
	["NavBar link", "Pricing"],
	["NavBar CTA", "Start a project"],
	["Sidebar item", "Projects"],
	["Card", "Card"],
	["StatCard", /^Stat 3$/],
	["List row", "List row"],
];

for (const [component, name] of ROUTED) {
	test(`${component} navigates through the router link, without a page load`, async ({ page }) => {
		await page.evaluate(() => {
			(window as unknown as { marker: boolean }).marker = true;
		});
		const link = page.getByRole("link", { name, exact: true });
		await expect(link).toHaveAttribute("data-router-link", "");
		const href = await link.getAttribute("href");
		await link.click();
		await expect.poll(() => page.evaluate(() => window.location.pathname)).toBe(href);
		expect(await page.evaluate(() => (window as unknown as { marker?: boolean }).marker)).toBe(
			true,
		);
	});
}

test("external, absolute, mailto and hash links stay native anchors", async ({ page }) => {
	for (const [name, href] of [
		["Example", "https://example.com"],
		["Absolute", "https://example.org/absolute"],
		["Email", "mailto:hi@example.com"],
		["Top", "#top"],
	]) {
		const link = page.getByRole("link", { name: new RegExp(`^${name}`) });
		await expect(link).toHaveAttribute("href", href as string);
		await expect(link).not.toHaveAttribute("data-router-link");
	}
	await expect(page.getByRole("link", { name: /^Example/ })).toHaveAttribute("target", "_blank");
	await expect(page.getByRole("link", { name: /^Example/ })).toHaveAttribute(
		"rel",
		"noopener noreferrer",
	);
});

test("components outside a linkComponent provider render plain anchors", async ({ page }) => {
	await page.goto("/iframe.html?id=catalog--all-components&viewMode=story");
	await page.waitForFunction(() => document.querySelectorAll("section").length > 50);
	await expect(page.locator("[data-router-link]")).toHaveCount(0);
});
