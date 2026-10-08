// Lists every way src/ departs from the Claude Design mirror. Departures are allowed only for
// the a11y + motion layer, and the at-rest look must stay pixel-identical (tests/parity.spec.ts).
import { existsSync, readdirSync, readFileSync } from "node:fs";

const REF = "docs/reference/optimus-design/components";
let changed = 0;
for (const group of readdirSync("src/components")) {
	for (const file of readdirSync(`src/components/${group}`)) {
		// Stylesheets are quiet's own (the reference styles inline), so only .jsx/.d.ts are compared.
		if (!existsSync(`${REF}/${group}/${file}`)) continue;
		const ours = readFileSync(`src/components/${group}/${file}`, "utf8");
		const theirs = readFileSync(`${REF}/${group}/${file}`, "utf8");
		if (ours !== theirs) {
			changed++;
			console.log(`changed  ${group}/${file}`);
		}
	}
}
console.log(`${changed} file(s) differ from the reference`);
