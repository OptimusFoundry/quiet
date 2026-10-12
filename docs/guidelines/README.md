# Building SaaS apps with quiet

These guidelines cover how to put quiet's components together into product screens that look like
one product. quiet has one look ([the one-look plan](../plans/2026-10-12-one-look.md)): **an inset
three-pane shell with a push inspector**, soft ink, the lava accent, grounds instead of rules, Geist
in sentence case, dense pill controls, panes over drawers.

| Page | Read it when |
|---|---|
| [layouts.md](layouts.md) | starting a screen: the app shell, which of the eleven layouts, its dimensions, its rules, what collapses |
| [sections.md](sections.md) | breaking a page into parts: plain / surface / outlined `Panel`, rows, nesting, headings, order |
| [grid.md](grid.md) | placing blocks: fixed panes vs 12 columns, allowed splits, responsive spans |
| [spacing.md](spacing.md) | any gap: the job token for what it separates, per density |
| [typography.md](typography.md) | any text: the eight roles and the component prop for each |
| [foundations.md](foundations.md) | colour (ink, grounds, the accent's roles), status, shape, depth, motion, density |
| [components.md](components.md) | choosing between similar components; feedback, destructive, waiting/empty/error, agent and trust decisions |
| [content.md](content.md) | writing a label, button, empty state or error |
| [accessibility.md](accessibility.md) | wiring a page: what quiet does for you, what you still own |
| [checklist.md](checklist.md) | reviewing a screen before it ships |
| [coverage-gaps.md](coverage-gaps.md) | the task touches something quiet has no standard for yet |

Reference screens live in Storybook under **Patterns** (`npm run dev` → :6020), all in the same
frame: `patterns-app-shell--default`, `patterns-dashboard--default`, `patterns-records--default`
(list-detail), `patterns-agentworks--*` (list, detail and artifact pages), `patterns-settings--default`,
`patterns-billing--default`, `patterns-assistant--default` (chat with its pane open) and
`patterns-states--default`. Copy their structure; change the content. Their frame is
`src/stories/patterns/AppFrame.tsx`, the one place that wires `AppShell`, `Sidebar`, `TopBar`,
`WorkspaceSwitcher`, `AccountMenu`, the third pane, `CommandPalette` and `Toaster` together. The app
components have their own stories under **App**.

Measured specimens live under **Guidelines**: `guidelines-spacing--default`,
`guidelines-typography--default`, `guidelines-grid--default`, `guidelines-layouts--default` and
`guidelines-sections--default`. They render the real tokens, so they also show density and theme changes.

## Setup in one breath

Vendor a tagged release (`node ../quiet/scripts/quiet.mjs sync --ref vX.Y.Z`, never a branch) and
import `@optimusfoundry/quiet/style.css` and `fonts.css` (Geist). Wrap the app in `ThemeProvider`
(theme on `<html>`, `linkComponent` for your router) and `QuietRoot`, mount one `Toaster`, and
register a product theme with `defineThemes` if the product has one. Every signed-in screen sits in
one `AppShell`. Details: the package [README](../../README.md) and the `quiet-app` skill.

## quiet in ten rules

1. **One frame.** Every signed-in screen sits in `AppShell`: the `Sidebar` on a grey canvas, the
   screen an inset white panel with quiet's `TopBar` pinned inside it, and a third pane that pushes
   the screen aside. A page never builds its own header, nav or drawer ([layouts.md](layouts.md#app-shell)).
2. **Pick a layout, don't compose one.** Use one of the eleven in [layouts.md](layouts.md). The
   panel's column pads 32 top, 32 at the sides and 48 at the bottom, and caps at 1280.
3. **Panes are fixed, content is gridded.** Panes and columns are 240 · 200 · 360 · 400 · 640 · 1040.
   Blocks use the 12-column grid with spans 3 · 4 · 6 · 8 · 9 · 12, always with `rowGap` = `gap`.
4. **Every gap is a job.** inline 8 · stack 16 · field 24 · card-pad 24 · block 32 · section 48
   (comfortable). Never 12, 20 or 28 between blocks, and never margins on components.
5. **Eight type roles, soft ink.** One `h1` per screen: the `PageHeader` title (24, the only display
   size). Then section · card · metric · body · small · label ([typography.md](typography.md)).
   Everything is sentence case. No mono caps and no italics; mono is only for code, IDs and keys.
   Text is soft ink, never black.
6. **Grounds, not rules.** Sections group with `Panel` surfaces (a warm grey, no edge) and spacing.
   The only lines are the faint dividers between table rows, and the edge between two panes. No card-in-card. A table lies
   on the panel's white under its filters. At most 3 levels.
7. **One lead per page.** Status goes under the title, the main block comes first and widest, and
   destructive actions come last. Equal-weight sections are a bug, and an empty section collapses (`Panel empty`).
8. **Lava is punctuation.** The accent marks what you can act on and where you are: links, the one
   primary action, the current nav icon, selected and checked states, focus and attention. Components
   do this for you. Never a section background or body text. Status comes from `--q-status-*` and props.
9. **Dense pill controls.** Buttons, tags, badges and segmented tabs are pills, 32 high
   (`size="sm"`); fields are 36. Toolbar and in-panel actions are padded ghost buttons, with one
   primary per view. Anything that navigates is a `Link`, `EntityLink` or `Button href`, and a
   record named on a page is an `EntityLink`.
10. **Panes over drawers, components over copies.** Secondary content (notifications, an inspector,
    the assistant) opens in AppShell's pane; a `Drawer` is a phone fallback only. Modals, menus,
    tables, charts, toasts, chat and agent UI exist with keyboard and ARIA built in. Render them;
    never hand-roll one, and never style your own markup with a component's `--q-<component>-*`
    tokens (they exist only when that component is imported, so production drops them).

Product identity comes from a **theme**, not a new design system: one engine (quiet), one theme per
product. The theme can change the palette, accent, type, shape and density; the rules above stay the same.
