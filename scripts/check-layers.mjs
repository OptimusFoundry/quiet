// Every stylesheet quiet emits must open with the full layer order statement. An app's
// code-split build can load any component stylesheet before index.scss, and layers rank by first
// appearance, so a stylesheet that starts at `@layer q.tokens { … }` and then `q.components`
// would rank q.components below q.themes and q.base (a primary link Button took the base `a`
// colour). Compiles each one, so it checks what Sass emits, not just the source.
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { compileAsync } from "sass-embedded";

const STATEMENT = "@layer q.tokens, q.themes, q.base, q.components, q.utilities;";
const components = readdirSync("src/components", { recursive: true })
	.filter((f) => f.endsWith(".scss") && !f.split("/").at(-1).startsWith("_"))
	.map((f) => join("src/components", f));
const files = ["src/styles/index.scss", ...components.sort()];

const failures = [];
for (const file of files) {
	const { css } = await compileAsync(file, { style: "expanded" });
	if (!css.trimStart().startsWith(STATEMENT)) {
		failures.push(`${file} does not start with \`${STATEMENT}\` (add @use "../../styles/layers";)`);
	}
}

if (failures.length) {
	console.error(failures.map((f) => `✗ ${f}`).join("\n"));
	process.exit(1);
}
console.log(`layers ok: ${files.length} stylesheets open with the order statement`);
