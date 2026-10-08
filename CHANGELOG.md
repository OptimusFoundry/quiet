# Changelog

quiet follows [semver](https://semver.org). Releases are git tags `vX.Y.Z`; nothing is published to a registry.

## Unreleased

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
