# quiet — DESIGN.md

quiet is its own design system with one look
([docs/plans/2026-10-12-one-look.md](docs/plans/2026-10-12-one-look.md)): an inset three-pane shell
with a push inspector, soft ink, the lava accent, grounds instead of rules, Geist in sentence case,
dense pill controls, panes over drawers. How to build screens with it is in
[docs/guidelines/](docs/guidelines/README.md).

It began as a port of the Optimus Foundry "Soft" design system from Claude Design. That mirror was
removed in 1.0; the git tag `reference-archive` keeps it for history.

## What quiet is made of

- **Themes** — `foundry` and `foundry-dark` (`src/styles/themes/`), plus product themes registered
  with `defineThemes()` (see "Product themes").
- **Swappable accent** — `<QuietRoot accent="…">` replaces the brand accent for another product; the
  derived `--q-accent-fg`/`-bg`/`-subtle`/`-border` follow it.
- **Density** — `data-density` is spacing only: `comfortable` (default) or `compact`.
- **Accessibility + motion** — keyboard operation and focus management per WAI-ARIA patterns,
  visible keyboard focus, accessible names and states, and slow, soft open/close/state motion.
- **APIs apps can build on** — `ref` and rest props (core and forms today), form widgets that work with
  native forms and form libraries, controlled and uncontrolled state, container-responsive layout
  (AGENTS.md, "Component APIs").

## Status colour

Status is a tier-2 role, like `--q-fg` or `--q-border`: three tokens per status, declared in
`src/styles/tokens/_color.scss` on `:root, [data-theme]`.

| Token | Job | foundry / foundry-dark |
|---|---|---|
| `--q-status-info-fg` / `-bg` / `-border` | neutral notices | `--q-fg-muted` / `--q-bg-subtle` / `--q-bg-subtle` |
| `--q-status-success-fg` / `-bg` / `-border` | done, healthy | `--q-fg` / `--q-bg-subtle` / `--q-bg-subtle` |
| `--q-status-warning-fg` / `-bg` / `-border` | needs attention | `--q-accent-fg` / a 3% accent tint / the same tint |
| `--q-status-error-fg` / `-bg` / `-border` | failed, blocking | `--q-accent-fg` / a 3% accent tint / `--q-accent-border` |

`fg` colours glyphs, icons, fills and status text (AA as text); `bg` is a status surface; `border`
is its edge. A product theme's own status hues (in `q.themes`) win. The brand has no status hues, so the defaults are greys and the accent: info and success stay
neutral, warning and error are hot. A product theme sets real hues here.

Components read status through their own tier-3 tokens, which default to these:

| Component | Tier-3 tokens (default → `--q-status-<status>-*`) |
|---|---|
| Alert | `--q-alert-<status>-bg` → bg, `-border` → border; its status icon reads `--q-status-icon-<status>-fg` → fg |
| Banner | `--q-banner-<status>-bg` → bg, `-border` → border; its status icon reads `--q-status-icon-<status>-fg` → fg |
| Toast | success, warning and error draw the shared status icon (`--q-status-icon-<status>-fg` → fg); no border |
| Dialog | `icon="<status>"` draws the shared status icon, bare |
| Badge | `--q-badge-<status>-bg` → bg, `-border` → border, `-dot` → fg. Badge text stays `--q-fg` |
| Tag | `status` prop (quiet addition): `--q-tag-<status>-fg`, `-bg`, `-border` |
| Progress | `--q-progress-<status>-fill`, `--q-progress-error-value-fg` → fg. `heat` stays the accent |
| Icon | `color="success\|warning\|error"`: `--q-icon-<status>-fg` → fg |


## Product themes

A product defines its theme in its own repo. quiet ships `foundry` and `foundry-dark`; anything
else is registered at startup and styled by the product's CSS.

**1. Register it** before the first render:

```ts
import { defineThemes } from "@optimusfoundry/quiet";

defineThemes({
	acme: { label: "Acme", colorScheme: "light" },
	"acme-dark": { label: "Acme dark", colorScheme: "dark" },
});
```

`ThemeName` accepts any string, and the built-in names still autocomplete. `QuietRoot theme`,
`ThemeProvider`, `useTheme().setTheme` and `applyTheme` accept any registered name. An
unregistered name renders `defaultTheme` (`foundry`) instead of crashing, and warns once per name
in development. `resolveTheme(name)` and `getTheme(name)` expose the same lookup.

**2. Style it** in `@layer q.themes`, so it beats quiet's token defaults and loses to base,
component and utility rules, the same as the built-in themes:

```scss
// Repeat quiet's layer order first: it holds whichever stylesheet loads first.
@layer q.tokens, q.themes, q.base, q.components, q.utilities;

@layer q.themes {
  [data-theme="acme"] {
    --q-gray-0: #fff;          // …through --q-gray-900: all eight stops
    --q-molten-500: #4f46e5;   // the accent
    --q-shadow-rgb: 17 24 39;
    --q-status-success-fg: #15803d;
    --q-status-success-bg: #f0fdf4;
    --q-status-success-border: #bbf7d0;
    // …info, warning, error
    color-scheme: light;
  }
}
```

Unlayered, a theme would outrank all of quiet's layers instead of sitting where the built-in
themes do. Loaded before `@optimusfoundry/quiet/style.css` without the order statement, it would
create `q.themes` first and end up below `q.tokens`, so the defaults would win.
`src/stories/external-theme/` holds a working example.

**What a theme sets:**

| | Tokens |
|---|---|
| **Must** | The palette: `--q-gray-0`, `-50`, `-100`, `-200`, `-400`, `-500`, `-800`, `-900`, `--q-molten-500`, `--q-shadow-rgb`, plus `color-scheme`. foundry's palette sits on `:root`, so any stop a theme on `<html>` leaves out is foundry's |
| **Should** | `--q-status-{info,success,warning,error}-{fg,bg,border}`. Without them the theme gets the brand's grey-and-accent status mapping |
| **May** | Identity (tier 2): `--q-font-sans`/`--q-font-mono`, the `--q-text-*` scale, `--q-radius-*`, `--q-shadow-1..3`, `--q-scrim`, `--q-ring-soft`, `--q-dur-*`/`--q-ease-*`, the density job tokens. Component (tier 3): `--q-button-radius`, `--q-badge-success-bg` and the like, only where the identity needs it |

A dark theme should also restate the shadows, scrim and soft ring, as `_foundry-dark.scss` does:
the light defaults vanish on a dark ground.

**Caveats:**

- **Reduced motion.** quiet zeroes `--q-dur-*` under `prefers-reduced-motion: reduce` on `:root`
  only. A theme that sets durations must repeat the zeroing for its own selector, inside
  `@layer q.themes`.
- **Density.** The density job tokens (`--q-space-card-pad`, `--q-space-section`…) switch on
  `data-density`. A theme that sets them wins over `data-density` on the same element, and
  `QuietRoot` puts both attributes on one element. Prefer setting density per surface.
- **Fonts.** `fonts.css` loads Geist and Geist Mono from Google Fonts. A theme that sets
  `--q-font-*` loads its own font files and can skip `fonts.css`.
- **Contrast.** Check every theme for contrast: APCA for body text, with WCAG AA as the floor.
