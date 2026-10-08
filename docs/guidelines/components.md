# Choosing components

Props are documented in each component's `.d.ts` (`src/components/<group>/<Name>.d.ts`) and usage
examples in `docs/reference/optimus-design/components/<group>/<Name>.prompt.md`.

## I need… → use…

| I need… | Use | Not |
|---|---|---|
| a main action | `Button` (ink primary) | a molten button, a link styled as a button |
| a secondary or quiet action | `Button variant="secondary" / "outline" / "ghost"` | |
| a destructive action | `Button variant="destructive"` → `Dialog`, or `HoldButton`, or `Approval` | `window.confirm` |
| navigation to a URL | `Link`, `ArrowLink`, `Button href` | `onClick` + `location.href` |
| a set of related buttons | `ButtonGroup` | flex + margins |
| a status word | `Badge` (`dot` for status) or `StatusDot` (live / prototype / archived) | coloured text |
| a removable or selectable chip | `Tag` | |
| a person or agent | `Avatar` (`shape="square"` for agents) | |
| headings | `PageHero` (page), `SectionHeader` (block), `Headline` (marketing) | bold body text |
| text | `Text` (`size`, `color`, `mono`, `truncate`, `lineClamp`) | hand-styled spans |
| an eyebrow / metadata label | `Eyebrow`, or `Text mono` | |
| a divider | `Rule` | `<hr>` with custom styles |
| a single-line input | `TextField` (`Input` for the simplest cases) | raw `<input>` |
| multi-line input | `TextArea` | |
| pick one of few (≤5) | `Radio`, or `Tabs variant="enclosed"` as a segmented control | |
| pick one of many | `Dropdown` (`Select` for native) | |
| pick several | `MultiSelect`, `Checkbox` list | |
| on/off that applies now | `Switch` | Checkbox + Save |
| a policy between off and always | `ProbabilityToggle` | three radios |
| a number in a range | `Slider`; exact numbers → `Stepper` | |
| a limit with a safe range | `ElasticSlider` | a validation message |
| a value several people set | `ConsensusSlider` | |
| a date | `DatePicker` | |
| file upload in a form | `FileUpload`; in chat → `ChatComposer` | |
| a container for a thing | `Card` | div + border |
| a KPI | `StatCard` (dashboard) or `Stat` (marketing) | |
| a chart | `Sparkline`, `LineChart`, `BarChart`, `DonutChart`, `NarratedChart` | a chart library, an image |
| tabular data, read-mostly | `Table` | |
| tabular data with search/select/paging | `DataGrid` | |
| live rows | `StreamingTable` | re-rendering a Table on every message |
| a simple vertical list | `List` | |
| show/hide sections | `Accordion` | |
| tabs | `Tabs` (`line` default) | |
| status slices above a list | `FilterTabs` | |
| breadcrumbs | `Breadcrumb` | |
| paging | `Pagination` | |
| a multi-step flow indicator | `StepIndicator` | |
| app side nav | `Sidebar` | |
| marketing top nav | `NavBar` | |
| global search / commands | `CommandPalette` | a custom search modal |
| a modal decision | `Dialog` | a hand-rolled overlay |
| a side panel (filters, notifications) | `Drawer` | |
| anchored content (help, small form) | `Popover` | |
| a menu of actions | `DropdownMenu` | a Popover with buttons |
| switch views in place | `Tabs panels={…}`, or `Tabs` + `TabPanel` when the panel sits elsewhere | buttons toggling `display` |
| a hint on hover/focus | `Tooltip` | `title` attribute |
| inline message in content | `Alert` | |
| page-wide message | `Banner` | stacked Alerts |
| transient feedback | `toast()` into the app's one `Toaster` | an Alert that disappears, a hand-rolled toast stack |
| progress with a value | `Progress`; on a card's edge → `BorderProgress` | |
| progress the button itself shows | `HonestButton` | a spinner elsewhere |
| loading placeholder | `Skeleton` | grey divs |
| spinner | `Spinner`, `Button loading` | |
| nothing here | `EmptyState`, `GhostFuture` | an empty table |
| page layout | `PageShell`, `Grid` + `Col`, `Stack`, `Container` | ad-hoc flex/grid with raw gaps |
| media frame | `AspectRatio` | |
| route transitions | `PageTransition` | |
| agent, trust and chat needs | see [patterns.md](patterns.md#agent-and-ai-features) | |

## Never reinvent

These carry keyboard handling, focus management, ARIA and motion that are easy to get wrong. Never
rebuild them, wrap them in a different look, or swap in a third-party equivalent:

- overlays: `Dialog`, `Drawer`, `Popover`, `DropdownMenu`, `Tooltip`, `CommandPalette`;
- form controls: every field, `Switch`, `Checkbox`, `Radio`, `Slider`, `DatePicker`;
- `Tabs`, `Accordion`, `Table`, `DataGrid`, `Sidebar`;
- every chart (no Recharts, Chart.js or d3 components alongside quiet);
- the chat set (`ChatThread`, `ChatMessage`, `ChatComposer`, …);
- `Toaster` / `toast()` (and the notification centre pattern);
- the mobile nav: `Sidebar mobile="drawer"` + `SidebarTrigger`, not a `Drawer` around a copied nav;
- links: set `linkComponent` once; don't wrap quiet components in router `<Link>`s.

If a component is missing a feature, add it to quiet (see AGENTS.md and `.claude/skills/`). Don't fork it into the
product. A component that only one product needs lives in that product's repo, **built on quiet tokens and BEM**.

## Don't mix

- One `size` per screen (`sm` in apps). Don't put `md` buttons next to `sm` fields.
- One density per surface.
- `Sidebar` and `NavBar` never together. `Banner` once per page.
- `Table` and `DataGrid` never in the same block. Pick one per dataset.
- Don't use `Stat` (marketing) in apps, or `StatCard` on the marketing site.
- Don't use `Headline size="display"` in apps.
- Don't mix icon sets. quiet uses unicode glyphs (→ ↘ ↓ × ✓ · /) through `Icon`. If a product needs
  more, choose one thin geometric stroke set and flag it for the theme.
