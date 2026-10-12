# Screen review checklist

Run this on every new or changed screen, in **foundry and foundry-dark**, at 1280 and at 390 wide. In
an app, check a **production build** (`build` + `preview`), not only the dev server: dev loads every
quiet stylesheet, production only the ones the app imports. The `visual-reviewer` agent (quiet) and
the `quiet:quiet-screen-reviewer` agent (apps) use this list. Every item should be a yes.

## Frame
- [ ] The screen sits in `AppShell`: the Sidebar on the grey canvas, the screen an inset white panel, nothing built by the page around it.
- [ ] The Sidebar header is `WorkspaceSwitcher` then Search ⌘K; its footer is `AccountMenu`; nav items carry an `AppIcon`; the current item is the raised white pill.
- [ ] The TopBar is quiet's `TopBar` (not a copy on its tokens): Sidebar toggle, breadcrumb ending at this page, ghost `sm` actions. It is 44 high, opaque, padded, and its rule shows only after scrolling.
- [ ] Secondary content (notifications, an inspector, the assistant) opens in the third pane, pushing the screen; one pane at a time; Escape closes it and focus returns to its opener.
- [ ] At 390: the panel is flush, the Sidebar opens as a drawer from the TopBar toggle, the pane opens as a full-screen sheet with the same title and close button, and nothing scrolls sideways.

## Layout and sections
- [ ] The screen is one of the eleven layouts in `layouts.md`, at its dimensions (column 32 / 32 / 48, max 1280).
- [ ] Panes use the fixed widths (240 / 200 / 360 / 400 / 640 / 1040), never % or invented px.
- [ ] Blocks sit on the 12-column grid with spans 3 / 4 / 6 / 8 / 9 / 12, and the column edges line up between rows.
- [ ] Every `Grid` has `rowGap`; at 390 no two blocks touch.
- [ ] There's one `PageHeader` (`h1`) at the top of the panel, under the TopBar; sections are titled `Panel`s (`h2`), and the heading order is unbroken.
- [ ] Sections group with grounds and spacing: no ink rules, no hairlines between sections, no border round a surface `Panel`. Lines only between table and list rows and between two panes.
- [ ] No card-in-card, no frame or grey ground under a table, no titled `Panel` inside a `Panel`; nesting is at most page → section → container.
- [ ] One page status under the title; the lead block is first and widest; empty sections collapse (`Panel empty`) and come last; destructive actions come last.
- [ ] Properties are a `DescriptionList`: no label/value pair is split across the page.
- [ ] Actions sit with what they act on: screen-wide ones in the TopBar or `PageHeader`, section actions in `Panel actions`, one primary each.
- [ ] Reading text ≤ 1040, body measure and forms ≤ 640, left-aligned.

## Colour
- [ ] There are no raw colours. Everything is a tier-2 `--q-*` token (no `--q-<component>-*` token in app CSS).
- [ ] Text is soft ink (`--q-fg`, `--q-fg-body`, `--q-fg-muted`): no black or near-black.
- [ ] The accent is present where it should be (the primary action, the current nav icon, links, selected and checked states, focus) and nowhere else: never a section, panel or page background, never body text, no second accent. At most one primary button per view.
- [ ] Accent text is `--q-accent-fg` (via components), never `--q-accent`; the accent reads as lava, not rust.
- [ ] Every status reads without its dot: it has a word and a tinted `Badge` variant; statuses that mean different things look different.
- [ ] There's no green or red unless the product theme sets status hues.
- [ ] Text people must read is `--q-fg-muted` or darker; `--q-fg-subtle` is decoration only.
- [ ] It looks right in dark mode, with no light-only values.

## Type, controls and spacing
- [ ] The only sizes are 11 / 12 / 14 / 17 / 20 / 24, each through a component prop, with no `font-size` in screen code.
- [ ] Sentence case everywhere; no mono caps and no italics. Mono only for code, IDs and keys; numbers compared in columns are tabular and right-aligned.
- [ ] Controls are dense pills at one size (`size="sm"`, 32; fields 36). Toolbar and in-panel actions are ghost buttons.
- [ ] Filters and view switches are segmented `Tabs variant="enclosed"`.
- [ ] Every gap is a job token: inline 8, stack 16, field 24, card-pad 24, block 32, section 48 (comfortable). No 12 / 20 / 28 between blocks and no margins on quiet components.
- [ ] Gaps step up with structure (inline < stack < field < block < section), so the page doesn't read as one even list.

## Surfaces and motion
- [ ] Shadows only on the frame (panel, pane, current nav pill) and on floating layers (menus, popovers, dialogs, toasts); floating layers have no border.
- [ ] Radii follow the surface (fields 14, Panels and tables 20, dialogs 28, controls pill), with no square containers.
- [ ] One moving thing per surface: no bounce, no ambient loops, no scroll-triggered motion.

## Links and icons
- [ ] Every link is distinguishable from text at rest (accent text with an underline), without hovering.
- [ ] Every record named on the page (run, project, artifact, ticket) is an `EntityLink`; IDs are `mono`.
- [ ] Every clickable table row has an `EntityLink` in its name cell; no row is clickable without a link.
- [ ] Downloads are `FileCard` (or `Button`) actions, never plain text.
- [ ] Icons are `AppIcon`s: no unicode glyphs (→ ✕ ✓ ⌄), emoji or second icon set.

## Components
- [ ] No hand-rolled shell, top bar, nav, modal, menu, tooltip, tabs, table, chart, toast, chat, page header, key/value list or transcript.
- [ ] No third-party UI kit or chart library alongside quiet.
- [ ] Destructive actions follow the reversibility table (`toast()` + Undo → Dialog → Approval/HoldButton).
- [ ] Toasts are for the user's own actions and the notifications pane for system events; one `Toaster` per app.
- [ ] Links route through `linkComponent`.
- [ ] Status colour comes from `variant`/`status` props or `--q-status-*`, never a raw hue.
- [ ] Loading, empty, filtered-empty and error states all exist and match `patterns-states--default`.

## Content
- [ ] It uses sentence case, verb-first buttons that name the object, and no "OK/Submit".
- [ ] There are no banned words (AI-powered, seamless, leverage, …), no exclamation marks and no emoji.
- [ ] Numbers, dates and money are locale-formatted and tabular where compared.
- [ ] Errors say what happened and what to do next.

## Accessibility
- [ ] `document.title` is set, with one `<main>` and named navs when there are several.
- [ ] There is one `h1` even where the screen shows only the TopBar (chat, a full-bleed tool).
- [ ] Every field is labelled; icon-only buttons are named; pane toggles carry `aria-expanded` and `aria-controls`.
- [ ] The whole flow works by keyboard and focus is always visible.
- [ ] axe is clean apart from the two accepted contrast exceptions (which never apply to app text).
