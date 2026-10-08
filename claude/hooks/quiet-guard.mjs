#!/usr/bin/env node
// Claude Code hook for apps that vendor quiet (registered in .claude/settings.json by `quiet sync`).
//   pre   (PreToolUse, Edit|Write|MultiEdit|NotebookEdit): blocks any edit inside the vendored copy —
//         quiet is fixed in the quiet repo and re-synced, never patched in an app.
//   post  (PostToolUse, Edit|Write|MultiEdit): lints a changed .css/.scss with the app's Stylelint
//         config (quiet's rules) and feeds problems back. Never blocks; skips if Stylelint is absent.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

const mode = process.argv[2];
const vendor = process.argv[3] ?? "vendor/quiet";
const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();

let input = {};
try {
	input = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
	process.exit(0);
}
const file = input.tool_input?.file_path ?? input.tool_input?.notebook_path;
if (!file) process.exit(0);
const rel = relative(root, resolve(root, file));
const inVendor = rel === vendor || rel.startsWith(vendor + sep) || rel.startsWith(`${vendor}/`);

if (mode === "pre" && inVendor) {
	process.stderr.write(
		`${rel} is part of the vendored quiet copy (${vendor}), which is read-only: \`npx quiet check\` fails on any edit and the next sync overwrites it. Make the change in the quiet repo, then run \`node <quiet>/scripts/quiet.mjs sync\` here. If quiet blocks the task, say so instead of patching the copy.\n`,
	);
	process.exit(2);
}

if (mode === "post" && !inVendor && /\.s?css$/.test(rel)) {
	const bin = resolve(root, "node_modules/.bin/stylelint");
	if (!existsSync(bin)) process.exit(0);
	try {
		execFileSync(bin, [rel], { cwd: root, encoding: "utf8", stdio: "pipe" });
	} catch (e) {
		process.stderr.write(`stylelint ${rel}\n${e.stdout || ""}${e.stderr || ""}`);
		process.exit(2);
	}
}
process.exit(0);
