// Every component has a page and a tile (run by `npm run lint`). For each PascalCase
// src/components/<group>/<Name>.tsx there must be
//   1. src/stories/components/<group>/<Name>.stories.tsx, titled "Components/<Label>/<Name>", and
//   2. a tile `name: "<Name>"` in src/stories/overview/tiles/<group>.tsx (the UI kit overview).
// docs/superpowers/specs/2026-10-12-storybook-overhaul-design.md has the why.
import { existsSync, globSync, readFileSync } from "node:fs";
import { basename, dirname } from "node:path";

const LABELS = {
	core: "Core",
	forms: "Forms",
	display: "Display",
	data: "Data",
	navigation: "Navigation",
	feedback: "Feedback",
	overlays: "Overlays",
	layout: "Layout",
	app: "App",
	charts: "Charts",
	chat: "Chat",
	future: "Agent & trust",
};

const problems = [];
for (const file of globSync("src/components/*/*.tsx").sort()) {
	const name = basename(file, ".tsx");
	if (!/^[A-Z]/.test(name)) continue;
	const group = basename(dirname(file));
	const label = LABELS[group];
	if (!label) {
		problems.push(`${file}: group "${group}" has no label in scripts/check-stories.mjs`);
		continue;
	}
	const story = `src/stories/components/${group}/${name}.stories.tsx`;
	if (!existsSync(story)) problems.push(`${file}: no story (${story})`);
	else if (!readFileSync(story, "utf8").includes(`title: "Components/${label}/${name}"`))
		problems.push(`${story}: title must be "Components/${label}/${name}"`);
	const tiles = `src/stories/overview/tiles/${group}.tsx`;
	if (!existsSync(tiles) || !readFileSync(tiles, "utf8").includes(`name: "${name}"`))
		problems.push(`${file}: no tile in ${tiles}`);
}

if (problems.length) {
	console.error(`check-stories: ${problems.length} problem(s)\n  ${problems.join("\n  ")}`);
	process.exit(1);
}
console.log("check-stories: every component has a story and a tile");
