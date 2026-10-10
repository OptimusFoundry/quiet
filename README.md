# quiet

The Optimus Foundry "Soft" design system from Claude Design, as a React package. The base is a **1:1
copy**: 68 components, the tokens and the master catalog page, byte-for-byte from the Claude Design project.
quiet adds an accessibility and motion layer, 3-tier `--q-*` tokens with themes (`foundry`,
`foundry-dark`, one per product) and BEM styles, plus its own component groups:

- **future**: agent, trust, data and evolved-input components (AgentRun, Approval, HoldButton,
  DraftDiff, IntentBar, ScopeGrant, Checkpoints, Receipt, StreamingTable, …)
- **charts**: Sparkline, LineChart, BarChart, DonutChart, NarratedChart (hand-rolled SVG)
- **chat**: ChatThread, ChatMessage, ChatComposer, Attachment, ToolCall, CodeBlock, PromptSuggestions

See [DESIGN.md](DESIGN.md) and [AGENTS.md](AGENTS.md).

## Install

quiet is **vendored**: its source is copied into each app, and an update overwrites the copy. The
copy is read-only. A fix goes into this repo, and every app picks it up on its next sync.

```bash
# in the app, with this repo checked out next to it
git -C ../quiet fetch --tags
node ../quiet/scripts/quiet.mjs sync --ref v0.7.0   # copies quiet at that tag into vendor/quiet (replaces it)
git add vendor/quiet && git commit -m "chore: quiet 0.7.0"
```

`sync` reads quiet as committed at `--ref` (a tag, branch or commit; default `HEAD`), never the
working tree, so uncommitted edits in your quiet checkout can't reach an app; it warns when the
commit isn't on `origin/main`. It copies `src/` (without stories), the Stylelint config, `quiet-audit` and the guidelines, and
places the Claude Code plugin. It writes `vendor/quiet/package.json`, whose exports point at that source, and
`quiet.manifest.json` with a hash per file. Setup on the first sync (it prints this too):

| | |
|---|---|
| `package.json` | `"@optimusfoundry/quiet": "file:./vendor/quiet"`, then `npm install`. Imports stay `@optimusfoundry/quiet`, with no path aliases |
| devDependencies | `sass-embedded`, `typescript` ≥ 5.8, `react` ≥ 19.2; for CSS lint `stylelint` and `stylelint-declaration-strict-value` |
| Stylelint | `extends: ["@optimusfoundry/quiet/stylelint/config"]`, `ignoreFiles: ["vendor/quiet/**"]` (see "Styling your own pages") |
| Biome / ESLint | ignore `vendor/quiet/**` (quiet's own checks already passed) |
| CI | `npx quiet check` fails if a vendored file was edited, added or removed since the sync |
| Claude Code | automatic: see "Claude Code in product repos" |

The app compiles quiet's source with its own bundler, so it ships the CSS for only the components it
uses.

Prefer a normal dependency? quiet still builds as a package (`npm run build` → `dist/`), so
`npm install "git+https://github.com/OptimusFoundry/quiet.git#vX.Y.Z"` works too. The imports are the same.

## Use

```tsx
import { QuietRoot, Button, PageHero } from "@optimusfoundry/quiet";
import "@optimusfoundry/quiet/style.css";
import "@optimusfoundry/quiet/fonts.css";

<QuietRoot theme="foundry" density="app">
	<PageHero size="md" eyebrow="Workspace" title="Builds" actions={<Button size="sm">New build</Button>} />
</QuietRoot>;
```

| Import | What it loads |
|---|---|
| `@optimusfoundry/quiet/style.css` | Tokens, themes, base and component styles. No fonts |
| `@optimusfoundry/quiet/fonts.css` | The brand fonts, Inter Tight and JetBrains Mono, from Google Fonts |

Import `fonts.css` when you use the `foundry` themes. A product whose theme sets other fonts
(`--q-font-sans`, `--q-font-mono`) skips it and loads its own.

## Router links

Components that render an `<a>` from `href` (Link, ArrowLink, Button, Card, StatCard, List,
Breadcrumb, NavBar, Sidebar) use the `linkComponent` set on `QuietRoot` (or `ThemeProvider`). It
receives `href` plus the usual anchor props (`className`, `onClick`, `aria-*`, `children`, `ref`).
Links a router can't handle stay plain `<a>`: `external` links, absolute URLs (`https:`,
`mailto:`, `//host`) and in-page `#hash` links. With no `linkComponent`, every link is a plain `<a>`.

```tsx
import { Link } from "@tanstack/react-router";
import { type LinkComponent, QuietRoot } from "@optimusfoundry/quiet";

const RouterLink: LinkComponent = ({ href, ...p }) => <Link to={href} {...p} />;

<QuietRoot linkComponent={RouterLink}>…</QuietRoot>;
```

`useLinkComponent()` returns the configured link (or `"a"`) for your own href-rendering components.

## Where quiet's styles apply

quiet's element defaults apply only inside `[data-quiet]`: a modern reset (`src/styles/base/_reset.scss`:
no default margins, unstyled lists, block media, balanced headings, border-box for the app's own
classed elements while quiet's components keep the reference's box), body type, `a` colour, `::selection`, the themed background, the keyboard focus ring, and the reference-compat names (`--space-*`, `--radius-*`, …). `ThemeProvider` / `applyTheme` set `data-quiet` on `<html>`, and `QuietRoot` sets it on its wrapper. Use one of them; a page with neither gets no base styles.

quiet's own `--q-*` tokens are declared at `:root`. Its rules live in the cascade layers `q.tokens, q.themes, q.base, q.components, q.utilities`, so any unlayered CSS in your app overrides them. `tests/coexistence.spec.ts` checks that nothing outside `[data-quiet]` changes.

## Your product's theme

Themes are open: define yours in your own repo, register it at startup, and style it in
`@layer q.themes`.

```tsx
import { defineThemes, ThemeProvider } from "@optimusfoundry/quiet";
import "@optimusfoundry/quiet/style.css";
import "./theme/quiet-acme.scss"; // @layer q.themes { [data-theme="acme"] { --q-gray-0: …; } }

defineThemes({ acme: { label: "Acme", colorScheme: "light" } });

<ThemeProvider defaultValue="acme">…</ThemeProvider>;
```

An unregistered name falls back to `foundry` and warns once in development. Semantic status
colour (`--q-status-{info,success,warning,error}-{fg,bg,border}`) is part of the theme. See
[DESIGN.md](DESIGN.md#product-themes) for which tokens a theme must and may set, and the
caveats for reduced motion, density and fonts.

## Building apps

The guidelines explain how to put the components together into product screens that look like one product:
[docs/guidelines/](docs/guidelines/README.md), starting from the ten rules in its README.

| | |
|---|---|
| [layouts](docs/guidelines/layouts.md) | the app shell and ten page layouts: dimensions, rules, what collapses |
| [sections](docs/guidelines/sections.md) | containers, nesting, section headings, order |
| [grid](docs/guidelines/grid.md) | fixed panes vs the 12-column grid, allowed splits |
| [spacing](docs/guidelines/spacing.md) | what goes between what, per density |
| [typography](docs/guidelines/typography.md) | the eight type roles and the prop that renders each |
| [components](docs/guidelines/components.md) | choosing between similar components; feedback, destructive, states, agents |
| [foundations](docs/guidelines/foundations.md) | colour, status, shape, motion |
| [content](docs/guidelines/content.md) | voice, banned words, labels, numbers and dates |
| [accessibility](docs/guidelines/accessibility.md) | what quiet guarantees, what the app must do |
| [checklist](docs/guidelines/checklist.md) | the review before shipping |

Reference screens are in Storybook under **Patterns**; measured specimens under **Guidelines**.

### Styling your own pages

Lay pages out with quiet's components (`PageShell`, `PageHero`, `Container`, `Stack`, `Grid`, `Card` …)
and style anything of your own with quiet's tokens, never raw values. The tokens are CSS custom
properties defined by `style.css`, so any styling approach works:

```css
/* CSS, SCSS or a CSS module */
.billing-summary {
  display: grid;
  gap: var(--q-space-stack);
  padding: var(--q-space-card-pad);
  border: var(--q-hairline) solid var(--q-border);
  color: var(--q-fg-body);
}
```

```tsx
// TS, when a value has to be computed: names are typed, so a typo or a renamed token is a type error
import { cssVar, type TokenName } from "@optimusfoundry/quiet";

const gap: TokenName = dense ? "--q-space-inline" : "--q-space-stack";
<div style={{ gap: cssVar(gap) }} />;
```

Check your stylesheets against the tokens your installed quiet declares:

```js
// stylelint.config.mjs (devDependencies: stylelint >= 16, stylelint-declaration-strict-value)
export default {
  extends: ["@optimusfoundry/quiet/stylelint/config"],
  ignoreFiles: ["vendor/quiet/**"],
};
```

The config applies quiet's own rules to your stylesheets: no raw colour, space, radius, type,
duration or z-index (tokens only); your custom properties are `--app-*`, locals `--_*`; and
`quiet/known-tokens`. To use only the token rule, use
`plugins: ["@optimusfoundry/quiet/stylelint"], rules: { "quiet/known-tokens": true }`.

`quiet/known-tokens` reports any `var(--q-…)` quiet doesn't declare (a typo, or a token renamed in a
newer quiet) and any `--q-*` your app invents: `--q-` is quiet's namespace, so name your own
`--app-*`. A product theme may still set quiet's tokens (`--q-accent`, the palette, `--q-status-*`).
After building, `npx quiet-audit` measures the running page for off-token values.

### Claude Code in product repos

quiet's app-facing Claude assets are a Claude Code plugin, [`claude/`](claude/). `quiet sync` places it
at `.claude/skills/quiet/` in the project root, where Claude Code loads it as a skills-directory
plugin: nothing goes in `settings.json`, and it loads in place, so a pulled sync takes effect at the
next session. It loads once the workspace is trusted, in sessions started at the project root.

| Part | Name in Claude Code | What it does |
|---|---|---|
| `skills/quiet-app` | `quiet:quiet-app` | how to set up, lay out and check a screen on quiet |
| `agents/quiet-screen-reviewer.md` | `quiet:quiet-screen-reviewer` | measures a running screen with `quiet-audit`, screenshots both themes, judges it against the checklist |
| `hooks/` (`quiet-guard.mjs`) | | **blocks** any edit inside the vendored copy or the plugin, and lints each changed app stylesheet with the app's Stylelint |

An app's own agents preload the skill as `skills: [quiet-app]`; the bare name resolves to the
plugin's skill. In a monorepo (the app in `webapp/`, `.claude/` at the repo root) the plugin goes to
the project root: the nearest folder from the app up to the git root that has a `.claude/`, or
`--claude-root <dir>`. For accessibility, the app's own a11y agents and rules cover what the app
owns; point them at `docs/guidelines/accessibility.md` ("What the app must do"). If the project
routes skills by path (`.claude/rules/*.md`), add `quiet-app` there for UI work; sync doesn't edit
rules or routing.

Sync replaces `.claude/skills/quiet/` and nothing else in `.claude/`, apart from removing what an
older sync placed (`.claude/skills/quiet-app`, `.claude/agents/qa/quiet-screen-reviewer.md`). Syncs
before the plugin registered `quiet-guard` in `settings.json`; sync warns and `quiet check` fails
until those entries are removed. `quiet check` also fails if a plugin file was edited.

Installed as a package instead? Copy `node_modules/@optimusfoundry/quiet/claude` to
`.claude/skills/quiet` yourself.

## Develop

```bash
npm run dev        # Storybook on :6020: Catalog, Future, Charts, Chat, Patterns
npm run gen        # regenerate src/index.ts + the catalog from docs/reference/optimus-design
npm run lint       # Biome + Stylelint (copied files are excluded)
npm run typecheck
npm run build
npm run check:package  # what a git-tag install ships: exports, layer order, fonts, .d.ts
npm run test       # pixel and hover parity with the reference, axe in both themes, keyboard specs
```

## Release

1. Bump `version` in `package.json` (semver) and run `npm install --package-lock-only` so the
   lockfile matches.
2. Turn the CHANGELOG's changes into an entry for the version at the top of
   [CHANGELOG.md](CHANGELOG.md), with "Upgrading" notes for anything an app must change.
3. Merge to `main`, then tag the merge commit and push the tag:

   ```bash
   git tag v0.4.0
   git push origin v0.4.0
   ```

Apps move to a version by syncing from that tag: `node ../quiet/scripts/quiet.mjs sync --ref v0.4.0`
in the app (no checkout needed; `git -C ../quiet fetch --tags` first). The manifest records the
version, the ref and the exact commit. (Apps that install the package instead change the
`#vX.Y.Z` in their dependency.) Nothing is published; the tag is the release. Never move a pushed
tag; cut a new patch version instead.

Contributor rules (what's copied vs quiet's own, BEM and tokens, the a11y layer, tests) are in
[AGENTS.md](AGENTS.md). Claude Code skills and agents for building components live in `.claude/`.
