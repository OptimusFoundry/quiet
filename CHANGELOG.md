# Changelog

quiet follows [semver](https://semver.org). Releases are git tags `vX.Y.Z`; nothing is published to a registry.

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
