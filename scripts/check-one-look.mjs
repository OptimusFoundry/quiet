// One look (docs/plans/2026-10-12-one-look.md): quiet has a single look. No stylesheet may branch
// on the old marketing/app looks, and the marketing-only status theme is gone.
import { existsSync, globSync, readFileSync } from "node:fs";

const RULES = [
	[/@include app\.(look|reset|rules)\b/, "app.look/reset/rules plumbing"],
	[/@use "[./]*styles\/app"|@use "\.\.\/app"|@use "\.\/app"/, "imports styles/_app.scss"],
	[/data-density="(marketing|app)"/, "branches on a removed density (marketing/app)"],
];
const files = globSync("src/**/*.scss");
let bad = 0;
for (const file of files) {
	readFileSync(file, "utf8")
		.split("\n")
		.forEach((line, i) => {
			if (line.trimStart().startsWith("//")) return;
			for (const [re, why] of RULES)
				if (re.test(line)) {
					bad++;
					console.error(`${file}:${i + 1} ${why}`);
				}
		});
}
for (const gone of ["src/styles/_app.scss", "src/styles/themes/_foundry-status.scss"])
	if (existsSync(gone)) {
		bad++;
		console.error(`${gone}: should be deleted (one look)`);
	}
if (bad) process.exit(1);
console.log(`one look ok: ${files.length} stylesheets`);
