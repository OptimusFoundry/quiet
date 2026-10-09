import { expect, test } from "@playwright/test";

// A Table wider than the phone scrolls inside .q-table. A visually hidden header (.q-sr-only is
// position: absolute) must not widen the page.
const STORY = "/iframe.html?id=extensions-table--sr-only-header&viewMode=story";

test.describe("table on a phone", () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test("an sr-only header doesn't scroll the page sideways", async ({ page }) => {
		await page.goto(STORY);
		const root = page.locator("#table-sr-only-header");
		await expect(root.getByRole("columnheader", { name: "Actions" })).toHaveCount(2);

		const boxes = await root
			.locator(".q-table")
			.evaluateAll((els) => els.map((el) => el.scrollWidth > el.clientWidth));
		expect(boxes).toEqual([true, true]);

		const { scrollWidth, innerWidth } = await page.evaluate(() => ({
			scrollWidth: document.documentElement.scrollWidth,
			innerWidth: window.innerWidth,
		}));
		expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
	});
});
