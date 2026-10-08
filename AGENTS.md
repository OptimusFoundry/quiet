# quiet — agent guide

quiet is a **1:1 copy** of the Optimus Foundry "Soft" design system in Claude Design. No drift:
never hand-edit the copied files. Read [DESIGN.md](DESIGN.md) first.

## What is copied, and from where

| quiet path | source | how |
|---|---|---|
| `src/components/<group>/*.jsx`, `*.d.ts` | `docs/reference/optimus-design/components/` | copied byte-for-byte |
| `src/styles/styles.css`, `src/styles/tokens/` | `docs/reference/optimus-design/` | copied byte-for-byte |
| `src/index.ts` | `ds-loader.js` file list | `npm run gen` |
| `src/stories/catalog.generated.jsx` | `components/index.html` App script | `npm run gen` |

`docs/reference/optimus-design/` is a byte-identical mirror of the Claude Design project. Biome
ignores all of the above so formatting can never change them.

## Updating from Claude Design

1. Change the design in Claude Design, not here.
2. Re-mirror changed files into `docs/reference/optimus-design/` with DesignSync `get_file`
   (main session only — subagents can't use DesignSync, forks can). Write content exactly;
   keep `\uXXXX` escapes as escapes. Verify against the project before trusting the copy.
3. Copy the changed files into `src/` (same paths), run `npm run gen`.
4. `npm run test` — `tests/parity.spec.ts` must show the catalog pixel-identical to the
   reference `components/index.html`.

## quiet's own code

Only `src/QuietRoot.tsx`, `src/styles/quiet-modes.css` (dark mode + accent), `src/jsx-global.d.ts`,
`scripts/`, `tests/` and the Storybook config. Keep it that small.

**Before finishing:** `npm run lint && npm run typecheck && npm run build && npm run test`.
