# quiet

The Optimus Foundry "Soft" design system from Claude Design, as a React package — a **1:1 copy**:
68 components, tokens and the master catalog page, byte-for-byte from the Claude Design project,
plus a derived dark mode and a swappable accent. See [DESIGN.md](DESIGN.md) and
[AGENTS.md](AGENTS.md).

## Install

quiet is not on a registry. Install a tagged release from git and pin the tag:

```bash
npm install "git+https://github.com/OptimusFoundry/quiet.git#v0.2.0"
```

`dist/` is not committed; npm runs the `prepare` script (`npm run build`) when it installs from git.
The repo is public, so installs need no credentials, locally or in CI.

## Use

```tsx
import { QuietRoot, Button, Headline } from "@optimusfoundry/quiet";
import "@optimusfoundry/quiet/style.css";
import "@optimusfoundry/quiet/fonts.css";

<QuietRoot theme="foundry" density="app">
	<Headline size="h2" lead="Heavy software," accent="quietly made" />
	<Button arrow>Start a project</Button>
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

## Develop

```bash
npm run dev        # Storybook on :6020 — Catalog = the Claude Design master page
npm run gen        # regenerate src/index.ts + the catalog from docs/reference/optimus-design
npm run lint       # Biome (copied files are excluded)
npm run typecheck
npm run build
npm run check:package  # what a git-tag install ships: exports, layer order, fonts, .d.ts
npm run test       # pixel parity with the reference master page + dark-mode smoke
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
