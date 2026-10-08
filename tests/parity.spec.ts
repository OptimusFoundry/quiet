import { expect, type Page, test } from "@playwright/test";

// quiet must render the Claude Design master page pixel-for-pixel. The reference compiles the
// mirrored .jsx in the browser (ds-loader.js); quiet renders the same page from its own package.
const REFERENCE = "http://127.0.0.1:8791/components/index.html";
const QUIET = "/iframe.html?id=catalog--all-components&viewMode=story";

async function capture(page: Page, url: string) {
	const errors: string[] = [];
	page.on("pageerror", (e) => errors.push(e.message));
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto(url);
	await page.waitForFunction(() => document.querySelectorAll("section").length > 50);
	await page.evaluate(() => document.fonts.ready);
	await page.addStyleTag({
		content: "*,*::before,*::after{animation:none!important;transition:none!important}",
	});
	await page.waitForTimeout(1000);
	return { png: await page.screenshot({ fullPage: true }), errors };
}

test("catalog is pixel-identical to the Claude Design master page", async ({ browser }) => {
	const ref = await capture(await browser.newPage(), REFERENCE);
	const quiet = await capture(await browser.newPage(), QUIET);
	expect(ref.errors).toEqual([]);
	expect(quiet.errors).toEqual([]);
	expect(quiet.png.equals(ref.png)).toBe(true);
});

test("dark mode renders without errors", async ({ page }) => {
	const errors: string[] = [];
	page.on("pageerror", (e) => errors.push(e.message));
	await page.goto(`${QUIET}&globals=mode:dark`);
	await page.waitForFunction(() => document.querySelectorAll("section").length > 50);
	await expect(page.locator(".quiet[data-mode=dark]")).toHaveCount(1);
	expect(errors).toEqual([]);
});
