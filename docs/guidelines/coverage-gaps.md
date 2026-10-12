# Coverage gaps

What quiet has **no standard for yet**. When a task touches one of these, don't invent a rule and
present it as quiet's: pick the closest pattern below, say in the PR that it's a gap, and flag it
for quiet. A gap leaves this list only when a rule, a component or a pattern story covers it.

| Area | Closest thing today | Status |
|---|---|---|
| Page-wide notices in the new shell (trial ending, degraded service, impersonation) | one `Banner` under the `PageHeader`, inside the panel | being designed: where a notice centre lives in the shell |
| Marketing and landing pages | none; quiet is app-only | out of scope for now |
| Onboarding and first run (checklists, tours, sample data) | `EmptyState` + one create action; a Wizard for ordered setup | no pattern story |
| The third pane's own layouts (inspector sections, pane-in-pane navigation) | `List size="sm"` or `Panel variant="plain"` stacks in the pane | only notifications and the assistant's changes are shown |
| Dense data screens beyond a table (pivot, spreadsheet, timeline) | `DataGrid`, `compact` density | no pattern story |
| Charts at dashboard density (label collisions, many series) | the chart components' defaults | known issues in `patterns-dashboard` |
| Tables on a phone | the table scrolls inside itself | the Billing pattern clips at 390 |
| Keyboard shortcuts beyond ⌘K (a shortcut sheet, per-screen keys) | `CommandPalette` shortcuts, `kbd` | no standard |
| Persisted shell state (collapsed Sidebar, open pane) | none; the app stores it | quiet doesn't persist either |
| Native mobile | none | out of scope |
