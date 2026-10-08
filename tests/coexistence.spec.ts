import { expect, type Page, test } from "@playwright/test";

// dist/quiet.css on a page that also runs another design system (Proto: <html data-theme>, its
// reset and tokens in a layer below quiet's). Everything outside a quiet root must compute
// exactly as it does with quiet.css absent. Runs against the built file: `npm run build` first.
const DIST = "dist/quiet.css";

// The host's own CSS, layered as the template's coexistence setup does it.
const HOST = `
@layer proto, q.tokens, q.themes, q.base, q.components, q.utilities;
@layer proto {
  :root { --space-2: 12px; --radius-md: 6px; --ease-linear: steps(2); }
  [data-theme="paper"] { color: rgb(20, 20, 20); }
}`;

const BODY = `
<div id="foreign"><p>Host text <a href="/host">host link</a></p><div data-theme="dark"><p>Host section</p></div></div>
<div class="quiet" data-quiet data-theme="foundry" id="inside"><p>quiet text <a href="/quiet">quiet link</a></p></div>`;

const PROPS = [
	"margin-top",
	"margin-left",
	"font-family",
	"font-size",
	"line-height",
	"color",
	"background-color",
	"text-decoration-line",
	"-webkit-font-smoothing",
	"--space-2",
	"--radius-md",
	"--ease-linear",
	"--paper",
];

async function load(page: Page, quiet: boolean, hostCss: boolean) {
	await page.route("https://fonts.googleapis.com/**", (r) =>
		r.fulfill({ contentType: "text/css", body: "" }),
	);
	await page.setContent(
		`<!doctype html><html data-theme="paper"><head>${hostCss ? `<style>${HOST}</style>` : ""}</head><body>${BODY}</body></html>`,
	);
	if (quiet) {
		await page.addStyleTag({ path: DIST });
		// Links transition colour over --q-dur-hover, so probing straight after injection can read
		// the browser default mid-transition. Flush styles, then let running transitions finish.
		await page.evaluate(async () => {
			void document.body.offsetWidth;
			await Promise.all(document.getAnimations().map((a) => a.finished));
		});
	}
}

function probe(page: Page, selectors: string[]) {
	return page.evaluate(
		([sels, props]) =>
			Object.fromEntries(
				(sels as string[]).map((sel) => {
					const el = document.querySelector(sel);
					if (!el) throw new Error(`missing ${sel}`);
					const cs = getComputedStyle(el);
					return [
						sel,
						Object.fromEntries((props as string[]).map((p) => [p, cs.getPropertyValue(p)])),
					];
				}),
			),
		[selectors, PROPS],
	);
}

const OUTSIDE = ["html", "body", "#foreign", "#foreign p", "#foreign a", "#foreign [data-theme]"];

async function focusRing(page: Page) {
	await page.keyboard.press("Tab");
	return page.evaluate(() => {
		const cs = getComputedStyle(document.activeElement as Element);
		return [cs.outlineStyle, cs.outlineWidth, cs.outlineColor, cs.outlineOffset].join(" ");
	});
}

for (const hostCss of [true, false]) {
	test(`nothing outside a quiet root changes (${hostCss ? "layered host CSS" : "no host CSS"})`, async ({
		browser,
	}) => {
		const without = await browser.newPage();
		await load(without, false, hostCss);
		const baseline = await probe(without, OUTSIDE);
		const baselineRing = await focusRing(without);

		const page = await browser.newPage();
		await load(page, true, hostCss);
		expect(await probe(page, OUTSIDE)).toEqual(baseline);
		expect(await focusRing(page)).toBe(baselineRing);

		// The stylesheet did load: inside the root, quiet's base and reference-compat names apply.
		const inside = (await probe(page, ["#inside", "#inside a"])) as Record<
			string,
			Record<string, string>
		>;
		expect(inside["#inside"]?.["--space-2"]).toBe("16px");
		expect(inside["#inside"]?.["font-family"]).toContain("Inter Tight");
		expect(inside["#inside a"]?.["text-decoration-line"]).toBe("none");
		expect(inside["#inside a"]?.color).not.toBe(
			((await probe(without, ["#inside a"])) as Record<string, Record<string, string>>)["#inside a"]
				?.color,
		);
	});
}

test("a document quiet owns (<html data-quiet>, as applyTheme sets) gets the reference base", async ({
	page,
}) => {
	await page.route("https://fonts.googleapis.com/**", (r) =>
		r.fulfill({ contentType: "text/css", body: "" }),
	);
	await page.setContent(
		`<!doctype html><html data-quiet data-theme="foundry"><body><p>Text</p></body></html>`,
	);
	await page.addStyleTag({ path: DIST });
	const got = await page.evaluate(() => {
		const html = getComputedStyle(document.documentElement);
		return {
			font: html.fontFamily,
			space: html.getPropertyValue("--space-2"),
			margin: getComputedStyle(document.body).margin,
		};
	});
	expect(got.font).toContain("Inter Tight");
	expect(got.space).toBe("16px");
	expect(got.margin).toBe("0px");
});
