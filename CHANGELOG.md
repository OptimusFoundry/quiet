# Changelog

quiet follows [semver](https://semver.org). Releases are git tags `vX.Y.Z`; nothing is published to a registry.

## Unreleased

### Added

- **Vendoring:** `node <quiet>/scripts/quiet.mjs sync` copies quiet's source into an app's
  `vendor/quiet`, replacing it on every update. Its `package.json` exports the source, so the app
  depends on `file:./vendor/quiet` and keeps importing `@optimusfoundry/quiet`. `quiet check` (bin)
  fails in CI if the copy was edited. Apps compile quiet themselves and ship CSS only for the
  components they use.
- **Claude Code assets for apps (`claude/`)**, placed by `quiet sync`: the `quiet-app` skill (moved
  from `skills/`), the `quiet-screen-reviewer` and `quiet-a11y-reviewer` agents, and the
  `quiet-guard` hook, which blocks edits to `vendor/quiet` and lints changed app CSS. Sync leaves
  the app's own Claude config alone.
- **`@optimusfoundry/quiet/stylelint/config`:** quiet's CSS rules for an app's own stylesheets
  (tokens only, `quiet/known-tokens`, `--app-*` custom properties).

### Changed

- `src/index.ts` imports the styles before any component, so the layer order survives minification
  in any bundler. `postbuild` no longer patches the CSS, and `check:package` asserts the order.
- Dev-only warnings use `isDev()` (`src/lib/env.ts`) instead of a global `process` declaration,
  so quiet's source typechecks in an app without Node types and doesn't clash with `@types/node`.

- **Stricter, more useful prop types.** No `any` is left in a public type:
  - Rest props are the HTML attributes of the element they land on (`ButtonProps`, `LinkProps`,
    `SpinnerProps`, `TextFieldProps`, `TextAreaProps`, `HoldButtonProps`), so a misspelled prop is
    now a type error.
  - `Table`, `DataGrid` and `StreamingTable` are generic over the row (`Row`) and key (`Key`) types,
    and `DropdownMenu` and `CommandPalette` over the item type. These are inferred from the data,
    so `render: (row) => row.name` is typed.
- **Effects use `useEffectEvent`** where a callback prop must not restart a timer or animation
  (Alert, Banner, Toast, ChatThread, StreamingTable, Tabs, Popover). Toast's auto-dismiss now calls
  the latest `onClose`.

### Added

- **Token names are checked.** A renamed, removed or misspelled `--q-*` token used to fail
  silently (an unset style); now it fails a check, in quiet and in apps:
  - `TokenName` (every token quiet declares) and `cssVar("--q-space-stack")`, exported for TS.
  - `@optimusfoundry/quiet/stylelint`: the `quiet/known-tokens` rule for an app's CSS/SCSS. It reports
    any `var(--q-…)` quiet doesn't declare, and any `--q-*` the app invents. The list ships as
    `@optimusfoundry/quiet/tokens.json`.
  - quiet's own `npm run lint` runs `scripts/check-tokens.mjs` (every `--q-*` in TS declared, none
    built from a prefix, every `--_local` read by its stylesheet) and the Stylelint rule on its SCSS.
- Stories style with BEM stylesheets (`q-sb-*`) instead of inline styles, so the pattern screens
  read as the CSS a product would write.

### Changed

- Charts import the shared `chart.scss` directly (ChartParts included) instead of `@use`-ing it
  from each chart stylesheet; one source copy, ~0.7 kB less CSS.
- RunScrubber no longer sets an unused `--_n`.

- **Every component is TypeScript.** `src/components/**` is typed `.tsx` (strict,
  `noUncheckedIndexedAccess`); each props interface lives next to its component and the shipped
  `.d.ts` files are emitted by tsc. Public prop types are unchanged, except where the old `.d.ts`
  was narrower than what the code accepts (e.g. `Spinner label` takes `null`).
- TypeScript 7 (native compiler), Biome 2.5, React 19.3. Biome now formats and lints all of `src/`.
- Removed `npm run drift` and `src/jsx-global.d.ts`: the reference groups are now a typed port of
  the Claude Design mirror, kept honest by the parity tests.

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
