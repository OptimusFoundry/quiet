---
name: review-component
description: Review a quiet component change (new or edited) against quiet's conventions, accessibility, motion, types, tests and the cohesion guidelines. Use before opening a PR, or when asked to review quiet components.
---

# Review a quiet component

Run this skill on the changed files: `git diff --name-only main...HEAD -- src tests`. Report each finding with `file:line`, what's wrong, and the fix.

## 1. Mechanical checks (run them, don't eyeball)

```bash
npm run lint          # Biome + Stylelint: BEM class pattern, --q-*/--_* names, token-only values
npm run typecheck
npm run drift         # reference .jsx/.d.ts that differ from the mirror — only a11y/motion edits allowed
npx playwright test tests/<set>.spec.ts
```

## 2. Styles

- **One stylesheet per component**, imported by the component as `./<Name>.scss`.
- **Component tokens** sit at the top in `@layer q.tokens { :root, [data-theme] { … } }`, named `--q-{block}-{el?}-{mod?}-{prop}-{state?}` and defaulting to tier-2 tokens. Palette tokens (`--q-gray-*`, `--q-molten-*`) only ever appear in themes.
- **Rules:** in `@layer q.components`. BEM `.q-block__el--mod`; no `is-*` classes; states via pseudo-classes and ARIA/data attributes; hover also covers `:focus-visible`.
- **No raw values or inline styles:** no raw values in rules (Stylelint catches most; also check `calc()` with px). No inline styles except `--_*` custom properties. The consumer's `className`/`style` are merged.
- **Colour:** ink and greys. Molten is punctuation only; in charts it's the primary series. There are no green or red values anywhere.
- **Dark mode:** it works in `foundry-dark`. Nothing should be hard-coded light.

## 3. Behaviour and accessibility

- **ARIA:** it follows the WAI-ARIA pattern for its role (slider, listbox, menu, disclosure, dialog, tabs, progressbar, meter…). It has a name (`aria-label`/`labelledby`), states (`aria-pressed`/`expanded`/`checked`/`current`/`busy`), and `aria-valuetext` where the number alone isn't meaningful.
- **Keyboard:** everything is reachable and operable by keyboard. Composite widgets have one tab stop with arrows (`rovingKeyDown`). Escape closes; focus is trapped and restored in overlays (`useFocusTrap`, `useEscape`).
- **Focus:** after something is removed or undone, focus moves somewhere sensible, never to `body`.
- **Announcements:** async results and changes go through a polite `role="status"` with `q-sr-only` text. Streaming content isn't re-read token by token.
- **Shared code:** it uses the `src/a11y/hooks.ts` hooks; no re-implemented focus traps or outside-click handling.

## 4. Motion

- Soft easing (`--q-ease-soft`/`--q-ease-forge`), with durations from tokens.
- No bounce, spring overshoot or press-shrink.
- No motion at rest: nothing loops, drifts or pulses forever.
- `prefers-reduced-motion` is respected.

## 5. API and types

- `value`/`defaultValue`/`onChange(value)`: the value, not the event. No hidden demo data in the component.
- The `.d.ts` matches the real props exactly: every prop the `.jsx` reads is declared and has JSDoc, plus a `@startingPoint` doc. No `ref` prop (React 19).
- The component is exported by `npm run gen`. Check `src/index.ts` after running it.

## 6. Story and tests

- The story section uses `Concept`/`Spec`, `id` = the kebab name, and shows every variant and state. Demo data lives in the story; tests stay deterministic, with no free-running timers.
- The test runs axe in `foundry` and `foundry-dark` with only `ACCEPTED_LOW_CONTRAST` exempt, plus keyboard and ARIA assertions per component.
- `parity.spec.ts` and `hover-parity.spec.ts` are still green: reference components are untouched at rest.

## 7. Cohesion

Walk through `docs/guidelines/checklist.md`. Then screenshot the story in both themes (the `visual-reviewer` agent) and confirm that it reads as quiet.
