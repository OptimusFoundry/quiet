// One-off codemod for the one-look merge (docs/plans/2026-10-12-one-look.md, phase 2). Per file:
// each `--q-*: value;` inside `@include app.look { … }` replaces the same key's default (its first
// declaration earlier in the file), or is appended to the first `[data-theme] {` block if the key
// has no default; then the look and reset blocks (and the comment lines directly above them) are
// removed, `@include app.rules { … }` is unwrapped in place, and `@use "…/app";` is dropped.
// Usage: node scripts/fold-app-look.mjs [--write] [files…]
import { globSync, readFileSync, writeFileSync } from "node:fs";

const write = process.argv.includes("--write");
const named = process.argv.slice(2).filter((a) => a !== "--write");
const files = named.length
	? named
	: [...globSync("src/components/**/*.scss"), "src/styles/tokens/_color.scss"];

/** Index just past the `}` matching the `{` at `open`. */
function close(src, open) {
	let i = open + 1;
	for (let depth = 1; depth; i++) {
		if (src[i] === "{") depth++;
		else if (src[i] === "}") depth--;
	}
	return i;
}

/** The `@include app.<name> { … }` block: from (incl. comment lines above), to (past `}` + newline), body. */
function find(src, name) {
	const at = src.indexOf(`@include app.${name} {`);
	if (at < 0) return null;
	const open = src.indexOf("{", at);
	const end = close(src, open);
	let from = src.lastIndexOf("\n", at) + 1;
	for (;;) {
		const prevStart = src.lastIndexOf("\n", from - 2) + 1;
		if (
			from === 0 ||
			!src
				.slice(prevStart, from - 1)
				.trim()
				.startsWith("//")
		)
			break;
		from = prevStart;
	}
	const to = src[end] === "\n" ? end + 1 : end;
	return { from, to, body: src.slice(open + 1, end - 1) };
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
let changed = 0;
for (const file of files) {
	let src = readFileSync(file, "utf8");
	const before = src;
	const look = find(src, "look");
	if (look) {
		const decls = [...look.body.matchAll(/^\s*(--q-[\w-]+):\s*([^;]+);/gm)];
		let head = src.slice(0, look.from);
		for (const [, key, value] of decls) {
			const re = new RegExp(`^(\\s*${esc(key)}:\\s*)[^;]+;`, "m");
			if (re.test(head)) head = head.replace(re, (_, lead) => `${lead}${value.trim()};`);
			else {
				const end = close(head, head.indexOf("{", head.indexOf("[data-theme] {"))) - 1;
				head = `${head.slice(0, end)}  ${key}: ${value.trim()};\n${head.slice(end)}`;
			}
		}
		src = head + src.slice(look.from);
	}
	for (const name of ["look", "reset"]) {
		const b = find(src, name);
		if (b) src = src.slice(0, b.from) + src.slice(b.to);
	}
	for (let b = find(src, "rules"); b; b = find(src, "rules")) {
		const body = b.body.replace(/^\n/, "").replace(/^ {2}/gm, "");
		src = `${src.slice(0, b.from)}${body}\n${src.slice(b.to)}`;
	}
	src = src.replace(/^@use "[./]*(styles\/)?app";\n/m, "").replace(/\n{3,}/g, "\n\n");
	if (src !== before) {
		changed++;
		if (write) writeFileSync(file, src);
		console.log(`${write ? "folded" : "would fold"} ${file}`);
	}
}
console.log(`${changed} file(s) ${write ? "folded" : "to fold"}`);
