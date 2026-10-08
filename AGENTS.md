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

## Styling conventions (BEM + tokens)

Canonical example: `src/components/core/Button.jsx` + `Button.scss`.

- **One stylesheet per component**, next to it: `src/components/<group>/<Name>.scss`, imported by
  `<Name>.jsx` (`import './<Name>.scss'`). No inline styles except truly dynamic values, passed as
  custom properties (`style={{ '--_progress': pct + '%' }}`); consumers' `className`/`style` still merge.
- **BEM under the `q-` namespace**: block `.q-dropdown-menu`, element `.q-dropdown-menu__item`,
  modifier `.q-dropdown-menu__item--danger`. Variants and sizes are modifiers. States use native
  pseudo-classes and ARIA/data attributes (`:hover`, `:focus-visible`, `[aria-expanded="true"]`,
  `[aria-selected="true"]`, `[data-state="open"]`) — no `is-*` classes, no JS hover state.
  Hover affordances apply to keyboard focus too: `:is(:hover, :focus-visible)`.
- **Tokens, three tiers** (all `--q-*`):
  1. palette — `--q-gray-*`, `--q-molten-*` … only in `src/styles/themes/_<theme>.scss`;
  2. semantic — `--q-bg*`, `--q-fg*`, `--q-border*`, `--q-accent`, `--q-text-*`, `--q-leading-*`,
     `--q-tracking-*`, `--q-space-*`, `--q-control-*`, `--q-radius-*`, `--q-shadow-*`,
     `--q-ease-*`, `--q-dur-*`, `--q-z-*` in `src/styles/tokens/`;
  3. component — `--q-{block}-{element?}-{modifier?}-{property}-{state?}`, declared at the top of
     the component's own .scss in `@layer q.tokens { :root, [data-theme] { … } }`, defaulting to
     tier 2. A value unique to one component may be set here directly.
  Component rules use only tier-2/3 tokens; `--_name` locals carry size/variant plumbing.
- **Cascade layers**: `q.tokens, q.themes, q.base, q.components, q.utilities`. Component rules go in
  `@layer q.components`, so they never need to out-specify base styles.
- **Themes**: `src/styles/themes/_<name>.scss` sets the palette (and may override any token) under
  `[data-theme="<name>"]`; register it in `themes.ts`. `QuietRoot theme` scopes a subtree,
  `ThemeProvider` themes the app.
- The reference names (`--ink`, `--paper`, `--molten` …) exist only in
  `tokens/_reference-compat.scss`, for the generated catalog and pasted Claude Design code.
- **Scope anything global to `[data-quiet]`** (set by `QuietRoot`, and on `<html>` by
  `applyTheme`): element selectors, `::selection`, the reference-compat names. quiet must load next
  to another design system without restyling it (`tests/coexistence.spec.ts`; README).
- Links: a component that renders `<a>` from `href` picks its element with `useLinkElement` from
  `src/lib/link.tsx`, so `QuietRoot linkComponent` routes it.
- Enforced by `stylelint.config.mjs` (BEM class pattern, `--q-*`/`--_*` custom properties, no raw
  values in component rules). `npm run lint` runs Biome + Stylelint.

## Future components (quiet's own)

`src/components/future/` holds components that are **not** in the reference: concepts from the
Claude Design project "Protoapp Design System" (Future Components I–IV), picked for fit and rebuilt
on quiet tokens + BEM with full keyboard/ARIA. Parity and drift don't apply to them; `npm run gen`
exports them after the reference components. Stories: `src/stories/future/*.stories.tsx` (Future/…),
tests: `tests/future-<set>.spec.ts`. Quiet has no green/red: done is ink, attention is molten.

Also quiet's own: `src/components/charts/` (hand-rolled SVG; **in charts molten is the primary data
colour** — series 1 accent, then ink and greys via `--q-chart-series-*`) and `src/components/chat/`
(AI chat UI: thread, messages, rich composer with attachments, tool calls, code blocks — no API
inside; the product wires it to Claude). Stories: Charts, Chat; tests `charts.spec.ts`, `chat.spec.ts`.

Single own components outside those folders (today `feedback/Toaster`) are appended to `own` in
`scripts/gen.mjs` and get their own stories (`src/stories/<Name>.stories.tsx`) instead of a catalog
section, since the catalog is generated from the reference and must stay pixel-identical to it.

## quiet's own code

`src/QuietRoot.tsx`, `src/a11y/`, `src/styles/quiet-*.css`, `src/jsx-global.d.ts`, `scripts/`,
`tests/` and the Storybook config.

**Before finishing:** `npm run lint && npm run typecheck && npm run build && npm run test`.
