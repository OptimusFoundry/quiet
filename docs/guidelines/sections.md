# Sections

How to break a page into parts. A page is **a stack of sections**, each section is **a heading plus
content**, and each section sits in one container. **Grounds and spacing group;
lines don't.** Specimen: Storybook `foundations-sections--default`; the components are under **Components/App**
(`Panel`, `DescriptionList`).

## The containers (app)

| Container | Looks like | Use when | Build |
|---|---|---|---|
| **Plain** | title + content, no ground | the page's lead block, in the page's flow | `Panel variant="plain"` |
| **Surface** (default) | the warm `--q-bg-subtle` ground, radius `--q-radius-lg`, no edge | any titled section of a detail, settings or dashboard page | `Panel` (`title`, `actions`, `count`, `empty`) |
| **Outlined** | `--q-bg` with a 1px `--q-border` edge | a self-contained module beside peers in a grid (a chart cell, a plan summary) | `Panel variant="outlined"` |
| **Rows** | table rows on faint `--q-border` dividers; list rows set apart by space and a hover ground, no lines | repeated rows of one kind, **inside** a container | `Table`, `List`, `DescriptionList` (no lines at all) |

Two more surfaces are components, not containers:

- **`Card`** is an **object you can open**: `href`/`onClick`, an eyebrow, a title and meta, in a grid
  of peers (projects, templates). Never a generic box.
- **`StatCard`** is for a metric.

**Decision rule:** a titled section is a surface `Panel`. Use `plain` for the one block that leads
the page, `outlined` only for a module in a grid. Use a line only to separate rows of a table or list.

- **Tables:** a table lies on the panel's white, never on a grey surface or in a frame: its head row
  and faint row dividers are structure enough. A list page puts it straight under its filters; a table
  that is one section of a page takes `Panel variant="plain" padding="none"` for its title, count
  and footer (pagination).
- **Properties:** label/value pairs are a `DescriptionList` (`layout="inline"`; `"stacked"` in a 400
  side rail), never hand-rolled rows with the value pushed to the far right.
- **Empty sections collapse:** give the Panel `empty="Not used yet."` and it shrinks to its title and
  one muted line. Never give "No inputs" the same space as a full section.

## Nesting

Use at most **3 levels: page → section → container**. Inside a container, subdivide with `gap` or
row hairlines, never another box.

| Allowed | Not allowed |
|---|---|
| section → `Panel` → table / list / `DescriptionList` | `Panel` → `Panel` (card-in-card) |
| a grid of outlined `Panel`s | `Card` → anything with its own border |
| `Panel` → text, chart, `FileCard`s, actions | an ink or hairline rule between sections |
| a surface `Panel` in a 400 right rail | a titled `Panel` inside a `Panel` |

## Section headings

| Where | Heading | Gap below |
|---|---|---|
| Page | `PageHeader` (one `h1`) | `--q-space-block` |
| Section on an app page | `Panel title` (an `h2`; `as="h3"` inside a nested section) | built in |
| A group with no visible title (a toolbar, a status line) | none; name it with `aria-label` if it's a landmark | — |

- A long-form section that isn't a container (docs, an explanatory settings group) is a
  `Panel variant="plain"`. It has no rule.

**Actions:**
- **Placement:**
  - Page-wide actions go in `PageHeader actions`, with one primary.
  - Section actions go in `Panel actions` (top right) and act on that section only.
  - A row's actions sit at the end of the row.
- **Order:** a row of buttons ends with the primary, at most one per view. Bulk actions replace the toolbar while rows are selected.

## Section types

| Type | Build | Spacing |
|---|---|---|
| Page header | `PageHeader` (back link or eyebrow, title, status, meta, description, actions, tabs), under the TopBar's breadcrumb | then `--q-space-block` |
| Page status | a `NoticeChip` in the TopBar for a condition on this page; an `Alert` in the block it concerns. Workspace-wide conditions are the frame's (`ShellNotice`) | — |
| Toolbar / filter bar | a row: segmented `Tabs variant="enclosed" size="sm"`, search `TextField size="sm"`, `Select size="sm"` filters, then ghost actions on the right | `--q-space-inline` within, `--q-space-stack` to the table |
| Content block | a surface `Panel` | `--q-space-block` between blocks |
| Card group | `Grid columns={12}` of `Card`s or outlined `Panel`s, equal spans | gutter |
| Properties | `DescriptionList` in a `Panel`, or alone in the right rail | built in |
| Files / versions | `FileCard`s in a `Panel` (the current version first, with a `Current` badge) | `--q-space-stack` |
| Run history | `Transcript` in a `Panel variant="plain"` | built in |
| Settings section | a surface `Panel` in the 640 column; switches as rows | `--q-space-field` within, `--q-space-section` between |
| Danger zone | the last section: `Panel variant="outlined"` with an `--q-status-error-border` edge, text left and a `HoldButton`/destructive button right | as settings section |
| Footer actions | the last row of a form column: secondary, then primary | `--q-space-block` above |

## Long pages: scroll, tabs or nav

| Content | Use |
|---|---|
| ≤ 3 sections | one page, scroll |
| 2–4 peer views of **one object** the user switches between (Overview / Activity / Settings) | `Tabs` in `PageHeader tabs` |
| > 4 groups, or reference content the user scans | sticky section nav (200) + one scrolling column: the Settings layout |
| Steps with an order | Wizard ([layouts.md](layouts.md#wizard)) |

Never put tabs inside tabs, and never put tabs and a section nav on one page.

## Order

1. **Status first:** a page's condition is its TopBar `NoticeChip`; a problem with one block is an `Alert` at the top of that block.
2. **The most-used block next, and it gets the most width** (the main column, or first in the stack).
3. Supporting blocks after, narrower (the right rail) or lower.
4. **Empty blocks last and collapsed.**
5. **Destructive last:** the danger zone ends the page, alone.

Sections aren't equal. If every block has the same size, weight and box, the page has no entry
point, so give one block the lead.

## Don't

| Slop | Fix |
|---|---|
| Sections separated by ink or hairline rules | surface `Panel`s and `--q-space-block` |
| A border round a surface `Panel`, or a ground under a table | the warm ground alone; the table on white |
| Seven sections with the same small heading and no ground | one lead (`plain`), the rest surface `Panel`s, empty ones collapsed |
| Label at the far left, value at the far right | `DescriptionList` |
| Card in a card, a table on a surface or in a frame | one container level; a table on the panel's white (`Panel variant="plain"`) |
| Two `Alert`s stacked, or a `Banner` repeated on every page | one status, the highest severity; workspace conditions go in the frame (`ShellNotice`) |
| Section actions in the page header (or the reverse) | actions sit with what they act on |
| Equal-weight blocks in a 4 + 4 + 4 with no lead | 8 + 4, or put the lead first |
| A "danger" button in the middle of a page | the danger zone, last |
