---
name: quiet-app
description: Use when building or changing UI in an app that uses the @optimusfoundry/quiet design system — new screens, pages, forms, tables, dashboards, settings, billing, agent/AI features or chat with Claude, or reviewing a screen for consistency. Covers setup, the ten rules, which component to use, screen recipes and the review checklist.
---

# Building with quiet

quiet (`@optimusfoundry/quiet`) is the design system. Every screen is composed from its components
and `--q-*` tokens. The full guidelines ship in the package. Read the relevant one before building:

- `node_modules/@optimusfoundry/quiet/docs/guidelines/README.md`: index and the ten rules
- `.../docs/guidelines/foundations.md`: colour, type, spacing, radius, motion, density
- `.../docs/guidelines/layout.md`: app shell, page anatomy, widths, grid, mobile
- `.../docs/guidelines/patterns.md`: dashboard, tables, list-detail, settings, billing, toasts, agents, chat
- `.../docs/guidelines/components.md`: "I need… → use…"
- `.../docs/guidelines/content.md`: voice, banned words, labels, numbers
- `.../docs/guidelines/accessibility.md`: what quiet does, what the app must do
- `.../docs/guidelines/checklist.md`: review before you finish

Props live in `node_modules/@optimusfoundry/quiet/dist/components/<group>/<Name>.d.ts`.

## Setup

Install a tagged release from git (quiet is not on a registry) and pin the tag:

```bash
npm install "git+https://github.com/OptimusFoundry/quiet.git#vX.Y.Z"
```

```tsx
import "@optimusfoundry/quiet/style.css";   // tokens, themes, base, components. No fonts
import "@optimusfoundry/quiet/fonts.css";   // Inter Tight + JetBrains Mono; skip if your theme sets its own fonts
import { Link } from "@tanstack/react-router";
import { type LinkComponent, QuietRoot, ThemeProvider, Toaster } from "@optimusfoundry/quiet";

const RouterLink: LinkComponent = ({ href, ...p }) => <Link to={href} {...p} />;

<ThemeProvider defaultValue="foundry" linkComponent={RouterLink}>  {/* data-theme on <html> */}
  <QuietRoot density="app">                                        {/* products are density="app" */}
    <App />
    <Toaster position="bottom-right" max={3} />                    {/* one per app; raise with toast() */}
  </QuietRoot>
</ThemeProvider>;
```

- **Links:** every `href` quiet renders (Link, Button, Card, List, Breadcrumb, NavBar, Sidebar …) goes
  through `linkComponent`, so client routing works. External and `#hash` links stay plain `<a>`.
- **Product theme:** the product's identity is a quiet **theme**, defined in the product repo:
  `defineThemes({ acme: { label: "Acme", colorScheme: "light" } })` before the first render, plus
  `[data-theme="acme"] { … }` in `@layer q.themes` (palette, accent, `--q-status-*`). See
  `node_modules/@optimusfoundry/quiet/DESIGN.md#product-themes`. Never fork components for identity.
- **Toasts:** `toast({ title, description, status, action })` from anywhere; `toast.dismiss(id)`.

## The ten rules

1. `density="app"` (or `compact` for dense admin). One density per surface.
2. Ink and greys do the work, using only `--q-*` tokens. Paper 70 · Paper-2 20 · Ink 9 · Molten 1.
3. Molten (`--q-accent`) is punctuation: the title period, one status mark, warnings. **In charts it is the
   primary series.**
4. Status comes from the theme: `variant`/`status` props and `--q-status-*` tokens, never a raw colour. In
   foundry that means no green or red (done = ink + ✓, attention or error = molten with words); a product
   theme may set real hues in its own `@layer q.themes`.
5. One page title per screen (`PageHero size="md"`); sections use `SectionHeader size="sm"`. Use only the eight
   type roles (40 / 24 / 17 / 40 metric / 17 / 15 / 13 / 11 mono).
6. Spacing by job: `--q-space-inline/stack/field/card-pad/card-gap/block/section`, `--q-grid-gutter`.
7. 12-column grid, spans 3/4/6/8/9/12. Fixed widths: 240 sidebar · 200 settings nav · 360 list ·
   400 detail · 640 form · 1040 content.
8. Every control is `size="sm"` in apps, with no mixed sizes.
9. Hairlines before shadows. Shadows only on floating surfaces. Never radius 0 on a container.
10. Use the component; never re-implement it. Motion is slow and soft, never bounces, and only one thing
    moves per surface.

## Never

- Raw colours, raw px gaps between blocks, or custom durations.
- Hand-rolled modals, menus, popovers, tooltips, tabs, tables, toasts, charts or chat UI.
- A third-party UI kit or chart library next to quiet.
- Raw status colours (status hues belong in a theme's `--q-status-*`), or molten as a fill, button or section
  outside charts.
- A hand-rolled toast stack or mobile nav drawer: use `Toaster`/`toast()` and `Sidebar mobile="drawer"`.
- Banned words: AI-powered, AI-native, next-generation, seamless, delightful, empower, leverage, utilize,
  scalable, solutions, game-changer, stay tuned. No exclamation marks, no emoji.

If quiet lacks something, add it to quiet, or build it in the product on quiet tokens and BEM
(`.q-`-style blocks with `--q-*` tokens) and flag it.

## Screen recipes

| Screen | Recipe |
|---|---|
| Shell | `SidebarProvider` › `Sidebar mobile="drawer"` (240, Wordmark header, account footer) + 64 top bar (`SidebarTrigger`, `Breadcrumb`, Notifications `Button` → `Drawer`, Search → `CommandPalette` ⌘K, `Avatar` `DropdownMenu`) + scrolling `<main>` + one `Toaster` |
| Dashboard | `PageHero` → one `Alert`? → 4 × `StatCard` (span 3) → `LineChart`/`BarChart` (8) + `List`/`DonutChart` (4) |
| List page | `PageHero` + primary action → `FilterTabs` → `DataGrid` or `Table` → `Pagination`; `EmptyState` / `GhostFuture` |
| List + detail | 360 pane (`TextField` search, `FilterTabs`, `List`) + detail (`PageHero md`, `Tabs panels={…}` or `Tabs` + `TabPanel`, content) |
| Settings | 200 section nav + 640 form; `SectionHeader sm` per section; `Switch` rows; danger zone → `Dialog` |
| Billing | plan `Card` → `CostMeter` → `BudgetLeash` per agent → invoices `Table` |
| Destructive | reversible → do it + `toast({ action: Undo })`; irreversible small → `Dialog`; large → `Approval` + `HoldButton` |
| States | `Skeleton` (load) · `EmptyState` / `GhostFuture` (empty) · `Alert variant="error"` + retry (error) |
| Agents | `IntentBar` → `Approval` → `AgentRun` → `Receipt` / `UndoRiver`; `ScopeGrant`, `BudgetLeash`, `Checkpoints`, `DraftDiff` |
| Chat with Claude | `ChatThread` + `ChatMessage` + `ChatComposer` (`onSubmit({text, attachments})` → your API; stream into `<ChatMessage from="assistant" status="streaming">`), plus `ToolCall`, `CodeBlock`, `PromptSuggestions` |

Reference screens are the quiet Storybook **Patterns** stories (`patterns-*--default`).

## Before you finish

Go through `docs/guidelines/checklist.md` in light and dark, at desktop and phone width:
- structure: template, density, one title, grid and widths;
- colour: tokens only, molten as punctuation, no green or red;
- type and spacing roles;
- one control size;
- no re-implemented components;
- loading, empty and error states;
- copy: sentence case, verb-first buttons, no banned words;
- accessibility: `document.title`, labels, keyboard, axe.
