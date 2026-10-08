# quiet — DESIGN.md

Rules for anyone (human or agent) building UI on quiet. quiet implements the **Optimus Foundry
"Soft"** system; its source of truth is mirrored in `docs/reference/optimus-design/` (`readme.md`
for the rules, `tokens/`, `components/`). Values live in `src/tokens/tokens.scss` as `--q-*`; use
the tokens, never literals. Where this file and the reference disagree, the reference wins, except
for the two quiet additions marked below.

## Character

Heavy software, quietly made. White paper, neutral-cool greys, a lifted near-black ink, and one
accent used as punctuation. Bold display type does the talking; no imagery, textures or patterns.

## Colour

- Greys: `--q-paper`, `--q-paper-2`, `--q-rule-soft`, `--q-rule-strong`, `--q-muted-2`,
  `--q-muted`, `--q-ink-2`, `--q-ink`. Ratio ≈ paper 70 · paper-2 20 · ink 9 · accent 1.
- Headlines and primary buttons are `--q-ink`; body copy `--q-ink-2`; labels and metadata
  `--q-muted`.
- `--q-muted-2` (2.98:1) is for non-essential text only (spec labels, counts, placeholders of
  placeholders). This and small accent text are **accepted contrast exceptions**, kept to match the
  reference exactly; `tests/catalog.spec.ts` allows exactly these colours and nothing else.
- **The accent** (`--q-accent`, molten `#E0531A` by default) is punctuation only: the headline full
  stop, one italic phrase, a status dot, the process rail, hover heat on links and ghost buttons.
  Never a fill, never a button, never a section.
- **quiet addition — swappable accent:** a product sets its own with `<QuietRoot accent="…">`;
  the punctuation-only rule doesn't change.
- **quiet addition — dark mode:** derived from the same grey ladder, inverted
  (`data-mode="dark"`). Ink becomes the light end, so primary buttons turn light. The brand
  itself is light-only; the Optimus Foundry site stays light.
- Status has no semantic colours: success = ink + dot/✓, warning = hollow accent dot, error =
  accent hairline + accent dot.

## Type

- **Inter Tight** for everything; **JetBrains Mono** 10–12px caps at +0.08em for eyebrows,
  serials, labels, table headers and metadata. No serif.
- Display 700 (`--q-type-display`, clamp 56–128), H2 700 (68/52/40), H3/H4 600 (30/24).
  Italic of the same weight for the one emphasised phrase.
- Headlines end with an accent full stop and carry one italic phrase (`<Headline>`).
- App surfaces use the roles only: `font: var(--q-role-*)` — page-title 40, section-title 24,
  card-title 17, metric 40, body-lg 17, body 15, small 13, label 11 mono.
- Tabular numbers (`.q-tnum` / `data-numeric`) for anything that aligns or updates.
- Sentence case for headlines and buttons; mono labels in ALL CAPS.

## Space, density & layout

- Strict 8px ladder (`--q-space-1` = 8 … `--q-space-20` = 160). 4px steps (`-0-5`, `-1-5`)
  only inside controls.
- **Pick a density first** on the root: `marketing` (default), `app`, `compact`. Then space by
  job, not by step: `--q-space-inline`, `-stack`, `-field`, `-card-pad`, `-card-gap`, `-block`,
  `-section`, `--q-grid-gutter`. Never mix densities on one surface.
- Line heights and control heights are multiples of 4. Controls 32/40/48; fields 36/48/56; rows
  32 (compact) / 48.
- Fixed widths only: sidebar 240 (64 collapsed), settings nav 200, list pane 360, detail panel
  400, form/prose 640, app content 1040, site max 1280, top bar 64.

## Shape & depth

- Radii scale with the surface: xs 6 (checkboxes), sm 10 (tooltips, menu/nav items, segments),
  md 14 (inputs, alerts), lg 20 (cards, tables, popovers, toasts), xl 28 (dialogs, drawers,
  palette), pill (buttons, tags, switches, dots). Never 0 on a container.
- Hairlines before shadows: `--q-ink` for section tops and emphasis, `--q-rule-soft` for
  dividers and card edges.
- Shadows only on floating surfaces: `--q-shadow-1` (selected segment), `-2` (popovers, menus,
  toasts, card hover), `-3` (dialogs, drawers, palette). Floating surfaces use a soft hairline +
  shadow, not an ink border. The only translucency is the dialog scrim.

## Motion

- Slow and soft: `--q-dur-hover` (0.22s) with `--q-ease-soft` for hovers; `--q-dur-move` for
  indicators and morphs. **Never a bounce**, no press shrink.
- One moving thing per surface. Nothing scroll-triggered. Ambient loops in seconds.
- Morph containers instead of swapping them (pill → palette). Expand with
  `grid-template-rows: 0fr → 1fr`, never `height: auto`.
- `prefers-reduced-motion` collapses durations to 0 and stops loops at their finished state.

## States & focus

Design every state in both modes: idle, hover, focus, active, disabled (opacity 0.4), loading,
empty, error. Fields focus with an ink border plus `--q-ring-focus`; everything else that takes
keyboard focus shows `--q-focus-outline` (the reference's soft ring alone is too faint to see).
Nothing shifts layout between states.

## Voice

Say the literal thing; we/you; no exclamation marks; name real things. Banned: AI-powered,
AI-native, next-generation, seamless, delightful, empower, leverage, utilize, scalable, solutions,
game-changer, stay tuned. Full rules: `docs/reference/optimus-design/readme.md`.
