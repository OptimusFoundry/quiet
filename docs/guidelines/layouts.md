# Layouts

Eleven page layouts cover a SaaS product. Pick one per screen by **what the user does there**. Don't
compose a new one. Dimensions are comfortable density. Specimen: Storybook `guidelines-layouts--default`.

Every layout sits in the app shell's panel. Its column (`padded`, the default) has `--q-space-block` (32)
above, `--q-space-page-x` (32) at the sides and `--q-space-section` (48) below, caps at `--q-w-max`
(1280), and stacks blocks `--q-space-block` (32) apart. List-detail and Chat lay out their own panes
edge to edge in the panel instead.

## Choosing

| The user… | Layout |
|---|---|
| scans the state of something, then drills in | **Dashboard** |
| finds one record among many (runs, projects, artifacts) | **List page** |
| reads one record: its properties, files, history, links to related records | **Detail page** |
| works through many records one at a time | **List-detail** |
| edits one object while watching its properties or an agent | **Detail + inspector** |
| works a large dataset (filter, sort, bulk act) | **Full-bleed table** |
| fills in or changes one thing | **Form page** |
| does a multi-step setup with an order | **Wizard** |
| changes preferences across many groups | **Settings** |
| talks to Claude / an agent | **Chat** |
| signs in, signs up, resets a password | **Sign-in** (no app shell) |

## App shell

Every signed-in screen sits in this frame: **an inset three-pane shell with a push inspector**.
Story: `patterns-app-shell--default`; the wiring is `src/stories/patterns/AppFrame.tsx`.

```
canvas (grey) ───────────────────────────────────────────────────────────────────────
│ ◉ Sjocamp ⌄    │ ┌ panel (white, inset 8, radius 14) ───────────┐ ┌ pane 360 ───┐ │
│ ⌕ Search    ⌘K │ │ ☰  Workspace › Overview          [⋯] [🔔]    │ │ Notifications ✕│
│                │ │ ──────────── TopBar 44 (rule once scrolled) ─│ │              │ │
│ Workspace      │ │  PageHeader  title · status · meta  [actions]│ │  list …      │ │
│ (●) Overview   │ │  Panels …                                    │ │              │ │
│  ○  Campaigns  │ │                                              │ │              │ │
│                │ │                                              │ │              │ │
│ ◯ Ada Park     │ └──────────────────────────────────────────────┘ └──────────────┘ │
──────────────────────────────────────────────────────────────────────────────────────
```

| Part | Use | Rule |
|---|---|---|
| Root | `ThemeProvider` (`linkComponent`) › `QuietRoot` › `AppShell` | one `AppShell` for every signed-in route, around the router's outlet; it brings its own `SidebarProvider` (`breakpoint` 720) and owns the one `<main>` and the skip link |
| Canvas | AppShell's ground (`--q-app-shell-canvas`, a breath darker than white) | the Sidebar sits on it with no ground or edge of its own |
| Sidebar | `Sidebar compact` with `header` and `footer` as functions of `collapsed` | 240, collapses to the 64 icon rail from the TopBar toggle. Nav items carry an `AppIcon`; the current item is a raised white pill with an accent icon. Groups are labelled in sentence case. Counts that need action go in the item's `badge` |
| Sidebar header | `WorkspaceSwitcher` (mark, name, plan; menu to switch or manage), then a full-width **Search ⌘K** button | Search comes right after the switcher: the drawer focuses it on open. In the rail both become icons |
| Sidebar footer | `AccountMenu` (avatar, name, email; profile, shortcuts, sign out) | the only place the account lives |
| Panel | AppShell `children`: the inset white panel, radius 14, a soft shadow, scrolls on its own | the screen. No second ground: Panels inside it take the warm grey |
| TopBar | quiet's `TopBar` in AppShell `topBar`: the Sidebar toggle, `crumbs` (the last is the current page), global `actions` | 44 high, pinned to the panel's top; its rule shows only once the panel scrolls. Actions are `size="sm"` ghost buttons (icon-only ones named): pane toggles with `aria-expanded` and `aria-controls="app-aside"`, then at most one screen-wide action. Render the component, never copy its tokens onto your own header |
| Third pane | AppShell `aside`, `asideTitle`, `asideOpen`, `onAsideClose` | 360 wide, **pushes** the panel narrower (never overlays it); one pane at a time (notifications, an inspector, the assistant's changes); a title and a close button; Escape closes it and focus returns to its opener |
| Search | one `CommandPalette` with `hotkey` ⌘K | it mirrors every nav destination and page action; it's the only search UI |
| Notices | by urgency, not by page: an urgent workspace-wide condition (payment failed, outage, read-only, viewing as someone) is a `ShellNotice` in AppShell `notice`, one line on the canvas above the panel; a slow account nudge (trial, usage) is a `SidebarNotice` above the `AccountMenu`; a condition on this page is a `NoticeChip` in the TopBar's actions that opens its details in the third pane | at most one of each; each is also logged in the notifications pane. Never a `Banner` stacked on every page |
| Notifications | a `List size="sm"` in the third pane, grouped Today / Earlier, unread marked, opened from a bell in the TopBar | system events, kept until read |
| Toasts | one `<Toaster position="bottom-right" max={3} />` | only `toast()` feedback on the user's own action |

- **Where you are** is the TopBar's breadcrumb. The `PageHeader` below it names the page; add
  `back` on a detail page reached from a list (on a phone the TopBar keeps only the current crumb,
  so `back` is the way up) and `eyebrow` for the record's kind. Never a second breadcrumb bar.
- **Collapses:** under 720 the panel goes flush (no inset, radius or shadow), the Sidebar becomes a
  drawer opened by the TopBar toggle, page-x becomes 16, and the third pane opens as a full-screen
  sheet with the same title and close button (modal: the background is inert).
- **Never:** a header, nav or notification drawer built by the page; a `Drawer` around a copy of the
  nav; an overlay where the pane belongs; the panel's own header styled with `--q-top-bar-*` tokens
  (they exist only where `TopBar` is imported, so a production build drops them).

## Dashboard

```
PageHeader ────────────────────────────────── [action]
Alert? (one)
┌ 3 ┐┌ 3 ┐┌ 3 ┐┌ 3 ┐   StatCard × 4         gutter 24
┌──────── 8 ─────────┐┌─── 4 ───┐  chart/table + feed
```
- **Choose over list-detail** when nothing on the page is the object being worked on; it only points elsewhere.
- **Limits:** at most 2 grid rows below the KPIs. A third row means the page is two pages.
- **Collapses:** at 720–960 the KPIs become 2 × 2; < 720 everything stacks, the 8 before the 4.
- **Story:** `patterns-dashboard--default`.
- **Rules:**
  - At most 4 KPIs. Each `StatCard` carries direction in `delta`/`trend` with a `period`; never colour the number.
  - A trend goes in a `Sparkline` inside its StatCard's tile, under the value. Only the trend that needs
    attention takes the accent; the rest are ink.
  - At most one `Alert`, and only for something actionable.

## List page

```
PageHeader: title · description ···················· [primary]
toolbar: Tabs enclosed (segmented) / Select size="sm" filters · search ··· [bulk]
┌─ Table (name cell = EntityLink · status Badge · numbers right) ─┐
└──────────────────────────────────────────────── Pagination ─────┘
```
- **Choose for** an index of one kind of record (Projects, Runs, Artifacts, Approvals). It's the Full-bleed table with fewer columns.
- **Dimensions:** content width ≤ 1280; the toolbar sits `--q-space-stack` above the table. Filters are `size="sm"` controls in one row, never a grid of full-size selects with labels above.
- **Collapses:** filters fold into one "Filters" button under 720 that opens them in the third pane (a sheet on a phone); the table scrolls inside itself.
- **Rules:**
  - The title is a `PageHeader` with a one-line description of what the records are, and the create action on the right.
  - Empty: "nothing yet" (`EmptyState` + the create action) and "nothing matches" (+ Clear filters) differ.
  - A tab bar of `Pending / Decided / All` is `Tabs variant="enclosed"` with a `count` per tab.

## Detail page

```
PageHeader: ← Runs · eyebrow · Title  [Status]  ········ [secondary] [primary]
            meta: Created 6 hours ago   Updated 2 min ago (two facts, spaced; the rest is in the rail)
┌────────── main 8 ──────────────┐┌──── rail 4 ─────────┐
│ lead Panel plain (preview,     ││ Panel: Details       │
│   Transcript, FileCard)        ││   DescriptionList    │
│ Versions (plain, on the ground)││ Panel: Lineage       │
│ Panel: … (empty → collapsed)   ││   EntityLinks        │
└────────────────────────────────┘└─────────────────────┘
```
- **Choose for** reading one record (a run, an artifact, an approval). Choose Detail + inspector when the side is tool UI, and List-detail when the user works through many records.
- **Dimensions:** `Grid columns={12}`: main `span={8}`, rail `span={4}`, gutter; Panels `--q-space-block` apart in each column.
- **Collapses:** < 960 the rail drops below the lead Panel; < 720 everything is one column, `PageHeader` actions wrap under the title.
- **Rules:**
  - Status in `PageHeader status`, key facts in `PageHeader meta`, not as a first section.
  - Properties are a `DescriptionList` in the rail (`layout="stacked"`), never a full-width key/value list.
  - Every related record is an `EntityLink`; files are `FileCard`s with a Download action; a run's history is a `Transcript`.
  - Empty sections pass `empty` so they collapse; they come last.

## List-detail

```
┌─ list 360 ─┐┌─ detail (fluid, content ≤ 1040) ───┐
│ search     ││ PageHeader                          │
│ Tabs       ││ Tabs                                │
│ List       ││ blocks …                            │
└────────────┘└────────────────────────────────────┘
```
- **Choose over a full table** when each record needs more than a row to judge (a body, history, actions).
- **Dimensions:** the panes sit edge to edge in the panel (`padded={false}`); the list pane pads `--q-space-card-pad`, with a hairline between the panes (a pane edge, the one line besides table rows).
- **Collapses:** < 720 it becomes two routes, the list and then the detail with `PageHeader back`. Never squeeze both panes onto one screen.
- **Story:** `patterns-records--default`.
- **Rules:**
  - The selection lives in the URL.
  - Keyboard selection moves focus to the detail heading.
  - The detail never opens in a modal.

## Detail + inspector

```
┌─ content (fluid) ─────────────────┐┌─ panel 400 ─┐
│ PageHeader · Panels                ││ properties / │
│                                    ││ AgentRun     │
└────────────────────────────────────┘└─────────────┘
```
- **Choose over list-detail** when the user stays on one object. Choose it over 8 + 4 when the side panel is **tool UI** (it scrolls on its own, closes, holds properties or an agent) rather than content.
- **Build:** the inspector is AppShell's third pane (`aside`, titled, toggled from a TopBar button with `aria-expanded`). It pushes the screen narrower; the screen reflows, so lay it out with `Grid`, which follows its own width. It shares the pane with notifications: one open at a time.
- **Collapses:** < 720 the pane opens as a full-screen sheet, never a squeezed column.
- **Story:** `patterns-assistant--default` (the Changes pane, open by default on desktop).

## Full-bleed table

```
PageHeader ──────────────────── [primary]
Tabs enclosed · search ·········· [bulk actions when selected]
┌──────────────── Table / DataGrid, span 12 ────────────────┐
└───────────────────────────────────────── Pagination ─────┘
```
- **Choose over list-detail** when rows are comparable at a glance and the work is on many at once.
- **Dimensions:** the table fills the content width (≤ 1280, not capped at 1040); the toolbar sits `--q-space-stack` above it.
- **Collapses:** the table scrolls horizontally inside itself; the page never scrolls sideways. Don't turn rows into cards.
- **Rules:**
  - One filter mechanism per field: `Tabs variant="enclosed"` or a filter pane, not both.
  - "Nothing matches" (`EmptyState` + Clear filters) and "nothing yet" (`GhostFuture`, or `EmptyState` + Create) are different states.
  - Status goes in a `Badge`/`StatusDot` cell, never a row tint.
  - The name cell is an `EntityLink` to the record. `onRowClick` may add a larger hit area, but never
    replaces the link: a row with no link can't be reached by keyboard, opened in a new tab, or seen as clickable.
  - Numbers (cost, counts) right-aligned and tabular; times relative ("6 hours ago") with the exact time in a `Tooltip`.
  - Paginate; no infinite scroll.
  - For live rows use `StreamingTable`, so rows never move under the pointer.

## Form page

```
PageHeader (title, one-line intro)
┌── form column 640 ──┐
│ field ↕24 field      │
│ ── group head ── ↕32 │
│ [Cancel] [Save]      │
└──────────────────────┘
```
- **Choose for** create/edit of one object with ≤ 2 groups. With more groups, use Settings (a nav) or a Wizard (an order).
- **Dimensions:** left-aligned under the title, never centred. Fields are `--q-space-field` apart and groups `--q-space-block`. Actions go at the end of the column, primary last.
- **Collapses:** the column becomes full width.
- **Rules:**
  - Every field has a visible `label`. Format hints go in `helperText`. Validate on blur or submit, not on every keystroke.
  - Exact numbers use `Stepper`/`TextField`, never `Slider`.

## Wizard

```
StepIndicator ──●──○──○
┌── step body 640 ──┐
│ fields             │
│ [Back]      [Next] │
└────────────────────┘
```
- **Choose over a form page** only when later steps depend on earlier answers. Otherwise use one form.
- **Dimensions:** one step per screen with the 640 column, and `StepIndicator` above the PageHeader. Back on the left, Next/Finish on the right.
- **Collapses:** < 720 use `StepIndicator orientation="vertical"` or `size="sm"`; the column goes full width.
- **Rules:**
  - One decision per step, skippable and resumable.
  - Finishing shows ink + ✓ and names the next step. No confetti or celebration motion.

## Settings

```
┌ nav 200 ┐ ┌── form 640 ─────────────┐
│ Profile │ │ PageHeader               │
│ Notifs  │ │ Panel: Limits ↕48 Panel  │
│ Danger  │ │ danger zone (last)       │
└ sticky ─┘ └─────────────────────────┘
```
- **Choose over Tabs** when there are > 4 groups or a group is longer than a screen. Use Tabs for ≤ 4 short groups.
- **Dimensions:** the nav and the form are `--q-space-block` apart, and sections are `--q-space-section` apart (not block).
- **Collapses:** < 720 the nav becomes a `Select` or `Tabs variant="enclosed"` above the form.
- **Story:** `patterns-settings--default`.
- **Rules:**
  - Each group is a surface `Panel` with a title and a one-line description; never groups split by rules.
  - A `Switch` applies immediately, so no Save button sits near switches.
  - A section with fields has one Save.
  - The danger zone comes last; pick its control by reversibility ([components.md](components.md#destructive-actions)).

## Chat

```
┌──── chat column 640 ────┐┌─ panel 400? ─┐
│ ChatThread (scrolls)     ││ Checkpoints  │
│ ChatComposer (pinned)    ││ Receipt      │
└──────────────────────────┘└──────────────┘
```
- **Choose for** a conversation as the main task. For help inside another task, open the same components in AppShell's third pane, not a new route or a drawer.
- **Dimensions:** the chat lays out edge to edge in the panel (`padded={false}`); thread and composer share the 640 column; the side panel is the third pane (inspector rules).
- **Collapses:** < 720 the column goes full width and the pane opens as a full-screen sheet.
- **Story:** `patterns-assistant--default`.
- **Rules:**
  - `ChatComposer onSubmit` sends to your API; stream into `<ChatMessage from="assistant" status="streaming">`, then `"done"`.
  - Render markdown and highlight code before passing them as children; quiet ships no parser.
  - The thread gets an h2 (visible or `q-sr-only`), with `ChatMessage headingLevel` one below it.
  - AI looks like the rest of the product: no sparkles, gradients or "magic" colour.

## Sign-in

```
┌──────────────── page (--q-bg-subtle) ────────────────┐
│              ┌──── card 400 ────┐                     │
│              │ mark              │                     │
│              │ title · one line  │                     │
│              │ [Continue with G] │                     │
│              │ ── or ──          │                     │
│              │ Email             │                     │
│              │ [Email me a link] │                     │
│              └───────────────────┘                     │
│                 terms · privacy (small, muted)         │
└───────────────────────────────────────────────────────┘
```
- **Choose for** sign-in, sign-up, magic-link sent, password reset. No app shell.
- **Dimensions:** one centred card `--q-w-detail-panel` (400) wide on `--q-bg-subtle`, padding `--q-space-block`; fields `--q-space-field` apart.
- **Collapses:** < 440 the card goes full width with page-x 16 and loses its ground.
- **Rules:**
  - Never a form stretched across half the screen (agentworks' 640-wide fields) or an empty brand panel. A split layout is allowed only when the other half carries real product content (a screenshot, a quote).
  - The product's own name and mark (the `WorkspaceSwitcher` mark); one primary action (the accent), the provider button secondary.
  - After "Email me a link", the same card says where the link went and offers Resend.
