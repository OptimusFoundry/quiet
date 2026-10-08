# App UI kit — SaaS templates

Start every new SaaS screen from one of these. All three use `data-density="app"`, the 12-column grid, and only the type roles and spacing jobs from `tokens/layout.css`.

- `AppShell.jsx` — 240 sidebar + 64 top bar (breadcrumb, ⌘K search, account menu) + scrolling main. Includes CommandPalette and GridOverlay (Ctrl/⌘+G).
- `dashboard.html` — PageHero md → Alert → 4 × StatCard (span 3) → Table (span 8) + activity List (span 4).
- `list-detail.html` — 360 list pane (search, FilterTabs, selectable List) + detail (PageHero md, Tabs, PageTransition, StatCards span 4, DataGrid, settings form at 640).
- `settings.html` — 200 sticky section nav + 640 form column; sections separated by --space-section; Switch rows on hairlines; danger zone in a molten hairline box with a confirm Dialog.

Rules: every control is size="sm" (buttons, fields, tabs, lists, tables, badges, avatars) — never mix sizes on a screen; one page title per screen; section heads use SectionHeader size="sm"; never exceed --w-content for reading content.
