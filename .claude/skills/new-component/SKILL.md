---
name: new-component
description: Add a component to quiet's own groups (src/components/future, charts, chat) end to end: scaffold, styles, behaviour, story, tests, export. Use whenever a quiet component is added.
---

# Add a quiet component

The rules live in `AGENTS.md`, in the sections "Styling conventions" and "The a11y + motion layer".
Read them first. This skill covers only the order of work and the mistakes that have already happened.

## 1. Decide whether it should exist

- **Groups:** reference groups (`core forms display data navigation feedback overlays layout`) are a
  port of Claude Design. Never add to them; change Claude Design, then use the `sync-from-claude-design` skill.
- **Existing components:** `ls src/components/*/`. Extending an existing quiet component beats adding
  a near-duplicate.
- **One product only:** if only one product needs it, it belongs in that product's repo, built on
  quiet tokens. It doesn't go in quiet.

## 2. Scaffold

```bash
npm run new -- <future|charts|chat> <PascalName>
```

## 3. Build

Mistakes that got past review before:
- **`onChange`:** passes the **value**, not the event. Support controlled and uncontrolled use
  (`value`/`defaultValue`).
- **No `ref` prop:** React 19 passes `ref` through.
- **Status colour:** comes from `--q-status-*`, through the component's own tier-3 tokens. Never use the
  accent or a grey directly for status. Molten is punctuation; only charts use it as the primary series.
- **Data:** no demo data in the component. Data comes in through props; the story holds it.
- **Hooks:** use the ones in `src/a11y/hooks.ts`. Don't hand-roll focus traps, outside-click or roving focus.
- **Motion:** one-shot only. No spring overshoot, nothing moving at rest, and respect reduced motion.
- **Props interface:** exported from the `.tsx` next to the component, matching the props it actually reads, with JSDoc on each one. No `@ts-ignore` or new `any`.

## 4. Story and test

- **Story:** add the story to the set's file in `src/stories/future/` (`Concept` + `Spec` from
  `./Concept`; `id` = kebab name). Import the component from its own file. Show every state
  someone would design against, and nothing decorative.
- **Test:** `tests/<set>.spec.ts`, copied from `tests/future-display.spec.ts`. Axe runs in `foundry` and
  `foundry-dark`, and only `ACCEPTED_LOW_CONTRAST` is exempt. Add keyboard and ARIA assertions per behaviour.
  - Wait for focus before pressing keys (`locator.press`, or `toBeFocused()` first).
  - No free-running timers; tests must be deterministic.
- `npm run gen` exports it.

## 5. Done-bar

```bash
npm run lint && npm run typecheck && npm run build && npm run test
```

- **Parity:** `parity` and `hover-parity` must stay green.
- **Review:** run the `review-component` skill, then the `visual-reviewer` agent on the story.
- **Storybook:** if the new story is "not found", restart Storybook with `npm run dev -- --ci --no-open`.
