#!/usr/bin/env node
// Vendors quiet into an app, and checks the vendored copy is untouched.
//
//   node <path-to-quiet>/scripts/quiet.mjs sync [--to vendor/quiet]   (run in the app)
//   npx quiet check [--to vendor/quiet]                                 (in the app, e.g. in CI)
//
// sync copies quiet's source (no stories, tests or reference mirror) into the app, replacing what
// was there, and writes a package.json whose exports point at that source, so the app depends on
// it with "@optimusfoundry/quiet": "file:./vendor/quiet" and imports stay `@optimusfoundry/quiet`.
// The copy is read-only: fixes go to the quiet repo, then sync again. check fails when a vendored
// file was edited, added or removed since the last sync (quiet.manifest.json holds the hashes).
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
	cpSync,
	existsSync,
	globSync,
	readFileSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MANIFEST = "quiet.manifest.json";
// What an app needs from quiet, relative to the quiet repo root.
const COPY = [
	"src",
	"stylelint",
	"docs/guidelines",
	"skills/quiet-app",
	"DESIGN.md",
	"scripts/quiet.mjs",
	"scripts/quiet-audit.mjs",
	"scripts/quiet-audit-core.mjs",
	"scripts/quiet-audit-core.d.mts",
];
const SKIP = ["src/stories"];

const [command, ...args] = process.argv.slice(2);
const flag = (name, fallback) => {
	const i = args.indexOf(name);
	return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const target = resolve(flag("--to", "vendor/quiet"));

const sha = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
const files = (root) =>
	globSync("**/*", { cwd: root })
		.filter((f) => f !== MANIFEST && statSync(join(root, f)).isFile())
		.sort();

function sync() {
	const source = resolve(dirname(fileURLToPath(import.meta.url)), "..");
	if (!existsSync(join(source, "src/index.ts")) || existsSync(join(source, MANIFEST))) {
		fail(
			"sync runs from the quiet repo (node <quiet>/scripts/quiet.mjs sync), not a vendored copy",
		);
	}
	if (resolve(source) === resolve(process.cwd()))
		fail("run sync in the app, not in the quiet repo");
	const pkg = JSON.parse(readFileSync(join(source, "package.json"), "utf8"));
	const git = (...a) => {
		try {
			return execFileSync("git", ["-C", source, ...a], { encoding: "utf8" }).trim();
		} catch {
			return "";
		}
	};
	const dirty = git("status", "--porcelain", "--", ...COPY) !== "";

	rmSync(target, { recursive: true, force: true });
	for (const path of COPY) {
		cpSync(join(source, path), join(target, path), {
			recursive: true,
			filter: (from) => !SKIP.some((s) => from.startsWith(join(source, s))),
		});
	}
	writeFileSync(
		join(target, "package.json"),
		`${JSON.stringify(
			{
				name: pkg.name,
				version: pkg.version,
				description: `${pkg.description} Vendored by quiet sync — do not edit; change quiet and sync again.`,
				type: "module",
				private: true,
				sideEffects: ["**/*.css", "**/*.scss"],
				exports: {
					".": "./src/index.ts",
					"./style.css": "./src/styles/index.scss",
					"./fonts.css": "./src/styles/fonts.css",
					"./tokens.json": "./src/styles/tokens.generated.json",
					"./stylelint": "./stylelint/index.mjs",
					"./stylelint/config": "./stylelint/config.mjs",
				},
				bin: { quiet: "scripts/quiet.mjs", "quiet-audit": "scripts/quiet-audit.mjs" },
				dependencies: pkg.dependencies,
				peerDependencies: {
					react: pkg.peerDependencies.react,
					"react-dom": pkg.peerDependencies["react-dom"],
				},
			},
			null,
			"\t",
		)}\n`,
	);
	const manifest = {
		version: pkg.version,
		commit: git("rev-parse", "HEAD") || null,
		dirty,
		files: Object.fromEntries(files(target).map((f) => [f, sha(join(target, f))])),
	};
	writeFileSync(join(target, MANIFEST), `${JSON.stringify(manifest, null, "\t")}\n`);

	const where = relative(process.cwd(), target) || ".";
	console.log(
		`quiet ${pkg.version} (${manifest.commit?.slice(0, 7) ?? "no git"}) → ${where}: ${Object.keys(manifest.files).length} files`,
	);
	if (dirty)
		console.warn(
			"warning: the quiet repo has uncommitted changes in the synced files; the manifest's commit doesn't fully describe this copy",
		);
	console.log(`
First sync only, in the app:
  package.json    "dependencies": { "@optimusfoundry/quiet": "file:./${where}" }, then npm install
                  devDependencies quiet's source needs: sass-embedded, typescript (>= 5.8), react >= 19.2
  entry           import "@optimusfoundry/quiet/style.css";  import "@optimusfoundry/quiet/fonts.css";
  stylelint       extends: ["@optimusfoundry/quiet/stylelint/config"], ignoreFiles: ["${where}/**"]
                  (devDependencies: stylelint, stylelint-declaration-strict-value)
  biome/eslint    ignore ${where}/**
  CI              npx quiet check
  agents          ${where}/skills/quiet-app/SKILL.md → .claude/skills/quiet-app/ ; never edit ${where}
Commit the sync on its own: git add ${where} && git commit -m "chore: quiet ${pkg.version}"`);
}

function check() {
	const path = join(target, MANIFEST);
	if (!existsSync(path)) fail(`no ${relative(process.cwd(), path)}; run quiet sync first`);
	const manifest = JSON.parse(readFileSync(path, "utf8"));
	const now = files(target);
	const problems = [
		...now.filter((f) => !(f in manifest.files)).map((f) => `added    ${f}`),
		...Object.keys(manifest.files)
			.filter((f) => !now.includes(f))
			.map((f) => `removed  ${f}`),
		...now
			.filter((f) => f in manifest.files && manifest.files[f] !== sha(join(target, f)))
			.map((f) => `edited   ${f}`),
	];
	if (problems.length) {
		console.error(problems.join("\n"));
		fail(
			`${problems.length} vendored file(s) changed since quiet ${manifest.version} was synced. Make the change in the quiet repo and sync again.`,
		);
	}
	console.log(
		`quiet ${manifest.version} (${manifest.commit?.slice(0, 7) ?? "no git"}): ${now.length} vendored files untouched`,
	);
}

function fail(message) {
	console.error(`quiet: ${message}`);
	process.exit(1);
}

if (command === "sync") sync();
else if (command === "check") check();
else fail("usage: quiet sync [--to vendor/quiet] | quiet check [--to vendor/quiet]");
