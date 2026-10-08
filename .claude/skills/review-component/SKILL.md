---
name: review-component
description: Review a change to quiet components before a PR. Runs the mechanical checks, then reviews what tools can't catch (ARIA patterns, focus, API shape, motion, cohesion). Use before opening a quiet PR or when asked to review quiet components.
---

# Review a quiet component change

Scope: `git diff --name-only main...HEAD -- src tests`. Report every finding as `file:line`, the problem
and the fix. Blocking findings come first, then nits. Don't report anything a tool already passed.

## 1. Run the tools

```bash
npm run lint && npm run typecheck
npx playwright test tests/<set>.spec.ts tests/parity.spec.ts tests/hover-parity.spec.ts --output /tmp/review-$$
```

Lint already enforces BEM names, `--q-*` and `--_*` names, and token-only values.

## 2. Review what the tools can't see

Each check is written as the bug it prevents:

- **Raw values in disguise:** `calc()` with px, magic numbers in `--_*` locals, or tier-1 palette tokens
  (`--q-gray-*`) outside themes.
- **Status hard-coded:** status colour not read from `--q-status-*`, or molten used as a fill
  (outside charts).
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

## 3. Cohesion

Run the `visual-reviewer` agent on the affected stories and include its findings.
