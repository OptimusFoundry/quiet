// Packs the design-sync output (ds-bundle/) into the Design System artifact's layout and works out
// what a push has to upload. Claude does the uploads with its Artifact tool (no other client can);
// this script makes everything around them deterministic. The steps are in
// .claude/skills/sync-design-artifact/SKILL.md.
//
//   node scripts/design-artifact.mjs pack            ds-bundle/ → .ds-artifact/project/
//   node scripts/design-artifact.mjs plan            diff against the manifest → .ds-artifact/plan.json
//   node scripts/design-artifact.mjs index <remote design-system.json> --note "…"
//   node scripts/design-artifact.mjs remote          empty .ds-artifact/remote/, list the files to read into it
//   node scripts/design-artifact.mjs pull            what was edited in the artifact since the last push
//   node scripts/design-artifact.mjs record --version <id>   after a push: manifest + anchor
//
// The manifest (.design-sync/artifact/manifest.json) holds the sha256 of every file the last push
// left in the artifact, and the artifact version that push produced. Files not in it (the
// migration's tokens.css, archived/, assets/) are never touched.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import http from "node:http";
import { dirname, extname, join, relative } from "node:path";

const BUNDLE = "ds-bundle";
const OUT = ".ds-artifact";
const PROJECT = join(OUT, "project");
const REMOTE = join(OUT, "remote");
const STATE = ".design-sync/artifact";
const MANIFEST = join(STATE, "manifest.json");
const HEIGHTS = join(STATE, "heights.json");
const CHUNK = 240; // the Artifact tool takes ≤255 files per publish
const INDEX = "project/design-system.json"; // written last, by `index`, never by a chunk

const sha = (buf) => createHash("sha256").update(buf).digest("hex");
const readJson = (p, fallback) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : fallback);
const writeJson = (p, v) => {
	mkdirSync(dirname(p), { recursive: true });
	writeFileSync(p, `${JSON.stringify(v, null, "\t")}\n`);
};
const walk = (dir) =>
	readdirSync(dir, { recursive: true, withFileTypes: true })
		.filter((d) => d.isFile())
		.map((d) => join(d.parentPath, d.name));
const write = (p, content) => {
	mkdirSync(dirname(p), { recursive: true });
	writeFileSync(p, content);
};
// The Artifact tool infers types from the extension, except .d.ts.
const contentType = (p) => (p.endsWith(".d.ts") ? "text/plain" : undefined);
const fail = (msg) => {
	console.error(`✗ ${msg}`);
	process.exit(1);
};

const [cmd, ...args] = process.argv.slice(2);
const flag = (name) => {
	const i = args.indexOf(name);
	return i === -1 ? undefined : args[i + 1];
};

function components() {
	const list = [];
	for (const group of readdirSync(join(BUNDLE, "components"))) {
		for (const name of readdirSync(join(BUNDLE, "components", group))) list.push({ group, name });
	}
	return list.sort((a, b) => a.name.localeCompare(b.name));
}

// Card heights: the artifact sizes a card from its marker, so each preview is rendered once at its
// capture width. Cached by the bytes that decide the height.
async function measure(list) {
	const cache = readJson(HEIGHTS, {});
	const shared = sha(
		readFileSync(join(BUNDLE, "_ds_bundle.css")) + readFileSync(join(BUNDLE, "_ds_bundle.js")),
	);
	const key = ({ group, name }) =>
		sha(
			shared +
				readFileSync(join(BUNDLE, "components", group, name, `${name}.html`)) +
				readFileSync(join(BUNDLE, "_preview", `${name}.js`)),
		);
	const stale = list.filter((c) => cache[c.name]?.key !== key(c));
	if (stale.length) {
		const { chromium } = await import("@playwright/test");
		const types = {
			".html": "text/html",
			".js": "text/javascript",
			".css": "text/css",
			".woff2": "font/woff2",
		};
		const server = http
			.createServer((req, res) => {
				const p = join(BUNDLE, decodeURIComponent(req.url.split("?")[0]));
				if (!existsSync(p)) return res.writeHead(404).end();
				res.writeHead(200, { "content-type": types[extname(p)] ?? "application/octet-stream" });
				res.end(readFileSync(p));
			})
			.listen(0);
		const { port } = server.address();
		const browser = await chromium.launch();
		for (const c of stale) {
			const html = readFileSync(
				join(BUNDLE, "components", c.group, c.name, `${c.name}.html`),
				"utf8",
			);
			const vp = /viewport="(\d+)x(\d+)"/.exec(html.split("\n")[0]);
			const single = /var MODE="single"/.test(html);
			const width = vp ? +vp[1] : 900;
			const page = await browser.newPage({
				viewport: { width, height: single && vp ? +vp[2] : 100 },
				reducedMotion: "reduce",
			});
			await page.goto(`http://127.0.0.1:${port}/components/${c.group}/${c.name}/${c.name}.html`);
			await page.waitForTimeout(700);
			const h = await page.evaluate(() => document.documentElement.scrollHeight);
			cache[c.name] = { key: key(c), h: Math.max(40, Math.min(4000, h)), width: vp ? width : null };
			await page.close();
		}
		await browser.close();
		server.close();
	}
	for (const name of Object.keys(cache)) if (!list.some((c) => c.name === name)) delete cache[name];
	writeJson(HEIGHTS, cache);
	console.log(`heights: ${stale.length} measured, ${list.length - stale.length} cached`);
	return cache;
}

// ds-bundle's card → the artifact's preview.html: the marker carries group and size, the card
// loads ./preview.js (the artifact provides React and the bundle), fonts come from ../../fonts,
// the theme follows the page's switcher, and the frame colours are tokens.
function previewHtml(html, { group, name }, { h, width }) {
	const marker = `<!-- @dsCard group="${group}" height=${h}${width ? ` width=${width}` : ""} -->`;
	const body = html
		.split("\n")
		.slice(1)
		.join("\n")
		.replace(
			'  <link rel="stylesheet" href="../../../styles.css">\n  <link rel="stylesheet" href="../../../_ds_bundle.css">',
			'  <link rel="stylesheet" href="../../fonts/fonts.css">',
		)
		.replaceAll("background:#fff}", "background:var(--q-bg)}")
		.replaceAll("border:1px solid #e5e7eb", "border:1px solid var(--q-border)")
		.replaceAll("color:#6b7280", "color:var(--q-fg-muted)")
		.replace(
			new RegExp(
				`  <script src="\\.\\./\\.\\./\\.\\./_vendor/react\\.js"></script>\\n  <script src="\\.\\./\\.\\./\\.\\./_vendor/react-dom\\.js"></script>\\n  <script src="\\.\\./\\.\\./\\.\\./_ds_bundle\\.js"></script>\\n  <script src="\\.\\./\\.\\./\\.\\./_preview/${name}\\.js"></script>`,
			),
			'  <script src="./preview.js"></script>',
		)
		.replace(
			"  <script>\n    var h=React.createElement",
			"  <script>\n    var T=document.documentElement.getAttribute('data-theme')||undefined;\n    var h=React.createElement",
		)
		.replace('{"density":"app"}', '{"density":"app","theme":T}')
		.replace(
			`no PascalCase exports in _preview/${name}.js`,
			"no PascalCase exports in ./preview.js",
		);
	for (const bad of ["_vendor/", "_ds_bundle", "_preview/", "#fff}", "#e5e7eb"]) {
		if (body.includes(bad))
			fail(`${name}: preview.html still has ${bad} — the converter's card template changed`);
	}
	if (!body.includes("./preview.js") || !body.includes('"theme":T'))
		fail(`${name}: card template not recognised`);
	return `${marker}\n${body}`;
}

// The artifact's markdown renderer splits a bullet that wraps onto an indented line.
function joinWrappedBullets(md) {
	const out = [];
	let fence = false;
	for (const line of md.split("\n")) {
		if (line.startsWith("```")) fence = !fence;
		const prev = out.at(-1);
		if (
			!fence &&
			prev !== undefined &&
			/^ {2,}\S/.test(line) &&
			/^\s*[-*] /.test(prev) &&
			!/^\s*[-*] /.test(line)
		) {
			out[out.length - 1] = `${prev} ${line.trim()}`;
		} else out.push(line);
	}
	return out.join("\n");
}

// The converter's README with its paths moved to the artifact's layout. It already starts with the
// conventions header as it was at convert time; that is swapped for the current one.
function readme(config) {
	const converted = readFileSync(join(BUNDLE, "README.md"), "utf8");
	const start = converted.indexOf("# Quiet (");
	if (start === -1) fail("README.md: the converter's README template changed");
	const body = converted
		.slice(start)
		.replace(
			"- `_ds_bundle.js` — the whole-DS bundle at the project root;",
			"- `components/bundle.js` — the whole-DS bundle;",
		)
		.replaceAll("_ds_bundle.css", "components/bundle.css")
		.replaceAll("_ds_bundle.js", "components/bundle.js")
		.replace(
			"`components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid)",
			"`components/<Name>/README.md` (example JSX + variants), `<Name>.d.ts` (types), `preview.html` (variant grid)",
		)
		.replace(
			"- `tokens/*.css` — CSS custom properties",
			"- `tokens.json` / `tokens.css` — CSS custom properties",
		)
		.replace(
			'read_file("components/<group>/<Name>/<Name>.prompt.md")',
			'read_file("components/<Name>/README.md")',
		);
	if (/<Name>\.prompt\.md|_ds_bundle/.test(body))
		fail("README.md: the converter's README template changed");
	const head = config.readmeHeader ? readFileSync(config.readmeHeader, "utf8") : "";
	return joinWrappedBullets(head ? `${head.trimEnd()}\n\n---\n\n${body}` : body);
}

async function pack() {
	if (!existsSync(join(BUNDLE, "_ds_bundle.js")))
		fail(`no ${BUNDLE}/ — run the design-sync converter first`);
	const config = readJson(".design-sync/config.json", {});
	const list = components();
	const heights = await measure(list);
	rmSync(PROJECT, { recursive: true, force: true });
	const types = [];
	for (const c of list) {
		const src = join(BUNDLE, "components", c.group, c.name);
		const dir = join(PROJECT, "components", c.name);
		const html = readFileSync(join(src, `${c.name}.html`), "utf8");
		write(join(dir, "preview.html"), previewHtml(html, c, heights[c.name]));
		copyFileSync(join(BUNDLE, "_preview", `${c.name}.js`), join(dir, "preview.js"));
		write(
			join(dir, "README.md"),
			readFileSync(join(src, `${c.name}.prompt.md`), "utf8").replace(
				"(bundle loaded from the root `_ds_bundle.js`)",
				"(bundle loaded from `components/bundle.js`)",
			),
		);
		const dts = readFileSync(join(src, `${c.name}.d.ts`), "utf8");
		write(join(dir, `${c.name}.d.ts`), dts);
		types.push(dts.replace(/^import \* as React from 'react';\n+/, ""));
	}
	write(
		join(PROJECT, "components/index.d.ts"),
		`// Types of every @optimusfoundry/quiet component (window.Quiet), one block per component.\nimport * as React from 'react';\n\n${types.join("\n")}`,
	);
	copyFileSync(join(BUNDLE, "_ds_bundle.js"), join(PROJECT, "components/bundle.js"));
	copyFileSync(join(BUNDLE, "_ds_bundle.css"), join(PROJECT, "components/bundle.css"));
	write(
		join(PROJECT, "styles.css"),
		'@import "./fonts/fonts.css";\n@import "./components/bundle.css";\n',
	);
	for (const dir of ["fonts", "guidelines"]) {
		for (const f of walk(join(BUNDLE, dir))) {
			const to = join(PROJECT, relative(BUNDLE, f));
			mkdirSync(dirname(to), { recursive: true });
			copyFileSync(f, to);
		}
	}
	write(join(PROJECT, "README.md"), readme(config));
	copyFileSync(join(BUNDLE, "_ds_sync.json"), join(OUT, "anchor.json"));
	console.log(`packed ${list.length} components into ${PROJECT}`);
}

function hashes() {
	if (!existsSync(PROJECT)) fail("nothing packed — run `pack` first");
	const out = {};
	for (const f of walk(PROJECT).sort()) {
		const path = relative(OUT, f);
		if (path !== INDEX) out[path] = sha(readFileSync(f));
	}
	return out;
}

function plan() {
	const manifest = readJson(MANIFEST, { files: {} });
	const now = hashes();
	const changed = Object.keys(now).filter((p) => manifest.files[p] !== now[p]);
	const removed = Object.keys(manifest.files).filter((p) => !(p in now));
	const entries = [
		...changed.map((p) => [p, contentType(p) ? { from: p, contentType: contentType(p) } : p]),
		...removed.map((p) => [p, null]),
	];
	const chunks = [];
	for (let i = 0; i < entries.length; i += CHUNK)
		chunks.push(Object.fromEntries(entries.slice(i, i + CHUNK)));
	const components = new Set(
		changed.concat(removed).map((p) => /^project\/components\/([^/]+)\//.exec(p)?.[1]),
	);
	components.delete(undefined);
	writeJson(join(OUT, "plan.json"), {
		root: OUT,
		lastPushedVersion: manifest.version ?? null,
		changed,
		removed,
		chunks,
	});
	console.log(
		changed.length + removed.length === 0
			? "nothing to push: the artifact already has this build"
			: `${changed.length} changed, ${removed.length} removed (${components.size} components) → ${chunks.length} publish call(s); see ${OUT}/plan.json`,
	);
	console.log(`last pushed artifact version: ${manifest.version ?? "none recorded"}`);
}

// Updates only lastChange, keeping every other key the artifact type wrote.
function index() {
	const from = args[0];
	if (!from || !existsSync(from))
		fail("usage: index <saved remote design-system.json> --note <text>");
	const doc = JSON.parse(readFileSync(from, "utf8"));
	const by = execFileSync("git", ["config", "user.name"], { encoding: "utf8" }).trim();
	doc.lastChange = {
		by,
		at: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
		via: "Claude Code",
		note: flag("--note") ?? "Synced from the quiet repo",
	};
	write(join(OUT, INDEX), `${JSON.stringify(doc, null, 2)}\n`);
	console.log(`wrote ${join(OUT, INDEX)}`);
}

// Empties the folder the artifact's files are read back into (a reused folder keeps stale copies)
// and lists what to read: every text file the last push left there, ≤250 paths per read.
function remote() {
	const manifest = readJson(MANIFEST, { files: {} });
	rmSync(REMOTE, { recursive: true, force: true });
	mkdirSync(REMOTE, { recursive: true });
	const paths = Object.keys(manifest.files).filter((p) => !p.endsWith(".woff2"));
	const reads = [];
	for (let i = 0; i < paths.length; i += 250) reads.push(paths.slice(i, i + 250));
	writeJson(join(OUT, "remote-reads.json"), reads);
	console.log(
		`read ${paths.length} files in ${reads.length} call(s) into ${REMOTE}; paths in ${OUT}/remote-reads.json`,
	);
}

// Compares files read back from the artifact with what the last push left there. A difference is
// an edit made in Claude Design: port it into src/ (and the previews) before pushing over it.
function pull() {
	const dir = args[0] ?? REMOTE;
	if (!existsSync(join(dir, "project")))
		fail(`nothing read into ${dir} — run \`remote\` and read the files first`);
	const manifest = readJson(MANIFEST, { files: {} });
	const root = dir;
	const edited = [];
	const added = [];
	for (const f of walk(join(root, "project"))) {
		const path = relative(root, f);
		if (path === INDEX) continue;
		if (!(path in manifest.files)) added.push(path);
		else if (manifest.files[path] !== sha(readFileSync(f))) edited.push(path);
	}
	if (!edited.length && !added.length)
		return console.log("no edits in the artifact since the last push");
	for (const p of edited) {
		console.log(`edited  ${p}`);
		const ours = join(OUT, p);
		if (existsSync(ours) && !p.endsWith(".js")) {
			try {
				execFileSync("git", ["diff", "--no-index", "--stat", ours, join(root, p)], {
					stdio: "inherit",
				});
			} catch {}
		}
	}
	for (const p of added) console.log(`new     ${p} (not from a sync)`);
	process.exitCode = edited.length ? 1 : 0;
}

function record() {
	const version = flag("--version");
	if (!version) fail("usage: record --version <artifact version id from the last publish>");
	writeJson(MANIFEST, { version, pushedAt: new Date().toISOString(), files: hashes() });
	copyFileSync(join(OUT, "anchor.json"), join(STATE, "anchor.json"));
	console.log(`recorded version ${version}; commit ${STATE}/`);
}

const commands = { pack, plan, index, remote, pull, record };
if (!commands[cmd]) fail(`usage: design-artifact.mjs <${Object.keys(commands).join("|")}> …`);
await commands[cmd]();
