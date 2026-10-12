# Foundations

This page covers the tokens and the rules for using them. Component styles use tier-2 (semantic) and
tier-3 (component) tokens only (see [AGENTS.md](../../AGENTS.md)). App code follows the same rule,
with one more: an app uses **tier-2 tokens only**. A component's tier-3 tokens (`--q-panel-*`,
`--q-top-bar-*` …) are declared in that component's stylesheet, which a production build includes
only where the component is imported; styled with them, your markup works in dev and breaks in
production. If you're writing a raw colour, size or duration, there is a token for it.

## Colour

### The ladder

| Job | Token | foundry | Use |
|---|---|---|---|
| Canvas | `--q-bg-canvas` | a breath darker than white (darker than the panel in dark themes) | behind the Sidebar and around the panel (AppShell reads it), and behind a sign-in page on the same frame |
| Ground | `--q-bg` | white | the panel, fields, tables, overlays |
| Warm ground | `--q-bg-subtle` | #fcfcfc warmed 0.5% toward the accent | `Panel` surfaces, wells, user chat bubbles, ghost hovers |
| Inverse | `--q-bg-inverse` | soft ink | tooltips |
| Heading ink | `--q-fg` | #3b3b42 | titles, values, emphasis |
| Body ink | `--q-fg-body` | #5b5b63 | paragraphs and default text |
| Secondary text | `--q-fg-muted` | | metadata, help, table secondary lines |
| Quiet text | `--q-fg-subtle` | | decoration only (fails AA, by design) |
| Divider | `--q-border` | | faint row dividers, pane edges |
| Accent | `--q-accent` | lava | marks only (below) |

Grounds group; lines don't. The warm ground needs no edge beside white, and an overlay floats on its
shadow, not a border.

### Lava: the accent

The accent says "you can act here" and "this is where you are". It's a saturated orange ("lava",
never mixed toward black into rust), derived in oklch from `--q-accent`. Components apply it;
screens never pick an accent token by hand except through the roles below.

| Role | What takes the accent | Token | Built into |
|---|---|---|---|
| Links | link text and its resting underline (solid on hover) | `--q-accent-fg`, `--q-accent-border` | `Link`, `EntityLink`, bare `<a>` in prose |
| Primary action | the one primary button per view | `--q-accent-bg`, `--q-accent-bg-hover`, `--q-fg-on-accent` | `Button variant="primary"` |
| Current place | the current nav item's icon (its pill is white), the current page and step | `--q-accent-fg`, `--q-accent` | `Sidebar`, `Pagination`, `StepIndicator` |
| Selected / checked | selected rows, checked controls, slider fill | `--q-accent-subtle`, `--q-accent-bg` | `Table`, `List`, `Checkbox`, `Radio`, `Switch`, `Slider` |
| Focus | the keyboard focus ring, focused field edges, text selection | `--q-focus-ring-color`, `--q-accent`, `--q-selection-bg` | every control |
| Progress | the filled part of a bar | `--q-accent` | `Progress` |
| Attention | warning and error surfaces (a 3% tint) and marks | `--q-status-warning-*`, `--q-status-error-*` | `Badge`, `Alert`, `Banner`, `toast()` |
| Tinted surface | one highlighted thing: the file-type tile, a "primary" badge | `--q-accent-subtle` | `FileCard`, `Badge variant="primary"` |

- **Never** a section, panel, page or banner background; never body text or a paragraph; never a
  second accent hue. Ink carries the text; white and the warm grey carry the surfaces.
- **One primary per view.** If three buttons are orange, two of them are secondary or ghost.
- **Contrast:** `--q-accent` itself is ≈3.87:1 on white, so it is for marks, dots, rings and
  graphics only. Text uses `--q-accent-fg` and fills `--q-accent-bg`, both AA on white and the warm
  ground (foundry-dark uses the accent itself on its dark grounds).

| Tier-2 accent token | Job |
|---|---|
| `--q-accent` | marks, dots, rings, chart series 1 |
| `--q-accent-fg` | accent text and links |
| `--q-accent-bg` / `--q-accent-bg-hover` | accent fills (primary button, checked controls) |
| `--q-fg-on-accent` | text on an accent fill |
| `--q-accent-subtle` / `--q-accent-subtle-hover` | tinted surface: selected, highlighted |
| `--q-accent-border` | tinted edge; the resting underline of a link |

They derive from `--q-accent`, so `QuietRoot accent` and a product theme's `--q-molten-500` carry
through.

**Charts are the exception.** In `Sparkline`, `LineChart`, `BarChart`, `DonutChart` and
`NarratedChart`, the accent is series 1, the data the user cares about. Comparison series step
through ink then greys (`--q-chart-series-1…5`). Labels, values and axes never take a series colour.

### Status: tokens, not hues

Status colour comes from the theme through `--q-status-{info,success,warning,error}-{fg,bg,border}`
(`fg` = glyphs, dots, fills and status text · `bg` = a status surface · `border` = its edge).
Components read them through their own tier-3 tokens; see
[DESIGN.md](../../DESIGN.md#status-colour).

In `foundry` and `foundry-dark` the brand has no green or red, so the tokens resolve to ink and the
accent, and every status has a surface so it reads without its dot: info and success on the warm
ground, warning and error on a 3% accent tint (error with an accent edge).

| Status | Look | Components |
|---|---|---|
| Info | warm ground, muted icon | `Alert variant="info"`, `Banner status="info"` |
| Success / done | ink + check icon, solid ink dot | `Alert variant="success"`, `Badge variant="success"`, `toast({ status: "success" })` |
| Warning | accent tint, accent icon | `Alert variant="warning"`, `Badge variant="warning"` |
| Error | accent tint and edge, accent icon | `Alert variant="error"`, `Badge variant="error"`, `toast({ status: "error" })` (announced assertively), field `error` props |

A **product theme may give them real hues** (a green success, a red error) in its own
`@layer q.themes` block; that is the only place a status hue is ever set. Use the components'
`variant`/`status` props, style any custom status surface with `--q-status-*`, and never write a raw
`#16a34a`-style colour in a component or screen, even "just for this badge".

### Dark mode and product themes

- Themes are `[data-theme]` blocks: `foundry` (default) and `foundry-dark`, plus one per product.
  Set the theme app-wide with `<ThemeProvider>` (it writes `data-theme` on `<html>`), or for a
  subtree with `<QuietRoot theme>`. A QuietRoot without `theme` follows the enclosing ThemeProvider.
- A product theme lives in the **product's repo**: register it before the first render with
  `defineThemes({ acme: { label: "Acme", colorScheme: "light" } })` and style it in
  `@layer q.themes`. The full contract (must-set and may-set tokens, fonts, density, reduced motion)
  is [DESIGN.md → Product themes](../../DESIGN.md#product-themes).
- A product gets its identity from a **theme** (palette, accent, type, shape, density, per-component
  tokens), never from forking components. The rules on this page stay the same in every theme.
- `QuietRoot accent="…"` swaps the accent for a product; check `--q-accent-fg` still reaches 4.5:1.
- Check every screen in both `foundry` and `foundry-dark`. Never hard-code a light-only value.

### Contrast exceptions (kept on purpose)

`--q-fg-subtle` (≈2.98:1) and `--q-accent` (≈3.87:1) are below AA and are kept as designed: the
first for text nobody needs to read (decorative serials, dimmed future items), the second for marks.
Anything a user must read uses `--q-fg-muted` or darker; accent text uses `--q-accent-fg`.

## Type and spacing

Moved to their own pages: [typography.md](typography.md) (the eight roles, ink, hierarchy, measure)
and [spacing.md](spacing.md) (the scale, job tokens per density, what goes between what). Grid and
page layouts: [grid.md](grid.md), [layouts.md](layouts.md), [sections.md](sections.md).

## Shape and size

- **Controls are dense pills.** Buttons, tags, badges, switches and segmented tabs are
  `--q-radius-pill`, 32 high (`--q-control-sm`, `size="sm"`). Fields (`TextField`, `Select` …) are
  36 (`--q-field-md`).
- **Radius by surface:** `--q-radius-sm` 10 menu and nav items, tooltips · `md` 14 fields, alerts,
  the app panel · `lg` 20 `Panel`s, cards, popovers, toasts · `xl` 28 dialogs, the command palette ·
  `pill` controls. Never 0 on a container.
- **Grounds, not rules:** sections group with `Panel` surfaces (`--q-bg-subtle`, `--q-radius-lg`, no
  edge) and spacing. Lines only as faint dividers between table and list rows and as the edge between
  two panes. No ink rules, no hairline between sections, no border round a surface.

## Depth

- **The frame:** the panel and the third pane sit on the canvas with `--q-shadow-1` and an inset
  of 8; nothing else in a screen has a shadow at rest.
- **Shadows only float:** the Sidebar's current pill and a selected segment take `--q-shadow-1`;
  menus, popovers, dialogs, the palette and toasts float on `--q-shadow-float`, with no edge.
  Never on text. No glassmorphism. The only transparency is the dialog scrim (`--q-scrim`).

## Motion

- Hover and state changes take `--q-dur-hover` with `--q-ease-soft`. Enter takes `--q-dur-enter`,
  exit `--q-dur-exit`, expand `--q-dur-expand` (the third pane opening, the Sidebar collapsing).
- Slow, ease-out, **never a bounce or spring overshoot, no press shrink.** One moving thing per
  surface. Nothing scroll-triggered. No constant ambient motion in product UI.
- Reduced motion is handled by the tokens (durations drop to 0). Don't add your own
  `transition: 0.3s` that bypasses them.
- Use the shared motion utilities (`q-anim-*` with `data-state`, `q-collapse`) for open/close.

## Density

`data-density` is spacing only; the look is the same in both.

| Mode | Where |
|---|---|
| `comfortable` (default) | dashboards, lists, detail pages, settings, chat |
| `compact` | dense tables, inspectors, admin consoles |

Pick one per surface. A compact table inside a comfortable page gets its own
`data-density="compact"` container; never mix inside one panel. `density="app"` and `"marketing"`
are deprecated aliases of `comfortable`.
