# quiet — agent guide

quiet is a **TypeScript port** of the Optimus Foundry "Soft" design system in Claude Design, plus an
**accessibility + motion layer** on top. The rule: at rest, every component renders pixel-identical
to the reference (`tests/parity.spec.ts`); the layer only shows on interaction — keyboard focus,
hover-equivalents on focus, ARIA, open/close and state-change motion. Read [DESIGN.md](DESIGN.md) first.

## What is copied, and from where

| quiet path | source | how |
|---|---|---|
| `src/components/<group>/*.tsx` | `docs/reference/optimus-design/components/*.jsx` + `*.d.ts` | ported to TypeScript (props interface from the `.d.ts`, JSDoc and `@startingPoint` kept), then the a11y + motion layer edited in |
| `src/styles/tokens/` | `docs/reference/optimus-design/tokens/` | rebuilt as 3-tier `--q-*` tokens with the same values; the reference names live in `tokens/_reference-compat.scss` |
| `src/components/<group>/*.scss` | the reference's inline styles | quiet's own BEM SCSS, pixel-identical at rest (parity tests) |
| `src/index.ts` | `ds-loader.js` file list | `npm run gen` |
| `src/styles/tokens.generated.{ts,json}` | the compiled SCSS | `npm run gen` (`TokenName`, `cssVar`; the name list shipped as `dist/tokens.json`) |
| `src/stories/catalog.generated.tsx` | `components/index.html` App script | `npm run gen` (verbatim, `@ts-nocheck`) |

`docs/reference/optimus-design/` is a byte-identical mirror of the Claude Design project. Everything
in `src/` is TypeScript (strict), formatted and linted by Biome; only SCSS goes through Stylelint.

## Updating from Claude Design

1. Change the design in Claude Design, not here.
2. Re-mirror changed files into `docs/reference/optimus-design/` with DesignSync `get_file`
   (main session only — subagents can't use DesignSync, forks can). Write content exactly;
   keep `\uXXXX` escapes as escapes. Verify against the project before trusting the copy.
3. `git diff` the mirror to see what changed and port it by hand into the `.tsx` (same paths),
   keeping the a11y + motion layer and the types, then run `npm run gen`.
4. `npm run test` — `tests/parity.spec.ts` must show the catalog pixel-identical to the
   reference `components/index.html`.

## The a11y + motion layer

- Shared behaviour lives in `src/a11y/hooks.ts` (focus trap/restore, Escape, outside click,
  roving arrow keys, presence for exit animations) — use it, don't re-implement per component.
- Motion classes live in `src/styles/utilities/_motion.scss` (`q-anim-*` with `data-state`, `q-collapse`);
  keyboard focus ring and `q-sr-only` in `src/styles/utilities/_a11y.scss`.
- Motion follows the reference rules: slow and soft, `--q-ease-soft`/`--q-ease-forge`, never a bounce,
  no press shrink, one moving thing per surface, reduced motion respected.
- Keep edits minimal and in the reference's style (`React.useState`, classes from the component's
  `.scss`); never change what renders at rest. Colour contrast is a deliberate exception (exact colours kept).
- Tests: `tests/a11y.spec.ts` (axe, light + dark) and `tests/a11y-<group>.spec.ts` (keyboard/ARIA).

## Styling conventions (BEM + tokens)

Canonical example: `src/components/core/Button.tsx` + `Button.scss`.

- **One stylesheet per component**, next to it: `src/components/<group>/<Name>.scss`, imported by
  `<Name>.tsx` (`import "./<Name>.scss"`). No inline styles except truly dynamic values, passed as
  custom properties (`style={{ '--_progress': pct + '%' }}`); consumers' `className`/`style` still merge.
- **BEM under the `q-` namespace**: block `.q-dropdown-menu`, element `.q-dropdown-menu__item`,
  modifier `.q-dropdown-menu__item--danger`. Variants and sizes are modifiers. States use native
  pseudo-classes and ARIA/data attributes (`:hover`, `:focus-visible`, `[aria-expanded="true"]`,
  `[aria-selected="true"]`, `[data-state="open"]`) — no `is-*` classes, no JS hover state.
  Hover affordances apply to keyboard focus too: `:is(:hover, :focus-visible)`.
- **Tokens, three tiers** (all `--q-*`):
  1. palette — `--q-gray-*`, `--q-molten-*` … only in `src/styles/themes/_<theme>.scss`;
  2. semantic — `--q-bg*`, `--q-fg*`, `--q-border*`, `--q-accent`, `--q-status-*`, `--q-text-*`, `--q-leading-*`,
     `--q-tracking-*`, `--q-space-*`, `--q-control-*`, `--q-radius-*`, `--q-shadow-*`,
     `--q-ease-*`, `--q-dur-*`, `--q-z-*` in `src/styles/tokens/`;
  3. component — `--q-{block}-{element?}-{modifier?}-{property}-{state?}`, declared at the top of
     the component's own .scss in `@layer q.tokens { :root, [data-theme] { … } }`, defaulting to
     tier 2. A value unique to one component may be set here directly.
  Component rules use only tier-2/3 tokens; `--_name` locals carry size/variant plumbing.
- **Cascade layers**: `q.tokens, q.themes, q.base, q.components, q.utilities`. Component rules go in
  `@layer q.components`, so they never need to out-specify base styles.
- **Themes**: `src/styles/themes/_<name>.scss` sets the palette (and may override any token) under
  `[data-theme="<name>"]`; register built-ins in `themes.ts`. Products register their own with
  `defineThemes()` and style them in `@layer q.themes` (DESIGN.md, "Product themes").
  `QuietRoot theme` scopes a subtree, `ThemeProvider` themes the app.
- **Status colour**: components never hard-code a status grey or the accent; they read
  `--q-status-<status>-{fg,bg,border}` through their own tier-3 tokens (DESIGN.md, "Status colour").
- **Token names are checked, never guessed.** In TS a token is its real name, spelled whole:
  `motionToken(el, "--q-dur-expand")`, `cssVar("--q-space-stack")`, `{ "--q-accent": c }`. A
  parameter that takes a name is `TokenName` (generated from the compiled SCSS), so tsc rejects a
  typo. `scripts/check-tokens.mjs` (in `npm run lint`) also checks the strings tsc can't type
  (style objects, prose, comments): every `--q-*` must be declared, and none may be built from a
  prefix (`--q-space-${n}`) — list the real names instead. It also checks that every `--_local` a
  component or story sets from TSX is read by a stylesheet that file imports. In SCSS,
  `quiet/known-tokens` (the Stylelint rule quiet ships to apps) checks every `var(--q-…)`. Run
  `npm run gen` after adding, renaming or removing a token.
- **Stories style with classes,** like components: `<File>.scss` next to the story, BEM under
  `q-sb-*`, plain CSS (tokens, nesting; no SCSS features, no `@layer`). Pattern screens are what
  products copy, so keep them clean. Inline `style` only for dynamic `--_` values.
- The reference names (`--ink`, `--paper`, `--molten` …) exist only in
  `tokens/_reference-compat.scss`, for the generated catalog and pasted Claude Design code.
- **Scope anything global to `[data-quiet]`** (set by `QuietRoot`, and on `<html>` by
  `applyTheme`): element selectors, `::selection`, the reference-compat names. quiet must load next
  to another design system without restyling it (`tests/coexistence.spec.ts`; README).
- Links: a component that renders `<a>` from `href` picks its element with `useLinkElement` from
  `src/lib/link.tsx`, so `QuietRoot linkComponent` routes it.
- Enforced by `stylelint.config.mjs` (BEM class pattern, `--q-*`/`--_*` custom properties, no raw
  values in component rules). `npm run lint` runs Biome + Stylelint.
- Biome's `src/components/**` override turns off the a11y lint rules that fight quiet's deliberate
  ARIA-on-div DOM (it must match the reference; axe + the keyboard specs are the a11y gate), plus
  `noArrayIndexKey` and `noNonNullAssertion`. `useExhaustiveDependencies` and `noExplicitAny` stay
  warnings: a backlog to fix with behaviour tests, not blindly.

## Future components (quiet's own)

`src/components/future/` holds components that are **not** in the reference: concepts from the
Claude Design project "Protoapp Design System" (Future Components I–IV), picked for fit and rebuilt
on quiet tokens + BEM with full keyboard/ARIA. Parity doesn't apply to them; `npm run gen`
exports them after the reference components. Stories: `src/stories/future/*.stories.tsx` (Future/…),
tests: `tests/future-<set>.spec.ts`. Status colour comes from `--q-status-*` (foundry: success = ink, warning/error = molten).

Also quiet's own: `src/components/charts/` (hand-rolled SVG; **in charts molten is the primary data
colour** — series 1 accent, then ink and greys via `--q-chart-series-*`) and `src/components/chat/`
(AI chat UI: thread, messages, rich composer with attachments, tool calls, code blocks — no API
inside; the product wires it to Claude). Stories: Charts, Chat; tests `charts.spec.ts`, `chat.spec.ts`.

Single own components outside those folders (today `feedback/Toaster`) are appended to `own` in
`scripts/gen.mjs` and get their own stories (`src/stories/<Name>.stories.tsx`) instead of a catalog
section, since the catalog is generated from the reference and must stay pixel-identical to it.

## Harness (Claude Code)

- **Skills** (`.claude/skills/`):
  - `new-component`: add a component end to end.
  - `port-future-concept`: judge fit and read a Claude Design concept through Chrome.
  - `sync-from-claude-design`: update the reference copy, hash-verified, with parity.
  - `review-component`: the pre-PR checklist.
- **Agents** (`.claude/agents/`):
  - `component-builder`: builds one component, write-scoped to its files.
  - `a11y-reviewer`: read-only; runs the axe and keyboard specs and reviews ARIA patterns.
  - `visual-reviewer`: screenshots stories in both themes against `docs/guidelines/checklist.md`.
- **Scaffold:** `npm run new -- <future|charts|chat> <Name>` writes `<Name>.{tsx,scss}` from convention templates. It refuses reference groups.
- **Hook:** `.claude/settings.json` runs `.claude/hooks/lint-changed.sh` after every Edit or Write.
  - It runs Stylelint on a changed `src/**/*.scss`, and Biome on changed `src/**/*.{ts,tsx}`, `tests/*.ts` and `scripts/*.mjs`.
  - It only reports back; it never blocks.

## Working alongside other agents

- **PRs:** open them straight against `main`, never stacked. #5 was stacked on #3; #3 was squash-merged first, so #5 merged into the stale `feat/future-components` branch instead of main, and #6 had to redo it.
- **Branches:** other sessions keep worktrees and branches of this repo. Re-check `git branch --show-current` and `git status` before committing. Never stash, reset or check out someone else's work.
- **Shared working tree:** when several agents share one, each touches only its own files and nobody commits until all are done.
- **Storybook:** restart it (`npm run dev -- --ci --no-open`) when a new story file is "not found". The running server doesn't always pick up new `*.stories.tsx` files.
- **Overlapping test runs:** pass `--output <scratch-dir>` to `npx playwright test` so runs don't wipe each other's `test-results/`.

## quiet's own code

`src/QuietRoot.tsx`, `src/a11y/`, `src/styles/` (tokens, themes, base, utilities), `src/env.d.ts`, `scripts/`,
`tests/` and the Storybook config.

**Before finishing:** `npm run lint && npm run typecheck && npm run build && npm run test`.
