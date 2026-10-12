# Typography

An app screen uses **eight roles** and nothing else, set in Geist (Geist Mono for code, IDs and
keys), in sentence case, on soft ink. Every role is reached through a component prop, never a
hand-set `font-size`. Specimen: Storybook `foundations-typography--default`.

## Roles

The roles are tokens (`--q-text-heading-1…4`, `--q-text-metric`, `--q-text-intro`, `--q-weight-heading`,
`--q-font-label`, `--q-text-label`, `--q-weight-label`, `--q-case-label`), in
`src/styles/tokens/_typography.scss`. A product theme may retune them; screens never set them.

| Role | Size · weight | Render it with | One per… |
|---|---|---|---|
| page-title | 24 · 650, no period | `PageHeader` (`h1`) | screen, exactly one |
| section-title | 14 · 620 | `Panel title` (`h2`); bare: `Text as="h2" heading={4}` | block |
| card-title | 14 · 620 | `Text as="h3" size="md" weight="semibold" color="heading"` | panel or list group |
| metric | 20 · 650 tabular | `StatCard` value | stat |
| intro | 14 · 450 | `PageHeader description` | page intro only |
| body | 14 · 450, line 22 | `Text` (or `size="md"`), inputs, lists, menus | default |
| small | 12 · 450 | `Text size="sm"`; table cells; help | secondary line |
| label | 11 · 550 sans, sentence case | `Label`, table headers, tabs, `StatCard` label | field, column |

- `Card`'s built-in `title` is larger than card-title. Use `Card` for clickable objects in a grid;
  for a module's heading inside a panel, use the card-title recipe above.
- `compact` density sets body at 12/18.

## The scale

`--q-text-*`: 2xs 10.5 · xs 11 · sm 12 · md 14 · lg 15 · xl 17 · 2xl 20 · 3xl 24. Screens use
**11, 12, 14, 17, 20 and 24**, each only through a role. The steps above 24 exist for a product's
own marketing pages, never an app screen.

Weights by role: body 450, names, labels and nav 550, strong 620, titles 650 (Geist is a variable
font, `fonts.css`). Line heights are ratios (`--q-leading-body` 1.55, `--q-leading-ui` 1.4,
`--q-leading-heading` 1.05); never override them.

## Ink

| Text | Token |
|---|---|
| titles, values, emphasis | `--q-fg` (soft ink, #3b3b42 in foundry) |
| paragraphs and body | `--q-fg-body` (#5b5b63) |
| metadata, help, secondary lines | `--q-fg-muted` |
| links | `--q-accent-fg` (through `Link` and `EntityLink`) |

Never black, near-black or a raw grey: dense text on white reads harsh, and the soft ink is what
makes quiet calm.

## Hierarchy

- Visual size and heading level are separate. **Level follows the outline; size follows the role.**
  The page title is `h1`; blocks are `h2`; a module inside a block is `h3`. Pass `as` to keep the
  order unbroken: `Panel as="h3"` for a nested section.
- One step down per level of nesting. Never two headings of the same size stacked with nothing between.
- Emphasis is weight (`<strong>`, 620) or ink (`--q-fg` against body's `--q-fg-body`). No italics,
  no accent text for emphasis: accent text means "link".
- A kicker above a title is `PageHeader eyebrow` (sentence case: "Artifact · Spreadsheet"); status
  or counts go in a `Badge` or the description.

## Measure, numbers, wrapping

| Rule | Value / how |
|---|---|
| Body measure | ≤ `--q-w-form` (640): PageHeader and Panel descriptions already cap |
| Reading pages | content column ≤ `--q-w-content` (1040) |
| Headings wrap | `text-wrap: balance` (built into Headline and `Text heading`) |
| Body wraps | `text-wrap: pretty` (built into Text) |
| Numbers compared in columns | tabular and right-aligned: Table `columns[].align="right"`; StatCard does it |
| One line that may overflow | `Text truncate`, with the full value in a `Tooltip` or the detail view |
| Multi-line preview | `Text lineClamp={2}`. Never clamp body copy a user must read |
| Mono | code, IDs (`EntityLink mono`), keyboard shortcuts (`kbd`). Never labels, metadata or sentences |

## Pairings

| Situation | Stack (top → bottom) | Gaps |
|---|---|---|
| Page head | `PageHeader`: eyebrow or back → page-title + status → meta → intro, actions on the right. The TopBar above says where the page sits | built into `PageHeader` |
| Block head | section-title (+ description, count, actions) | built into `Panel` |
| Panel | card-title → body/small | `--q-space-stack` |
| Stat | label → metric → small (delta/period) | built into `StatCard` |
| List row | body (primary) → small muted (secondary) | 0–4 inside the row |
| Key/value | `DescriptionList` | built in |

## Don't

| Slop | Fix |
|---|---|
| Second `h1`, or a page header inside the page body | one `PageHeader`; blocks are `Panel`s with titles |
| The page name only in the TopBar's breadcrumb | a `PageHeader` title in the panel too |
| 13, 19 or 30 px "subheadings" | the eight roles only |
| Bold body as a heading | a titled `Panel` or the card-title recipe |
| ALL CAPS or mono caps labels | sentence case, sans |
| Italic or accent text for emphasis | `<strong>`; accent text means "link" |
| `#000`, `#111` or a raw grey for text | `--q-fg`, `--q-fg-body`, `--q-fg-muted` |
| Centred paragraphs or headings in an app | left-aligned; centre only an `EmptyState` |
| Body text wider than 640 | cap the column (`--q-w-form`) |
| `font-size` in a screen's CSS | a `Text` prop or the component's role |
