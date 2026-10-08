# Changelog

quiet follows [semver](https://semver.org). Releases are git tags `vX.Y.Z`; nothing is published to a registry.

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
