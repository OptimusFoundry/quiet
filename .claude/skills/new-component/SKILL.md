---
name: new-component
description: Add a component to quiet end to end: decide it should exist, scaffold, styles in the one look, behaviour, story, export. Use whenever a quiet component is added.
---

# Add a quiet component

The rules live in `AGENTS.md` ("Component APIs", "Styling conventions", "The a11y + motion layer")
and the look in `docs/guidelines/` (`README.md` first, then `foundations.md` and `typography.md`).
Read them first. This skill covers the order of work and the mistakes that have already happened.

## 1. Decide whether it should exist

- **Existing components:** `ls src/components/*/`. Extending one (a variant, a prop, a compound
  part) beats adding a near-duplicate.
- **One product only:** if only one product needs it, it belongs in that product's repo, built on
  tier-2 quiet tokens. It doesn't go in quiet.
- **A screen, not a component:** a layout made of existing parts is a pattern story
  (`src/stories/patterns/`), not a component.
- **Group:** app frame and screen parts in `app`, charts in `charts`, chat in `chat`, agent and
  trust concepts in `future`; a general control goes in its kind's group (`forms`, `overlays` …).

## 2. Scaffold

```bash
npm run new -- <group> <PascalName>
```

## 3. Build

The one look, built in from the start (`docs/plans/2026-10-12-one-look.md`):
- **Ink and accent:** text from `--q-fg`/`--q-fg-body`/`--q-fg-muted`; accent text `--q-accent-fg`,
  fills `--q-accent-bg`, raw `--q-accent` for marks only. Never a gray palette step or black.
- **Grounds, not rules:** group with `--q-bg-subtle`, never a border or divider (table and list rows
  excepted). Floating layers take `--q-shadow-float` and no border.
- **Type:** sizes from the roles and `--q-text-*`; labels sans, sentence case (`--q-font-label`,
  `--q-case-label`). No mono caps, no italics, mono only for code, IDs and kbd.
- **Shape:** controls are pills at the dense heights (`--q-control-sm`, `--q-field-md`).
- **Icons:** `AppIcon` by name (`src/components/core/icons.ts`); add a missing stroke icon there.
  Never a unicode glyph (→ ✕ ✓ ⌄).
- **Inside AppShell:** it must work in the 360 pane and at 390 wide; lay it out by container
  (`Grid`, `Stack`, container queries), not by viewport.

Mistakes that got past review before:
- **`onChange`:** passes the **value**, not the event. Support controlled and uncontrolled use
  (`value`/`defaultValue`).
- **No `forwardRef`:** React 19 passes `ref` as a prop; type it and spread rest props (AGENTS.md).
- **Status colour:** comes from `--q-status-*`, through the component's own tier-3 tokens. Never use the
  accent or a grey directly for status. Only charts use the accent as a data series.
- **Tokens in TS:** spell the real name (`"--q-dur-expand"`), type token parameters `TokenName`, never build a
  name from a prefix (AGENTS.md, "Token names are checked"). `npm run lint` fails on an unknown one.
- **Tier-3 tokens are private:** an app gets them only by importing the component. Never tell apps
  (in JSDoc, stories or docs) to style their own markup with them.
- **Data:** no demo data in the component. Data comes in through props; the story holds it.
- **Hooks:** use the ones in `src/a11y/hooks.ts`. Don't hand-roll focus traps, outside-click or roving focus.
- **Motion:** one-shot only. No spring overshoot, nothing moving at rest, and respect reduced motion.
- **Props interface:** exported from the `.tsx` next to the component, matching the props it actually reads, with JSDoc on each one. No `@ts-ignore` or new `any`.

## 4. Story

- **Where:** `src/stories/app/` for `app`, `src/stories/future/` for `future` (`Concept` + `Spec`
  from `./Concept`), `src/stories/extensions/` for the other groups; style it with a `q-sb-*` `.scss`
  next to the story. Import the component from its own file.
- Show every state someone would design against (empty, error, disabled, long text), nothing
  decorative. If it lives in a screen, show it in the frame too (`src/stories/patterns/AppFrame.tsx`).
- Check it by hand in Storybook: both themes, keyboard only (Tab, arrows, Escape), and at 390 wide.
- `npm run gen` exports it.

## 5. Done-bar

```bash
npm run lint && npm run typecheck && npm run build
```

- **Review:** run the `review-component` skill, then the `visual-reviewer` agent on the story.
- **Docs:** if apps should reach for it, add it to `docs/guidelines/components.md` (the need, the
  component, the wrong option it prevents). `npm run lint` fails on a guideline naming a component
  that doesn't exist.
- **Storybook:** if the new story is "not found", restart Storybook with `npm run dev -- --ci --no-open`.
