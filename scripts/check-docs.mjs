// Keeps the guidance agents read in step with the code (run by `npm run lint`). In the guidelines,
// DESIGN.md, README and the skills and agents (quiet's own and the app plugin):
//   1. every --q-* token named is declared (a `--q-status-*` family must exist; names with a
//      placeholder, `--q-<block>-*` or `--q-text-heading-1…4`, are skipped);
//   2. every component named in code (`Panel`, `<Panel …>`, `Panel variant="plain"`) is exported
//      from src/index.ts, unless it is one of the app-side names below.
// A stale name in agent guidance is a confident, wrong instruction.
import { existsSync, globSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tokenNames } from "./gen-tokens.mjs";

const FILES = [
	"README.md",
	"DESIGN.md",
	"docs/guidelines/*.md",
	"claude/**/*.md",
	".claude/skills/**/*.md",
	".claude/agents/*.md",
].flatMap((g) => globSync(g));

// Names the guidance uses for the app's own code, React, or tooling, not quiet exports.
const NOT_QUIET = new Set([
	"App",
	"Outlet",
	"RouterLink",
	"Notifications",
	"React",
	"Proto",
	"PascalName",
	"Name",
	"Concept",
	"Spec",
	"Meta",
	"StoryObj",
	"CLAUDE",
	"AGENTS",
	"DESIGN",
	"README",
	"SKILL",
	"Shape",
	"Implement",
	"Intl",
	"Pending",
	"Current",
	"ListFiles",
	"Review",
]);

const declared = new Set(tokenNames());
// Every name src/index.ts exports, following its `export * from` and `export { … } from` lines.
const exported = new Set();
const seen = new Set();
function collect(file) {
	if (seen.has(file)) return;
	seen.add(file);
	const text = readFileSync(file, "utf8");
	for (const [, name] of text.matchAll(
		/export\s+(?:declare\s+)?(?:function|const|let|class|interface|type|enum)\s+([A-Za-z0-9_]+)/g,
	))
		exported.add(name);
	for (const [, list] of text.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}/g))
		for (const part of list.split(",")) {
			const name = part
				.trim()
				.replace(/^type\s+/, "")
				.split(/\s+as\s+/)
				.pop();
			if (name) exported.add(name);
		}
	for (const [, spec] of text.matchAll(/export\s+\*\s+from\s+"([^"]+)"/g)) {
		const base = join(dirname(file), spec);
		const found = [".tsx", ".ts", "/index.ts"].map((ext) => base + ext).find(existsSync);
		if (found) collect(found);
	}
}
collect("src/index.ts");

const problems = [];
for (const file of FILES) {
	readFileSync(file, "utf8")
		.split("\n")
		.forEach((line, i) => {
			const at = `${file}:${i + 1}`;
			for (const [whole] of line.matchAll(/--q-[a-z0-9-]*[a-z0-9](?:-\*|[-<…])?/g)) {
				if (/[<…]$/.test(whole)) continue;
				if (whole.endsWith("-*")) {
					const base = whole.slice(0, -2);
					if (![...declared].some((n) => n.startsWith(`${base}-`)))
						problems.push(`${at}: no ${whole} tokens`);
				} else if (!whole.endsWith("-") && !declared.has(whole))
					problems.push(`${at}: ${whole} is not a declared token`);
			}
			const names = [
				...[...line.matchAll(/`<?([A-Z][A-Za-z0-9]+)[^`]*`/g)].map((m) => m[1]),
				...[...line.matchAll(/<([A-Z][A-Za-z0-9]+)[\s/>]/g)].map((m) => m[1]),
			];
			for (const name of new Set(names)) {
				if (/^[A-Z0-9]+$/.test(name) || NOT_QUIET.has(name) || exported.has(name)) continue;
				problems.push(`${at}: ${name} is not exported by quiet`);
			}
		});
}

if (problems.length) {
	console.error(
		`check-docs: ${problems.length} stale name(s) in agent guidance\n  ${problems.join("\n  ")}`,
	);
	process.exit(1);
}
console.log(`check-docs: ${FILES.length} files, every token and component named exists`);
