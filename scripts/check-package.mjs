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
// Layers rank by the order statement or, once a minifier drops it, by first appearance: either
// way the first mention of each layer must follow q.tokens, q.themes, q.base, q.components, q.utilities.
const LAYERS = ["q.tokens", "q.themes", "q.base", "q.components", "q.utilities"];
const firstSeen = [...css.matchAll(/@layer\s+([^{;]+)[{;]/g)]
	.flatMap((m) => m[1].split(",").map((l) => l.trim()))
	.filter((l, i, all) => all.indexOf(l) === i);
check(
	JSON.stringify(firstSeen) === JSON.stringify(LAYERS),
	`dist/quiet.css layers rank ${firstSeen.join(" < ")}, not ${LAYERS.join(" < ")}`,
);
check(
	!css.includes("fonts.googleapis.com"),
	"dist/quiet.css loads fonts; they belong in fonts.css",
);

const fonts = readFileSync("dist/fonts.css", "utf8");
for (const family of ["Inter+Tight", "JetBrains+Mono"]) {
	check(fonts.includes(`family=${family}`), `dist/fonts.css does not load ${family}`);
}

check(
	readFileSync("dist/tokens.json", "utf8") ===
		readFileSync("src/styles/tokens.generated.json", "utf8"),
	"dist/tokens.json (for quiet/known-tokens) is not the current token list",
);
check(shipped.has("dist/components/core/Button.d.ts"), "component declarations are not shipped");

if (failures.length) {
	console.error(failures.map((f) => `✗ ${f}`).join("\n"));
	process.exit(1);
}
console.log(`package ok: ${shipped.size} files, ${targets.length} export targets`);
