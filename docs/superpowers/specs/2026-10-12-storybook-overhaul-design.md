# Storybook overhaul and UI kit overview

Date: 2026-10-12. Status: approved in chat.

## Why

Storybook grew by group (`Extensions/Core`, `Future/Trust`…): one story shows a dozen components,
nothing binds `component:`, there are no Docs pages or prop tables, six components have no story
(`Headline`, `FormField`, `Label`, `Drawer`, `PageTransition`, `ChartParts`) and titles are
inconsistent. It serves two audiences now: people building apps on quiet (find a component, see its
states, read its props, copy usage) and a showcase of quiet as a design system.

## Sidebar

```
Overview                 the UI kit gallery (landing page)
Foundations/*            today's Guidelines/* plus Theming
Components/<Group>/<Name>
Patterns/*               unchanged
Integration/*            router links
```

Groups, in this order: Core, Forms, Display, Data, Navigation, Feedback, Overlays, Layout, App,
Charts, Chat, Agent & trust (the `future/` folder). Order is enforced by `storySort` in
`.storybook/preview.tsx`.

## One story file per component file

`src/components/<group>/<Name>.tsx` → `src/stories/components/<group>/<Name>.stories.tsx`
(+ `<Name>.scss` when it needs layout, BEM under `q-sb-*`, plain CSS on tokens).

- `meta`: `title: "Components/<Group>/<Name>"`, `component`, `tags: ["autodocs"]`, `args` for a
  sensible default, `argTypes` only where docgen is wrong or a prop is a ReactNode/function;
  `subcomponents` for parts in the same file (`TabPanel`, `Col`, `CloseButton`…).
- Stories: `Playground` first (args/controls), then named stories for variants, sizes, states
  (disabled, loading, empty, error, long text) and one realistic composition. Each story has a
  one-line `parameters.docs.description.story` when its point isn't obvious from its name.
- Interactive demos from the old group stories (refs, controlled state, toasts) move into the
  matching component file instead of being dropped.
- Docgen: the component's JSDoc sits directly above the exported function so Docs picks it up.
  Comment-only edits to components; no API changes.

The old `src/stories/extensions/`, `future/`, `app/` component stories and root loose stories are
removed once migrated. `guidelines/` becomes `foundations/`; `patterns/` stays.

## Overview (UI kit)

A fullscreen story, `Overview` → `UI kit` (first in the sidebar, the landing page). It renders the
real components in the current toolbar theme: a header, then each group as a section of tiles.
A tile is a small live example, the name and a one-liner, and links (`target="_top"`) to the
component's Docs page. Tiles come from typed registries, one per group:
`src/stories/overview/tiles/<group>.tsx` exporting `Tile[]` (`{ name, blurb, render }`).

## Coverage guard

`scripts/check-stories.mjs`, in `npm run lint`: every PascalCase `.tsx` under `src/components/<group>/`
has `src/stories/components/<group>/<Name>.stories.tsx` and a tile named `<Name>` in
`src/stories/overview/tiles/<group>.tsx`.

## Docs and harness

Update the places that name story locations or IDs: `docs/guidelines/*` (`guidelines-*` →
`foundations-*`), AGENTS.md, the `new-component` skill, and `scripts/new-component.mjs` (which also
scaffolds the story file and tile hint).

## Done

`npm run lint && npm run typecheck && npm run build && npm run build-storybook`; every component page
renders in foundry and foundry-dark; the visual-reviewer pass on the overview and a sample of pages.
