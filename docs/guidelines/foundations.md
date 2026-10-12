# Foundations

This page covers the tokens and the rules for using them. Component styles use tier-2 (semantic) and tier-3 (component)
tokens only (see [AGENTS.md](../../AGENTS.md)). App code follows the same rule: if you're writing a raw
colour, size or duration, there is a token for it.

## Colour

### The ladder

| Job | Token | Reference name | Use |
|---|---|---|---|
| Ground | `--q-bg` | paper | page, cards, fields |
| Alternate ground | `--q-bg-subtle` | paper-2 (app look: `--q-gray-25` warmed by 1% accent) | alternate sections, Panels, user chat bubbles, wells |
| Inverse | `--q-bg-inverse` | ink | selected chips |
| Heading text | `--q-fg` | ink | titles, values, emphasis |
| Body text | `--q-fg-body` | ink-2 | default paragraph text |
| Secondary text | `--q-fg-muted` | muted | metadata, help, table secondary lines |
| Quiet text | `--q-fg-subtle` | muted-2 | non-essential only (fails AA, by design) |
| Divider | `--q-border` | rule-soft | card edges, list and table dividers |
| Hover edge | `--q-border-strong` | rule-strong | card hover, emphasis edges |
| Accent | `--q-accent` | molten | the brand colour (below) |

### Molten: the brand colour

Molten is the brand colour: it says "you can act here" and "this is where you are". Components do
it for you; screens never pick a molten token by hand except through the roles below.

| Role | What takes molten | Token | Built into |
|---|---|---|---|
| Links | link text and its resting underline (solid on hover) | `--q-accent-fg`, `--q-accent-border` | `Link`, `EntityLink`, bare `<a>` in prose, `Breadcrumb` hover |
| Primary action | the one primary button per view | `--q-accent-bg`, `--q-accent-bg-hover`, `--q-fg-on-accent` | `Button variant="primary"` |
| Current place | the current nav item (tint + accent text and icon), the current page, step, tab | `--q-accent-subtle`, `--q-accent-fg`, `--q-accent` | `Sidebar`, `Pagination`, `StepIndicator`, `Tabs` (line indicator, pill fill) |
| Selected / checked | selected rows and filters, checked controls, slider fill | `--q-accent-subtle`, `--q-accent-bg` | `Table`, `List`, `Tabs variant="enclosed"`, `Checkbox`, `Radio`, `Switch`, `Slider` |
| Focus | the keyboard focus ring, focused field edges, text selection | `--q-focus-ring-color`, `--q-accent`, `--q-selection-bg` | every control |
| Progress | the filled part of a bar | `--q-accent` | `Progress` |
| Attention | warning and error status surfaces and marks | `--q-status-warning-*`, `--q-status-error-*` | `Badge`, `Alert`, `Banner`, `toast()` |
| Tinted surface | one highlighted thing: the file-type tile, a selected item, a "primary" badge | `--q-accent-subtle` | `FileCard`, `Badge variant="primary"` |

- **Never** a section, panel, page or banner background; never body text or a paragraph; never a
  second accent hue. Ink and greys still carry the text; paper and paper-2 still carry the surfaces.
- **One primary per view.** If three buttons are molten, two of them are secondary.
- **Contrast:** `--q-accent` itself is ≈3.87:1 on paper, so it is for marks, dots, rings and
  graphics only. Text and fills use the darker step: `--q-accent-fg` / `--q-accent-bg` ≈5.6:1
  (foundry), the accent itself on dark grounds (foundry-dark).

| Tier-2 accent token | Job |
|---|---|
| `--q-accent` | marks, dots, rings, chart series 1 |
| `--q-accent-fg` | accent text and links (AA on `--q-bg` and `--q-bg-subtle`) |
| `--q-accent-bg` / `--q-accent-bg-hover` | accent fills (primary button) |
| `--q-fg-on-accent` | text on an accent fill |
| `--q-accent-subtle` / `--q-accent-subtle-hover` | tinted surface: selected, highlighted, attention |
| `--q-accent-border` | tinted edge; the resting underline of a link |

They derive from `--q-accent`, so `QuietRoot accent` and a product theme's `--q-molten-500` carry
through. A dark product theme sets `--q-accent-fg`/`-bg` to the accent itself, as foundry-dark does.

**Charts are the exception** in both looks. In `Sparkline`, `LineChart`, `BarChart`, `DonutChart` and
`NarratedChart`, molten is series 1, the data the user cares about. Comparison series step through ink then greys
(`--q-chart-series-1…5`). Labels, values and axes never take a series colour.

### Status: tokens, not hues

Status colour comes from the theme through `--q-status-{info,success,warning,error}-{fg,bg,border}`
(`fg` = glyphs, dots, fills and status text · `bg` = a status surface · `border` = its edge).
Components read them through their own tier-3 tokens (`--q-alert-<status>-*`, `--q-badge-<status>-*`,
`--q-toast-*`, `--q-progress-<status>-fill`, Tag `status`, Icon `color`); see
[DESIGN.md](../../DESIGN.md#product-themes).

In `foundry` and `foundry-dark` the brand has no green or red, so the tokens resolve to ink and
molten. In the app look every status also gets a **tinted surface**, so a badge reads without its
6px dot: info and success on `--q-bg-subtle`, warning on `--q-accent-subtle`, error on
`--q-accent-subtle` with an `--q-accent-border` edge.

| Status | Look | Components |
|---|---|---|
| Info | soft hairline + `i` | `Alert variant="info"`, `Banner status="info"` |
| Success / done | ink + ✓, solid ink dot | `Alert variant="success"`, `Badge variant="success"`, `toast({ status: "success" })` |
| Warning | molten hollow dot / molten `!` | `Alert variant="warning"`, `Badge variant="warning"` |
| Error | molten hairline + molten `!` | `Alert variant="error"`, `Badge variant="error"`, `toast({ status: "error" })` (announced assertively), field `error` props |

| Token set | foundry resolves to |
|---|---|
| `--q-status-info-*` | fg `--q-fg-muted`, border `--q-border` |
| `--q-status-success-*` | fg and border `--q-fg` (ink) |
| `--q-status-warning-*` | fg `--q-accent`, border `--q-border` |
| `--q-status-error-*` | fg and border `--q-accent` |

A **product theme may give them real hues** (a green success, a red error) in its own
`@layer q.themes` block; that is the only place a status hue is ever set. Style any custom status
surface with `--q-status-*`, use the components' `variant`/`status` props, and never write a raw
`#16a34a`-style colour in a component or screen, even "just for this badge".

### Dark mode and product themes

- Themes are `[data-theme]` blocks: `foundry` (default) and `foundry-dark`, plus one per product.
  Set the theme app-wide with `<ThemeProvider>` (it writes `data-theme` on `<html>`), or for a subtree with
  `<QuietRoot theme>`. A QuietRoot without `theme` follows the enclosing ThemeProvider.
- A product theme lives in the **product's repo**: register it before the first render with
  `defineThemes({ acme: { label: "Acme", colorScheme: "light" } })`, and style it in `@layer q.themes`
  (`[data-theme="acme"] { --q-gray-0…900, --q-molten-500, --q-shadow-rgb, --q-status-*, color-scheme }`,
  repeating quiet's layer order first). An unregistered name falls back to `foundry` and warns once in
  development. The full contract (must-set and may-set tokens, fonts, density, reduced motion) is
  [DESIGN.md → Product themes](../../DESIGN.md#product-themes).
- A product gets its identity from a **theme** (palette, accent, type, shape, density, per-component
  tokens), never from forking components. The rules on this page stay the same in every theme.
- `QuietRoot accent="…"` swaps the accent for a product. The roles above apply to whatever colour
  it becomes; check `--q-accent-fg` still reaches 4.5:1 on paper.
- Check every screen in both `foundry` and `foundry-dark`. Never hard-code a light-only value.

### Contrast exceptions (kept on purpose)

`--q-fg-subtle` (≈2.98:1) and small `--q-accent` text (≈3.87:1) are below AA and are kept exactly as
designed. Text never uses `--q-accent`; it uses `--q-accent-fg`. Use `--q-fg-subtle` only for text that isn't needed (decorative serials, dimmed future
items). Anything a user must read uses `--q-fg-muted` or darker.

## Type and spacing

Moved to their own pages: [typography.md](typography.md) (the eight roles, the component for each,
hierarchy, measure) and [spacing.md](spacing.md) (the scale, job tokens per density, what goes
between what). Grid and page layouts: [grid.md](grid.md), [layouts.md](layouts.md), [sections.md](sections.md).

## Shape and depth

- **Radius by surface:** `--q-radius-xs` 6 checkboxes · `sm` 10 tooltips, menu/nav items · `md` 14
  inputs, alerts · `lg` 20 cards, tables, popovers, toasts · `xl` 28 dialogs, drawers · `pill`
  buttons, tags, switches, dots, progress. Never 0 on a container.
- **Surfaces before rules (app):** sections group with `Panel` surfaces (`--q-bg-subtle`, radius
  `--q-radius-lg`) and spacing. 1px `--q-border` hairlines only inside dense tables and lists, and
  as card edges. No ink rules.
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
| `app` | dashboards, lists, detail pages, settings, chat. **The product default.** Turns on the app look |
| `compact` | dense tables, inspectors, admin consoles |

Pick one per surface. A compact table inside an app page gets its own `data-density="compact"`
container; never mix inside one card.
