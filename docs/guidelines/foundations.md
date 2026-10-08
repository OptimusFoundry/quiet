# Foundations

This page covers the tokens and the rules for using them. Component styles use tier-2 (semantic) and tier-3 (component)
tokens only (see [AGENTS.md](../../AGENTS.md)). App code follows the same rule: if you're writing a raw
colour, size or duration, there is a token for it.

## Colour

### The ladder

| Job | Token | Reference name | Use |
|---|---|---|---|
| Ground | `--q-bg` | paper | page, cards, fields |
| Alternate ground | `--q-bg-subtle` | paper-2 | alternate sections, selected rows, user chat bubbles, wells |
| Inverse | `--q-bg-inverse` | ink | primary button only |
| Heading text | `--q-fg` | ink | titles, values, emphasis, section rules |
| Body text | `--q-fg-body` | ink-2 | default paragraph text |
| Secondary text | `--q-fg-muted` | muted | metadata, help, table secondary lines |
| Quiet text | `--q-fg-subtle` | muted-2 | non-essential only (fails AA, by design) |
| Divider | `--q-border` | rule-soft | card edges, list and table dividers |
| Hover edge | `--q-border-strong` | rule-strong | card hover, emphasis edges |
| Accent | `--q-accent` | molten | punctuation (below) |

Ratio on any screen: **Paper 70 · Paper-2 20 · Ink 9 · Molten 1.** If a screenshot looks orange,
too much molten is in use.

### The molten rule

Molten (`--q-accent`) marks **one thing that matters**. Allowed:

- the full stop after a page title (`PageHero`/`Headline` add it);
- one italic accent phrase in a headline (`accent` prop);
- a status dot or mark: warning, error, the human step in `AgentRun`, a stale step in `LineageChip`,
  the doubt underline in `DoubtMarker`, a cap warning in `CostMeter`;
- a focus or "past the line" hairline (`ElasticSlider`, `ThresholdHandles`).

Never use it for a fill, a button, a section background, a banner, a large text block, or a second accent colour.
Primary actions are **ink**, not molten.

**Charts are the exception.** In `Sparkline`, `LineChart`, `BarChart`, `DonutChart` and
`NarratedChart`, molten is series 1, the data the user cares about. Comparison series step through ink then greys
(`--q-chart-series-1…5`). Labels, values and axes never take a series colour.

### Status without green or red

The brand defines no green/red. The status language is:

| Status | Look | Components |
|---|---|---|
| Info | soft hairline + `i` | `Alert variant="info"`, `Banner status="info"` |
| Success / done | ink + ✓, solid ink dot | `Alert variant="success"`, `Badge variant="success"`, `Toast variant="success"` |
| Warning | molten hollow dot / molten `!` | `Alert variant="warning"`, `Badge variant="warning"` |
| Error | molten hairline + molten `!` | `Alert variant="error"`, `Badge variant="error"`, field `error` props |

If the `--q-status-*` tokens are present (theme work in progress), style any custom status surface
with them. Never introduce `#16a34a`-style greens or reds, even "just for this badge".

### Dark mode and product themes

- Themes are `[data-theme]` blocks: `foundry` (default) and `foundry-dark`, plus one per product.
  Set the theme app-wide with `<ThemeProvider>` (it writes `data-theme` on `<html>`), or for a subtree with
  `<QuietRoot theme>`.
- A product gets its identity from a **theme** (palette, accent, type, shape, density, per-component
  tokens), never from forking components. The rules on this page stay the same in every theme.
- `QuietRoot accent="…"` swaps the accent for a product. The molten rule still applies to whatever colour
  it becomes.
- Check every screen in both `foundry` and `foundry-dark`. Never hard-code a light-only value.

### Contrast exceptions (kept on purpose)

`--q-fg-subtle` (≈2.98:1) and small molten text (≈3.87:1) are below AA and are kept exactly as
designed. Use `--q-fg-subtle` only for text that isn't needed (decorative serials, dimmed future
items). Anything a user must read uses `--q-fg-muted` or darker.

## Type

Two families: **Inter Tight** (`--q-font-sans`) for everything, and **JetBrains Mono** (`--q-font-mono`)
for labels, serials and metadata. No serif. Emphasis is the italic of the same weight.

App surfaces use **only these roles**:

| Role | Size / line | Weight | Token | Use |
|---|---|---|---|---|
| page-title | 40 / 40 | 700 | `--q-text-4xl` | one per screen, molten period (`PageHero size="md"`) |
| section-title | 24 / 32 | 600 | `--q-text-2xl` | block headings (`SectionHeader size="sm"`) |
| card-title | 17 / 24 | 600 | `--q-text-lg` | cards, list headers, dialog sections |
| metric | 40 / 40 | 700 tabular | `--q-text-4xl` | `StatCard` values |
| body-lg | 17 / 28 | 400 | `--q-text-lg` | app intros under a page title |
| body | 15 / 24 | 400 | `--q-text-md` | default app copy, inputs, lists, menus |
| small | 13 / 20 | 400 | `--q-text-sm` | secondary lines, table cells, help |
| label | 11 / 16 mono caps | 400 | `--q-text-2xs` | eyebrows, table headers, metadata |

Marketing pages add `display` (clamp 56–128) and hero 68. **Never** use them in a product.

Hierarchy per screen: one page title, then section titles, then card titles. Never skip
levels, and never style body text bold to fake a heading. Use `Text` (`size`, `color="heading|muted|quiet"`,
`mono`) for copy instead of hand-styled spans.

## Spacing by job

Set density on the root and use the job tokens. They change with density, raw steps don't.

| Job | Token | app | compact |
|---|---|---|---|
| icon ↔ label, chip ↔ chip | `--q-space-inline` | 8 | 8 |
| lines inside a card | `--q-space-stack` | 16 | 8 |
| field ↔ field | `--q-space-field` | 24 | 16 |
| card padding | `--q-space-card-pad` | 24 | 16 |
| card ↔ card | `--q-space-card-gap` | 24 | 16 |
| block ↔ block | `--q-space-block` | 32 | 24 |
| section padding | `--q-space-section` | 48 | 32 |
| grid gutter | `--q-grid-gutter` | 24 | 16 |

Never put 12, 20 or 28 px between blocks. Inside a control, 4 px steps are fine. Every line height and
control height is a multiple of 4. Controls are 32 / 40 / 48, fields 36 / 48 / 56, rows 32
(compact) / 48.

## Shape and depth

- **Radius by surface:** `--q-radius-xs` 6 checkboxes · `sm` 10 tooltips, menu/nav items · `md` 14
  inputs, alerts · `lg` 20 cards, tables, popovers, toasts · `xl` 28 dialogs, drawers · `pill`
  buttons, tags, switches, dots, progress. Never 0 on a container.
- **Hairlines first:** 1px `--q-border` for dividers and card edges; an ink rule (`--q-fg`) only for
  section tops and emphasis. Alternate areas use `--q-bg-subtle` between hairlines.
- **Shadows only float:** `--q-shadow-1` selected segment, `--q-shadow-2` popovers, menus, toasts,
  card hover, `--q-shadow-3` dialogs, drawers, palette. Never on text. No glassmorphism. The only
  transparency is the dialog scrim (`--q-scrim`).

## Motion

- Hover and state changes take `--q-dur-hover` (0.22s) with `--q-ease-soft`. Enter takes `--q-dur-enter`, exit
  `--q-dur-exit`, expand `--q-dur-expand`. Loops use `--q-ease-forge`.
- Slow, ease-out, **never a bounce or spring overshoot, no press shrink.** One moving thing per
  surface. Nothing scroll-triggered. No constant ambient motion in product UI.
- Reduced motion is handled by the tokens (durations drop to 0). Don't add your own `transition: 0.3s`
  that bypasses them.
- Use the shared motion utilities (`q-anim-*` with `data-state`, `q-collapse`) for open/close.

## Density

| Mode | Where |
|---|---|
| `marketing` | the website only (QuietRoot's default) |
| `app` | dashboards, lists, detail pages, settings, chat. **The product default.** |
| `compact` | dense tables, inspectors, admin consoles |

Pick one per surface. A compact table inside an app page gets its own `data-density="compact"`
container; never mix inside one card.
