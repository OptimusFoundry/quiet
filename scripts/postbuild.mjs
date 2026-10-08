// The bundler drops the `@layer` order statement from src/styles/index.scss, so layers would
// rank by first appearance (component CSS comes first, so q.base beat q.components).
// A layer statement may precede @import, so it can always go first.
import { cpSync, readFileSync, writeFileSync } from "node:fs";

const LAYERS = "@layer q.tokens,q.themes,q.base,q.components,q.utilities;";
const css = readFileSync("dist/quiet.css", "utf8");
if (!css.startsWith(LAYERS)) {
	writeFileSync("dist/quiet.css", LAYERS + css.replace(LAYERS, ""));
}

cpSync("src/styles/fonts.css", "dist/fonts.css");
