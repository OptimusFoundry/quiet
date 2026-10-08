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
node ../quiet/scripts/quiet.mjs sync          # copies quiet into vendor/quiet (replaces it)
git add vendor/quiet && git commit -m "chore: quiet 0.4.0"
```

`sync` copies `src/` (without stories), the Stylelint config, `quiet-audit`, the guidelines and the
agent skill. It writes `vendor/quiet/package.json`, whose exports point at that source, and
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

## Coexisting with another design system

`quiet.css` can load on a page that also runs another design system (for example Proto, which
owns `<html data-theme>` and ships unlayered CSS). quiet styles only what it owns:

- **Ownership is `[data-quiet]`.** `QuietRoot` renders `data-quiet` on its wrapper (alongside the
  `quiet` class); `ThemeProvider` / `applyTheme` set it on `<html>`. quiet's element defaults
  (body type, `a` colour, `::selection`, the themed-subtree background, the keyboard focus ring)
  and the reference-compat names (`--space-*`, `--radius-*`, `--ease-*`, `--paper` …) apply only
  inside `[data-quiet]`. Elements outside it, and another system's `[data-theme]`, are untouched.
  quiet's own `--q-*` tokens are still declared at `:root`; they are namespaced, so they can't
  collide.
- **One owner of `<html data-theme>`.** While another system themes `<html>`, don't mount quiet's
  `ThemeProvider`: render each quiet surface in a `QuietRoot`, which sets `data-theme` on its own
  wrapper. Mount `ThemeProvider` only once quiet owns the whole document.
- **Cascade layers.** quiet's rules live in `q.tokens, q.themes, q.base, q.components,
  q.utilities`. Unlayered CSS beats every layer, so put the other system's global CSS (reset,
  tokens) in a layer declared before quiet's, and declare the order before either stylesheet:

```scss
@layer proto, q.tokens, q.themes, q.base, q.components, q.utilities;
@layer proto { /* the other system's reset, tokens and themes */ }
@import "@optimusfoundry/quiet/style.css";
```

`tests/coexistence.spec.ts` checks this against the built `dist/quiet.css`.

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

quiet's app-facing Claude assets live in [`claude/`](claude/). `quiet sync` puts them where Claude Code
reads them, and overwrites them on every sync like the rest of the copy:

| From | To | What it does |
|---|---|---|
| `claude/skills/quiet-app` | `.claude/skills/quiet-app` | how to set up, lay out and check a screen on quiet |
| `claude/agents/qa/quiet-screen-reviewer.md` | `.claude/agents/qa/` | measures a running screen with `quiet-audit`, screenshots both themes, judges it against the checklist |
| `claude/hooks/quiet-guard.mjs` | registered in `.claude/settings.json` | **blocks** any edit inside `vendor/quiet`, and lints each changed app stylesheet with quiet's rules |

In a monorepo (the app in `webapp/`, `.claude/` at the repo root), they go to the project root: the
nearest folder from the app up to the git root that has a `.claude/`, or `--claude-root <dir>`.
Agents keep their department folder (`qa/`); Claude Code finds agents recursively by `name`. For
accessibility, the app's own a11y agents and rules cover what the app owns; point them at
`docs/guidelines/accessibility.md` ("What the app must do"). If the project routes skills by path
(`.claude/rules/*.md`), add `quiet-app` there for UI work; sync doesn't edit rules or routing.

Sync only adds or replaces quiet's own entries. The app's other skills, agents, hooks and settings are
left alone, and a file quiet stops shipping is removed on the next sync. `quiet check` also fails if a
placed file was edited or the hook was unregistered.

Installed as a package instead? Copy `node_modules/@optimusfoundry/quiet/claude/skills/quiet-app`
into `.claude/skills/` yourself.

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
2. Add an entry for the version at the top of [CHANGELOG.md](CHANGELOG.md).
3. Merge to `main`, then tag the merge commit and push the tag:

   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```

Consumers move to the new version by changing the `#vX.Y.Z` in their dependency. Nothing is
published; the tag is the release. Never move a pushed tag; cut a new patch version instead.

Contributor rules (what's copied vs quiet's own, BEM and tokens, the a11y layer, tests) are in
[AGENTS.md](AGENTS.md). Claude Code skills and agents for building components live in `.claude/`.
