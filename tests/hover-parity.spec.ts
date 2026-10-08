import { expect, type Page, test } from "@playwright/test";

// Pixel parity covers the page at rest; this covers hover. Every visible button, link and tab is
// hovered on the reference page and on quiet's catalog, and the hovered colours must match.
// Elements are paired by section + visible text + occurrence, so DOM additions from the a11y
// layer (sr-only text, wrappers) don't shift the pairing.
const REFERENCE = "http://127.0.0.1:8791/components/index.html";
const QUIET = "/iframe.html?id=catalog--all-components&viewMode=story";
const PROPS = [
	"background-color",
	"color",
	"border-top-color",
	"border-bottom-color",
	"text-decoration-color",
];

async function hovered(page: Page, url: string) {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto(url);
	await page.waitForFunction(() => document.querySelectorAll("section").length > 50);
	await page.evaluate(() => document.fonts.ready);
	await page.addStyleTag({
		content: "*,*::before,*::after{transition:none!important;animation:none!important}",
	});
	const targets = await page.evaluate(() => {
		const seen = new Map<string, number>();
		const out: { key: string; i: number }[] = [];
		const els = [
			...document.querySelectorAll<HTMLElement>(
				"section button, section a[href], section [role=tab]",
			),
		];
		els.forEach((el, i) => {
			const r = el.getBoundingClientRect();
			if (!r.width || !r.height || getComputedStyle(el).visibility === "hidden") return;
			const text = (el.innerText || el.getAttribute("aria-label") || "")
				.replace(/\s+/g, " ")
				.trim()
				.slice(0, 40);
			const base = `${el.closest("section")?.id}|${text}`;
			const n = seen.get(base) ?? 0;
			seen.set(base, n + 1);
			el.setAttribute("data-hover-probe", String(i));
			out.push({ key: `${base}#${n}`, i });
		});
		return out;
	});
	const result = new Map<string, string>();
	for (const { key, i } of targets) {
		const el = page.locator(`[data-hover-probe="${i}"]`);
		await el.scrollIntoViewIfNeeded();
		await el.hover({ force: true });
		const styles = await el.evaluate((node, props) => {
			const cs = getComputedStyle(node);
			return props.map((p) => cs.getPropertyValue(p)).join(" ; ");
		}, PROPS);
		result.set(key, styles);
		await page.mouse.move(0, 0);
	}
	return result;
}

test("hover states match the Claude Design master page", async ({ browser }) => {
	test.setTimeout(300_000);
	const ref = await hovered(await browser.newPage(), REFERENCE);
	const quiet = await hovered(await browser.newPage(), QUIET);
	const diffs = [...ref]
		.filter(([k, v]) => quiet.has(k) && quiet.get(k) !== v)
		.map(([k, v]) => `${k}\n  ref:   ${v}\n  quiet: ${quiet.get(k)}`);
	const compared = [...ref.keys()].filter((k) => quiet.has(k)).length;
	expect(compared).toBeGreaterThan(150);
	expect(diffs).toEqual([]);
});
