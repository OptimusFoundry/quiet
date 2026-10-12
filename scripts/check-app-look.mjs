// Checks the app look (src/styles/_app.scss): every stylesheet that sets values in
// `@include app.look { … }` re-declares exactly those keys in `@include app.reset { … }`, so a
// marketing frame nested in an app gets its defaults back.
import { globSync, readFileSync } from "node:fs";

const files = [...globSync("src/components/**/*.scss"), "src/styles/tokens/_color.scss"];
const keysIn = (src, mixin) => {
	const m = src.match(new RegExp(`@include app\\.${mixin} \\{([\\s\\S]*?)\\n\\s*\\}`));
	return m ? [...m[1].matchAll(/^\s*(--q-[\w-]+):/gm)].map((k) => k[1]).sort() : null;
};
let bad = 0;
let n = 0;
for (const file of files) {
	const src = readFileSync(file, "utf8");
	const look = keysIn(src, "look");
	if (!look) continue;
	n++;
	const reset = keysIn(src, "reset") ?? [];
	const missing = look.filter((k) => !reset.includes(k));
	const extra = reset.filter((k) => !look.includes(k));
	if (missing.length || extra.length) {
		bad++;
		console.error(
			`${file}: app.reset ${missing.length ? `misses ${missing.join(", ")}` : ""}${extra.length ? ` has extra ${extra.join(", ")}` : ""}`,
		);
	}
}
if (bad) process.exit(1);
console.log(`app look ok: ${n} stylesheets reset what they set`);
