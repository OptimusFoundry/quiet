# quiet

The Optimus Foundry "Soft" design system from Claude Design, as a React package — a **1:1 copy**:
68 components, tokens and the master catalog page, byte-for-byte from the Claude Design project,
plus a derived dark mode and a swappable accent. See [DESIGN.md](DESIGN.md) and
[AGENTS.md](AGENTS.md).

## Use

```tsx
import { QuietRoot, Button, Headline } from "@optimusfoundry/quiet";
import "@optimusfoundry/quiet/style.css";

<QuietRoot mode="light" density="app">
	<Headline size="h2" lead="Heavy software," accent="quietly made" />
	<Button arrow>Start a project</Button>
</QuietRoot>;
```

## Develop

```bash
npm run dev        # Storybook on :6020 — Catalog = the Claude Design master page
npm run gen        # regenerate src/index.ts + the catalog from docs/reference/optimus-design
npm run lint       # Biome (copied files are excluded)
npm run typecheck
npm run build
npm run test       # pixel parity with the reference master page + dark-mode smoke
```
