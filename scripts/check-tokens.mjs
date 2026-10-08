// Keeps TS and SCSS agreeing on custom property names (run by `npm run lint`):
//   1. src/styles/tokens.generated.ts and tokens.json match the SCSS (else: npm run gen);
//   2. every --q-* name a TS file spells (code, prose or comment) is one the SCSS declares, spelled
//      whole — no `--q-space-${n}`: list the real names, typed TokenName. `--q-status-*` names a
//      family and passes if the family exists;
//   3. every --_local a component or story sets from TSX is read by a stylesheet it imports.
import { globSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { LIST, OUT, renderList, renderTokens, tokenNames } from "./gen-tokens.mjs";

const problems = [];
const names = tokenNames();
const declared = new Set(names);

for (const [file, text] of [
	[OUT, renderTokens(names)],
	[LIST, renderList(names)],
]) {
	if (readFileSync(file, "utf8") !== text)
		problems.push(`${file} is out of date with the SCSS — run npm run gen`);
}

const ts = globSync("src/**/*.{ts,tsx}").filter((f) => !f.includes(".generated."));
for (const file of ts) {
	readFileSync(file, "utf8")
		.split("\n")
		.forEach((line, i) => {
			for (const m of line.matchAll(/--q-[a-z0-9-]*[a-z0-9](-?\$\{|-\*)?/g)) {
				const at = `${file}:${i + 1}`;
				const [whole, tail] = m;
				const base = tail ? whole.slice(0, -tail.length) : whole;
				// "--q-status-*" in prose names a family; it must still exist.
				if (tail === "-*") {
					if (!names.some((n) => n.startsWith(`${base}-`)))
						problems.push(`${at}: no ${whole} tokens`);
				} else if (tail) problems.push(`${at}: ${whole} builds a token name; list the real names`);
				else if (!declared.has(base)) problems.push(`${at}: ${base} is not a declared token`);
			}
		});
}

for (const file of globSync("src/{components,stories}/**/*.tsx")) {
	const src = readFileSync(file, "utf8");
	const sheets = [...src.matchAll(/^import\s+["'](\.[^"']+\.scss)["']/gm)].map((m) =>
		join(dirname(file), m[1]),
	);
	const css = sheets.map((s) => readFileSync(s, "utf8")).join("\n");
	for (const [, name] of src.matchAll(/["'`](--_[a-z0-9-]+)["'`]/g)) {
		if (!sheets.length) problems.push(`${file}: sets ${name} but imports no stylesheet`);
		else if (!css.includes(`var(${name}`)) {
			problems.push(`${file}: sets ${name}, which ${sheets.join(", ")} never reads`);
		}
	}
}

if (problems.length) {
	const unique = [...new Set(problems)];
	console.error(unique.join("\n"));
	console.error(`check-tokens: ${unique.length} problem(s)`);
	process.exit(1);
}
console.log(`check-tokens: ok (${ts.length} TS files, ${names.length} tokens)`);
