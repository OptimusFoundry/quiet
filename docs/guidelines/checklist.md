# Screen review checklist

Run this on every new or changed screen, in **foundry and foundry-dark**, at 1280 and at 390 wide. The
visual-reviewer agent (`.claude/agents/`) uses this list. Every item should be a yes.

## Structure
- [ ] It starts from a template (shell, dashboard, list-detail, settings, billing, assistant, states).
- [ ] There's one density (`app`, or `compact` for dense admin) and nothing marketing-sized on the page.
- [ ] There's one page title (`PageHero size="md"`, `h1`) ending in the molten period.
- [ ] Blocks open with `SectionHeader size="sm"` and the heading order is unbroken.
- [ ] Content sits on the 12-column grid with spans 3/4/6/8/9/12 and fixed widths (240/200/360/400/640/1040).
- [ ] Reading text ≤ 1040 and forms ≤ 640.

## Colour
- [ ] There are no raw colours. Everything is a `--q-*` token.
- [ ] Molten appears only as punctuation: the title period, one status mark, warnings or errors. Charts are the exception (series 1).
- [ ] There's no molten fill, button or section, and no second accent.
- [ ] There's no green or red. Done is ink + ✓, and attention is molten with words.
- [ ] Text people must read is `--q-fg-muted` or darker, and `--q-fg-subtle` is used only for decoration.
- [ ] It looks right in dark mode, with no light-only values.

## Type and spacing
- [ ] It uses only the eight type roles (40 / 24 / 17 / 40 metric / 17 / 15 / 13 / 11 mono).
- [ ] Mono caps are used for labels and metadata only.
- [ ] Spacing uses the job tokens, with no 12/20/28 px gaps between blocks.
- [ ] Every control is `size="sm"`, with no mixed sizes.

## Surfaces and motion
- [ ] Hairlines are used before shadows, and shadows appear only on floating surfaces.
- [ ] Radii follow the surface (fields 14, cards/tables 20, dialogs 28, controls pill), with no square containers.
- [ ] One moving thing per surface: no bounce, no ambient loops, no scroll-triggered motion.

## Components
- [ ] No hand-rolled modal, menu, tooltip, tabs, table, chart, toast or chat UI.
- [ ] No third-party UI kit or chart library alongside quiet.
- [ ] Destructive actions follow the reversibility table (Toast + Undo → Dialog → Approval/HoldButton).
- [ ] Toasts are for the user's own actions and the notification centre for system events.
- [ ] Loading, empty, filtered-empty and error states all exist and match `patterns-states--default`.

## Content
- [ ] It uses sentence case, verb-first buttons that name the object, and no "OK/Submit".
- [ ] There are no banned words (AI-powered, seamless, leverage, …), no exclamation marks and no emoji.
- [ ] Numbers, dates and money are locale-formatted and tabular where compared.
- [ ] Errors say what happened and what to do next.

## Accessibility
- [ ] `document.title` is set, with one `<main>` and named navs when there are several.
- [ ] Every field is labelled and icon-only buttons are named.
- [ ] The whole flow works by keyboard and focus is always visible.
- [ ] axe is clean apart from the two accepted contrast exceptions.
