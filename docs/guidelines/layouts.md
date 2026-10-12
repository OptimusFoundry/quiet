# Layouts

Twelve page layouts cover a SaaS product. Pick one per screen by **what the user does there**. Don't
compose a new one. Dimensions are app density. Specimen: Storybook `guidelines-layouts--default`.

Inside the shell, every layout starts with `main` padding of `--q-space-section` (48) top/bottom and
`--q-space-page-x` (32) sides, max `--q-w-max` (1280). Blocks are separated by `--q-space-block` (32).

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
| is not signed in (site, docs, pricing) | **Marketing** (no app shell) |

## App shell

Every app screen sits in this frame. Story: `patterns-app-shell--default`.

```
┌──────────────┬────────────────────────────────────────┐
│ brand        │ main  pad 48 / 32 · max 1280 · scrolls │
│ Search ⌘K  ◉ │  PageHeader: ← parent · title · actions│
│ nav groups   │  …                                     │
│  240         │                                        │
└──────────────┴────────────────────────────────────────┘
```

| Part | Use | Rule |
|---|---|---|
| Root | `ThemeProvider` (`linkComponent`) › `QuietRoot density="app"` | one density for the whole shell |
| Side nav | `SidebarProvider breakpoint={720}` › `Sidebar mobile="drawer"` (`groups`; `header` = brand, then a full-width Search ⌘K beside the account `DropdownMenu` on an `Avatar`) | 240, `collapsible` to the 64 rail; the current item is molten; counts that need action (approvals waiting) as item `badge`; `label` it when a page has two navs. Search comes first in the header: the drawer focuses it on open |
| No top bar | where you are is `PageHeader`'s job (`back` to the parent, `eyebrow` for the kind) | a desktop top bar only repeated the page's breadcrumb, cost 64 and a hairline. Never a breadcrumb bar above a `PageHeader` |
| Phone bar | under 720 only: `SidebarTrigger` + the page name + a search icon button | `--q-h-topbar` 64, the drawer's opener |
| Search | one `CommandPalette` with `hotkey` ⌘K | it mirrors every nav destination and page action; it's the only search UI |
| Notifications | `Drawer size="sm"` + unread `Badge` on its button | system events, kept until read |
| Toasts | one `<Toaster position="bottom-right" max={3} />` | only `toast()` feedback on the user's own action |
| Main | one `<main>`, scrolls on its own | |

- **Collapses:** under 720 the Sidebar leaves the layout and opens from `SidebarTrigger`. Drop its
  column via `useSidebar().isMobile` and show the phone bar; page-x becomes 16.
- **Never:** wrap a `Drawer` around a copy of the nav; put `NavBar` and `Sidebar` on one screen.

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
    attention is molten; the rest are ink.
  - At most one `Alert`, and only for something actionable.

## List page

```
PageHeader: title · description ···················· [primary]
toolbar: FilterTabs / Select size="sm" filters · search ··· [bulk]
┌─ Table (name cell = EntityLink · status Badge · numbers right) ─┐
└──────────────────────────────────────────────── Pagination ─────┘
```
- **Choose for** an index of one kind of record (Projects, Runs, Artifacts, Approvals). It's the Full-bleed table with fewer columns.
- **Dimensions:** content width ≤ 1280; the toolbar sits `--q-space-stack` above the table. Filters are `size="sm"` controls in one row, never a grid of full-size selects with labels above.
- **Collapses:** filters fold into one `Drawer` button under 720; the table scrolls inside itself.
- **Rules:**
  - The title is a `PageHeader` with a one-line description of what the records are, and the create action on the right.
  - Empty: "nothing yet" (`EmptyState` + the create action) and "nothing matches" (+ Clear filters) differ.
  - A tab bar of `Pending / Decided / All` is `FilterTabs` with counts.

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
│ FilterTabs ││ Tabs                                │
│ List       ││ blocks …                            │
└────────────┘└────────────────────────────────────┘
```
- **Choose over a full table** when each record needs more than a row to judge (a body, history, actions).
- **Dimensions:** list pane padding `--q-space-card-pad`, with a hairline between the panes.
- **Collapses:** < 720 it becomes two routes, the list and then the detail with a breadcrumb back. Never squeeze both panes onto one screen.
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
- **Choose over list-detail** when the user stays on one object. Choose it over 8 + 4 when the side panel is **tool UI** (it scrolls on its own, sticks, closes) rather than content.
- **Dimensions:** the panel is `--q-w-detail-panel` 400 with a hairline left edge and padding `--q-space-block` / `--q-space-card-pad`.
- **Collapses:** < 720 the panel opens in a `Drawer` from a header button.
- **Story:** `patterns-assistant--default` (side panel).

## Full-bleed table

```
PageHeader ──────────────────── [primary]
FilterTabs · search ·········· [bulk actions when selected]
┌──────────────── Table / DataGrid, span 12 ────────────────┐
└───────────────────────────────────────── Pagination ─────┘
```
- **Choose over list-detail** when rows are comparable at a glance and the work is on many at once.
- **Dimensions:** the table fills the content width (≤ 1280, not capped at 1040); the toolbar sits `--q-space-stack` above it.
- **Collapses:** the table scrolls horizontally inside itself; the page never scrolls sideways. Don't turn rows into cards.
- **Rules:**
  - One filter mechanism per field: `FilterTabs` or a filter `Drawer`, not both.
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
- **Collapses:** < 720 the nav becomes a `Select` or `FilterTabs` above the form.
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
- **Choose for** a conversation as the main task. For help inside another task, use a `Drawer` holding the same components, not a route.
- **Dimensions:** thread and composer share the 640 column; the side panel follows the inspector rules.
- **Collapses:** < 720 the column goes full width and the panel opens in a drawer.
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
│              │ Wordmark          │                     │
│              │ title · one line  │                     │
│              │ [Continue with G] │                     │
│              │ ── or ──          │                     │
│              │ Email             │                     │
│              │ [Email me a link] │                     │
│              └───────────────────┘                     │
│                 terms · privacy (small, muted)         │
└───────────────────────────────────────────────────────┘
```
- **Choose for** sign-in, sign-up, magic-link sent, password reset. No app shell, no NavBar.
- **Dimensions:** one centred card `--q-w-detail-panel` (400) wide on `--q-bg-subtle`, padding `--q-space-block`; fields `--q-space-field` apart; `density="app"`.
- **Collapses:** < 440 the card goes full width with page-x 16 and loses its ground.
- **Rules:**
  - Never a form stretched across half the screen (agentworks' 640-wide fields) or an empty brand panel. A split layout is allowed only when the other half carries real product content (a screenshot, a quote).
  - The product's own name and `Wordmark`; one primary action (molten), the provider button secondary.
  - After "Email me a link", the same card says where the link went and offers Resend.

## Marketing

```
NavBar ──────────────────────────────
PageHero lg (display type)
section ↕128 · SectionHeader md · 12-col, gutter 32
```
- **Choose for** any page a signed-out visitor sees. Never put the app shell and NavBar on one screen.
- **Dimensions:** `density="marketing"` (the default), `PageShell` / `Container` (1280, 32 sides), and sections `--q-space-section` (128).
- **Collapses:** columns stack < 720.
