# Accessibility

quiet ships an accessibility and motion layer on every component, built to WAI-ARIA patterns with
keyboard support. The app still owns the page.

## What quiet guarantees

- **Keyboard:** every interactive component works without a mouse. Roving arrows in Tabs, Radio,
  menus, Sidebar, PromptSuggestions, UndoRiver and chart marks; Escape closes overlays; Enter or Space
  activates.
- **Focus:** a visible keyboard focus ring. Dialog, Drawer and CommandPalette trap focus and restore
  it on close. AppShell's third pane moves focus in on open and back to its opener on close, and
  closes on Escape; as a phone sheet it is modal (focus held, background inert). AppShell's skip
  link jumps to `<main>`. Removing a chip or undoing an item moves focus somewhere sensible.
- **Names and states:** labelled controls, `aria-expanded/selected/pressed/checked/current`,
  `role=slider|meter|progressbar` with `aria-valuetext`, and live regions for toasts, streaming chat,
  agent steps and table arrivals.
- **Charts:** focusable marks with spoken values, plus a visually hidden data table.
- **Motion:** every duration token drops to 0 under `prefers-reduced-motion`, and loops stop at their
  finished state.

## What the app must do

- **Page title:** set `document.title` on every route ("Builds · Anvil · Sjocamp"), and use one `h1`
  (`PageHeader as="h1"`). The TopBar's breadcrumb is navigation, not a heading: a screen that
  shows only the TopBar (a chat, a full-bleed tool) still needs an `h1`, visible or `q-sr-only`.
- **Landmarks:** one `<main>` (`AppShell` renders it). Name it with `mainLabel`. When a page has more than one
  `Sidebar`, `Breadcrumb` or `Pagination`, give each a distinct `label` / `aria-label`.
- **Route changes:** move focus to the new page's `h1` (or main) after client-side navigation, and
  announce the title if your router doesn't.
- **Labels:** every field gets `label`. Icon-only buttons need an accessible name (the TopBar's bell:
  "Notifications, 2 unread"), and a pane toggle sets `aria-expanded` and `aria-controls` (the pane's `asideId`). Use `hideLabel`
  (TextField) rather than omitting the label.
- **Errors:** pass messages through the field's `error` prop so they're tied to the input. After a
  failed submit, move focus to the first invalid field.
- **Headings:** keep the order h1 → h2 → h3. `Panel` and `PageHeader` take `as`, and
  `ChatMessage` takes `headingLevel`, so use them to keep the outline right.
- **Route changes:** with `linkComponent` routing, move focus to the new page's h1 (or `main`) after
  navigation and update `document.title`. quiet can't do this for you.
- **Live updates you build yourself:** use one polite live region per surface. Don't announce every token or
  every row.
- **Time limits:** toasts with actions must stay long enough to reach; `Toaster` pauses while a toast is hovered or focused, and an error toast should get a longer `duration`. Anything that must
  not be missed goes to the notification centre.
- **Hit targets:** at least 32px high (`size="sm"`), and never smaller.

## Contrast exceptions

Two colour choices are kept exactly as designed and accepted:

| Token | Contrast | Rule |
|---|---|---|
| `--q-fg-subtle` | ≈2.98:1 | non-essential text only: decorative serials, dimmed future items |
| raw accent (`--q-accent`) as text | ≈3.87:1 | marks only; never body copy or a sole error message. Text and links use `--q-accent-fg` (≈5.6:1), which passes |

Everything a user must read uses `--q-fg-muted` or darker. An error message's words are in body ink, and
only its mark takes the accent.
