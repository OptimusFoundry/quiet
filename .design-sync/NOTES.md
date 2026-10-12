# design-sync notes — quiet → Claude Design ("Optimus Foundry quiet")

## Where it lives now (2026-10-11)
- [GENERAL] The design system moved from the Claude Design project (`projectId` in config.json,
  `cabd6750-…`) to a **Design System artifact**: https://claude.ai/artifact/LrmcBHre7a1pe4qhs3FCvT
  (namespace `Quiet`). The project is the old target; sync to the artifact.
- Artifact layout (not the converter's): everything under `project/`. One flat folder per component,
  `project/components/<Name>/{preview.html, preview.js, README.md, <Name>.d.ts}`, with no group dirs.
  Also `components/bundle.{js,css}` (from `_ds_bundle.*`), `components/index.d.ts`, `fonts/`,
  `guidelines/`, `README.md` and `design-system.json` (the index).
- **How to sync:** the `sync-design-artifact` skill (`.claude/skills/`) with `scripts/design-artifact.mjs`.
  It uploads only the files that changed and refuses to push over edits made in Claude Design. The steps
  below are what `pack` does.
- Mapping from `ds-bundle/`:
  - `<Name>.prompt.md` becomes `README.md`.
  - `<Name>.html` becomes `preview.html` + `preview.js`: the card script moves to `./preview.js`,
    fonts link `../../fonts/fonts.css`, and the first line is the marker
    `<!-- @dsCard group="…" height=N [width=W] -->`, with N the measured height.
  - Project `README.md` = `conventions.md` + `---` + the bundle README.
- Upload with the Artifact tool, `url` = the artifact, `root` = the local `dsart/` dir, ≤256 files per
  publish. `.d.ts` needs `contentType: "text/plain"`. Write `project/design-system.json` last:
  keep every key and change only `lastChange`.
- The artifact's markdown renderer splits a list item that wraps onto an indented next line;
  `pack` joins wrapped bullets in the project README.
- Leftovers from the migration (`project/archived/`, `project/components/<group>/<Name>/*.jsx`) were
  left as they were.

## Setup
- [GENERAL] **Shape is `package`, not `storybook`**, though `.storybook/` exists: quiet's stories are not
  per-component (reference components live in one generated Catalog story; future/chat/charts are
  one story file per set), so the storybook shape lists only ~10 components and drops the rest.
  Every component gets an authored preview in `.design-sync/previews/` instead, graded absolute.
- Build: `npm run build` (writes `dist/`), then the converter with `--node-modules ./node_modules
  --entry ./dist/index.js` (the repo is the package; `node_modules/@optimusfoundry/quiet` doesn't exist).
- [GENERAL] `cfg.provider` = `QuietRoot density="app"`: every preview and every design renders in the
  **app look** (molten brand accent, Geist, surfaces). The marketing look is not what designs use.
- [GENERAL] Fonts ship from `.design-sync/fonts/` (Geist, Geist Mono, Inter Tight, JetBrains Mono —
  OFL, latin + latin-ext, fetched from Google Fonts). quiet's own `fonts.css` is a remote @import
  the converter can't ship. If the font stack in `src/styles/tokens/_typography.scss` changes,
  refresh these files.
- Regrouping: `docsMap` points shared-file exports (ChartLegend, SidebarTrigger, TabPanel, …) at
  `.design-sync/groups/<group>.md` category stubs; QuietRoot/ThemeProvider go to `setup`.
- `dtsPropsFor` hand-types `columns` (Table, DataGrid, StreamingTable), `Stack.justify` and
  `RunScrubber.actions`, which ts-morph flattened to `unknown`. Refresh them if those APIs change.

- [GENERAL] Capture with reduced motion: charts draw their lines in over 0.9s on mount, and
  `package-capture.mjs` screenshots right after fonts load, so lines were caught half-drawn. The staged
  copy is patched to `browser.newPage({ ..., reducedMotion: 'reduce' })` (quiet skips the draw-in then).
  **Re-apply after re-copying `.ds-sync/`** (it's regenerated from the skill each sync) — until the skill
  ships it. Cards in Claude Design animate normally.

## Authoring previews
- Import from `"@optimusfoundry/quiet"`; the provider already wraps in QuietRoot (app density) — never
  add another QuietRoot unless showing a theme.
- [GENERAL] Icons: pass `<Icon name="plus" />` etc. (names: arrow-right/left/up/down, expand, external,
  close, check, plus, minus, dot, more, slash, command, enter, info, warning, help, first, last, sort,
  prev, next). A bare string glyph in `leftIcon`/`icon` sits flush against the label.
- [GENERAL] Overlays that open `position: fixed` (Dialog, Drawer, CommandPalette, open menus):
  `cardMode: "single"` + a viewport, AND wrap the preview in a `<div style={{ minHeight: 480 }}>` —
  the card's containing box is only as tall as its content, so the dialog centres in a 64px band
  and clips at the top without it.
- Wide data (Table, DataGrid) and any cell wider than a grid cell (~300px: button rows, size sweeps,
  navbars): `cardMode: "column"` — validate flags these as `[GRID_OVERFLOW] wide`.
- [GENERAL] Menus that open by click (Dropdown, MultiSelect, DatePicker) have no `open` prop: open them
  by clicking the trigger via `ref` in a `useEffect`. They're `position: absolute`, so no cardMode — just
  a `minHeight` wrapper, and if it's a grid, `alignContent: "start"` (else the menu lands at the bottom).
- [GENERAL] Column cells clip past ~820px (900px capture viewport minus cell padding): keep column-cell
  wrappers at 820px or less and use `minmax(0, 1fr)` grid tracks.
- ThemeProvider writes the theme onto `<html>` (one page for all cells): keep it light in previews and
  show dark as a scoped `<QuietRoot theme="foundry-dark">`.
- [GENERAL] Width wrappers need an explicit `width`, not `maxWidth` — the card container shrink-wraps.
- [GENERAL] Things that move focus when they open (Drawer, Popover) show a keyboard focus ring in the
  card: blur `document.activeElement` ~50ms after mount. `.click()` on a DropdownMenu trigger counts as a
  keyboard open (focuses the first item) — dispatch a click with `detail: 1` instead.
- Tooltip opens on `mouseover` dispatched on `.q-tooltip`; Toaster shows `toast()` calls with
  `duration={0}`; CommandPalette has no query prop — type into its input from a `useEffect`.
- SidebarProvider/Trigger: force drawer mode with `breakpoint={100000}`; force the desktop column with
  `breakpoint={320}` (single cards are ~760px, under the default 720 + chrome).
- Ghost buttons have `padding: 0` by design; inside attached/vertical ButtonGroups use secondary sm.
- Stepper's `label` is aria-only — pair it with `<Label htmlFor>` in previews.
- Rule `tone="ink"` looks like soft in the app look (deliberate, surfaces before rules) — don't show it.
- Realistic agentworks content (runs, artifacts, projects, triggers like `web-message`, runners
  Orca/Headless, costs like `$0.902049`), never foo/test.

- The capture freezes the clock (`page.clock.setFixedTime`): mid-progress states driven by
  requestAnimationFrame (HonestButton running, HoldButton filling) can't be shown in a still; previews
  show rest and done states. Dates render as 2024-05-15.
- ScopeGrant shows Grant/Update/Revoke only when `onGrant`/`onRevoke` are passed; its footer reads
  "can't <short>", so `short` is a verb phrase ("change billing").
- UncertaintyCell is a cell: always preview it inside a Table.

## Findings for quiet itself (not sync issues)
- Dialog titles show the molten full stop in the app look; app titles should have none
  (`--q-period-display: none` isn't read by Dialog). Fixed in wave 2.
- Fixed in quiet during the sync, wave 2: the molten full stop on Dialog/Drawer/EmptyState titles now
  follows `--q-period-display` (none in the app look); DataGrid honours `selected`/`defaultSelected`;
  Headline `after` renders nodes; Tabs/Breadcrumb lg is a step up in the app look; NavBar marks the
  current page.
- Open (app-look gaps, components not yet retuned): CommandPalette group labels and Tag/MultiSelect
  mono caps; Tag selected and MultiSelect checks in ink, not the accent.
- Fixed in quiet, wave 3: Attachment names unknown kinds by their extension ("LOG"), not the MIME subtype.
- Fixed in quiet, wave 4: UncertaintyCell no longer blanks a measured cell with a custom `format`;
  EntityLink/PageHeader doc comments match the rendering.
- Open: charts render a bare 0–1 axis for empty data (no `q-chart__empty` message); ConsensusSlider marker
  labels overlap when two values are within ~25px.
- Open: StepIndicator mono roman numerals ii/iii read as "11"/"111" at sm/md; Toaster stacks toasts of
  different widths; NavBar `cta` defaults to "Start a project" (no way to show none); Sidebar items
  without an icon keep the icon gap.
- Fixed in quiet during the sync (app look only): Tag left padding, Label lg size, Headline h2/display
  on the app scale, Stepper natural width in a FormField, MultiSelect/DatePicker/FileUpload labels in
  the app's sans label role, Link `underline="none"`. Previews that dropped a cell because of these
  (Label Sizes, Link underline none) can add it back on a re-sync.

## Known render warns
- none open (GridOverlay's card uses `primaryStory: "Visible"` — its other cell is a faint tint that
  trips `[RENDER_BLANK]`).

## Re-sync risks
- `.ds-sync/package-capture.mjs` reduced-motion patch is lost when `.ds-sync/` is re-copied — re-apply
  it (see Setup) or chart line cells grade half-drawn.
- `dtsPropsFor` (Table/DataGrid/StreamingTable `columns`, `Stack.justify`, `RunScrubber.actions`) is a
  hand copy of the props: it goes stale when those APIs change (their JSDoc is also dropped).
- Fonts are copied into `.design-sync/fonts/` (fetched 2026-10-11 from Google Fonts); a font-stack
  change in `_typography.scss` needs them refreshed.
- Previews dropped cells for quiet bugs since fixed (Label Sizes, Link underline="none", LineChart
  Empty) — add them back; and the open app-look gaps (CommandPalette/Tag mono caps, Tag/MultiSelect
  ink selection, StepIndicator numerals, chart empty state, ConsensusSlider label overlap) will change
  cards when fixed.
- Previews use realistic but invented agentworks data inline; nothing is fetched.
- Toolchain at sync: node 25.2.1, storybook-free package shape, playwright chromium from `.ds-sync/`.
