# Choosing components

Props are in each component's `.d.ts` (shipped in `dist/components/`). This page covers only choices that go wrong in practice. Each row names
the wrong option it prevents.

## Easily confused

| Need | Use | Not |
|---|---|---|
| main action | `Button variant="primary"`, one per view (the accent fill) | a second primary, a link styled as a button |
| a secondary or toolbar action | `Button variant="ghost" size="sm"` (padded, soft grey hover), or `secondary` beside a primary | a second primary, bare text that acts |
| go to a URL | `Link`, `Button href` (routed by `linkComponent`) | `onClick` + `location.href`, a router `<Link>` wrapped round a quiet component, plain text that navigates |
| name another record (a run, project, artifact, ticket) | `EntityLink` (`kind`, `mono` for IDs, `state` done/blocked, `external`) | bold text, a `Badge`, an ID in plain mono |
| open a row of a table | `EntityLink` in the name cell (plus `onRowClick` for the hit area) | `onRowClick` alone: the row isn't a link |
| a file or a version of one | `FileCard` (kind from the MIME type, size, Download, `badge` "Current") | a raw MIME type, "Download" as plain text |
| an object's properties | `DescriptionList` (`inline`; `stacked` in a rail; `copy` on IDs) | key/value rows with the value right-aligned 900px away |
| the frame of a signed-in screen | `AppShell` + `Sidebar` (`WorkspaceSwitcher`, `AccountMenu`) + `TopBar` | a header, nav or account menu built by the page; your own header on `--q-top-bar-*` tokens |
| where you are, and screen-wide actions | `TopBar` (`crumbs`, `actions`) | a second breadcrumb bar, a back link standing in for the trail on desktop |
| the top of a page | `PageHeader` (title, `status`, `meta`, `actions`, `back`, `eyebrow`, `tabs`) under the TopBar | a heading with a rule, the page name only in the TopBar |
| secondary content beside the screen (notifications, an inspector, the assistant) | AppShell's third pane (`aside`, `asideTitle`, `asideOpen`) | a `Drawer` or `Dialog` over the screen; a fixed column built by the page |
| an icon | `AppIcon` (quiet's stroke set, `name`) | unicode glyphs (→ ✕ ✓), emoji, a second icon library |
| a titled section | `Panel` (surface; `outlined` in a grid; `plain` for the lead; `empty` collapses) | a heading with a rule, a hand-built bordered `<section>` |
| an agent run's history | `Transcript` (sessions, grouped messages, `ToolCall`s, events) | raw `[chat · @name] text` lines, empty session headings |
| on/off that applies now | `Switch` | `Checkbox` + Save |
| delegation between off and always | `ProbabilityToggle` | three radios |
| a limit with a safe range | `ElasticSlider` | a validation message after the fact |
| an exact number | `Stepper` or number `TextField` | `Slider` |
| one of ≤ 5 | `Radio`, or `Tabs variant="enclosed"` as a segmented control | a dropdown hiding 3 options |
| filter a list or switch its view | segmented `Tabs variant="enclosed" size="sm"` with a `count` per tab | `Tabs` line variant, a row of toggle buttons |
| one of a long or plain list | `Select size="sm"` | `Dropdown` |
| options with descriptions or icons | `Dropdown` | `Select` |
| switch views in place | `Tabs panels`, or `Tabs` + `TabPanel` | buttons toggling `display` |
| a status word | `Badge` with its status `variant` (tinted) or `StatusDot` | coloured text, a row tint, every status in the same grey pill |
| read-mostly rows | `Table` | `DataGrid` with every feature off |
| search, select and page | `DataGrid` | `Table` + a hand-built toolbar |
| an openable object in a grid | `Card` | `Card` as a generic box; use `Panel` (see [sections.md](sections.md)) |
| a KPI in an app | `StatCard` | a hand-built stat block |
| a chart | `Sparkline`, `LineChart`, `BarChart`, `DonutChart` (share-of-total only), `NarratedChart` | a chart library, an image, a donut for anything else |
| a menu of actions | `DropdownMenu` | a `Popover` full of buttons |
| a hint | `Tooltip` | the `title` attribute |

## Feedback channel

| What happened | Use | Behaviour |
|---|---|---|
| the user's own action succeeded or failed | `toast({ title, status, action })` | auto-dismisses, max 3, never logged |
| a system event (build finished, invite received) | the notifications list in AppShell's third pane | stays until read |
| one page-wide condition (trial ending, degraded) | `Banner`, once per page, under the `PageHeader` inside the panel | stays while the condition holds |
| a problem with the content beside it | `Alert` in that block | stays until resolved |
| a field is wrong | the field's `error` | on blur or submit |

Anything that must be acknowledged is never a toast.

## Destructive actions

Choose by reversibility, and say what will happen ("Deletes 14 projects and their builds"), never
"Are you sure?".

| Situation | Use |
|---|---|
| reversible (archive, pause, remove) | do it now, then `toast` with an Undo `action` (agent work: `Receipt` / `UndoRiver`) |
| irreversible, one small object | `Button variant="destructive"` → `Dialog size="sm"` |
| irreversible, large or many objects | `Approval` (before → after, how far it reaches, undo window) confirmed with `HoldButton` |
| one dangerous control in place | `HoldButton` |

Typing the name to confirm is only for deleting a workspace or account.

## Waiting, empty, error

| State | Use | Not |
|---|---|---|
| first load of a known layout | `Skeleton` shaped like the content | a page spinner |
| wait under ~1s | nothing | a flash of spinner |
| control busy | `Button loading` | a spinner elsewhere |
| long job with an estimate | `HonestButton`, `Progress`, `BorderProgress` on the thing being made | an indeterminate spinner |
| agent working | `AgentRun` | a spinner + toast |
| empty, nothing yet | `EmptyState` + one Create action, or `GhostFuture` | an empty table |
| empty, filtered | `EmptyState` + Clear filters | the "nothing yet" copy |
| a block failed | `Alert` in that block + retry `action`; the rest keeps working | a page-level error |
| offline / stale | last-known values with their age (`DecayingBadge`) + `Banner` | blanking the page |

Only one thing moves per surface.

## Agents

| Need | Use |
|---|---|
| the user states a goal in words | `IntentBar`: your code parses it; the bar shows the reading as editable `chips` before anything runs |
| show work in progress | `AgentRun`, where the outcome will land; the last step is a person |
| approve a plan | `Approval` + `HoldButton` |
| grant permissions | `ScopeGrant` (scopes, `durations`, `onRevoke`) |
| cap spend | `BudgetLeash` (it says what happens at the cap before it's reached); report spend with `CostMeter` |
| suggested edits | `DraftDiff`: Ship stays blocked while a hunk is pending |
| history and rollback | `Checkpoints`; a finished run → `RunScrubber` |
| record of what was done | `Receipt` (`undoable` only on lines that really reverse), `UndoRiver` |
| chat | `ChatThread` + `ChatMessage` + `ChatComposer`, with `ToolCall`, `CodeBlock`, `Attachment`, `PromptSuggestions` |

Every agent action leaves a `Receipt` or `Checkpoint`.

## Data trust

Show uncertainty where a decision depends on it, and nowhere else. A page full of doubt markers
reads as broken.

| Need | Use |
|---|---|
| a claim the system isn't sure of | `DoubtMarker` |
| where a number came from | `LineageChip` |
| a value with a range | `UncertaintyCell` (shared `domain` per column) |
| a fact that ages ("Verified") | `DecayingBadge` |
| unusual stretches in a series | `AnomalyRibbon` |
| alert thresholds | `ThresholdHandles` |

## Never reinvent

Overlays (`Dialog`, `Drawer`, `Popover`, `DropdownMenu`, `Tooltip`, `CommandPalette`), every form
control, `Tabs`, `Accordion`, `Table`, `DataGrid`, `Sidebar` (including its mobile drawer), every
chart, the chat set, the app set (`AppShell`, `TopBar`, `WorkspaceSwitcher`, `AccountMenu`,
`AppIcon`, `PageHeader`, `Panel`, `DescriptionList`, `EntityLink`, `FileCard`, `Transcript`) and
`Toaster`. They carry keyboard, focus, ARIA and motion. Never rebuild them,
restyle them into another look, or swap in a third-party equivalent.

If a component lacks a feature, add it to quiet (`AGENTS.md`). A component only one product needs
lives in that product's repo, built on quiet tokens and BEM.

## Don't mix

- one control `size` per screen (`sm`) and one density per surface
- `Table` and `DataGrid` in one block
- `Headline size="display"` in apps
- icon sets: quiet draws its own stroke icons (`AppIcon`). An icon quiet lacks is added to quiet's
  set (`src/components/app/icons.ts`), not drawn from a second library.
