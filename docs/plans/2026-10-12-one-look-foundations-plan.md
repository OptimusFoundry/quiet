# One look, phases 1–2 (foundations and folding the looks): implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** quiet renders one look everywhere. Today's app-look values become the defaults, the marketing look and its plumbing (`app.look` / `app.reset` / `app.rules`, `data-density="marketing"`) are gone, and the density API is spacing-only.

**Architecture:**
- Tier-2 token files lose their marketing/app selector pairs: the app values become the `:root` defaults.
- A one-off codemod folds every component stylesheet's `app.look` values into its defaults, drops `app.reset`, and unwraps `app.rules`.
- A new lint script, `check-one-look`, is the test. It fails until the plumbing is gone and keeps it gone afterwards.
- `QuietRoot density` becomes `"comfortable" | "compact"`, with deprecated aliases.

**Tech stack:** SCSS with cascade layers, TypeScript/React 19, Node 22 scripts, Biome, Stylelint, Storybook 10.

**Spec:** [docs/plans/2026-10-12-one-look.md](2026-10-12-one-look.md). Read its Decisions and Foundations sections first.

## Global constraints

- Every stylesheet still opens with `@use "../../styles/layers";` (check-layers).
- Tier rules from AGENTS.md hold: palette only in themes; components read tier 2/3 only; token names are spelled whole (check-tokens).
- `npm run gen` after any token add, rename or removal.
- Gate per task: `npm run lint && npm run typecheck && npm run build`, all green.
- Pill shape stays (`--q-radius-pill` on controls). Do not change radii in this plan.
- Branch: work on `feat/one-look` (cut from `feat/soft-ink` at `dac561e`, or from `main` once that merges). Never stash or reset others' work (AGENTS.md "Working alongside other agents").

## Review focus

1. **A nested `[data-theme]` subtree** (e.g. a dark card inside a light page) must still resolve every folded token against its own palette. Defaults must be declared on `:root, [data-theme]`, never on `:root` alone. Pinned by Task 9 step 3.
2. **foundry-dark** must keep its ink and its lifted accent after `_foundry-status.scss` goes and `--q-bg-inverse` is retargeted: text light, primary buttons readable. Pinned by Task 9 step 2.
3. **Vendored apps passing `density="app"` or `"marketing"`** must still typecheck and render the one look, with a dev warning. Pinned by Task 6 step 4.
4. **The `compact` density** must still tighten spacing on top of the new defaults, not reset the type to marketing values. Pinned by Task 4 step 4.
5. **Links in prose** (bare `<a>` with no class) must read as links everywhere: accent text with a soft underline. Before, that only applied inside app subtrees. Pinned by Task 3 step 5.

---

### Task 1: The test, `scripts/check-one-look.mjs`

**Files:**
- Create: `scripts/check-one-look.mjs`

**Interfaces:**
- Produces: `node scripts/check-one-look.mjs`. Exits 1 and prints `file:line rule` per violation, or prints `one look ok: N stylesheets`. Task 8 adds it to `npm run lint`.

- [ ] **Step 1: Write the script**

```js
// One look (docs/plans/2026-10-12-one-look.md): quiet has a single look. No stylesheet may branch
// on the old marketing/app looks, and the marketing-only status theme is gone.
import { existsSync, globSync, readFileSync } from "node:fs";

const RULES = [
	[/@include app\.(look|reset|rules)\b/, "app.look/reset/rules plumbing"],
	[/@use "[./]*styles\/app"|@use "\.\.\/app"|@use "\.\/app"/, "imports styles/_app.scss"],
	[/data-density="(marketing|app)"/, "branches on a removed density (marketing/app)"],
];
const files = globSync("src/**/*.scss");
let bad = 0;
for (const file of files) {
	readFileSync(file, "utf8")
		.split("\n")
		.forEach((line, i) => {
			if (line.trimStart().startsWith("//")) return;
			for (const [re, why] of RULES)
				if (re.test(line)) {
					bad++;
					console.error(`${file}:${i + 1} ${why}`);
				}
		});
}
for (const gone of ["src/styles/_app.scss", "src/styles/themes/_foundry-status.scss"])
	if (existsSync(gone)) {
		bad++;
		console.error(`${gone}: should be deleted (one look)`);
	}
if (bad) process.exit(1);
console.log(`one look ok: ${files.length} stylesheets`);
```

- [ ] **Step 2: Run it and watch it fail**

Run: `node scripts/check-one-look.mjs; echo exit=$?`
Expected: dozens of lines like `src/components/core/Button.scss:46 app.look/reset/rules plumbing`, ending with `exit=1`.

- [ ] **Step 3: Biome-check the script**

Run: `npx biome check scripts/check-one-look.mjs`
Expected: no errors. Apply `npx biome check --write` if it only reformats.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-one-look.mjs
git commit -m "test: check-one-look, failing until the two looks are folded"
```

---

### Task 2: The fold codemod, `scripts/fold-app-look.mjs`

**Files:**
- Create: `scripts/fold-app-look.mjs`

**Interfaces:**
- Produces: `node scripts/fold-app-look.mjs [--write] [files…]` (default: `src/components/**/*.scss` plus `src/styles/tokens/_color.scss`). Without `--write` it prints a unified summary and changes nothing. Tasks 3 and 7 run it.

- [ ] **Step 1: Write the codemod**

```js
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

/** The `@include app.<name> { … }` block: [from (incl. comments above), to (after `}` + newline), body]. */
function find(src, name) {
	const at = src.indexOf(`@include app.${name} {`);
	if (at < 0) return null;
	const open = src.indexOf("{", at);
	let i = open + 1;
	for (let depth = 1; depth; i++) {
		if (src[i] === "{") depth++;
		else if (src[i] === "}") depth--;
	}
	let from = src.lastIndexOf("\n", at) + 1;
	for (;;) {
		const prevStart = src.lastIndexOf("\n", from - 2) + 1;
		const prev = src.slice(prevStart, from - 1).trim();
		if (!prev.startsWith("//")) break;
		from = prevStart;
	}
	const to = src[i] === "\n" ? i + 1 : i;
	return { from, to, body: src.slice(open + 1, i - 1) };
}

/** Index of the `}` closing the first `[data-theme] {` block. */
function themeBlockEnd(src) {
	const open = src.indexOf("{", src.indexOf("[data-theme] {"));
	let i = open + 1;
	for (let depth = 1; depth; i++) {
		if (src[i] === "{") depth++;
		else if (src[i] === "}") depth--;
	}
	return i - 1;
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
		let tail = src.slice(look.from);
		for (const [, key, value] of decls) {
			const re = new RegExp(`^(\\s*${esc(key)}:\\s*)[^;]+;`, "m");
			if (re.test(head)) head = head.replace(re, `$1${value.trim()};`);
			else {
				const end = themeBlockEnd(head);
				head = `${head.slice(0, end)}  ${key}: ${value.trim()};\n${head.slice(end)}`;
			}
		}
		src = head + tail;
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
```

- [ ] **Step 2: Dry-run on one file**

Run: `node scripts/fold-app-look.mjs src/components/core/Button.scss`
Expected: `would fold src/components/core/Button.scss` and `1 file(s) to fold`. No file changes (`git status` is clean).

- [ ] **Step 3: Check the result in a scratch copy**

```bash
cp src/components/core/Button.scss /tmp/Button.before.scss
node scripts/fold-app-look.mjs --write src/components/core/Button.scss
grep -n "app\.\|--q-button-primary-bg:" src/components/core/Button.scss
git checkout -- src/components/core/Button.scss
```

Expected from the grep: exactly one line, `--q-button-primary-bg: var(--q-accent-bg);`, inside the defaults (around line 26). No `app.` matches. The checkout restores the file; the real run is Task 7.

- [ ] **Step 4: Biome-check and commit**

```bash
npx biome check --write scripts/fold-app-look.mjs
git add scripts/fold-app-look.mjs
git commit -m "chore: fold-app-look codemod for the one-look merge"
```

---

### Task 3: Colour, base, and the status theme

**Files:**
- Modify: `src/styles/tokens/_color.scss` (fold its `app.look`, retarget `--q-bg-inverse`)
- Modify: `src/styles/base/_base.scss:25-49` (link rules)
- Delete: `src/styles/themes/_foundry-status.scss`
- Modify: `src/styles/index.scss:20` (drop its load)
- Modify: `src/styles/themes/_foundry.scss:23` (comment no longer points at it)

**Interfaces:**
- Consumes: `scripts/fold-app-look.mjs` (Task 2).
- Produces: defaults for `--q-bg-subtle`, `--q-focus-ring-color` (accent), `--q-selection-bg` (accent-subtle), the status surfaces, and `--q-bg-inverse: var(--q-fg)`.

- [ ] **Step 1: Fold the colour tokens**

Run: `node scripts/fold-app-look.mjs --write src/styles/tokens/_color.scss && grep -n "app\.\|--q-bg-subtle:\|--q-focus-ring-color:" src/styles/tokens/_color.scss`
Expected:
- `--q-bg-subtle: color-mix(in srgb, var(--q-accent) 0.5%, …)` and `--q-focus-ring-color: var(--q-accent)` in the `:root, [data-theme]` block.
- No `app.` lines.
- The `@use "../app";` line at the top is gone.

- [ ] **Step 2: Retarget the near-black inverse**

In `src/styles/tokens/_color.scss`, replace:

```scss
  --q-bg-inverse: var(--q-gray-900);          // strong fills: primary button, selected chip
  --q-bg-inverse-hover: var(--q-gray-800);
```

with:

```scss
  // Strong fills (tooltips, dark strips) in the soft ink, never near-black. Resolved where declared,
  // so a dark theme's inverse is its own light ink.
  --q-bg-inverse: var(--q-fg);
  --q-bg-inverse-hover: color-mix(in srgb, var(--q-fg) 88%, var(--q-bg));
```

- [ ] **Step 3: Delete the marketing status theme**

```bash
git rm src/styles/themes/_foundry-status.scss
```

In `src/styles/index.scss`, delete the line `  @include meta.load-css("themes/foundry-status");`.
In `src/styles/themes/_foundry.scss`, change `// Scoped like _foundry-status.scss, never plain :root, so foundry-dark or a product theme on` to `// Scoped to foundry and an unthemed root, never plain :root, so foundry-dark or a product theme on`.

- [ ] **Step 4: Make the prose-link rule the only link rule**

In `src/styles/base/_base.scss`, delete the `:where([data-quiet] a:hover) { color: var(--q-accent); }` rule. Replace the whole `@scope ([data-density="app"], …) to (…) { … }` block with the same two rules unwrapped and scoped to quiet:

```scss
// A bare link (prose, rendered markdown: no class of its own) reads as a link: accent text on a
// soft accent underline that fills in on hover. Classed anchors keep their component's look.
:where([data-quiet] a:not([class])) {
  color: var(--q-accent-fg);
  text-decoration: underline;
  text-decoration-color: var(--q-accent-border);
  text-decoration-thickness: var(--q-hairline);
  text-underline-offset: 0.2em;
  transition: text-decoration-color var(--q-dur-hover) var(--q-ease-linear);
}

:where([data-quiet] a:not([class]):hover) {
  color: var(--q-accent-fg);
  text-decoration-color: currentcolor;
}
```

- [ ] **Step 5: Verify the links (review focus 5) and the gates**

Run: `npm run gen && npm run build && npm run lint 2>&1 | tail -5`
Expected: build ok. Lint may still fail only in `check-app-look` or `check-one-look` for component files, which is fine until Task 7. There must be no stylelint or check-tokens errors.
In Storybook (`npm run dev -- --ci --no-open`; check the port it prints), open Patterns/Agentworks (PageHeader meta links) in foundry. The links are accent with a soft underline. Open any story with no `density` parameter (e.g. Theming): any bare link renders the same way.

- [ ] **Step 6: Commit**

```bash
git add -A src/styles
git commit -m "feat(tokens): colour defaults are the one look; drop the marketing status theme"
```

---

### Task 4: Typography and space, one scale plus a compact density

**Files:**
- Modify: `src/styles/tokens/_typography.scss:45-140`
- Modify: `src/styles/tokens/_space.scss:27-70`

**Interfaces:**
- Produces: `:root, [data-theme]` type roles at today's app values (Geist, app sizes and weights, sans sentence-case labels). Spacing defaults at today's app values. `[data-density="compact"]` keeps only its spacing overrides.

- [ ] **Step 1: Typography**

In `_typography.scss`:
- Delete the whole `:root,\n[data-density="marketing"] { … }` block.
- Rename the selector of the `[data-density="app"],\n[data-density="compact"] { … }` block to `:root,\n[data-theme]`.

The app block already declares every role the marketing block did:
- `--q-text-2xs…3xl`
- weights, `--q-font-sans`, `--q-font-mono`
- `--q-text-heading-1…4`, `--q-text-metric`, `--q-text-intro`, `--q-weight-heading`
- `--q-tracking-h2…h4`, `--q-period-display`
- the label roles and the hint roles

Nothing needs merging. Confirm with `grep -c "^\s*--q-" src/styles/tokens/_typography.scss`: the count drops by exactly the length of the deleted block.

In the top `:root { … }` block, set `--q-font-sans` and `--q-font-mono` to the Geist stacks:

```scss
  --q-font-sans: "Geist", -apple-system, "Helvetica Neue", arial, sans-serif;
  --q-font-mono: "Geist Mono", ui-monospace, "SF Mono", menlo, monospace;
```

Update the block comment above the roles to: `// Type roles: one scale for product screens (Geist, sentence-case sans labels and hints).`

- [ ] **Step 2: Space**

In `_space.scss`:
- Rename `:root,\n[data-density="marketing"]` to `:root,\n[data-theme]`.
- Set its values to the app ones:

```scss
  --q-space-inline: var(--q-space-1);
  --q-space-stack: var(--q-space-2);
  --q-space-field: var(--q-space-3);
  --q-space-card-pad: var(--q-space-3);
  --q-space-card-gap: var(--q-space-3);
  --q-space-block: var(--q-space-4);
  --q-space-section: var(--q-space-6);
  --q-space-hero-top: var(--q-space-2);
  --q-space-hero-bottom: var(--q-space-2);
  --q-space-page-x: var(--q-space-4);
  --q-grid-gutter: var(--q-space-3);
  --q-font-body: var(--q-weight-regular) var(--q-text-md) / 22px var(--q-font-sans);
```

Delete the `[data-density="app"] { … }` block. Keep `[data-density="compact"] { … }` unchanged. Change the comment to `// Spacing by job. data-density="compact" tightens it for dense tools.`

- [ ] **Step 3: Base font size**

In `src/styles/base/_base.scss`, the root type rule uses `font-size: var(--q-text-lg);`. Change it to `font-size: var(--q-text-md);` (body text is md in the one look).

- [ ] **Step 4: Verify compact still tightens (review focus 4) and the gates**

Run: `npm run gen && npm run build`
Expected: ok.
In Storybook, open Patterns/Dashboard. Then in the browser console, run `document.querySelector('[data-density]').dataset.density = 'compact'`. Card padding visibly shrinks, and the text stays Geist at the same size (not Inter Tight, not 17px).

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens src/styles/base src/styles/tokens.generated.*
git commit -m "feat(tokens): one type scale and spacing; density is spacing only"
```

---

### Task 5: Dense sizes and the float shadow

**Files:**
- Modify: `src/styles/tokens/_size.scss:3-10,27`
- Modify: `src/styles/tokens/_elevation.scss` (add `--q-shadow-float`)
- Modify: `src/styles/themes/_foundry-dark.scss` (dark `--q-shadow-float`)
- Modify: `src/components/app/TopBar.scss:10` (read `--q-h-topbar`)

**Interfaces:**
- Produces:
  - `--q-control-md: 32px`, `--q-control-lg: 36px`
  - `--q-field-sm: 32px`, `--q-field-md: 36px`, `--q-field-lg: 40px`
  - `--q-h-topbar: 44px`
  - `--q-shadow-float` (light and dark), used by the overlay sweep in the next plan

- [ ] **Step 1: Sizes**

In `_size.scss`, set:

```scss
  --q-control-sm: 32px;
  --q-control-md: 32px; // dense: one control height; md differs from sm by padding and type
  --q-control-lg: 36px;
  --q-field-sm: 32px;
  --q-field-md: 36px;
  --q-field-lg: 40px;
```

and `--q-h-topbar: 44px;`.

- [ ] **Step 2: TopBar reads the tier-2 height**

In `src/components/app/TopBar.scss`, replace `--q-top-bar-height: 44px; // the app look's slim bar; the reference's --q-h-topbar is 64` with `--q-top-bar-height: var(--q-h-topbar);`.

- [ ] **Step 3: Float shadow**

In `_elevation.scss`, after `--q-shadow-3`, add:

```scss
  // Floating layers (menus, popovers, dialogs, toasts, the palette): shadow only, no edge.
  --q-shadow-float: 0 4px 12px rgb(var(--q-shadow-rgb) / 6%), 0 16px 40px rgb(var(--q-shadow-rgb) / 12%);
```

In `_foundry-dark.scss`, next to the other shadows, add:

```scss
  --q-shadow-float: 0 0 0 1px rgb(255 255 255 / 4%), 0 16px 40px rgb(0 0 0 / 55%);
```

(On dark, a 4% white rim stands in for the shadow that doesn't show; it is not a border token.)

- [ ] **Step 4: Gates and a look**

Run: `npm run gen && npm run lint 2>&1 | grep -v app-look | tail -3 && npm run build`
Expected: stylelint and check-tokens ok; build ok.
In Storybook, open Patterns/Settings. Inputs and buttons are visibly shorter (36 and 32), and labels are not clipped.

- [ ] **Step 5: Commit**

```bash
git add src/styles src/components/app/TopBar.scss
git commit -m "feat(tokens): dense control and field sizes, 44px top bar, float shadow"
```

---

### Task 6: Density API with deprecated aliases

**Files:**
- Modify: `src/QuietRoot.tsx:11,23,41`
- Modify: `.storybook/preview.tsx:6-10` (comment only)

**Interfaces:**
- Produces: `QuietRootProps["density"]` is `"comfortable" | "compact" | "app" | "marketing"`, where the last two are `@deprecated`. The DOM gets `data-density="comfortable" | "compact"`.

- [ ] **Step 1: Read the current component**

Run: `sed -n 1,60p src/QuietRoot.tsx`

- [ ] **Step 2: Change the prop**

Replace the `density` prop type and default:

```tsx
	/** Spacing density. `comfortable` (default) for most screens, `compact` for dense tools.
	 *  @deprecated `"app"` and `"marketing"`: quiet has one look; both mean `"comfortable"`. */
	density?: "comfortable" | "compact" | "app" | "marketing";
```

```tsx
	density = "comfortable",
```

Before the return, normalise it and warn in development:

```tsx
	const dense = density === "compact" ? "compact" : "comfortable";
	if (isDev() && (density === "app" || density === "marketing"))
		console.warn(`quiet: density="${density}" is deprecated (one look); use "comfortable" or "compact".`);
```

Render `data-density={dense}` instead of `data-density={density}`. Import `isDev` from `./lib/env` if it isn't imported already.

- [ ] **Step 3: Storybook comment**

In `.storybook/preview.tsx`, change line 6 to `// Stories may set parameters.density ("compact"); the old "app" value is a deprecated alias.`

- [ ] **Step 4: Verify the aliases (review focus 3)**

Run: `npm run typecheck`
Expected: passes (stories still pass `density: "app"`, which is in the union).
In Storybook, open Patterns/Billing (it sets `density: "app"`). Inspect the root: it has `data-density="comfortable"`, and the browser console shows the deprecation warning once.

- [ ] **Step 5: Commit**

```bash
git add src/QuietRoot.tsx .storybook/preview.tsx
git commit -m "feat(QuietRoot): density is comfortable|compact; app/marketing deprecated"
```

---

### Task 7: Fold every component stylesheet

**Files:**
- Modify: the 34 component stylesheets listed by `grep -rln "app\.\(look\|reset\|rules\)" src/components`
- Hand-review: the six `app.rules` files: `core/Link.scss`, `forms/Select.scss`, `forms/Stepper.scss`, `forms/MultiSelect.scss`, `forms/FileUpload.scss`, `forms/DatePicker.scss`

**Interfaces:**
- Consumes: `scripts/fold-app-look.mjs` (Task 2).

- [ ] **Step 1: Dry run**

Run: `node scripts/fold-app-look.mjs`
Expected: `would fold …` for each listed component file, and `34 file(s) to fold` (±1 if `_color.scss` was already folded in Task 3; it reports 0 changes for that file).

- [ ] **Step 2: Fold**

Run: `node scripts/fold-app-look.mjs --write && node scripts/check-one-look.mjs; echo exit=$?`
Expected: the check lists only `src/styles/_app.scss: should be deleted (one look)`, then `exit=1`.

- [ ] **Step 3: Hand-review the unwrapped rules**

For each of the six `app.rules` files, open the diff (`git diff src/components/forms/Select.scss`, etc.) and check two things:
- The unwrapped rules come after the rules they override in the same `@layer q.components`, since source order now decides.
- Nothing in them still refers to "the app look".

Fix comments that say "app look" to describe the rule itself. For `forms/Select.scss`: the CSS chevron rule and the `font-size: 0` on the glyph span now always apply. Confirm in Storybook (Catalog → Forms → Select) that exactly one chevron shows.

- [ ] **Step 4: Stylelint and the gates**

Run: `npx stylelint "src/**/*.scss" && npm run gen && npm run typecheck && npm run build`
Expected: all ok. If stylelint flags a `--q-*` declared twice in one block (the codemod appended a key that also had a default further down), delete the later duplicate by hand.

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "refactor: fold every component's app look into its defaults"
```

---

### Task 8: Remove the plumbing, wire the test into lint, update AGENTS.md

**Files:**
- Delete: `src/styles/_app.scss`, `scripts/check-app-look.mjs`, `scripts/fold-app-look.mjs` (one-off)
- Modify: `package.json:47` (lint script)
- Modify: `AGENTS.md` ("The app look" section and the lint bullet that names check-app-look)

- [ ] **Step 1: Delete**

```bash
git rm src/styles/_app.scss scripts/check-app-look.mjs scripts/fold-app-look.mjs
```

- [ ] **Step 2: Lint script**

In `package.json`, replace `&& node scripts/check-app-look.mjs` with `&& node scripts/check-one-look.mjs`.

- [ ] **Step 3: Run the test, which now passes**

Run: `node scripts/check-one-look.mjs`
Expected: `one look ok: <N> stylesheets`, exit 0.

- [ ] **Step 4: AGENTS.md**

Replace the whole `## The app look` section with:

```markdown
## One look

quiet has a single look (docs/plans/2026-10-12-one-look.md): soft ink, the lava accent (fills
`--q-accent-bg`, text `--q-accent-fg`, raw `--q-accent` for marks only), grounds instead of rules,
Geist with sentence-case sans labels, dense pill controls, panes over drawers.
`data-density` is spacing only: `comfortable` (default) or `compact`; `app`/`marketing` are
deprecated aliases. `scripts/check-one-look.mjs` (in `npm run lint`) fails on any return of the
old two-look plumbing.
```

In the "Harness" and "Styling conventions" sections, delete any sentence mentioning `check-app-look`, `app.look`, `app.reset` or `app.rules`. Run `grep -n "app\.look\|app\.reset\|check-app-look\|marketing" AGENTS.md` and resolve every hit. Parity sentences elsewhere stay until the docs plan.

- [ ] **Step 5: Full gate and commit**

Run: `npm run lint && npm run typecheck && npm run build`
Expected: all green, and lint prints `one look ok`.

```bash
git add -A package.json AGENTS.md src/styles scripts
git commit -m "chore: remove the two-look plumbing; check-one-look in lint"
```

---

### Task 9: Visual verification

**Files:** none (read-only review). Fix-ups go into a follow-up commit.

- [ ] **Step 1: The reviewer agent**

Dispatch the `visual-reviewer` agent over Patterns/* and App/* in foundry and foundry-dark at 1280 and 390. Ask it to flag:
- near-black text
- mono caps outside code, IDs and kbd
- clipped controls at the new heights
- any rule grouping content other than table rows

- [ ] **Step 2: Dark-theme spot check (review focus 2)**

In Storybook with theme foundry-dark, open Patterns/Dashboard and App/AppShell. Confirm three things:
- Headings are light, not grey-on-black.
- The primary button is the lifted orange with a readable label.
- Any tooltip (hover the bell, or a truncated label) is light-on-dark-readable. `--q-bg-inverse` is now `--q-fg`, which is light in dark mode, and the tooltip text must invert.

If tooltip text is unreadable, set `--q-tooltip-fg` to `var(--q-bg)` in `feedback/Tooltip.scss`.

- [ ] **Step 3: Nested theme (review focus 1)**

Open Theming (or any story with a nested `QuietRoot theme="foundry-dark"`). The nested dark area resolves its own ink, panel ground and accent, not the light page's.

- [ ] **Step 4: Commit fixes**

```bash
git add -A src
git commit -m "fix: one-look visual fixes from review"
```

(Skip if there is nothing to fix.)
