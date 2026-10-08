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
The repo is private, so the installing machine needs GitHub read access. Locally that is your usual
git credentials. In CI, add a fine-grained token with read access as a secret and run
`git config --global url."https://x-access-token:${TOKEN}@github.com/".insteadOf "https://github.com/"`
before `npm ci`.

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
