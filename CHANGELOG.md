# Changelog

quiet follows [semver](https://semver.org). Releases are git tags `vX.Y.Z`; nothing is published to a registry.

## 0.7.0

### Added

- **A modern reset** (`src/styles/base/_reset.scss`, in `q.base`, scoped to `[data-quiet]`, all
  `:where()`). It replaces the reset every app copied into its own `index.css`:
  - no default margins;
  - unstyled lists;
  - block, fluid media (`img`, `picture`, `video`, `canvas`, `svg`);
  - `overflow-wrap: break-word`, `text-wrap: balance` on headings and `pretty` on text;
  - `border-collapse` on tables, a bare `dialog`, and pointer cursors on buttons, `summary`,
    `label[for]` and `select`;
  - `scroll-margin` on `:target`;
  - on an `<html data-quiet>` document: `text-size-adjust: none`, `interpolate-size: allow-keywords`
    (motion allowed only) and a full-height body.

  `border-box` sizing and font/colour inheritance on form controls reach only the app's own classed
  elements. quiet's components (any `q-*` class) keep the reference's content-box and control type,
  so the catalog stays pixel-identical. The apps' old global `border-box` had been shrinking quiet
  components: icons in Alert, Banner, StatCard, EmptyState and FileUpload by 2px, Skeleton by 46px,
  Accordion content by 36px, the DataGrid search by 26px, plus Table cells and FormHint glyphs.
- **`quiet sync --ref <tag|branch|commit>`** (default `HEAD`). sync reads quiet as committed at that
  ref with `git archive`, never the working tree, so uncommitted edits in a quiet checkout can't
  reach an app. The manifest records `ref` and the exact `commit` (`dirty` is gone). sync warns
  when the commit isn't on `origin/main`, and refuses refs from before the 0.6.0 plugin layout.

## 0.6.0

### Changed

- **quiet's Claude assets ship as a plugin.** `claude/` is now a Claude Code plugin (skill
  `quiet:quiet-app`, agent `quiet:quiet-screen-reviewer`, the `quiet-guard` hooks in
  `hooks/hooks.json`). `quiet sync` places it at `.claude/skills/quiet/` in the project root, where
  Claude Code loads it as a skills-directory plugin, instead of copying files into `.claude/skills/`
  and `.claude/agents/qa/` and editing `settings.json`. It no longer goes into `vendor/quiet` either.
  An app's agents still preload `skills: [quiet-app]`. The guard finds the vendored copy by its
  `quiet.manifest.json`, and also blocks edits to the plugin. Upgrading: sync removes the old
  skill and agent; remove the `quiet-guard` entries from `.claude/settings.json` (sync warns, `quiet
  check` fails until you do).
- `quiet check` hashes dotfiles too (the plugin's `.claude-plugin/plugin.json`).

### Fixed

- The `quiet-app` skill points at `src/components/…` for props in a vendored copy, which has no `dist/`.
- The Stylelint custom-property message printed the name with four dashes (`----name`).

## 0.5.0

### Added

- **Product type scale under `density="app"` and `"compact"`.** Headings, metrics, labels and the
  molten period now read tier-2 role tokens (`--q-text-heading-1…4`, `--q-text-metric`,
  `--q-text-intro`, `--q-weight-heading`, `--q-font-label`, `--q-text-label`, `--q-weight-label`,
  `--q-tracking-label`, `--q-case-label`, `--q-period-display`, `--q-space-hero-top/bottom`). Their
  defaults are the reference's values, so the marketing density and the parity catalog are
  unchanged. App density retunes them: PageHero md title 19/600 with no period, SectionHeader sm
  and Card titles 15/600, StatCard values 24/600, and labels (Label, field labels, table heads,
  tabs, breadcrumbs, sidebar groups, Eyebrow, Card/Stat/StatCard/List/EmptyState/Dialog/Drawer
  labels) in 12/500 sans sentence case instead of 11 mono caps; form hints (`--q-font-hint`,
  `--q-text-hint`, `--q-tracking-hint`, `--q-hint-leading`) in 12 sans instead of 11 mono. Tag, StatusDot and `Text mono`
  stay mono. `Text heading` sizes through the same roles when no `size` is passed. Pattern stories
  now set density on the themed root (`parameters.density`), as an app does.

## 0.4.3

### Fixed

- **Cascade-layer order in code-split production builds.** Apps compile quiet's source, so each
  component's `.tsx` imports its own `.scss`. A code-split `vite build` puts the components that
  routes share into their own CSS chunks (`Button-*.css`, `Stack-*.css` …) and links them before
  the entry CSS. Those chunks named `q.tokens` and then `q.components` first. Layers rank by
  first appearance, so the order became `q.tokens, q.components, q.themes, q.base, q.utilities`,
  and base and theme rules beat component rules. A primary link Button, for one, took the base
  `a` colour (`--q-fg`) and rendered its text in the background colour. Dev mode never showed
  it. Every component stylesheet now opens with the full order statement from a new
  `src/styles/_layers.scss` (`@use "../../styles/layers";`), and so does `index.scss`, so the order
  holds whichever quiet stylesheet loads first. A repeated statement never reorders, and
  lightningcss keeps its order when it minifies. Apps can drop the inline
  `<style>@layer q.tokens, q.themes, q.base, q.components, q.utilities;</style>` workaround from
  `index.html`.

### Added

- `scripts/check-layers.mjs` (in `npm run lint`) compiles `index.scss` and every component
  stylesheet and fails if one doesn't open with the order statement. `npm run new` scaffolds
  the `@use`.
- `tests/layer-order-build.spec.ts` builds a minified, code-split fixture app with Vite. It checks
  that every CSS chunk names the layers in order, and that a primary link Button inside
  `[data-quiet]` keeps `--q-button-primary-fg` as its text colour.

### Changed

- The README no longer documents running quiet next to another design system. Its `@import`
  recipe was wrong: Sass hoists `@import` above the `@layer` statement. A short note on where
  quiet's styles apply (`[data-quiet]`, the cascade layers) replaces the section.

## 0.4.2

### Fixed

- **Table / DataGrid / StreamingTable:** a sr-only header no longer escapes the horizontal scroll
  container. A column whose header is a visually hidden label (`<span className="q-sr-only">`,
  e.g. an "Actions" column) is `position: absolute`. `.q-table` scrolls with `overflow-x: auto`
  but is `position: static`, so it isn't that label's containing block. The label sat at its
  column's x outside the scroll box and widened the page: at a 390px viewport the whole page
  scrolled sideways by 650–900px. A `.q-sr-only` inside `.q-table` is now pinned to the inline
  start (`inset-inline-start: 0`), so it can't land past the viewport. `.q-table` stays static:
  making it `position: relative` changes how the table is rasterized and breaks pixel parity
  with the reference. Apps can drop the `position: relative` className workaround if their
  hidden labels use `.q-sr-only`.
- **Focus trap (Sidebar drawer, Drawer, Dialog):** focus now returns to the trigger after a
  fast first click on the scrim. Under load, that click could land after the modal was committed
  but before its effects ran, so the trap saved `<body>` as the element to restore.
  `useFocusTrap` and `useModalBackground` (and Dialog's copy) now run as layout effects, so the
  trap and `inert` are in place before the browser can paint or dispatch input.
- **`quiet sync`** edits only the `hooks` in an app's `.claude/settings.json` and leaves the rest
  byte-for-byte. It used to re-serialize the whole file, reflowing unrelated lines on every
  sync. If the spliced result doesn't parse back to the intended settings, sync leaves the
  file alone and says to add the hooks by hand.

### Changed

- Biome no longer scans Claude Code isolation worktrees (`.claude/worktrees/`) inside the repo.
  Their nested `biome.json` failed the whole lint.

## 0.4.1

### Fixed

- **HonestButton** typed its reset timer as `number`. That fails to compile in an app with
  `@types/node`, where `setTimeout` returns `NodeJS.Timeout`, which is most vendored apps. It's
  now `ReturnType<typeof setTimeout>`.

### Added

- `npm run typecheck` also checks `src/` with Node types (`tsconfig.app-compat.json`), so the
  source keeps compiling in apps both with and without `@types/node`.

### Upgrading from 0.3.0 (missing from 0.4.0's notes)

- **Table and DataGrid columns declared on their own** need the row type now:
  `const columns: TableProps<APIKey>["columns"] = …`, not `TableProps["columns"]`. Without the
  argument the rows default to `Record<string, unknown>`, which an `interface` row type doesn't
  satisfy, so `data` and `render` no longer type-check. With it, `render` is checked against
  the real row. Columns written inline in `<Table columns={…}>` infer the row type and need
  nothing.

## 0.4.0

The headline: apps **vendor** quiet instead of installing it, and token names are checked
everywhere. Every component is now TypeScript.

### Upgrading from 0.3.0

- **Install:** in the app, run `node <quiet>/scripts/quiet.mjs sync` (with quiet checked out at
  `v0.4.0`), then replace the `git+…#v0.3.0` dependency with `"@optimusfoundry/quiet":
  "file:./vendor/quiet"`. Imports don't change. Installing from the git tag still works.
- **Stricter prop types:** rest props are the real HTML attributes, so a misspelled or unknown prop
  on Button, Link, Spinner, TextField, TextArea or HoldButton is now a type error.
- **The agent skill moved** from `skills/quiet-app` to `claude/skills/quiet-app`. `sync` places it in
  `.claude/skills/` for you.
- **Lint:** `@optimusfoundry/quiet/stylelint` (`quiet/known-tokens`) and the
  `@optimusfoundry/quiet/stylelint/config` preset are new. Turning them on may flag existing
  misspelled or invented `--q-*` names and raw values.

### Added

- **Vendoring:** `node <quiet>/scripts/quiet.mjs sync` copies quiet's source into an app's
  `vendor/quiet`, replacing it on every update. Its `package.json` exports the source, so the app
  depends on `file:./vendor/quiet` and keeps importing `@optimusfoundry/quiet`. `quiet check` (bin)
  fails in CI if the copy was edited. Apps compile quiet themselves and ship CSS only for the
  components they use.
- **Claude Code assets for apps (`claude/`)**, placed by `quiet sync`: the `quiet-app` skill, the
  `qa/quiet-screen-reviewer` agent, and the `quiet-guard` hook, which blocks edits to
  `vendor/quiet` and lints changed app CSS. Sync leaves the app's own Claude config alone. In a
  monorepo they go to the project root's `.claude/`.
- **Token names are checked.** A renamed, removed or misspelled `--q-*` token used to fail silently
  (an unset style). Now it fails a check, in quiet and in apps:
  - `TokenName` (every token quiet declares) and `cssVar("--q-space-stack")`, exported for TS.
  - `@optimusfoundry/quiet/stylelint`: the `quiet/known-tokens` rule for an app's CSS/SCSS. It reports
    any `var(--q-…)` quiet doesn't declare, and any `--q-*` the app invents. The list ships as
    `@optimusfoundry/quiet/tokens.json`.
  - quiet's own `npm run lint` runs `scripts/check-tokens.mjs` (every `--q-*` in TS declared, none
    built from a prefix, every `--_local` read by its stylesheet) and the Stylelint rule on its SCSS.
- **`@optimusfoundry/quiet/stylelint/config`:** quiet's CSS rules for an app's own stylesheets
  (tokens only, `quiet/known-tokens`, `--app-*` custom properties).

### Changed

- **Every component is TypeScript.** `src/components/**` is typed `.tsx` (strict,
  `noUncheckedIndexedAccess`). Each props interface lives next to its component, and tsc emits the
  shipped `.d.ts` files.
- **Stricter, more useful prop types.** No `any` is left in a public type:
  - Rest props are the HTML attributes of the element they land on (`ButtonProps`, `LinkProps`,
    `SpinnerProps`, `TextFieldProps`, `TextAreaProps`, `HoldButtonProps`).
  - `Table`, `DataGrid` and `StreamingTable` are generic over the row (`Row`) and key (`Key`) types,
    and `DropdownMenu` and `CommandPalette` over the item type, all inferred from the data. So
    `render: (row) => row.name` is typed.
  - Where the old `.d.ts` was narrower than the code, the type widens (`Spinner label` takes `null`).
- **Effects use `useEffectEvent`** where a callback prop must not restart a timer or animation
  (Alert, Banner, Toast, ChatThread, StreamingTable, Tabs, Popover). Toast's auto-dismiss now calls
  the latest `onClose`.
- **The layer order holds in any bundler.** `src/index.ts` imports the styles before any component,
  so the order survives minification. `postbuild` no longer patches the CSS, and `check:package`
  asserts the order.
- Dev-only warnings use `isDev()` (`src/lib/env.ts`) instead of a global `process` declaration, so
  quiet's source typechecks in an app without Node types and doesn't clash with `@types/node`.
- Stories style with BEM stylesheets (`q-sb-*`) instead of inline styles, so the pattern screens
  read as the CSS a product would write.
- TypeScript 7 (native compiler), Biome 2.5 (now formats and lints all of `src/`), React 19.3.

### Fixed

- Charts import the shared `chart.scss` directly (ChartParts included) instead of each chart
  stylesheet `@use`-ing it.
- RunScrubber no longer sets an unused `--_n`.

### Removed

- `npm run drift` and `src/jsx-global.d.ts`. The reference groups are now a typed port of the
  Claude Design mirror, and the parity tests keep them honest.
- `skills/`, moved to `claude/skills/`.

## 0.3.0

### Added

- **`quiet-audit` CLI** (`npx quiet-audit <url> --width 1280,390 --theme foundry,foundry-dark`).
  It measures a running screen for off-token spacing, type, radius and colour, broken heading
  order, nested cards and overflow (#15).
- **`docs/guidelines/`** ships in the package: the layout system (app shell and layouts, sections,
  grid, spacing, typography), components, accessibility and a checklist (#15).
- **`skills/quiet-app`** ships in the package: a consumer agent skill for building apps on quiet.
  Copy it into a product repo's `.claude/skills/` (#15).
- Pattern screens in Storybook: app shell, dashboard, records, settings, billing, assistant and
  states (#15).

### Changed

- `Receipt` `undoable` now defaults to `false`.
- `ScopeGrant` and `BudgetLeash` render agent strings as an `Avatar`.
- `ChatMessage` takes `headingLevel`.
- `ChartTable` wraps its table in an sr-only container.

## 0.2.0

### Breaking

- `@optimusfoundry/quiet/style.css` no longer loads fonts. The Google Fonts `@import` for Inter Tight
  and JetBrains Mono moved to `@optimusfoundry/quiet/fonts.css`. Import it next to `style.css` to keep
  the brand fonts; a product whose theme sets other fonts loads its own instead.

### Fixed

- `dist/quiet.css` starts with the cascade-layer order statement
  (`@layer q.tokens, q.themes, q.base, q.components, q.utilities`), so `q.components` beats `q.base`
  again.

### Added

- Installable from a git tag: a `prepare` script builds `dist/` when npm installs quiet from git.
- CI (`.github/workflows/ci.yml`): lint, typecheck, build and the Playwright suite.
- `npm run check:package` checks the built package against what `npm pack` ships: every export
  target, the layer order, the font split and the `.d.ts` files. CI runs it after the build.

## 0.1.0

- First version: the Claude Design "Soft" system as a React package, with the accessibility and
  motion layer, BEM + 3-tier `--q-*` tokens, and the `foundry` / `foundry-dark` themes.
