---
name: new-component
description: Add a new component to quiet end to end — scaffold, tokens, BEM SCSS, a11y, story, tests, export. Use whenever a component is added to src/components/future, charts or chat.
---

# Add a quiet component

## 1. Pick the group

| Group | What lives there | Can you add? |
|---|---|---|
| `core forms display data navigation feedback overlays layout` | the 1:1 copy of the Claude Design reference | **No.** Change it in Claude Design, then use the `sync-from-claude-design` skill. |
| `future` | concepts from the Claude Design "Future Components" pages, plus agent/AI patterns | yes |
| `charts` | hand-rolled SVG charts (molten is the primary series) | yes |
| `chat` | AI chat UI (thread, messages, composer…) — UI only, no API calls | yes |

Before adding, check that nothing existing already does the job: `ls src/components/*/`, and read `docs/guidelines/` if it is present.

## 2. Scaffold

```bash
npm run new -- <future|charts|chat> <PascalName>
```

This writes `src/components/<group>/<Name>.{jsx,d.ts,scss}` with BEM block `.q-<kebab-name>`. The script refuses reference groups and files that already exist.

## 3. Build it, following the conventions (AGENTS.md is the source of truth)

**Styles** (`<Name>.scss`):
- **Tokens:** component tokens go at the top, in `@layer q.tokens { :root, [data-theme] { --q-<block>-<el?>-<mod?>-<prop>-<state?>: var(<tier-2>); } }`. Default every token to a tier-2 token: `--q-bg*`, `--q-fg*`, `--q-border*`, `--q-accent`, `--q-text-*`, `--q-space-*`, `--q-radius-*`, `--q-ease-*`, `--q-dur-*`, `--q-z-*`.
- **Rules:** all rules go in `@layer q.components`.
- **No raw values:** every colour, size, space, radius, shadow, duration and z-index is a token. Stylelint enforces this.
- **BEM naming:** `.q-block__element--modifier`. Variants and sizes are modifiers. States use pseudo-classes or ARIA/data attributes (`[aria-expanded="true"]`, `[data-state="open"]`), never `is-*` classes or JS hover state.
- **Hover:** hover affordances also apply on `:focus-visible`, via `:is(:hover, :focus-visible)`.

**Markup** (`<Name>.jsx`):
- **Inline style:** pass only dynamic values, as `--_*` locals (`style={{ '--_pct': pct + '%', ...style }}`). Always merge the consumer's `className` and `style`.

**Colour:**
- quiet is ink and greys. Molten (`--q-accent`) is punctuation only, never a fill.
- Charts are the one exception: there, molten is the primary series.
- There are no green or red tokens: done is ink, attention is molten.

**Behaviour** (`<Name>.jsx`):
- Plain React. Use the shared hooks in `src/a11y/hooks.ts`: `useFocusTrap`, `useEscape`, `useOutside`, `rovingKeyDown`, `usePresence`, `motionToken`. Don't re-implement them.
- Controlled and uncontrolled: `value`/`defaultValue`/`onChange(value)`. **onChange passes the value, not the event.**
- No demo data inside components. Data comes in through props.

**Accessibility:**
- Follow the WAI-ARIA pattern for the widget: slider → `role="slider"` with `aria-valuetext`; menu → roving focus; disclosure → `aria-expanded`.
- Everything must be operable from the keyboard.
- Announce state changes through a polite `role="status"` region that holds `q-sr-only` text.
- Visible focus comes from `src/styles/utilities/_a11y.scss`. Don't remove outlines.

**Motion:**
- Slow and soft: `--q-ease-soft` / `--q-ease-forge`.
- No bounce, spring overshoot or press-shrink.
- No looping or ambient motion; one moving thing per surface.
- Respect `prefers-reduced-motion`.
- Use the `q-anim-*` (with `data-state`) and `q-collapse` utilities from `src/styles/utilities/_motion.scss`.

**Types** (`<Name>.d.ts`):
- A `<Name>Props` interface with JSDoc on every prop, a top doc comment with `@startingPoint`, then `export declare function <Name>(props): JSX.Element`.
- There's no `ref` prop: React 19 passes `ref` through as a normal prop.

## 4. Export, story, test

```bash
npm run gen     # src/index.ts exports src/components/{future,charts,chat}/*.jsx after the reference ones
```

**Story:** `src/stories/future/<Set>.stories.tsx`, with `title: "Future/<Set>"` (or `"Charts"` / `"Chat"`) and one story named `All`.
- Use `FuturePage`, `Concept` (`id`, `index`, `name`, `from`, `idea`) and `Spec` from `./Concept.jsx`.
- Each section's `id` is the kebab name.
- Import components from their own files, not from `src/index`.
- Demo data lives here.

**Test:** `tests/<set>.spec.ts`, using `tests/future-display.spec.ts` as the template.
- Axe on the story in `foundry` and `foundry-dark`, with `ACCEPTED_LOW_CONTRAST` (foundry `#95959c` `#e0531a`, foundry-dark `#6e6e76` `#f06a33`). Any other violation fails.
- Keyboard and ARIA behaviour for every component.
- Wait for focus before pressing keys: `locator.press()`, or `expect(x).toBeFocused()` first.

## 5. Done-bar

```bash
npm run lint && npm run typecheck && npm run build && npm run test
```

Parity and hover-parity must stay green, because they prove the reference copy is untouched.

Then screenshot the story in both themes and look at it, using the `visual-reviewer` agent or its script. It should read as quiet: hairlines, mono labels, ink, and molten only as a full stop.

**Storybook:** it runs on :6020. If a new story file is "not found", restart it with `npm run dev -- --ci --no-open`.
