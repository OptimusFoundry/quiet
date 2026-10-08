# quiet — DESIGN.md

Rules for anyone (human or agent) building UI on quiet. Values live in `tokens.scss`; use the
tokens, never literals. These rules come from 1,384 UI references the owner saved; when a rule and
a reference disagree, the rule wins.

## Character

Quiet, precise, neutral software. The chrome stays grey; personality comes from motion and from
one hero visual per screen. If a screen looks good in pure greyscale, it is ready for colour.

## Colour

- Chrome is **neutral grey only** (chroma 0). No warm or tinted neutrals.
- Page is `--q-page` (off-white); content sits on `--q-surface` (white). Dark mode is a twin
  from the same tokens, never a separate design.
- Text uses exactly **three greys**: `--q-text`, `--q-text-secondary`, `--q-text-tertiary`.
  Hierarchy comes from these greys before it comes from size or weight.
  All three meet WCAG AA (4.5:1) for 12px text on page and surface in both modes — never add a
  lighter grey for text.
- Borders are **alpha hairlines** (`--q-border`, 9%), never solid greys.
- The primary action is **near-black** (`--q-strong`); the **accent** is for focus, links,
  selection and data — one accent per product (`--q-accent-h`, `--q-accent-c`).
- Semantic colours (success/warning/danger) only for status, usually as a small dot or a subtle
  tint, not as large fills.
- At most **one colour moment** per screen (a gradient, illustration or photo).

## Type

- **Inter** for everything; **Geist Mono** only for metadata, code, IDs and keyboard hints.
- Weights **400 and 500** only. 600 is reserved for marketing display sizes.
- App UI sizes: **12, 13, 14, 16, 20, 24** (`--q-text-xs` … `--q-text-2xl`). 14 is default
  UI text, 16 is reading text. 32 and 48 are for marketing pages only.
- Large sizes tighten (`--q-tracking-*`); UI sizes stay at 0.
- **Tabular numbers** (`.q-tnum` or `data-numeric`) for anything that updates or aligns in
  columns: prices, counters, timers, tables.
- Body copy 45–75 characters per line.

## Space & layout

- 4px base: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Nothing in between.
- Control heights: 28 (sm), **32 (default app UI)**, 40 (marketing / touch).
- Pick one major and one minor rhythm per screen and keep them.
- Rem for type, px for layout. Container queries for component responsiveness.
- `scrollbar-gutter: stable` on scroll containers that lock.

## Shape & depth

- Radius: **8 for controls**, **12 for cards**, 16 for sheets/dialogs, full for pills and avatars.
  One card radius across a screen; nested corners are concentric (inner = outer − padding).
- Resting surfaces get a **hairline** (`--q-ring` or a 1px `--q-border`), not a shadow.
- Only **floating** things get shadow: popovers, menus, toolbars, toasts (`--q-shadow-float`),
  dialogs and sheets (`--q-shadow-overlay`).
- Glass/blur only where something floats over imagery.

## Motion

- Animate meaningful transitions only. Utility UI stays restrained.
- Default 150–250ms with `--q-ease-out`. Interactive controls (toggles, drags, morphs) use
  `--q-spring-snappy` or `--q-spring-gentle`; animations must be interruptible.
- Morph containers instead of swapping them (pill → panel, tooltip that travels).
- Staggered reveals: `--q-stagger` (50ms) apart, optionally from 6–8px blur.
- Expand with `grid-template-rows: 0fr → 1fr`, never `height: auto`. Animate transforms and
  masks, not layout properties.
- Everything respects `prefers-reduced-motion` (the tokens collapse to 0ms).

## States

Design every state in both modes: idle, hover, focus, active, disabled, loading, empty, error.
Focus is a visible ring in `--q-focus`. Nothing shifts layout between states (reserve space,
fix label widths, use tabular numbers).

## Don't

- Don't add a second accent, a warm "paper" background, or coloured card fills.
- Don't use 600/700 weights for UI headings, or new type sizes outside the scale.
- Don't stack shadows on resting cards, or mix card radii on one screen.
- Don't ship a screen you haven't checked in dark mode.
