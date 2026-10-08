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
