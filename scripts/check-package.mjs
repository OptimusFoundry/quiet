// Checks the package a git-tag install produces: run after `npm run build`. It reads the file
// list `npm pack` would ship, so a target missing from `files` fails here, not in a consumer.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const [packed] = JSON.parse(
	execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], { encoding: "utf8" }),
);
const shipped = new Set(packed.files.map((f) => f.path));
const failures = [];
const check = (ok, message) => {
	if (!ok) failures.push(message);
};

const targets = Object.values(pkg.exports).flatMap((t) =>
	typeof t === "string" ? [t] : Object.values(t),
);
for (const target of [...targets, pkg.main, pkg.types]) {
	check(shipped.has(target.replace(/^\.\//, "")), `${target} is not in the packed files`);
}

const css = readFileSync("dist/quiet.css", "utf8");
check(
	css.startsWith("@layer q.tokens,q.themes,q.base,q.components,q.utilities;"),
	"dist/quiet.css does not start with the layer order statement",
);
check(
	!css.includes("fonts.googleapis.com"),
	"dist/quiet.css loads fonts; they belong in fonts.css",
);

const fonts = readFileSync("dist/fonts.css", "utf8");
for (const family of ["Inter+Tight", "JetBrains+Mono"]) {
	check(fonts.includes(`family=${family}`), `dist/fonts.css does not load ${family}`);
}

check(shipped.has("dist/components/core/Button.d.ts"), "component declarations are not shipped");

if (failures.length) {
	console.error(failures.map((f) => `✗ ${f}`).join("\n"));
	process.exit(1);
}
console.log(`package ok: ${shipped.size} files, ${targets.length} export targets`);
