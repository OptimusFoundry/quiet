// quiet's cascade-layer order in a minified, code-split production build. Apps compile quiet's
// source, so every component stylesheet can land in its own CSS chunk, and Vite links those chunks
// ahead of the entry CSS. Layers rank by first appearance, so whichever quiet stylesheet loads
// first must already name all five layers in order. Dev mode (one style tag per module, entry
// first) never shows this.
import { mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import react from "@vitejs/plugin-react";
import { build } from "vite";

const LAYERS = ["q.tokens", "q.themes", "q.base", "q.components", "q.utilities"];
const ORIGIN = "http://quiet-fixture.test";
const TYPES: Record<string, string> = {
	".html": "text/html",
	".js": "text/javascript",
	".css": "text/css",
};

const layerOrder = (css: string) =>
	[...css.matchAll(/@layer\s+([^{;]+)[{;]/g)]
		.flatMap((m) => (m[1] ?? "").split(",").map((l) => l.trim()))
		.filter((l, i, all) => all.indexOf(l) === i);

let outDir = "";

test.beforeAll(async () => {
	outDir = mkdtempSync(join(tmpdir(), "quiet-split-chunks-"));
	await build({
		root: fileURLToPath(new URL("./fixtures/split-chunks", import.meta.url)),
		configFile: false,
		logLevel: "error",
		plugins: [react()],
		build: {
			outDir,
			emptyOutDir: true,
			rollupOptions: {
				output: {
					// One chunk per quiet component, as an app's route splitting produces for components
					// several routes share (saas-template ships Banner-*.css, Button-*.css, Icon-*.css).
					manualChunks: (id) => id.match(/\/src\/components\/\w+\/(\w+)\.tsx$/)?.[1],
				},
			},
		},
	});
});

const cssFiles = () => readdirSync(join(outDir, "assets")).filter((f) => f.endsWith(".css"));

test("the fixture links a component CSS chunk before the entry CSS", () => {
	const html = readFileSync(join(outDir, "index.html"), "utf8");
	const links = [...html.matchAll(/<link rel="stylesheet"[^>]*href="\/assets\/([^"]+)"/g)].map(
		(m) => m[1] ?? "",
	);
	expect(links[0]).toMatch(/^Button-.*\.css$/);
	expect(links.at(-1)).toMatch(/^index-.*\.css$/);
});

test("every minified CSS chunk names the layers in quiet's order", () => {
	for (const file of cssFiles()) {
		const css = readFileSync(join(outDir, "assets", file), "utf8");
		expect(layerOrder(css), file).toEqual(LAYERS);
	}
});

test("a primary link Button keeps its own text colour", async ({ page }) => {
	await page.route(`${ORIGIN}/**`, (route) => {
		const path = new URL(route.request().url()).pathname;
		const file = join(outDir, path === "/" ? "index.html" : path);
		return route.fulfill({
			body: readFileSync(file),
			contentType: TYPES[extname(file)] ?? "application/octet-stream",
		});
	});
	await page.goto(`${ORIGIN}/`);
	const link = page.getByTestId("primary-link");
	await expect(link).toBeVisible();
	const colors = await link.evaluate((el) => {
		const probe = (value: string) => {
			const span = document.createElement("span");
			span.style.color = value;
			el.parentElement?.append(span);
			const color = getComputedStyle(span).color;
			span.remove();
			return color;
		};
		return {
			text: getComputedStyle(el).color,
			buttonFg: probe("var(--q-button-primary-fg)"),
			baseLink: probe("var(--q-fg)"),
		};
	});
	expect(colors.buttonFg).not.toBe(colors.baseLink);
	expect(colors.text).toBe(colors.buttonFg);
});
