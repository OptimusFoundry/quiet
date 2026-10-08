# Optimus Foundry Design System — Soft

A rounder, softer variant of the Optimus Foundry system. Same palette logic, type and voice; corners, edges, elevation and motion are softened. See **Soft variant changes** below.

**Optimus Foundry** is a small, independent software studio (Ottawa, est. MMXXVI) that casts software for the Mac, the iPhone, and the open browser — full-stack apps, iOS apps, backends, agentic workflows, and design systems. The brand metaphor is a metal foundry: heavy, deliberate, finished objects. Products named on the site: Anvil, Bellows, Cinder, Plinth, Quench, Forge, Sjocamp, Meerkat, TickUpToks.

**Sources** (public pages, read Oct 2026 — no source code or Figma access):
- https://optimusfoundry.com/brand — Brand Identity v1.0 (mark, wordmark, palette, type, motion, voice, rules)
- https://optimusfoundry.com/ — home page (copy, structure)
- The brand page says the full manual lives in the repo's `docs/` folder and the mark in `src/components/FoundryMark.astro` — not accessed.

## Index
- `styles.css` — entry point (imports only) → `tokens/` fonts, colors, typography, spacing, motion, base
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Motion, Brand, Voice)
- `components/index.html` — master page: every component and state on one page
- `components/` — React primitives, each with `.jsx`, `.d.ts`, `.prompt.md`, plus one card per folder
  - core: Icon, Spinner, Button, ButtonGroup, ArrowLink, Link, Eyebrow, Headline, Text, Tag, Badge, Avatar, StatusDot, Skeleton, Wordmark, Rule
  - forms: Label, FormHint, FormField, Input, TextField, TextArea, Select, Dropdown, MultiSelect, Checkbox, Radio, Switch, Slider, Stepper, DatePicker, FileUpload
  - display: Card, Stat, ProcessStep, Accordion
  - data: StatCard, EmptyState, FilterTabs, List, Table, DataGrid
  - navigation: Tabs, NavBar, Breadcrumb, Pagination, StepIndicator, Sidebar, CommandPalette
  - feedback: Dialog (Modal), Toast, Tooltip, Alert, Banner, Progress
  - overlays: Drawer, Popover, DropdownMenu
  - layout: Container, Col, GridOverlay, Stack, Grid, AspectRatio, PageHero, SectionHeader, PageShell, PageTransition
- `ui_kits/website/` — interactive recreation of the home page
- `ui_kits/app/` — SaaS templates: dashboard, list + detail, settings (app density, 12-col)
- `ds-loader.js` — dev helper: uses the compiled bundle, or compiles `components/*.jsx` in-browser
- `SKILL.md` — Agent Skill entry

**Parity with ui.protoapp.xyz (Oct 2026):** every proto design-system component has an Optimus Foundry equivalent, restyled to the brand. Mappings: Modal → Dialog · Navbar → NavBar · Divider → Rule · LinkButton → Button with href · DataTable → DataGrid · Primitives/Input → TextField (Input kept for simple cases). Not carried over: ThemeSwitcherGrid (the brand has no dark theme) and BannerCenter (use one Banner at a time).

**Status language** (the brand defines no semantic colors): info = soft hairline + i · success = ink + ✓ · warning = molten hollow dot / molten ! · error = molten hairline + molten !. Molten is still never a fill.

**Intentional additions:** the brand page defines no component library, so the component set above is a standard set authored to the brand rules. Eyebrow, Headline, StatusDot, Stat, ProcessStep encode patterns seen on the site.

## Soft variant changes
- Radius scale added (`tokens/spacing.css`); every container, field, menu and overlay now uses it.
- Floating surfaces (Dialog, Drawer, Popover, DropdownMenu, Dropdown/MultiSelect/DatePicker panels, CommandPalette, Toast): ink border → soft hairline + shadow. Menu items are inset with rounded highlights.
- Fields gain a soft focus ring (`--ring-focus`); Tabs `enclosed` is a segmented control; Stepper and DataGrid search are pills; Progress and Slider tracks are rounded.
- Ink lifted #0B0B0C → #1B1B1F, ink-2 #2A2A2E → #36363C, softer rules; card hover uses `--rule-strong` instead of ink.
- Hover easing linear → `--ease-soft`; display tracking −0.045 → −0.035em.

## Content fundamentals
- **Say the literal thing.** Confident, quiet, technical, honest. Active voice. Short sentences, often in clusters of three.
- **One foundry verb per paragraph:** cast, forge, temper, stamp. ("We cast our own SaaS and mobile apps.")
- **We / you.** The studio speaks as "we"; the reader is "you". No exclamation marks.
- **Name real things.** "Go, Postgres, and Kafka on one AWS account." not "a robust, scalable platform".
- **Be honest about status.** "Sjocamp is live. Meerkat and TickUpToks are prototypes."
- **Banned:** AI-powered, AI-native, next-generation, seamless, delightful, empower, leverage, utilize, scalable, solutions, game-changer, stay tuned. (Note: the live home page still says "AI-native" — the brand page bans it.)
- **Casing:** sentence case for headlines and buttons; mono labels in ALL CAPS. Brand name in running copy: "Optimus Foundry"; as wordmark: OPTIMUS FOUNDRY.
- **Headlines end with a period**, with one italic phrase: "Heavy software, *quietly made*." "Five metals. *One forge.*"
- **Roman numerals** for years (MMXXVI) and process steps (i–iv); serials like "01 / 14", "01 The studio".
- **No emoji.** (One exception on the live site: a 🇨🇦 flag in the footer — excluded here.)

## Visual foundations
- **Color:** white ground (`--paper`), neutral-cool greys, a lifted near-black `--ink` (#1B1B1F), plus `--rule-strong` for hover edges. One accent, `--molten` #E0531A — used only as punctuation: the headline full stop, one italic phrase, a status dot, the process rail. Never a fill, never a button, never a section. Ratio ≈ Paper 70 · Paper-2 20 · Ink 9 · Molten 1.
- **Type:** Inter Tight for everything (700 display at −0.045em; 600 for H3/H4; 400 body 15–19px), italic of the same weight for emphasis. JetBrains Mono 10–12px caps +0.08em for eyebrows, serials, metadata. No serif.
- **Backgrounds:** flat white; alternate sections in `--paper-2` between 1px rules. **No dark sections.** No images, textures, or patterns. **The only gradient** is a soft radial molten glow behind the hero mark.
- **Borders:** 1px hairlines everywhere — `--ink` for section tops and emphasis, `--rule-soft` for dividers and card edges. Hairlines before any shadow.
- **Shadows:** soft and low, only on floating surfaces — `--shadow-1` (selected segment), `--shadow-2` (popovers, menus, toasts, card hover), `--shadow-3` (dialogs, drawers, palette). Never on text, never on the mark. Floating surfaces use a soft hairline + shadow instead of an ink border.
- **Corners:** soft, scaled to the surface — `--radius-xs` 6 (checkboxes) · `sm` 10 (tooltips, menu/nav items) · `md` 14 (inputs, alerts) · `lg` 20 (cards, tables, popovers, toasts) · `xl` 28 (dialogs, drawers) · `pill` 999 (buttons, tags, switches, dots, progress). Never 0 on a container.
- **Spacing:** strict 8px grid (`--space-1`…`--space-20`). Sections breathe — 128px vertical padding is typical; 32px gutters; 1280px max.
- **Cards:** white, `--radius-lg`, 1px soft border, 32px padding, mono eyebrow, 600 title with italic accent, mono meta row under a hairline. Hover: border goes `--rule-strong` and lifts to `--shadow-2`.
- **Hover states:** 0.22s `--ease-soft` (ease-out). Links and ghost buttons turn molten; primary buttons lighten ink → ink-2; secondary gain paper-2; arrows nudge 4px right. **Press:** no shrink, no bounce.
- **Motion:** slow, ease-out or ease-in-out, never a bounce. One moving thing per surface. Nothing scroll-triggered. Ambient loops in seconds (forge mark 6s, heat pass 10s). Reduced motion stops every loop at its finished state.
- **Transparency/blur:** only the dialog scrim (ink at 24%). No glassmorphism.
- **Layout:** sticky header with soft bottom rule; two-column section heads (eyebrow + headline left, intro right); hairline-separated lists.
- **Imagery:** the site uses none; the mark and type carry the brand.

## Layout & density — rules for agents
Tokens: `tokens/layout.css`. Specimens: `guidelines/layout-grid`, `density`, `type-roles`, `rhythm`, `spacing-jobs`. Templates: `ui_kits/app/`.

**1. Pick a density first.** Set `data-density` on the page root. `marketing` = the website. `app` = dashboards, settings, detail pages. `compact` = dense tables, inspectors, admin. Never mix modes on one surface, and never carry marketing spacing into an app.

**2. Spacing by job.** Use the job tokens, not raw steps:
| Job | token | marketing | app | compact |
|---|---|---|---|---|
| Icon ↔ label, chip ↔ chip | --space-inline | 8 | 8 | 8 |
| Inside a card | --space-stack | 16 | 16 | 8 |
| Field ↔ field | --space-field | 24 | 24 | 16 |
| Card padding | --space-card-pad | 32 | 24 | 16 |
| Card ↔ card | --space-card-gap | 32 | 24 | 16 |
| Block ↔ block | --space-block | 64 | 32 | 24 |
| Section padding | --space-section | 128 | 48 | 32 |
| Grid gutter | --grid-gutter | 32 | 24 | 16 |
Never use 12, 20 or 28 between blocks. Inside controls, 4px steps are fine (e.g. 12px input padding).

**3. Type by role.** `font: var(--role-*)`, plus `letter-spacing: var(--role-*-tracking)` where defined.
| Role | size / line | weight | use |
|---|---|---|---|
| page-title | 40 / 40 | 700 | one per page, ends with molten period |
| section-title | 24 / 32 | 600 | block headings |
| card-title | 17 / 24 | 600 | cards, list headers, dialog sections |
| metric | 40 / 40 | 700 | StatCard values, tabular |
| body-lg | 17 / 28 | 400 | marketing body, app intros |
| body | 15 / 24 | 400 | default app text |
| small | 13 / 20 | 400 | secondary lines, compact tables, help |
| label | 11 / 16 mono caps | 400 | eyebrows, table headers, metadata |
No other sizes on app surfaces. Marketing adds display (clamp 56–128) and hero (68).

**4. 4px rhythm.** Every line height and control height is a multiple of 4. Controls are 32 / 40 / 48, fields 36 / 48 / 56, rows 32 (compact) / 48. This is not a strict baseline grid; text and controls just share the 4px unit.

**5. 12-column grid.** `<Grid columns={12} gap="var(--grid-gutter)">` + `<Col span>`. Allowed spans on app pages: 3 · 4 · 6 · 8 · 9 · 12. Section heads: 5 + 6 (the right side starts at column 7). Grid measures its own width: under 720px every Col spans 12; at 720–960px spans under 4 become 6 (override with spanMd / spanSm). Toggle `<GridOverlay />` with Ctrl/⌘+G to check alignment.

**6. Fixed widths** (don't invent new ones): sidebar 240 (collapsed 64) · settings nav 200 · list pane 360 · detail panel 400 · form/prose 640 · app content 1040 · site max 1280 · top bar 64.

**7. Templates first.** For a new SaaS screen, start from `ui_kits/app/`: `dashboard.html` (sidebar + 12-col blocks), `list-detail.html` (360 list + flexible detail), `settings.html` (200 nav + 640 form). Copy the shell; change the content.

## Iconography
- No icon font or SVG icon set. The site uses **unicode glyphs** as icons: → (navigate/CTA), ↘ (expand / in-page), ↓ (select), × (close), ✓ (check), · (separator), / (serial divider).
- **The O·F mark:** a heavy ring winding into an F, molten core, 14° arm cuts, `currentColor` ink. **Not included** — the SVG could not be retrieved, and it must not be redrawn. Components render the typeset wordmark only; the hero shows a dashed placeholder.
- Mark rules: never recolor the core, never outline, never rotate/skew, never add effects. Sizes 16–96px+.
- If an icon set is ever needed, choose a thin, geometric stroke set (e.g. Lucide at 1.5px) and flag it — none is defined by the brand.

## Fonts
Inter Tight and JetBrains Mono are the brand fonts and are loaded from Google Fonts (`tokens/fonts.css`). No local font files are shipped.
