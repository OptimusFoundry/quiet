# Layout

Start every product screen from a template, not a blank page. The templates are
`docs/reference/optimus-design/ui_kits/app/` (dashboard, list-detail, settings), and the Storybook
**Patterns** stories rebuild them with quiet components. Copy the shell and change the content.

## The app shell

Storybook: `patterns-app-shell--default`.

```
┌──────────┬───────────────────────────────────────────────────────┐
│ Sidebar  │ top bar 64: Breadcrumb · Notifications · Search ⌘K · Avatar menu │
│ 240      ├───────────────────────────────────────────────────────┤
│ Wordmark │ main (scrolls)                                         │
│ groups   │   max 1280, padding --q-space-section / --q-space-page-x│
│ footer:  │   blocks separated by --q-space-block                  │
│ account  │                                                       │
└──────────┴───────────────────────────────────────────────────────┘
```

| Part | Component | Notes |
|---|---|---|
| Root | `QuietRoot density="app"` (or `ThemeProvider` + a `data-density="app"` wrapper) | one density for the shell |
| Side nav | `Sidebar` with `groups`, `header={<Wordmark size="nav" />}`, account `footer` | 240 wide, `collapsible` to a 64 rail; `breakpoint` auto-collapses. Give `label` if there are two navs. |
| Top bar | `Breadcrumb` + `Button variant="outline" size="sm"` ×2 + `DropdownMenu` on an `Avatar` | height `--q-h-topbar` (64), soft bottom hairline |
| Search | `CommandPalette` (⌘K via `hotkey`) | one per app, mounted in the shell |
| Notifications | `Drawer size="sm"` notification centre | system events persist here; see [patterns.md](patterns.md#notifications-and-toasts) |
| Toasts | `Toast`, bottom-right, max 3 | feedback on the user's own action only |
| Main | `<main>` landmark, scrolls independently | one per page |

Marketing pages use `NavBar` instead of `Sidebar`. Never put both on one screen.

## Page anatomy

Every page in `main` follows this order:

1. **`PageHero size="md"`**: `eyebrow` (mono context, e.g. "WORKSPACE"), `title` with the molten
   period, optional `description` (body-lg), `actions` (at most one primary plus secondaries). It is
   the one page title, so `as="h1"`.
2. **Optional page-level status**: one `Alert` or `Banner`, never more than one stacked.
3. **Blocks**, each opened by `SectionHeader size="sm"` (title, optional `description` and
   `actions`), separated by `--q-space-block`.
4. **No footer chrome** in app pages. Pagination belongs to its table, not the page.

## Widths

Use the fixed widths; never invent new ones.

| Token | px | For |
|---|---|---|
| `--q-w-sidebar` / `--q-w-sidebar-collapsed` | 240 / 64 | app side nav |
| `--q-w-settings-nav` | 200 | settings section nav |
| `--q-w-list-pane` | 360 | list in list-detail |
| `--q-w-detail-panel` | 400 | inspector / side detail |
| `--q-w-form` | 640 | forms, prose, settings column, chat column |
| `--q-w-content` | 1040 | max for reading content |
| `--q-w-max` | 1280 | page max |
| `--q-h-topbar` | 64 | app top bar |

Reading text never exceeds `--q-w-content`, and forms never exceed `--q-w-form`.

## Grid

- `<Grid columns={12} gap="var(--q-grid-gutter)">` with `<Col span>`. App spans: **3 · 4 · 6 · 8 · 9 · 12**.
- Section heads split 5 + 6 (the right side starts at column 7).
- Typical blocks: 4 × `StatCard` at span 3; a table at span 8 next to an activity `List` at span 4;
  a chart at span 8 with a `DonutChart` at span 4.
- `Grid` measures its own width: under 720px every `Col` spans 12, and at 720–960px spans under 4 become
  6. Override with `spanMd` / `spanSm`.
- `GridOverlay` (Ctrl/⌘+G) checks alignment in development. Mount it in the shell with
  `offsetLeft={240}`, never in production builds.
- `PageShell layout="single|half|third|sidebar|sidebar-right"` is the shortcut for simple column
  pages. It stacks under 720px.

## Layout templates

| Screen | Structure | Storybook |
|---|---|---|
| Dashboard | PageHero → Alert? → 4 × StatCard (3) → chart or Table (8) + List (4) | `patterns-dashboard--default` |
| List + detail | 360 list pane (TextField search, FilterTabs, List) + detail (PageHero md, Tabs, content) | `patterns-records--default` |
| Settings | 200 sticky section nav + 640 form; sections separated by `--q-space-section`; Switch rows on hairlines; danger zone last | `patterns-settings--default` |
| Billing / usage | PageHero → plan Card + CostMeter → BudgetLeash per agent → invoices Table | `patterns-billing--default` |
| Assistant | 640 chat column (ChatThread + ChatComposer) with an optional 400 detail panel for AgentRun / Receipt | `patterns-assistant--default` |
| States | loading (Skeleton), empty (EmptyState / GhostFuture), error (Alert + retry) | `patterns-states--default` |

## Responsive and mobile

- Below the `Sidebar` `breakpoint` it collapses to the 64 rail. On phones, hide it behind a
  top-bar button that opens the same nav in a `Drawer side="left"`.
- List-detail becomes two routes on small screens: the list, then the detail with a Breadcrumb back.
  Never squeeze both panes side by side under 720px.
- Tables: keep `Table`/`DataGrid` scrolling horizontally inside their card (`minWidth`). Don't
  reflow cells into cards unless the pattern is designed for it.
- Use 16px side gutters on phones (`--q-space-2`) and never allow horizontal page scroll.
- Touch targets stay at least 32 high (`size="sm"` controls are 32).
