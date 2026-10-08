// tsc does not emit hand-written .d.ts files, so ship the reference ones next to the
// declarations it does emit (dist/index.d.ts re-exports ./components/<group>/<Name>).
import { cpSync, readFileSync, writeFileSync } from "node:fs";

cpSync("src/components", "dist/components", {
	recursive: true,
	filter: (src) => !src.endsWith(".jsx"),
});
cpSync("src/jsx-global.d.ts", "dist/jsx-global.d.ts");
// tsc drops the triple-slash reference from index.d.ts; the reference .d.ts files need it.
const index = readFileSync("dist/index.d.ts", "utf8");
if (!index.includes("jsx-global")) {
	writeFileSync("dist/index.d.ts", `/// <reference path="./jsx-global.d.ts" />\n${index}`);
}

// The bundler drops the `@layer` order statement from src/styles/index.scss, so layers would
// rank by first appearance (component CSS comes first, so q.base beat q.components).
// Re-declare the order right after the leading @imports (their URLs contain `;`), where CSS allows it.
const LAYERS = "@layer q.tokens,q.themes,q.base,q.components,q.utilities;";
const css = readFileSync("dist/quiet.css", "utf8");
if (!css.includes(LAYERS)) {
	const m = css.match(/^(?:@import\s+(?:url\()?"[^"]*"\)?[^;]*;\s*)*/);
	writeFileSync("dist/quiet.css", m[0] + LAYERS + css.slice(m[0].length));
}
