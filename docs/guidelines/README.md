# Building SaaS apps with quiet

These guidelines cover how to put quiet's components together into product screens that look like
one product. The visual rules come from the Optimus Foundry reference
([`docs/reference/optimus-design/readme.md`](../reference/optimus-design/readme.md), its
`guidelines/` cards and `ui_kits/app/`). These pages turn those rules into instructions for building app screens.

| Page | Read it when |
|---|---|
| [foundations.md](foundations.md) | choosing a colour, type size, spacing, radius, shadow or motion |
| [layout.md](layout.md) | starting a screen: shell, page anatomy, widths, grid, mobile |
| [patterns.md](patterns.md) | building a dashboard, table, settings, billing, an agent or chat feature |
| [components.md](components.md) | you need something and want to know which component it is |
| [content.md](content.md) | writing a label, button, empty state or error |
| [accessibility.md](accessibility.md) | wiring a page: what quiet does for you, what you still own |
| [checklist.md](checklist.md) | reviewing a screen before it ships |

Reference screens live in Storybook under **Patterns** (`npm run dev` → :6020): `patterns-app-shell--default`,
`patterns-dashboard--default`, `patterns-records--default`, `patterns-settings--default`,
`patterns-billing--default`, `patterns-assistant--default`, `patterns-states--default`. Copy their
structure; change the content.

## Setup in one breath

Install a tagged release from git (`npm install "git+https://github.com/OptimusFoundry/quiet.git#vX.Y.Z"`;
never a branch), import `@optimusfoundry/quiet/style.css` and, for the foundry fonts, `fonts.css`.
Wrap the app in `ThemeProvider` (theme on `<html>`, `linkComponent` for your router) and
`QuietRoot density="app"`, mount one `Toaster`, and register a product theme with `defineThemes` if
the product has one. Details: the package [README](../../README.md) and the `quiet-app` skill.

## quiet in ten rules

1. **Density first.** Products render inside `<QuietRoot density="app">` (or `compact` for dense
   admin/inspectors). Never mix densities on one surface, never carry marketing spacing into an app.
2. **Ink and greys do the work.** Paper 70 · Paper-2 20 · Ink 9 · Molten 1. Use only `--q-*`
   tokens, never raw colours.
3. **Molten is punctuation.** The page-title period, one status dot, a warning mark, the human step.
   It is never a fill, a button or a section. Charts are the one exception: there, molten is the
   primary series.
4. **Status comes from the theme.** Use the components' `variant`/`status` props and the
   `--q-status-*` tokens, never a raw colour. In foundry there is no green or red: done = ink + ✓,
   attention/warning/error = molten (hollow dot, hairline, `!`), info = soft hairline + i. A product
   theme may set real status hues; screens don't change.
5. **One page title per screen.** `PageHero size="md"` with a molten period. Sections use
   `SectionHeader size="sm"`. Use only the eight type roles: page-title 40, section-title 24, card-title 17,
   metric 40, body-lg 17, body 15, small 13, mono label 11.
6. **Spacing by job.** Use `--q-space-inline / stack / field / card-pad / card-gap / block / section`
   and `--q-grid-gutter`. Never 12, 20 or 28 px between blocks.
7. **Fixed widths, 12-column grid.** Sidebar 240 · settings nav 200 · list pane 360 · detail 400 ·
   form 640 · content 1040. Spans 3 · 4 · 6 · 8 · 9 · 12 only.
8. **One control size per screen.** In apps every control is `size="sm"`.
9. **Hairlines before shadows.** 1px `--q-border` dividers and card edges. Shadows only on floating
   surfaces (menus, popovers, toasts, dialogs). Never radius 0 on a container.
10. **Use the component, never re-implement it.** Modals, menus, tables, charts, toasts, chat and agent
    UI already exist with keyboard and ARIA built in. Motion stays slow and soft and never bounces,
    with one moving thing per surface.

Product identity comes from a **theme**, not a new design system: one engine (quiet), one theme per
product (`themes/_<name>.scss`). The theme can change the palette, accent, type, shape and density; the
rules above stay the same.
