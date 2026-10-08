# quiet — agent guide

quiet is a **1:1 copy** of the Optimus Foundry "Soft" design system in Claude Design, plus an
**accessibility + motion layer** on top. The rule: at rest, every component renders pixel-identical
to the reference (`tests/parity.spec.ts`); the layer only shows on interaction — keyboard focus,
hover-equivalents on focus, ARIA, open/close and state-change motion. Read [DESIGN.md](DESIGN.md) first.

## What is copied, and from where

| quiet path | source | how |
|---|---|---|
| `src/components/<group>/*.jsx`, `*.d.ts` | `docs/reference/optimus-design/components/` | copied, then the a11y + motion layer edited in (`npm run drift` lists every changed file) |
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
3. Copy the changed files into `src/` (same paths) and re-apply the a11y + motion edits for those
   components (`git diff` the previous copy to see them), then run `npm run gen`.
4. `npm run test` — `tests/parity.spec.ts` must show the catalog pixel-identical to the
   reference `components/index.html`.

## The a11y + motion layer

- Shared behaviour lives in `src/a11y/hooks.ts` (focus trap/restore, Escape, outside click,
  roving arrow keys, presence for exit animations) — use it, don't re-implement per component.
- Motion classes live in `src/styles/quiet-motion.css` (`q-anim-*` with `data-state`, `q-collapse`);
  keyboard focus ring and `q-sr-only` in `src/styles/quiet-a11y.css`.
- Motion follows the reference rules: slow and soft, `--ease-soft`/`--ease-forge`, never a bounce,
  no press shrink, one moving thing per surface, reduced motion respected.
- Keep edits minimal and in the reference's style (inline styles, `React.useState`); never change
  what renders at rest. Colour contrast is a deliberate exception (exact colours kept).
- Tests: `tests/a11y.spec.ts` (axe, light + dark) and `tests/a11y-<group>.spec.ts` (keyboard/ARIA).

## quiet's own code

`src/QuietRoot.tsx`, `src/a11y/`, `src/styles/quiet-*.css`, `src/jsx-global.d.ts`, `scripts/`,
`tests/` and the Storybook config.

**Before finishing:** `npm run lint && npm run typecheck && npm run build && npm run test`.
