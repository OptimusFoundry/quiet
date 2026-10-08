# SaaS patterns

Each pattern below lists the components to use and the dos and don'ts. Every pattern runs at
`density="app"` with `size="sm"` controls, unless it says otherwise.

## Dashboard

Storybook: `patterns-dashboard--default`.

**Use:** `PageHero size="md"` · 4 × `StatCard` (span 3) · `LineChart` / `BarChart` (span 8) with an activity `List` or
`DonutChart` (span 4) · `Table` for the "recent" block · `Sparkline` inside dense KPI rows · one `Alert` if
something needs attention.

- Do use `StatCard` with `delta`, `trend` and `period` ("vs last 30 days"). The delta carries the
  direction, so there's no need to colour the number.
- Do make the series the user cares about the molten one (series 1), with comparisons such as last
  period in ink.
- Do limit a dashboard to about four KPIs and two charts above the fold. If more are needed, move them to a
  second page.
- Don't put more than one `Alert`/`Banner` at the top, and don't use Alerts as decoration.
- Don't use `DonutChart` for anything that isn't share-of-total. Don't chart fewer than 3 points.

## List and table pages

**Use:** `PageHero` (title + primary action) · `FilterTabs` (with `showCounts`) for status
slices · `DataGrid` for searchable, selectable, paged data, or `Table` for read-mostly lists (`sort`,
`selectable`, `renderExpanded`) · `Pagination` under the table · `EmptyState` when nothing matches ·
`GhostFuture` when the list is new and empty by nature · `StreamingTable` for live feeds.

- Do give every table a `caption` or `label`, and every row a `rowKey`.
- Do pick one mechanism for filtering (FilterTabs or a filter `Drawer`), not both on the same field.
- Do show "nothing matches" (an EmptyState with a "Clear filters" action) separately from "nothing yet"
  (GhostFuture, or an EmptyState with a "Create" action).
- Do use `StreamingTable` when rows arrive live, because it holds new rows behind "Show N new" while
  the user is reading. Never let rows jump under the cursor.
- Do use `UncertaintyCell` in forecast/estimate columns and `LineageChip` on derived numbers.
- Don't colour rows by status. Status goes in a `Badge` or `StatusDot` cell.
- Don't use infinite scroll in admin tables. Paginate.

## List + detail

Storybook: `patterns-records--default`.

**Use:** a 360 list pane (`TextField` search with `leftIcon`, `FilterTabs`, `List` with selectable items) and a
detail pane (`PageHero size="md"`, `Tabs`, `PageTransition` between tabs, `StatCard` span 4,
`DataGrid`, a form at 640).

- Do keep the selection in the URL so the detail can be deep-linked.
- Do move focus to the detail heading when the selection changes on keyboard activation.
- Don't open the detail in a modal. On small screens the list and detail become two routes.

## Forms and settings

Storybook: `patterns-settings--default`.

**Use:** a 200 section nav (`Sidebar compact` or a `List` of anchors) and a 640 column ·
`SectionHeader size="sm"` per section, separated by `--q-space-section` · `TextField`, `TextArea`,
`Dropdown`, `MultiSelect`, `DatePicker`, `FileUpload`, `Checkbox`, `Radio` · `Switch` rows on
hairlines for preferences · `FormField` to wrap anything custom · a danger zone last.

- Do label every field (`label`), and use `helperText` for format hints and `error` for validation. Validate on
  blur or submit, not on every keystroke.
- Do keep one primary "Save" per form, bottom-left of the column, plus a secondary "Cancel". Use
  `Switch` for settings that apply immediately, and never put a Save button next to Switches.
- Do space fields with `--q-space-field` (24 in app).
- Do put the danger zone in a molten-hairline box at the bottom, with a destructive button that opens a
  confirming `Dialog` (see below).
- Don't use `Slider` for exact values. Use `Stepper` or a number `TextField`. Don't hide labels to
  save space.
- Do use `ProbabilityToggle` (not a Switch) for delegation settings where on/off is too coarse, and `ElasticSlider`
  for limits with a safe range.

## Onboarding

**Use:** `StepIndicator` (numerals) above a 640 form · `ProcessStep` for explaining a sequence ·
`EmptyState` with one primary action for a first-run screen · `PromptSuggestions` for first-run AI
features · `GhostFuture` to show what the list will look like.

- Do keep each step to one decision, and let users skip and return.
- Don't use carousels, confetti or celebratory motion. Finishing shows ink + ✓ and states the next step.

## Billing and usage

Storybook: `patterns-billing--default`.

**Use:** `Card` for the plan (eyebrow, title, meta) · `CostMeter` for spend by kind of work against a
budget · `BudgetLeash` for a per-agent cap with what happens at the cap · `Table` for invoices ·
`Progress` for simple quota bars · `Banner` once if payment fails.

- Do show the money in tabular figures with the currency, and the period ("this month").
- Do say what happens at the cap (pause, ask, slow) before the user reaches it.
- Don't use red for "over limit". Use a molten mark plus the words.

## Notifications and toasts

There are two channels. Never mix them.

| Channel | For | Component | Behaviour |
|---|---|---|---|
| Toast | feedback on the user's **own** action ("Saved", "Invite sent") | `Toast` | bottom-right, max 3, auto-dismiss (`duration` 4s; errors 6s), never logged |
| Notification centre | **system** events (build finished, invoice, invite received) | `Drawer size="sm"` + an unread count `Badge` on the top-bar button | persists until read |

- Do give a toast an `action` (e.g. Undo) instead of a confirm dialog when the action is reversible.
- Anything that must stay until it's acknowledged is a notification, not a toast.
- Use `Banner` for one page-wide condition (trial ending, degraded service) and `Alert` for something
  scoped to the content beside it.

## Command palette

**Use:** one `CommandPalette` mounted in the shell, with `hotkey` ⌘K, `items` grouped as "Go to" (routes),
"Actions" (verbs with `shortcut`), and records (with `description`).

- Do mirror every primary navigation destination and every page-level action in the palette.
- Don't build a second search UI. The top-bar "Search" button opens the palette.

## Destructive and irreversible actions

Pick by reversibility:

| Situation | Use |
|---|---|
| Reversible (archive, pause, remove from list) | do it immediately, then a `Toast` with an Undo `action`, or `UndoRiver` / `Receipt` for agent work |
| Irreversible, small (delete one draft) | `Button variant="destructive"` → `Dialog size="sm"` stating exactly what is lost |
| Irreversible, large or many objects (delete workspace, revoke all keys, publish to 4,000 people) | `Approval`: before → after, how far it reaches, undo window, confirmed with `HoldButton` |
| Single dangerous button in place | `HoldButton` alone |

- Do say what will happen ("Deletes 14 projects and their builds"), not "Are you sure?".
- Don't make the user type the name unless it's a workspace or account deletion.

## Loading, empty and error states

Storybook: `patterns-states--default`.

| State | Use |
|---|---|
| First load of a known layout | `Skeleton` in the shape of the content (`lines`, `variant`) |
| Inline wait under ~1s | nothing |
| Inline wait over ~1s | `Spinner` in the control (`Button loading`) |
| Long job with a known estimate | `HonestButton` (the button is the progress), `Progress`, or `BorderProgress` on the card being made |
| Agent work | `AgentRun` (named, timed, interruptible steps) |
| Empty, nothing yet | `EmptyState` with one primary action, or `GhostFuture` |
| Empty, filtered | `EmptyState` with a "Clear filters" action |
| Error loading a block | `Alert variant="error"` in the block, with a retry `action`. Keep the rest of the page working |
| Field error | the field's `error` prop |
| Whole page unavailable | `EmptyState` with an explanation and a way back |

- Don't show spinners for whole pages, and never more than one moving thing per surface.

## Agent and AI features

Storybook: `patterns-assistant--default`.

| Need | Use |
|---|---|
| User says what they want in words | `IntentBar` (your code parses the text; the bar shows the reading as editable `chips` before running) |
| Show work in progress | `AgentRun` (`steps`, `current`, `status`; `onPause` / `onTakeOver` / `onStop`). The last step is a person |
| Approve a plan before it runs | `Approval` with `HoldButton` |
| Grant permissions | `ScopeGrant` (scopes, `durations`, `onRevoke`) |
| Cap spend | `BudgetLeash`; report spend with `CostMeter` |
| Edit suggestions | `DraftDiff` (accept/keep per hunk; Ship stays blocked while any are pending) |
| History and rollback | `Checkpoints` (agent marks square, human round), `RunScrubber` for a finished run |
| What was done, undoable | `Receipt`, `UndoRiver` |
| Chat with Claude | `ChatThread` + `ChatMessage` + `ChatComposer`, with `ToolCall`, `CodeBlock`, `Attachment` and `PromptSuggestions` |

- Do wire chat yourself. `ChatComposer` `onSubmit({ text, attachments })` sends to your API, and you
  stream the reply into `<ChatMessage from="assistant" status="streaming">`, then switch it to `"done"`.
  Pass the API role through as `from`.
- Do render markdown and highlight code before passing them as children. quiet ships no parser or
  highlighter.
- Do keep the chat column at `--q-w-form` (640). Put run details in a 400 side panel, not inline.
- Do name the agent and the model plainly ("Claude", "Meerkat"). See [content.md](content.md) for
  banned words like "AI-powered".
- Don't use sparkle icons, gradients or a "magic" colour for AI. AI surfaces look like the rest of the product.

## Data trust

| Need | Use |
|---|---|
| A claim the system isn't sure of | `DoubtMarker` (`reason`, `status`, `onRecheck`) |
| Where a number came from | `LineageChip` (`steps`, `freshness`) |
| A value with a range | `UncertaintyCell` (`low`/`high` or `error`, shared `domain`) |
| A fact that ages ("Verified") | `DecayingBadge` (`checkedAt`, `staleAfter`, `onRecheck`) |
| Unusual stretches in a series | `AnomalyRibbon` |
| Alert thresholds on a series | `ThresholdHandles` |

- Do show uncertainty where it matters, and nowhere else. A page full of doubt markers reads as broken.
