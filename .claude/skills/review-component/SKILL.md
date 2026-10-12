---
name: review-component
description: Review a change to quiet components before a PR. Runs the mechanical checks, then reviews what tools can't catch (the one look, ARIA patterns, focus, API shape, motion, cohesion). Use before opening a quiet PR or when asked to review quiet components.
---

# Review a quiet component change

Scope: `git diff --name-only main...HEAD -- src`. Report every finding as `file:line`, the problem
and the fix. Blocking findings come first, then nits. Don't report anything a tool already passed.

## 1. Run the tools

```bash
npm run lint && npm run typecheck && npm run build
```

Lint already enforces BEM names, `--q-*` and `--_*` names, token-only values, the one-look plumbing
(`check-one-look`) and that every component the guidelines name exists.

## 2. Review what the tools can't see

Each check is written as the bug it prevents:

- **Raw values in disguise:** `calc()` with px, magic numbers in `--_*` locals, or tier-1 palette tokens
  (`--q-gray-*`) outside themes.
- **Status hard-coded:** status colour not read from `--q-status-*`, or the accent used as a
  status fill (outside charts).
- **Wrong pattern:** the role doesn't match its WAI-ARIA pattern. For example, a listbox
  without `aria-selected`, a slider without `aria-valuetext` when the number alone means nothing, or a
  toggle without `aria-pressed`.
- **Lost focus:** after removing or undoing an item, or closing an overlay, focus lands on `body`.
- **Noisy announcements:** a status region that re-reads streamed text, or that announces on
  every keystroke.
- **Pointer-only:** any behaviour with no keyboard path.
- **Motion at rest:** anything that loops, pulses or drifts, or uses spring overshoot.
  Reduced motion must be respected.
- **API drift:** `onChange` passes an event, a prop is read but not declared in the props interface, demo data
  sits inside the component, or the consumer's `className`/`style` isn't merged.
- **Story slop:** decorative demo content, or states shown that nobody would design against.
  A real state missing (empty, error, disabled, long text) is a finding too.

## 3. The one look

Each is a finding (`docs/plans/2026-10-12-one-look.md`, `docs/guidelines/foundations.md`):

- **Ink:** text from a gray palette step, black or near-black; `--q-accent` (raw) as text instead of
  `--q-accent-fg`; an accent mixed toward black.
- **Rules:** a border or divider that groups (a card edge, a section rule, a ruled footer). Only
  table and list rows, and pane edges, get lines; grouping is a `--q-bg-subtle` ground.
- **Overlays:** a menu, popover, dialog or toast with a border; it floats on `--q-shadow-float`.
- **Type:** mono caps, `text-transform: uppercase`, letter-spaced labels, italics, a hard-coded font
  size or family instead of a role token.
- **Glyphs:** a unicode arrow, cross, check or chevron where an `AppIcon` belongs.
- **Shape and size:** a control that isn't a pill or isn't at the dense heights.
- **Tier-3 leaks:** a story, JSDoc or doc that tells apps to use a component's `--q-<block>-*`
  tokens on their own markup.
- **Frame fit:** it breaks inside the 360 pane, at 390 wide, or in foundry-dark.

## 4. Cohesion

Run the `visual-reviewer` agent on the affected stories and include its findings.
