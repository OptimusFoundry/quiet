# quiet — DESIGN.md

quiet is a **1:1 copy of the Optimus Foundry "Soft" design system** from Claude Design
(project `daa56afb-593e-422a-ab8a-5ecfa9309fb9`, "Rounder softer design system"). The spec is the
reference itself, mirrored byte-for-byte in [`docs/reference/optimus-design/`](docs/reference/optimus-design/):

- [`readme.md`](docs/reference/optimus-design/readme.md) — the rules: colour, type, density,
  spacing by job, radii, motion, voice, banned words.
- `components/<group>/<Name>.prompt.md` — how to use each component, with examples.
- `components/<group>/<Name>.d.ts` — each component's props.
- `guidelines/*.card.html` — foundation specimens; `ui_kits/` — app and website templates.

## What quiet adds (and nothing else)

- **Dark mode** — `<QuietRoot mode="dark">`, derived from the same grey ladder inverted
  (`src/styles/quiet-modes.css`). The brand itself is light-only; the Optimus Foundry site stays light.
- **Swappable accent** — `<QuietRoot accent="…">` replaces molten for another product. The rule
  doesn't change: the accent is punctuation only, never a fill.
- **Density** — `<QuietRoot density="app">` sets the reference's own `data-density` modes.

- **Accessibility + motion layer** — keyboard operation and focus management per WAI-ARIA patterns,
  visible keyboard focus, accessible names and states, and eased open/close/state motion in the
  reference's own motion language. It never changes the at-rest look (pixel parity is tested).

Everything else — tokens, styling, the catalog page — is the reference, unchanged. Colour contrast
is a deliberate exception: `--muted-2` (2.98:1) and small molten text are kept exactly as designed.
