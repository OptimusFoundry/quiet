# Changelog

quiet follows [semver](https://semver.org). Releases are git tags `vX.Y.Z`; nothing is published to a registry.

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
