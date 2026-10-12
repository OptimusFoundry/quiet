# Proto → quiet migration map

Audited 2026-10-12 against Proto `1.0.0` (`../proto-design-system`) and quiet `0.8.1` + `feat/api-gaps`.
Replaces [props-comparison.md](props-comparison.md), which describes quiet 0.1.0.

quiet keeps its own API: it doesn't take aliases for Proto names. A screen move translates names,
props and composition using this map.

## Names

| Proto | quiet | Note |
|---|---|---|
| `Modal` | `Dialog` | `isOpen` → `open`, `footer` → `actions`, `showCloseButton` → `showClose` |
| `Divider` | `Rule` | `children` → `label` |
| `GridItem` / `Grid.Item` | `Col` | `span={{ base, md, lg }}` → `spanSm` / `spanMd` / `span` |
| `LinkButton` | `Button href` | |
| `DataTable` | `Table` (or `DataGrid`) | `getRowKey` → `rowKey`, `density` → `size`, `loadingRowCount` → `loadingRows` |
| `Input` | `TextField` | quiet's `Input` is a labelled field, not a bare box |
| `Navbar` | `AppShell` + `TopBar` | quiet `NavBar` is a fixed marketing header |
| `Sidebar*` compound | `Sidebar` `items` / `groups` | inside `AppShell` |
| `Dropdown` (with `trigger`, `danger`) | `DropdownMenu` | an action menu; `Popover` + `DropdownMenu` become one `DropdownMenu trigger` |
| `Dropdown` (picking a value) | `Dropdown` | `items` `{id}` → `options` `{value}` |
| `Toast` + `ToastContainer` | `toast()` + one `Toaster` | |
| `BannerCenterProvider` / `useBannerCenter` | `toast()` via an app `useNotify()` | quiet shows one `Banner` at a time |
| `StatCard` (number + label only) | `Stat` | |
| `PageHero` (app routes) | `PageHeader` | `PageHero` is the marketing hero |
| `SectionHeader`, `Card variant/padding` (as a container) | `Panel` | `Card` is a clickable work card |
| `ThemeSwitcherGrid` | none | build in the app |

## Props that changed name or shape

- **Booleans drop `is`:** `isLoading` → `loading`, `isFullWidth` → `fullWidth`, `isAttached` → `attached`, `isOpen` → `open`.
- **Errors:** `isError` + `errorMessage` → one `error` (`true` for the edge only; a node renders the message).
- **Value callbacks:** Checkbox, Switch, Radio, Slider, Stepper, Dropdown, MultiSelect, DatePicker and Tabs call `onChange(value)`, not `onChange(event)`. Native text controls (TextField, TextArea, Select, Input) keep the event.
- **Radio** is the whole group: `<Radio name options={[…]} value onChange />`, not one input per option.
- **Tabs:** `activeTab` / `defaultTab` / `onTabChange` → `value` / `defaultValue` / `onChange`; compound `TabList`/`Tab`/`TabPanels` → `tabs[]` + `panels`.
- **Pagination:** `totalPages` → `total`, `onPageChange` → `onChange`.
- **DatePicker:** `minDate` / `maxDate` / `firstDayOfWeek` / `formatDate` → `min` / `max` / `weekStartsOn` / `format`.
- **Accordion:** `onExpandedChange` → `onChange`.
- **MultiSelect:** `items` `{id}` + `Set<string>` → `options` `{value}` + `string[]`.
- **DataGrid columns:** `{ id, cell, sortFn }` → `{ key, render, sortValue }`; `getRowId` → `rowKey`; `selectedIds: Set` → `selected: Key[]`; `pagination={false}` → `pageSize={0}`.
- **StatCard:** `numericValue` + `formatValue` → `value` + `animate` + `format`; `trendValue` → `delta`; `description` → `period`.
- **Tag:** `variant` → `tone` (`ink`) or `status`; `onSelectChange` → `onSelect`; `leftIcon` → `icon`; `removable` is implied by `onRemove`.
- **Avatar:** `variant` → `shape`; `initials` → derived from `name`.
- **Spinner:** `variant` → `tone`. Its `label` is **visible** text; for a hidden name pass `aria-label`.
- **Link:** `underlineOnHover` → `underline="hover" | "always" | "none"`; a router link comes from `QuietRoot linkComponent`, not a per-link `LinkComponent`.
- **PageTransition:** `pageKey` → `transitionKey`, `type` → `variant`; `duration` is in **ms**, not seconds.
- **Icon:** a Lucide component → `AppIcon name` (or `Icon name`).

## Silent traps (no type error)

- **Gap scale is one step larger.** Proto `xs/sm/md/lg/xl/2xl` = 4/8/16/24/32/48px; quiet = 8/16/24/32/48/64px. Proto `gap="md"` is quiet `gap="sm"`. Shift every explicit gap name down one step.
- **Grid `columns="3"`:** quiet reads a string as a raw `grid-template-columns`. Pass a number: `columns={3}`.
- **`className` on form controls** lands on the native `<input>`/`<select>`/`<textarea>`; `style` goes on the wrapper.
- **Changed defaults:** Slider `showValue` is on, FileUpload `multiple` is on, TextArea with `maxLength` shows a counter, Container's default size is `xl`.

## What quiet adds that Proto lacked

- Form widgets submit with a native `<form>` (`name`, `form`, `required`) and work with react-hook-form `Controller` (`onBlur`, a focusable `ref`, rest attributes on the control).
- `FormField` wires `id`, label, `aria-describedby`, `aria-invalid` and `aria-required` into any quiet control.
- Layout reflows by container width (`Grid`, `Col spanSm/spanMd`, `Stack directionSm/directionMd`), so it works inside panes.
- Controlled `FileUpload files` (feed real upload progress and errors) and `DropdownMenu open`.
